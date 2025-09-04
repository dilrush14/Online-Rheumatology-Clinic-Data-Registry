<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\LabOrder;
use App\Models\LabOrderItem;
use App\Models\LabTest;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class LabOrderController extends Controller
{
    public function index(Patient $patient)
    {
        $orders = LabOrder::with(['items.test','items.result'])
            ->where('patient_id', $patient->id)
            ->orderByDesc('ordered_at')
            ->get();

        return Inertia::render('Doctor/LabOrders/Index', [
            'patient' => $patient->only(['id','name','national_id','gender','age']),
            'orders'  => $orders,
            'sidebar' => [
                'links' => [
                    [
                        'label' => 'Lab Order',
                        'href'  => route('doctor.patients.lab-orders.create', $patient->id),
                        'activeWhen' => ['doctor.patients.lab-orders.*'],
                    ],
                    [
                        'label' => 'Overview',
                        'href'  => route('doctor.patients.overview', $patient->id),
                        'activeWhen' => ['doctor.patients.overview'],
                    ],
                ],
            ],
        ]);
    }

    public function create(Patient $patient)
    {
        $tests = LabTest::where('active', true)
            ->orderBy('code')
            ->get(['id','code','name','units','specimen_type']);

        return Inertia::render('Doctor/LabOrders/Create', [
            'patient' => $patient->only(['id','name','national_id','gender','age']),
            'tests'   => $tests,
            'sidebar' => [
                'links' => [
                    [
                        'label' => 'Overview',
                        'href'  => route('doctor.patients.overview', $patient->id),
                        'activeWhen' => ['doctor.patients.overview'],
                    ],
                ],
            ],
        ]);
    }

    public function store(Request $request, Patient $patient)
    {
        $data = $request->validate([
            'selected_test_ids'   => ['required','array','min:1'],
            'selected_test_ids.*' => ['integer','exists:lab_tests,id'],
            'visit_id'            => ['nullable','integer','exists:visits,id'],
            'notes'               => ['nullable','string'],
        ]);

        DB::transaction(function () use ($data, $patient) {
            $order = LabOrder::create([
                'patient_id'         => $patient->id,
                'ordered_by_user_id' => Auth::id(),
                'visit_id'           => $data['visit_id'] ?? null,
                'status'             => 'pending',
                'notes'              => $data['notes'] ?? null,
            ]);

            $items = collect($data['selected_test_ids'])
                ->unique()
                ->map(fn($testId) => [
                    'lab_order_id' => $order->id,
                    'lab_test_id'  => $testId,
                    'status'       => 'ordered',
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ])->all();

            LabOrderItem::insert($items);
        });

        return redirect()
            ->route('doctor.patients.overview', $patient->id)
            ->with('success', 'Lab order placed successfully.');
    }

    public function edit(Patient $patient, LabOrder $order)
    {
        $order->load(['items.test']);
        $tests = LabTest::where('active', true)->orderBy('code')->get(['id','code','name']);
        return Inertia::render('Doctor/LabOrders/Edit', [
            'patient' => $patient->only(['id','name']),
            'order'   => $order,
            'tests'   => $tests,
        ]);
    }

    public function update(Request $request, Patient $patient, LabOrder $order)
    {
        $data = $request->validate([
            'selected_test_ids'   => ['required','array','min:1'],
            'selected_test_ids.*' => ['integer','exists:lab_tests,id'],
            'notes'               => ['nullable','string'],
        ]);

        DB::transaction(function () use ($order, $data) {
            $keep = collect($data['selected_test_ids'])->unique()->values();

            // delete removed items that don't have results yet
            $order->items()
                ->whereNotIn('lab_test_id', $keep)
                ->doesntHave('result')
                ->delete();

            // add newly added
            $existing = $order->items()->pluck('lab_test_id')->all();
            $toAdd = $keep->diff($existing)->map(fn($id) => [
                'lab_order_id'=>$order->id,'lab_test_id'=>$id,'status'=>'ordered',
                'created_at'=>now(),'updated_at'=>now()
            ])->all();
            if (!empty($toAdd)) LabOrderItem::insert($toAdd);

            $order->update(['notes' => $data['notes'] ?? null]);
        });

        return back()->with('success', 'Lab order updated.');
    }


    // DELETE whole order (only if no results)
    public function destroy(Patient $patient, LabOrder $order)
    {
        $hasResults = $order->items()->has('result')->exists();

        if ($hasResults) {
            return redirect()
                ->route('doctor.patients.overview', $patient->id)
                ->with('success', 'Cannot delete this lab order because one or more test results exist. Consider cancelling instead.');
        }

        $order->delete();

        return redirect()
            ->route('doctor.patients.overview', $patient->id)
            ->with('success', 'Lab order deleted.');
    }

    // PUT/PATCH cancel order (allowed even if results exist)
    public function cancel(Request $request, Patient $patient, LabOrder $order)
    {
        $data = $request->validate([
            'reason' => ['nullable','string','max:500'],
        ]);

        $order->update([
            'status' => 'cancelled',
            // (Optional: if you add columns later)
            // 'cancelled_by_user_id' => Auth::id(),
            // 'cancelled_at' => now(),
            // 'cancel_reason' => $data['reason'] ?? null,
        ]);

        return redirect()
            ->route('doctor.patients.overview', $patient->id)
            ->with('success', 'Lab order cancelled.');
    }

}
