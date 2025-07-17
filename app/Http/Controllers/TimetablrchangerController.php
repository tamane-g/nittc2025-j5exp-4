<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TimetableChange;

class TimetablrchangerController extends Controller
{
    public function index(Request $request)
    {
        $changes = TimetableChange::with([
            'user_id',
            'before_date',
            'before_timetable_id',
            'after_date',
            'after_timetable_id',
            'approval',
        ])->get();

        return response()->json($changes);
    }

    public function store(Request $request)
    {
    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
        'before_date' => 'required|date',
        'after_date' => 'required|date',
        'approval' => 'required|in:approved,rejected,pending',
        'before_timetable_id' => 'required|exists:timetables,id',
        'after_timetable_id' => 'required',
    ]);
    
    TimetableChange::create($validated);
    return response()->json(['message' => '変更を保存しました']);
    }

    public function destroy($id)
    {
        $change = User::find($id);

        if (!change) {
            return response()->json(['message' => 'ユーザーが見つかりません'], 404);
        }
        $change->delete();
        return response()->json(['message' => 'ユーザーを削除しました']);
    }
}
