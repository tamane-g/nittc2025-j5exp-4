<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // BelongsTo を追加

class CountSubjectSchoolClass extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['subject_id', 'school_class_id'];

    /**
     * Get the subject that owns the count subject school class entry.
     */
    public function subject(): BelongsTo // ★ 型ヒントを追加
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * Get the school class that owns the count subject school class entry.
     */
    public function schoolClass(): BelongsTo // ★ 型ヒントを追加
    {
        return $this->belongsTo(SchoolClass::class);
    }
}