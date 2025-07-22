<?php

use App\Http\Controllers\UserController;
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
// これにより以下のルートが自動的に生成されます:
// GET    /api/users        -> UserController@index
// POST   /api/users        -> UserController@store
// GET    /api/users/{user} -> UserController@show
// PUT    /api/users/{user} -> UserController@update
// DELETE /api/users/{user} -> UserController@destroy
Route::apiResource('users', UserController::class);

// CSVファイルからのユーザーインポート用のルートを定義
// POSTリクエストで /api/users/import にアクセスすると、
// UserController の importCsv メソッドが実行されます。
Route::post('/users/import', [UserController::class, 'importCsv']);


