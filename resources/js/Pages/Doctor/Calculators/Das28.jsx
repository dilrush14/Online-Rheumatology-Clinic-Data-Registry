import React, { useMemo, useState } from 'react';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';
import JointFigure from './Components/JointFigure';

function sqrt(x){ return Math.sqrt(Math.max(0, x || 0)); }
function ln(x){ return Math.log(Math.max(1e-9, x || 0)); }

// DAS28-ESR
function das28ESR(tjc, sjc, esr, gh){
  if (esr == null || esr <= 0) return null;
  return 0.56*sqrt(tjc) + 0.28*sqrt(sjc) + 0.70*ln(esr) + 0.014*(gh ?? 0);
}
// DAS28-CRP
function das28CRP(tjc, sjc, crp, gh){
  if (crp == null || crp < 0) return null;
  return 0.56*sqrt(tjc) + 0.28*sqrt(sjc) + 0.36*ln((crp ?? 0)+1) + 0.014*(gh ?? 0) + 0.96;
}

// Categories
function categoryESR(score){
  if (score == null) return '-';
  if (score < 2.6) return 'Remission';
  if (score <= 3.2) return 'Low';
  if (score <= 5.1) return 'Moderate';
  return 'High';
}
function categoryCRP(score){
  if (score == null) return '-';
  if (score < 2.4) return 'Remission';
  if (score <= 2.9) return 'Low';
  if (score <= 4.6) return 'Moderate';
  return 'High';
}

