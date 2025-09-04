<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Patient extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'national_id','title','name','other_names','gender','civil_status','marital_status',
        'ethnicity','blood_group','dob','age','phone','email','address_line1','address_line2',
        'village','district','province','guardian_name','guardian_relationship',
        'emergency_contact_name','emergency_contact_phone','religion','occupation',
        'health_scheme','chronic_conditions','disability_status','allergies','photo_path',
        'remarks',
    ];

    protected $casts = [
        'dob' => 'date',
        // Store allergies as an object/array: { type: 'food|animal|medicine', note: '...' }
        'allergies' => 'array',
    ];

    public function visits()
    {
        return $this->hasMany(\App\Models\Visit::class);
    }
}
