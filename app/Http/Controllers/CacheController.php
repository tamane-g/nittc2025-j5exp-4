<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cache; // Cache モデルを使用
use Illuminate\Support\Facades\Redirect; // Redirect のために追加
use Illuminate\Validation\Rule; // Rule クラスを使用するため追加
use Inertia\Inertia; // Inertia.js のレンダリングのため追加
use Inertia\Response; // Inertia.js のレスポンス型ヒントのため追加
use Illuminate\Http\RedirectResponse; // RedirectResponse 型ヒントのため追加

class CacheController extends Controller
{
    /**
     * キャッシュエントリの一覧を取得し、Inertia.js コンポーネントで表示します。
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        // Cache モデルに key, value, expiration, owner が直接カラムとして存在すると仮定
        // もし owner が users テーブルへのリレーションである場合は、with('owner') を追加してください。
        $caches = Cache::all();

        // 'Caches/Index' はフロントエンドのVue/Reactコンポーネントのパスを想定
        return Inertia::render('Caches/Index', [
            'caches' => $caches,
        ]);
    }

    /**
     * 新しいキャッシュエントリを保存し、完了後にリダイレクトします。
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:caches,key', // keyはユニークで必須
            'value' => 'required|string', // valueは文字列として保存
            'expiration' => 'nullable|integer', // expirationはUnixタイムスタンプを想定（任意）
            'owner' => 'nullable|string|max:255', // ownerは文字列として保存（任意）
        ]);

        $cache = Cache::create($validated);

        // キャッシュ一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('caches.index')->with('success', 'キャッシュを保存しました。');
    }

    /**
     * 特定のキャッシュエントリの詳細をInertia.js コンポーネントで表示します。
     *
     * @param  \App\Models\Cache  $cache
     * @return \Inertia\Response
     */
    public function show(Cache $cache): Response
    {
        // 'Caches/Show' はフロントエンドのVue/Reactコンポーネントのパスを想定
        return Inertia::render('Caches/Show', [
            'cache' => $cache,
        ]);
    }

    /**
     * 指定されたキャッシュエントリを更新し、完了後にリダイレクトします。
     *
     * @param Request $request
     * @param \App\Models\Cache $cache
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Cache $cache): RedirectResponse
    {
        $validated = $request->validate([
            'key' => ['sometimes', 'string', 'max:255', Rule::unique('caches', 'key')->ignore($cache->id)],
            'value' => 'sometimes|string',
            'expiration' => 'sometimes|nullable|integer',
            'owner' => 'sometimes|nullable|string|max:255',
        ]);

        $cache->update($validated);

        // キャッシュ一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('caches.index')->with('success', 'キャッシュを更新しました。');
    }

    /**
     * 指定されたキャッシュエントリを削除し、完了後にリダイレクトします。
     *
     * @param \App\Models\Cache $cache
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Cache $cache): RedirectResponse
    {
        $cache->delete();

        // キャッシュ一覧ページにリダイレクトし、成功メッセージをフラッシュ
        return Redirect::route('caches.index')->with('success', 'キャッシュを削除しました。');
    }
}
