<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Timetable;
use App\Models\SchoolClass;
use App\Models\Teacher; // ★ Userモデルの代わりにTeacherモデルをインポート
use App\Models\Room;
use App\Models\Subject;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TimetableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // --- 準備: 関連するモデルのテストデータを準備 ---
        $schoolClass = SchoolClass::firstOrCreate(
            ['grade' => 1],
            [
                'class'=> 1,
            ]
        );

        // Teachers: 5人いなければループで作成
        if (Teacher::count() < 5) { // ★ UserをTeacherに変更
            for ($i = 1; $i <= 5; $i++) {
                Teacher::firstOrCreate( // ★ UserをTeacherに変更
                    ['email' => "teacher{$i}@example.com"],
                    [
                        'name' => "テスト教師 {$i}",
                        // 'school_class_id' はteachersテーブルにないので削除
                        'password' => Hash::make('password'),
                        'email_verified_at' => now(),
                        'remember_token' => Str::random(10),
                    ]
                );
            }
        }
        $teachers = Teacher::all(); // ★ UserをTeacherに変更

        // Rooms: 5部屋なければ作成
        if (Room::count() < 5) {
            for ($i = 1; $i <= 5; $i++) {
                Room::firstOrCreate(
                    ['name' => "教室 {$i}"],
                    [
                        'is_concurrent' => false, // ★ is_concurrentカラムを追加
                    ]
                );
            }
        }
        $rooms = Room::all();

        // Subjects: 5科目なければ作成
        if (Subject::count() < 5) {
            $subjectNames = ['国語', '数学', '理科', '社会', '英語'];
            foreach ($subjectNames as $name) {
                Subject::firstOrCreate(['name' => $name]);
            }
        }
        $subjects = Subject::all();


        // --- 時間割データの生成 ---

        $term = 'semester_1'; // 対象の学期
        $days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        $lessons = ['lesson_1', 'lesson_2', 'lesson_3', 'lesson_4'];

        // 1年1組の月〜金、1〜4限のデータを生成
        foreach ($days as $day) {
            foreach ($lessons as $lesson) {
                Timetable::firstOrCreate(
                    [
                        'term' => $term,
                        'day' => $day,
                        'lesson' => $lesson,
                        'school_class_id' => $schoolClass->id,
                    ],
                    [
                        'teacher_id' => $teachers->random()->id,
                        'room_id' => $rooms->random()->id,
                        'subject_id' => $subjects->random()->id,
                    ]
                );
            }
        }
    }
}
