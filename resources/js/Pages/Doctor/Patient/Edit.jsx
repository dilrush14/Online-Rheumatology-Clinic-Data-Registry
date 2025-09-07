// D:\rheumatology\project-rheuma\resources\js\Pages\Doctor\Patient\Edit.jsx
import React, { useEffect } from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';
import {
  BadgeCheck,
  Contact,
  FileText,
  HeartPulse,
  IdCard,
  MapPin,
  Phone,
  ShieldAlert,
  User2,
} from 'lucide-react';

/* ---------- Small UI helpers ---------- */
const SectionCard = ({ icon: Icon, title, subtitle, children }) => (
  <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
    <div className="flex items-center gap-2 border-b bg-gray-50/60 px-5 py-3">
      {Icon ? <Icon size={18} className="text-indigo-600" /> : null}
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      {subtitle ? <span className="ml-2 text-xs text-gray-500">{subtitle}</span> : null}
    </div>
    <div className="p-5">{children}</div>
  </section>
);

const Label = ({ htmlFor, children, required }) => (
  <label
    htmlFor={htmlFor}
    className="block text-xs font-medium text-gray-700 mb-1 tracking-wide uppercase"
  >
    {children} {required ? <span className="text-red-600">*</span> : null}
  </label>
);

const Input = ({ id, type = 'text', className = '', ...props }) => (
  <input
    id={id}
    type={type}
    className={
      'block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm placeholder-gray-400 ' +
      'focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 ' +
      className
    }
    {...props}
  />
);

const Select = ({ id, children, className = '', ...props }) => (
  <select
    id={id}
    className={
      'block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm ' +
      'focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 ' +
      className
    }
    {...props}
  >
    {children}
  </select>
);

const Textarea = ({ id, rows = 3, className = '', ...props }) => (
  <textarea
    id={id}
    rows={rows}
    className={
      'block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm ' +
      'focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 ' +
      className
    }
    {...props}
  />
);

const ErrorText = ({ children }) =>
  children ? <p className="mt-1.5 text-xs font-medium text-red-600">{children}</p> : null;

