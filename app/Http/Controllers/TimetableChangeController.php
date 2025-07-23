<?php

namespace App\Http\Controllers;

use App\Models\Timetable;
use App\Models\TimetableChange;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use App\Models\User; // フォームデータ取得のため
use App\Models\Room; // フォームデータ取得のため
use App\Models\SchoolClass; // フォームデータ取得のため


class TimetableChangeController extends Controller
{
    /**
     * 時間割変更申請の一覧を取得し、Inertia.js コンポーネントで表示します。
     * routes/web.php の Route::get('/change', ...) に対応 (timetablechange.index)
     * (管理者のみアクセス)
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        $changes = TimetableChange::with([
            'teacher',
            'room',
            'schoolClass',
            'beforeTimetable',
            'afterTimetable'
        ])->latest()->get();

        return Inertia::render('TimetableChanges/Index', [ // 管理者向けの一覧コンポーネント
            'changes' => $changes,
        ]);
    }

    /**
     * 教師向けの時間割変更申請フォームを表示します。
     * routes/web.php の Route::get('/change', ...) に対応 (timetablechange.view)
     *
     * @param Request $request // ★ ルートモデルバインディングではなくRequestを受け取るように修正
     * @return \Inertia\Response
     */
    public function show(Request $request): Response // ★ メソッドシグネチャを修正
    {
        // フォームに必要なデータ（例: 教師、部屋、クラス、時間割テンプレートなど）をロードして渡す
        $teachers = User::where('type', 'teacher')->get();
        $rooms = Room::all();
        $schoolClasses = SchoolClass::all();
        $timetables = Timetable::all();

        return Inertia::render('TimetableChanges/Create', [ // 教師向けの申請フォームコンポーネント
            'teachers' => $teachers,
            'rooms' => $rooms,
            'schoolClasses' => $schoolClasses,
            'timetables' => $timetables,
            'currentUserId' => $request->user()->id, // ログイン中の教師のIDを渡す
        ]);
    }

