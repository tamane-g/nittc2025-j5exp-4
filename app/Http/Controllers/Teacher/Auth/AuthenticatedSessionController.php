<?php

namespace App\Http\Controllers\Teacher\Auth;

use App\Http\Controllers\Controller;
// LoginRequestは使わないので、Requestに変更
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException; // エラー送出用にインポート
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Teacher/Auth/Login', [
            'canResetPassword' => Route::has('teacher.password.request'),
            'status' => session('status'),
            // ログインページに自分がどのGuardかを教えてあげる
            'guard' => 'teacher',
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request): RedirectResponse
    {
        // 1. バリデーションをここで行う
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // 2. 'teacher' Guardを明示的に指定して認証を試行
        if (! Auth::guard('teacher')->attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            // 3. 認証失敗時はValidationExceptionを投げる
            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }
        
        // 4. 認証成功時はセッションを再生成
        $request->session()->regenerate();

        // 5. 先生用のダッシュボードなどにリダイレクト
        return redirect()->intended(route('home')); // 'teacher.dashboard'は適切なルート名に変更してください
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        // この部分は正しく 'teacher' Guardを指定できている
        Auth::guard('teacher')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
