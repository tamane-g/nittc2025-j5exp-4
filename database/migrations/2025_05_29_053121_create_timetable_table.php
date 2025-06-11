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
        Schema::create('timetable', function (Blueprint $table) {
            $table->enum('term', ['semester_1', 'semester_2', 'full_year']);
            $table->enum('day', ['Monday', 'Tuesday', 'Wednseday', 'Thursday', 'Friday']);
            $table->enum('lesson', ['lesson_1', 'lesson_2', 'lesson_3', 'lesson_4']);
            $table->integer('grade');
            $table->integer('class');
            $table->string('teacher', 20);
            $table->integer('class_room_id');
            $table->integer('subject_id');
            $table->timestamps();

            $table->foreign(['subject_id'])
                  ->references(['id'])
                  ->on('subject')
                  ->cascadeOnDelete();
            $table->foreign(['class_room_id'])
                  ->references(['id'])
                  ->on('class_rooms')
                  ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timetable');
    }
};
