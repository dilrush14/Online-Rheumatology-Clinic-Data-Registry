<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IcdTerm extends Model
{

    protected $fillable = ['code','title','category','is_active'];
    protected $casts = ['is_active' => 'bool'];


}
