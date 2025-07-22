<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule; // Rule クラスを使用するため追加

class SchoolClassController extends Controller
{
    /**
     * クラスの一覧を取得します。
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // 必要に応じて、関連する生徒の数などをロードすることも可能です
        // return response()->json(SchoolClass::with('users')->all());
        return response()->json(SchoolClass::all());
    }

    /**
     * 新しいクラスを保存します。
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'grade' => [
                'required',
                'integer',
                'min:1',
                'max:6',
                // ★ 複合ユニーク制約のバリデーションを追加
                // 同じ学年とクラスの組み合わせは一意であるべき
                Rule::unique('school_classes')->where(function ($query) use ($request) {
                    return $query->where('class', $request->class);
                }),
            ],
            'class' => 'required|integer|min:1|max:10',
        ]);

        $schoolClass = SchoolClass::create($validated);

        return response()->json([
            'message' => 'クラスを登録しました',
            'school_class' => $schoolClass,
        ], 201);
    }

    /**
     * 指定されたクラスを更新します。
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, int $id)
    {
        $schoolClass = SchoolClass::findOrFail($id);

        $validated = $request->validate([
            'grade' => [
                'sometimes', // リクエストに含まれていればバリデーション
                'integer',
                'min:1',
                'max:6',
                // 更新時は自分自身の組み合わせはユニークチェックから除外
                Rule::unique('school_classes')->where(function ($query) use ($request, $schoolClass) {
                    return $query->where('class', $request->class ?? $schoolClass->class);
                })->ignore($schoolClass->id),
            ],
            'class' => 'sometimes|integer|min:1|max:10',
        ]);

        $schoolClass->update($validated);

        return response()->json([
            'message' => 'クラスを更新しました',
            'school_class' => $schoolClass,
        ]);
    }

    /**
     * 指定されたクラスを削除します。
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id)
    {
        $class = SchoolClass::findOrFail($id);
        $class->delete();

        return response()->json(['message' => 'クラスを削除しました']);
    }
}