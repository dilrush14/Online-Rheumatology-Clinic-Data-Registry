<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabOrder extends Model
{
    protected $fillable = ['patient_id','ordered_by_user_id','visit_id','ordered_at','status','notes'];
    protected $casts = ['ordered_at' => 'datetime'];

    public function patient() { return $this->belongsTo(Patient::class); }
    public function orderedBy() { return $this->belongsTo(User::class, 'ordered_by_user_id'); }
    public function visit() { return $this->belongsTo(Visit::class); }
    public function items() { return $this->hasMany(LabOrderItem::class); }
}
