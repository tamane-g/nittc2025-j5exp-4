<?php
 
namespace App\Http\Controllers;

use App\Models\Timetable; // Timetable モデルを使用するため追加
use App\Models\TimetableChange;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect; // Redirect のために追加
use Illuminate\Validation\ValidationException; // ValidationException を使用するため追加
use Illuminate\Validation\Rule; // Rule クラスを使用するため追加
use Inertia\Inertia; // Inertia.js のレンダリングのため追加
use Inertia\Response; // Inertia.js のレスポンス型ヒントのため追加
use Illuminate\Http\RedirectResponse; // RedirectResponse 型ヒントのため追加

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
        // 'TimetableChanges/Index' はフロントエンドのVue/Reactコンポーネントのパスを想定
        return Inertia::render('Admin');
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
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'before_timetable_id' => 'required|exists:timetables,id',
            'after_timetable_id' => 'required|exists:timetables,id',
        ]);

        // 提案された変更後の時間割エントリを取得
        $afterTimetableEntry = Timetable::findOrFail($validated['after_timetable_id']);

        // 重複チェックの実行
        try {
            $this->checkOverlap(
                null,
                $validated['date'],
                $validated['lesson'],
                $validated['teacher_id'],
                $afterTimetableEntry->room->id,
                $afterTimetableEntry->schoolClass->id,
            );
        } catch (ValidationException $e) {
            return Redirect::route('timetablechange.view') // 教師の申請フォームページにリダイレクト
                ->with('error', '時間割変更の申請中に重複エラーが発生しました。')
                ->withErrors($e->errors());
        }
 
        $change = TimetableChange::create($validated);

        // 時間割変更申請フォームページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('timetablechange.view')->with('success', '時間割変更申請を登録しました。');
    }

    /**
     * 特定の時間割変更申請の詳細をInertia.js コンポーネントで表示します。
     * routes/web.php の Route::get('/change', ...) に対応 (timetablechange.view)
     *
     * @param  \App\Models\TimetableChange  $timetableChange // ルートモデルバインディングを使用
     * @return \Inertia\Response
     */
    public function show(TimetableChange $timetableChange): Response
    {
        // 指定されたIDの申請データをリレーションと共に読み込む
        return Inertia::render('TimetableClick', [ // 'TimetableChanges/Show' はフロントエンドのVue/Reactコンポーネントのパスを想定
            'timetableChange' => $timetableChange->load([
                'teacher',
                'beforeTimetable',
                'afterTimetable'
            ]),
        ]);
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
    public function update(Request $request, TimetableChange $timetableChange): RedirectResponse
    {
        $validated = $request->validate([
            'teacher_id' => 'sometimes|exists:users,id',
            'date' => 'sometimes|date',
            'before_timetable_id' => 'sometimes|nullable|exists:timetables,id',
            'after_timetable_id' => 'sometimes|exists:timetables,id',
            'approval' => 'sometimes|boolean',
        ]);

        // 更新後の after_timetable_id がリクエストに含まれている場合は、その時間割エントリを取得
        // そうでない場合は、現在の timetableChange の after_timetable_id を使用
        $afterTimetableEntryId = $validated['after_timetable_id'] ?? $timetableChange->after_timetable_id;
        $afterTimetableEntry = Timetable::findOrFail($afterTimetableEntryId);

        // 重複チェックの実行 (更新時は自身のIDを除外)
        try {
            $this->checkOverlap(
                $timetableChange->id,
                $validated['date'],
                $validated['lesson'],
                $validated['teacher_id'],
                $afterTimetableEntry->room->id,
                $afterTimetableEntry->schoolClass->id,
            );
        } catch (ValidationException $e) {
            return Redirect::route('timetablechange.index') // 管理者の一覧ページにリダイレクト
                ->with('error', '時間割変更の更新中に重複エラーが発生しました。')
                ->withErrors($e->errors());
        }
 
        $timetableChange->update($validated);

        // 時間割変更申請一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('timetablechange.index')->with('success', '時間割変更申請を更新しました。');
    }
 
    /**
     * 時間割変更申請を承認または拒否します。
     * routes/web.php の Route::post('/change', ...) に対応 (timetablechange.approve)
     * (管理者のみアクセス)
     *
     * @param  \Illuminate\Http\Request  $request!
     * @return \Illuminate\Http\RedirectResponse
     */
    public function approve(Request $request): RedirectResponse // approve メソッドとして定義
    {
        $validated = $request->validate([
            'id' => 'required|integer|exists:timetable_changes,id',
            'approval' => 'required|boolean',
        ]);

        TimetableChange::findOrFail($validated['id'])->update($validated);

        // 時間割変更申請一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('timetablechange.index')->with('success', '時間割変更申請の承認状態を更新しました。');
    }

    /**
     * 時間割変更申請を削除し、完了後にリダイレクトします。
     * (このメソッドは、もし /timetable-changes/{id} のようなリソースルートがある場合に使用されます)
     *
     * @param  \App\Models\TimetableChange  $timetableChange
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(TimetableChange $timetableChange): RedirectResponse
    {
        $timetableChange->delete();

        // 時間割変更申請一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('timetablechange.index')->with('success', '時間割変更申請を削除しました。');
    }

    /**
     * 提案された時間割変更が既存の変更と重複していないかチェックします。
     * (プライベートヘルパーメソッド)
     *
     * @param int|null $currentChangeId 現在更新中の変更ID (新規作成時はnull)
     * @param string $day 変更後の曜日 (Timetableから取得)
     * @param string $lesson 変更後の時限 (Timetableから取得)
     * @param string $term 変更後の学期 (Timetableから取得)
     * @param int $teacherId 変更後の教師ID
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function checkOverlap(
        ?int $currentChangeId,
        string $date,
        string $lesson,
        int $teacherId,
        int $roomId,
        int $schoolClassId,
    ): void {
        // 同じ日の同じ時間帯の変更を検索
        $query = TimetableChange::where('date', $date)
            ->whereHas('afterTimetable', function ($query) use ($day, $lesson, $term) {
                $query->where('lesson', $lesson);
            })
            ->with(['afterTimetable.room', 'afterTimetable.schoolClass', 'afterTimetable.teacher']);

        // 更新の場合、自分自身のレコードは重複チェックから除外
        if ($currentChangeId !== null) {
            $query->where('id', '!=', $currentChangeId);
        }
 
        $overlappingChanges = $query->get();
 
        foreach ($overlappingChanges as $change) {
            $errors = [];
 
            // 教師の重複チェック
            if ($change->afterTimetable->teacher->id === $teacherId) {
                $errors['teacher_id'] = 'この教師は、指定された日時・時限に既に他の変更が申請/承認されています。';
            }
            // 部屋の重複チェック
            if ($change->afterTimetable->room->id === $roomId) {
                $errors['room_id'] = 'この部屋は、指定された日時・時限に既に他の変更が申請/承認されています。';
            }
            // クラスの重複チェック
            if ($change->afterTimetable->schoolClass->id === $schoolClassId) {
                $errors['school_class_id'] = 'このクラスは、指定された日時・時限に既に他の変更が申請/承認されています。';
            }
 
            if (!empty($errors)) {
                throw ValidationException::withMessages($errors);
            }
        }
    }
}