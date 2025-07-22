<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Timetable extends Model
{
    protected $fillable = [
        'term', 'day', 'lesson', 'user_id', 'room_id', 'subject_id', 'school_class_id',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
