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
        Schema::create('count_subject_school_classes', function (Blueprint $table) {
            $table->id();
            // subject_id を明示し、cascadeOnDelete を追加
            $table->foreignId('subject_id')->constrained('subjects')->cascadeOnDelete();
            // school_class_id を明示し、cascadeOnDelete を追加
            $table->foreignId('school_class_id')->constrained('school_classes')->cascadeOnDelete();
            $table->timestamps();

            // ★ 複合ユニーク制約を追加
            // 同じ科目とクラスの組み合わせは一意であるべき
            $table->unique(['subject_id', 'school_class_id'], 'unique_subject_class');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    // 外部キー制約がある場合、dropIfExists の前に外部キーを解除する必要がある場合がありますが、
    // Laravel の最新バージョンでは自動で処理されることが多いです。
    // 必要であれば、以下のように明示的に dropForeign を追加することもできます。
    // Schema::table('count_subject_school_classes', function (Blueprint $table) {
    //     $table->dropForeign(['subject_id']);
    //     $table->dropForeign(['school_class_id']);
    // });
    }
};