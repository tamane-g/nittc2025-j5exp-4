<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // BelongsTo リレーションのために追加

class Notification extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'teacher_id',
        'heading',
        'description',
        'notification_date',
        'read_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'notification_date' => 'date', // date カラムを日付オブジェクトにキャスト
        'read_at' => 'datetime',     // read_at カラムを日時オブジェクトにキャスト
    ];

    /**
     * Get the teacher that owns the notification.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function teacher(): BelongsTo
    {
        // teacher_id が users テーブルの id を参照している
        return $this->belongsTo(User::class, 'teacher_id');
    }
}
