<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Das28Assessment;
use App\Models\CdaiAssessment;
use App\Models\SdaiAssessment;
use App\Models\BasdaiAssessment;
use App\Models\AsdasCrpAssessment;
use App\Models\HaqdiAssessment;
use App\Models\DapsaAssessment;
use App\Models\VasEntry;
use App\Models\BmiEntry;
use App\Models\EularResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CalculatorController extends Controller
{
    public function index(Patient $patient)
    {
        return Inertia::render('Doctor/Calculators/Index', [
            'patient' => $patient->only(['id','name','national_id']),
            'calculators' => [
                ['key' => 'das28',  'name' => 'DAS28 (RA activity)'],
                ['key' => 'cdai',   'name' => 'CDAI'],
                ['key' => 'sdai',   'name' => 'SDAI'],
                ['key' => 'basdai', 'name' => 'BASDAI'],
                ['key' => 'asdas',  'name' => 'ASDAS-CRP'],
                ['key' => 'haqdi',  'name' => 'HAQ-DI'],
                ['key' => 'dapsa',  'name' => 'DAPSA'],
                ['key' => 'vas',    'name' => 'VAS (0–100)'],
                ['key' => 'bmi',    'name' => 'BMI'],
                ['key' => 'eular',  'name' => 'EULAR Response'],
            ],
        ]);
    }

    // ---------------- DAS28 ----------------
    public function das28(Patient $patient)
    {
        return Inertia::render('Doctor/Calculators/Das28', [
            'patient' => $patient->only(['id','name','national_id']),
        ]);
    }

    public function storeDas28(Request $request, Patient $patient)
    {
        $data = $request->validate([
            'variant' => 'required|in:ESR,CRP',
            'esr'     => 'nullable|numeric|min:0',
            'crp'     => 'nullable|numeric|min:0',
            'gh'      => 'nullable|numeric|min:0|max:100',
            'sjc28'   => 'required|integer|min:0|max:28',
            'tjc28'   => 'required|integer|min:0|max:28',
            'swollen_joints' => 'array',
            'tender_joints'  => 'array',
            'score'    => 'required|numeric|min:0',
            'category' => 'required|string',
        ]);

        Das28Assessment::create([
            ...$data,
            'patient_id'  => $patient->id,
            'doctor_id'   => Auth::id(),
            'assessed_at' => now(),
        ]);

        return redirect()->route('doctor.patients.overview', $patient->id)
            ->with('success', 'DAS28 saved to patient.');
    }

    /* ---------- CDAI ----------*/ 

   public function cdai(Patient $patient)
    {
        return Inertia::render('Doctor/Calculators/Cdai', [
            'patient' => $patient->only(['id','name','national_id']),
        ]);
    }

    public function storeCdai(Request $request, Patient $patient)
    {
        $data = $request->validate([
            'tjc28'          => 'required|integer|min:0|max:28',
            'sjc28'          => 'required|integer|min:0|max:28',
            'ptg'            => 'required|numeric|min:0|max:10',
            'phg'            => 'required|numeric|min:0|max:10',
            'score'          => 'required|numeric|min:0',
            'category'       => 'required|string|max:20',
            'tender_joints'  => 'array',
            'swollen_joints' => 'array',
        ]);

        CdaiAssessment::create([
            ...$data,
            'patient_id'  => $patient->id,
            'doctor_id'   => Auth::id(),
            'assessed_at' => now(),
        ]);

        return redirect()
            ->route('doctor.patients.overview', $patient->id)
            ->with('success', 'CDAI saved to patient.')
            ->setStatusCode(303);
    }


    // ---------------- SDAI ----------------
    public function sdai(Patient $patient)
    {
        return Inertia::render('Doctor/Calculators/Sdai', [
            'patient' => $patient->only(['id','name','national_id']),
        ]);
    }

    public function storeSdai(Request $request, Patient $patient)
    {
        $data = $request->validate([
            'tjc28'     => 'required|integer|min:0|max:28',
            'sjc28'     => 'required|integer|min:0|max:28',
            'pt_global' => 'required|numeric|min:0|max:10',
            'ph_global' => 'required|numeric|min:0|max:10',
            'crp'       => 'required|numeric|min:0',
            'score'     => 'required|numeric|min:0',
        ]);

        SdaiAssessment::create([
            ...$data,
            'patient_id'  => $patient->id,
            'doctor_id'   => Auth::id(),
            'assessed_at' => now(),
        ]);

        return redirect()->route('doctor.patients.overview', $patient->id)
            ->with('success', 'SDAI saved to patient.');
    }

    // ---------------- BASDAI ----------------
    public function basdai(Patient $patient)
    {
        return Inertia::render('Doctor/Calculators/Basdai', [
            'patient' => $patient->only(['id','name','national_id']),
        ]);
    }

    public function storeBasdai(Request $request, Patient $patient)
    {
        $data = $request->validate([
            'q1' => 'required|numeric|min:0|max:10',
            'q2' => 'required|numeric|min:0|max:10',
            'q3' => 'required|numeric|min:0|max:10',
            'q4' => 'required|numeric|min:0|max:10',
            'q5' => 'required|numeric|min:0|max:10',
            'q6' => 'required|numeric|min:0|max:10',
            'score' => 'required|numeric|min:0',
        ]);

        BasdaiAssessment::create([
            ...$data,
            'patient_id'  => $patient->id,
            'doctor_id'   => Auth::id(),
            'assessed_at' => now(),
        ]);

        return redirect()->route('doctor.patients.overview', $patient->id)
            ->with('success', 'BASDAI saved to patient.');
    }

    // ---------------- ASDAS-CRP ----------------
    public function asdasCrp(Patient $patient)
    {
        return Inertia::render('Doctor/Calculators/AsdasCrp', [
            'patient' => $patient->only(['id','name','national_id']),
        ]);
    }

    public function storeAsdasCrp(Request $request, Patient $patient)
    {
        $data = $request->validate([
            'back_pain'                => 'required|numeric|min:0|max:10',
            'duration_morning_stiffness'=> 'required|numeric|min:0|max:10',
            'patient_global'           => 'required|numeric|min:0|max:10',
            'peripheral_pain_swelling' => 'required|numeric|min:0|max:10',
            'crp'                      => 'required|numeric|min:0',
            'score'                    => 'required|numeric|min:0',
        ]);

        AsdasCrpAssessment::create([
            ...$data,
            'patient_id'  => $patient->id,
            'doctor_id'   => Auth::id(),
            'assessed_at' => now(),
        ]);

        return redirect()->route('doctor.patients.overview', $patient->id)
            ->with('success', 'ASDAS-CRP saved to patient.');
    }

    // ---------------- HAQ-DI ----------------
    public function haqdi(Patient $patient)
    {
        return Inertia::render('Doctor/Calculators/Haqdi', [
            'patient' => $patient->only(['id','name','national_id']),
        ]);
    }

    public function storeHaqdi(Request $request, Patient $patient)
    {
        $data = $request->validate([
            'score' => 'required|numeric|min:0|max:3',
        ]);

        HaqdiAssessment::create([
            ...$data,
            'patient_id'  => $patient->id,
            'doctor_id'   => Auth::id(),
            'assessed_at' => now(),
        ]);

        return redirect()->route('doctor.patients.overview', $patient->id)
            ->with('success', 'HAQ-DI saved to patient.');
    }

    // ---------------- DAPSA ----------------
    public function dapsa(Patient $patient)
    {
        return Inertia::render('Doctor/Calculators/Dapsa', [
            'patient' => $patient->only(['id','name','national_id']),
        ]);
    }

    public function storeDapsa(Request $request, Patient $patient)
    {
        $data = $request->validate([
            'tjc68'     => 'required|integer|min:0|max:68',
            'sjc66'     => 'required|integer|min:0|max:66',
            'pt_global' => 'required|numeric|min:0|max:10',
            'pain_vas'  => 'required|numeric|min:0|max:10',
            'crp'       => 'required|numeric|min:0',
            'score'     => 'required|numeric|min:0',
        ]);

        DapsaAssessment::create([
            ...$data,
            'patient_id'  => $patient->id,
            'doctor_id'   => Auth::id(),
            'assessed_at' => now(),
        ]);

        return redirect()->route('doctor.patients.overview', $patient->id)
            ->with('success', 'DAPSA saved to patient.');
    }

    // ---------------- VAS ----------------
    public function vas(Patient $patient)
    {
        return Inertia::render('Doctor/Calculators/Vas', [
            'patient' => $patient->only(['id','name','national_id']),
        ]);
    }

    public function storeVas(Request $request, Patient $patient)
    {
        $data = $request->validate([
            'value' => 'required|numeric|min:0|max:100',
        ]);

        VasEntry::create([
            ...$data,
            'patient_id'  => $patient->id,
            'doctor_id'   => Auth::id(),
            'assessed_at' => now(),
        ]);

        return redirect()->route('doctor.patients.overview', $patient->id)
            ->with('success', 'VAS saved to patient.');
    }

    // ---------------- BMI ----------------
    public function bmi(Patient $patient)
    {
        return Inertia::render('Doctor/Calculators/Bmi', [
            'patient' => $patient->only(['id','name','national_id']),
        ]);
    }

    public function storeBmi(Request $request, Patient $patient)
    {
        $data = $request->validate([
            'weight' => 'required|numeric|min:0',
            'height' => 'required|numeric|min:0',
            'bmi'    => 'required|numeric|min:0',
        ]);

        BmiEntry::create([
            ...$data,
            'patient_id'  => $patient->id,
            'doctor_id'   => Auth::id(),
            'assessed_at' => now(),
        ]);

        return redirect()->route('doctor.patients.overview', $patient->id)
            ->with('success', 'BMI saved to patient.');
    }

    // ---------------- EULAR Response ----------------
    public function eularResp(Patient $patient)
    {
        return Inertia::render('Doctor/Calculators/Eular', [
            'patient' => $patient->only(['id','name','national_id']),
        ]);
    }

    public function storeEularResp(Request $request, Patient $patient)
    {
        $data = $request->validate([
            'baseline_das28' => 'required|numeric|min:0',
            'followup_das28' => 'required|numeric|min:0',
            'response'       => 'required|string',
        ]);

        EularResponse::create([
            ...$data,
            'patient_id'  => $patient->id,
            'doctor_id'   => Auth::id(),
            'assessed_at' => now(),
        ]);

        return redirect()->route('doctor.patients.overview', $patient->id)
            ->with('success', 'EULAR Response saved to patient.');
    }
    
}
