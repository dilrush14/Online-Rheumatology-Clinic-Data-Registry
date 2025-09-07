<?php
// app/Models/VasEntry.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VasEntry extends Model
{
    protected $fillable = [
        'patient_id','doctor_id','assessed_at',
        'label','value',
    ];
    protected $casts = [
        'assessed_at' => 'datetime',
        'value' => 'integer',
    ];
    public function patient(){ return $this->belongsTo(Patient::class); }
    public function doctor(){ return $this->belongsTo(User::class, 'doctor_id'); }
}
