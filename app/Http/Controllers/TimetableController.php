<?php

namespace App\Http\Controllers;

use App\Models\Timetable;
use Illuminate\Http\Request;

class TimetableController extends Controller
{
    public function index(Request $request)
    {
        $baseDate = $request->query('week');

        if (!$baseDate) {
            return response()->json(['error' => '週の開始日を指定してください（例: ?week=2025-07-14）'], 400);
        }

        $weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        $timetables = Timetable::with(['subject', 'room', 'user'])
            ->whereIn('day', $weekdays)
            ->get()
            ->groupBy(['day', 'lesson']);

        return response()->json($timetables);
    }
}
