<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    protected $fillable = [
        'name', 'school_class_id', 'email', 'password'
    ];

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'school_class_grade', 'grade');
        // 注意：複合キー school_class_grade + school_class_at の対応が必要ならカスタム実装が必要
    }
}
