<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
        
        $middleware->alias([
            'auth.any' => \App\Http\Middleware\AuthenticateAnyGuard::class,
        ]);

        // この部分を修正します
        $middleware->redirectGuestsTo(function (\Illuminate\Http\Request $request) {
            // アクセスしようとしたURLのパスを取得
            $path = $request->path();

            // パスの先頭部分に応じてリダイレクト先を振り分ける
            if (str_starts_with($path, 'admin')) {
                return route('admin.login');
            }
            
            if (str_starts_with($path, 'teacher')) {
                return route('teacher.login');
            }

            // 上記以外の場合は、デフォルトの生徒ログイン画面へ
            return route('student.login');
        });

        $middleware->redirectUsersTo('/');
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
