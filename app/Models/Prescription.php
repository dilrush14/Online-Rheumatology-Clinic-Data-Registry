<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Prescription extends Model {
    protected $fillable = [
        'patient_id','prescribed_date','diagnosis','diagnosis_code','notes',
        'created_by','updated_by'
    ];

    protected $casts = ['prescribed_date'=>'date'];

    public function patient(): BelongsTo { return $this->belongsTo(Patient::class); }
    public function items(): HasMany { return $this->hasMany(PrescriptionItem::class); }
    public function creator(): BelongsTo { return $this->belongsTo(User::class,'created_by'); }
    public function editor(): BelongsTo { return $this->belongsTo(User::class,'updated_by'); }
}
