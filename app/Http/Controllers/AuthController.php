<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User; // User モデルを使用
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect; // Redirect のために追加
use Inertia\Inertia; // Inertia.js のレンダリングのため追加
use Inertia\Response; // Inertia.js のレスポンス型ヒントのため追加
use Illuminate\Http\RedirectResponse; // RedirectResponse 型ヒントのため追加
use Illuminate\Validation\ValidationException; // バリデーションエラーのため追加

class AuthController extends Controller
{
    /**
     * ログイン処理を実行します。
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials, $request->boolean('remember'))) { // remember me オプションを追加
            // 認証失敗の場合、エラーメッセージと共にログインページにリダイレクト
            throw ValidationException::withMessages([
                'email' => __('auth.failed'), // Laravelの認証失敗メッセージを使用
            ]);
        }

        // セッションを再生成してセッション固定化攻撃を防ぐ
        $request->session()->regenerate();

        // ログイン成功後、ダッシュボードまたは指定されたホームルートにリダイレクト
        return Redirect::intended(route('dashboard')); // intended は以前アクセスしようとしたURLがあればそこへ、なければ指定されたルートへ
    }

    /**
     * ログアウト処理を実行します。
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // ログアウト後、アプリケーションのトップページまたはログインページにリダイレクト
        return Redirect::to('/'); // トップページにリダイレクト
    }

    /**
     * 認証済みユーザーの情報を取得し、Inertia.js コンポーネントで表示します。
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function me(Request $request): Response
    {
        // 認証済みユーザーの情報を取得
        $user = $request->user();

        // 'Auth/Me' はフロントエンドのVue/Reactコンポーネントのパスを想定
        return Inertia::render('Auth/Me', [
            'user' => $user->load('schoolClass'), // 必要に応じて関連モデルをロード
        ]);
    }

    /**
     * ログインフォームを表示します。
     *
     * @return \Inertia\Response
     */
    public function createLogin(): Response
    {
        return Inertia::render('Auth/Login'); // 'Auth/Login' はフロントエンドのログインコンポーネントを想定
    }
}
