// resources/js/Pages/Doctor/Calculators/Sdai.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppShell from "@/components/app-shell";
import JointFigure from "./Components/JointFigure";

// SDAI categories
function sdaiCategory(score) {
  if (score == null) return "-";
  if (score <= 3.3) return "Remission";
  if (score <= 11) return "Low";
  if (score <= 26) return "Moderate";
  return "High";
}

// UI colors for categories
const categoryMeta = (label) => {
  switch (label) {
    case "Remission":
      return { badge: "bg-emerald-100 text-emerald-800 border-emerald-200", panel: "ring-emerald-200" };
    case "Low":
      return { badge: "bg-sky-100 text-sky-800 border-sky-200", panel: "ring-sky-200" };
    case "Moderate":
      return { badge: "bg-amber-100 text-amber-900 border-amber-200", panel: "ring-amber-200" };
    case "High":
      return { badge: "bg-rose-100 text-rose-800 border-rose-200", panel: "ring-rose-200" };
    default:
      return { badge: "bg-slate-100 text-slate-800 border-slate-200", panel: "ring-slate-200" };
  }
};

export default function Sdai() {
  // Accepts prefill + mode from controller (like CDAI/DAS28)
  const { patient, flash, prefill = null, mode = "create" } = usePage().props;

  // Joint selections -> counts
  const [tender, setTender] = useState([]);   // array of joint ids (UI only)
  const [swollen, setSwollen] = useState([]); // array of joint ids (UI only)

  // Globals (0–10) – UI names: ptg/phg; backend expects pt_global/ph_global
  const [ptg, setPtg] = useState(0);
  const [phg, setPhg] = useState(0);

  // CRP (mg/dL) per your current page; controller validates numeric ≥ 0
  const [crp, setCrp] = useState(0);

  // Prefill when editing
  useEffect(() => {
    if (!prefill) return;
    // If you later store tender/swollen joints in the table, preload here.
    setTender(Array.isArray(prefill.tender_joints) ? prefill.tender_joints : []);
    setSwollen(Array.isArray(prefill.swollen_joints) ? prefill.swollen_joints : []);
    setPtg(Number(prefill.pt_global ?? 0));
    setPhg(Number(prefill.ph_global ?? 0));
    setCrp(Number(prefill.crp ?? 0));
  }, [prefill]);

  const tjc28 = tender.length;
  const sjc28 = swollen.length;

  // SDAI = TJC28 + SJC28 + PtG (0–10) + PhG (0–10) + CRP
  const score = useMemo(
    () => Number(tjc28 || 0) + Number(sjc28 || 0) + Number(ptg || 0) + Number(phg || 0) + Number(crp || 0),
    [tjc28, sjc28, ptg, phg, crp]
  );

  const category = sdaiCategory(score);
  const meta = categoryMeta(category);

  const toggleTender = (id) => setTender((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const toggleSwollen = (id) => setSwollen((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const save = () => {
    // Backend (controller) expects pt_global/ph_global (not ptg/phg)
    const payload = {
      tjc28,
      sjc28,
      pt_global: Number(ptg),
      ph_global: Number(phg),
      crp: Number(crp),
      score: Number(score.toFixed(1)),
      // If in future you add columns to store joints, include:
      // tender_joints: tender,
      // swollen_joints: swollen,
    };

    if (mode === "edit" && prefill?.id) {
      // This requires routes + controller methods like CDAI/DAS28:
      // doctor.patients.calculators.sdai.update
      router.put(route("doctor.patients.calculators.sdai.update", [patient.id, prefill.id]), payload, {
        preserveScroll: true,
        onSuccess: () => router.visit(route("doctor.patients.overview", patient.id)),
      });
    } else {
      router.post(route("doctor.patients.calculators.sdai.store", patient.id), payload, {
        preserveScroll: true,
        onSuccess: () => router.visit(route("doctor.patients.overview", patient.id)),
      });
    }
  };

  return (
    <AppShell>
      <Head title={`SDAI • ${patient?.name ?? ""}`} />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {mode === "edit" ? "Edit SDAI" : "SDAI"} · {patient?.name}
          </h1>
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

        {/* Joint pickers */}
        <div className="grid lg:grid-cols-2 gap-6">
          <JointFigure title="Tender Joints (TJC28)" selected={tender} onToggle={toggleTender} />
          <JointFigure title="Swollen Joints (SJC28)" selected={swollen} onToggle={toggleSwollen} />
        </div>

        {/* Inputs + Result */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Inputs */}
          <div className="rounded-2xl border p-4 bg-white shadow-sm space-y-5">
            {/* Counts (read-only from figure) */}
            <div>
              <div className="mb-2 font-semibold">Counts</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-slate-600">Tender (TJC28)</div>
                  <div className="text-2xl font-semibold">{tjc28}</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-slate-600">Swollen (SJC28)</div>
                  <div className="text-2xl font-semibold">{sjc28}</div>
                </div>
              </div>
            </div>

            {/* PtG slider */}
            <div>
              <label className="block text-sm text-slate-700 mb-1">😊 Patient Global (0–10)</label>
              <input
                aria-label="Patient Global, 0 to 10"
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={ptg}
                onChange={(e) => setPtg(e.target.value)}
                className="w-full accent-blue-600"
              />
              <div className="mt-1 text-sm">
                <span className="font-medium">{Number(ptg).toFixed(1)}</span> / 10
              </div>
            </div>

            {/* PhG slider */}
            <div>
              <label className="block text-sm text-slate-700 mb-1">🩺 Physician Global (0–10)</label>
              <input
                aria-label="Physician Global, 0 to 10"
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={phg}
                onChange={(e) => setPhg(e.target.value)}
                className="w-full accent-blue-600"
              />
              <div className="mt-1 text-sm">
                <span className="font-medium">{Number(phg).toFixed(1)}</span> / 10
              </div>
            </div>

            {/* CRP */}
            <div>
              <label className="block text-sm text-slate-700 mb-1">CRP (mg/dL)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={crp}
                onChange={(e) => setCrp(e.target.value)}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="e.g. 0.8"
              />
              <div className="text-xs text-slate-500 mt-1">
                Use mg/dL to match your current backend. If you store mg/L, adjust conversion accordingly.
              </div>
            </div>
          </div>

          {/* Formula (beautified) */}
          <div className="rounded-2xl border p-0 bg-white shadow-sm overflow-hidden">
            <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border-b">
              <div className="text-xs tracking-wide text-slate-600">Formula</div>
              <div className="text-sm font-medium text-slate-800">
                <span className="font-semibold">SDAI</span> = TJC28 + SJC28 + PtG (0–10) + PhG (0–10) + CRP
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="text-xs text-slate-500">
                Tip: Use joint diagrams to set TJC/SJC; slide 😊 PtG and 🩺 PhG; enter CRP.
              </div>

              <ul className="text-sm space-y-2">
                <li className="flex items-center justify-between rounded-lg border px-3 py-1.5 border-emerald-200 bg-emerald-50 text-emerald-800">
                  <span className="font-medium">The Simplified Disease Activity Index (SDAI) is a composite score for rheumatoid arthritis that sums tender and swollen joint counts (28), patient and physician global assessments, and C-reactive protein (CRP) levels.</span>
                </li>
                
              </ul>

              <div className="text-xs text-slate-500">
                Values are unitless sums except PtG/PhG (0–10) and CRP (mg/dL).
              </div>
            </div>
          </div>

          {/* Result */}
          <div className={`rounded-2xl border p-4 bg-white shadow-sm ring-2 ${meta.panel}`}>
            <div className="mb-2 font-semibold">Result</div>
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold">{score.toFixed(1)}</div>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-medium ${meta.badge}`}>
                {category}
              </span>
            </div>

            {/* Bands colored */}
            <div className="mt-4">
              <div className="text-xs text-slate-500 mb-1">Bands</div>
              <ul className="text-sm space-y-2">
                <li className="flex items-center justify-between rounded-lg border px-3 py-1.5 border-emerald-200 bg-emerald-50 text-emerald-800">
                  <span>Remission</span>
                  <span className="font-medium">≤ 3.3</span>
                </li>
                <li className="flex items-center justify-between rounded-lg border px-3 py-1.5 border-sky-200 bg-sky-50 text-sky-800">
                  <span>Low</span>
                  <span className="font-medium">≤ 11</span>
                </li>
                <li className="flex items-center justify-between rounded-lg border px-3 py-1.5 border-amber-200 bg-amber-50 text-amber-900">
                  <span>Moderate</span>
                  <span className="font-medium">≤ 26</span>
                </li>
                <li className="flex items-center justify-between rounded-lg border px-3 py-1.5 border-rose-200 bg-rose-50 text-rose-800">
                  <span>High</span>
                  <span className="font-medium">&gt; 26</span>
                </li>
              </ul>
            </div>

            <button
              onClick={save}
              className="mt-4 w-full rounded-xl bg-emerald-600 text-white py-2.5 hover:bg-emerald-700"
            >
              {mode === "edit" ? "Update SDAI" : "Save SDAI to Patient"}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
