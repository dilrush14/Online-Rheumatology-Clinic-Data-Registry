<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabOrderItem extends Model
{
    protected $fillable = ['lab_order_id','lab_test_id','status','due_date'];
    protected $casts = ['due_date' => 'date'];

    public function order() { return $this->belongsTo(LabOrder::class, 'lab_order_id'); }
    public function test() { return $this->belongsTo(LabTest::class, 'lab_test_id'); }
    public function result() { return $this->hasOne(LabResult::class); }
}
