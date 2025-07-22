<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // BelongsTo を追加

class Timetable extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'term',
        'day',
        'lesson',
        'teacher_id', // ★ ここを修正: user_id から teacher_id に変更
        'room_id',
        'subject_id',
        'school_class_id',
    ];

    /**
     * Get the teacher that owns the timetable entry.
     */
    public function teacher(): BelongsTo // ★ ここを修正: user() から teacher() に変更し、型ヒントを追加
    {
        // teacher_id が users テーブルの id を参照している場合
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the subject that owns the timetable entry.
     */
    public function subject(): BelongsTo // 型ヒントを追加
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * Get the room that owns the timetable entry.
     */
    public function room(): BelongsTo // 型ヒントを追加
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * Get the school class that owns the timetable entry.
     */
    public function schoolClass(): BelongsTo // ★ 追加: schoolClass リレーション
    {
        return $this->belongsTo(SchoolClass::class);
    }
}