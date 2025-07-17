<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = ['name', 'is_concurrent'];

    public function timetables()
    {
        return $this->hasMany(Timetable::class);
    }
}