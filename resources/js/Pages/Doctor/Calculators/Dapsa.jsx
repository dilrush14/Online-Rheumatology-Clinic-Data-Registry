// resources/js/Pages/Doctor/Calculators/Dapsa.jsx
import React, { useMemo, useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppShell from "@/components/app-shell";
import JointFigure from "./Components/JointFigure";

export default function Dapsa() {
  const { patient, flash } = usePage().props;

  // Joint selections from figure (arrays of joint ids)
  const [tenderJoints, setTenderJoints] = useState([]);
  const [swollenJoints, setSwollenJoints] = useState([]);

  const toggleTender = (id) =>
    setTenderJoints((arr) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]));
  const toggleSwollen = (id) =>
    setSwollenJoints((arr) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]));

  // Other inputs
  const [pain, setPain] = useState(0);       // 0–10 (Pain VAS)
  const [ptGlobal, setPtGlobal] = useState(0); // 0–10 (Patient global)
  const [crp, setCrp] = useState(0);         // mg/dL

  // Counts from figures
  const tjc68 = tenderJoints.length;
  const sjc66 = swollenJoints.length;

  // DAPSA = TJC68 + SJC66 + pain VAS + patient global + CRP
  const score = useMemo(
    () =>
      Number(tjc68 || 0) +
      Number(sjc66 || 0) +
      Number(pain || 0) +
      Number(ptGlobal || 0) +
      Number(crp || 0),
    [tjc68, sjc66, pain, ptGlobal, crp]
  );

  const save = () => {
    const payload = {
      tjc68,
      sjc66,
      tender_joints: tenderJoints,   // optional if you add columns later
      swollen_joints: swollenJoints, // optional if you add columns later
      pain: Number(pain),
      pt_global: Number(ptGlobal),
      crp: Number(crp),
      score: Number(score.toFixed(1)),
    };

    router.post(route("doctor.patients.calculators.dapsa.store", patient.id), payload, {
      preserveScroll: true,
      onSuccess: () => router.visit(route("doctor.patients.overview", patient.id)),
    });
  };

  return (
    <AppShell>
      <Head title={`DAPSA • ${patient?.name ?? ""}`} />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">DAPSA · {patient?.name}</h1>
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

        {/* TOP: Joint figures */}
        <div className="grid lg:grid-cols-2 gap-6">
          <JointFigure
            title={`Tender Joints (TJC68) 🖐️ — Count: ${tjc68}`}
            selected={tenderJoints}
            onToggle={toggleTender}
          />
          <JointFigure
            title={`Swollen Joints (SJC66) 💧 — Count: ${sjc66}`}
            selected={swollenJoints}
            onToggle={toggleSwollen}
          />
        </div>

        {/* BELOW: Inputs + Score */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Inputs card */}
          <div className="rounded-2xl border p-4 bg-white shadow-sm space-y-5">
            {/* Pain VAS */}
            <div>
              <label className="block text-sm text-slate-700 mb-1">Pain VAS (0–10) 🤕</label>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>0</span>
                <span>10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={pain}
                onChange={(e) => setPain(Number(e.target.value))}
                className="w-full accent-blue-600"
                aria-label="Pain VAS 0 to 10"
              />
              <div className="mt-1 text-sm">
                <span className="font-medium">{pain.toFixed(1)}</span> / 10
              </div>
            </div>

            {/* Patient Global */}
            <div>
              <label className="block text-sm text-slate-700 mb-1">Patient Global (0–10) 🙂</label>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>0</span>
                <span>10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={ptGlobal}
                onChange={(e) => setPtGlobal(Number(e.target.value))}
                className="w-full accent-blue-600"
                aria-label="Patient Global 0 to 10"
              />
              <div className="mt-1 text-sm">
                <span className="font-medium">{ptGlobal.toFixed(1)}</span> / 10
              </div>
            </div>

            {/* CRP */}
            <div>
              <label className="block text-sm text-slate-700 mb-1">CRP (mg/dL) 🧪</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={crp}
                onChange={(e) => setCrp(Number(e.target.value))}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="e.g. 0.8"
              />
              <div className="text-xs text-slate-500 mt-1">
                Ensure the CRP unit (mg/dL) matches your backend expectation.
              </div>
            </div>
          </div>

          {/* Score card */}
          <div className="rounded-2xl border p-4 bg-white shadow-sm">
            <div className="text-sm text-slate-600">DAPSA Score</div>
            <div className="text-4xl font-bold">{score.toFixed(1)}</div>

            <div className="mt-4">
              <div className="text-xs text-slate-500 mb-1">Interpretation</div>
              <ul className="text-sm space-y-1">
                <li>😀 Remission: ≤ 4</li>
                <li>🙂 Low: &gt;4 – ≤14</li>
                <li>😐 Moderate: &gt;14 – ≤28</li>
                <li>😣 High: &gt;28</li>
              </ul>
            </div>

            <button
              onClick={save}
              className="mt-4 w-full rounded-xl bg-emerald-600 text-white py-2.5 hover:bg-emerald-700"
            >
              Save DAPSA to Patient
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
