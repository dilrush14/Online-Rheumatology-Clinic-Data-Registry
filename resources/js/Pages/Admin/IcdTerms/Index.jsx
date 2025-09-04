import React, { useEffect, useMemo, useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';
import DeleteButton from '@/components/DeleteButton';

export default function Index() {
  const { terms, filters, flash } = usePage().props;
  const [search, setSearch] = useState(filters?.search || '');
  const [category, setCategory] = useState(filters?.category || '');

  useEffect(() => {
    const id = setTimeout(() => {
      router.get(
        route('admin.icd-terms.index'),
        { search, category },
        { preserveState: true, replace: true }
      );
    }, 300);
    return () => clearTimeout(id);
  }, [search, category]);

  const rows = useMemo(() => terms?.data || [], [terms]);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto p-6">
        {flash?.success && (
          <div className="mb-4 rounded border border-green-200 bg-green-50 px-4 py-2 text-green-800">
            {flash.success}
          </div>
        )}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold">ICD Terms</h1>
          <div className="flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code/title…"
              className="w-64 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Categories</option>
              <option value="complaint">Complaint</option>
              <option value="diagnosis">Diagnosis</option>
            </select>
            <Link
              href={route('admin.icd-terms.create')}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              + Add ICD
            </Link>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs font-semibold text-gray-600">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-500">
                    No ICD terms found.
                  </td>
                </tr>
              ) : (
                rows.map((t) => (
                  <tr key={t.id} className="text-sm">
                    <td className="px-4 py-3 font-medium text-gray-900">{t.code}</td>
                    <td className="px-4 py-3 text-gray-700">{t.title}</td>
                    <td className="px-4 py-3 text-gray-700">{t.category}</td>
                    <td className="px-4 py-3">{t.is_active ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <Link
                          href={route('admin.icd-terms.edit', t.id)}
                          className="text-indigo-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteButton
                          href={route('admin.icd-terms.destroy', t.id)}
                          confirmText={`Delete ICD ${t.code}?`}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </DeleteButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {terms?.links?.length > 1 && (
          <nav className="mt-4 flex flex-wrap gap-2">
            {terms.links.map((link, idx) => {
              const label = link.label
                .replace('&laquo; Previous', '‹ Prev')
                .replace('Next &raquo;', 'Next ›');
              return link.url ? (
                <Link
                  key={idx}
                  href={link.url}
                  preserveState
                  replace
                  className={`rounded border px-3 py-1.5 text-sm ${
                    link.active
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                  dangerouslySetInnerHTML={{ __html: label }}
                />
              ) : (
                <span
                  key={idx}
                  className="rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-400"
                  dangerouslySetInnerHTML={{ __html: label }}
                />
              );
            })}
          </nav>
        )}
      </div>
    </AppShell>
  );
}
