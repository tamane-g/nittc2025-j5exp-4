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
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['student', 'teacher', 'administrator']);
            $table->integer('school_class_grade');
            $table->integer('school_class_class');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
            
            $table->foreign(['school_class_grade'])
                  ->references(['grade'])
                  ->on('school_classes')
                  ->cascadeOnDelete();
            $table->foreign(['school_class_class'])
                  ->references(['class'])
                  ->on('school_classes')
                  ->cascadeOnDelete();
            });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
