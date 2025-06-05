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
            $table->date('original_date');
            $table->integer('original_time');
            $table->date('updated_date');
            $table->integer('original_time');
            $table->boolean('approval');
            $table->integer('class_room_id');
            $table->timestamps();

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
        Schema::dropIfExists('timetable_changes');
    }
};
