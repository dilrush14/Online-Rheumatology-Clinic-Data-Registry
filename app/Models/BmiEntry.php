<?php
// app/Models/BmiEntry.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BmiEntry extends Model
{
    protected $fillable = [
        'patient_id','doctor_id','assessed_at',
        'weight_kg','height_m','bmi','band',
    ];
    protected $casts = [
        'assessed_at' => 'datetime',
        'weight_kg'=>'decimal:2','height_m'=>'decimal:3','bmi'=>'decimal:1',
    ];
    public function patient(){ return $this->belongsTo(Patient::class); }
    public function doctor(){ return $this->belongsTo(User::class, 'doctor_id'); }
}
