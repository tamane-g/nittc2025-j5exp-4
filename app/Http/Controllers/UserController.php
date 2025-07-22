<?php

namespace App\Http\Controllers;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator; // バリデーションのため追加
use Illuminate\Validation\Rule; // バリデーションルールで使用
use Inertia\Inertia; // Inertia.js のレンダリングのため追加
use Inertia\Response; // Inertia.js のレスポンス型ヒントのため追加
use League\Csv\Reader; // CSV読み込みのため追加
use Exception; // 例外処理のため追加

class UserController extends Controller
{
    /**
     * ユーザーの一覧を取得し、Inertia.js コンポーネントで表示します。
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        // 関連するモデルをロードしてフロントエンドに渡す
        $users = User::with('schoolClass')->all();

        return Inertia::render('Users/Index', [ // 'Users/Index' はフロントエンドのVue/Reactコンポーネントのパスを想定
            'users' => $users,
        ]);
    }

    /**
     * 新しいユーザーを保存し、完了後にリダイレクトします。
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'school_class_id' => 'required|exists:school_classes,id',
            'type' => ['required', 'string', Rule::in(['student', 'teacher', 'admin'])],
        ]);

        $validated['password'] = Hash::make($validated['password']);

        User::create($validated);

        // ユーザー登録フォームのページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('regist')->with('success', 'ユーザーを登録しました。');
    }

    /**
     * 指定されたユーザーの詳細をInertia.js コンポーネントで表示します。
     *
     * @param  \App\Models\User  $user
     * @return \Inertia\Response
     */
    public function show(User $user): Response
    {
        // 関連するモデルをロードしてフロントエンドに渡す
        return Inertia::render('Users/Show', [ // 'Users/Show' はフロントエンドのVue/Reactコンポーネントのパスを想定
            'user' => $user->load('schoolClass'),
        ]);
    }

    /**
     * 指定されたユーザーを更新し、完了後にリダイレクトします。
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => 'sometimes|string|min:8',
            'type' => ['sometimes', 'string', Rule::in(['student', 'teacher', 'admin'])],
            'school_class_id' => 'nullable|exists:school_classes,id',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        // ユーザー詳細ページまたは一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('users.show', $user->id)->with('success', 'ユーザーを更新しました。');
        // または return Redirect::route('users.index')->with('success', 'ユーザーを更新しました。');
    }

    /**
     * 指定されたユーザーを削除し、完了後にリダイレクトします。
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(int $id): RedirectResponse
    {
        $user = User::findOrFail($id);
        $user->delete();

        // ユーザー一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('users.index')->with('success', 'ユーザーを削除しました。');
    }

    /**
     * CSVファイルからユーザーをインポートする
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function import(Request $request): RedirectResponse
    {
        // 1. バリデーション
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt'
        ]);

        try {
            // 2. CSVファイルの取得と読み込み
            $file = $request->file('csv_file');
            $csv = Reader::createFromPath($file->getPathname(), 'r');
            $csv->setHeaderOffset(0);

            $requiredColumns = ['name', 'email', 'password', 'type'];
            $header = $csv->getHeader();
            if (count(array_intersect($requiredColumns, $header)) !== count($requiredColumns)) {
                return Redirect::route('regist')
                    ->with('error', 'CSVファイルに必須のヘッダー（name, email, password, type）が不足しています。');
            }

            $records = $csv->getRecords($header);

            $successCount = 0;
            $failureCount = 0;
            $errors = [];

            // 3. データベースへの登録（トランザクション使用）
            DB::transaction(function () use ($records, &$successCount, &$failureCount, &$errors) {
                foreach ($records as $record) {
                    $validator = Validator::make($record, [
                        'name' => ['required', 'string', 'max:255'],
                        'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
                        'password' => ['required', 'string', 'min:8'],
                        'type' => ['required', 'string', Rule::in(['student', 'teacher', 'admin'])],
                        'school_class_id' => ['nullable', 'exists:school_classes,id'],
                    ]);

                    if ($validator->fails()) {
                        $failureCount++;
                        $errors[] = [
                            'row_data' => $record,
                            'messages' => $validator->errors()->all(),
                        ];
                        continue;
                    }

                    try {
                        User::create([
                            'name' => $record['name'],
                            'email' => $record['email'],
                            'password' => Hash::make($record['password']),
                            'type' => $record['type'],
                            'school_class_id' => $record['school_class_id'] ?? null,
                        ]);
                        $successCount++;
                    } catch (Exception $e) {
                        $failureCount++;
                        $errors[] = [
                            'row_data' => $record,
                            'messages' => ['ユーザーの保存中にエラーが発生しました: ' . $e->getMessage()],
                        ];
                    }
                }
            });

        } catch (Exception $e) {
            return Redirect::route('regist')
                ->with('error', 'CSVのインポートに失敗しました。ファイル形式を確認してください。エラー: ' . $e->getMessage());
        }

        $responseMessage = "ユーザーをCSVからインポートしました。";
        if ($successCount > 0) {
            $responseMessage .= " 成功: {$successCount}件。";
        }
        if ($failureCount > 0) {
            $responseMessage .= " 失敗: {$failureCount}件。";
            return Redirect::route('regist')
                ->with('error', $responseMessage)
                ->with('import_errors', $errors);
        }

        return Redirect::route('regist')->with('success', $responseMessage);
    }

    /**
     * CSVファイルに基づいてユーザーを一括削除する
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function deleteByCsv(Request $request)
    {
        // 1. バリデーション
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt'
        ]);

        $deletedCount = 0;

        try {
            // 2. CSVファイルを取得して読み込む
            $file = $request->file('csv_file');
            $csv = Reader::createFromPath($file->getPathname(), 'r');
            $csv->setHeaderOffset(0); // ヘッダー行をキーとして使用

            // 'email' カラムのデータを全て配列として取得
            $emailsToDelete = collect($csv->getRecords(['email']))->pluck('email')->all();

            if (empty($emailsToDelete)) {
                 return Redirect::route('remove')->with('error', 'CSVファイルが空か、emailカラムが見つかりません。');
            }

            // 3. データベースから削除 (トランザクション使用)
            DB::transaction(function () use ($emailsToDelete, &$deletedCount) {
                // whereIn を使って該当するユーザーを一括で削除
                $deletedCount = User::whereIn('email', $emailsToDelete)->delete();
            });

        } catch (Exception $e) {
            return Redirect::route('remove')
                ->with('error', 'CSVによる削除処理中にエラーが発生しました。エラー: ' . $e->getMessage());
        }

        // 4. 成功メッセージと共にリダイレクト
        return Redirect::route('remove')->with('success', "{$deletedCount}人のユーザーをCSVから削除しました。");
    }
}
