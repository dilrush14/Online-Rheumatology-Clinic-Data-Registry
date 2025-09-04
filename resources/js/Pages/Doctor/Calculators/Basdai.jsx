import React, { useMemo, useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';
import SliderField from './Components/SliderField';

export default function Basdai() {
  const { patient } = usePage().props;
  const [q1,q2,q3,q4,q5,q6] = useStateArray(6,0); // helper below

  const score = useMemo(() => {
    const avg12 = (q1+q2+q3+q4)/4;
    const avg56 = (q5+q6)/2;
    return (avg12 + avg56) / 2;
  }, [q1,q2,q3,q4,q5,q6]);

  const { post, processing } = useForm();
  const save = () => {
    post(route('doctor.patients.calculators.basdai.store', patient.id), {
      data: { q1,q2,q3,q4,q5,q6, score: Number(score.toFixed(2)) },
      onSuccess: () => router.visit(route('doctor.patients.overview', patient.id)),
    });
  };

  return (
    <AppShell>
      <Head title={`BASDAI • ${patient.name}`} />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">BASDAI · {patient.name}</h1>
          <Link className="text-blue-600 hover:underline" href={route('doctor.patients.calculators.index', patient.id)}>Back</Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-4 bg-white shadow-sm space-y-3">
            <SliderField label="Fatigue (0–10)" value={q1} onChange={(v)=>setAt(0,v)} max={10} />
            <SliderField label="Spinal pain (0–10)" value={q2} onChange={(v)=>setAt(1,v)} max={10} />
            <SliderField label="Peripheral joint pain/swelling (0–10)" value={q3} onChange={(v)=>setAt(2,v)} max={10} />
            <SliderField label="Enthesitis tenderness (0–10)" value={q4} onChange={(v)=>setAt(3,v)} max={10} />
            <SliderField label="Morning stiffness SEVERITY (0–10)" value={q5} onChange={(v)=>setAt(4,v)} max={10} />
            <SliderField label="Morning stiffness DURATION (0–10)" value={q6} onChange={(v)=>setAt(5,v)} max={10} />
          </div>

          <div className="rounded-2xl border p-4 bg-white shadow-sm">
            <div className="text-sm text-slate-600">BASDAI</div>
            <div className="text-4xl font-bold">{score.toFixed(2)}</div>
            <button onClick={save} disabled={processing} className="mt-4 w-full rounded-xl bg-emerald-600 text-white py-2.5 hover:bg-emerald-700">Save to Patient</button>
          </div>
        </div>
      </div>
    </AppShell>
  );

  // local array state helpers
  function useStateArray(n, init) {
    const [arr, setArr] = useState(Array(n).fill(init));
    const setters = arr.map((_,i)=> (v)=>setArr(x => x.map((y,j)=> j===i? v : y)));
    return [ ...arr, ...setters ];
  }
  function setAt(i,v){ /* placeholder for linter */ }
}
