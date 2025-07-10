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
            $table->foreignId('user_id')->constrained();
            
            $table->date('before_date');
            $table->foreign('before_timetable_id')
                  ->references('id')
                  ->on('timetables')
                  ->onDelete('set null');
                  
            $table->date('after_date');
            $table->foreign('after_timetable_id')
                  ->references('id')
                  ->on('timetables')
                  ->onDelete('cascade');
                  
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
