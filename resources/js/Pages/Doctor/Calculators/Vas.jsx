import React, { useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';

export default function Vas() {
  const { patient } = usePage().props;
  const [label, setLabel] = useState('Global health');
  const [value, setValue] = useState(0); // 0–100

  const { post, processing } = useForm();
  const save = () => {
    post(route('doctor.patients.calculators.vas.store', patient.id), {
      data: { label, value },
      onSuccess: () => router.visit(route('doctor.patients.overview', patient.id)),
    });
  };

  return (
    <AppShell>
      <Head title={`VAS • ${patient.name}`} />
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">VAS · {patient.name}</h1>
          <Link className="text-blue-600 hover:underline" href={route('doctor.patients.calculators.index', patient.id)}>Back</Link>
        </div>

        <div className="rounded-2xl border p-4 bg-white shadow-sm space-y-3">
          <label className="block text-sm text-slate-600 mb-1">Label</label>
          <input className="w-full rounded-lg border px-3 py-2"
                 value={label} onChange={(e)=>setLabel(e.target.value)} />
          <label className="block text-sm text-slate-600 mt-3 mb-1">Value (0–100)</label>
          <div className="flex items-center gap-3">
            <span>😀</span>
            <input type="range" min="0" max="100" value={value} onChange={(e)=>setValue(Number(e.target.value))} className="w-full accent-blue-600"/>
            <span>😣</span>
          </div>
          <div className="text-4xl font-bold mt-2">{value}</div>

          <button onClick={save} disabled={processing} className="mt-4 w-full rounded-xl bg-emerald-600 text-white py-2.5 hover:bg-emerald-700">Save to Patient</button>
        </div>
      </div>
    </AppShell>
  );
}
