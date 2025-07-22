<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User; // Userモデルをインポート
use App\Models\Teacher;
use App\Models\Admin;
use App\Models\SchoolClass; // SchoolClassモデルをインポート
use Illuminate\Support\Facades\Hash; // パスワードのハッシュ化のためにインポート

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // --- 準備: 外部キー制約を満たすためのSchoolClassを作成 ---
        // firstOrCreateを使い、もし '1年1組' がなければ作成し、あれば取得する
        $schoolClass = SchoolClass::firstOrCreate(
            ['grade' => 1],
            [
                'class'=> 1,
            ]
        );

        // --- 1. 特定のテストユーザーを作成 ---
        // ログインして動作確認しやすいように、決まった情報のユーザーを1人作成
        User::create([
            'name' => 'testStudent',
            'school_class_id' => $schoolClass->id, // 上で作成/取得したクラスのIDを指定
            'email' => 'student@example.com',
            'email_verified_at' => now(), // メール認証済みとする
            'password' => Hash::make('password'), // 'password' という文字列でログインできる
            'remember_token' => \Illuminate\Support\Str::random(10),
        ]);

        Teacher::create([
            'name' => 'testTeacher',
            'email' => 'teacher@example.com',
            'email_verified_at' => now(), // メール認証済みとする
            'password' => Hash::make('password'), // 'password' という文字列でログインできる
            'remember_token' => \Illuminate\Support\Str::random(10),
        ]);

        Admin::create([
            'name' => 'testAdmin',
            'email' => 'admin@example.com',
            'email_verified_at' => now(), // メール認証済みとする
            'password' => Hash::make('password'), // 'password' という文字列でログインできる
            'remember_token' => \Illuminate\Support\Str::random(10),
        ]);
    }
}
