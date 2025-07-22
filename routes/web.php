<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TimetableController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ログイン・認証済みのみアクセス可能
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', HomeController::class)->name('home');
});

// 認証済み学生のみアクセス可能
Route::middleware(['auth:student', 'verified'])->group(function () {
    Route::get('/timetable', [TimetableController::class, 'index']);
});

require __DIR__.'/auth.php';
Route::prefix('teacher')->name('teacher.')->group(function(){
    require __DIR__.'/teacher.php';
});
Route::prefix('admin')->name('admin.')->group(function(){
    require __DIR__.'/admin.php';
});