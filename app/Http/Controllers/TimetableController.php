<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\Timetable;
use App\Models\TimetableChange; // TimetableChangeモデルをインポート
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse; // RedirectResponseの型ヒントのために追加
use Carbon\Carbon; // 日付操作のためにCarbonをインポート

class TimetableController extends Controller
{
    public function teacherView(Request $request): Response
    {
        // 1. 初期設定
        $teacher = auth('teacher')->user();
        $teacherId = $teacher->id;
        $date = Carbon::parse($request->input('date', now()));
        $weekStart = $date->copy()->startOfWeek(Carbon::MONDAY);
        $weekEnd = $date->copy()->endOfWeek(Carbon::FRIDAY);

        // 2. 基本時間割を取得し、IDをキーにした連想配列（マップ）を作成
        $baseTimetable = Timetable::where('teacher_id', $teacherId)
            ->with(['room', 'schoolClass', 'subject', 'teacher'])
            ->get();
        
        // 検索と変更適用のために、IDをキーにしたコレクションを作成
        $finalTimetableEntries = $baseTimetable->keyBy('id')->all();

        // 3. 関連する時間割変更のみを効率的に取得
        $timetableIds = $baseTimetable->pluck('id');
        // 変更案
        $timetableChanges = TimetableChange::where('approval', true)
            ->where(function ($query) use ($weekStart, $weekEnd, $teacherId) {
                // 変更の「対象日」が今週に含まれている
                $query->whereBetween('date', [$weekStart, $weekEnd]);
            })
            ->where(function ($query) use ($teacherId) {
                $query->whereHas('beforeTimetable', function ($q) use ($teacherId) {
                    $q->where('teacher_id', $teacherId);
                });
            })
            ->with([
                'beforeTimetable.room', 'beforeTimetable.schoolClass', 'beforeTimetable.subject', 'beforeTimetable.teacher',
                'afterTimetable.room', 'afterTimetable.schoolClass', 'afterTimetable.subject', 'afterTimetable.teacher'
            ])
            ->get();

        // 4. 変更を適用 (★ ロジックを修正)
        foreach ($timetableChanges as $change) {
            // 「変更元」が今週のコマの場合
            if ($change->date->between($weekStart, $weekEnd) && isset($finalTimetableEntries[$change->before_timetable_id])) {
                $originalEntry = $finalTimetableEntries[$change->before_timetable_id];
                $changedEntry = clone $change->afterTimetable; // 変更先情報をコピー

                // 元のdayとlessonを維持する
                $changedEntry->day = $originalEntry->day;
                $changedEntry->lesson = $originalEntry->lesson;
                
                $finalTimetableEntries[$change->before_timetable_id] = $changedEntry;
            }
        }

        // 5. ビュー用の形式に整形
        $timetable = $this->formatTimetableForView(collect($finalTimetableEntries));

        return Inertia::render('Timetable', [
            'user' => $teacher,
            'date' => $date,
            'monday' => $weekStart,
            'friday' => $weekEnd,
            'timetable' => $timetable,
        ]);
    }

