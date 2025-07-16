<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimetableChange extends Model
{
    protected $fillable = [
        'user_id',
        'before_date',
        'before_timetable_id',
        'after_date',
        'after_timetable_id',
        'approval',
    ];
}
