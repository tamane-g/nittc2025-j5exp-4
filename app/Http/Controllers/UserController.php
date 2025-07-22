<?php

namespace App\Http\Controllers;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use League\Csv\Reader;
use Exception;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $User_state = User::select([
            'name',
            'email',
            'password',
            'school_class_grade',
            'school_class_class',
            'email_verified_at',
        ])->get();

        return response()->json($User_state);
    }

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
        ]);

        // 2. パスワードをハッシュ化して$validatedに追加（または上書き）
        $validated['password'] = Hash::make($validated['password']);

        // 3. Userモデルでデータを作成
        User::create($validated);

        // 4. Inertia.js 用にリダイレクトでレスポンスを返す
        return Redirect::route('regist')->with('success', 'ユーザーを登録しました。');
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'ユーザーが見つかりません'], 404);
        }
        $user->delete();
        return response()->json(['message' => 'ユーザーを削除しました']);
    }

    /**
     * CSVファイルからユーザーをインポートする
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function import(Request $request)
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

            $records = $csv->getRecords(['name', 'email', 'type', 'password']);

            // 3. データベースへの登録（トランザクション使用）
            DB::transaction(function () use ($records) {
                foreach ($records as $record) {
                    User::create([
                        'name' => $record['name'],
                        'email' => $record['email'],
                        'password' => Hash::make($record['password']),
                    ]);
                }
            });

        } catch (Exception $e) {
            // エラーが発生した場合はエラーメッセージを返す
            return Redirect::route('regist')
                ->with('error', 'CSVのインポートに失敗しました。ファイル形式を確認してください。エラー: ' . $e->getMessage());
        }

        // 4. 成功メッセージと共にリダイレクト
        return Redirect::route('regist')->with('success', 'ユーザーをCSVからインポートしました。');
    }
}