export default function Edit() {
  const { patient, lists = {} } = usePage().props;

  // ---- parse allergies coming from backend (string or object) ----
  const parsedAllergies = (() => {
    try {
      if (!patient?.allergies) return { types: [], note: '' };
      if (typeof patient.allergies === 'string') {
        const val = JSON.parse(patient.allergies);
        return val && typeof val === 'object'
          ? { types: val.types || [], note: val.note || '' }
          : { types: [], note: '' };
      }
      if (typeof patient.allergies === 'object') {
        return { types: patient.allergies.types || [], note: patient.allergies.note || '' };
      }
      return { types: [], note: '' };
    } catch {
      return { types: [], note: '' };
    }
  })();

  const form = useForm({
    // Identification
    national_id: patient.national_id || '',
    title: patient.title || '',
    name: patient.name || '',
    other_names: patient.other_names || '',

    // Demographics
    gender: patient.gender || '',
    civil_status: patient.civil_status || '',
    marital_status: patient.marital_status || '',
    ethnicity: patient.ethnicity || '',
    blood_group: patient.blood_group || '',

    // DOB / Age
    dob: patient.dob || '',
    age: patient.age ?? '',

    // Contact & Address
    phone: patient.phone || '',
    email: patient.email || '',
    address_line1: patient.address_line1 || '',
    address_line2: patient.address_line2 || '',
    village: patient.village || '',
    district: patient.district || '',
    province: patient.province || '',

    // Guardian / Emergency
    guardian_name: patient.guardian_name || '',
    guardian_relationship: patient.guardian_relationship || '',
    emergency_contact_name: patient.emergency_contact_name || '',
    emergency_contact_phone: patient.emergency_contact_phone || '',

    // Social / Admin
    religion: patient.religion || '',
    occupation: patient.occupation || '',
    health_scheme: patient.health_scheme || '',

    // Clinical
    chronic_conditions: patient.chronic_conditions || '',
    disability_status: patient.disability_status || '',
    allergies: parsedAllergies, // object in UI

    // Media
    photo: null,

    // Notes
    remarks: patient.remarks || '',
  });

  const { data, setData, processing, errors } = form;

  // Auto-calc age when DOB changes
  useEffect(() => {
    if (!data.dob) return;
    const dobDate = new Date(data.dob);
    if (isNaN(dobDate.getTime())) return;

    const today = new Date();
    let years = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) years--;
    if (years >= 0 && years <= 130) setData('age', String(years));
  }, [data.dob, setData]);

  const NIC_PATTERN = '^(?:\\d{9}[VvXx]|\\d{12})$';
  const PHONE_PATTERN = '^0\\d{9}$';

  // Allergy type checkbox helpers
  const toggleAllergyType = (t) => {
    const curr = data.allergies?.types || [];
    const exists = curr.includes(t);
    const next = exists ? curr.filter((x) => x !== t) : [...curr, t];
    setData('allergies', { ...data.allergies, types: next });
  };
  const isChecked = (t) => (data.allergies?.types || []).includes(t);
  const toTitle = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const handleSubmit = (e) => {
  e.preventDefault();

  const hasFile = data.photo instanceof File;

  // Transform payload for this submit only
  form.transform((payload) => ({
    ...payload,
    // stringify allergies ONLY when using FormData
    allergies: hasFile ? JSON.stringify(payload.allergies || {}) : (payload.allergies || {}),
    // when a file is present, use POST + method spoofing
    ...(hasFile ? { _method: 'PUT' } : {}),
  }));

  if (hasFile) {
    // ✅ File path: POST + _method=PUT + FormData
    form.post(route('doctor.patients.update', patient.id), {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => form.clearErrors(),
      onFinish: () => form.setData('photo', null),
    });
  } else {
    // ✅ No file: normal PUT (JSON)
    form.put(route('doctor.patients.update', patient.id), {
      preserveScroll: true,
      onSuccess: () => form.clearErrors(),
    });
  }
};


  return (
    <AppShell>
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Edit Patient
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {patient.name} • <span className="font-medium">{patient.national_id}</span>
            </p>
          </div>
          <Link
            href={route('doctor.patients.show', patient.id)}
            className="text-sm text-indigo-700 hover:text-indigo-900 underline underline-offset-4"
          >
            Cancel
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar: photo */}
          <aside className="md:col-span-1 space-y-6">
            <SectionCard icon={BadgeCheck} title="Patient Photo">
              <div className="flex items-start gap-4">
                <div className="w-40 h-40 rounded-xl overflow-hidden ring-1 ring-gray-200 bg-gray-50">
                  {patient.photo_path ? (
                    <img
                      src={`/storage/${patient.photo_path}`}
                      alt={patient.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      No Photo
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Label htmlFor="photo">Replace Photo</Label>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setData('photo', e.target.files?.[0] || null)}
                    className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                  />
                  <p className="mt-1 text-xs text-gray-500">PNG/JPG up to ~5MB.</p>
                  <ErrorText>{errors.photo}</ErrorText>
                </div>
              </div>
            </SectionCard>

            {/* Sticky actions */}
            <div className="md:sticky md:top-6">
              <div className="rounded-xl border border-gray-200 bg-indigo-50 p-4">
                <p className="text-sm font-medium text-indigo-900">Actions</p>
                <p className="mt-1 text-xs text-indigo-800/80">
                  Save your changes when you’re done editing.
                </p>
                <button
                  type="submit"
                  form="patient-edit-form"
                  disabled={processing}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {processing ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </aside>

          {/* Main form */}
          <form
            id="patient-edit-form"
            onSubmit={handleSubmit}
            className="md:col-span-2 space-y-6"
            encType="multipart/form-data"
          >
            <SectionCard icon={IdCard} title="Identification">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="national_id" required>National ID</Label>
                  <Input
                    id="national_id"
                    value={data.national_id}
                    onChange={(e) => setData('national_id', e.target.value)}
                    pattern={NIC_PATTERN}
                    title="Sri Lanka NIC: 12 digits OR 9 digits followed by V/X"
                    placeholder="200012345678 or 123456789V"
                    required
                  />
                  <ErrorText>{errors.national_id}</ErrorText>
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Select
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option>Mr</option>
                    <option>Mrs</option>
                    <option>Ms</option>
                    <option>Dr</option>
                    <option>Prof</option>
                  </Select>
                  <ErrorText>{errors.title}</ErrorText>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="name" required>Full Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                  />
                  <ErrorText>{errors.name}</ErrorText>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="other_names">Other Name / Initials</Label>
                  <Input
                    id="other_names"
                    value={data.other_names}
                    onChange={(e) => setData('other_names', e.target.value)}
                  />
                  <ErrorText>{errors.other_names}</ErrorText>
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={User2} title="Demographics">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="gender" required>Gender</Label>
                  <Select
                    id="gender"
                    value={data.gender}
                    onChange={(e) => setData('gender', e.target.value)}
                    required
                  >
                    <option value="">Select</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="Other">Other</option>
                  </Select>
                  <ErrorText>{errors.gender}</ErrorText>
                </div>

                <div>
                  <Label htmlFor="ethnicity">Ethnicity</Label>
                  <Select
                    id="ethnicity"
                    value={data.ethnicity}
                    onChange={(e) => setData('ethnicity', e.target.value)}
                  >
                    <option value="">Select</option>
                    {(lists.ethnicities || ['Sinhalese','Tamil','Moor','Indian Tamil','Other']).map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </Select>
                  <ErrorText>{errors.ethnicity}</ErrorText>
                </div>

                <div>
                  <Label htmlFor="blood_group">Blood Group</Label>
                  <Select
                    id="blood_group"
                    value={data.blood_group}
                    onChange={(e) => setData('blood_group', e.target.value)}
                  >
                    <option value="">Select</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </Select>
                  <ErrorText>{errors.blood_group}</ErrorText>
                </div>

                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={data.dob || ''}
                    onChange={(e) => setData('dob', e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500">Age auto-calculates from DOB.</p>
                  <ErrorText>{errors.dob}</ErrorText>
                </div>

                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="130"
                    value={data.age}
                    onChange={(e) => setData('age', e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500">Use if DOB is unknown.</p>
                  <ErrorText>{errors.age}</ErrorText>
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={MapPin} title="Contact & Address">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="phone">Contact Telephone</Label>
                  <Input
                    id="phone"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    placeholder="07XXXXXXXX"
                    pattern={PHONE_PATTERN}
                    title="Sri Lanka phone number starting with 0 and 10 digits total"
                  />
                  <ErrorText>{errors.phone}</ErrorText>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                  />
                  <ErrorText>{errors.email}</ErrorText>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address_line1">Address Line 1</Label>
                  <Input
                    id="address_line1"
                    value={data.address_line1}
                    onChange={(e) => setData('address_line1', e.target.value)}
                  />
                  <ErrorText>{errors.address_line1}</ErrorText>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address_line2">Address Line 2</Label>
                  <Input
                    id="address_line2"
                    value={data.address_line2}
                    onChange={(e) => setData('address_line2', e.target.value)}
                  />
                  <ErrorText>{errors.address_line2}</ErrorText>
                </div>
                <div>
                  <Label htmlFor="village">Village</Label>
                  <Input
                    id="village"
                    value={data.village}
                    onChange={(e) => setData('village', e.target.value)}
                  />
                  <ErrorText>{errors.village}</ErrorText>
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Select
                    id="district"
                    value={data.district}
                    onChange={(e) => setData('district', e.target.value)}
                  >
                    <option value="">Select</option>
                    {(lists.districts || []).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </Select>
                  <ErrorText>{errors.district}</ErrorText>
                </div>
                <div>
                  <Label htmlFor="province">Province</Label>
                  <Select
                    id="province"
                    value={data.province}
                    onChange={(e) => setData('province', e.target.value)}
                  >
                    <option value="">Select</option>
                    {(lists.provinces || []).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </Select>
                  <ErrorText>{errors.province}</ErrorText>
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={Contact} title="Guardian & Emergency">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="guardian_name">Guardian Name</Label>
                  <Input
                    id="guardian_name"
                    value={data.guardian_name}
                    onChange={(e) => setData('guardian_name', e.target.value)}
                  />
                  <ErrorText>{errors.guardian_name}</ErrorText>
                </div>
                <div>
                  <Label htmlFor="guardian_relationship">Guardian Relationship</Label>
                  <Input
                    id="guardian_relationship"
                    value={data.guardian_relationship}
                    onChange={(e) => setData('guardian_relationship', e.target.value)}
                    placeholder="e.g., Parent, Spouse"
                  />
                  <ErrorText>{errors.guardian_relationship}</ErrorText>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                  <Input
                    id="emergency_contact_name"
                    value={data.emergency_contact_name}
                    onChange={(e) => setData('emergency_contact_name', e.target.value)}
                  />
                  <ErrorText>{errors.emergency_contact_name}</ErrorText>
                </div>
                <div>
                  <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                  <Input
                    id="emergency_contact_phone"
                    value={data.emergency_contact_phone}
                    onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                    pattern={PHONE_PATTERN}
                    title="Sri Lanka phone number starting with 0 and 10 digits total"
                  />
                  <ErrorText>{errors.emergency_contact_phone}</ErrorText>
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={FileText} title="Social / Administrative">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="religion">Religion</Label>
                  <Select
                    id="religion"
                    value={data.religion}
                    onChange={(e) => setData('religion', e.target.value)}
                  >
                    <option value="">Select</option>
                    {(lists.religions || ['Buddhism','Hinduism','Islam','Christianity','Other']).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </Select>
                  <ErrorText>{errors.religion}</ErrorText>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={data.occupation}
                    onChange={(e) => setData('occupation', e.target.value)}
                  />
                  <ErrorText>{errors.occupation}</ErrorText>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="health_scheme">Insurance / Health Scheme</Label>
                  <Input
                    id="health_scheme"
                    value={data.health_scheme}
                    onChange={(e) => setData('health_scheme', e.target.value)}
                    placeholder="e.g., Samurdhi, Private"
                  />
                  <ErrorText>{errors.health_scheme}</ErrorText>
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={HeartPulse} title="Clinical">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="chronic_conditions">Chronic Conditions</Label>
                  <Textarea
                    id="chronic_conditions"
                    value={data.chronic_conditions}
                    onChange={(e) => setData('chronic_conditions', e.target.value)}
                    placeholder="e.g., Diabetes, Hypertension"
                  />
                  <ErrorText>{errors.chronic_conditions}</ErrorText>
                </div>
                <div>
                  <Label htmlFor="disability_status">Disability Status</Label>
                  <Textarea
                    id="disability_status"
                    value={data.disability_status}
                    onChange={(e) => setData('disability_status', e.target.value)}
                  />
                  <ErrorText>{errors.disability_status}</ErrorText>
                </div>

                {/* Allergies (multi-select) */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert size={16} className="text-red-600" />
                    <Label>Allergies (select all that apply)</Label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(lists.allergyTypes || ['food','animal','medicine']).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => toggleAllergyType(t)}
                        className={
                          'inline-flex items-center rounded-full border px-3 py-1 text-sm ' +
                          (isChecked(t)
                            ? 'border-red-300 bg-red-50 text-red-700'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50')
                        }
                      >
                        {toTitle(t)}
                      </button>
                    ))}
                  </div>
                  {/* Root and nested errors */}
                  <ErrorText>{errors.allergies}</ErrorText>
                  <ErrorText>{errors['allergies.types'] || errors['allergies.types.*']}</ErrorText>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="allergy_note">Allergies Note</Label>
                  <Textarea
                    id="allergy_note"
                    rows={3}
                    value={data.allergies?.note || ''}
                    onChange={(e) => setData('allergies', { ...data.allergies, note: e.target.value })}
                    placeholder="e.g., Penicillin rash, severe seafood allergy, etc."
                  />
                  <ErrorText>{errors['allergies.note']}</ErrorText>
                </div>
              </div>
            </SectionCard>

            <SectionCard icon={Phone} title="Notes">
              <Textarea
                id="remarks"
                value={data.remarks}
                onChange={(e) => setData('remarks', e.target.value)}
                placeholder="Any remarks or special instructions"
                rows={4}
              />
              <ErrorText>{errors.remarks}</ErrorText>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {processing ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </SectionCard>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
