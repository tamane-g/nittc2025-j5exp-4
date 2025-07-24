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
        Schema::create('school_classes', function (Blueprint $table) {
            $table->id();
            $table->integer('grade');
            $table->integer('class');
            $table->timestamps();

            // ★ 複合ユニーク制約を追加
            // 同じ学年とクラスの組み合わせは一意であるべき
            $table->unique(['grade', 'class'], 'unique_grade_class');

            // 複合ユニークインデックスがあれば、以下の単一インデックスは通常不要です。
            // $table->index('grade');
            // $table->index('class');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_classes');
    }
};