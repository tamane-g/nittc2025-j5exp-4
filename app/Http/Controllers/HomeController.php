<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse; // RedirectResponse を use
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        if (Auth::guard('admin')->check()) {
            // 管理者ガードで認証済みの場合
            return Inertia::render('AdminHome');
        }

        if (Auth::guard('teacher')->check()) {
            // 先生ガードで認証済みの場合
            return Inertia::render('TeacherHome');
        }

        if (Auth::guard('student')->check()) {
            // 生徒ガードで認証済みの場合
            return Inertia::render('StudentHome');
        }
        
        return redirect()->route('login');
    }
}
