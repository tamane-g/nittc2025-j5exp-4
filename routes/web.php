<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TimetableChangeController;
use App\Http\Controllers\TimetableController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ログイン・認証済みのみアクセス可能
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', HomeController::class)->name('home');
    Route::get('/language', [LanguageController::class, 'index'])->name('language.view');
    Route::post('/language', [LanguageController::class, 'change'])->name('language.change');
});

// 認証済み学生のみアクセス可能
Route::middleware(['auth:student', 'verified'])->group(function () {
    Route::get('/timetable', [TimetableController::class, 'show'])->name('timetable.view');
    Route::get('/notice', [UserController::class, 'notice'])->name('student.notice');
});

// 認証済み教育のみアクセス可能
Route::middleware(['auth:teacher', 'verified'])->group(function () {
    Route::get('/change', [TimetableChangeController::class, 'show'])->name('timetablechange.view');
    Route::post('/change', [TimetableChangeController::class, 'store'])->name('timetablechange.store');
    Route::get('/notice', [TeacherController::class, 'notice'])->name('teacher.notice');
    
});

// 認証済み管理者のみアクセス可能
Route::middleware(['auth:student', 'verified'])->group(function () {
    Route::get('/change', [TimetableChangeController::class, 'index'])->name('timetablechange.index');
    Route::post('/change', [TimetableChangeController::class, 'approve'])->name('timetablechange.approve');
    Route::get('/regist', [UserController::class, 'regist'])->name('regist.view');
    Route::post('/regist', [UserController::class, 'import'])->name('regist.import');
    Route::get('/remove', [UserController::class, 'remove'])->name('remove.view');
    Route::get('/remove', [UserController::class, 'delete'])->name('remove.import');
    
});

require __DIR__.'/auth.php';
Route::prefix('teacher')->name('teacher.')->group(function(){
    require __DIR__.'/teacher.php';
});
Route::prefix('admin')->name('admin.')->group(function(){
    require __DIR__.'/admin.php';
});