<?php

namespace App\Http\Controllers;
use App\Models\Timetable;

use Illuminate\Http\Request;

class TimetableController extends Controller
{
    public function index(Request $request)
    {
        $view = Timetable::select([
            'id',
            'term',
            'day',
            'lesson',
            'teacher_id',
            'room_id',
            'subject_id',
            'school_class_id',
        ])->get();

        return response()->json($view);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'term' => 'required|in:semester_1,semester_2,full_year',
            'day' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday',
            'lesson' => 'required|integer|min:1|max:10',
            'teacher_id' => 'required|exists:teachers,id',
            'room_id' => 'required|exists:rooms,id',
            'subject_id' => 'required|exists:subjects,id',
            'school_class_id' => 'required|exists:school_classes,id',
        ]);

        Timetable::create($validated);

        return response()->json(['message' => '時間割を登録しました']);
    }

    public function destroy($id)
    {
        $timetable = Timetable::find($id);

        if (!$timetable) {
            return response()->json(['message' => '時間割が見つかりません'], 404);
        }

        $timetable->delete();

        return response()->json(['message' => '時間割を削除しました']);
    }
}
