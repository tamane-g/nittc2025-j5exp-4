<?php

namespace App\Http\Controllers;

use App\Models\Timetable;
use App\Models\TimetableChange; // TimetableChangeモデルをインポート
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Authファサードをインポート
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse; // RedirectResponseの型ヒントのために追加
use Carbon\Carbon; // 日付操作のためにCarbonをインポート

class TimetableController extends Controller
{
    /**
     * 指定された日付を含む週の時間割を取得し、変更を反映させて表示します。
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function view(Request $request): Response
    {
        // 1. ログイン中の学生ユーザーを取得
        $student = Auth::user();

        // 学生にクラスが割り当てられているか確認
        if (!$student || !$student->school_class_id) {
            return Redirect::route('home')->with('error', 'クラスが割り当てられていません。');
        }
        $schoolClassId = $student->school_class_id;

        // 2. 日付の検証（dateは任意、なければ今日の日付をデフォルトに）
        $validated = $request->validate([
            'date' => 'nullable|date_format:Y-m-d',
        ]);
        $dateInput = $validated['date'] ?? Carbon::today()->toDateString();
        $targetDate = Carbon::parse($dateInput);


        // 3. 対象となる週の月曜日と金曜日を計算
        $startOfWeek = $targetDate->copy()->startOfWeek(Carbon::MONDAY);
        $endOfWeek = $targetDate->copy()->endOfWeek(Carbon::FRIDAY);

        // 4. 基本となる時間割テンプレートを取得（ログイン中の学生のクラスのもの）
        $baseTimetables = Timetable::with(['subject', 'room', 'teacher'])
            ->where('school_class_id', $schoolClassId)
            ->get()
            ->keyBy(function ($item) {
                return $item->day . '-' . $item->lesson;
            });

        // 5. 指定された週に影響する、承認済みの時間割変更を取得
        $approvedChanges = TimetableChange::with(['beforeTimetable.subject', 'beforeTimetable.teacher', 'afterTimetable.subject', 'afterTimetable.teacher'])
            ->where('approval', true)
            ->where(function ($query) use ($startOfWeek, $endOfWeek) {
                $query->whereBetween('before_date', [$startOfWeek, $endOfWeek])
                      ->orWhereBetween('after_date', [$startOfWeek, $endOfWeek]);
            })
            ->get();

        // 6. 変更を適用するための処理
        $cancellations = [];
        $additions = [];

        foreach ($approvedChanges as $change) {
            if ($change->before_date >= $startOfWeek->toDateString() && $change->before_date <= $endOfWeek->toDateString()) {
                $key = $change->before_date . '-' . $change->beforeTimetable->day . '-' . $change->beforeTimetable->lesson;
                $cancellations[$key] = true;
            }
            if ($change->after_date >= $startOfWeek->toDateString() && $change->after_date <= $endOfWeek->toDateString()) {
                $key = $change->after_date . '-' . $change->afterTimetable->day . '-' . $change->afterTimetable->lesson;
                $additions[$key] = $change;
            }
        }

        // 7. 最終的な週間時間割を構築
        $weeklyTimetable = [];
        $currentDay = $startOfWeek->copy();
        $daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        $lessons = ['lesson_1', 'lesson_2', 'lesson_3', 'lesson_4'];

        foreach ($daysOfWeek as $dayName) {
            $dateStr = $currentDay->toDateString();
            $dailyLessons = [];
            foreach ($lessons as $lessonName) {
                $slot = [
                    'day' => $dayName,
                    'lesson' => $lessonName,
                    'date' => $dateStr,
                    'entry' => null,
                    'is_changed' => false,
                ];

                $additionKey = $dateStr . '-' . $dayName . '-' . $lessonName;
                $cancellationKey = $dateStr . '-' . $dayName . '-' . $lessonName;
                $baseKey = $dayName . '-' . $lessonName;

                if (isset($additions[$additionKey])) {
                    // ★★★ ここが修正点 ★★★
                    // 追加されるコマには、移動「元」の授業内容(beforeTimetable)をセットする
                    $slot['entry'] = $additions[$additionKey]->beforeTimetable;
                    $slot['is_changed'] = true;
                } elseif (isset($cancellations[$cancellationKey])) {
                    $slot['is_changed'] = true;
                } elseif (isset($baseTimetables[$baseKey])) {
                    $slot['entry'] = $baseTimetables[$baseKey];
                }
                
                $dailyLessons[$lessonName] = $slot;
            }
            $weeklyTimetable[$dayName] = $dailyLessons;
            $currentDay->addDay();
        }

        return Inertia::render('Timetable', [
            'weeklyTimetable' => $weeklyTimetable,
            'startDate' => $startOfWeek->toDateString(),
            'endDate' => $endOfWeek->toDateString(),
        ]);
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
        return Inertia::render('Timetables/Index', [
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
    public function store(Request $request): \Illuminate\Http\RedirectResponse
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
    public function update(Request $request, int $id): \Illuminate\Http\RedirectResponse
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
