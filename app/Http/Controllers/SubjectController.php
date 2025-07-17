<?php

namespace App\Http\Controllers;
use App\Models\Subject;

use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $store_subject = Subject::select([
            'id',
            'name',
        ])->get();

        return response()->json($store_subject);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
        'id' => 'required',
        'name' => 'required|string|max:20',
    ]);
    
    Subject::create($validated);
    return response()->json(['message' => '変更を保存しました']);
    }

    public function destroy($id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json(['message' => '科目が見つかりません'], 404);
        }

        $subject->delete();

        return response()->json(['message' => '科目を削除しました']);
    }
}
