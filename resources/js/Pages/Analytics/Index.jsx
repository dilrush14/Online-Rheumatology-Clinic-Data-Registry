// resources/js/Pages/Analytics/Index.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppShell from "@/components/app-shell";

/* ==============================
   Simple number clamp helpers
   ============================== */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export default function AnalyticsIndex() {
  const { icdCounts = [], generatedAt } = usePage().props;
  const [limit, setLimit] = useState(15);

  const top = useMemo(() => icdCounts.slice(0, Math.max(1, limit)), [icdCounts, limit]);
  const maxCount = useMemo(() => Math.max(1, ...top.map(r => r.patient_count || 0)), [top]);

  // ---- NEW: DAS28 card state ----
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [busySuggest, setBusySuggest] = useState(false);
  const [selected, setSelected] = useState(null); // {id,label}
  const [series, setSeries] = useState([]);       // [{assessed_at,score},...]

  const suggestTimer = useRef(null);

  // Debounced patient search
  useEffect(() => {
    if (!q || q.length < 2) {
      setSuggestions([]);
      return;
    }
    if (suggestTimer.current) clearTimeout(suggestTimer.current);
    suggestTimer.current = setTimeout(async () => {
      setBusySuggest(true);
      try {
        const url = route("analytics.patient_search") + `?q=${encodeURIComponent(q)}`;
        const res = await fetch(url);
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data : []);
      } catch {
        setSuggestions([]);
      } finally {
        setBusySuggest(false);
      }
    }, 250);
    return () => suggestTimer.current && clearTimeout(suggestTimer.current);
  }, [q]);

  // Load DAS28 series when a patient is chosen
  const loadSeries = async (patientObj) => {
    if (!patientObj?.id) return;
    const url = route("analytics.patient_das28", patientObj.id);
    const res = await fetch(url);
    const data = await res.json();
    setSelected(patientObj);
    setSeries(Array.isArray(data?.series) ? data.series : []);
  };

  // SVG line chart for DAS28
  const Chart = ({ data }) => {
    if (!data || data.length === 0) return <div className="text-sm text-gray-500">No DAS28 records.</div>;

    const parsed = data
      .filter(d => d.score != null)
      .map(d => ({ t: new Date(d.assessed_at).getTime(), y: Number(d.score) }))
      .sort((a,b) => a.t - b.t);

    if (parsed.length === 0) return <div className="text-sm text-gray-500">No valid scores.</div>;

    const W = 720, H = 260, padL = 40, padR = 16, padT = 10, padB = 28;
    const xMin = parsed[0].t, xMax = parsed[parsed.length-1].t || parsed[0].t + 1;
    const yMin = 0, yMax = Math.max(1, ...parsed.map(p => p.y), 10);
    const xScale = t => padL + ( (t - xMin) / Math.max(1, (xMax - xMin)) ) * (W - padL - padR);
    const yScale = v => H - padB - ( (v - yMin) / Math.max(1, (yMax - yMin)) ) * (H - padT - padB);

    const points = parsed.map(p => `${clamp(xScale(p.t), padL, W-padR)},${clamp(yScale(p.y), padT, H-padB)}`).join(" ");

    // Generate a few y-axis ticks (0 → up to ceil to nearest 1)
    const ticks = [];
    const step = Math.max(1, Math.ceil((yMax - yMin)/5));
    for (let v = yMin; v <= yMax; v += step) ticks.push(v);

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {/* Axes */}
        <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#e5e7eb" />
        <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#e5e7eb" />

        {/* Y ticks */}
        {ticks.map((v, i) => {
          const y = yScale(v);
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#f3f4f6" />
              <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#6b7280">{v}</text>
            </g>
          );
        })}

        {/* Polyline */}
        <polyline fill="none" stroke="#4f46e5" strokeWidth="2" points={points} />

        {/* Points */}
        {parsed.map((p, idx) => (
          <circle key={idx} cx={xScale(p.t)} cy={yScale(p.y)} r="3" fill="#4f46e5" />
        ))}
      </svg>
    );
  };

  return (
    <AppShell>
      <Head title="Data Analysis" />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Data Analysis</h1>
            <p className="text-sm text-gray-600">Generated at: {generatedAt}</p>
          </div>
          <div className="flex gap-2">
            <Link href={route("doctor.dashboard")} className="rounded border px-3 py-2 text-sm">
              Back
            </Link>
          </div>
        </div>

        {/* --- Card 1: ICD-11 unique-patient bar chart --- */}
        <div className="bg-white rounded-xl shadow">
          <div className="px-6 py-4 border-b font-medium flex items-center justify-between">
            <span>Provisional Diagnosis (ICD-11) — Unique patients per code</span>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Show top</label>
              <select
                className="rounded border px-2 py-1 text-sm"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
              >
                {[5,10,15,20,30,50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-6">
            {top.length === 0 ? (
              <div className="text-sm text-gray-500">No provisional diagnoses recorded yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bars */}
                <div className="md:col-span-2">
                  <div className="space-y-2">
                    {top.map((row, idx) => {
                      const pct = Math.round((row.patient_count / maxCount) * 100);
                      return (
                        <div key={`${row.code}-${idx}`}>
                          <div className="flex items-center justify-between text-xs text-gray-700">
                            <div className="truncate pr-2">
                              <span className="font-medium">{row.code}</span>
                              {row.title ? <> — <span className="text-gray-600">{row.title}</span></> : null}
                            </div>
                            <div className="ml-2 tabular-nums">{row.patient_count}</div>
                          </div>
                          <div className="mt-1 h-3 bg-gray-100 rounded">
                            <div className="h-3 rounded bg-indigo-500" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Showing top {top.length} of {icdCounts.length} ICD-11 codes.
                  </div>
                </div>

                {/* Table */}
                <div className="md:col-span-1">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="px-3 py-2 border-b text-sm font-medium bg-gray-50">Summary</div>
                    <div className="max-h-[520px] overflow-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left px-3 py-2">ICD-11</th>
                            <th className="text-right px-3 py-2">Patients</th>
                          </tr>
                        </thead>
                        <tbody>
                          {top.map((row, idx) => (
                            <tr key={`t-${row.code}-${idx}`} className="border-b last:border-0">
                              <td className="px-3 py-2">
                                <div className="font-medium">{row.code}</div>
                                {row.title ? (
                                  <div className="text-xs text-gray-600 line-clamp-2">{row.title}</div>
                                ) : null}
                              </td>
                              <td className="px-3 py-2 text-right tabular-nums">{row.patient_count}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-2 text-xs text-gray-600">
                      Metric: <span className="font-medium">unique patients</span> with any visit containing the code in <code>provisional_diagnoses[]</code>.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- Card 2: Patient DAS28 trend (search + SVG line chart) --- */}
        <div className="bg-white rounded-xl shadow">
          <div className="px-6 py-4 border-b font-medium">DAS28 Trend by Patient</div>
          <div className="p-6 space-y-4">
            {/* Search box */}
            <div>
              <label className="block text-sm text-gray-700">Search patient</label>
              <input
                className="mt-1 w-full max-w-md rounded border px-3 py-2"
                placeholder="Type name or NIC…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              {/* Suggestions */}
              {q && (busySuggest || suggestions.length > 0) && (
                <div className="mt-2 w-full max-w-md rounded border bg-white shadow-sm">
                  {busySuggest && <div className="px-3 py-2 text-sm text-gray-500">Searching…</div>}
                  {!busySuggest &&
                    suggestions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setQ(s.label);
                          setSuggestions([]);
                          loadSeries(s);
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50"
                      >
                        {s.label}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Selected patient + chart */}
            {selected ? (
              <div className="space-y-3">
                <div className="text-sm text-gray-700">
                  Selected: <span className="font-medium">{selected.label}</span>
                </div>
                <div className="rounded border p-3">
                  <Chart data={series} />
                </div>

                {/* Table below chart */}
                <div className="rounded border overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left px-3 py-2">Assessed at</th>
                        <th className="text-left px-3 py-2">Variant</th>
                        <th className="text-right px-3 py-2">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {series.map((r) => (
                        <tr key={r.id} className="border-b last:border-0">
                          <td className="px-3 py-2">{r.assessed_at ? new Date(r.assessed_at).toLocaleString() : "—"}</td>
                          <td className="px-3 py-2">{r.variant ?? "—"}</td>
                          <td className="px-3 py-2 text-right tabular-nums">
                            {typeof r.score === "number" ? r.score.toFixed(2) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Choose a patient to see the DAS28 trend.</div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
