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
        $teachers = User::role('teacher')->get();
        if ($teachers->isEmpty()) {
            $this->command->info('Skipping TimetableChangeSeeder: No teachers found.');
            return;
        }

        // --- ★★★ここからが修正箇所★★★ ---
        // --- 信頼性の高い「授業の相互交換」テストデータを作成 ---
        $this->createReliableSwapChange($teachers);
    }

    /**
     * 授業の相互交換テストデータを作成する、より信頼性の高いヘルパーメソッド
     * @param \Illuminate\Database\Eloquent\Collection $teachers
     */
    private function createReliableSwapChange($teachers): void
    {
        // --- 修正点: 特定のクラス(ID=1)を対象にする ---
        $classIdToTest = 1;
        $classToTest = SchoolClass::find($classIdToTest);

        if (!$classToTest) {
            $this->command->error("Class with ID {$classIdToTest} not found. Cannot create reliable swap change.");
            return;
        }

        // そのクラスの火曜日と水曜日の1時間目の授業を取得
        $tuesdaySlot = Timetable::where('school_class_id', $classToTest->id)
            ->where('day', 'Tuesday')->where('lesson', 'lesson_1')->first();

        $wednesdaySlot = Timetable::where('school_class_id', $classToTest->id)
            ->where('day', 'Wednesday')->where('lesson', 'lesson_2')->first();

        // 両方のスロットが存在する場合のみ、変更データを作成
        if ($tuesdaySlot && $wednesdaySlot) {
            // シーダーの実行日に関わらず、「今週の」火曜日と水曜日の日付を取得
            $tuesdayDate = (Carbon::today())->toDateString();
            $wednesdayDate = (Carbon::yesterday())->toDateString();
            $teacher = $teachers->random();

            // 既存の同じ変更データを削除して、重複を防ぐ
            TimetableChange::where('before_timetable_id', $tuesdaySlot->id)->where('before_date', $tuesdayDate)->delete();
            TimetableChange::where('before_timetable_id', $wednesdaySlot->id)->where('before_date', $wednesdayDate)->delete();

            // 変更1: 火曜日の授業(tuesdaySlot)を、水曜日に移動する申請
            TimetableChange::create([
                'teacher_id' => 1,
                'before_date' => $tuesdayDate,
                'before_timetable_id' => $tuesdaySlot->id,
                'after_date' => $wednesdayDate,
                'after_timetable_id' => $wednesdaySlot->id,
                'approval' => true,
            ]);

            // 変更2: 水曜日の授業(wednesdaySlot)を、火曜日に移動する申請
            TimetableChange::create([
                'teacher_id' => 1,
                'before_date' => $wednesdayDate,
                'before_timetable_id' => $wednesdaySlot->id,
                'after_date' => $tuesdayDate,
                'after_timetable_id' => $tuesdaySlot->id,
                'approval' => true,
            ]);
        }
    }
}
