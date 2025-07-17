<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolClass extends Model
{
    protected $fillable = ['grade', 'class'];

    public function users()
    {
        return $this->hasMany(User::class, 'school_class_grade', 'grade');
        // 複合キー対応を含めるならカスタムが必要
    }

    public function countSubjects()
    {
        return $this->hasMany(CountSubjectSchoolClass::class);
    }
}