<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BasdaiAssessment extends Model
{
    protected $fillable = [
        'patient_id','doctor_id','assessed_at',
        'q1','q2','q3','q4','q5','q6','score',
    ];
    protected $casts = [
        'assessed_at' => 'datetime',
        'q1'=>'decimal:2','q2'=>'decimal:2','q3'=>'decimal:2','q4'=>'decimal:2','q5'=>'decimal:2','q6'=>'decimal:2',
        'score'=>'decimal:2',
    ];
    public function patient(){ return $this->belongsTo(Patient::class); }
    public function doctor(){ return $this->belongsTo(User::class, 'doctor_id'); }
}
