<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolClass extends Model
{
    protected $fillable = ['grade', 'class'];

    public function users()
{
    return $this->hasMany(User::class, 'school_class_grade', 'grade')
                ->whereColumn('users.school_class_at', 'school_classes.class');
}


    public function countSubjects()
    {
        return $this->hasMany(CountSubjectSchoolClass::class);
    }
}