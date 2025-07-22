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
        return response()->json(User::all());
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
        $user = User::findOrFail($id);
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
