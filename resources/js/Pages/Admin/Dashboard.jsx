import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {sub ? <div className="mt-1 text-xs text-gray-500">{sub}</div> : null}
    </div>
  );
}

function RolePill({ role, count }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50/60 px-3 py-2">
      <span className="font-medium capitalize text-indigo-900">{role}</span>
      <span className="rounded bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">{count}</span>
    </div>
  );
}

export default function Dashboard() {
  const { adminStats } = usePage().props;

  const patients = adminStats?.patients ?? {};
  const today = patients.today ?? 0;
  const month = patients.month ?? 0;
  const year = patients.year ?? 0;
  const total = patients.total ?? null;

  const weekly = Array.isArray(adminStats?.weeklyRegistrations)
    ? adminStats.weeklyRegistrations.map((d) => {
        const dd = d?.date ? new Date(d.date) : null;
        const label = dd
          ? dd.toLocaleDateString(undefined, { weekday: 'short' })
          : '';
        return { label, count: Number(d.count ?? 0) };
      })
    : [];

  const roleCounts = Array.isArray(adminStats?.userRoles)
    ? adminStats.userRoles
    : [];

  return (
    <AppShell>
      <Head title="Admin Dashboard" />
      <PageHeader title="Admin Dashboard" />

      {/* Patient registration summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Registered Today" value={today} />
        <StatCard label="Registered This Month" value={month} />
        <StatCard label="Registered This Year" value={year} />
        <StatCard label="Total Patients" value={total ?? '—'} sub={!total ? 'Provide in controller' : null} />
      </div>

      {/* Weekly registrations chart */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-semibold">Daily Registrations (Last 7 Days)</h3>
          <Link
            href={route('doctor.patients.index')}
            className="text-sm text-indigo-700 underline"
          >
            View Patients
          </Link>
        </div>

        {weekly.length === 0 ? (
          <div className="text-sm text-gray-500">No data to display.</div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* User roles */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-semibold">System Users by Role</h3>
          <Link
            href={route('admin.users.index')}
            className="text-sm text-indigo-700 underline"
          >
            Manage Users
          </Link>
        </div>

        {roleCounts.length === 0 ? (
          <div className="text-sm text-gray-500">No users found.</div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {roleCounts.map(({ role, count }, idx) => (
              <RolePill key={`${role}-${idx}`} role={role} count={count ?? 0} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
