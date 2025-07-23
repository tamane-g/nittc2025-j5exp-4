<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email', // email も $fillable に追加
        'password',
        'school_class_id', // school_class_id は既にありますが、念のため
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];
    /**
     * Get the school class that the user belongs to.
     */
    public function schoolClass(): BelongsTo // ★ 型ヒントを追加
    {
        // users テーブルの school_class_id が school_classes テーブルの id を参照する
        return $this->belongsTo(SchoolClass::class, 'school_class_id', 'id');
    }
}
