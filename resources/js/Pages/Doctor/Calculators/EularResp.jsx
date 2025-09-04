import React, { useMemo, useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';
import NumberField from './Components/NumberField';

export default function EularResp() {
  const { patient } = usePage().props;
  const [baseline, setBaseline] = useState('');
  const [current, setCurrent] = useState('');
  const delta = useMemo(()=> (baseline!=='' && current!=='') ? (Number(baseline)-Number(current)) : null, [baseline,current]);

  // EULAR categorization (using DAS28)
  const response = useMemo(()=>{
    const cur = Number(current), d = Number(delta);
    if (isNaN(cur) || isNaN(d)) return '-';
    if (d > 1.2 && cur <= 5.1) return 'Good';
    if ((d > 0.6 && d <= 1.2) || (d > 1.2 && cur > 5.1)) return 'Moderate';
    return 'None';
  }, [current, delta]);

  const { post, processing } = useForm();
  const save = () => {
    post(route('doctor.patients.calculators.eular_resp.store', patient.id), {
      data: { baseline: Number(baseline||0), current: Number(current||0), delta: Number(delta||0), response },
      onSuccess: () => router.visit(route('doctor.patients.overview', patient.id)),
    });
  };

  return (
    <AppShell>
      <Head title={`EULAR Response • ${patient.name}`} />
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">EULAR Response · {patient.name}</h1>
          <Link className="text-blue-600 hover:underline" href={route('doctor.patients.calculators.index', patient.id)}>Back</Link>
        </div>

        <div className="rounded-2xl border p-4 bg-white shadow-sm space-y-3">
          <NumberField label="Baseline DAS28" value={baseline} onChange={setBaseline} min={0} step={0.01} />
          <NumberField label="Current DAS28" value={current} onChange={setCurrent} min={0} step={0.01} />
          <div className="mt-2">
            <div className="text-sm text-slate-600">ΔDAS28 (baseline − current)</div>
            <div className="text-4xl font-bold">{delta!=null ? delta.toFixed(2) : '-'}</div>
            <div className="mt-1">Response: <span className="font-semibold">{response}</span></div>
          </div>
          <button onClick={save} disabled={processing || delta==null} className="mt-4 w-full rounded-xl bg-emerald-600 text-white py-2.5 hover:bg-emerald-700">Save to Patient</button>
        </div>
      </div>
    </AppShell>
  );
}
