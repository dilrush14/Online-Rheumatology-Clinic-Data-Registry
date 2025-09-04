import React, { useMemo, useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';
import NumberField from './Components/NumberField';

export default function Bmi() {
  const { patient } = usePage().props;
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState(''); // in meters

  const bmi = useMemo(() => {
    const w = Number(weight), h = Number(height);
    return (w>0 && h>0) ? (w/(h*h)) : null;
  }, [weight,height]);

  const band = useMemo(() => {
    if (bmi==null) return '-';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }, [bmi]);

  const { post, processing } = useForm();
  const save = () => {
    post(route('doctor.patients.calculators.bmi.store', patient.id), {
      data: { weight, height, bmi: bmi? Number(bmi.toFixed(1)) : null, band },
      onSuccess: () => router.visit(route('doctor.patients.overview', patient.id)),
    });
  };

  return (
    <AppShell>
      <Head title={`BMI • ${patient.name}`} />
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">BMI · {patient.name}</h1>
          <Link className="text-blue-600 hover:underline" href={route('doctor.patients.calculators.index', patient.id)}>Back</Link>
        </div>

        <div className="rounded-2xl border p-4 bg-white shadow-sm space-y-3">
          <NumberField label="Weight (kg)" value={weight} onChange={setWeight} min={0} step={0.1} />
          <NumberField label="Height (m)" value={height} onChange={setHeight} min={0} step={0.01} />
          <div className="mt-2">
            <div className="text-sm text-slate-600">BMI</div>
            <div className="text-4xl font-bold">{bmi ? bmi.toFixed(1) : '-'}</div>
            <div className="mt-1">{band}</div>
          </div>
          <button onClick={save} disabled={processing || !bmi} className="mt-4 w-full rounded-xl bg-emerald-600 text-white py-2.5 hover:bg-emerald-700">Save to Patient</button>
        </div>
      </div>
    </AppShell>
  );
}
