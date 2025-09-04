import React, { useMemo, useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';
import NumberField from './Components/NumberField';

export default function Haqdi() {
  const { patient } = usePage().props;
  // simple 8-item version, each 0–3
  const [items, setItems] = useState(Array(8).fill(0));
  const setItem = (i, v) => setItems(arr => arr.map((x, j) => j === i ? Number(v||0) : x));

  const score = useMemo(() => items.reduce((a,b)=>a+Number(b||0),0)/items.length, [items]);

  const { post, processing } = useForm();
  const save = () => {
    post(route('doctor.patients.calculators.haqdi.store', patient.id), {
      data: { items, score: Number(score.toFixed(2)) },
      onSuccess: () => router.visit(route('doctor.patients.overview', patient.id)),
    });
  };

  return (
    <AppShell>
      <Head title={`HAQ-DI • ${patient.name}`} />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">HAQ-DI · {patient.name}</h1>
          <Link className="text-blue-600 hover:underline" href={route('doctor.patients.calculators.index', patient.id)}>Back</Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-4 bg-white shadow-sm space-y-3">
            {items.map((v,i)=>(
              <NumberField
                key={i}
                label={`Item ${i+1} (0–3)`}
                value={v}
                onChange={(val)=>setItem(i,val)}
                min={0}
                step={0.5}
              />
            ))}
          </div>

          <div className="rounded-2xl border p-4 bg-white shadow-sm">
            <div className="text-sm text-slate-600">HAQ-DI</div>
            <div className="text-4xl font-bold">{score.toFixed(2)}</div>
            <button onClick={save} disabled={processing} className="mt-4 w-full rounded-xl bg-emerald-600 text-white py-2.5 hover:bg-emerald-700">Save to Patient</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
