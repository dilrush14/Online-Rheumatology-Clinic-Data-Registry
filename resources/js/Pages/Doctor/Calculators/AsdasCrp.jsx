import React, { useMemo, useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';
import SliderField from './Components/SliderField';
import NumberField from './Components/NumberField';

function ln(x){ return Math.log(Math.max(1e-9, x || 0)); }

export default function AsdasCrp() {
  const { patient } = usePage().props;
  // Inputs 0–10
  const [backPain, setBackPain] = useState(0);
  const [durationMS, setDurationMS] = useState(0);
  const [periph, setPeriph] = useState(0);
  const [ptGlobal, setPtGlobal] = useState(0);
  const [crp, setCrp] = useState(0); // mg/L

  // ASDAS-CRP formula (validation-use constant weights)
  const score = useMemo(() =>
    0.121*backPain + 0.058*durationMS + 0.110*periph + 0.073*ptGlobal + 0.579*ln((crp??0)+1),
    [backPain,durationMS,periph,ptGlobal,crp]
  );

  const { post, processing } = useForm();
  const save = () => {
    post(route('doctor.patients.calculators.asdas_crp.store', patient.id), {
      data: { backPain, durationMS, periph, ptGlobal, crp, score: Number(score.toFixed(2)) },
      onSuccess: () => router.visit(route('doctor.patients.overview', patient.id)),
    });
  };

  return (
    <AppShell>
      <Head title={`ASDAS-CRP • ${patient.name}`} />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">ASDAS-CRP · {patient.name}</h1>
          <Link className="text-blue-600 hover:underline" href={route('doctor.patients.calculators.index', patient.id)}>Back</Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-4 bg-white shadow-sm space-y-3">
            <SliderField label="Back pain (0–10)" value={backPain} onChange={setBackPain} max={10} />
            <SliderField label="Duration of morning stiffness (0–10)" value={durationMS} onChange={setDurationMS} max={10} />
            <SliderField label="Peripheral pain/swelling (0–10)" value={periph} onChange={setPeriph} max={10} />
            <SliderField label="Patient global (0–10)" value={ptGlobal} onChange={setPtGlobal} max={10} />
            <NumberField label="CRP (mg/L)" value={crp} onChange={setCrp} min={0} step={0.1} />
          </div>

          <div className="rounded-2xl border p-4 bg-white shadow-sm">
            <div className="text-sm text-slate-600">ASDAS-CRP</div>
            <div className="text-4xl font-bold">{score.toFixed(2)}</div>
            <ul className="mt-4 text-sm space-y-1">
              <li>Inactive &lt; 1.3</li>
              <li>Low 1.3–&lt;2.1</li>
              <li>High 2.1–&lt;3.5</li>
              <li>Very high ≥ 3.5</li>
            </ul>
            <button onClick={save} disabled={processing} className="mt-4 w-full rounded-xl bg-emerald-600 text-white py-2.5 hover:bg-emerald-700">Save to Patient</button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
