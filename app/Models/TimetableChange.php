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
        'room_id', // ★ 追加
        'school_class_id', // ★ 追加
        'approval', // ★ is_approved から approval に変更
    ];

    /**
     * Get the teacher (User) who made the timetable change.
     */
    public function teacher(): BelongsTo
    {
        // teacher_id は users テーブルの id を参照
        return $this->belongsTo(User::class, 'teacher_id'); // ★ Teacher::class から User::class に変更
    }

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

    /**
     * Get the room associated with the timetable change.
     */
    public function room(): BelongsTo // ★ 追加
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * Get the school class associated with the timetable change.
     */
    public function schoolClass(): BelongsTo // ★ 追加
    {
        return $this->belongsTo(SchoolClass::class);
    }
}