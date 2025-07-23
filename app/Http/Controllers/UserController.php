<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use League\Csv\Reader;
use Exception;
use Illuminate\Http\RedirectResponse; // RedirectResponse 型ヒントのため追加
use Illuminate\Validation\ValidationException; // ValidationException のため追加

class UserController extends Controller
{
    /**
     * ユーザーの一覧を取得し、Inertia.js コンポーネントで表示します。
     * (このメソッドは、もし /users のようなリソースルートがある場合に使用されます)
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        $users = User::with('schoolClass')->all();

        return Inertia::render('Users/Index', [ // 'Users/Index' はフロントエンドのVue/Reactコンポーネントのパスを想定
            'users' => $users,
        ]);
    }

    /**
     * 新しいユーザーを保存し、完了後にリダイレクトします。
     * (このメソッドは、もし /users のようなリソースルートがある場合に使用されます)
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
        return Redirect::route('regist.view')->with('success', 'ユーザーを登録しました。'); // regist.view にリダイレクト
    }

    /**
     * 指定されたユーザーの詳細をInertia.js コンポーネントで表示します。
     * (このメソッドは、もし /users/{user} のようなリソースルートがある場合に使用されます)
     *
     * @param  \App\Models\User  $user
     * @return \Inertia\Response
     */
    public function show(User $user): Response
    {
        return Inertia::render('Users/Show', [
            'user' => $user->load('schoolClass'),
        ]);
    }

    /**
     * 指定されたユーザーを更新し、完了後にリダイレクトします。
     * (このメソッドは、もし /users/{user} のようなリソースルートがある場合に使用されます)
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
            'school_class_id' => 'nullable|exists:school_classes,id',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return Redirect::route('users.index')->with('success', 'ユーザーを更新しました。'); // ユーザー一覧ページにリダイレクト
    }

    /**
     * 指定されたユーザーを削除し、完了後にリダイレクトします。
     * (このメソッドは、もし /users/{user} のようなリソースルートがある場合に使用されます)
     *
     * @param  \App\Models\User  $user // ルートモデルバインディングを使用
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(User $user): RedirectResponse // int $id から User $user に変更
    {
        $user->delete();

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
        $request->validate([
            'csvFile' => 'required|file|mimes:csv,txt'
        ]);

        try {
            $file = $request->file('csvFile');
            $csv = Reader::createFromPath($file->getPathname(), 'r');
            $csv->setHeaderOffset(0);

            $requiredColumns = ['name', 'email', 'password'];
            $header = $csv->getHeader();
            if (count(array_intersect($requiredColumns, $header)) !== count($requiredColumns)) {
                return Redirect::route('admin.regist.view') // regist.view にリダイレクト
                    ->with('error', 'CSVファイルに必須のヘッダー（name, email, password）が不足しています。');
            }

            $records = $csv->getRecords($header);

            $successCount = 0;
            $failureCount = 0;
            $errors = [];

            DB::transaction(function () use ($records, &$successCount, &$failureCount, &$errors) {
                foreach ($records as $record) {
                    $validator = Validator::make($record, [
                        'name' => ['required', 'string', 'max:255'],
                        'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
                        'password' => ['required', 'string', 'min:8'],
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
            return Redirect::route('admin.regist.view') // regist.view にリダイレクト
                ->with('error', 'CSVのインポートに失敗しました。ファイル形式を確認してください。エラー: ' . $e->getMessage());
        }

        $responseMessage = "ユーザーをCSVからインポートしました。";
        if ($successCount > 0) {
            $responseMessage .= " 成功: {$successCount}件。";
        }
        if ($failureCount > 0) {
            $responseMessage .= " 失敗: {$failureCount}件。";
            return Redirect::route('admin.regist.view') // regist.view にリダイレクト
                ->with('error', $responseMessage)
                ->with('import_errors', $errors);
        }

        return Redirect::route('admin.regist.view')->with('success', $responseMessage); // regist.view にリダイレクト
    }

    /**
     * ユーザー登録フォームを表示します。
     * routes/web.php の Route::get('/regist', ...) に対応
     *
     * @return \Inertia\Response
     */
    public function regist(): Response
    {
        return Inertia::render('Registration');
    }

    /**
     * ユーザー削除フォームを表示します。
     * routes/web.php の Route::get('/remove', ...) に対応
     *
     * @return \Inertia\Response
     */
    public function remove(): Response
    {
        return Inertia::render('Remove');
    }

    /**
     * ユーザーを削除します (POSTリクエスト)。
     * routes/web.php の Route::post('/remove/delete', ...) に対応
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function delete(Request $request): RedirectResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id', // 削除するユーザーのIDをバリデーション
        ]);

        $user = User::findOrFail($request->user_id);
        $user->delete();

        return Redirect::route('remove.view')->with('success', 'ユーザーを削除しました。'); // 削除フォームにリダイレクト
    }

    /**
     * 学生向けの通知ページを表示します。
     * routes/web.php の Route::get('/notice', ...) に対応 (student.notice)
     *
     * @return \Inertia\Response
     */
    public function notice()
    {
        $student = auth('student')->user();

        // 1. 生徒個人に紐づく通知を取得
        $personalNotifications = $student->notifications;

        // 2. 生徒が所属するクラスに紐づく通知を取得
        $classNotifications = $student->schoolClass->notifications;

        // 3. 2つのコレクションをマージ（結合）
        $allNotifications = collect($personalNotifications)->merge($classNotifications);

        // 4. マージした各通知から不要なIDを取り除き、新しいコレクションを作成
        $formattedNotifications = $allNotifications->map(function ($notification) {
            // Eloquentモデルをコレクションに変換し、指定したキーを除外する
            return collect($notification)->except(['user_id', 'school_class_id']);
        });

        // 5. 最終的なコレクションを日付でソート
        $sortedNotifications = $formattedNotifications
            ->sortByDesc('created_at')
            ->values();

        // 6. フロントエンドに渡す
        return Inertia::render("StudentNotification", [
            "notice" => $sortedNotifications
        ]);
    }
}
