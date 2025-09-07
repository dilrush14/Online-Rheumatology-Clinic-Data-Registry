import React, { useMemo, useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';

// Lightweight number input
function NumberField({ label, value, onChange, min, step }) {
  return (
    <label className="block">
      <span className="block text-sm text-slate-600 mb-1">{label}</span>
      <input
        type="number"
        className="w-full rounded-lg border px-3 py-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        step={step}
      />
    </label>
  );
}

export default function Bmi() {
  const { patient } = usePage().props;
  const [weightKg, setWeightKg] = useState('');
  const [heightM, setHeightM] = useState(''); // meters

  const bmi = useMemo(() => {
    const w = Number(weightKg), h = Number(heightM);
    return w > 0 && h > 0 ? w / (h * h) : null;
  }, [weightKg, heightM]);

  const band = useMemo(() => {
    if (bmi == null) return '-';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }, [bmi]);

  const pctOnScale = useMemo(() => {
    // Map BMI 10–40 to 0–100% (clamped)
    if (bmi == null) return 0;
    const p = ((bmi - 10) / (40 - 10)) * 100;
    return Math.max(0, Math.min(100, p));
  }, [bmi]);

  const bandColor = useMemo(() => {
    if (bmi == null) return 'bg-slate-200 text-slate-700 border-slate-300';
    if (bmi < 18.5) return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    if (bmi < 25) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (bmi < 30) return 'bg-amber-100 text-amber-900 border-amber-200';
    return 'bg-rose-100 text-rose-800 border-rose-200';
  }, [bmi]);

  const save = () => {
    router.post(
      route('doctor.patients.calculators.bmi.store', patient.id),
      {
        // IMPORTANT: keys your controller validates
        weight_kg: Number(weightKg || 0),
        height_m: Number(heightM || 0),
        // bmi/band are computed on server as well; sending them is optional
      },
      {
        preserveScroll: true,
        onSuccess: () => router.visit(route('doctor.patients.overview', patient.id)),
      }
    );
  };

  return (
    <AppShell>
      <Head title={`BMI • ${patient.name}`} />
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">BMI · {patient.name}</h1>
          <Link
            className="text-blue-600 hover:underline"
            href={route('doctor.patients.calculators.index', patient.id)}
          >
            Back
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="rounded-2xl border p-4 bg-white shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="text-xl">⚙️</span>
              <div className="font-medium">Inputs</div>
            </div>
            <NumberField label="Weight (kg)" value={weightKg} onChange={setWeightKg} min={0} step={0.1} />
            <NumberField label="Height (m)" value={heightM} onChange={setHeightM} min={0} step={0.01} />
            <div className="text-xs text-slate-500">Tip: height is in meters (e.g., 1.72)</div>
          </div>

          {/* Result */}
          <div className="rounded-2xl border p-4 bg-white shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="text-xl">📊</span>
              <div className="font-medium">Result</div>
            </div>

            <div className="rounded-xl border bg-slate-50 p-3">
              <div className="text-sm text-slate-600">BMI</div>
              <div className="text-4xl font-bold">{bmi ? bmi.toFixed(1) : '—'}</div>
            </div>

            {/* Simple scale 10–40 */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span>10</span><span>20</span><span>30</span><span>40</span>
              </div>
              <div className="relative h-3 rounded-full bg-slate-200">
                <div
                  className="absolute -top-[6px] h-5 w-5 rounded-full border-2 border-white shadow"
                  style={{
                    left: `calc(${pctOnScale}% - 10px)`,
                    background:
                      bmi == null
                        ? '#cbd5e1'
                        : bmi < 18.5
                        ? '#06b6d4'
                        : bmi < 25
                        ? '#10b981'
                        : bmi < 30
                        ? '#f59e0b'
                        : '#ef4444',
                  }}
                  title={bmi ? bmi.toFixed(1) : ''}
                />
              </div>
            </div>

            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${bandColor}`}>
              <span className="text-sm">Category:</span>
              <span className="font-semibold">{band}</span>
              {bmi != null && bmi < 18.5 && <span>🧊</span>}
              {bmi != null && bmi >= 18.5 && bmi < 25 && <span>🌿</span>}
              {bmi != null && bmi >= 25 && bmi < 30 && <span>⚠️</span>}
              {bmi != null && bmi >= 30 && <span>🚩</span>}
            </div>

            <button
              onClick={save}
              disabled={!bmi}
              className="mt-2 w-full rounded-xl bg-emerald-600 text-white py-2.5 hover:bg-emerald-700 disabled:opacity-50"
            >
              Save to Patient
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
