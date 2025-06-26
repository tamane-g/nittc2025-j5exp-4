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
        Schema::create('class_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->boolean('is_concurrent');
            $table->date('timetable_change_date');
            $table->boolean('usablility');
            $table->timestamps();
            $table->foreign(['timetable_change_date'])
                  ->references(['change_date'])
                  ->on('timetable_changes_table')
                  ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_rooms');
    }
};
