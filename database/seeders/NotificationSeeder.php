<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\UserNotification;
use App\Models\AdminNotification;
use App\Models\TeacherNotification;
use App\Models\SchoolClassNotification;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TeacherNotification::create([
            "teacher_id" => 1,
            "owner" => "神",
            "title" => "世界破滅のお知らせ",
            "description" => "宇宙は終わります。",
        ]);

        UserNotification::create([
            "user_id" => 1,
            "owner" => "たつき諒",
            "title" => "日本終了のお知らせ",
            "description" => "今日、日本に大災害が起こる夢を見ました。",
            "created_at" => '2025-07-05 12:00:00',
        ]);

        SchoolClassNotification::create([
            "school_class_id" => 1,
            "owner" => "校長",
            "title" => "本日は休校です",
            "description" => "学校が爆破されました。今日から無期限の休校とします。",
        ]);
    }
}
