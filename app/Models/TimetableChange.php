<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimetableChange extends Model
{
    protected $fillable = [
        'user_id', 'before_date', 'before_timetable_id',
        'after_date', 'after_timetable_id', 'is_approved'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function beforeTimetable()
    {
        return $this->belongsTo(Timetable::class, 'before_timetable_id');
    }

    public function afterTimetable()
    {
        return $this->belongsTo(Timetable::class, 'after_timetable_id');
    }
}