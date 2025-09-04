<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;

class Das28Assessment extends Model
{
    protected $fillable = [
        'patient_id', 'doctor_id', 'variant', 'esr', 'crp', 'gh',
        'sjc28', 'tjc28', 'score', 'category',
        'swollen_joints', 'tender_joints', 'assessed_at',
    ];

    protected $casts = [
        'swollen_joints' => AsArrayObject::class,
        'tender_joints'  => AsArrayObject::class,
        'assessed_at'    => 'datetime',
    ];

    public function patient(){ return $this->belongsTo(Patient::class); }
    public function doctor(){ return $this->belongsTo(User::class, 'doctor_id'); }
}
