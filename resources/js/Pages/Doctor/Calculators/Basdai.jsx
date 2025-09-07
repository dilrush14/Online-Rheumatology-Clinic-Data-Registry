// resources/js/Pages/Doctor/Calculators/Basdai.jsx
import React, { useMemo, useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppShell from "@/components/app-shell";

/** BASDAI = ((Q1+Q2+Q3+Q4)/4 + (Q5+Q6)/2) / 2   (all 0–10) */

export default function Basdai() {
  const { patient, flash } = usePage().props;

  // Six BASDAI questions (0–10)
  const [q1, setQ1] = useState(0); // fatigue
  const [q2, setQ2] = useState(0); // spinal pain
  const [q3, setQ3] = useState(0); // peripheral joints pain/swelling
  const [q4, setQ4] = useState(0); // enthesitis tenderness
  const [q5, setQ5] = useState(0); // morning stiffness severity
  const [q6, setQ6] = useState(0); // morning stiffness duration

  const score = useMemo(() => {
    const avg12 = (Number(q1)||0 + Number(q2)||0 + Number(q3)||0 + Number(q4)||0) / 4;
    const avg56 = (Number(q5)||0 + Number(q6)||0) / 2;
    return (avg12 + avg56) / 2;
  }, [q1, q2, q3, q4, q5, q6]);

  const save = () => {
    const payload = {
      q1: Number(q1),
      q2: Number(q2),
      q3: Number(q3),
      q4: Number(q4),
      q5: Number(q5),
      q6: Number(q6),
      score: Number(score.toFixed(2)),
    };

    router.post(route("doctor.patients.calculators.basdai.store", patient.id), payload, {
      preserveScroll: true,
      onSuccess: () => router.visit(route("doctor.patients.overview", patient.id)),
    });
  };

  return (
    <AppShell>
      <Head title={`BASDAI • ${patient?.name ?? ""}`} />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">BASDAI · {patient?.name}</h1>
          <Link
            className="text-blue-600 hover:underline"
            href={route("doctor.patients.calculators.index", patient.id)}
          >
            Back to Calculators
          </Link>
        </div>

        {flash?.success && (
          <div className="rounded-xl bg-green-50 text-green-800 px-4 py-3 border border-green-200">
            {flash.success}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Sliders */}
          <div className="md:col-span-2 rounded-2xl border p-4 bg-white shadow-sm space-y-5">
            <Slider label="😴 Fatigue (0–10)" value={q1} onChange={setQ1} />
            <Slider label="🦴 Spinal pain (0–10)" value={q2} onChange={setQ2} />
            <Slider label="🦵 Peripheral joint pain/swelling (0–10)" value={q3} onChange={setQ3} />
            <Slider label="📍 Enthesitis tenderness (0–10)" value={q4} onChange={setQ4} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Slider label="🌅 Morning stiffness – severity (0–10)" value={q5} onChange={setQ5} />
              <Slider label="⏱️ Morning stiffness – duration (0–10)" value={q6} onChange={setQ6} />
            </div>
          </div>

          {/* Formula + Result */}
          <div className="space-y-6">
            {/* Formula */}
            <div className="rounded-2xl border p-0 bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border-b">
                <div className="text-xs tracking-wide text-slate-600">Formula</div>
                <div className="text-sm font-medium text-slate-800">
                  <span className="font-semibold">BASDAI</span> ={" "}
                  <span className="whitespace-nowrap">(Q1+Q2+Q3+Q4)/4</span>{" "}
                  + <span className="whitespace-nowrap">(Q5+Q6)/2</span> all ÷ 2
                </div>
              </div>
              <div className="p-4 text-xs text-slate-600 space-y-2">
                <p>
                  Each question is scored 0–10 (higher = worse). Q5 & Q6 are morning stiffness severity and duration.
                </p>
              </div>
            </div>

            {/* Result */}
            <div className="rounded-2xl border p-4 bg-white shadow-sm ring-2 ring-slate-200">
              <div className="mb-2 font-semibold">Result</div>
              <div className="text-4xl font-bold">{score.toFixed(2)}</div>
              <button
                onClick={save}
                className="mt-4 w-full rounded-xl bg-emerald-600 text-white py-2.5 hover:bg-emerald-700"
              >
                Save BASDAI to Patient
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

/* ---------- Small local slider component (0–10) ---------- */
function Slider({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-slate-700 mb-1">{label}</label>
      <input
        type="range"
        min="0"
        max="10"
        step="0.1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
      />
      <div className="mt-1 text-sm">
        <span className="font-medium">{Number(value).toFixed(1)}</span> / 10
      </div>
    </div>
  );
}
