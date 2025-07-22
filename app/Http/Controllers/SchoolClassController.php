<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect; // Redirect のために追加
use Illuminate\Validation\Rule; // Rule クラスを使用するため追加
use Inertia\Inertia; // Inertia.js のレンダリングのため追加
use Inertia\Response; // Inertia.js のレスポンス型ヒントのため追加
use Illuminate\Http\RedirectResponse; // RedirectResponse 型ヒントのため追加

class SchoolClassController extends Controller
{
    /**
     * クラスの一覧を取得し、Inertia.js コンポーネントで表示します。
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        $schoolClasses = SchoolClass::all();

        // 'SchoolClasses/Index' はフロントエンドのVue/Reactコンポーネントのパスを想定
        return Inertia::render('SchoolClasses/Index', [
            'schoolClasses' => $schoolClasses,
        ]);
    }

    /**
     * 新しいクラスを保存し、完了後にリダイレクトします。
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'grade' => [
                'required',
                'integer',
                'min:1',
                'max:6',
                // 複合ユニーク制約のバリデーションを追加
                // 同じ学年とクラスの組み合わせは一意であるべき
                Rule::unique('school_classes')->where(function ($query) use ($request) {
                    return $query->where('class', $request->class);
                }),
            ],
            'class' => 'required|integer|min:1|max:10',
        ]);

        $schoolClass = SchoolClass::create($validated);

        // クラス一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('school-classes.index')->with('success', 'クラスを登録しました。');
    }

    /**
     * 指定されたクラスを更新し、完了後にリダイレクトします。
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $schoolClass = SchoolClass::findOrFail($id);

        $validated = $request->validate([
            'grade' => [
                'sometimes', // リクエストに含まれていればバリデーション
                'integer',
                'min:1',
                'max:6',
                // 更新時は自分自身の組み合わせはユニークチェックから除外
                Rule::unique('school_classes')->where(function ($query) use ($request, $schoolClass) {
                    return $query->where('class', $request->class ?? $schoolClass->class);
                })->ignore($schoolClass->id),
            ],
            'class' => 'sometimes|integer|min:1|max:10',
        ]);

        $schoolClass->update($validated);

        // クラス一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('school-classes.index')->with('success', 'クラスを更新しました。');
    }

    /**
     * 指定されたクラスを削除し、完了後にリダイレクトします。
     *
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(int $id): RedirectResponse
    {
        $class = SchoolClass::findOrFail($id);
        $class->delete();

        // クラス一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('school-classes.index')->with('success', 'クラスを削除しました。');
    }
}
