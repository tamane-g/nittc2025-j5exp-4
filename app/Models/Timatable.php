<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Timatable extends Model
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
