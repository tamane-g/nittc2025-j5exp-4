<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TimetableChange;
use App\Models\Timetable;
use App\Models\User; // 教師役としてUserモデルを使用
use Carbon\Carbon; // 日付操作のためにCarbonをインポート

class TimetableChangeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // --- 準備: 関連するモデルのデータを取得 ---
        $teachers = User::all();
        $timetables = Timetable::all();

        // 必要なデータがなければ処理を中断
        if ($teachers->isEmpty() || $timetables->count() < 2) {
            $this->command->info('Skipping TimetableChangeSeeder: Not enough teachers or timetables found.');
            return;
        }

        // --- 時間割変更申請データの生成 (3件作成) ---

        // 1件目: 承認済みの申請
        $beforeSlot1 = $timetables->random();
        // ★ 変更前の時間割の曜日に合わせて、直近の該当日付を生成
        $beforeDate1 = Carbon::parse('next ' . $beforeSlot1->day)->toDateString();

        $afterSlot1 = $timetables->where('id', '!=', $beforeSlot1->id)->random();
        // ★ 変更後の時間割の曜日に合わせて、翌週の該当日付を生成
        $afterDate1 = Carbon::parse('next ' . $afterSlot1->day)->addWeek()->toDateString();

        TimetableChange::create([
            'teacher_id' => $teachers->random()->id,
            'before_date' => $beforeDate1,
            'before_timetable_id' => $beforeSlot1->id,
            'after_date' => $afterDate1,
            'after_timetable_id' => $afterSlot1->id,
            'approval' => true, // 承認済み
        ]);

        // 2件目: 未承認（申請中）の申請
        $beforeSlot2 = $timetables->random();
        // ★ 変更前の時間割の曜日に合わせて、直近の該当日付を生成
        $beforeDate2 = Carbon::parse('next ' . $beforeSlot2->day)->toDateString();

        $afterSlot2 = $timetables->where('id', '!=', $beforeSlot2->id)->random();
        // ★ 変更後の時間割の曜日に合わせて、翌週の該当日付を生成
        $afterDate2 = Carbon::parse('next ' . $afterSlot2->day)->addWeek()->toDateString();
        
        TimetableChange::create([
            'teacher_id' => $teachers->random()->id,
            'before_date' => $beforeDate2,
            'before_timetable_id' => $beforeSlot2->id,
            'after_date' => $afterDate2,
            'after_timetable_id' => $afterSlot2->id,
            'approval' => false, // 未承認
        ]);

        // 3件目: 別の未承認（申請中）の申請
        $beforeSlot3 = $timetables->random();
        // ★ 変更前の時間割の曜日に合わせて、直近の該当日付を生成
        $beforeDate3 = Carbon::parse('next ' . $beforeSlot3->day)->toDateString();

        $afterSlot3 = $timetables->where('id', '!=', $beforeSlot3->id)->random();
        // ★ 変更後の時間割の曜日に合わせて、翌々週の該当日付を生成（バリエーションのため）
        $afterDate3 = Carbon::parse('next ' . $afterSlot3->day)->addWeeks(2)->toDateString();

        TimetableChange::create([
            'teacher_id' => $teachers->random()->id,
            'before_date' => $beforeDate3,
            'before_timetable_id' => $beforeSlot3->id,
            'after_date' => $afterDate3,
            'after_timetable_id' => $afterSlot3->id,
            'approval' => false, // 未承認
        ]);
    }
}
