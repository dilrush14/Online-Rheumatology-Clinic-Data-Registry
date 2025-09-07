<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Drug;
use App\Models\Patient;
use App\Models\Prescription;
use App\Models\PrescriptionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class PrescriptionController extends Controller
{
    /** Create form */
    public function create(Patient $patient)
    {
        return Inertia::render('Doctor/Prescription/Create', [
            'patient' => $patient->only(['id', 'name', 'national_id']),
            'today'   => now()->toDateString(),
        ]);
    }

    /** Store a new prescription + items */
    public function store(Request $request, Patient $patient)
    {
        $data = $request->validate([
            'prescribed_date'      => ['nullable','date'],
            'diagnosis'            => ['nullable','string','max:255'],
            'diagnosis_code'       => ['nullable','string','max:50'],
            'notes'                => ['nullable','string','max:5000'],
            'items'                => ['required','array','min:1'],
            'items.*.drug_id'      => ['required','integer','exists:drugs,id'],
            'items.*.frequency'    => ['required','string','max:100'],
            'items.*.dosage'       => ['required','string','max:100'],
            'items.*.duration'     => ['nullable','string','max:100'],
            'items.*.route'        => ['nullable','string','max:50'],
            'items.*.instructions' => ['nullable','string','max:500'],
        ]);

        DB::transaction(function () use ($patient, $data) {
            $p = Prescription::create([
                'patient_id'      => $patient->id,
                'prescribed_date' => $data['prescribed_date'] ?? now()->toDateString(),
                'diagnosis'       => $data['diagnosis'] ?? null,
                'diagnosis_code'  => $data['diagnosis_code'] ?? null,
                'notes'           => $data['notes'] ?? null,
                'created_by'      => Auth::id(),
                'updated_by'      => Auth::id(),
            ]);

            foreach ($data['items'] as $row) {
                $drug = Drug::findOrFail($row['drug_id']);

                PrescriptionItem::create([
                    'prescription_id' => $p->id,
                    'drug_id'         => $drug->id,
                    'drug_name_cache' => trim($drug->name.' '.($drug->strength ?? '')),
                    'frequency'       => $row['frequency'],
                    'dosage'          => $row['dosage'],
                    'duration'        => $row['duration'] ?? null,
                    'route'           => $row['route'] ?? null,
                    'instructions'    => $row['instructions'] ?? null,
                ]);
            }
        });

        return redirect()
            ->route('doctor.patients.overview', $patient->id)
            ->with('success', 'Prescription saved');
    }

    /** Edit form */
    public function edit(Patient $patient, Prescription $prescription)
    {
        $this->ensureBelongsToPatient($patient, $prescription);

        $prescription->load(['items','creator','editor']);

        return Inertia::render('Doctor/Prescription/Edit', [
            'patient'      => $patient->only(['id','name','national_id']),
            'prescription' => [
                'id'              => $prescription->id,
                'prescribed_date' => optional($prescription->prescribed_date)->toDateString(),
                'diagnosis'       => $prescription->diagnosis,
                'diagnosis_code'  => $prescription->diagnosis_code,
                'notes'           => $prescription->notes,
                'created_at'      => $prescription->created_at,
                'updated_at'      => $prescription->updated_at,
                'created_by'      => $prescription->creator?->name,
                'updated_by'      => $prescription->editor?->name,
                'items'           => $prescription->items->map(fn ($it) => [
                    'id'           => $it->id,
                    'drug_id'      => $it->drug_id,
                    'drug_label'   => $it->drug_name_cache,
                    'frequency'    => $it->frequency,
                    'dosage'       => $it->dosage,
                    'duration'     => $it->duration,
                    'route'        => $it->route,
                    'instructions' => $it->instructions,
                ]),
            ],
        ]);
    }

    /** Update prescription + items */
    public function update(Request $request, Patient $patient, Prescription $prescription)
    {
        $this->ensureBelongsToPatient($patient, $prescription);

        $data = $request->validate([
            'prescribed_date'      => ['nullable','date'],
            'diagnosis'            => ['nullable','string','max:255'],
            'diagnosis_code'       => ['nullable','string','max:50'],
            'notes'                => ['nullable','string','max:5000'],
            'items'                => ['required','array','min:1'],
            'items.*.id'           => ['nullable','integer'],
            'items.*.drug_id'      => ['required','integer','exists:drugs,id'],
            'items.*.frequency'    => ['required','string','max:100'],
            'items.*.dosage'       => ['required','string','max:100'],
            'items.*.duration'     => ['nullable','string','max:100'],
            'items.*.route'        => ['nullable','string','max:50'],
            'items.*.instructions' => ['nullable','string','max:500'],
        ]);

        DB::transaction(function () use ($prescription, $data) {
            $prescription->update([
                'prescribed_date' => $data['prescribed_date'] ?? $prescription->prescribed_date,
                'diagnosis'       => $data['diagnosis'] ?? null,
                'diagnosis_code'  => $data['diagnosis_code'] ?? null,
                'notes'           => $data['notes'] ?? null,
                'updated_by'      => Auth::id(),
            ]);

            // Sync items: upsert provided rows, remove the rest
            $keptIds = [];
            foreach ($data['items'] as $row) {
                $drug = Drug::findOrFail($row['drug_id']);

                if (!empty($row['id'])) {
                    $it = PrescriptionItem::where('prescription_id', $prescription->id)->find($row['id']);
                    if ($it) {
                        $it->update([
                            'drug_id'         => $drug->id,
                            'drug_name_cache' => trim($drug->name.' '.($drug->strength ?? '')),
                            'frequency'       => $row['frequency'],
                            'dosage'          => $row['dosage'],
                            'duration'        => $row['duration'] ?? null,
                            'route'           => $row['route'] ?? null,
                            'instructions'    => $row['instructions'] ?? null,
                        ]);
                        $keptIds[] = $it->id;
                    }
                } else {
                    $it = PrescriptionItem::create([
                        'prescription_id' => $prescription->id,
                        'drug_id'         => $drug->id,
                        'drug_name_cache' => trim($drug->name.' '.($drug->strength ?? '')),
                        'frequency'       => $row['frequency'],
                        'dosage'          => $row['dosage'],
                        'duration'        => $row['duration'] ?? null,
                        'route'           => $row['route'] ?? null,
                        'instructions'    => $row['instructions'] ?? null,
                    ]);
                    $keptIds[] = $it->id;
                }
            }

            PrescriptionItem::where('prescription_id', $prescription->id)
                ->whereNotIn('id', $keptIds)
                ->delete();
        });

        return redirect()
    ->route('doctor.patients.overview', $patient->id)
    ->with('success', 'Prescription updated');
    }

    /** Delete a prescription */
    public function destroy(Patient $patient, Prescription $prescription)
    {
        $this->ensureBelongsToPatient($patient, $prescription);

        $prescription->delete();

        return back()->with('success', 'Prescription deleted');
    }

    /** Async search for the drug select */
    public function drugSearch(Request $request)
    {
        $q = trim((string) $request->get('q', ''));

        $drugs = Drug::query()
            ->when($q !== '', function ($query) use ($q) {
                $query->where(function ($w) use ($q) {
                    $w->where('name', 'like', "%{$q}%")
                      ->orWhere('code', 'like', "%{$q}%");
                });
            })
            ->orderBy('name')
            ->limit(20)
            ->get()
            ->map(fn ($d) => [
                'value' => $d->id,
                'label' => trim($d->name.' '.($d->strength ?? '')),
                'meta'  => ['form' => $d->form, 'strength' => $d->strength],
            ]);

        return response()->json($drugs);
    }


public function print(Patient $patient, Prescription $prescription)
{
    $prescription->load(['items','creator','editor','patient']);
    $pdf = Pdf::loadView('pdf.prescription', ['p' => $prescription]);
    return $pdf->stream("prescription-{$prescription->id}.pdf"); // Content-Type: application/pdf
}

    /** Guard against IDOR: ensure the prescription belongs to this patient */
    protected function ensureBelongsToPatient(Patient $patient, Prescription $prescription): void
    {
        if ($prescription->patient_id !== $patient->id) {
            abort(404);
        }
    }
}
