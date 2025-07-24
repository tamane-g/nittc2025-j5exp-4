<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect; // Redirect のために追加
use Illuminate\Validation\Rule; // Rule クラスを使用するため追加
use Inertia\Inertia; // Inertia.js のレンダリングのため追加
use Inertia\Response; // Inertia.js のレスポンス型ヒントのため追加

class SubjectController extends Controller
{
    /**
     * 科目の一覧を取得し、Inertia.js コンポーネントで表示します。
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        $subjects = Subject::all();

        // 'Subjects/Index' はフロントエンドのVue/Reactコンポーネントのパスを想定
        return Inertia::render('Subjects/Index', [
            'subjects' => $subjects,
        ]);
    }

    /**
     * 新しい科目を保存し、完了後にリダイレクトします。
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:20|unique:subjects,name',
        ]);

        $subject = Subject::create($validated);

        // 科目一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('subjects.index')->with('success', '科目を登録しました。');
    }

    /**
     * 指定された科目を更新し、完了後にリダイレクトします。
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, int $id): \Illuminate\Http\RedirectResponse
    {
        $subject = Subject::findOrFail($id);

        $validated = $request->validate([
            'name' => [
                'sometimes',
                'string',
                'max:20',
                Rule::unique('subjects')->ignore($subject->id),
            ],
        ]);

        $subject->update($validated);

        // 科目一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('subjects.index')->with('success', '科目を更新しました。');
    }

    /**
     * 指定された科目を削除し、完了後にリダイレクトします。
     *
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(int $id): \Illuminate\Http\RedirectResponse
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        // 科目一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('subjects.index')->with('success', '科目を削除しました。');
    }
}
