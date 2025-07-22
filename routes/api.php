<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\TimetableController;
use App\Http\Controllers\TimetableChangeController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\SchoolClassController;
use App\Http\Controllers\RoomsController;
use App\Http\Controllers\CountSubjectSchoolClassController; // CountSubjectSchoolClassController を使用することを宣言
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// ユーザーリソースの標準的なAPIルートを定義
Route::apiResource('users', UserController::class);

// CSVファイルからのユーザーインポート用のルートを定義
Route::post('/users/import', [UserController::class, 'importCsv']);

// 時間割リソースの標準的なAPIルートを定義
Route::apiResource('timetables', TimetableController::class);

// 時間割変更リソースの標準的なAPIルートを定義
Route::apiResource('timetable-changes', TimetableChangeController::class);

// 時間割変更申請の承認状態を更新するためのカスタムルートを定義
Route::put('timetable-changes/{timetableChange}/approve', [TimetableChangeController::class, 'updateApproval']);

// 科目リソースの標準的なAPIルートを定義
Route::apiResource('subjects', SubjectController::class);

// クラスリソースの標準的なAPIルートを定義
Route::apiResource('school-classes', SchoolClassController::class);

// 教室リソースの標準的なAPIルートを定義
Route::apiResource('rooms', RoomsController::class);

// ★ 科目-クラスカウントリソースの標準的なAPIルートを定義
// これにより以下のルートが自動的に生成されます:
// GET    /api/count-subject-school-classes        -> CountSubjectSchoolClassController@index
// POST   /api/count-subject-school-classes        -> CountSubjectSchoolClassController@store
// GET    /api/count-subject-school-classes/{count_subject_school_class} -> CountSubjectSchoolClassController@show
// PUT    /api/count-subject-school-classes/{count_subject_school_class} -> CountSubjectSchoolClassController@update
// DELETE /api/count-subject-school-classes/{count_subject_school_class} -> CountSubjectSchoolClassController@destroy
Route::apiResource('count-subject-school-classes', CountSubjectSchoolClassController::class);


// ... 他の既存のAPIルートがあればここに追加 ...
