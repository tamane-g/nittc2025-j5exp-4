<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CountSubjectSchoolClass extends Model
{
    protected $fillable = ['subject_id', 'school_class_id'];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class);
    }
}