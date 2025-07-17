<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = ['name'];

    public function timetables()
    {
        return $this->hasMany(Timetable::class);
    }

    public function countSubjectSchoolClasses()
    {
        return $this->hasMany(CountSubjectSchoolClass::class);
    }
}