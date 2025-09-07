// resources/js/Pages/Doctor/Calculators/AsdasCrp.jsx
import React, { useMemo, useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppShell from "@/components/app-shell";

function ln(x) {
  return Math.log(Math.max(1e-9, x || 0));
}

function asdasCategory(score) {
  if (score == null) return "-";
  if (score < 1.3) return "Inactive";
  if (score < 2.1) return "Low";
  if (score < 3.5) return "High";
  return "Very high";
}

const categoryMeta = (label) => {
  switch (label) {
    case "Inactive":
      return { badge: "bg-emerald-100 text-emerald-800 border-emerald-200", panel: "ring-emerald-200" };
    case "Low":
      return { badge: "bg-sky-100 text-sky-800 border-sky-200", panel: "ring-sky-200" };
    case "High":
      return { badge: "bg-amber-100 text-amber-900 border-amber-200", panel: "ring-amber-200" };
    case "Very high":
      return { badge: "bg-rose-100 text-rose-800 border-rose-200", panel: "ring-rose-200" };
    default:
      return { badge: "bg-slate-100 text-slate-800 border-slate-200", panel: "ring-slate-200" };
  }
};

export default function AsdasCrp() {
  const { patient, flash } = usePage().props;

  // Inputs (0–10 VAS; CRP mg/L)
  const [backPain, setBackPain] = useState(0);
  const [durationMS, setDurationMS] = useState(0);
  const [periph, setPeriph] = useState(0);
  const [ptGlobal, setPtGlobal] = useState(0);
  const [crp, setCrp] = useState(0); // mg/L

  // ASDAS-CRP = 0.121*BackPain + 0.058*MorningStiffness + 0.110*Peripheral + 0.073*PatientGlobal + 0.579*ln(CRP+1)
  const score = useMemo(
    () =>
      0.121 * Number(backPain || 0) +
      0.058 * Number(durationMS || 0) +
      0.110 * Number(periph || 0) +
      0.073 * Number(ptGlobal || 0) +
      0.579 * ln(Number(crp || 0) + 1),
    [backPain, durationMS, periph, ptGlobal, crp]
  );

  const category = asdasCategory(score);
  const meta = categoryMeta(category);

  const save = () => {
    const payload = {
      back_pain: Number(backPain),
      morning_stiffness_duration: Number(durationMS),
      peripheral_pain_swelling: Number(periph),
      pt_global: Number(ptGlobal),
      crp: Number(crp),
      score: Number(score.toFixed(2)),
    };

    // Expecting controller to return 303; we still navigate onSuccess for safety
    router.post(route("doctor.patients.calculators.asdas_crp.store", patient.id), payload, {
      preserveScroll: true,
      onSuccess: () => router.visit(route("doctor.patients.overview", patient.id)),
    });
  };

  return (
    <AppShell>
      <Head title={`ASDAS-CRP • ${patient?.name ?? ""}`} />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">ASDAS-CRP · {patient?.name}</h1>
          <Link className="text-blue-600 hover:underline" href={route("doctor.patients.calculators.index", patient.id)}>
            Back to Calculators
          </Link>
        </div>

        {flash?.success && (
          <div className="rounded-xl bg-green-50 text-green-800 px-4 py-3 border border-green-200">{flash.success}</div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="md:col-span-2 rounded-2xl border p-4 bg-white shadow-sm space-y-4">
            <Slider
              label="🛏️ Back pain (0–10)"
              value={backPain}
              onChange={setBackPain}
              min={0}
              max={10}
              help="Average spinal pain over the last week."
            />
            <Slider
              label="⏱️ Morning stiffness – duration (0–10)"
              value={durationMS}
              onChange={setDurationMS}
              min={0}
              max={10}
              help="How long the morning stiffness lasts."
            />
            <Slider
              label="🦵 Peripheral pain/swelling (0–10)"
              value={periph}
              onChange={setPeriph}
              min={0}
              max={10}
              help="Joints outside the spine."
            />
            <Slider
              label="🙂 Patient global (0–10)"
              value={ptGlobal}
              onChange={setPtGlobal}
              min={0}
              max={10}
              help="Overall patient assessment."
            />

            <div>
              <label className="block text-sm text-slate-700 mb-1">🧪 CRP (mg/L)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={crp}
                onChange={(e) => setCrp(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="e.g. 8.0"
              />
              <div className="text-xs text-slate-500 mt-1">
                Used in formula as ln(CRP + 1). Units: mg/L.
              </div>
            </div>
          </div>

          {/* Formula + Result */}
          <div className="space-y-6">
            {/* Formula (beautified) */}
            <div className="rounded-2xl border p-0 bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border-b">
                <div className="text-xs tracking-wide text-slate-600">Formula</div>
                <div className="text-sm font-medium text-slate-800">
                  <span className="font-semibold">ASDAS-CRP</span> = 0.121·BackPain + 0.058·MorningStiffnessDur + 0.110·Peripheral + 0.073·PtGlobal + 0.579·ln(CRP+1)
                </div>
              </div>
              <ul className="p-4 text-sm space-y-2">
                <li className="flex items-center justify-between rounded-lg border px-3 py-1.5 border-emerald-200 bg-emerald-50 text-emerald-800">
                  <span>Inactive</span>
                  <span className="font-medium">&lt; 1.3</span>
                </li>
                <li className="flex items-center justify-between rounded-lg border px-3 py-1.5 border-sky-200 bg-sky-50 text-sky-800">
                  <span>Low</span>
                  <span className="font-medium">1.3–&lt;2.1</span>
                </li>
                <li className="flex items-center justify-between rounded-lg border px-3 py-1.5 border-amber-200 bg-amber-50 text-amber-900">
                  <span>High</span>
                  <span className="font-medium">2.1–&lt;3.5</span>
                </li>
                <li className="flex items-center justify-between rounded-lg border px-3 py-1.5 border-rose-200 bg-rose-50 text-rose-800">
                  <span>Very high</span>
                  <span className="font-medium">≥ 3.5</span>
                </li>
              </ul>
            </div>

            {/* Result */}
            <div className={`rounded-2xl border p-4 bg-white shadow-sm ring-2 ${meta.panel}`}>
              <div className="mb-2 font-semibold">Result</div>
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold">{score.toFixed(2)}</div>
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-medium ${meta.badge}`}>
                  {category}
                </span>
              </div>
              <button
                onClick={save}
                className="mt-4 w-full rounded-xl bg-emerald-600 text-white py-2.5 hover:bg-emerald-700"
              >
                Save ASDAS-CRP to Patient
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* Small local slider */
function Slider({ label, value, onChange, min = 0, max = 10, step = 0.1, help }) {
  return (
    <div>
      <label className="block text-sm text-slate-700 mb-1">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
      />
      <div className="mt-1 text-sm">
        <span className="font-medium">{Number(value).toFixed(1)}</span> / {max}
      </div>
      {help && <div className="text-xs text-slate-500 mt-1">{help}</div>}
    </div>
  );
}
