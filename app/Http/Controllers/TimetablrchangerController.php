<?php

namespace App\Http\Controllers;

use App\Models\TimetableChange;
use Illuminate\Http\Request;

class TimetableChangeController extends Controller
{
    public function index()
    {
        $changes = TimetableChange::with([
            'beforeTimetable.subject',
            'beforeTimetable.room',
            'beforeTimetable.user',
            'afterTimetable.subject',
            'afterTimetable.room',
            'afterTimetable.user',
        ])->get();

        return response()->json($changes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'before_date' => 'required|date',
            'after_date' => 'required|date',
            'before_timetable_id' => 'nullable|exists:timetables,id',
            'after_timetable_id' => 'nullable|exists:timetables,id',
            'approval' => 'required|in:approved,rejected,pending',
            'description' => 'nullable|string',
        ]);

        $change = TimetableChange::create([
            ...$validated,
            'is_approved' => $validated['approval'] === 'approved',
        ]);

        return response()->json(['message' => '変更を保存しました', 'data' => $change]);
    }
}