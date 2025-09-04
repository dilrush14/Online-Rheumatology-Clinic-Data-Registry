import React, { useMemo } from "react";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppShell from "@/components/app-shell";

export default function Edit() {
  const { patient, order, tests } = usePage().props;

  // Prepare initial selected ids from existing order items
  const initialSelected = useMemo(
    () => (order?.items || []).map((it) => it.lab_test_id || it.test?.id).filter(Boolean),
    [order]
  );

  const { data, setData, put, processing, errors } = useForm({
    selected_test_ids: initialSelected,
    notes: order?.notes || "",
  });

  const toggle = (id) => {
    setData(
      "selected_test_ids",
      data.selected_test_ids.includes(id)
        ? data.selected_test_ids.filter((x) => x !== id)
        : [...data.selected_test_ids, id]
    );
  };

  const submit = (e) => {
    e.preventDefault();
    // ✅ Force redirect to Overview after a successful update
    put(route("doctor.patients.lab-orders.update", [patient.id, order.id]), {
      onSuccess: () => {
        router.visit(route("doctor.patients.overview", patient.id));
      },
    });
  };

  return (
    <AppShell>
      <Head title={`Edit Lab Order • ${patient.name}`} />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Edit Lab Order • {patient.name}</h1>
          <div className="flex gap-3">
            <Link href={route("doctor.patients.overview", patient.id)} className="text-sm underline">
              Back to Overview
            </Link>
          </div>
        </div>

        <form onSubmit={submit} className="bg-white rounded-xl shadow p-6">
          <div className="mb-4">
            <p className="font-medium mb-2">Selected Tests</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {tests.map((t) => {
                const checked = data.selected_test_ids.includes(t.id);
                return (
                  <label key={t.id} className="flex items-center gap-2 border rounded px-3 py-2">
                    <input type="checkbox" checked={checked} onChange={() => toggle(t.id)} />
                    <span className="font-medium">{t.code}</span>
                    <span className="text-gray-600">{t.name}</span>
                    {t.units ? <span className="ml-auto text-xs text-gray-500">({t.units})</span> : null}
                  </label>
                );
              })}
            </div>
            {errors.selected_test_ids && (
              <p className="text-red-600 text-sm mt-1">{errors.selected_test_ids}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              You can remove tests that don’t have results yet and add new ones.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Notes (optional)</label>
            <textarea
              className="w-full border rounded p-2"
              rows={3}
              value={data.notes || ""}
              onChange={(e) => setData("notes", e.target.value)}
            />
            {errors.notes && <p className="text-red-600 text-sm mt-1">{errors.notes}</p>}
          </div>

          <button
            disabled={processing}
            className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            type="submit"
          >
            {processing ? "Updating..." : "Update Order"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
