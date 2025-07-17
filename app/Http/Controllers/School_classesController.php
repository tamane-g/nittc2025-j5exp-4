<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SchoolClass;

class School_classesController extends Controller
{
    // 学級一覧を取得
    public function index(Request $request)
    {
        $classes = SchoolClass::select([
            'id',
            'grade',
            'class',
        ])->get();

        return response()->json($classes);
    }

    // 学級を登録
    public function store(Request $request)
    {
        $validated = $request->validate([
            'grade' => 'required|integer|min:1|max:6',
            'class' => 'required|integer|min:1|max:10',
        ]);

        SchoolClass::create($validated);
    
        return response()->json(['message' => '学級を登録しました']);
    }

    // 学級を削除
    public function destroy($id)
    {
        $schoolClass = SchoolClass::find($id);

        if (!$schoolClass) {
            return response()->json(['message' => '学級が見つかりません'], 404);
        }

        $schoolClass->delete();

        return response()->json(['message' => '学級を削除しました']);
    }
}
