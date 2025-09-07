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
use Illuminate\Support\Facades\Gate;


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

    public function editDas28(Patient $patient, Das28Assessment $assessment)
    {
        abort_unless($assessment->patient_id === $patient->id, 404);

        return Inertia::render('Doctor/Calculators/Das28', [
            'patient' => $patient->only(['id','name','national_id']),
            'prefill' => $assessment->only([
                'id','variant','tjc28','sjc28','gh','esr','crp','score','category','tender_joints','swollen_joints'
            ]),
            'mode'    => 'edit',
        ]);
    }

    public function updateDas28(Request $request, Patient $patient, Das28Assessment $assessment)
    {
        abort_unless($assessment->patient_id === $patient->id, 404);

        $data = $request->validate([
            'variant'        => 'required|in:ESR,CRP',
            'esr'            => 'nullable|numeric|min:0',
            'crp'            => 'nullable|numeric|min:0',
            'gh'             => 'nullable|numeric|min:0|max:100',
            'sjc28'          => 'required|integer|min:0|max:28',
            'tjc28'          => 'required|integer|min:0|max:28',
            'tender_joints'  => 'array',
            'swollen_joints' => 'array',
            'score'          => 'required|numeric|min:0',
            'category'       => 'required|string',
        ]);

        $assessment->update($data + ['doctor_id' => Auth::id()]);

        return redirect()->route('doctor.patients.overview', $patient->id)
            ->with('success', 'DAS28 updated.');
    }

    public function destroyDas28(Patient $patient, Das28Assessment $assessment)
    {
        abort_unless($assessment->patient_id === $patient->id, 404);
        $assessment->delete();

        return redirect()->back()->with('success', 'DAS28 deleted.');
    }
    

    /* ---------- CDAI ----------*/ 

   public function cdai(Patient $patient)
    {
        return Inertia::render('Doctor/Calculators/Cdai', [
            'patient' => $patient->only(['id','name','national_id']),
        ]);
    }
        public function editCdai(Patient $patient, CdaiAssessment $assessment)
    {
        abort_unless($assessment->patient_id === $patient->id, 404);
        return Inertia::render('Doctor/Calculators/Cdai', [
            'patient'  => $patient->only(['id','name','national_id']),
            'prefill'  => $assessment->only([
                'id','tjc28','sjc28','ptg','phg','score','category','tender_joints','swollen_joints'
            ]),
            'mode'     => 'edit',
        ]);
    }

    public function updateCdai(Request $request, Patient $patient, CdaiAssessment $assessment)
    {
        abort_unless($assessment->patient_id === $patient->id, 404);

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

        $assessment->update($data + ['doctor_id' => Auth::id()]);

        return redirect()->route('doctor.patients.overview', $patient->id)
            ->with('success', 'CDAI updated.');
    }

    public function destroyCdai(Patient $patient, CdaiAssessment $assessment)
    {
        abort_unless($assessment->patient_id === $patient->id, 404);
        $assessment->delete();

        return redirect()->back()->with('success', 'CDAI deleted.');
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

        return redirect()
            ->route('doctor.patients.overview', $patient->id)
            ->with('success', 'SDAI saved to patient.')
            ->setStatusCode(303); // <-- important
        }
        public function editSdai(Patient $patient, SdaiAssessment $assessment)
        {
            abort_unless($assessment->patient_id === $patient->id, 404);

            return Inertia::render('Doctor/Calculators/Sdai', [
                'patient' => $patient->only(['id','name','national_id']),
                'prefill' => $assessment->only([
                    'id','tjc28','sjc28','pt_global','ph_global','crp','score'
                ]),
                'mode'    => 'edit',
            ]);
        }

        public function updateSdai(Request $request, Patient $patient, SdaiAssessment $assessment)
        {
            abort_unless($assessment->patient_id === $patient->id, 404);

            $data = $request->validate([
                'tjc28'     => 'required|integer|min:0|max:28',
                'sjc28'     => 'required|integer|min:0|max:28',
                'pt_global' => 'required|numeric|min:0|max:10',
                'ph_global' => 'required|numeric|min:0|max:10',
                'crp'       => 'required|numeric|min:0',
                'score'     => 'required|numeric|min:0',
            ]);

            $assessment->update($data + ['doctor_id' => Auth::id()]);

            return redirect()
                ->route('doctor.patients.overview', $patient->id)
                ->with('success', 'SDAI updated.');
        }

        public function destroySdai(Patient $patient, SdaiAssessment $assessment)
        {
            abort_unless($assessment->patient_id === $patient->id, 404);

            $assessment->delete();

            return redirect()->back()->with('success', 'SDAI deleted.');
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

    
    public function editBasdai(Patient $patient, BasdaiAssessment $assessment)
    {
        abort_unless($assessment->patient_id === $patient->id, 404);

        return Inertia::render('Doctor/Calculators/Basdai', [
            'patient' => $patient->only(['id','name','national_id']),
            'prefill' => $assessment->only(['id','q1','q2','q3','q4','q5','q6','score']),
            'mode'    => 'edit',
        ]);
    }

    public function updateBasdai(Request $request, Patient $patient, BasdaiAssessment $assessment)
    {
        abort_unless($assessment->patient_id === $patient->id, 404);

        $data = $request->validate([
            'q1' => 'required|numeric|min:0|max:10',
            'q2' => 'required|numeric|min:0|max:10',
            'q3' => 'required|numeric|min:0|max:10',
            'q4' => 'required|numeric|min:0|max:10',
            'q5' => 'required|numeric|min:0|max:10',
            'q6' => 'required|numeric|min:0|max:10',
            'score' => 'required|numeric|min:0',
        ]);

        $assessment->update($data + ['doctor_id' => Auth::id()]);

        return redirect()->route('doctor.patients.overview', $patient->id)
            ->with('success', 'BASDAI updated.');
    }

    public function destroyBasdai(Patient $patient, BasdaiAssessment $assessment)
    {
        abort_unless($assessment->patient_id === $patient->id, 404);
        $assessment->delete();
        return redirect()->back()->with('success', 'BASDAI deleted.');
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
            'back_pain'                  => 'required|numeric|min:0|max:10',
            'morning_stiffness_duration' => 'required|numeric|min:0|max:10',
            'pt_global'             => 'required|numeric|min:0|max:10',
            'peripheral_pain_swelling'   => 'required|numeric|min:0|max:10',
            'crp'                        => 'required|numeric|min:0',
            'score'                      => 'required|numeric|min:0',
        ]);

        AsdasCrpAssessment::create([
            ...$data,
            'patient_id'  => $patient->id,
            'doctor_id'   => Auth::id(),
            'assessed_at' => now(),
        ]);

        return redirect()
            ->route('doctor.patients.overview', $patient->id)
            ->with('success', 'ASDAS-CRP saved to patient.')
            ->setStatusCode(303); // <-- ensures Inertia follows the redirect
    }

    public function editAsdasCrp(Patient $patient, AsdasCrpAssessment $assessment)
    {
        abort_unless($assessment->patient_id === $patient->id, 404);

        return Inertia::render('Doctor/Calculators/AsdasCrp', [
            'patient' => $patient->only(['id','name','national_id']),
            'prefill' => $assessment->only([
                'id','back_pain','morning_stiffness_duration','pt_global','peripheral_pain_swelling','crp','score'
            ]),
            'mode'    => 'edit',
        ]);
    }

    public function updateAsdasCrp(Request $request, Patient $patient, AsdasCrpAssessment $assessment)
    {
        abort_unless($assessment->patient_id === $patient->id, 404);

        $data = $request->validate([
            'back_pain'                  => 'required|numeric|min:0|max:10',
            'morning_stiffness_duration' => 'required|numeric|min:0|max:10',
            'pt_global'                  => 'required|numeric|min:0|max:10',
            'peripheral_pain_swelling'   => 'required|numeric|min:0|max:10',
            'crp'                        => 'required|numeric|min:0',
            'score'                      => 'required|numeric|min:0',
        ]);

        $assessment->update($data + ['doctor_id' => Auth::id()]);

        return redirect()->route('doctor.patients.overview', $patient->id)
            ->with('success', 'ASDAS-CRP updated.');
    }

    public function destroyAsdasCrp(Patient $patient, AsdasCrpAssessment $assessment)
    {
        abort_unless($assessment->patient_id === $patient->id, 404);
        $assessment->delete();
        return redirect()->back()->with('success', 'ASDAS-CRP deleted.');
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
            // optional: store raw responses if you add a column later
            'items' => 'nullable|array',
        ]);

        HaqdiAssessment::create([
            // 'items' => $data['items'] ?? null, // add column if you need it
            'score'      => $data['score'],
            'patient_id' => $patient->id,
            'doctor_id'  => Auth::id(),
            'assessed_at'=> now(),
        ]);

        return redirect()
            ->route('doctor.patients.overview', $patient->id)
            ->with('success', 'HAQ-DI saved to patient.')
            ->setStatusCode(303); // <- ensures Inertia follows the redirect after POST
    }

    public function editHaqdi(Patient $patient, HaqdiAssessment $assessment)
    {
        abort_unless($assessment->patient_id === $patient->id, 404);

        return Inertia::render('Doctor/Calculators/Haqdi', [
            'patient' => $patient->only(['id','name','national_id']),
            'prefill' => $assessment->only(['id','score']),
            'mode'    => 'edit',
        ]);
    }

    public function updateHaqdi(Request $request, Patient $patient, HaqdiAssessment $assessment)
    {
        abort_unless($assessment->patient_id === $patient->id, 404);

        $data = $request->validate([
            'score' => 'required|numeric|min:0|max:3',
        ]);

        $assessment->update($data + ['doctor_id' => Auth::id()]);

        return redirect()->route('doctor.patients.overview', $patient->id)
            ->with('success', 'HAQ-DI updated.');
    }

    public function destroyHaqdi(Patient $patient, HaqdiAssessment $assessment)
    {
        abort_unless($assessment->patient_id === $patient->id, 404);
        $assessment->delete();
        return redirect()->back()->with('success', 'HAQ-DI deleted.');
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
            'pain'      => 'required|numeric|min:0|max:10',
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
            ->with('success', 'DAPSA saved to patient.')
            ->setStatusCode(303);


    }

        public function editDapsa(Patient $patient, DapsaAssessment $assessment)
    {
        abort_unless($assessment->patient_id === $patient->id, 404);

        return Inertia::render('Doctor/Calculators/Dapsa', [
            'patient' => $patient->only(['id','name','national_id']),
            'prefill' => $assessment->only(['id','tjc68','sjc66','pt_global','pain','crp','score']),
            'mode'    => 'edit',
        ]);
    }

    public function updateDapsa(Request $request, Patient $patient, DapsaAssessment $assessment)
    {
        abort_unless($assessment->patient_id === $patient->id, 404);

        $data = $request->validate([
            'tjc68'     => 'required|integer|min:0|max:68',
            'sjc66'     => 'required|integer|min:0|max:66',
            'pt_global' => 'required|numeric|min:0|max:10',
            'pain'      => 'required|numeric|min:0|max:10',
            'crp'       => 'required|numeric|min:0',
            'score'     => 'required|numeric|min:0',
        ]);

        $assessment->update($data + ['doctor_id' => Auth::id()]);

        return redirect()->route('doctor.patients.overview', $patient->id)
            ->with('success', 'DAPSA updated.');
    }

    public function destroyDapsa(Patient $patient, DapsaAssessment $assessment)
    {
        abort_unless($assessment->patient_id === $patient->id, 404);
        $assessment->delete();
        return redirect()->back()->with('success', 'DAPSA deleted.');
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
        'label' => 'nullable|string|max:100',
        'value' => 'required|numeric|min:0|max:100',
    ]);

    VasEntry::create([
        'label'      => $data['label'] ?? 'Global health', // fallback default
        'value'      => $data['value'],
        'patient_id' => $patient->id,
        'doctor_id'  => Auth::id(),
        'assessed_at'=> now(),
    ]);

    return redirect()
        ->route('doctor.patients.overview', $patient->id)
        ->with('success', 'VAS saved to patient.')
        ->setStatusCode(303);
    }

    public function editVas(Patient $patient, VasEntry $entry)
    {
        abort_unless($entry->patient_id === $patient->id, 404);

        return Inertia::render('Doctor/Calculators/Vas', [
            'patient' => $patient->only(['id','name','national_id']),
            'prefill' => $entry->only(['id','label','value']),
            'mode'    => 'edit',
        ]);
    }

    public function updateVas(Request $request, Patient $patient, VasEntry $entry)
    {
        abort_unless($entry->patient_id === $patient->id, 404);

        $data = $request->validate([
            'label' => 'nullable|string|max:100',
            'value' => 'required|numeric|min:0|max:100',
        ]);

        $entry->update($data + ['doctor_id' => Auth::id()]);

        return redirect()->route('doctor.patients.overview', $patient->id)
            ->with('success', 'VAS updated.');
    }

    public function destroyVas(Patient $patient, VasEntry $entry)
    {
        abort_unless($entry->patient_id === $patient->id, 404);
        $entry->delete();
        return redirect()->back()->with('success', 'VAS deleted.');
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
        'weight_kg' => 'required|numeric|min:0.1',
        'height_m'  => 'required|numeric|min:0.3',
    ]);

    $w = (float) $data['weight_kg'];
    $h = (float) $data['height_m'];
    $bmi = $h > 0 ? round($w / ($h * $h), 1) : null;

    // Compute band on the server too
    $band = null;
    if ($bmi !== null) {
        if ($bmi < 18.5)      $band = 'Underweight';
        elseif ($bmi < 25.0)  $band = 'Normal';
        elseif ($bmi < 30.0)  $band = 'Overweight';
        else                  $band = 'Obese';
    }

    BmiEntry::create([
        'weight_kg'  => $w,
        'height_m'   => $h,
        'bmi'        => $bmi,
        'band'       => $band,
        'patient_id' => $patient->id,
        'doctor_id'  => Auth::id(),
        'assessed_at'=> now(),
    ]);

    return redirect()
        ->route('doctor.patients.overview', $patient->id)
        ->with('success', 'BMI saved to patient.')
        ->setStatusCode(303); // important for SPA redirect
    }

        public function editBmi(Patient $patient, BmiEntry $entry)
    {
        abort_unless($entry->patient_id === $patient->id, 404);

        return Inertia::render('Doctor/Calculators/Bmi', [
            'patient' => $patient->only(['id','name','national_id']),
            'prefill' => $entry->only(['id','weight_kg','height_m','bmi','band']),
            'mode'    => 'edit',
        ]);
    }

    public function updateBmi(Request $request, Patient $patient, BmiEntry $entry)
    {
        abort_unless($entry->patient_id === $patient->id, 404);

        $data = $request->validate([
            'weight_kg' => 'required|numeric|min:0.1',
            'height_m'  => 'required|numeric|min:0.3',
        ]);

        $w = (float) $data['weight_kg'];
        $h = (float) $data['height_m'];
        $bmi = $h > 0 ? round($w / ($h*$h), 1) : null;

        $band = null;
        if ($bmi !== null) {
            if     ($bmi < 18.5) $band = 'Underweight';
            elseif ($bmi < 25.0) $band = 'Normal';
            elseif ($bmi < 30.0) $band = 'Overweight';
            else                 $band = 'Obese';
        }

        $entry->update([
            'weight_kg' => $w,
            'height_m'  => $h,
            'bmi'       => $bmi,
            'band'      => $band,
            'doctor_id' => Auth::id(),
        ]);

        return redirect()->route('doctor.patients.overview', $patient->id)
            ->with('success', 'BMI updated.');
    }

    public function destroyBmi(Patient $patient, BmiEntry $entry)
    {
        abort_unless($entry->patient_id === $patient->id, 404);
        $entry->delete();
        return redirect()->back()->with('success', 'BMI deleted.');
    }



    // ---------------- EULAR Response ----------------
        public function eularResp(Patient $patient)
    {
        $das28 = Das28Assessment::where('patient_id', $patient->id)
            ->orderByDesc('assessed_at')
            ->take(2)
            ->get(['id','score','assessed_at']);

        return Inertia::render('Doctor/Calculators/Eular', [
            'patient' => $patient->only(['id','name','national_id']),
            'das28_history' => $das28,
        ]);
    }

        public function storeEularResp(Request $request, Patient $patient)
        {
            $data = $request->validate([
                'baseline_das28' => 'required|numeric|min:0',
                'current_das28' => 'required|numeric|min:0',
                'response'       => 'required|string',
            ]);

            EularResponse::create([
                ...$data,
                'patient_id'  => $patient->id,
                'doctor_id'   => Auth::id(),
                'assessed_at' => now(),
            ]);

            return redirect()->route('doctor.patients.overview', $patient->id)
                ->with('success', 'EULAR Response saved to patient.')
                ->setStatusCode(303);
        }

        public function editEularResp(Patient $patient, EularResponse $response)
    {
        abort_unless($response->patient_id === $patient->id, 404);

        return Inertia::render('Doctor/Calculators/Eular', [
            'patient' => $patient->only(['id','name','national_id']),
            'prefill' => $response->only(['id','baseline_das28','current_das28','delta','response']),
            'mode'    => 'edit',
        ]);
    }

    public function updateEularResp(Request $request, Patient $patient, EularResponse $response)
    {
        abort_unless($response->patient_id === $patient->id, 404);

        $data = $request->validate([
            'baseline_das28' => 'required|numeric|min:0',
            'current_das28' => 'required|numeric|min:0',
            'response'       => 'required|string',
        ]);

        // compute delta server-side for correctness
        $delta = round(($data['baseline_das28'] - $data['current_das28']), 2);

        $response->update($data + [
            'delta'     => $delta,
            'doctor_id' => Auth::id(),
        ]);

        return redirect()->route('doctor.patients.overview', $patient->id)
            ->with('success', 'EULAR response updated.');
    }

    public function destroyEularResp(Patient $patient, EularResponse $response)
    {
        abort_unless($response->patient_id === $patient->id, 404);
        $response->delete();
        return redirect()->back()->with('success', 'EULAR response deleted.');
    }
    
}
