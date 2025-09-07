// resources/js/Pages/Doctor/Calculators/Haqdi.jsx
import React, { useMemo, useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppShell from "@/components/app-shell";

// 8 HAQ-DI domains (0–3 each)
const DOMAINS = [
  { key: "dressing",   label: "Dressing & Grooming", help: "Shirt buttons, tying shoelaces, washing/comb hair." },
  { key: "arising",    label: "Arising",             help: "Standing up from a straight chair or out of bed." },
  { key: "eating",     label: "Eating",              help: "Cutting meat, lifting a full cup to mouth, opening a new milk carton." },
  { key: "walking",    label: "Walking",             help: "Walking on flat ground." },
  { key: "hygiene",    label: "Hygiene",             help: "Bathing, getting in/out of bath, drying yourself." },
  { key: "reach",      label: "Reach",               help: "Reaching a shelf above your head." },
  { key: "grip",       label: "Grip",                help: "Opening jars, turning taps, using cutlery." },
  { key: "activities", label: "Activities",          help: "Running errands, light household tasks." },
];

const STEPS = [
  { v: 0, label: "No difficulty",   emoji: "😀" },
  { v: 1, label: "Some difficulty", emoji: "🙂" },
  { v: 2, label: "Much difficulty", emoji: "😐" },
  { v: 3, label: "Unable to do",    emoji: "😣" },
];

// active button colors per value
const activeBtnColors = {
  0: "bg-emerald-500 text-white border-emerald-500",
  1: "bg-amber-400 text-white border-amber-400",
  2: "bg-orange-500 text-white border-orange-500",
  3: "bg-rose-500 text-white border-rose-500",
};

// tiny ring/border around emoji when active
const emojiRingColors = {
  0: "border-emerald-500 ring-2 ring-emerald-200",
  1: "border-amber-500 ring-2 ring-amber-200",
  2: "border-orange-500 ring-2 ring-orange-200",
  3: "border-rose-500 ring-2 ring-rose-200",
};

export default function Haqdi() {
  const { patient, flash } = usePage().props;

  // store 8 values (0–3), default 0
  const [vals, setVals] = useState(DOMAINS.map(() => 0));
  const setAt = (i, v) => setVals((arr) => arr.map((x, j) => (j === i ? v : x)));

  // HAQ-DI score = mean of 8 domains (0–3)
  const score = useMemo(
    () => vals.reduce((a, b) => a + Number(b || 0), 0) / vals.length,
    [vals]
  );

  const save = () => {
    const payload = { items: vals, score: Number(score.toFixed(2)) };

    router.post(route("doctor.patients.calculators.haqdi.store", patient.id), payload, {
      preserveScroll: true,
      onSuccess: () => router.visit(route("doctor.patients.overview", patient.id)),
    });
  };

  return (
    <AppShell>
      <Head title={`HAQ-DI • ${patient?.name ?? ""}`} />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">HAQ-DI · {patient?.name}</h1>
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: questions */}
          <div className="lg:col-span-2 rounded-2xl border p-4 bg-white shadow-sm space-y-4">
            <div className="text-sm text-slate-600 mb-1">
              For each activity, choose the level of difficulty in the past week.
            </div>

            {DOMAINS.map((d, i) => (
              <div key={d.key} className="border rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{d.label}</div>
                  <div className="text-xs text-slate-500">{d.help}</div>
                </div>

                {/* 4 options in one row */}
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {STEPS.map((s) => {
                    const active = vals[i] === s.v;
                    return (
                      <div key={s.v} className="flex flex-col items-center gap-1">
                        {/* Emoji ABOVE the button (outside) */}
                        <span
                          className={[
                            "text-2xl inline-flex items-center justify-center w-10 h-10 rounded-full border bg-white",
                            active ? emojiRingColors[s.v] : "border-slate-300",
                          ].join(" ")}
                          title={s.label}
                        >
                          {s.emoji}
                        </span>

                        {/* The button */}
                        <button
                          type="button"
                          onClick={() => setAt(i, s.v)}
                          className={[
                            "w-full px-2 py-2 rounded-lg border text-xs font-medium text-center transition-colors",
                            active
                              ? activeBtnColors[s.v]
                              : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50",
                          ].join(" ")}
                        >
                          {s.v} • {s.label}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right: formula + result */}
          <div className="space-y-6">
            {/* Formula panel */}
            <div className="rounded-2xl border p-0 bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border-b">
                <div className="text-xs tracking-wide text-slate-600">
                  How it’s calculated
                </div>
                <div className="text-sm font-medium text-slate-800">
                  <span className="font-semibold">HAQ-DI</span> = mean of 8 domains (each 0–3)
                </div>
              </div>
              <ul className="p-4 text-sm space-y-2">
                <li>😀 0 = No difficulty</li>
                <li>🙂 1 = Some difficulty</li>
                <li>😐 2 = Much difficulty</li>
                <li>😣 3 = Unable to do</li>
              </ul>
            </div>

            {/* Result */}
            <div className="rounded-2xl border p-4 bg-white shadow-sm">
              <div className="text-sm text-slate-600">HAQ-DI Score</div>
              <div className="text-4xl font-bold">{score.toFixed(2)}</div>
              <button
                onClick={save}
                className="mt-4 w-full rounded-xl bg-emerald-600 text-white py-2.5 hover:bg-emerald-700"
              >
                Save HAQ-DI to Patient
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
