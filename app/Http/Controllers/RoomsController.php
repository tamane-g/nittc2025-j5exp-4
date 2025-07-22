<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Room;

class RoomsController extends Controller
{
    // 教室一覧の取得
    public function index(Request $request)
    {
        $rooms = Room::select([
            'id',
            'name',
        ])->get();

        return response()->json($rooms);
    }

    // 教室の新規登録
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'is_concurrent' => 'nullable|boolean',
        ]);

    Room::create([
        'name' => $validated['name'],
        'is_concurrent' => $validated['is_concurrent'] ?? false,
    ]);


        return response()->json(['message' => '教室を登録しました']);
    }
    // 教室の削除
    public function destroy($id)
    {
        $room = Room::find($id);

        if (!$room) {
            return response()->json(['message' => '教室が見つかりません'], 404);
        }

        $room->delete();

        return response()->json(['message' => '教室を削除しました']);
    }
}
