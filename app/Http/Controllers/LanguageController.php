<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse; // RedirectResponse を use
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LanguageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        if (Auth::guard()->check()) {
            return Inertia::render('Language');
        }
        return redirect()->route('login');
    }
}
