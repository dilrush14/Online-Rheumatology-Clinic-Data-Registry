// D:\rheumatology\project-rheuma\resources\js\Pages\Doctor\Patient\Show.jsx
import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';
import { AlertTriangle, Calendar, Droplet, Home, IdCard, User2 } from 'lucide-react';

const Card = ({ title, icon: Icon, children }) => (
  <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
    <div className="flex items-center gap-2 border-b bg-gray-50/60 px-5 py-3">
      {Icon ? <Icon size={18} className="text-indigo-600" /> : null}
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
    </div>
    <div className="p-5">{children}</div>
  </section>
);

const GridRows = ({ rows }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
    {rows.map(([label, val], i) => (
      <div key={label + i} className="text-sm">
        <span className="font-medium text-gray-700">{label}: </span>
        <span className="text-gray-900">{val ?? '—'}</span>
      </div>
    ))}
  </div>
);

export default function Show() {
  const { patient } = usePage().props;

  // ---- parse allergies coming from backend (string or object) ----
  let allergyObj = { types: [], note: '' };
  try {
    if (patient?.allergies) {
      if (typeof patient.allergies === 'string') {
        const parsed = JSON.parse(patient.allergies);
        if (parsed && typeof parsed === 'object') {
          allergyObj = { types: parsed.types || [], note: parsed.note || '' };
        }
      } else if (typeof patient.allergies === 'object') {
        allergyObj = { types: patient.allergies.types || [], note: patient.allergies.note || '' };
      }
    }
  } catch {
    // fall back to default
  }

  const toTitle = (s) =>
    typeof s === 'string' && s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const allergyTypes = Array.isArray(allergyObj.types) ? allergyObj.types : [];
  const allergyNote = allergyObj.note || null;

  const allergyBadge = (t) => (
    <span
      key={t}
      className="inline-flex items-center rounded-full border border-red-300 bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700"
    >
      {toTitle(t)}
    </span>
  );

  const genderHuman =
    patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : patient.gender || '—';

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Patient Details
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {patient.name} • <span className="font-medium">{patient.national_id}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={route('doctor.patients.edit', patient.id)}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-white text-sm font-medium hover:bg-indigo-700"
            >
              Edit
            </Link>
            <Link
              href={route('doctor.patients.index')}
              className="inline-flex items-center rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Back to list
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Profile card */}
          <div className="md:col-span-1">
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
              <div className="w-40 h-40 rounded-xl overflow-hidden ring-1 ring-gray-200 bg-gray-50">
                {patient.photo_path ? (
                  <img
                    src={`/storage/${patient.photo_path}`}
                    alt={patient.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Photo
                  </div>
                )}
              </div>
              <div className="mt-4">
                <div className="text-lg font-semibold text-gray-900">{patient.name}</div>
                <div className="text-xs text-gray-600">{patient.national_id}</div>
                <div className="mt-2 inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                  {genderHuman} • {patient.age ?? '—'} yrs
                </div>
              </div>
            </section>

            {/* Allergies (prominent) */}
            <section className="mt-6 rounded-2xl border border-red-200 bg-red-50/70 p-5">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-600" />
                <h3 className="text-sm font-semibold text-red-800">Allergies</h3>
              </div>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex flex-wrap gap-1.5">
                  {allergyTypes.length ? (
                    allergyTypes.map(allergyBadge)
                  ) : (
                    <span className="text-red-800/70">None recorded</span>
                  )}
                </div>
                {allergyNote ? (
                  <p className="text-red-900/90 leading-relaxed">
                    <span className="font-medium">Note:</span> {allergyNote}
                  </p>
                ) : null}
              </div>
              <div className="mt-3">
                <Link
                  href={route('doctor.patients.edit', patient.id)}
                  className="text-xs text-red-800 underline underline-offset-4 hover:text-red-900"
                >
                  Update allergies
                </Link>
              </div>
            </section>
          </div>

          {/* Right: details */}
          <div className="md:col-span-2 space-y-6">
            <Card title="Identification" icon={IdCard}>
              <GridRows
                rows={[
                  ['Title', patient.title],
                  ['Other Names', patient.other_names],
                  ['Gender', genderHuman],
                  ['DOB', patient.dob],
                  ['Age', patient.age],
                  ['Blood Group', patient.blood_group],
                  ['Ethnicity', patient.ethnicity],
                  ['Civil Status', patient.civil_status],
                  ['Marital Status', patient.marital_status],
                ]}
              />
            </Card>

            <Card title="Contact & Address" icon={Home}>
              <GridRows
                rows={[
                  ['Phone', patient.phone],
                  ['Email', patient.email],
                  ['Address Line 1', patient.address_line1],
                  ['Address Line 2', patient.address_line2],
                  ['Village', patient.village],
                  ['District', patient.district],
                  ['Province', patient.province],
                ]}
              />
            </Card>

            <Card title="Guardian & Emergency" icon={User2}>
              <GridRows
                rows={[
                  ['Guardian', patient.guardian_name],
                  ['Relationship', patient.guardian_relationship],
                  ['Emergency Name', patient.emergency_contact_name],
                  ['Emergency Phone', patient.emergency_contact_phone],
                ]}
              />
            </Card>

            <Card title="Social / Administrative" icon={Calendar}>
              <GridRows
                rows={[
                  ['Religion', patient.religion],
                  ['Occupation', patient.occupation],
                  ['Health Scheme', patient.health_scheme],
                ]}
              />
            </Card>

            <Card title="Clinical" icon={Droplet}>
              <GridRows
                rows={[
                  ['Chronic Conditions', patient.chronic_conditions],
                  ['Disability Status', patient.disability_status],
                  [
                    'Allergies',
                    allergyTypes.length
                      ? allergyTypes.map((t) => toTitle(t)).join(', ') + (allergyNote ? ` — ${allergyNote}` : '')
                      : (typeof patient.allergies === 'string' ? patient.allergies : allergyNote || '—'),
                  ],
                ]}
              />
            </Card>

            <div className="text-xs text-gray-500">
              Created: {new Date(patient.created_at).toLocaleString()} &nbsp;|&nbsp; Updated:{' '}
              {new Date(patient.updated_at).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
