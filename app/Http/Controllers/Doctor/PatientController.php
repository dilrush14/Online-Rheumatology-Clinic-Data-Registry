<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\LabOrder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
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
use Illuminate\Support\Facades\Storage;
use App\Models\Prescription;
use Barryvdh\DomPDF\Facade\Pdf;

class PatientController extends Controller
{
    /** Central lists (used by validation/rules) */
    protected array $ETHNICITIES = ['Sinhalese','Tamil','Moor','Indian Tamil','Other'];
    protected array $RELIGIONS  = ['Buddhism','Hinduism','Islam','Christianity','Other'];
    protected array $ALLERGY_TYPES = ['food','animal','medicine'];

    protected array $PROVINCES = [
        'Western','Central','Southern','Northern','Eastern','North Western','North Central','Uva','Sabaragamuwa',
    ];

    protected array $DISTRICTS = [
        'Colombo','Gampaha','Kalutara',
        'Kandy','Matale','Nuwara Eliya',
        'Galle','Matara','Hambantota',
        'Jaffna','Kilinochchi','Mannar','Vavuniya','Mullaitivu',
        'Batticaloa','Ampara','Trincomalee',
        'Kurunegala','Puttalam',
        'Anuradhapura','Polonnaruwa',
        'Badulla','Monaragala',
        'Ratnapura','Kegalle',
    ];

