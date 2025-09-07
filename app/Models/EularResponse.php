<?php
// app/Models/EularResponse.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EularResponse extends Model
{
    protected $fillable = [
        'patient_id','doctor_id','assessed_at',
        'baseline_das28','current_das28','delta','response',
    ];
    protected $casts = [
        'assessed_at' => 'datetime',
        'baseline_das28'=>'decimal:2','current_das28'=>'decimal:2','delta'=>'decimal:2',
    ];
    public function patient(){ return $this->belongsTo(Patient::class); }
    public function doctor(){ return $this->belongsTo(User::class, 'doctor_id'); }
}
