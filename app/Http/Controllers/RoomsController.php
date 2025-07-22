<?php

namespace App\Http\Controllers;

use App\Models\Room; // SchoolClass から Room モデルに変更
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RoomsController extends Controller // クラス名を SchoolClassController から RoomsController に変更
{
    /**
     * 教室の一覧を取得し、Inertia.js コンポーネントで表示します。
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        $rooms = Room::all(); // SchoolClass::all() から Room::all() に変更

        // 'Rooms/Index' はフロントエンドのVue/Reactコンポーネントのパスを想定
        return Inertia::render('Rooms/Index', [ // 'SchoolClasses/Index' から 'Rooms/Index' に変更
            'rooms' => $rooms, // 'schoolClasses' から 'rooms' に変更
        ]);
    }

    /**
     * 新しい教室を保存し、完了後にリダイレクトします。
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:20|unique:rooms,name', // name と unique ルールを追加
            'is_concurrent' => 'boolean', // is_concurrent を追加
        ]);

        // is_concurrent がリクエストに含まれない場合、false をデフォルト値とする
        $room = Room::create([ // SchoolClass::create から Room::create に変更
            'name' => $validated['name'],
            'is_concurrent' => $validated['is_concurrent'] ?? false,
        ]);

        // 教室一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('rooms.index')->with('success', '教室を登録しました。'); // 'school-classes.index' から 'rooms.index' に変更
    }

    /**
     * 指定された教室を更新し、完了後にリダイレクトします。
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, int $id): \Illuminate\Http\RedirectResponse
    {
        $room = Room::findOrFail($id); // SchoolClass::findOrFail から Room::findOrFail に変更

        $validated = $request->validate([
            'name' => [
                'sometimes',
                'string',
                'max:20',
                Rule::unique('rooms')->ignore($room->id), // rooms テーブルに対してユニーク制約を適用
            ],
            'is_concurrent' => 'sometimes|boolean', // is_concurrent を追加
        ]);

        $room->update($validated); // $schoolClass->update から $room->update に変更

        // 教室一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('rooms.index')->with('success', '教室を更新しました。'); // 'school-classes.index' から 'rooms.index' に変更
    }

    /**
     * 指定された教室を削除し、完了後にリダイレクトします。
     *
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(int $id): \Illuminate\Http\RedirectResponse
    {
        $room = Room::findOrFail($id); // $class から $room に変更し、Room::findOrFail を使用
        $room->delete(); // $class->delete() から $room->delete() に変更

        // 教室一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('rooms.index')->with('success', '教室を削除しました。'); // 'school-classes.index' から 'rooms.index' に変更
    }
}
