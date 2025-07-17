<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SchoolClass;

class SchoolClassController extends Controller
{
    public function index(Request $request)
    {
        $reference = SchoolClass::with([
            'grade',
            'class',
        ])->get();

        return response()->json($reference);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'grade' => 'required|integer|min:1|max:6',
            'class' => 'required|integer|min:1|max:10',
        ]);

        SchoolClass::create($validated);

        return response()->json(['message' => '学級を登録しました']);
    }

    // 学級の削除
    public function destroy($id)
    {
        $class = SchoolClass::find($id);

         if (!$class) {
            return response()->json(['message' => '学級が見つかりません'], 404);
        }

        $class->delete();

        return response()->json(['message' => '学級を削除しました']);
    }

}
