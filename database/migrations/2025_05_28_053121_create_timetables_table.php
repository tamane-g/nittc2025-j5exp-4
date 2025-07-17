<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('timetables', function (Blueprint $table) {
            $table->id();
            // 学期（1学期, 2学期, 通年）
            $table->enum('term', ['semester_1', 'semester_2', 'full_year']);
            // 曜日（スペルミスを修正）
            $table->enum('day', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
            // 時限
            $table->enum('lesson', ['lesson_1', 'lesson_2', 'lesson_3', 'lesson_4']);
            
            // 外部キー制約
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // 担当教員
            $table->foreignId('room_id')->constrained()->onDelete('cascade'); // 使用教室
            $table->foreignId('subject_id')->constrained()->onDelete('cascade'); // 教科
            $table->foreignId('school_class_id')->constrained()->onDelete('cascade');
            
            $table->timestamps();

            // --- 制約 ---
            // 同じ学期・曜日・時限に、同じ教室や同じ教員が重複して登録されるのを防ぐ
            $table->unique(['term', 'day', 'lesson', 'room_id'], 'timetable_room_unique');
            $table->unique(['term', 'day', 'lesson', 'user_id'], 'timetable_user_unique');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('timetables');
    }
};
