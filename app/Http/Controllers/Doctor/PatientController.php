<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\LabOrder;
use App\Models\Das28Assessment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

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

        // expose allergies for the overview card
        $patient->setVisible(['id','name','national_id','gender','age','dob','phone','district','photo_path','allergies']);

        $labOrders = LabOrder::with(['items.test','items.result'])
            ->where('patient_id', $patient->id)
            ->orderByDesc('ordered_at')
            ->limit(6)
            ->get();

        $das28 = Das28Assessment::where('patient_id', $patient->id)
            ->orderByDesc('assessed_at')
            ->orderByDesc('id')
            ->limit(5)
            ->get([
                'id','variant','score','category','tjc28','sjc28','assessed_at'
            ]);

        return Inertia::render('Doctor/Patient/Overview', [
            'patient' => $patient,
            'visits'  => $recentVisits,
            'lab'     => ['orders' => $labOrders],
            'das28'   => $das28,
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
}
