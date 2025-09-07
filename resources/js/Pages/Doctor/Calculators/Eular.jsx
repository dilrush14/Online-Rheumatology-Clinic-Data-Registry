// resources/js/Pages/Doctor/Calculators/Eular.jsx
import React, { useEffect, useMemo } from "react";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppShell from "@/components/app-shell";
import NumberField from "./Components/NumberField";

export default function Eular() {
  const { patient, das28_history = [] } = usePage().props;

  // Inertia form state (matches controller field names)
  const { data, setData, post, processing } = useForm({
    baseline_das28: "",
    current_das28: "",
    response: "",
  });

  // Prefill from latest two DAS28 scores if present (newest first)
  useEffect(() => {
    if (!das28_history || das28_history.length === 0) return;

    // Sort defensive: newest first by assessed_at or id fallback
    const sorted = [...das28_history].sort((a, b) => {
      const da = new Date(a.assessed_at || 0).getTime();
      const db = new Date(b.assessed_at || 0).getTime();
      if (db !== da) return db - da;
      return (b.id || 0) - (a.id || 0);
    });

    // follow-up = newest, baseline = second newest (if any)
    const follow = sorted[0]?.score ?? "";
    const base = sorted[1]?.score ?? sorted[0]?.score ?? "";

    setData("baseline_das28", base ?? "");
    setData("current_das28", follow ?? "");
  }, [das28_history]); // eslint-disable-line react-hooks/exhaustive-deps

  const baselineNum = Number(data.baseline_das28);
  const followupNum = Number(data.current_das28);

  const delta = useMemo(() => {
    if (!Number.isFinite(baselineNum) || !Number.isFinite(followupNum)) return null;
    return baselineNum - followupNum;
  }, [baselineNum, followupNum]);

  // EULAR rules using DAS28
  const response = useMemo(() => {
    if (!Number.isFinite(followupNum) || delta == null) return "-";

    if (followupNum <= 3.2) {
      if (delta > 1.2) return "Good";
      if (delta > 0.6) return "Moderate";
      return "None";
    }
    if (followupNum > 5.1) {
      return delta > 1.2 ? "Moderate" : "None";
    }
    // 3.2 < followup ≤ 5.1
    return delta > 0.6 ? "Moderate" : "None";
  }, [followupNum, delta]);

  // Keep response in the form payload
  useEffect(() => {
    setData("response", response);
  }, [response]); // eslint-disable-line react-hooks/exhaustive-deps

  const badge = useMemo(() => {
    if (response === "Good") return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (response === "Moderate") return "bg-amber-100 text-amber-900 border-amber-200";
    if (response === "None") return "bg-rose-100 text-rose-800 border-rose-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  }, [response]);

  // Helpers to render dropdown options
  const formatDASRow = (row) => {
    const dt = row?.assessed_at ? new Date(row.assessed_at) : null;
    const when = dt ? dt.toLocaleString() : "(no date)";
    return `DAS28 ${Number(row?.score ?? 0).toFixed(2)} • ${when}`;
  };

  const save = () => {
    post(route("doctor.patients.calculators.eular_resp.store", patient.id), {
      onSuccess: () => router.visit(route("doctor.patients.overview", patient.id)),
      preserveScroll: true,
    });
  };

  const canSave = Number.isFinite(baselineNum) && Number.isFinite(followupNum);

  return (
    <AppShell>
      <Head title={`EULAR Response • ${patient?.name ?? ""}`} />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            EULAR Response · {patient?.name ?? ""}
          </h1>
          <Link
            className="text-blue-600 hover:underline"
            href={route("doctor.patients.calculators.index", patient.id)}
          >
            Back to Calculators
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: inputs */}
          <div className="rounded-2xl border p-4 bg-white shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="text-xl">📥</span>
              <div className="font-medium">Pick from saved DAS28 or type</div>
            </div>

            {/* Baseline selector */}
            <label className="block text-sm text-slate-600 mb-1">
              Baseline DAS28 (earlier visit)
            </label>
            <div className="flex gap-2">
              <select
                className="w-1/2 rounded-lg border px-3 py-2"
                value="" // always blank so user can choose; we apply onChange
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  if (!isNaN(idx) && das28_history[idx]) {
                    setData("baseline_das28", das28_history[idx].score ?? "");
                  }
                }}
              >
                <option value="">— Choose from history —</option>
                {das28_history
                  .slice()
                  .sort((a, b) => {
                    const da = new Date(a.assessed_at || 0).getTime();
                    const db = new Date(b.assessed_at || 0).getTime();
                    if (db !== da) return db - da;
                    return (b.id || 0) - (a.id || 0);
                  })
                  .map((row, i) => (
                    <option key={row.id ?? i} value={i}>
                      {formatDASRow(row)}
                    </option>
                  ))}
              </select>

              <div className="w-1/2">
                <NumberField
                  label=""
                  value={data.baseline_das28}
                  onChange={(v) => setData("baseline_das28", v)}
                  min={0}
                  step={0.01}
                />
              </div>
            </div>

            {/* Follow-up selector */}
            <label className="block text-sm text-slate-600 mt-3 mb-1">
              Follow-up DAS28 (current visit)
            </label>
            <div className="flex gap-2">
              <select
                className="w-1/2 rounded-lg border px-3 py-2"
                value=""
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  if (!isNaN(idx) && das28_history[idx]) {
                    setData("current_das28", das28_history[idx].score ?? "");
                  }
                }}
              >
                <option value="">— Choose from history —</option>
                {das28_history
                  .slice()
                  .sort((a, b) => {
                    const da = new Date(a.assessed_at || 0).getTime();
                    const db = new Date(b.assessed_at || 0).getTime();
                    if (db !== da) return db - da;
                    return (b.id || 0) - (a.id || 0);
                  })
                  .map((row, i) => (
                    <option key={row.id ?? i} value={i}>
                      {formatDASRow(row)}
                    </option>
                  ))}
              </select>

              <div className="w-1/2">
                <NumberField
                  label=""
                  value={data.current_das28}
                  onChange={(v) => setData("current_das28", v)}
                  min={0}
                  step={0.01}
                />
              </div>
            </div>

            <div className="mt-2 text-xs text-slate-600">
              Tip: Use the dropdowns to pull saved DAS28 values or type a custom value.
            </div>
          </div>

          {/* Right: result */}
          <div className="rounded-2xl border p-4 bg-white shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="text-xl">📊</span>
              <div className="font-medium">EULAR Result</div>
            </div>

            <div className="rounded-xl border bg-slate-50 p-3">
              <div className="text-sm text-slate-600">ΔDAS28 (baseline − follow-up)</div>
              <div className="text-4xl font-bold">
                {delta != null && Number.isFinite(delta) ? delta.toFixed(2) : "—"}
              </div>
            </div>

            <div className={`rounded-xl border px-3 py-2 text-sm inline-flex items-center gap-2 ${badge}`}>
              <span>Response:</span>
              <span className="font-semibold">{response}</span>
              {response === "Good" && <span>🎯</span>}
              {response === "Moderate" && <span>🙂</span>}
              {response === "None" && <span>⚠️</span>}
            </div>

            <ul className="mt-2 text-xs text-slate-600 space-y-1">
              <li>Good: follow-up ≤ 3.2 and Δ &gt; 1.2</li>
              <li>Moderate: 3.2 &lt; follow-up ≤ 5.1 and Δ &gt; 0.6, or follow-up &gt; 5.1 and Δ &gt; 1.2</li>
              <li>None: otherwise</li>
            </ul>

            <button
              onClick={save}
              disabled={processing || !canSave}
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
