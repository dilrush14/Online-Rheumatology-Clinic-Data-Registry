// resources/js/Pages/Doctor/Calculators/Vas.jsx
import React, { useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppShell from "@/components/app-shell";

const PRESETS = [
  "Global health",
  "Pain",
  "Fatigue",
  "Sleep",
  "Morning stiffness",
  "Function",
  "Anxiety",
  "Depression",
  "Custom",
];

export default function Vas() {
  const { patient, flash } = usePage().props;

  const [preset, setPreset] = useState("Global health");
  const [customLabel, setCustomLabel] = useState("");
  const [value, setValue] = useState(0); // 0–100

  const label = preset === "Custom" ? (customLabel.trim() || "Custom") : preset;

  const clamp = (n) => Math.max(0, Math.min(100, Number.isFinite(+n) ? +n : 0));

  const save = () => {
    router.post(
      route("doctor.patients.calculators.vas.store", patient.id),
      { label, value: clamp(value) },
      {
        preserveScroll: true,
        onSuccess: () => router.visit(route("doctor.patients.overview", patient.id)),
      }
    );
  };

  return (
    <AppShell>
      <Head title={`VAS • ${patient?.name ?? ""}`} />

      <div className="max-w-xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">VAS · {patient?.name}</h1>
          <Link
            className="text-blue-600 hover:underline"
            href={route("doctor.patients.calculators.index", patient.id)}
          >
            Back
          </Link>
        </div>

        {flash?.success && (
          <div className="rounded-xl bg-green-50 text-green-800 px-4 py-3 border border-green-200">
            {flash.success}
          </div>
        )}

        {/* Card */}
        <div className="rounded-2xl border p-4 bg-white shadow-sm space-y-4">
          {/* Label selector */}
          <div>
            <label className="block text-sm text-slate-700 mb-1">Label</label>
            <select
              className="w-full rounded-lg border px-3 py-2 bg-white"
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
            >
              {PRESETS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            {preset === "Custom" && (
              <input
                className="mt-2 w-full rounded-lg border px-3 py-2"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="Enter custom label (e.g., Shoulder pain)"
              />
            )}
          </div>

          {/* Value slider + number input */}
          <div>
            <label className="block text-sm text-slate-700 mb-1">Value (0–100)</label>

            <div className="flex items-center gap-3">
              <span aria-hidden>😀</span>
              <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => setValue(clamp(e.target.value))}
                className="w-full accent-blue-600"
                aria-label="VAS value from 0 to 100"
              />
              <span aria-hidden>😣</span>
            </div>

            <div className="mt-2 flex items-center gap-3">
              <input
                type="number"
                min="0"
                max="100"
                value={value}
                onChange={(e) => setValue(clamp(e.target.value))}
                className="w-28 rounded-lg border px-3 py-2"
              />
              <div className="text-3xl font-bold tabular-nums">{value}</div>
            </div>
          </div>

          <button
            onClick={save}
            className="mt-2 w-full rounded-xl bg-emerald-600 text-white py-2.5 hover:bg-emerald-700"
          >
            Save VAS to Patient
          </button>
        </div>
      </div>
    </AppShell>
  );
}
