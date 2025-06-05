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
            $table->enum('term', ['semester_1', 'semester_2', 'full_year'])
            $table->enum('day', ['Monday', 'Tuesday', 'Wednseday', 'Thursday', 'Friday']);
            $table->enum('lesson', ['lesson_1', 'lesson_2', 'lesson_3', 'lesson_4']);
            $table->integer('grade');
            $table->integer('class');
            $table->string('subject', 20);
            $table->string('teacher', 20);
            $table->string('classroom', 20);
            $table->timestamps();
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
