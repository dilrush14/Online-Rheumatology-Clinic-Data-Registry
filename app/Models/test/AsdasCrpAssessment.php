<?php
// app/Models/AsdasCrpAssessment.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AsdasCrpAssessment extends Model
{
    protected $fillable = [
        'patient_id','doctor_id','assessed_at',
        'back_pain','morning_stiffness_duration','peripheral_pain_swelling','pt_global','crp','score',
    ];
    protected $casts = [
        'assessed_at' => 'datetime',
        'back_pain'=>'decimal:2','morning_stiffness_duration'=>'decimal:2','peripheral_pain_swelling'=>'decimal:2',
        'pt_global'=>'decimal:2','crp'=>'decimal:2','score'=>'decimal:2',
    ];
    public function patient(){ return $this->belongsTo(Patient::class); }
    public function doctor(){ return $this->belongsTo(User::class, 'doctor_id'); }
}