    public function teacherChangeView(Request $request): Response
    {
        // 1. 初期設定
        $teacher = auth('teacher')->user();
        $teacherId = $teacher->id;
        $date = Carbon::parse($request->input('date', now()));
        $weekStart = $date->copy()->startOfWeek(Carbon::MONDAY);
        $weekEnd = $date->copy()->endOfWeek(Carbon::FRIDAY);

        // 2. 基本時間割を取得し、IDをキーにした連想配列（マップ）を作成
        $baseTimetable = Timetable::where('teacher_id', $teacherId)
            ->with(['room', 'schoolClass', 'subject', 'teacher'])
            ->get();
        
        // 検索と変更適用のために、IDをキーにしたコレクションを作成
        $finalTimetableEntries = $baseTimetable->keyBy('id')->all();

        // 3. 関連する時間割変更のみを効率的に取得
        $timetableIds = $baseTimetable->pluck('id');
        // 変更案
        $timetableChanges = TimetableChange::where('approval', true)
            ->where(function ($query) use ($weekStart, $weekEnd, $teacherId) {
                // 変更の「対象日」が今週に含まれている
                $query->whereBetween('date', [$weekStart, $weekEnd]);
            })
            ->where(function ($query) use ($teacherId) {
                $query->whereHas('beforeTimetable', function ($q) use ($teacherId) {
                    $q->where('teacher_id', $teacherId);
                });
            })
            ->with([
                'beforeTimetable.room', 'beforeTimetable.schoolClass', 'beforeTimetable.subject', 'beforeTimetable.teacher',
                'afterTimetable.room', 'afterTimetable.schoolClass', 'afterTimetable.subject', 'afterTimetable.teacher'
            ])
            ->get();

        // 4. 変更を適用 (★ ロジックを修正)
        foreach ($timetableChanges as $change) {
            // 「変更元」が今週のコマの場合
            if ($change->date->between($weekStart, $weekEnd) && isset($finalTimetableEntries[$change->before_timetable_id])) {
                $originalEntry = $finalTimetableEntries[$change->before_timetable_id];
                $changedEntry = clone $change->afterTimetable; // 変更先情報をコピー

                // 元のdayとlessonを維持する
                $changedEntry->day = $originalEntry->day;
                $changedEntry->lesson = $originalEntry->lesson;
                
                $finalTimetableEntries[$change->before_timetable_id] = $changedEntry;
            }
        }

        // 5. ビュー用の形式に整形
        $timetable = $this->formatTimetableForView(collect($finalTimetableEntries));

        return Inertia::render('TimetableClick', [
            'user' => $teacher,
            'date' => $date,
            'monday' => $weekStart,
            'friday' => $weekEnd,
            'timetable' => $timetable,
        ]);
    }
    
    /**
     * 指定された日付を含む週の時間割を取得し、変更を反映させて表示します。
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function view(Request $request): Response
    {
        // 1. 初期設定
        $student = auth('student')->user();
        $classId = $student->schoolClass->id;
        $date = Carbon::parse($request->input('date', now()));
        $weekStart = $date->copy()->startOfWeek(Carbon::MONDAY);
        $weekEnd = $date->copy()->endOfWeek(Carbon::FRIDAY);

        // 2. 基本時間割を取得し、IDをキーにした連想配列（マップ）を作成
        $baseTimetable = Timetable::where('school_class_id', $classId)
            ->with(['room', 'schoolClass', 'subject', 'teacher'])
            ->get();
        
        // 検索と変更適用のために、IDをキーにしたコレクションを作成
        $finalTimetableEntries = $baseTimetable->keyBy('id')->all();

        // 3. 関連する時間割変更のみを効率的に取得
        $timetableIds = $baseTimetable->pluck('id');
        $timetableChanges = TimetableChange::where('approval', true)
            ->where(function ($query) use ($weekStart, $weekEnd, $timetableIds) {
                // 「変更元」がこのクラスの今週のコマ
                $query->where(function ($q) use ($weekStart, $weekEnd, $timetableIds) {
                    $q->whereIn('before_timetable_id', $timetableIds)
                        ->whereBetween('date', [$weekStart, $weekEnd]);
                });
            })
            // ★ N+1問題を避けるため、ネストしたリレーションも Eager Load
            ->with([
                'beforeTimetable.room', 'beforeTimetable.schoolClass', 'beforeTimetable.subject', 'beforeTimetable.teacher',
                'afterTimetable.room', 'afterTimetable.schoolClass', 'afterTimetable.subject', 'afterTimetable.teacher'
            ])
            ->get();

        // 4. 変更を適用 (★ ロジックを修正)
        foreach ($timetableChanges as $change) {
            // 「変更元」が今週のコマの場合
            if ($change->date->between($weekStart, $weekEnd) && isset($finalTimetableEntries[$change->before_timetable_id])) {
                $originalEntry = $finalTimetableEntries[$change->before_timetable_id];
                $changedEntry = clone $change->afterTimetable; // 変更先情報をコピー

                // 元のdayとlessonを維持する
                $changedEntry->day = $originalEntry->day;
                $changedEntry->lesson = $originalEntry->lesson;
                
                $finalTimetableEntries[$change->before_timetable_id] = $changedEntry;
            }
        }

        // 5. ビュー用の形式に整形
        $timetable = $this->formatTimetableForView(collect($finalTimetableEntries));

        return Inertia::render('Timetable', [
            'user' => $student,
            'date' => $date,
            'monday' => $weekStart,
            'friday' => $weekEnd,
            'base' => $baseTimetable,
            'timetable' => $timetable,
        ]);
    }

    /**
     * 時間割コレクションをビュー用の多次元配列に整形するヘルパーメソッド
     */
    private function formatTimetableForView($timetableCollection): array
    {
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        $lessons = ['lesson_1', 'lesson_2', 'lesson_3', 'lesson_4'];
        $formatted = [];

        // 空の配列で初期化
        foreach ($days as $day) {
            foreach ($lessons as $lesson) {
                $formatted[$day][$lesson] = null;
            }
        }

        // データを埋める
        foreach ($timetableCollection as $entry) {
            if ($entry && isset($entry->day) && isset($entry->lesson)) {
                $formatted[$entry->day][$entry->lesson] = [
                    'room' => $entry->room,
                    'school_class' => $entry->schoolClass,
                    'subject' => $entry->subject,
                    'teacher' => $entry->teacher,
                ];
            }
        }
        return $formatted;
    }

