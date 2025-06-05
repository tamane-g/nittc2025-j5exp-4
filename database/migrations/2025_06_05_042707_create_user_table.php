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
        Schema::create('user', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['student', 'teacher', 'administrator']);
            $table->string('name', 30);
            $table->integer('timetable_grade');
            $table->integer('timetable_class');
            $table->string('mail_address', 30);
            $table->string('password', 30);
            $table->timestamps();

            $table->foreign(['timetable_grade'])
                  ->references(['grade'])
                  ->on('timetable')
                  ->cascadeOnDelete();
            $table->foreign(['timetable_class'])
                  ->references(['class'])
                  ->on('timetable')
                  ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user');
    }
};
