<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\TimetableChangeController;
use App\Http\Controllers\TimetableController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// ログイン・認証済みのみアクセス可能
Route::middleware(['auth.any'])->group(function () {
    Route::get('/', HomeController::class)->name('home'); // StudentHome
    Route::get('/language', LanguageController::class)->name('language.view'); // Language
});

// 認証済み学生のみアクセス可能
Route::prefix('student')->name('student.')
    ->middleware(['auth:student'])->group(function () {
    Route::get('/timetable', [TimetableController::class, 'view'])->name('timetable.view'); // Timetable
    Route::get('/notice', [UserController::class, 'notice'])->name('notice'); // StudentNotification
});

// 認証済み教師のみアクセス可能
Route::prefix('teacher')->name('teacher.')
    ->middleware(['auth:teacher'])->group(function () {
    Route::get('/timetable', [TimetableController::class, 'teacherView'])->name('timetable.view'); // Timetable
    Route::get('/change', [TimetableController::class, 'teacherChangeView'])->name('timetablechange.view');
    Route::post('/change', [TimetableChangeController::class, 'store'])->name('timetablechange.store');
    Route::get('/notice', [TeacherController::class, 'notice'])->name('notice');
});

// 認証済み管理者のみアクセス可能
Route::prefix('admin')->name('admin.')
    ->middleware(['auth:admin'])->group(function () {
    Route::get('/change', [TimetableChangeController::class, 'index'])->name('timetablechange.index');
    Route::post('/change', [TimetableChangeController::class, 'approve'])->name('timetablechange.approve');
    Route::get('/regist', [UserController::class, 'regist'])->name('regist.view');
    Route::post('/regist', [UserController::class, 'import'])->name('regist.import');
    Route::get('/remove', [UserController::class, 'remove'])->name('remove.view');
    Route::post('/remove', [UserController::class, 'delete'])->name('remove.import');
});

Route::prefix('student')->name('student.')->group(function(){
    require __DIR__.'/auth.php';
});
Route::prefix('teacher')->name('teacher.')->group(function(){
    require __DIR__.'/teacher.php';
});
Route::prefix('admin')->name('admin.')->group(function(){
    require __DIR__.'/admin.php';
});