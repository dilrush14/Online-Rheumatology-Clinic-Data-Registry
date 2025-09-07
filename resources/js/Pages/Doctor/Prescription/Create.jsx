import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import AsyncSelect from "react-select/async";
import AppShell from "@/components/app-shell";
import { Calculator, FlaskConical } from "lucide-react";

export default function Create({ patient, today }) {
  const { data, setData, post, processing, errors } = useForm({
    prescribed_date: today,
    diagnosis: "",
    diagnosis_code: "",
    notes: "",
    items: [
      {
        drug_id: null,
        drug_label: "",
        dosage: "",
        frequency: "",
        duration: "",
        route: "",
        instructions: "",
      },
    ],
  });

  // --- data helpers ---
  const loadDrugs = async (input) => {
    const res = await fetch(route("doctor.drugs.search", { q: input || "" }));
    return await res.json(); // [{ value, label, meta }, ...]
  };

  const updateItem = (idx, patch) => {
    const next = [...data.items];
    next[idx] = { ...next[idx], ...patch };
    setData("items", next);
  };

  const addRow = () =>
    setData("items", [
      ...data.items,
      {
        drug_id: null,
        drug_label: "",
        dosage: "",
        frequency: "",
        duration: "",
        route: "",
        instructions: "",
      },
    ]);

  const removeRow = (idx) =>
    setData("items", data.items.filter((_, i) => i !== idx));

  const submit = (e) => {
    e.preventDefault();
    post(route("doctor.patients.prescriptions.store", patient.id), {
      preserveScroll: true,
    });
  };

  return (
    <AppShell>
      <Head title={`New Prescription • ${patient.name}`} />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header — same wireframe as Overview */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{patient?.name}</h1>
            <p className="text-sm text-gray-600">
              {patient?.national_id} · Prescription
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href={route("doctor.patients.visits.create", patient.id)}
              className="rounded bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700"
            >
              + New Clinic Visit
            </Link>

            <Link
              href={route("doctor.patients.lab-orders.create", patient.id)}
              className="rounded bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700 flex items-center gap-1"
            >
              <FlaskConical size={16} />
              Lab Order
            </Link>

            <Link
              href={route("doctor.patients.calculators.index", patient.id)}
              className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 flex items-center gap-1"
            >
              <Calculator size={16} />
              Calculators
            </Link>

            <Link
              href={route("doctor.patients.overview", patient.id)}
              className="rounded border px-3 py-2 text-sm"
            >
              Back to Overview
            </Link>
          </div>
        </div>

        {/* Form card */}
        <form onSubmit={submit} className="bg-white rounded-xl shadow p-6 space-y-6">
          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-700">Date</label>
              <input
                type="date"
                value={data.prescribed_date || ""}
                onChange={(e) => setData("prescribed_date", e.target.value)}
                className="mt-1 w-full rounded border px-2 py-1"
              />
              {errors.prescribed_date && (
                <p className="text-xs text-rose-600">{errors.prescribed_date}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-700">Diagnosis (text)</label>
              <input
                value={data.diagnosis}
                onChange={(e) => setData("diagnosis", e.target.value)}
                className="mt-1 w-full rounded border px-2 py-1"
              />
              {errors.diagnosis && (
                <p className="text-xs text-rose-600">{errors.diagnosis}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-700">Diagnosis code (ICD)</label>
              <input
                value={data.diagnosis_code}
                onChange={(e) => setData("diagnosis_code", e.target.value)}
                className="mt-1 w-full rounded border px-2 py-1"
              />
              {errors.diagnosis_code && (
                <p className="text-xs text-rose-600">{errors.diagnosis_code}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm text-gray-700">Notes</label>
            <textarea
              value={data.notes}
              onChange={(e) => setData("notes", e.target.value)}
              rows={3}
              className="mt-1 w-full rounded border px-2 py-1"
            />
            {errors.notes && (
              <p className="text-xs text-rose-600">{errors.notes}</p>
            )}
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Items</h2>
              <button
                type="button"
                onClick={addRow}
                className="text-sm text-indigo-700 underline"
              >
                + Add item
              </button>
            </div>

            <div className="mt-2 space-y-3">
              {data.items.map((it, idx) => (
                <div key={idx} className="rounded border p-3">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                    {/* Drug */}
                    <div className="md:col-span-2">
                      <label className="text-xs text-gray-700">Drug</label>
                      <AsyncSelect
                        cacheOptions
                        defaultOptions
                        loadOptions={loadDrugs}
                        value={
                          it.drug_id
                            ? { value: it.drug_id, label: it.drug_label }
                            : null
                        }
                        onChange={(opt) =>
                          updateItem(idx, {
                            drug_id: opt?.value || null,
                            drug_label: opt?.label || "",
                          })
                        }
                        placeholder="Search drug…"
                      />
                      {errors[`items.${idx}.drug_id`] && (
                        <p className="text-xs text-rose-600">
                          {errors[`items.${idx}.drug_id`]}
                        </p>
                      )}
                    </div>

                    {/* Dosage */}
                    <div>
                      <label className="text-xs text-gray-700">Dosage</label>
                      <input
                        value={it.dosage}
                        onChange={(e) =>
                          updateItem(idx, { dosage: e.target.value })
                        }
                        className="w-full rounded border px-2 py-1"
                        placeholder="e.g., 10 mg"
                      />
                      {errors[`items.${idx}.dosage`] && (
                        <p className="text-xs text-rose-600">
                          {errors[`items.${idx}.dosage`]}
                        </p>
                      )}
                    </div>

                    {/* Frequency */}
                    <div>
                      <label className="text-xs text-gray-700">Frequency</label>
                      <input
                        value={it.frequency}
                        onChange={(e) =>
                          updateItem(idx, { frequency: e.target.value })
                        }
                        className="w-full rounded border px-2 py-1"
                        placeholder="e.g., bd"
                      />
                      {errors[`items.${idx}.frequency`] && (
                        <p className="text-xs text-rose-600">
                          {errors[`items.${idx}.frequency`]}
                        </p>
                      )}
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="text-xs text-gray-700">Duration</label>
                      <input
                        value={it.duration}
                        onChange={(e) =>
                          updateItem(idx, { duration: e.target.value })
                        }
                        className="w-full rounded border px-2 py-1"
                        placeholder="e.g., 2 weeks"
                      />
                    </div>

                    {/* Route */}
                    <div>
                      <label className="text-xs text-gray-700">Route</label>
                      <input
                        value={it.route}
                        onChange={(e) =>
                          updateItem(idx, { route: e.target.value })
                        }
                        className="w-full rounded border px-2 py-1"
                        placeholder="e.g., PO"
                      />
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="mt-2">
                    <label className="text-xs text-gray-700">Instructions</label>
                    <input
                      value={it.instructions}
                      onChange={(e) =>
                        updateItem(idx, { instructions: e.target.value })
                      }
                      className="w-full rounded border px-2 py-1"
                      placeholder="Take after food"
                    />
                  </div>

                  {/* Remove */}
                  <div className="mt-2 text-right">
                    {data.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(idx)}
                        className="text-xs text-rose-700 underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {errors.items && (
              <p className="text-xs text-rose-600 mt-1">{errors.items}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              disabled={processing}
              className="rounded bg-indigo-600 px-3 py-2 text-white text-sm hover:bg-indigo-700 disabled:opacity-60"
            >
              Save Prescription
            </button>
            <Link
              href={route("doctor.patients.overview", patient.id)}
              className="text-sm"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
