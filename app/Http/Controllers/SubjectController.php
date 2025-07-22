<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule; // Rule クラスを使用するため追加

class SubjectController extends Controller
{
    /**
     * 科目の一覧を取得します。
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return response()->json(Subject::all());
    }

    /**
     * 新しい科目を保存します。
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:20|unique:subjects,name', // ★ max:255 を max:20 に修正
        ]);

        $subject = Subject::create($validated);

        return response()->json([
            'message' => '科目を登録しました',
            'subject' => $subject,
        ], 201);
    }

    /**
     * 指定された科目を更新します。
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, int $id)
    {
        $subject = Subject::findOrFail($id);

        $validated = $request->validate([
            // 更新時は自分自身の名前はユニークチェックから除外
            'name' => [
                'sometimes', // リクエストに含まれていればバリデーション
                'string',
                'max:20', // ★ max:255 を max:20 に修正
                Rule::unique('subjects')->ignore($subject->id),
            ],
        ]);

        $subject->update($validated);

        return response()->json([
            'message' => '科目を更新しました',
            'subject' => $subject,
        ]);
    }

    /**
     * 指定された科目を削除します。
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return response()->json(['message' => '科目を削除しました']);
    }
}