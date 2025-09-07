<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    protected $fillable = [
        'patient_id',
        'visit_date',
        'complaints',               // JSON [{code,title}]
        'history',
        'vitals',                   // JSON {height_cm,...}
        'provisional_diagnoses',    // JSON [{code,title}]
        'plan',
        'notes',

    ];

    protected $casts = [
        'visit_date' => 'date',
        'complaints' => 'array',
        'provisional_diagnoses' => 'array',
        'vitals' => 'array',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
    
}