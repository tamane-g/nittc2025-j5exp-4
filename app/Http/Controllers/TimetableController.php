<?php

use Carbon\Carbon;
use Illuminate\Support\Collection;

public function index(Request $request)
{
    $baseDate = $request->query('week');

    if (!$baseDate) {
        return response()->json(['error' => '週の開始日を指定してください（例:?week=2025-07-14）'], 400);
    }

    $startOfWeek = Carbon::parse($baseDate)->startOfWeek(); // 月曜日
    $dates = collect();

    // 月〜金の5日分を作成
    for ($i = 0; $i < 5; $i++) {
        $dates->push($startOfWeek->copy()->addDays($i)->toDateString());
    }

    $timetables = Timetable::with(['subject', 'room', 'user'])
        ->whereIn('day', $dates)
        ->orderBy('day')
        ->orderBy('lesson')
        ->get()
        ->groupBy([
            fn($item) => Carbon::parse($item->day)->format('Y-m-d'),
            'lesson'
        ]);

    return response()->json($timetables);
}