import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import { route } from 'ziggy-js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value ?? 0}</div>
    </div>
  );
}

export default function NurseDashboard({ stats = {} }) {
  const patients = stats.patients ?? { today: 0, month: 0, year: 0 };
  const weekly = (stats.weeklyRegistrations ?? []).map(d => ({
    ...d,
    label: new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' }),
  }));

  return (
    <AppShell>
      <Head title="Nurse Dashboard" />
      <PageHeader title="Nurse Dashboard" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Patients Today" value={patients.today} />
        <StatCard title="This Month" value={patients.month} />
        <StatCard title="This Year" value={patients.year} />
      </div>

      <div className="mt-6 rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-3 text-sm font-medium text-gray-700">Registrations (Last 7 Days)</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </AppShell>
  );
}
