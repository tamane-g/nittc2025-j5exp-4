<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;
use Illuminate\Validation\Rule; // Rule クラスを使用するため追加

class RoomsController extends Controller
{
    /**
     * 教室の一覧を取得します。
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // 全てのカラムを取得する場合、select() は不要です。
        // 必要に応じて is_concurrent も含めて返します。
        $rooms = Room::all();

        return response()->json($rooms);
    }

    /**
     * 教室を新規登録します。
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:20|unique:rooms,name', // ★ max:50 を max:20 に、unique を追加
            'is_concurrent' => 'boolean', // ★ nullable を削除し、デフォルトで false に設定されるように変更
        ]);

        // is_concurrent がリクエストに含まれない場合、false をデフォルト値とする
        $room = Room::create([
            'name' => $validated['name'],
            'is_concurrent' => $validated['is_concurrent'] ?? false,
        ]);

        return response()->json([
            'message' => '教室を登録しました',
            'room' => $room, // 登録された教室情報を返す
        ], 201);
    }

    /**
     * 指定された教室を更新します。
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, int $id)
    {
        $room = Room::findOrFail($id); // ★ find から findOrFail に変更

        $validated = $request->validate([
            'name' => [
                'sometimes', // リクエストに含まれていればバリデーション
                'string',
                'max:20', // ★ max:50 を max:20 に修正
                Rule::unique('rooms')->ignore($room->id), // 更新時は自分自身の名前はユニークチェックから除外
            ],
            'is_concurrent' => 'sometimes|boolean', // リクエストに含まれていればバリデーション
        ]);

        $room->update($validated);

        return response()->json([
            'message' => '教室を更新しました',
            'room' => $room,
        ]);
    }

    /**
     * 指定された教室を削除します。
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id)
    {
        $room = Room::findOrFail($id); // ★ find から findOrFail に変更
        $room->delete();

        return response()->json(['message' => '教室を削除しました']);
    }
}