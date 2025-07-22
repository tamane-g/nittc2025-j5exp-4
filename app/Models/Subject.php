<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany; // HasMany を追加

class Subject extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name'];

    /**
     * Get the timetables for the subject.
     */
    public function timetables(): HasMany // ★ 型ヒントを追加
    {
        return $this->hasMany(Timetable::class);
    }

    /**
     * Get the count subject school classes for the subject.
     */
    public function countSubjectSchoolClasses(): HasMany // ★ 型ヒントを追加
    {
        return $this->hasMany(CountSubjectSchoolClass::class);
    }
}