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
            $table->enum('day', ['Monday', 'Tuesday', 'Wednseday', 'Thursday', 'Friday']);
            $table->enum('lesson', ['lesson_1', 'lesson_2', 'lesson_3', 'lesson_4']);
            $table->foreignId('user_id')->constrained();
            $table->foreignId('class_room_id')->constrained();
            $table->foreignId('subject_id')->constrained();
            $table->timestamps();
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
