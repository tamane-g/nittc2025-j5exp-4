<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CountSubjectSchoolClass;
use Illuminate\Validation\Rule; // Rule クラスを使用するため追加

// コントローラ名を規約に合わせて変更
class CountSubjectSchoolClassController extends Controller // ★ クラス名を修正
{
    /**
     * 科目とクラスの関連付けデータの一覧を取得します。
     * 関連する科目名とクラス名もロードします。
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // with() を使って関連するSubjectとSchoolClassのデータをロード
        $data = CountSubjectSchoolClass::with(['subject', 'schoolClass'])->get();

        return response()->json($data);
    }

    /**
     * 新しい科目とクラスの関連付けデータを保存します。
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => [
                'required',
                'exists:subjects,id',
                // ★ 複合ユニーク制約のバリデーションを追加
                Rule::unique('count_subject_school_classes')->where(function ($query) use ($request) {
                    return $query->where('school_class_id', $request->school_class_id);
                }),
            ],
            'school_class_id' => 'required|exists:school_classes,id',
            'count' => 'required|integer|min:0',
        ]);

        $record = CountSubjectSchoolClass::create($validated);

        return response()->json([
            'message' => 'データを登録しました',
            'record' => $record, // 登録されたデータを返す
        ], 201);
    }

    /**
     * 指定された科目とクラスの関連付けデータを更新します。
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, int $id)
    {
        $record = CountSubjectSchoolClass::findOrFail($id); // ★ find から findOrFail に変更

        $validated = $request->validate([
            'subject_id' => [
                'sometimes', // リクエストに含まれていればバリデーション
                'exists:subjects,id',
                // 更新時は自分自身の組み合わせはユニークチェックから除外
                Rule::unique('count_subject_school_classes')->where(function ($query) use ($request, $record) {
                    return $query->where('school_class_id', $request->school_class_id ?? $record->school_class_id);
                })->ignore($record->id),
            ],
            'school_class_id' => 'sometimes|exists:school_classes,id',
            'count' => 'sometimes|integer|min:0',
        ]);

        $record->update($validated);

        return response()->json([
            'message' => 'データを更新しました',
            'record' => $record,
        ]);
    }

    /**
     * 指定された科目とクラスの関連付けデータを削除します。
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id)
    {
        $record = CountSubjectSchoolClass::findOrFail($id); // ★ find から findOrFail に変更
        $record->delete();

        return response()->json(['message' => 'データを削除しました']);
    }
}
