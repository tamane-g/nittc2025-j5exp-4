<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Timetable extends Model
{
    protected $fillable = [
        'id',
        'term',
        'day',
        'lesson',
        'user_id',
        'room_id',
        'subject_id',
    ];
}
