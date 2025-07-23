<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // 他のSeederがあればここにある
            UserSeeder::class, // ★ この行を追加
            TimetableSeeder::class, // ★ この行を追加
            TimetableChangeSeeder::class, // ★ この行を追加
            NotificationSeeder::class,
            // TeacherSeeder::class, // 必要に応じて他のSeederも追加
            // AdminSeeder::class,
        ]);
    }
}
