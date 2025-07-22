<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index()
    {
        return response()->json(Subject::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:subjects,name',
        ]);

        $subject = Subject::create($validated);

        return response()->json([
            'message' => '科目を登録しました',
            'subject' => $subject,
        ], 201);
    }

    public function destroy($id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return response()->json(['message' => '科目を削除しました']);
    }
}
