<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabTest extends Model
{
    protected $fillable = ['code','name','specimen_type','units','reference_ranges','active'];
    protected $casts = ['reference_ranges' => 'array', 'active' => 'boolean'];

    public function orderItems() {
        return $this->hasMany(LabOrderItem::class);
    }
}
