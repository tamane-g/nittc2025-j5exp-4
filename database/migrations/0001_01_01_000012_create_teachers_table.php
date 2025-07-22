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
            // ★ school_class_grade と school_class_class を削除し、
            // ★ school_classes テーブルのプライマリキーを参照する school_class_id を追加
            // 教師が特定のクラスに属する場合、nullable() を外すか、onDelete を cascade/restrict に変更
            $table->foreignId('school_class_id')
                  ->nullable() // 必須でない場合
                  ->constrained('school_classes')
                  ->onDelete('set null'); // クラスが削除されたら、教師のschool_class_idをNULLにする

            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();

            // ★ 以前の個別の外部キー定義は削除
            // $table->foreign(['school_class_grade'])
            //       ->references(['grade'])
            //       ->on('school_classes')
            //       ->cascadeOnDelete();
            // $table->foreign(['school_class_class'])
            //       ->references(['class'])
            //       ->on('school_classes')
            //       ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // ★ Schema::dropIfExists('users'); を Schema::dropIfExists('teachers'); に修正
        Schema::dropIfExists('teachers');
    }
};