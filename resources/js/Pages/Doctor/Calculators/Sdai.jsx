import React, { useMemo, useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';
import NumberField from './Components/NumberField';
import SliderField from './Components/SliderField';

export default function Sdai() {
  const { patient } = usePage().props;
  const [tjc28, setTjc28] = useState(0);
  const [sjc28, setSjc28] = useState(0);
  const [ptg, setPtg] = useState(0);
  const [phg, setPhg] = useState(0);
  const [crp, setCrp] = useState(0); // mg/dL

  const score = useMemo(() => Number(tjc28||0)+Number(sjc28||0)+Number(ptg||0)+Number(phg||0)+Number(crp||0), [tjc28,sjc28,ptg,phg,crp]);

  const { post, processing } = useForm();
  const save = () => {
    post(route('doctor.patients.calculators.sdai.store', patient.id), {
      data: { tjc28, sjc28, ptg, phg, crp, score },
      onSuccess: () => router.visit(route('doctor.patients.overview', patient.id)),
    });
  };

  return (
    <AppShell>
      <Head title={`SDAI • ${patient.name}`} />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">SDAI · {patient.name}</h1>
          <Link className="text-blue-600 hover:underline" href={route('doctor.patients.calculators.index', patient.id)}>Back</Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-4 bg-white shadow-sm space-y-3">
            <NumberField label="Tender Joint Count (0–28)" value={tjc28} onChange={setTjc28} min={0} />
            <NumberField label="Swollen Joint Count (0–28)" value={sjc28} onChange={setSjc28} min={0} />
            <SliderField label="Patient Global (0–10)" value={ptg} onChange={setPtg} max={10} />
            <SliderField label="Physician Global (0–10)" value={phg} onChange={setPhg} max={10} />
            <NumberField label="CRP (mg/dL)" value={crp} onChange={setCrp} min={0} step={0.1} />
          </div>

          <div className="rounded-2xl border p-4 bg-white shadow-sm">
            <div className="text-sm text-slate-600">SDAI Score</div>
            <div className="text-4xl font-bold">{score.toFixed(1)}</div>
            <ul className="mt-4 text-sm space-y-1">
              <li>Remission ≤ 3.3</li>
              <li>Low ≤ 11</li>
              <li>Moderate ≤ 26</li>
              <li>High &gt; 26</li>
            </ul>
            <button onClick={save} disabled={processing} className="mt-4 w-full rounded-xl bg-emerald-600 text-white py-2.5 hover:bg-emerald-700">Save to Patient</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
