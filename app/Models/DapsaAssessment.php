<?php
// app/Models/DapsaAssessment.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DapsaAssessment extends Model
{
    protected $fillable = [
        'patient_id','doctor_id','assessed_at',
        'tjc68','sjc66','pain','pt_global','crp','score',
    ];
    protected $casts = [
        'assessed_at' => 'datetime',
        'tjc68'=>'integer','sjc66'=>'integer',
        'pain'=>'decimal:2','pt_global'=>'decimal:2','crp'=>'decimal:2','score'=>'decimal:2',
    ];
    public function patient(){ return $this->belongsTo(Patient::class); }
    public function doctor(){ return $this->belongsTo(User::class, 'doctor_id'); }
}
