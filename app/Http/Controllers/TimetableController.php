<?php

namespace App\Http\Controllers;

use App\Models\Timetable;
use Illuminate\Http\Request;
// Carbon と Collection は、現在のロジックでは不要になったためコメントアウト
// use Carbon\Carbon;
// use Illuminate\Support\Collection;

class TimetableController extends Controller
{
    /**
     * 時間割テンプレートデータを取得します。
     *
     * 現在のtimetablesテーブルは、曜日ごとの固定された時間割テンプレートを格納しています。
     * 特定の「週」の時間割を取得したい場合は、timetablesテーブルに日付カラムを追加し、
     * それに基づいてフィルタリングするロジックを実装する必要があります。
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // 週の開始日を指定するクエリパラメータ 'week' は、
        // 'day' カラムが ENUM 型であるため、直接フィルタリングには使用できません。
        // このメソッドは、すべての時間割テンプレートエントリを返します。
        // 必要に応じて、term（学期）などでフィルタリングを追加できます。

        $timetables = Timetable::with(['subject', 'room', 'teacher', 'schoolClass']) // ★ user を teacher に、schoolClass を追加
            ->orderBy('day')    // 曜日でソート
            ->orderBy('lesson') // 時限でソート
            ->get()
            ->groupBy([
                'day',    // ★ day カラムが ENUM なので、直接グループ化
                'lesson'
            ]);

        return response()->json($timetables);
    }

    /**
     * 新しい時間割エントリを保存します。
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'term' => 'required|in:semester_1,semester_2,full_year',
            'day' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday', // ★ Wednesday のスペルを修正
            'lesson' => 'required|in:lesson_1,lesson_2,lesson_3,lesson_4',
            'teacher_id' => 'required|exists:users,id',
            'room_id' => 'required|exists:rooms,id',
            'subject_id' => 'required|exists:subjects,id',
            'school_class_id' => 'required|exists:school_classes,id',
        ]);

        $timetable = Timetable::create($validated);

        return response()->json([
            'message' => '時間割エントリ登録完了',
            'timetable' => $timetable,
        ], 201);
    }

    /**
     * 指定された時間割エントリを更新します。
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, int $id)
    {
        $timetable = Timetable::findOrFail($id);

        $validated = $request->validate([
            'term' => 'sometimes|in:semester_1,semester_2,full_year',
            'day' => 'sometimes|in:Monday,Tuesday,Wednesday,Thursday,Friday', // ★ Wednesday のスペルを修正
            'lesson' => 'sometimes|in:lesson_1,lesson_2,lesson_3,lesson_4',
            'teacher_id' => 'sometimes|exists:users,id',
            'room_id' => 'sometimes|exists:rooms,id',
            'subject_id' => 'sometimes|exists:subjects,id',
            'school_class_id' => 'sometimes|exists:school_classes,id',
        ]);

        // 複合ユニーク制約を考慮した更新ロジック
        if (isset($validated['term']) || isset($validated['day']) || isset($validated['lesson']) || isset($validated['school_class_id'])) {
            $query = Timetable::where('term', $validated['term'] ?? $timetable->term)
                              ->where('day', $validated['day'] ?? $timetable->day)
                              ->where('lesson', $validated['lesson'] ?? $timetable->lesson)
                              ->where('school_class_id', $validated['school_class_id'] ?? $timetable->school_class_id)
                              ->where('id', '!=', $id); // 更新対象自身は除く

            if ($query->exists()) {
                return response()->json(['error' => 'この時間割スロットは既に存在します。他のエントリと重複しています。'], 409);
            }
        }

        $timetable->update($validated);

        return response()->json([
            'message' => '時間割エントリ更新完了',
            'timetable' => $timetable,
        ]);
    }

    /**
     * 指定された時間割エントリを削除します。
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id)
    {
        $timetable = Timetable::findOrFail($id);
        $timetable->delete();

        return response()->json(['message' => '時間割エントリ削除完了']);
    }
}