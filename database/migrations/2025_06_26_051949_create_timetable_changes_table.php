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
        Schema::create('timetable_changes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained();
            
            $table->date('before_date');
            $table->foreignId('before_timetable_id')
                  ->constrained('timetables')
                  ->cascadeOnDelete();
            
            $table->date('after_date');
            $table->foreignId('after_timetable_id')
                  ->constrained('timetables')
                  ->cascadeonDelete();
            
            $table->foreignId('room_id')->constrained()->cascadeOnDelete();
            $table->foreignId('school_class_id')->constrained()->cascadeOnDelete();
            
            $table->boolean('approval');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timetable_changes');
    }
};
