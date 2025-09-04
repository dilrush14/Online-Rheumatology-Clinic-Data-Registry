<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CdaiAssessment extends Model
{

    protected $table = 'cdai_assessments';

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'assessed_at',
        'tjc28',
        'sjc28',
        'ptg',
        'phg',
        'score',
        'category',
        'tender_joints',
        'swollen_joints',
    ];

    protected $casts = [
        'assessed_at'    => 'datetime',
        'tender_joints'  => 'array',
        'swollen_joints' => 'array',
        'tjc28'          => 'integer',
        'sjc28'          => 'integer',
        'ptg'            => 'decimal:1',
        'phg'            => 'decimal:1',
        'score'          => 'decimal:1',
    ];

    public function patient(){ return $this->belongsTo(Patient::class); }
    public function doctor(){ return $this->belongsTo(User::class, 'doctor_id'); }
}