    /**
     * 時間割テンプレートデータの一覧を取得し、Inertia.js コンポーネントで表示します。
     * (このメソッドは、もし /timetables のようなリソースルートがある場合に使用されます)
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request): Response
    {
        $timetables = Timetable::with(['subject', 'room', 'teacher', 'schoolClass'])
            ->orderBy('day')
            ->orderBy('lesson')
            ->get()
            ->groupBy([
                'day',
                'lesson'
            ]);

        // 'Timetables/Index' はフロントエンドのVue/Reactコンポーネントのパスを想定
        return Inertia::render('Timetable', [
            'timetables' => $timetables,
        ]);
    }

    /**
     * 新しい時間割エントリを保存し、完了後にリダイレクトします。
     * (このメソッドは、もし /timetables のようなリソースルートがある場合に使用されます)
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'term' => 'required|in:semester_1,semester_2,full_year',
            'day' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday',
            'lesson' => 'required|in:lesson_1,lesson_2,lesson_3,lesson_4',
            'teacher_id' => 'required|exists:users,id',
            'room_id' => 'required|exists:rooms,id',
            'subject_id' => 'required|exists:subjects,id',
            'school_class_id' => 'required|exists:school_classes,id',
        ]);

        $timetable = Timetable::create($validated);

        // 時間割一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('timetables.index')->with('success', '時間割エントリを登録しました。');
    }

    /**
     * 指定された時間割エントリの詳細をInertia.js コンポーネントで表示します。
     * routes/web.php の Route::get('/timetable', ...) に対応 (timetable.view)
     *
     * @param  \App\Models\Timetable  $timetable // ルートモデルバインディングを使用
     * @return \Inertia\Response
     */
    public function show(Timetable $timetable): Response
    {
        // 関連するモデルをロードしてフロントエンドに渡す
        return Inertia::render('Timetable', [ // 'Timetables/Show' はフロントエンドのVue/Reactコンポーネントのパスを想定
            'timetable' => $timetable->load(['subject', 'room', 'teacher', 'schoolClass']),
        ]);
    }

    /**
     * 指定された時間割エントリを更新し、完了後にリダイレクトします。
     * (このメソッドは、もし /timetables のようなリソースルートがある場合に使用されます)
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $timetable = Timetable::findOrFail($id);

        $validated = $request->validate([
            'term' => 'sometimes|in:semester_1,semester_2,full_year',
            'day' => 'sometimes|in:Monday,Tuesday,Wednesday,Thursday,Friday',
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
                // 重複エラーが発生した場合、エラーメッセージと共にリダイレクト
                return Redirect::route('timetables.index')->with('error', 'この時間割スロットは既に存在します。他のエントリと重複しています。');
            }
        }

        $timetable->update($validated);

        // 時間割一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('timetables.index')->with('success', '時間割エントリを更新しました。');
    }

    /**
     * 指定された時間割エントリを削除し、完了後にリダイレクトします。
     * (このメソッドは、もし /timetables のようなリソースルートがある場合に使用されます)
     *
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(int $id): \Illuminate\Http\RedirectResponse
    {
        $timetable = Timetable::findOrFail($id);
        $timetable->delete();

        // 時間割一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('timetables.index')->with('success', '時間割エントリを削除しました。');
    }
}
