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
            'user_id',
            'room_id',
            'subject_id',
        ])->get();

        return response()->json($view);
    }
}
