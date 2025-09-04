import React, { useMemo, useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';
import NumberField from './Components/NumberField';
import SliderField from './Components/SliderField';

export default function Dapsa() {
  const { patient } = usePage().props;
  const [tjc68, setTjc68] = useState(0);
  const [sjc66, setSjc66] = useState(0);
  const [pain, setPain] = useState(0); // 0–10
  const [ptg, setPtg] = useState(0);   // 0–10
  const [crp, setCrp] = useState(0);   // mg/dL (some use mg/L; be consistent)

  const score = useMemo(()=> Number(tjc68||0)+Number(sjc66||0)+Number(pain||0)+Number(ptg||0)+Number(crp||0),
    [tjc68,sjc66,pain,ptg,crp]);

  const { post, processing } = useForm();
  const save = () => {
    post(route('doctor.patients.calculators.dapsa.store', patient.id), {
      data: { tjc68, sjc66, pain, ptg, crp, score: Number(score.toFixed(1)) },
      onSuccess: () => router.visit(route('doctor.patients.overview', patient.id)),
    });
  };

  return (
    <AppShell>
      <Head title={`DAPSA • ${patient.name}`} />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">DAPSA · {patient.name}</h1>
          <Link className="text-blue-600 hover:underline" href={route('doctor.patients.calculators.index', patient.id)}>Back</Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-4 bg-white shadow-sm space-y-3">
            <NumberField label="Tender joints (0–68)" value={tjc68} onChange={setTjc68} min={0} />
            <NumberField label="Swollen joints (0–66)" value={sjc66} onChange={setSjc66} min={0} />
            <SliderField label="Pain (0–10)" value={pain} onChange={setPain} max={10} />
            <SliderField label="Patient global (0–10)" value={ptg} onChange={setPtg} max={10} />
            <NumberField label="CRP (mg/dL)" value={crp} onChange={setCrp} min={0} step={0.1} />
          </div>

          <div className="rounded-2xl border p-4 bg-white shadow-sm">
            <div className="text-sm text-slate-600">DAPSA</div>
            <div className="text-4xl font-bold">{score.toFixed(1)}</div>
            <button onClick={save} disabled={processing} className="mt-4 w-full rounded-xl bg-emerald-600 text-white py-2.5 hover:bg-emerald-700">Save to Patient</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
