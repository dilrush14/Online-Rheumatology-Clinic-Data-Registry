// D:\rheumatology\project-rheuma\resources\js\Pages\Doctor\Patient\Index.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';
import { Eye, Pencil, Trash2, Stethoscope, Search, Users, Plus } from 'lucide-react';
import DeleteButton from './DeleteButton';

function Card({ title, icon: Icon, actions, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b bg-gray-50/70 px-5 py-3">
        <div className="flex items-center gap-2">
          {Icon ? <Icon size={18} className="text-indigo-600" /> : null}
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        </div>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Avatar({ name, photo_path }) {
  if (photo_path) {
    return (
      <img
        src={`/storage/${photo_path}`}
        alt={name}
        className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-200"
      />
    );
  }
  const initials =
    (name || '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('') || '?';
  return (
    <div className="h-10 w-10 rounded-full bg-indigo-100 ring-1 ring-indigo-200 flex items-center justify-center text-sm font-semibold text-indigo-700">
      {initials}
    </div>
  );
}

export default function Index() {
  const { patients, filters, flash, auth } = usePage().props;

  // --- role flags (used to disable Delete for nurses) ---
  const role = (auth?.user?.role ?? 'user').toString().toLowerCase();
  const isNurse = role === 'nurse';
  const canDelete = !isNurse; // everyone except nurse can delete

  const [search, setSearch] = useState(filters?.search || '');

  // debounce fetch
  useEffect(() => {
    const id = setTimeout(() => {
      router.get(route('doctor.patients.index'), { search }, { preserveState: true, replace: true });
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const rows = useMemo(() => patients?.data || [], [patients]);

  return (
    <AppShell>
      <Head title="Patients" />
      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-6">
        {/* page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Patients</h1>
            <p className="mt-1 text-sm text-gray-600">Search, view, and manage patient records</p>
          </div>
          <Link
            href={route('doctor.patients.create')}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Plus size={16} />
            Register Patient
          </Link>
        </div>

        {/* flash */}
        {flash?.success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-green-800">
            {flash.success}
          </div>
        )}

        {/* list card */}
        <Card
          title="Patient List"
          icon={Users}
          actions={
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name / NIC / phone / district"
                className="w-72 rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600"
              />
            </div>
          }
        >
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr className="text-left text-xs font-semibold text-gray-600">
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">NIC</th>
                  <th className="px-4 py-3">Gender</th>
                  <th className="px-4 py-3">Age</th>
                  <th className="px-4 py-3">District</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Registered</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-500">
                      No patients found.
                    </td>
                  </tr>
                ) : (
                  rows.map((p) => (
                    <tr key={p.id} className="text-sm hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={p.name} photo_path={p.photo_path} />
                          <div className="min-w-0">
                            <Link
                              href={route('doctor.patients.overview', p.id)}
                              className="font-medium text-indigo-700 hover:underline line-clamp-1"
                              title={p.name}
                            >
                              {p.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{p.national_id}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {p.gender === 'M' ? 'Male' : p.gender === 'F' ? 'Female' : p.gender}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{p.age ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-700">{p.district ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-700">{p.phone ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {new Date(p.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={route('doctor.patients.show', p.id)}
                            className="inline-flex items-center gap-1 rounded border px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                            title="View"
                          >
                            <Eye size={14} />
                            <span className="hidden sm:inline">View</span>
                          </Link>

                          <Link
                            href={route('doctor.patients.edit', p.id)}
                            className="inline-flex items-center gap-1 rounded border px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                            title="Edit"
                          >
                            <Pencil size={14} />
                            <span className="hidden sm:inline">Edit</span>
                          </Link>

                          {canDelete ? (
                            <DeleteButton
                              patientId={p.id}
                              className="inline-flex items-center gap-1 rounded border px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                              confirmText={`Delete ${p.name}? This cannot be undone.`}
                            >
                              <Trash2 size={14} />
                              <span className="hidden sm:inline">Delete</span>
                            </DeleteButton>
                          ) : (
                            <button
                              type="button"
                              disabled
                              title="Nurses cannot delete patients"
                              className="inline-flex items-center gap-1 rounded border px-2.5 py-1 text-xs font-medium text-gray-400 cursor-not-allowed bg-gray-50"
                            >
                              <Trash2 size={14} />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          {patients?.links && patients.links.length > 1 && (
            <nav className="mt-4 flex flex-wrap gap-2">
              {patients.links.map((link, idx) => {
                const label = link.label
                  .replace('&laquo; Previous', '‹ Prev')
                  .replace('Next &raquo;', 'Next ›');
                if (!link.url) {
                  return (
                    <span
                      key={idx}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-400"
                      dangerouslySetInnerHTML={{ __html: label }}
                    />
                  );
                }
                return (
                  <Link
                    key={idx}
                    href={link.url}
                    preserveState
                    replace
                    className={`rounded-lg border px-3 py-1.5 text-sm ${
                      link.active
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                    dangerouslySetInnerHTML={{ __html: label }}
                  />
                );
              })}
            </nav>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
