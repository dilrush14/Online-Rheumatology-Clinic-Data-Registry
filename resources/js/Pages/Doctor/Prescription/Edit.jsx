// resources/js/Pages/Doctor/Prescription/Edit.jsx
import React from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppShell from "@/components/app-shell";
import AsyncSelect from "react-select/async";

export default function EditPrescription() {
  const { patient, prescription } = usePage().props;

  // --- form state (hydrate existing items + react-select value) ---
  const form = useForm({
    prescribed_date: prescription?.prescribed_date ?? "",
    diagnosis: prescription?.diagnosis ?? "",
    diagnosis_code: prescription?.diagnosis_code ?? "",
    notes: prescription?.notes ?? "",
    items: (prescription?.items || []).map((it) => ({
      id: it.id,
      drug_id: it.drug_id,
      drug_label: it.drug_label, // just for initial value
      selectValue: it.drug_id ? { value: it.drug_id, label: it.drug_label } : null,
      frequency: it.frequency || "",
      dosage: it.dosage || "",
      duration: it.duration || "",
      route: it.route || "",
      instructions: it.instructions || "",
    })),
  });

  // ---- helpers ----
  const addItem = () => {
    form.setData("items", [
      ...form.data.items,
      {
        id: null,
        drug_id: null,
        drug_label: "",
        selectValue: null,
        frequency: "",
        dosage: "",
        duration: "",
        route: "",
        instructions: "",
      },
    ]);
  };

  const removeItem = (idx) => {
    const next = form.data.items.filter((_, i) => i !== idx);
    form.setData("items", next);
  };

  const updateItem = (idx, patch) => {
    const next = form.data.items.map((row, i) => (i === idx ? { ...row, ...patch } : row));
    form.setData("items", next);
  };

  const loadDrugOptions = (input) =>
    fetch(route("doctor.drugs.search", { q: input || "" }))
      .then((r) => r.json())
      .catch(() => []);

  // ---- submit (IMPORTANT: transform THEN put; no chaining) ----
  const onSubmit = (e) => {
    e.preventDefault();

    form.transform((data) => ({
      ...data,
      items: (data.items || []).map((it) => ({
        id: it.id ?? null,
        drug_id: it.selectValue?.value ?? it.drug_id ?? null,
        frequency: it.frequency || "",
        dosage: it.dosage || "",
        duration: it.duration || null,
        route: it.route || null,
        instructions: it.instructions || null,
      })),
    }));

    form.put(route("doctor.patients.prescriptions.update", [patient.id, prescription.id]), {
      preserveScroll: true,
    });
  };

  // nice helper to show nested errors like items.0.frequency
  const fieldError = (path) => {
    const errs = form.errors || {};
    return errs[path] ? (
      <div className="text-xs text-red-600 mt-1">{errs[path]}</div>
    ) : null;
  };

  return (
    <AppShell>
      <Head title={`Edit Prescription • ${patient?.name ?? ""}`} />

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Edit Prescription</h1>
            <p className="text-sm text-gray-600">
              {patient?.name} · {patient?.national_id}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href={route("doctor.patients.overview", patient.id)}
              className="rounded border px-3 py-2 text-sm"
            >
              Back to Overview
            </Link>
      
            
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 bg-white rounded-xl shadow p-6">
          {/* Top fields */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700">Date</label>
              <input
                type="date"
                className="mt-1 w-full rounded border-gray-300"
                value={form.data.prescribed_date}
                onChange={(e) => form.setData("prescribed_date", e.target.value)}
              />
              {fieldError("prescribed_date")}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-700">Diagnosis</label>
              <input
                type="text"
                className="mt-1 w-full rounded border-gray-300"
                value={form.data.diagnosis}
                onChange={(e) => form.setData("diagnosis", e.target.value)}
                placeholder="e.g., Rheumatoid arthritis"
              />
              {fieldError("diagnosis")}
            </div>

            <div>
              <label className="block text-sm text-gray-700">Diagnosis Code (ICD)</label>
              <input
                type="text"
                className="mt-1 w-full rounded border-gray-300"
                value={form.data.diagnosis_code}
                onChange={(e) => form.setData("diagnosis_code", e.target.value)}
                placeholder="ICD-10 code"
              />
              {fieldError("diagnosis_code")}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-700">Notes</label>
              <textarea
                className="mt-1 w-full rounded border-gray-300"
                rows={2}
                value={form.data.notes}
                onChange={(e) => form.setData("notes", e.target.value)}
                placeholder="Additional notes…"
              />
              {fieldError("notes")}
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-700">Items</h2>
              <button
                type="button"
                onClick={addItem}
                className="text-sm rounded bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700"
              >
                + Add Item
              </button>
            </div>

            {Array.isArray(form.data.items) && form.data.items.length > 0 ? (
              <div className="space-y-4">
                {form.data.items.map((row, idx) => (
                  <div key={idx} className="rounded-lg border p-4">
                    <div className="grid md:grid-cols-5 gap-3">
                      <div className="md:col-span-2">
                        <label className="block text-xs text-gray-600">Drug</label>
                        <AsyncSelect
                          cacheOptions
                          defaultOptions
                          loadOptions={loadDrugOptions}
                          value={row.selectValue}
                          onChange={(opt) => updateItem(idx, { selectValue: opt })}
                          placeholder="Search drug…"
                        />
                        {fieldError(`items.${idx}.drug_id`) ||
                          fieldError(`items.${idx}.drug`)}
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600">Dosage</label>
                        <input
                          type="text"
                          className="mt-1 w-full rounded border-gray-300"
                          value={row.dosage}
                          onChange={(e) => updateItem(idx, { dosage: e.target.value })}
                          placeholder="e.g., 200 mg"
                        />
                        {fieldError(`items.${idx}.dosage`)}
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600">Frequency</label>
                        <input
                          type="text"
                          className="mt-1 w-full rounded border-gray-300"
                          value={row.frequency}
                          onChange={(e) => updateItem(idx, { frequency: e.target.value })}
                          placeholder="e.g., twice daily"
                        />
                        {fieldError(`items.${idx}.frequency`)}
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600">Duration</label>
                        <input
                          type="text"
                          className="mt-1 w-full rounded border-gray-300"
                          value={row.duration}
                          onChange={(e) => updateItem(idx, { duration: e.target.value })}
                          placeholder="e.g., 4 weeks"
                        />
                        {fieldError(`items.${idx}.duration`)}
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600">Route</label>
                        <input
                          type="text"
                          className="mt-1 w-full rounded border-gray-300"
                          value={row.route}
                          onChange={(e) => updateItem(idx, { route: e.target.value })}
                          placeholder="e.g., oral"
                        />
                        {fieldError(`items.${idx}.route`)}
                      </div>

                      <div className="md:col-span-4">
                        <label className="block text-xs text-gray-600">Instructions</label>
                        <input
                          type="text"
                          className="mt-1 w-full rounded border-gray-300"
                          value={row.instructions}
                          onChange={(e) => updateItem(idx, { instructions: e.target.value })}
                          placeholder="e.g., after meals"
                        />
                        {fieldError(`items.${idx}.instructions`)}
                      </div>
                    </div>

                    <div className="mt-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No items. Click “Add Item”.</div>
            )}

            {typeof form.errors.items === "string" && (
              <div className="text-xs text-red-600 mt-2">{form.errors.items}</div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={form.processing}
              className="rounded bg-indigo-600 px-4 py-2 text-white text-sm hover:bg-indigo-700 disabled:opacity-60"
            >
              {form.processing ? "Updating…" : "Update"}
            </button>

            <Link
              href={route("doctor.patients.overview", patient.id)}
              className="rounded border px-4 py-2 text-sm"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* meta info */}
        <div className="mt-4 text-xs text-gray-500">
          Created by {prescription?.created_by || "—"} {prescription?.created_at && ` on ${new Date(prescription.created_at).toLocaleString()}`}
          {prescription?.updated_by && ` · Last edited by ${prescription.updated_by}`}
          {prescription?.updated_at && ` on ${new Date(prescription.updated_at).toLocaleString()}`}
        </div>
      </div>
    </AppShell>
  );
}
