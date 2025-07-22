<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany; // HasMany を追加

class SchoolClass extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['grade', 'class'];

    /**
     * Get the users (students) for the school class.
     * Assumes 'users' table has a 'school_class_id' foreign key.
     */
    public function users(): HasMany // ★ 型ヒントを追加
    {
        // users テーブルに school_class_id 外部キーがあることを前提とする
        return $this->hasMany(User::class, 'school_class_id');
    }

    /**
     * Get the count subjects for the school class.
     */
    public function countSubjects(): HasMany // ★ 型ヒントを追加
    {
        return $this->hasMany(CountSubjectSchoolClass::class);
    }

    /**
     * Get the timetables for the school class.
     * (TimetableモデルからschoolClassリレーションが定義されているため、ここにも追加)
     */
    public function timetables(): HasMany // ★ timetables リレーションを追加
    {
        return $this->hasMany(Timetable::class);
    }
}