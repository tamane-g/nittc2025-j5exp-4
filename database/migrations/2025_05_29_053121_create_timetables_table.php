<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('timetables', function (Blueprint $table) {
            $table->id();
            $table->enum('term', ['semester_1', 'semester_2', 'full_year']);
            $table->enum('day', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']); // ★ Wednseday を Wednesday に修正
            $table->enum('lesson', ['lesson_1', 'lesson_2', 'lesson_3', 'lesson_4']);
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->onDelete('restrict'); // テーブル名を明示し、onDeleteをrestrictに
            $table->foreignId('room_id')->nullable()->constrained('rooms')->onDelete('restrict'); // テーブル名を明示し、onDeleteをrestrictに
            $table->foreignId('subject_id')->nullable()->constrained('subjects')->onDelete('restrict'); // テーブル名を明示し、onDeleteをrestrictに
            $table->foreignId('school_class_id')->constrained('school_classes')->onDelete('restrict'); // テーブル名を明示し、onDeleteをrestrictに
            $table->timestamps();

            // ★ 複合ユニーク制約を追加
            // 同じ学期、曜日、時限、クラスに対して一つの時間割エントリのみを許可
            $table->unique(['term', 'day', 'lesson', 'school_class_id'], 'unique_timetable_slot');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timetables');
    }
};