<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use Illuminate\Http\Request;

class SchoolClassController extends Controller
{
    public function index()
    {
        return response()->json(SchoolClass::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'grade' => 'required|integer|min:1|max:6',
            'class' => 'required|integer|min:1|max:10',
        ]);

        $schoolClass = SchoolClass::create($validated);

        return response()->json([
            'message' => 'クラスを登録しました',
            'school_class' => $schoolClass,
        ], 201);
    }

    public function destroy($id)
    {
        $class = SchoolClass::findOrFail($id);
        $class->delete();

        return response()->json(['message' => 'クラスを削除しました']);
    }
}
