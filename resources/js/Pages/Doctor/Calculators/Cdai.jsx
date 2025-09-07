// resources/js/Pages/Doctor/Calculators/Cdai.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppShell from "@/components/app-shell";
import JointFigure from "./Components/JointFigure";

// CDAI categories
function cdaiCategory(score) {
  if (score == null) return "-";
  if (score <= 2.8) return "Remission";
  if (score <= 10) return "Low";
  if (score <= 22) return "Moderate";
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

export default function Cdai() {
  // Now also receives prefill + mode from the controller when editing
  const { patient, flash, prefill = null, mode = "create" } = usePage().props;

  // Joint selections (use the same component as DAS28)
  const [tender, setTender] = useState([]);  // array of joint ids
  const [swollen, setSwollen] = useState([]); // array of joint ids

  // Globals (0–10)
  const [ptg, setPtg] = useState(0);
  const [phg, setPhg] = useState(0);

  // Prefill when editing
  useEffect(() => {
    if (!prefill) return;
    setTender(Array.isArray(prefill.tender_joints) ? prefill.tender_joints : []);
    setSwollen(Array.isArray(prefill.swollen_joints) ? prefill.swollen_joints : []);
    setPtg(Number(prefill.ptg ?? 0));
    setPhg(Number(prefill.phg ?? 0));
  }, [prefill]);

  const tjc28 = tender.length;
  const sjc28 = swollen.length;

  // CDAI = TJC + SJC + PtG + PhG
  const score = useMemo(
    () => Number(tjc28 || 0) + Number(sjc28 || 0) + Number(ptg || 0) + Number(phg || 0),
    [tjc28, sjc28, ptg, phg]
  );

  const category = cdaiCategory(score);
  const meta = categoryMeta(category);

  const toggleTender = (id) =>
    setTender((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const toggleSwollen = (id) =>
    setSwollen((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const save = () => {
    const payload = {
      tjc28,
      sjc28,
      ptg: Number(ptg),
      phg: Number(phg),
      score: Number(score.toFixed(1)),
      category,
      tender_joints: tender,
      swollen_joints: swollen,
    };

    if (mode === "edit" && prefill?.id) {
      router.put(route("doctor.patients.calculators.cdai.update", [patient.id, prefill.id]), payload, {
        preserveScroll: true,
        onSuccess: () => router.visit(route("doctor.patients.overview", patient.id)),
      });
    } else {
      router.post(route("doctor.patients.calculators.cdai.store", patient.id), payload, {
        preserveScroll: true,
        onSuccess: () => router.visit(route("doctor.patients.overview", patient.id)),
      });
    }
  };

  return (
    <AppShell>
      <Head title={`CDAI • ${patient?.name ?? ""}`} />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {mode === "edit" ? "Edit CDAI" : "CDAI"} · {patient?.name}
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

            {/* PtG slider (with emoji) */}
            <div>
              <label className="block text-sm text-slate-700 mb-1">
                😊 Patient Global Assessment (0–10)
              </label>
              <input
                aria-label="Patient Global Assessment, 0 to 10"
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

            {/* PhG slider (with emoji) */}
            <div>
              <label className="block text-sm text-slate-700 mb-1">
                🩺 Physician Global Assessment (0–10)
              </label>
              <input
                aria-label="Physician Global Assessment, 0 to 10"
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
          </div>

          {/* Formula (beautified) */}
          <div className="rounded-2xl border p-0 bg-white shadow-sm overflow-hidden">
            <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border-b">
              <div className="text-xs tracking-wide text-slate-600">Formula</div>
              <div className="text-sm font-medium text-slate-800">
                <span className="font-semibold">CDAI</span> = TJC28 + SJC28 + PtG (0–10) + PhG (0–10)
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="text-xs text-slate-500">
                Tip: Use joint diagrams to fill TJC/SJC; then slide 😊 PtG and 🩺 PhG to match the clinical impression.
              </div>

              <ul className="text-sm space-y-2">
                <li className="flex items-center justify-between rounded-lg border px-3 py-1.5 border-emerald-200 bg-emerald-50 text-emerald-800">
                  <span className="font-medium">The Clinical Disease Activity Index (CDAI) is a validated composite score used in rheumatoid arthritis to measure disease activity based on tender and swollen joint counts along with patient and physician global assessments. It provides a quick, reliable method for categorizing patients into remission, low, moderate, or high disease activity states.</span>
                 
                </li>
                
              </ul>

              <div className="text-xs text-slate-500">
                Values are unitless sums except PtG/PhG which are 0–10 visual analogs.
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
                  <span className="font-medium">≤ 2.8</span>
                </li>
                <li className="flex items-center justify-between rounded-lg border px-3 py-1.5 border-sky-200 bg-sky-50 text-sky-800">
                  <span>Low</span>
                  <span className="font-medium">≤ 10</span>
                </li>
                <li className="flex items-center justify-between rounded-lg border px-3 py-1.5 border-amber-200 bg-amber-50 text-amber-900">
                  <span>Moderate</span>
                  <span className="font-medium">≤ 22</span>
                </li>
                <li className="flex items-center justify-between rounded-lg border px-3 py-1.5 border-rose-200 bg-rose-50 text-rose-800">
                  <span>High</span>
                  <span className="font-medium">&gt; 22</span>
                </li>
              </ul>
            </div>

            <button
              onClick={save}
              className="mt-4 w-full rounded-xl bg-emerald-600 text-white py-2.5 hover:bg-emerald-700"
            >
              {mode === "edit" ? "Update CDAI" : "Save CDAI to Patient"}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
