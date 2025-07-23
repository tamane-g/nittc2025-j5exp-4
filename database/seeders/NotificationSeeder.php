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
        TeacherNotification::firstOrCreate([
            "teacher_id" => 1,
        ]);
    }
}
