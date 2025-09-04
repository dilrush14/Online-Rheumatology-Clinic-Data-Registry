import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">{children}</label>
);
const Input = (props) => (
  <input {...props} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
);
const Select = (props) => (
  <select {...props} className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
);
const ErrorText = ({ children }) => children ? <p className="mt-1 text-xs text-red-600">{children}</p> : null;

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    code: '', title: '', category: 'complaint', is_active: true,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('admin.icd-terms.store'));
  };

  return (
    <AppShell>
      <div className="max-w-xl mx-auto p-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-2xl font-semibold">Add ICD Term</h1>
          <Link href={route('admin.icd-terms.index')} className="text-sm text-indigo-600 hover:underline">Back</Link>
        </div>

        <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 space-y-4">
          <div>
            <Label htmlFor="code">Code *</Label>
            <Input id="code" value={data.code} onChange={(e)=>setData('code', e.target.value)} />
            <ErrorText>{errors.code}</ErrorText>
          </div>
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={data.title} onChange={(e)=>setData('title', e.target.value)} />
            <ErrorText>{errors.title}</ErrorText>
          </div>
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select id="category" value={data.category} onChange={(e)=>setData('category', e.target.value)}>
              <option value="complaint">Complaint</option>
              <option value="diagnosis">Diagnosis</option>
            </Select>
            <ErrorText>{errors.category}</ErrorText>
          </div>
          <div className="flex items-center gap-2">
            <input id="is_active" type="checkbox" checked={!!data.is_active} onChange={(e)=>setData('is_active', e.target.checked)} />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {processing ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