    /**
     * 新しい時間割変更申請を保存し、完了後にリダイレクトします。
     * routes/web.php の Route::post('/change', ...) に対応 (timetablechange.store)
     * (教師のみアクセス)
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:users,id',
            'before_date' => 'required|date',
            'before_timetable_id' => 'nullable|exists:timetables,id',
            'after_date' => 'required|date',
            'after_timetable_id' => 'required|exists:timetables,id',
            'room_id' => 'required|exists:rooms,id',
            'school_class_id' => 'required|exists:school_classes,id', // ★ 追加: school_class_id のバリデーション
        ]);

        $afterTimetableEntry = Timetable::findOrFail($validated['after_timetable_id']);

        try {
            $this->checkOverlap(
                null,
                $validated['after_date'],
                $afterTimetableEntry->day,
                $afterTimetableEntry->lesson,
                $afterTimetableEntry->term,
                $validated['teacher_id'],
                $validated['room_id'],
                $validated['school_class_id'] // ★ 追加: school_class_id を渡す
            );
        } catch (ValidationException $e) {
            return Redirect::route('timetablechange.view') // 教師の申請フォームページにリダイレクト
                ->with('error', '時間割変更の申請中に重複エラーが発生しました。')
                ->withErrors($e->errors());
        }

        $change = TimetableChange::create($validated);

        return Redirect::route('timetablechange.view')->with('success', '時間割変更申請を登録しました。');
    }

    /**
     * 時間割変更申請を更新し、完了後にリダイレクトします。
     * (このメソッドは、もし /timetable-changes/{id} のようなリソースルートがある場合に使用されます)
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TimetableChange  $timetableChange
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function update(Request $request, TimetableChange $timetableChange): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'teacher_id' => 'sometimes|exists:users,id',
            'before_date' => 'sometimes|date',
            'before_timetable_id' => 'sometimes|nullable|exists:timetables,id',
            'after_date' => 'sometimes|date',
            'after_timetable_id' => 'sometimes|exists:timetables,id',
            'room_id' => 'sometimes|exists:rooms,id', // ★ 追加: room_id のバリデーション
            'school_class_id' => 'sometimes|exists:school_classes,id', // ★ 追加: school_class_id のバリデーション
            'approval' => 'sometimes|boolean',
        ]);

        $afterTimetableEntryId = $validated['after_timetable_id'] ?? $timetableChange->after_timetable_id;
        $afterTimetableEntry = Timetable::findOrFail($afterTimetableEntryId);

        try {
            $this->checkOverlap(
                $timetableChange->id,
                $validated['after_date'] ?? $timetableChange->after_date,
                $afterTimetableEntry->day,
                $afterTimetableEntry->lesson,
                $afterTimetableEntry->term,
                $validated['teacher_id'] ?? $timetableChange->teacher_id,
                $validated['room_id'] ?? $timetableChange->room_id, // ★ 追加: room_id を渡す
                $validated['school_class_id'] ?? $timetableChange->school_class_id // ★ 追加: school_class_id を渡す
            );
        } catch (ValidationException $e) {
            return Redirect::route('timetablechange.index') // 管理者の一覧ページにリダイレクト
                ->with('error', '時間割変更の更新中に重複エラーが発生しました。')
                ->withErrors($e->errors());
        }

        $timetableChange->update($validated);

        return Redirect::route('timetablechange.index')->with('success', '時間割変更申請を更新しました。');
    }

    /**
     * 時間割変更申請を承認または拒否します。
     * routes/web.php の Route::post('/change', ...) に対応 (timetablechange.approve)
     * (管理者のみアクセス)
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function approve(Request $request): \Illuminate\Http\RedirectResponse // approve メソッドとして定義
    {
        $validated = $request->validate([
            'id' => 'required|exists:timetable_changes,id', // 承認/却下する申請のID
            'approval' => 'required|boolean', // true: 承認, false: 却下
            'rejection_reason' => 'nullable|string|max:500', // 却下理由 (任意)
        ]);

        $timetableChange = TimetableChange::findOrFail($validated['id']);
        $timetableChange->update(['approval' => $validated['approval']]);

        // 却下された場合、教師に通知を送信するロジックを追加
        if (!$validated['approval']) {
            $teacher = $timetableChange->teacher; // TimetableChange モデルに teacher リレーションが必要

            if ($teacher) {
                // Notification モデルを使って通知を作成
                \App\Models\Notification::create([
                    'teacher_id' => $teacher->id,
                    'heading' => '時間割変更申請の却下',
                    'description' => 'あなたの時間割変更申請（ID: ' . $timetableChange->id . '）は却下されました。理由: ' . ($validated['rejection_reason'] ?? 'なし'),
                    'notification_date' => now()->toDateString(),
                    'read_at' => null,
                ]);
            }
        }

        return Redirect::route('timetablechange.index')->with('success', '時間割変更申請の承認状態を更新しました。');
    }


    // update と destroy メソッドは web.php に直接定義されていないため、
    // もしリソースルートとして使う場合は別途定義が必要です。
    // 今回の web.php の定義に合わせて、これらは省略します。
    // 必要であれば、以前提供したものを参考にしてください。

    /**
     * 提案された時間割変更が既存の変更と重複していないかチェックします。
     * (プライベートヘルパーメソッド)
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
        int $roomId, // ★ 追加: room_id パラメータ
        int $schoolClassId // ★ 追加: school_class_id パラメータ
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
                $query->where('approval', true)
                      ->orWhere('approval', false);
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
            if ($change->room_id === $roomId) { // ★ room_id の重複チェックを追加
                $errors['room_id'] = 'この部屋は、指定された日時・時限に既に他の変更が申請/承認されています。';
            }
            // クラスの重複チェック
            if ($change->school_class_id === $schoolClassId) { // ★ school_class_id の重複チェックを追加
                $errors['school_class_id'] = 'このクラスは、指定された日時・時限に既に他の変更が申請/承認されています。';
            }

            if (!empty($errors)) {
                throw ValidationException::withMessages($errors);
            }
        }
    }
}
