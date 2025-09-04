<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabResult extends Model
{
    protected $fillable = [
        'lab_order_item_id','entered_by_user_id','verified_by_user_id',
        'result_value','unit','result_json','flag','collected_at','result_at','comments'
    ];
    protected $casts = ['result_json' => 'array', 'collected_at'=>'datetime','result_at'=>'datetime'];

    public function item() { return $this->belongsTo(LabOrderItem::class, 'lab_order_item_id'); }
    public function enteredBy() { return $this->belongsTo(User::class, 'entered_by_user_id'); }
    public function verifiedBy() { return $this->belongsTo(User::class, 'verified_by_user_id'); }
}
