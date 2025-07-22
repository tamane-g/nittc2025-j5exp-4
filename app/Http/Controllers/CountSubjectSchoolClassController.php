<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CountSubjectSchoolClass;
use Illuminate\Validation\Rule; // Rule クラスを使用するため追加
use Illuminate\Support\Facades\Redirect; // Redirect のために追加
use Inertia\Inertia; // Inertia.js のレンダリングのため追加
use Inertia\Response; // Inertia.js のレスポンス型ヒントのため追加
use Illuminate\Http\RedirectResponse; // RedirectResponse 型ヒントのため追加


// コントローラ名を規約に合わせて変更
class CountSubjectSchoolClassController extends Controller // ★ クラス名を修正（RoomsControllerに合わせて、単数形CountSubjectSchoolClassControllerに）
{
    /**
     * 科目とクラスの関連付けデータの一覧を取得し、Inertia.js コンポーネントで表示します。
     * 関連する科目名とクラス名もロードします。
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request): Response // 戻り値の型ヒントを追加
    {
        // with() を使って関連するSubjectとSchoolClassのデータをロード
        $data = CountSubjectSchoolClass::with(['subject', 'schoolClass'])->get();

        // 'CountSubjectSchoolClasses/Index' はフロントエンドのVue/Reactコンポーネントのパスを想定
        return Inertia::render('CountSubjectSchoolClasses/Index', [
            'data' => $data, // 'data' としてフロントエンドに渡す
        ]);
    }

    /**
     * 新しい科目とクラスの関連付けデータを保存し、完了後にリダイレクトします。
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse // 戻り値の型ヒントを追加
    {
        $validated = $request->validate([
            'subject_id' => [
                'required',
                'exists:subjects,id',
                // 複合ユニーク制約のバリデーションを追加
                Rule::unique('count_subject_school_classes')->where(function ($query) use ($request) {
                    return $query->where('school_class_id', $request->school_class_id);
                }),
            ],
            'school_class_id' => 'required|exists:school_classes,id',
            'count' => 'required|integer|min:0',
        ]);

        $record = CountSubjectSchoolClass::create($validated);

        // 科目-クラスカウント一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('count-subject-school-classes.index')->with('success', 'データを登録しました。');
    }

    /**
     * 指定された科目とクラスの関連付けデータを更新し、完了後にリダイレクトします。
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, int $id): \Illuminate\Http\RedirectResponse // 戻り値の型ヒントを追加
    {
        $record = CountSubjectSchoolClass::findOrFail($id);

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

        // 科目-クラスカウント一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('count-subject-school-classes.index')->with('success', 'データを更新しました。');
    }

    /**
     * 指定された科目とクラスの関連付けデータを削除し、完了後にリダイレクトします。
     *
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(int $id): \Illuminate\Http\RedirectResponse // 戻り値の型ヒントを追加
    {
        $record = CountSubjectSchoolClass::findOrFail($id);
        $record->delete();

        // 科目-クラスカウント一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('count-subject-school-classes.index')->with('success', 'データを削除しました。');
    }
}
