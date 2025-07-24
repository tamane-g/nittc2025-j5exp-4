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
            $table->foreignId('teacher_id')->constrained()->onDelete('restrict');

            $table->date('date');
            // 変更前の時間割エントリへの参照。
            // 参照先の時間割が削除されたら、変更履歴も削除。
            $table->foreignId('before_timetable_id')
                  ->constrained('timetables')
                  ->cascadeOnDelete();
            // 変更後の時間割エントリへの参照。
            // 参照先の時間割が削除されたら、変更履歴も削除。
            $table->foreignId('after_timetable_id')
                  ->nullable()
                  ->constrained('timetables')
                  ->cascadeOnDelete();

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