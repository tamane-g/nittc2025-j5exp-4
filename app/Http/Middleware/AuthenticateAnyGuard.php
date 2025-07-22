<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateAnyGuard
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // student, teacher, admin のいずれかのGuardで認証済みかチェック
        if (Auth::guard('student')->check() ||
            Auth::guard('teacher')->check() ||
            Auth::guard('admin')->check()) {
            
            // いずれかで認証されていれば、リクエストを次に進める
            return $next($request);
        }

        // どのGuardでも認証されていなければ、リクエストを中断し、
        // Laravelの認証例外ハンドラに処理を任せる（ログインページへリダイレクトされる）
        return redirect()->guest(route('student.login'));
    }
}