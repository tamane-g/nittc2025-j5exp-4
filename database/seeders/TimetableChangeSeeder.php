<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TimetableChange;
use App\Models\Timetable;
use App\Models\Teacher;
use App\Models\SchoolClass;
use Carbon\Carbon; // 日付操作のためにCarbonをインポート

class TimetableChangeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teachers = Teacher::all();
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

        $today = Carbon::today();
        $yesterday = Carbon::yesterday();

        $todaySlot = Timetable::where('school_class_id', $classToTest->id)
            ->where('day', $today->copy()->format('l'))->where('lesson', 'lesson_1')->first();
        $yesterdaySlot = Timetable::where('school_class_id', $classToTest->id)
            ->where('day', $yesterday->copy()->format('l'))->where('lesson', 'lesson_2')->first();

        // 両方のスロットが存在する場合のみ、変更データを作成
        if ($todaySlot && $yesterdaySlot) {
            $teacher = $teachers->random();

            // 変更2: 水曜日の授業(wednesdaySlot)を、火曜日に移動する申請
            TimetableChange::create([
                'teacher_id' => $teacher->id,
                'before_date' => $today,
                'before_timetable_id' => $todaySlot->id,
                'after_date' => $yesterday,
                'after_timetable_id' =>$yesterdaySlot->id,
                'approval' => true,
            ]);
        }
    }
}
