<?php

namespace App\Http\Controllers;

use App\Models\Timetable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect; // Redirect のために追加
use Illuminate\Validation\ValidationException; // ValidationException を使用するため追加
use Illuminate\Validation\Rule; // Rule クラスを使用するため追加
use Inertia\Inertia; // Inertia.js のレンダリングのため追加
use Inertia\Response; // Inertia.js のレスポンス型ヒントのため追加

class TimetableController extends Controller
{
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
        return Inertia::render('Timetables/Show', [ // 'Timetables/Show' はフロントエンドのVue/Reactコンポーネントのパスを想定
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
