<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // BelongsTo を追加

class TimetableChange extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'teacher_id', // ★ user_id から teacher_id に変更
        'before_date',
        'before_timetable_id',
        'after_date',
        'after_timetable_id',
        'approval', // ★ is_approved から approval に変更
    ];

    /**
     * Get the original timetable entry before the change.
     */
    public function beforeTimetable(): BelongsTo
    {
        return $this->belongsTo(Timetable::class, 'before_timetable_id');
    }

    /**
     * Get the new timetable entry after the change.
     */
    public function afterTimetable(): BelongsTo
    {
        return $this->belongsTo(Timetable::class, 'after_timetable_id');
    }
}