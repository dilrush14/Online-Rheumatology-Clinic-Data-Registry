import React from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppShell from "@/components/app-shell";
import { FlaskConical, Pencil, Trash2, Calculator, AlertTriangle } from "lucide-react";

export default function Overview() {
  const { patient = {}, visits = [], lab = { orders: [] }, das28 = [], flash } = usePage().props;

  const deleteOrder = (orderId) => {
    if (!window.confirm("Delete this lab order? This is only allowed if no results exist.")) return;
    router.delete(route("doctor.patients.lab-orders.destroy", [patient.id, orderId]), {
      preserveScroll: true,
    });
  };

  const cancelOrder = (orderId) => {
    const reason = window.prompt("Enter an optional reason for cancellation:", "");
    router.put(
      route("doctor.patients.lab-orders.cancel", [patient.id, orderId]),
      { reason: reason || null },
      { preserveScroll: true }
    );
  };

  const toTitle = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // Allergies card (now supports multiple types)
  const renderAllergies = () => {
    const a = patient?.allergies || null;
    const types = Array.isArray(a?.types) ? a.types : [];
    const note = a?.note || null;
    const hasAny = types.length > 0 || !!note;

    return (
      <div className={`rounded-xl border ${hasAny ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'} p-4`}>
        <div className="flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className={`${hasAny ? 'text-red-600' : 'text-gray-500'}`} size={16} />
          <span>Allergies</span>
        </div>
        <div className="mt-2 text-sm">
          <div>
            <span className="text-gray-600">Types:</span>{" "}
            <span className="font-medium">
              {types.length ? types.map(toTitle).join(', ') : 'None recorded'}
            </span>
          </div>
          {note ? (
            <div className="mt-1">
              <span className="text-gray-600">Note:</span> {note}
            </div>
          ) : null}
        </div>
        <div className="mt-2">
          <Link
            href={route("doctor.patients.edit", patient.id)}
            className="text-sm text-indigo-700 underline"
          >
            Update allergies
          </Link>
        </div>
      </div>
    );
  };

  return (
    <AppShell>
      <Head title={`Patient • ${patient?.name ?? ""}`} />

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Flash */}
        {flash?.success && (
          <div className="rounded border border-green-200 bg-green-50 px-4 py-2 text-green-800">
            {flash.success}
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{patient?.name}</h1>
            <p className="text-sm text-gray-600">
              {patient?.national_id} · {patient?.gender ?? "—"} · {patient?.age ?? "—"} yrs
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
              href={route("doctor.patients.show", patient.id)}
              className="rounded border px-3 py-2 text-sm"
            >
              Patient Details
            </Link>
          </div>
        </div>

        {/* Allergies card */}
        {renderAllergies()}

        {/* Recent DAS28 */}
        <div className="bg-white rounded-xl shadow">
          <div className="px-6 py-4 border-b font-medium">Recent DAS28</div>
          <div className="p-6">
            {!das28 || das28.length === 0 ? (
              <div className="text-sm text-gray-500">
                No DAS28 assessments yet.{" "}
                <Link
                  className="text-blue-700 underline"
                  href={route("doctor.patients.calculators.das28", patient.id)}
                >
                  Add one
                </Link>
                .
              </div>
            ) : (
              <ul className="space-y-3">
                {das28.map((d) => {
                  const scoreStr =
                    typeof d.score === "number" && !Number.isNaN(d.score)
                      ? d.score.toFixed(2)
                      : d.score ?? "-";
                  const when = d.assessed_at ? new Date(d.assessed_at).toLocaleString() : "";
                  return (
                    <li key={d.id} className="rounded border p-3 flex items-center justify-between">
                      <div className="text-sm">
                        <div className="font-medium">
                          {d.variant} · Score {scoreStr} · {d.category}
                        </div>
                        <div className="text-gray-600">
                          TJC {d.tjc28} · SJC {d.sjc28} {when && <>· {when}</>}
                        </div>
                      </div>
                      <Link
                        className="text-blue-700 underline text-sm"
                        href={route("doctor.patients.calculators.das28", patient.id)}
                      >
                        New DAS28
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Recent Visits */}
        <div className="bg-white rounded-xl shadow">
          <div className="px-6 py-4 border-b font-medium">Recent Visits</div>
          <div className="p-6">
            {visits.length === 0 ? (
              <div className="text-sm text-gray-500">No visits yet.</div>
            ) : (
              <ul className="space-y-4">
                {visits.map((v) => (
                  <li key={v.id} className="rounded border p-4">
                    <div className="text-sm text-gray-600">
                      {v.visit_date ? new Date(v.visit_date).toLocaleDateString() : ""}
                    </div>

                    {Array.isArray(v.complaints) && v.complaints.length > 0 && (
                      <div className="mt-1 text-sm">
                        <span className="font-medium">Complaints:</span>{" "}
                        {v.complaints.map((c) => `${c.code} — ${c.title}`).join(", ")}
                      </div>
                    )}

                    {Array.isArray(v.provisional_diagnoses) &&
                      v.provisional_diagnoses.length > 0 && (
                        <div className="mt-1 text-sm">
                          <span className="font-medium">Provisional Dx:</span>{" "}
                          {v.provisional_diagnoses.map((d) => `${d.code} — ${d.title}`).join(", ")}
                        </div>
                      )}

                    {v.plan && (
                      <div className="mt-1 text-sm">
                        <span className="font-medium">Plan:</span> {v.plan}
                      </div>
                    )}

                    {v.notes && (
                      <div className="mt-1 text-sm">
                        <span className="font-medium">Notes:</span> {v.notes}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Lab Orders & Results */}
        <div className="bg-white rounded-xl shadow">
          <div className="px-6 py-4 border-b font-medium">Lab Orders & Results</div>
          <div className="p-6">
            {!lab || !lab.orders || lab.orders.length === 0 ? (
              <div className="text-sm text-gray-500">
                No lab orders yet.{" "}
                <Link
                  className="text-emerald-700 underline"
                  href={route("doctor.patients.lab-orders.create", patient.id)}
                >
                  Place a lab order
                </Link>
                .
              </div>
            ) : (
              <div className="space-y-4">
                {(lab.orders || []).map((o) => {
                  const hasAnyResult = (o.items || []).some((it) => !!it.result);
                  return (
                    <div key={o.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Ordered: {o.ordered_at ? new Date(o.ordered_at).toLocaleString() : "—"} •{" "}
                          Status: <span className="font-medium">{o.status}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <Link
                            className="text-sm underline flex items-center gap-1"
                            href={route("doctor.patients.lab-orders.edit", [patient.id, o.id])}
                          >
                            <Pencil size={16} />
                            Edit
                          </Link>

                          {!hasAnyResult ? (
                            <button
                              type="button"
                              onClick={() => deleteOrder(o.id)}
                              className="text-sm underline text-red-600 flex items-center gap-1"
                              title="Delete this order (only allowed if no results exist)"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => cancelOrder(o.id)}
                              className="text-sm underline text-red-600"
                              title="Cancel this order (keeps existing results)"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>

                      <ul className="mt-3 divide-y">
                        {(o.items || []).map((it) => (
                          <li key={it.id} className="py-2">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col">
                                <Link
                                  className="text-indigo-700 underline"
                                  href={`/doctor/patients/${patient.id}/lab-orders/${o.id}/items/${it.id}/result`}
                                >
                                  {it.test?.code} — {it.test?.name}
                                </Link>

                                {it.result ? (
                                  <div className="text-sm text-gray-700">
                                    {it.result.result_value !== null ? (
                                      <>
                                        Result:{" "}
                                        <span className="font-medium">
                                          {it.result.result_value}
                                        </span>{" "}
                                        {it.result.unit || it.test?.units}
                                      </>
                                    ) : (
                                      <>Panel recorded</>
                                    )}
                                    {it.result.flag ? (
                                      <>
                                        {" "}
                                        • Flag:{" "}
                                        <span className="font-medium">{it.result.flag}</span>
                                      </>
                                    ) : null}
                                  </div>
                                ) : (
                                  <div className="text-xs text-gray-500">No result yet</div>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
