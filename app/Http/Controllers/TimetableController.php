<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Timetable;
use Carbon\Carbon;

class TimetableApiController extends Controller
{
    public function getWeeklyTimetable(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'date' => 'required|date',
        ]);

        $userId = $request->input('user_id');
        $date = Carbon::parse($request->input('date'));

        // 月曜を週の始まりとして取得
        $startOfWeek = $date->copy()->startOfWeek(Carbon::MONDAY);
        $endOfWeek = $startOfWeek->copy()->addDays(4); // 月〜金

        // データ取得
        $timetables = Timetable::where('user_id', $userId)
            ->whereBetween('day', ['Monday', 'Friday']) // 任意：曜日フィルタ
            ->whereBetween('term', ['semester_1', 'semester_2']) // 任意：学期フィルタ
            ->with(['subject', 'room', 'user'])
            ->get();

        // 整形：曜日・コマごとに整理
        $grouped = $timetables->groupBy(['day', 'lesson']);

        return response()->json([
            'start_of_week' => $startOfWeek->toDateString(),
            'end_of_week' => $endOfWeek->toDateString(),
            'timetable' => $grouped,
        ]);
    }
}
