<?php

namespace App\Http\Controllers;

use App\Models\User; // User モデルを使用
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; // トランザクションのため追加
use Illuminate\Support\Facades\Hash; // パスワードハッシュ化のため
use Illuminate\Support\Facades\Redirect; // リダイレクトのため追加
use Illuminate\Support\Facades\Validator; // 手動バリデーションのため（CSVインポートで使用）
use Illuminate\Validation\ValidationException; // バリデーションエラーのため（CSVインポートで使用）
use Illuminate\Validation\Rule; // バリデーションルールで使用
use League\Csv\Reader; // CSV読み込みのため追加
use Exception; // 例外処理のため追加

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     * ユーザーの一覧を取得します。
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return response()->json(User::all());
    }

    /**
     * Store a newly created user in storage.
     * 新しいユーザーを保存します。
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse // リダイレクトレスポンスに変更
     */
    public function store(Request $request)
    {
        // 1. バリデーションルールを修正
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            // 'users' テーブルの 'email' カラム内でユニークであることを確認
            'email' => 'required|string|email|max:255|unique:users',
            // 8文字以上であることを確認
            'password' => 'required|string|min:8',
            'school_class_id' => 'required|exists:school_classes,id',
            // type カラムのバリデーションが抜けていたため追加 (student, teacher, admin)
            'type' => ['required', 'string', Rule::in(['student', 'teacher', 'admin'])],
        ]);

        // 2. パスワードをハッシュ化して$validatedに追加（または上書き）
        $validated['password'] = Hash::make($validated['password']);

        // 3. Userモデルでデータを作成
        User::create($validated);

        // 4. Inertia.js 用にリダイレクトでレスポンスを返す
        return Redirect::route('regist')->with('success', 'ユーザーを登録しました。');
    }

    /**
     * Display the specified user.
     * 指定されたユーザーの詳細を取得します。
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(User $user)
    {
        // 必要に応じて、関連するモデルをロードすることもできます
        // 例: return response()->json($user->load('schoolClass'));
        return response()->json($user);
    }

    /**
     * Update the specified user in storage.
     * 指定されたユーザーを更新します。
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => 'sometimes|string|min:8', // パスワードは更新時のみ
            'type' => ['sometimes', 'string', Rule::in(['student', 'teacher', 'admin'])],
            'school_class_id' => 'nullable|exists:school_classes,id',
        ]);

        // パスワードがリクエストに含まれている場合のみハッシュ化して更新
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully.',
            'user' => $user,
        ]);
    }

    /**
     * Remove the specified user from storage.
     * 指定されたユーザーを削除します。
     *
     * @param  int  $id // ルートモデルバインディングではなくIDを受け取るように変更
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'ユーザー削除完了']);
    }

    /**
     * CSVファイルからユーザーをインポートする
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function import(Request $request) // メソッド名を import に変更
    {
        // 1. バリデーション
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt'
        ]);

        try {
            // 2. CSVファイルの取得と読み込み
            $file = $request->file('csv_file');
            // 'r'は読み込みモード
            $csv = Reader::createFromPath($file->getPathname(), 'r');
            // ヘッダー行をキーとして使用する
            $csv->setHeaderOffset(0);

            // 必須カラムを定義
            $requiredColumns = ['name', 'email', 'password', 'type'];
            // CSVヘッダーが必須カラムをすべて含んでいるかチェック
            $header = $csv->getHeader(); // ヘッダーを取得
            if (count(array_intersect($requiredColumns, $header)) !== count($requiredColumns)) {
                return Redirect::route('regist')
                    ->with('error', 'CSVファイルに必須のヘッダー（name, email, password, type）が不足しています。');
            }

            // レコードを取得する際に、必要なカラムのみを指定
            $records = $csv->getRecords($header); // ヘッダー全体を渡して、すべてのカラムを処理

            // インポート結果を追跡
            $successCount = 0;
            $failureCount = 0;
            $errors = [];

            // 3. データベースへの登録（トランザクション使用）
            DB::transaction(function () use ($records, &$successCount, &$failureCount, &$errors) {
                foreach ($records as $record) {
                    // 各ユーザーデータのバリデーション
                    $validator = Validator::make($record, [
                        'name' => ['required', 'string', 'max:255'],
                        'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
                        'password' => ['required', 'string', 'min:8'],
                        'type' => ['required', 'string', Rule::in(['student', 'teacher', 'admin'])],
                        'school_class_id' => ['nullable', 'exists:school_classes,id'], // 任意
                    ]);

                    if ($validator->fails()) {
                        $failureCount++;
                        $errors[] = [
                            'row_data' => $record,
                            'messages' => $validator->errors()->all(),
                        ];
                        continue; // 次の行へ
                    }

                    try {
                        User::create([
                            'name' => $record['name'],
                            'email' => $record['email'],
                            'password' => Hash::make($record['password']),
                            'type' => $record['type'], // type カラムも保存
                            'school_class_id' => $record['school_class_id'] ?? null, // school_class_id も保存、なければnull
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
            // エラーが発生した場合はエラーメッセージを返す
            return Redirect::route('regist')
                ->with('error', 'CSVのインポートに失敗しました。ファイル形式を確認してください。エラー: ' . $e->getMessage());
        }

        // 4. 成功メッセージと共にリダイレクト
        $responseMessage = "ユーザーをCSVからインポートしました。";
        if ($successCount > 0) {
            $responseMessage .= " 成功: {$successCount}件。";
        }
        if ($failureCount > 0) {
            $responseMessage .= " 失敗: {$failureCount}件。";
            // 失敗がある場合はエラーメッセージもセッションにフラッシュ
            return Redirect::route('regist')
                ->with('error', $responseMessage)
                ->with('import_errors', $errors); // 詳細なエラーを渡す
        }

        return Redirect::route('regist')->with('success', $responseMessage);
    }
}