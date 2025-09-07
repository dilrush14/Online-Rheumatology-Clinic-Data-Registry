<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SdaiAssessment extends Model
{
    protected $fillable = [
        'patient_id','doctor_id','assessed_at',
        'tjc28','sjc28','pt_global','ph_global','crp','score',
    ];
    protected $casts = [
        'assessed_at' => 'datetime',
        'tjc28' => 'integer','sjc28' => 'integer',
        'pt_global' => 'decimal:2','ph_global' => 'decimal:2',
        'crp' => 'decimal:2','score' => 'decimal:2',
    ];
    public function patient(){ return $this->belongsTo(Patient::class); }
    public function doctor(){ return $this->belongsTo(User::class, 'doctor_id'); }
}
