<?php

namespace App\Http\Controllers;

use App\Models\TimetableChange;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TimetableChangeController extends Controller
{
    /**
     * 時間割変更申請の一覧を取得します。
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // 関連するモデル（user, beforeTimetable, afterTimetable）も同時に読み込む
        // ※TimetableChangeモデルにリレーション定義が必要です
        $changes = TimetableChange::with(['user', 'beforeTimetable', 'afterTimetable'])->latest()->get();

        return response()->json($changes);
    }

    /**
     * 新しい時間割変更申請を保存します。
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // 申請者ID。usersテーブルに存在するIDである必要があります。
            'user_id' => 'required|exists:users,id',
            // 変更前の日付
            'before_date' => 'required|date',
            // 変更前の時間割ID。timetablesテーブルに存在するIDである必要があります。
            // 変更申請が「追加」の場合はNULLになることもあるため、nullableにしておきます。
            'before_timetable_id' => 'nullable|exists:timetables,id',
            // 変更後の日付
            'after_date' => 'required|date',
            // 変更後の時間割ID。timetablesテーブルに存在するIDである必要があります。
            'after_timetable_id' => 'required|exists:timetables,id',
        ]);

        // is_approved はマイグレーションで default(false) を設定しているため、
        // ここで指定する必要はありません。申請時は自動的に「未承認」になります。
        $change = TimetableChange::create($validated);

        return response()->json($change, 201); // 201 Created ステータスで返す
    }

    /**
     * 特定の時間割変更申請の詳細を取得します。
     *
     * @param  \App\Models\TimetableChange  $timetableChange
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(TimetableChange $timetableChange)
    {
        // 指定されたIDの申請データをリレーションと共に読み込む
        return response()->json($timetableChange->load(['user', 'beforeTimetable', 'afterTimetable']));
    }

    /**
     * 時間割変更申請を承認または拒否します。
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\TimetableChange  $timetableChange
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateApproval(Request $request, TimetableChange $timetableChange)
    {
        $validated = $request->validate([
            // is_approved は boolean (true/false) である必要があります。
            'is_approved' => 'required|boolean',
        ]);

        $timetableChange->update($validated);

        return response()->json($timetableChange);
    }

    /**
     * 時間割変更申請を削除します。
     *
     * @param  \App\Models\TimetableChange  $timetableChange
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(TimetableChange $timetableChange)
    {
        $timetableChange->delete();

        return response()->json(null, 204); // 204 No Content ステータスで返す
    }
}
