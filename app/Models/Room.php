<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany; // HasMany を追加

class Room extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['name', 'is_concurrent'];

    /**
     * Get the timetables for the room.
     */
    public function timetables(): HasMany // ★ 型ヒントを追加
    {
        return $this->hasMany(Timetable::class);
    }
}