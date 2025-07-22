<?php

namespace App\Http\Controllers;

use App\Models\Timetable; // Timetable モデルを使用するため追加
use App\Models\TimetableChange;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException; // ValidationException を使用するため追加
use Illuminate\Validation\Rule; // Rule クラスを使用するため追加

class TimetableChangeController extends Controller
{
    /**
     * 時間割変更申請の一覧を取得します。
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // 関連するモデル（teacher, room, schoolClass, beforeTimetable, afterTimetable）も同時に読み込む
        $changes = TimetableChange::with([
            'teacher', // user から teacher に変更
            'room', // 追加
            'schoolClass', // 追加
            'beforeTimetable',
            'afterTimetable'
        ])->latest()->get();

        return response()->json($changes);
    }

    /**
     * 新しい時間割変更申請を保存します。
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:users,id', // user_id から teacher_id に変更
            'before_date' => 'required|date',
            'before_timetable_id' => 'nullable|exists:timetables,id',
            'after_date' => 'required|date',
            'after_timetable_id' => 'required|exists:timetables,id',
            'room_id' => 'required|exists:rooms,id', // 追加
            'school_class_id' => 'required|exists:school_classes,id', // 追加
            // 'approval' はマイグレーションで default(false) を設定しているため、ここでは不要
        ]);

        // 提案された変更後の時間割エントリを取得
        $afterTimetableEntry = Timetable::findOrFail($validated['after_timetable_id']);

        // 重複チェックの実行
        $this->checkOverlap(
            null, // 新規作成のためIDはなし
            $validated['after_date'],
            $afterTimetableEntry->day,
            $afterTimetableEntry->lesson,
            $afterTimetableEntry->term,
            $validated['teacher_id'],
            $validated['room_id'],
            $validated['school_class_id']
        );

        $change = TimetableChange::create($validated);

        return response()->json([
            'message' => '時間割変更申請を登録しました。',
            'change' => $change,
        ], 201);
    }

    /**
     * 特定の時間割変更申請の詳細を取得します。
     *
     * @param  \App\Models\TimetableChange  $timetableChange
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(TimetableChange $timetableChange)
    {
        // 指定されたIDの申請データをリレーションと共に読み込む
        return response()->json($timetableChange->load([
            'teacher', // user から teacher に変更
            'room', // 追加
            'schoolClass', // 追加
            'beforeTimetable',
            'afterTimetable'
        ]));
    }

    /**
     * 時間割変更申請を更新します。
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TimetableChange  $timetableChange
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function update(Request $request, TimetableChange $timetableChange)
    {
        $validated = $request->validate([
            'teacher_id' => 'sometimes|exists:users,id',
            'before_date' => 'sometimes|date',
            'before_timetable_id' => 'sometimes|nullable|exists:timetables,id',
            'after_date' => 'sometimes|date',
            'after_timetable_id' => 'sometimes|exists:timetables,id',
            'room_id' => 'sometimes|exists:rooms,id',
            'school_class_id' => 'sometimes|exists:school_classes,id',
            'approval' => 'sometimes|boolean', // is_approved から approval に変更
        ]);

        // 更新後の after_timetable_id がリクエストに含まれている場合は、その時間割エントリを取得
        // そうでない場合は、現在の timetableChange の after_timetable_id を使用
        $afterTimetableEntryId = $validated['after_timetable_id'] ?? $timetableChange->after_timetable_id;
        $afterTimetableEntry = Timetable::findOrFail($afterTimetableEntryId);

        // 重複チェックの実行 (更新時は自身のIDを除外)
        $this->checkOverlap(
            $timetableChange->id, // 更新対象のID
            $validated['after_date'] ?? $timetableChange->after_date,
            $afterTimetableEntry->day,
            $afterTimetableEntry->lesson,
            $afterTimetableEntry->term,
            $validated['teacher_id'] ?? $timetableChange->teacher_id,
            $validated['room_id'] ?? $timetableChange->room_id,
            $validated['school_class_id'] ?? $timetableChange->school_class_id
        );

        $timetableChange->update($validated);

        return response()->json([
            'message' => '時間割変更申請を更新しました。',
            'change' => $timetableChange,
        ]);
    }

    /**
     * 時間割変更申請を承認または拒否します。
     * (このメソッドは承認状態のみを更新するため、重複チェックは不要)
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TimetableChange  $timetableChange
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateApproval(Request $request, TimetableChange $timetableChange)
    {
        $validated = $request->validate([
            'approval' => 'required|boolean', // is_approved から approval に変更
        ]);

        $timetableChange->update($validated);

        return response()->json([
            'message' => '時間割変更申請の承認状態を更新しました。',
            'change' => $timetableChange,
        ]);
    }

    /**
     * 時間割変更申請を削除します。
     *
     * @param  \App\Models\TimetableChange  $timetableChange
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(TimetableChange $timetableChange)
    {
        $timetableChange->delete();

        return response()->json(['message' => '時間割変更申請を削除しました。'], 200); // 200 OK ステータスでメッセージを返す
    }

    /**
     * 提案された時間割変更が既存の変更と重複していないかチェックします。
     *
     * @param int|null $currentChangeId 現在更新中の変更ID (新規作成時はnull)
     * @param string $afterDate 変更後の日付
     * @param string $day 変更後の曜日 (Timetableから取得)
     * @param string $lesson 変更後の時限 (Timetableから取得)
     * @param string $term 変更後の学期 (Timetableから取得)
     * @param int $teacherId 変更後の教師ID
     * @param int $roomId 変更後の部屋ID
     * @param int $schoolClassId 変更後のクラスID
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function checkOverlap(
        ?int $currentChangeId,
        string $afterDate,
        string $day,
        string $lesson,
        string $term,
        int $teacherId,
        int $roomId,
        int $schoolClassId
    ): void {
        // 同じ日付、同じTimetableスロット（曜日、時限、学期）を持つ既存の変更を検索
        $query = TimetableChange::where('after_date', $afterDate)
            ->whereHas('afterTimetable', function ($query) use ($day, $lesson, $term) {
                $query->where('day', $day)
                      ->where('lesson', $lesson)
                      ->where('term', $term);
            })
            // 承認済みまたは申請中の変更のみを対象とする
            ->where(function ($query) {
                $query->where('approval', true) // 承認済み
                      ->orWhere('approval', false); // 申請中
            });

        // 更新の場合、自分自身のレコードは重複チェックから除外
        if ($currentChangeId !== null) {
            $query->where('id', '!=', $currentChangeId);
        }

        $overlappingChanges = $query->get();

        foreach ($overlappingChanges as $change) {
            $errors = [];

            // 教師の重複チェック
            if ($change->teacher_id === $teacherId) {
                $errors['teacher_id'] = 'この教師は、指定された日時・時限に既に他の変更が申請/承認されています。';
            }
            // 部屋の重複チェック
            if ($change->room_id === $roomId) {
                $errors['room_id'] = 'この部屋は、指定された日時・時限に既に他の変更が申請/承認されています。';
            }
            // クラスの重複チェック
            if ($change->school_class_id === $schoolClassId) {
                $errors['school_class_id'] = 'このクラスは、指定された日時・時限に既に他の変更が申請/承認されています。';
            }

            if (!empty($errors)) {
                throw ValidationException::withMessages($errors);
            }
        }
    }
}