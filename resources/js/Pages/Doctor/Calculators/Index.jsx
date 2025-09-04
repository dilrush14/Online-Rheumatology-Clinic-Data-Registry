import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';
import { calculatorsRegistry } from './registry';

export default function Index() {
  const { patient } = usePage().props;

  return (
    <AppShell>
      <Head title={`Calculators • ${patient?.name ?? ''}`} />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Calculators · {patient.name}</h1>
          <Link
            href={route('doctor.patients.overview', patient.id)}
            className="text-slate-600 hover:underline"
          >
            Back to Overview
          </Link>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {calculatorsRegistry.map(c => (
            <div
              key={c.key}
              className={`rounded-2xl border p-5 shadow-sm transition ${c.card}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-medium">{c.name}</div>
                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs ${c.badge}`}>
                  {c.key.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{c.desc}</p>
              <div className="mt-3">
                <Link
                  className="inline-flex rounded-lg px-3 py-2 bg-blue-600 text-white hover:bg-blue-700"
                  href={route(c.routeShow, patient.id)}
                >
                  Open
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
