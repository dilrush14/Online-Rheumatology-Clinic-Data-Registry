<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Visit;
use Illuminate\Http\Request;

class VisitController extends Controller
{
    public function create(Patient $patient)
    {
        return \Inertia\Inertia::render('Doctor/Patient/Visits/Create', [
            'patient'  => $patient->only(['id','name','national_id','gender','age']),
            'defaults' => ['visit_date' => now()->toDateString()],
        ]);
    }

    public function store(Request $request, Patient $patient)
    {
        $data = $request->validate([
            'visit_date'             => ['required', 'date', 'before_or_equal:today'],
            'complaints' => ['required','array','min:1'],
            'complaints.*.code' => ['required','string','max:32'],
            'complaints.*.title' => ['required','string','max:512'],

            'provisional_diagnoses' => ['nullable','array'],
            'provisional_diagnoses.*.code' => ['required_with:provisional_diagnoses','string','max:32'],
            'provisional_diagnoses.*.title' => ['required_with:provisional_diagnoses','string','max:512'],

            'history' => ['nullable','string'],
            'vitals'  => ['nullable','array'],
            'vitals.height_cm' => ['nullable'],
            'vitals.weight_kg' => ['nullable'],
            'vitals.bp'        => ['nullable','string','max:20'],
            'vitals.pulse_bpm' => ['nullable'],
            'vitals.temp_c'    => ['nullable'],

            'plan'  => ['nullable','string'],
            'notes' => ['nullable','string'],
        ]);

        $visit = new Visit();
        $visit->patient_id = $patient->id;
        $visit->visit_date = $data['visit_date'];
        $visit->complaints = $data['complaints'];
        $visit->provisional_diagnoses = $data['provisional_diagnoses'] ?? [];
        $visit->history = $data['history'] ?? null;
        $visit->vitals  = $data['vitals'] ?? null;
        $visit->plan    = $data['plan'] ?? null;
        $visit->notes   = $data['notes'] ?? null;
        $visit->save();

        return redirect()
            ->route('doctor.patients.overview', $patient->id)
            ->with('success', 'Visit saved.');
    }
}
