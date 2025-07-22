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
            // 変更を申請した教師への外部キー。
            // 教師が削除された場合に、関連する変更履歴を残すため 'restrict' を推奨。
            $table->foreignId('teacher_id')->constrained('users')->onDelete('restrict');

            $table->date('before_date');
            // 変更前の時間割エントリへの参照。
            // 参照先の時間割が削除されたら、変更履歴も削除。
            $table->foreignId('before_timetable_id')
                  ->constrained('timetables')
                  ->onDelete('cascade');

            $table->date('after_date');
            // 変更後の時間割エントリへの参照。
            // 参照先の時間割が削除されたら、変更履歴も削除。
            $table->foreignId('after_timetable_id')
                  ->constrained('timetables')
                  ->onDelete('cascade');

            // 変更が関連する部屋への参照。
            // 部屋が削除された場合に、関連する変更履歴も削除。
            $table->foreignId('room_id')->constrained('rooms')->onDelete('cascade');

            // 変更が関連するクラスへの参照。
            // クラスが削除された場合に、関連する変更履歴も削除。
            $table->foreignId('school_class_id')->constrained('school_classes')->onDelete('cascade');

            $table->boolean('approval'); // 変更の承認状態

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