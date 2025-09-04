<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\LabOrder;
use App\Models\LabOrderItem;
use App\Models\Patient;
use App\Models\LabResult;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LabResultController extends Controller
{
    public function create(Patient $patient, LabOrder $order, LabOrderItem $item)
    {
        $item->load('test','result');
        return Inertia::render('LabResults/ResultEntry', [
            'patient' => $patient->only(['id','name','national_id']),
            'order'   => $order->only(['id','ordered_at']),
            'item'    => [
                'id'     => $item->id,
                'test'   => $item->test->only(['id','code','name','units']),
                'result' => $item->result, // may be null
            ],
        ]);
    }

    public function store(Request $request, Patient $patient, LabOrder $order, LabOrderItem $item)
    {
        $data = $request->validate([
            'result_value' => ['nullable','numeric'],
            'unit'         => ['nullable','string','max:32'],
            'result_json'  => ['nullable','array'],
            'flag'         => ['nullable','in:H,L,N,A'],
            'comments'     => ['nullable','string'],
            'collected_at' => ['nullable','date'],
        ]);

        $payload = [
            'lab_order_item_id'  => $item->id,
            'entered_by_user_id' => Auth::id(),
            'result_value'       => $data['result_value'] ?? null,
            'unit'               => $data['unit'] ?? null,
            'result_json'        => $data['result_json'] ?? null,
            'flag'               => $data['flag'] ?? null,
            'comments'           => $data['comments'] ?? null,
            'collected_at'       => $data['collected_at'] ?? null,
        ];

        LabResult::updateOrCreate(['lab_order_item_id' => $item->id], $payload);
        $item->update(['status' => 'result_entered']);

        // Update order status
        $total = $order->items()->count();
        $withResults = $order->items()->has('result')->count();
        $order->update([
            'status' => $withResults === 0
                ? 'pending'
                : ($withResults < $total ? 'partially_reported' : 'completed')
        ]);

        return redirect()
            ->route('doctor.patients.overview', $patient->id)
            ->with('success', 'Result saved.');
    }

    public function edit(Patient $patient, LabOrder $order, LabOrderItem $item)
    {
        $item->load('test','result');
        return Inertia::render('LabResults/ResultEntry', [
            'patient' => $patient->only(['id','name']),
            'order'   => $order->only(['id']),
            'item'    => [
                'id'     => $item->id,
                'test'   => $item->test->only(['id','code','name','units']),
                'result' => $item->result,
            ],
            'editing' => true,
        ]);
    }

    public function update(Request $request, Patient $patient, LabOrder $order, LabOrderItem $item)
    {
        // Reuse store() logic for update
        return $this->store($request, $patient, $order, $item);
    }
}