    /** List patients with search & pagination */
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));

        $patients = Patient::query()
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('national_id', 'like', "%{$search}%")
                      ->orWhere('phone', 'like', "%{$search}%")
                      ->orWhere('district', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('created_at')
            ->select(
                'id','name','national_id','gender','age','dob',
                'district','phone','photo_path','created_at'
            )
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Doctor/Patient/Index', [
            'patients' => $patients,
            'filters'  => ['search' => $search],
        ]);
    }

    /** Create form */
    public function create()
    {
        return Inertia::render('Doctor/Patient/Create', [
            'lists' => [
                'ethnicities' => $this->ETHNICITIES,
                'religions'   => $this->RELIGIONS,
                'provinces'   => $this->PROVINCES,
                'districts'   => $this->DISTRICTS,
                'allergyTypes'=> $this->ALLERGY_TYPES,
            ],
        ]);
    }

    /** Store patient */
    public function store(Request $request)
    {
        // Normalize incoming payload (decode allergies if sent as JSON string, null-out blanks)
        $this->normalizePatientPayload($request);

        $nicRegex = '/^(?:\d{9}[VvXx]|\d{12})$/'; // LK NIC: 9 digits + V/X OR 12 digits

        $validated = $request->validate([
            // Identification
            'national_id' => ['required','string','max:12',"regex:$nicRegex",'unique:patients,national_id'],
            'title' => 'nullable|string|max:20',
            'name' => 'required|string|max:255',
            'other_names' => 'nullable|string|max:255',

            // Demographics
            'gender' => ['required', Rule::in(['M','F','Other'])],
            'civil_status' => 'nullable|string|max:30',
            'marital_status' => 'nullable|string|max:30',
            'ethnicity' => ['nullable', Rule::in($this->ETHNICITIES)],
            'blood_group' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',

            // DOB / Age
            'dob' => 'nullable|date',
            'age' => 'nullable|integer|min:0|max:130',

            // Contact & Address
            'phone' => ['nullable','regex:/^0\d{9}$/'],
            'email' => 'nullable|email|max:255',
            'address_line1' => 'nullable|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'village' => 'nullable|string|max:255',
            'district' => ['nullable', Rule::in($this->DISTRICTS)],
            'province' => ['nullable', Rule::in($this->PROVINCES)],

            // Guardian & Emergency
            'guardian_name' => 'nullable|string|max:255',
            'guardian_relationship' => 'nullable|string|max:50',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => ['nullable','regex:/^0\d{9}$/'],

            // Social / Administrative
            'religion' => ['nullable', Rule::in($this->RELIGIONS)],
            'occupation' => 'nullable|string|max:120',
            'health_scheme' => 'nullable|string|max:120',

            // Clinical (multi-type allergies)
            'chronic_conditions' => 'nullable|string',
            'disability_status' => 'nullable|string',
            'allergies' => 'nullable|array',
            'allergies.types' => 'nullable|array',
            'allergies.types.*' => ['string', Rule::in($this->ALLERGY_TYPES)],
            'allergies.note' => 'nullable|string|max:1000',

            // Notes & Media
            'remarks' => 'nullable|string',
            'photo' => 'nullable|image|max:5120',
        ]);

        $data = $validated;

        if ($request->hasFile('photo')) {
            $data['photo_path'] = $request->file('photo')->store('patients', 'public');
        }

        Patient::create($data);

        return redirect()
            ->route('doctor.patients.index')
            ->with('success', 'Patient registered successfully.');
    }

    /** Show patient details */
    public function show(Patient $patient)
    {
        $patient->setVisible([
            'id','national_id','title','name','other_names',
            'gender','civil_status','marital_status','ethnicity','blood_group',
            'dob','age','phone','email','address_line1','address_line2','village','district','province',
            'guardian_name','guardian_relationship','emergency_contact_name','emergency_contact_phone',
            'religion','occupation','health_scheme','chronic_conditions','disability_status','allergies',
            'photo_path','remarks','created_at','updated_at'
        ]);

        return Inertia::render('Doctor/Patient/Show', [
            'patient' => $patient,
            'lists' => [
                'ethnicities' => $this->ETHNICITIES,
                'religions'   => $this->RELIGIONS,
                'provinces'   => $this->PROVINCES,
                'districts'   => $this->DISTRICTS,
                'allergyTypes'=> $this->ALLERGY_TYPES,
            ],
        ]);
    }

    /** Edit form */
    public function edit(Patient $patient)
    {
        return Inertia::render('Doctor/Patient/Edit', [
            'patient' => $patient->only([
                'id','national_id','title','name','other_names',
                'gender','civil_status','marital_status','ethnicity','blood_group',
                'dob','age','phone','email','address_line1','address_line2','village','district','province',
                'guardian_name','guardian_relationship','emergency_contact_name','emergency_contact_phone',
                'religion','occupation','health_scheme','chronic_conditions','disability_status','allergies',
                'photo_path','remarks'
            ]),
            'lists' => [
                'ethnicities' => $this->ETHNICITIES,
                'religions'   => $this->RELIGIONS,
                'provinces'   => $this->PROVINCES,
                'districts'   => $this->DISTRICTS,
                'allergyTypes'=> $this->ALLERGY_TYPES,
            ],
        ]);
    }

    /** Update then go back to Overview */
    public function update(Request $request, Patient $patient)
    {
        // Normalize incoming payload (decode allergies if sent as JSON string, null-out blanks)
        $this->normalizePatientPayload($request);

        $nicRegex = '/^(?:\d{9}[VvXx]|\d{12})$/';

        $validated = $request->validate([
            'national_id' => [
                'required','string','max:12',"regex:$nicRegex",
                Rule::unique('patients','national_id')->ignore($patient->id),
            ],
            'title' => 'nullable|string|max:20',
            'name' => 'required|string|max:255',
            'other_names' => 'nullable|string|max:255',

            'gender' => ['required', Rule::in(['M','F','Other'])],
            'civil_status' => 'nullable|string|max:30',
            'marital_status' => 'nullable|string|max:30',
            'ethnicity' => ['nullable', Rule::in($this->ETHNICITIES)],
            'blood_group' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',

            'dob' => 'nullable|date',
            'age' => 'nullable|integer|min:0|max:130',

            'phone' => ['nullable','regex:/^0\d{9}$/'],
            'email' => 'nullable|email|max:255',
            'address_line1' => 'nullable|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'village' => 'nullable|string|max:255',
            'district' => ['nullable', Rule::in($this->DISTRICTS)],
            'province' => ['nullable', Rule::in($this->PROVINCES)],

            'guardian_name' => 'nullable|string|max:255',
            'guardian_relationship' => 'nullable|string|max:50',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => ['nullable','regex:/^0\d{9}$/'],

            'religion' => ['nullable', Rule::in($this->RELIGIONS)],
            'occupation' => 'nullable|string|max:120',
            'health_scheme' => 'nullable|string|max:120',

            'chronic_conditions' => 'nullable|string',
            'disability_status' => 'nullable|string',

            // Multi-type allergies
            'allergies' => 'nullable|array',
            'allergies.types' => 'nullable|array',
            'allergies.types.*' => ['string', Rule::in($this->ALLERGY_TYPES)],
            'allergies.note' => 'nullable|string|max:1000',

            'remarks' => 'nullable|string',
            'photo' => 'nullable|image|max:5120',
        ]);

        $data = collect($validated)->except('photo')->toArray();

        if ($request->hasFile('photo')) {
            $data['photo_path'] = $request->file('photo')->store('patients', 'public');
        }
        if ($request->hasFile('photo') && $patient->photo_path) {
            Storage::disk('public')->delete($patient->photo_path);
        }

        $patient->update($data);

        return redirect()
            ->route('doctor.patients.overview', $patient->id)
            ->with('success', 'Patient updated successfully.');
    }

    /** Delete patient */
    public function destroy(Patient $patient)
    {
        $patient->delete();

        return redirect()
            ->route('doctor.patients.index')
            ->with('success', 'Patient deleted successfully.');
    }

    /** Overview (visits, labs, DAS28) */
    public function overview(Patient $patient)
{
    $recentVisits = $patient->visits()
        ->orderByDesc('visit_date')
        ->orderByDesc('created_at')
        ->select('id','patient_id','visit_date','complaints','provisional_diagnoses','plan','notes','created_at')
        ->limit(12)
        ->get();

    // expose these fields on the patient object
    $patient->setVisible([
        'id','name','national_id','gender','age','dob','phone','district','photo_path',
        'allergies','prescriptions'
    ]);

    $labOrders = LabOrder::with(['items.test','items.result'])
        ->where('patient_id', $patient->id)
        ->orderByDesc('ordered_at')
        ->limit(6)
        ->get();

    $das28 = Das28Assessment::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)
        ->get(['id','variant','score','category','tjc28','sjc28','assessed_at']);

    $cdai = CdaiAssessment::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')
        ->limit(5)
        ->get(['id','tjc28','sjc28','ptg','phg','score','category','assessed_at']);

    $sdai = SdaiAssessment::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)
        ->get(['id','tjc28','sjc28','pt_global','ph_global','crp','score','assessed_at']);

    $basdai = BasdaiAssessment::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)
        ->get(['id','q1','q2','q3','q4','q5','q6','score','assessed_at']);

    $asdas = AsdasCrpAssessment::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)
        ->get(['id','back_pain','morning_stiffness_duration','pt_global','peripheral_pain_swelling','crp','score','assessed_at']);

    $haqdi = HaqdiAssessment::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)
        ->get(['id','score','assessed_at']);

    $dapsa = DapsaAssessment::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)
        ->get(['id','tjc68','sjc66','pt_global','pain','crp','score','assessed_at']);

    $vas = VasEntry::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)
        ->get(['id','label','value','assessed_at']);

    $bmi = BmiEntry::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)
        ->get(['id','weight_kg','height_m','bmi','band','assessed_at']);

    $eular = EularResponse::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)
        ->get(['id','baseline_das28','current_das28','delta','response','assessed_at']);

    // ✅ Build prescriptions NOW
    $prescriptions = Prescription::with('items')
        ->with(['creator:id,name','editor:id,name'])
        ->where('patient_id', $patient->id)
        ->latest('prescribed_date')->latest('id')
        ->limit(5)
        ->get()
        ->map(fn($p)=>[
            'id'=>$p->id,
            'prescribed_date'=>optional($p->prescribed_date)->toDateString(),
            'diagnosis'=>$p->diagnosis,
            'created_at'=>$p->created_at,
            'updated_at'=>$p->updated_at,
            'created_by_name'=>$p->creator?->name,
            'updated_by_name'=>$p->editor?->name,
            'items'=>$p->items->map(fn($i)=>[
                'id'=>$i->id,
                'drug_name_cache'=>$i->drug_name_cache,
                'dosage'=>$i->dosage,
                'frequency'=>$i->frequency,
                'duration'=>$i->duration,
                'route'=>$i->route,
            ]),
        ]);

    // ✅ Attach AFTER it exists
    $patient->setAttribute('prescriptions', $prescriptions);

    return Inertia::render('Doctor/Patient/Overview', [
        'patient' => $patient,
        'visits'  => $recentVisits,
        'lab'     => ['orders' => $labOrders],
        'das28'   => $das28,
        'cdai'    => $cdai,
        'sdai'    => $sdai,
        'basdai'  => $basdai,
        'asdas'   => $asdas,
        'haqdi'   => $haqdi,
        'dapsa'   => $dapsa,
        'vas'     => $vas,
        'bmi'     => $bmi,
        'eular'   => $eular,
    ]);
    }


    /** Global quick-search */
    public function quickSearch(Request $request)
    {
        $q = trim((string) $request->query('q', ''));

        if ($q === '') {
            return redirect()->route('doctor.patients.index');
        }

        $matches = Patient::query()
            ->where(function ($w) use ($q) {
                $w->where('name', 'like', "%{$q}%")
                  ->orWhere('national_id', 'like', "%{$q}%")
                  ->orWhere('phone', 'like', "%{$q}%")
                  ->orWhere('district', 'like', "%{$q}%");
            })
            ->orderBy('name')
            ->limit(10)
            ->get(['id']);

        if ($matches->count() === 1) {
            return redirect()->route('doctor.patients.overview', $matches->first()->id);
        }

        return redirect()->route('doctor.patients.index', ['search' => $q]);
    }

    /** Decode allergies JSON string & nullify empty strings */
    protected function normalizePatientPayload(Request $request): void
    {
        // If allergies comes as a JSON string (common with multipart), decode it
        if ($request->has('allergies') && is_string($request->input('allergies'))) {
            $decoded = json_decode($request->input('allergies'), true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $request->merge(['allergies' => $decoded]);
            }
        }

        // Convert empty strings to null for these fields
        foreach ([
            'dob','age','phone','email','address_line1','address_line2','village',
            'district','province','guardian_name','guardian_relationship',
            'emergency_contact_name','emergency_contact_phone','religion','occupation',
            'health_scheme','chronic_conditions','disability_status','remarks',
        ] as $key) {
            if ($request->has($key) && $request->input($key) === '') {
                $request->merge([$key => null]);
            }
        }
    }

    public function printOverview(Patient $patient)
{
    // keep same visibility as overview card
    $patient->setVisible(['id','name','national_id','gender','age','dob','phone','district','photo_path','allergies']);

    // Recent Visits
    $recentVisits = $patient->visits()
        ->orderByDesc('visit_date')
        ->orderByDesc('created_at')
        ->select('id','patient_id','visit_date','complaints','provisional_diagnoses','plan','notes','created_at')
        ->limit(12)
        ->get();

    // Lab Orders
    $labOrders = LabOrder::with(['items.test','items.result'])
        ->where('patient_id', $patient->id)
        ->orderByDesc('ordered_at')
        ->limit(6)
        ->get();

    // Calculators (same limits you used in overview)
    $das28 = Das28Assessment::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)->get(['id','variant','score','category','tjc28','sjc28','assessed_at']);

    $cdai = CdaiAssessment::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)->get(['id','tjc28','sjc28','ptg','phg','score','category','assessed_at']);

    $sdai = SdaiAssessment::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)->get(['id','tjc28','sjc28','pt_global','ph_global','crp','score','assessed_at']);

    $basdai = BasdaiAssessment::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)->get(['id','q1','q2','q3','q4','q5','q6','score','assessed_at']);

    $asdas = AsdasCrpAssessment::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)->get(['id','back_pain','morning_stiffness_duration','pt_global','peripheral_pain_swelling','crp','score','assessed_at']);

    $haqdi = HaqdiAssessment::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)->get(['id','score','assessed_at']);

    $dapsa = DapsaAssessment::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)->get(['id','tjc68','sjc66','pt_global','pain','crp','score','assessed_at']);

    $vas = VasEntry::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)->get(['id','label','value','assessed_at']);

    $bmi = BmiEntry::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)->get(['id','weight_kg','height_m','bmi','band','assessed_at']);

    $eular = EularResponse::where('patient_id', $patient->id)
        ->orderByDesc('assessed_at')->orderByDesc('id')
        ->limit(5)->get(['id','baseline_das28','current_das28','delta','response','assessed_at']);

    // Prescriptions (recent 5)
    $prescriptions = Prescription::with('items')
        ->with(['creator:id,name','editor:id,name'])
        ->where('patient_id', $patient->id)
        ->latest('prescribed_date')->latest('id')
        ->limit(5)
        ->get();

    $pdf = Pdf::loadView('pdf.patient-overview', [
        'patient'        => $patient,
        'visits'         => $recentVisits,
        'labOrders'      => $labOrders,
        'das28'          => $das28,
        'cdai'           => $cdai,
        'sdai'           => $sdai,
        'basdai'         => $basdai,
        'asdas'          => $asdas,
        'haqdi'          => $haqdi,
        'dapsa'          => $dapsa,
        'vas'            => $vas,
        'bmi'            => $bmi,
        'eular'          => $eular,
        'prescriptions'  => $prescriptions,
        // helper flag
        'hasAllergies'   => (bool)((($patient->allergies['types'] ?? []) || ($patient->allergies['note'] ?? null))),
    ]);

    return $pdf->stream("patient-{$patient->id}-overview.pdf");
    }

}
