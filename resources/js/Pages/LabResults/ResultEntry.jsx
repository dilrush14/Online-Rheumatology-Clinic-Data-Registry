import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppShell from "@/components/app-shell";

function FBSForm({ existing, onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">Value (mg/dL)</label>
      <input
        type="number"
        step="0.01"
        className="border rounded p-2 w-48"
        defaultValue={existing?.result_value ?? ""}
        onChange={(e) => onChange({ result_value: e.target.value, unit: "mg/dL" })}
      />
    </div>
  );
}

function ESRForm({ existing, onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">Value (mm/hr)</label>
      <input
        type="number"
        step="1"
        className="border rounded p-2 w-48"
        defaultValue={existing?.result_value ?? ""}
        onChange={(e) => onChange({ result_value: e.target.value, unit: "mm/hr" })}
      />
    </div>
  );
}

function CRPForm({ existing, onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">Value (mg/L)</label>
      <input
        type="number"
        step="0.1"
        className="border rounded p-2 w-48"
        defaultValue={existing?.result_value ?? ""}
        onChange={(e) => onChange({ result_value: e.target.value, unit: "mg/L" })}
      />
    </div>
  );
}

function FBCForm({ existing, onChange }) {
  const [local, setLocal] = useState(existing?.result_json || { hb: "", wbc: "", plt: "" });
  const update = (k, v) => {
    const n = { ...local, [k]: v };
    setLocal(n);
    onChange({ result_json: n, result_value: null, unit: null });
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div>
        <label className="block text-sm font-medium mb-1">Hb (g/dL)</label>
        <input className="border rounded p-2 w-full" defaultValue={local.hb} onChange={(e) => update("hb", e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">WBC (×10^9/L)</label>
        <input className="border rounded p-2 w-full" defaultValue={local.wbc} onChange={(e) => update("wbc", e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Platelets (×10^9/L)</label>
        <input className="border rounded p-2 w-full" defaultValue={local.plt} onChange={(e) => update("plt", e.target.value)} />
      </div>
    </div>
  );
}

export default function ResultEntry() {
  const { patient, order, item, editing } = usePage().props;
  const { data, setData, post, put, processing, errors } = useForm({
    result_value: item?.result?.result_value ?? null,
    unit: item?.result?.unit ?? item?.test?.units ?? null,
    result_json: item?.result?.result_json ?? null,
    flag: item?.result?.flag ?? "",
    comments: item?.result?.comments ?? "",
    collected_at: item?.result?.collected_at ?? "",
  });

  const code = item?.test?.code;
  const onChange = (partial) => setData({ ...data, ...partial });

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = route(
      editing ? "doctor.patients.lab-results.update" : "doctor.patients.lab-results.store",
      [patient.id, order.id, item.id]
    );
    (editing ? put : post)(url);
  };

  let FormByCode = null;
  if (code === "FBS") FormByCode = <FBSForm existing={item.result} onChange={onChange} />;
  else if (code === "ESR") FormByCode = <ESRForm existing={item.result} onChange={onChange} />;
  else if (code === "CRP") FormByCode = <CRPForm existing={item.result} onChange={onChange} />;
  else if (code === "FBC") FormByCode = <FBCForm existing={item.result} onChange={onChange} />;
  else
    FormByCode = (
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Comments</label>
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          value={data.comments || ""}
          onChange={(e) => setData("comments", e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">No specific form for {code}. Add details in comments.</p>
      </div>
    );

  return (
    <AppShell>
      <Head title={`Result • ${code} • ${patient.name}`} />
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">
            {editing ? "Edit" : "Add"} Result — {code} ({item.test.name})
          </h1>
          <div className="text-sm text-gray-600">Patient: {patient.name} • Order #{order.id}</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow">
          {FormByCode}

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Flag</label>
              <select
                className="border rounded p-2 w-full"
                value={data.flag || ""}
                onChange={(e) => setData("flag", e.target.value || null)}
              >
                <option value="">—</option>
                <option value="N">Normal</option>
                <option value="H">High</option>
                <option value="L">Low</option>
                <option value="A">Abnormal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Collected At</label>
              <input
                type="datetime-local"
                className="border rounded p-2 w-full"
                value={data.collected_at || ""}
                onChange={(e) => setData("collected_at", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Comments</label>
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              value={data.comments || ""}
              onChange={(e) => setData("comments", e.target.value)}
            />
          </div>

          {Object.keys(errors).length > 0 && (
            <pre className="mt-3 text-sm text-red-600">{JSON.stringify(errors, null, 2)}</pre>
          )}

          <div className="mt-4 flex items-center gap-3">
            <button
              disabled={processing}
              className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
              type="submit"
            >
              {processing ? "Saving..." : editing ? "Update Result" : "Save Result"}
            </button>

            <Link className="text-sm underline" href={route("doctor.patients.overview", patient.id)}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
