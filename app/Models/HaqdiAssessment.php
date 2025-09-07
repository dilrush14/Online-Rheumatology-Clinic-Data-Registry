<?php
// app/Models/HaqdiAssessment.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HaqdiAssessment extends Model
{
    protected $fillable = [
        'patient_id','doctor_id','assessed_at',
        'items','score',
    ];
    protected $casts = [
        'assessed_at' => 'datetime',
        'items' => 'array',
        'score' => 'decimal:2',
    ];
    public function patient(){ return $this->belongsTo(Patient::class); }
    public function doctor(){ return $this->belongsTo(User::class, 'doctor_id'); }
}
