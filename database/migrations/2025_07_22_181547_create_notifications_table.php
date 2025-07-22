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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id(); // UUIDではなくシンプルな自動増分IDを使用（ご要望に合わせて変更）

            // ★ teacher_id を追加 (users テーブルへの外部キー)
            // 教師が削除された場合にお知らせも削除されるように cascadeOnDelete を設定
            $table->foreignId('teacher_id')->constrained('users')->cascadeOnDelete();

            $table->string('heading', 255); // ★ 見出し (heading) カラム
            $table->text('description')->nullable(); // ★ description カラム (任意)
            $table->date('notification_date'); // ★ date カラム (お知らせの特定の日付)

            $table->timestamp('read_at')->nullable(); // ★ 既読日時 (read) カラム - NULLなら未読、タイムスタンプなら既読
            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
