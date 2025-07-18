<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CountSubjectSchoolClass;

class Count_subject_school_classesController extends Controller
{
    public function index(Request $request)
    {
        $data = CountSubjectSchoolClass::select([
            'id',
            'subject_id',
            'school_class_id',
            'count',
        ])->get();

        return response()->json($data);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'school_class_id' => 'required|exists:school_classes,id',
            'count' => 'required|integer|min:0',
        ]);

        CountSubjectSchoolClass::create($validated);

        return response()->json(['message' => 'データを登録しました']);
    }

    // 削除処理
    public function destroy($id)
    {
        $record = CountSubjectSchoolClass::find($id);

        if (!$record) {
            return response()->json(['message' => 'データが見つかりません'], 404);
        }

        $record->delete();

        return response()->json(['message' => 'データを削除しました']);
    }
}
