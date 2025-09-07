<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrescriptionItem extends Model {
    protected $fillable = [
        'prescription_id','drug_id','drug_name_cache','frequency','dosage','duration','route','instructions'
    ];
    public function prescription(): BelongsTo { return $this->belongsTo(Prescription::class); }
    public function drug(): BelongsTo { return $this->belongsTo(Drug::class); }
}