// UI helpers
const categoryMeta = (label) => {
  switch (label) {
    case 'Remission': return { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', panel: 'ring-emerald-200' };
    case 'Low':       return { badge: 'bg-sky-100 text-sky-800 border-sky-200',           panel: 'ring-sky-200' };
    case 'Moderate':  return { badge: 'bg-amber-100 text-amber-900 border-amber-200',     panel: 'ring-amber-200' };
    case 'High':      return { badge: 'bg-rose-100 text-rose-800 border-rose-200',        panel: 'ring-rose-200' };
    default:          return { badge: 'bg-slate-100 text-slate-800 border-slate-200',     panel: 'ring-slate-200' };
  }
};

const bandsFor = (variant) => (
  variant === 'ESR'
    ? [
        { name: 'Remission', range: '< 2.6',   cls: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
        { name: 'Low',       range: '2.6–3.2', cls: 'border-sky-200 bg-sky-50 text-sky-800' },
        { name: 'Moderate',  range: '3.2–5.1', cls: 'border-amber-200 bg-amber-50 text-amber-900' },
        { name: 'High',      range: '> 5.1',   cls: 'border-rose-200 bg-rose-50 text-rose-800' },
      ]
    : [
        { name: 'Remission', range: '< 2.4',   cls: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
        { name: 'Low',       range: '2.4–2.9', cls: 'border-sky-200 bg-sky-50 text-sky-800' },
        { name: 'Moderate',  range: '2.9–4.6', cls: 'border-amber-200 bg-amber-50 text-amber-900' },
        { name: 'High',      range: '> 4.6',   cls: 'border-rose-200 bg-rose-50 text-rose-800' },
      ]
);

// Emoji face for VAS: higher = worse
const faceForGh = (ghValue) => {
  const v = Number(ghValue || 0);
  if (v <= 10) return '😀';
  if (v <= 30) return '🙂';
  if (v <= 60) return '😐';
  if (v <= 80) return '🙁';
  return '😣';
};

export default function Das28() {
  const { patient, flash } = usePage().props;

  const [tender, setTender] = useState([]);
  const [swollen, setSwollen] = useState([]);
  const [variant, setVariant] = useState('ESR');
  const [esr, setEsr] = useState('');
  const [crp, setCrp] = useState('');
  const [gh,  setGh]  = useState(''); // 0–100

  const tjc = tender.length;
  const sjc = swollen.length;

  const esrScore = useMemo(() => das28ESR(tjc, sjc, Number(esr), Number(gh)), [tjc,sjc,esr,gh]);
  const crpScore = useMemo(() => das28CRP(tjc, sjc, Number(crp), Number(gh)), [tjc,sjc,crp,gh]);

  const currentScore = variant === 'ESR' ? esrScore : crpScore;
  const currentCategory = variant === 'ESR' ? categoryESR(currentScore) : categoryCRP(currentScore);
  const meta = categoryMeta(currentCategory);

  const form = useForm({
    variant: null, esr: null, crp: null, gh: null,
    sjc28: 0, tjc28: 0, swollen_joints: [], tender_joints: [],
    score: 0, category: '',
  });

  /*const onSave = () => {
    const payload = {
      variant,
      esr: esr ? Number(esr) : null,
      crp: crp ? Number(crp) : null,
      gh:  gh ? Number(gh) : null,
      sjc28: sjc,
      tjc28: tjc,
      swollen_joints: swollen,
      tender_joints: tender,
      score: Number((currentScore ?? 0).toFixed(2)),
      category: currentCategory,
    };

    form.post(route('doctor.patients.calculators.das28.store', patient.id), {
      data: payload,
      preserveScroll: true,
      onSuccess: () => {
        // Force navigation even if server returns 302
        router.visit(route('doctor.patients.overview', patient.id));
      },
    });
  };*/


  const onSave = () => {
  const payload = {
    variant,
    esr: esr ? Number(esr) : null,
    crp: crp ? Number(crp) : null,
    gh:  gh ? Number(gh) : null,
    sjc28: sjc,
    tjc28: tjc,
    swollen_joints: swollen,
    tender_joints: tender,
    score: Number((currentScore ?? 0).toFixed(2)),
    category: currentCategory,
  };

  router.post(route('doctor.patients.calculators.das28.store', patient.id), payload, {
    preserveScroll: true,
    onSuccess: () => {
      router.visit(route('doctor.patients.overview', patient.id));
    },
  });
};

  const toggleTender = id => setTender(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const toggleSwollen = id => setSwollen(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  return (
    <AppShell>
      <Head title={`DAS28 • ${patient?.name ?? ''}`} />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">DAS28 · {patient.name}</h1>
          <Link href={route('doctor.patients.calculators.index', patient.id)} className="text-blue-600 hover:underline">
            Back to Calculators
          </Link>
        </div>

        {flash?.success && (
          <div className="rounded-xl bg-green-50 text-green-800 px-4 py-3 border border-green-200">{flash.success}</div>
        )}

        {/* Figures */}
        <div className="grid lg:grid-cols-2 gap-6">
          <JointFigure title="Tender Joints (TJC28)" selected={tender} onToggle={toggleTender} />
          <JointFigure title="Swollen Joints (SJC28)" selected={swollen} onToggle={toggleSwollen} />
        </div>

        {/* Inputs + Counts + Result */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Variant & inputs */}
          <div className="rounded-2xl border p-4 shadow-sm bg-white">
            <div className="mb-2 font-semibold">Variant</div>
            <div className="flex gap-3">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="variant" value="ESR" checked={variant==='ESR'} onChange={() => setVariant('ESR')} />
                <span>ESR-based</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="variant" value="CRP" checked={variant==='CRP'} onChange={() => setVariant('CRP')} />
                <span>CRP-based</span>
              </label>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-sm text-slate-600 mb-1">ESR (mm/hr)</label>
                <input type="number" min="0" step="0.1" value={esr}
                       onChange={e=>setEsr(e.target.value)}
                       className="w-full rounded-lg border px-3 py-2" placeholder="e.g. 25" />
                <div className="text-xs text-slate-500 mt-1">Required for ESR variant</div>
              </div>

              <div>
                <label className="block text-sm text-slate-600 mb-1">CRP (mg/L)</label>
                <input type="number" min="0" step="0.1" value={crp}
                       onChange={e=>setCrp(e.target.value)}
                       className="w-full rounded-lg border px-3 py-2" placeholder="e.g. 8" />
                <div className="text-xs text-slate-500 mt-1">Required for CRP variant</div>
              </div>

              {/* VAS slider with faces */}
              <div>
                <label className="block text-sm text-slate-600 mb-1">Patient Global Health (0–100 mm VAS)</label>
                <div className="flex items-center gap-3">
                  <span className="text-xl">😀</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={gh || 0}
                    onChange={e => setGh(e.target.value)}
                    className="w-full accent-blue-600"
                    aria-label="Patient global health VAS"
                  />
                  <span className="text-xl">😣</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-600">
                  <div>0</div><div>25</div><div>50</div><div>75</div><div>100</div>
                </div>
                <div className="mt-1 text-sm">
                  <span className="mr-2">{faceForGh(gh)}</span>
                  <span className="font-medium">{gh || 0}</span>/100
                </div>
              </div>
            </div>
          </div>

          {/* Counts & quick calc */}
          <div className="rounded-2xl border p-4 shadow-sm bg-white">
            <div className="mb-2 font-semibold">Counts</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-slate-600">Tender (TJC28)</div>
                <div className="text-2xl font-semibold">{tjc}</div>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <div className="text-slate-600">Swollen (SJC28)</div>
                <div className="text-2xl font-semibold">{sjc}</div>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>DAS28-ESR</span>
                <span className="font-semibold">{esrScore?.toFixed(2) ?? '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>DAS28-CRP</span>
                <span className="font-semibold">{crpScore?.toFixed(2) ?? '-'}</span>
              </div>
            </div>
          </div>

          {/* Result & save */}
          <div className={`rounded-2xl border p-4 shadow-sm bg-white ring-2 ${meta.panel}`}>
            <div className="mb-2 font-semibold">Result ({variant})</div>
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold">{currentScore?.toFixed(2) ?? '-'}</div>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-medium ${meta.badge}`}>
                {currentCategory}
              </span>
            </div>

            {/* Color-coded bands */}
            <div className="mt-4">
              <div className="text-xs text-slate-500 mb-1">Bands</div>
              <ul className="text-sm space-y-2">
                {bandsFor(variant).map(b => (
                  <li key={b.name} className={`flex items-center justify-between rounded-lg border px-3 py-1.5 ${b.cls}`}>
                    <span>{b.name}</span>
                    <span className="font-medium">{b.range}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={onSave}
              disabled={form.processing || !currentScore}
              className="mt-4 w-full rounded-xl bg-emerald-600 text-white py-2.5 hover:bg-emerald-700 disabled:opacity-50"
            >
              Save DAS28 to Patient
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
