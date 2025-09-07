import React from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppShell from "@/components/app-shell";
import {
  FlaskConical,
  Pencil,
  Trash2,
  Calculator,
  AlertTriangle,
  Printer,
} from "lucide-react";

/* ---------- helpers for styling by category ---------- */
const catRowCls = (cat) => {
  switch ((cat || "").toLowerCase()) {
    case "remission":
      return "border-emerald-200 bg-emerald-50/60";
    case "low":
      return "border-sky-200 bg-sky-50/60";
    case "moderate":
      return "border-amber-200 bg-amber-50/60";
    case "high":
      return "border-rose-300 bg-rose-50/70";
    default:
      return "border-gray-200 bg-white";
  }
};
const catTextCls = (cat) => {
  switch ((cat || "").toLowerCase()) {
    case "remission":
      return "text-emerald-800";
    case "low":
      return "text-sky-800";
    case "moderate":
      return "text-amber-900";
    case "high":
      return "text-rose-800";
    default:
      return "text-gray-800";
  }
};
const sdaiCategory = (score) => {
  if (score == null) return "-";
  const v = Number(score);
  if (!Number.isFinite(v)) return "-";
  if (v <= 3.3) return "Remission";
  if (v <= 11) return "Low";
  if (v <= 26) return "Moderate";
  return "High";
};

export default function Overview() {
  const {
    auth,
    patient = {},
    visits = [],
    lab = { orders: [] },

    // calculators
    das28 = [],
    cdai = [],
    sdai = [],
    basdai = [],
    asdas = [],
    haqdi = [],
    dapsa = [],
    vas = [],
    bmi = [],
    eular = [],
    flash,
  } = usePage().props;

  /* ---------- role-based visibility ---------- */
  const role = (auth?.user?.role ?? "user").toString().toLowerCase();
  const isNurse = role === "nurse";

  const can = {
    header: {
      newVisit: role !== "nurse",
      // Nurse CAN create lab orders now (others too)
      labOrder: ["admin", "doctor", "consultant", "nurse"].includes(role),
      calculators: role !== "nurse",
      newRx: role !== "nurse",
      printOverview: true,   // everyone can print overview
      patientDetails: true,  // everyone can open details
    },
    labs: {
      // Nurse can add/edit RESULTS, but NOT edit/cancel/delete ORDERS
      editOrder: role !== "nurse",
      deleteOrder: role !== "nurse",
      cancelOrder: role !== "nurse",
      addResults: true,
    },
    rx: {
      edit: role !== "nurse",
      print: true, // nurse can print prescriptions
    },
    calcs: {
      edit: role !== "nurse",
      delete: role !== "nurse",
    },
  };

  /* ---------- data presence flags (hide empty cards) ---------- */
  const pres = Array.isArray(patient?.prescriptions) ? patient.prescriptions : [];
  const hasPrescriptions = pres.length > 0;
  const hasVisits = Array.isArray(visits) && visits.length > 0;
  const hasLab = Array.isArray(lab?.orders) && lab.orders.length > 0;

  const hasCdai = Array.isArray(cdai) && cdai.length > 0;
  const hasDas28 = Array.isArray(das28) && das28.length > 0;
  const hasSdai = Array.isArray(sdai) && sdai.length > 0;
  const hasBasdai = Array.isArray(basdai) && basdai.length > 0;
  const hasAsdas = Array.isArray(asdas) && asdas.length > 0;
  const hasHaqdi = Array.isArray(haqdi) && haqdi.length > 0;
  const hasDapsa = Array.isArray(dapsa) && dapsa.length > 0;
  const hasVas = Array.isArray(vas) && vas.length > 0;
  const hasBmi = Array.isArray(bmi) && bmi.length > 0;
  const hasEular = Array.isArray(eular) && eular.length > 0;

  const hasAllergies =
    (Array.isArray(patient?.allergies?.types) && patient.allergies.types.length > 0) ||
    !!patient?.allergies?.note;

  /* ---------- actions ---------- */
  const printRx = (rxId) => {
    const url = route("doctor.patients.prescriptions.print", [patient.id, rxId]);
    window.open(url, "_blank", "noopener");
  };

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

  const toTitle = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

  const renderAllergies = () => {
    const a = patient?.allergies || null;
    const types = Array.isArray(a?.types) ? a.types : [];
    const note = a?.note || null;
    const hasAny = types.length > 0 || !!note;

    return (
      <div
        className={`rounded-xl border ${
          hasAny ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
        } p-4`}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className={`${hasAny ? "text-red-600" : "text-gray-500"}`} size={16} />
          <span>Allergies</span>
        </div>
        <div className="mt-2 text-sm">
          <div>
            <span className="text-gray-600">Types:</span>{" "}
            <span className="font-medium">
              {types.length ? types.map(toTitle).join(", ") : "None recorded"}
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
            {can.header.newVisit && (
              <Link
                href={route("doctor.patients.visits.create", patient.id)}
                className="rounded bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700"
              >
                + New Clinic Visit
              </Link>
            )}
              {can.header.labOrder && (
                <Link
                  href={route(
                    isNurse
                      ? "doctor.patients.lab-orders.index"   // nurses → list/orders page
                      : "doctor.patients.lab-orders.create", // others → create new order
                    patient.id
                  )}
                  className="rounded bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700 flex items-center gap-1"
                >
                  <FlaskConical size={16} />
                  {isNurse ? "Lab Orders" : "+ Lab Order"}
                </Link>
              )}


            {can.header.calculators && (
              <Link
                href={route("doctor.patients.calculators.index", patient.id)}
                className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 flex items-center gap-1"
              >
                <Calculator size={16} />
                Calculators
              </Link>
            )}

            {can.header.newRx && (
              <Link
                href={route("doctor.patients.prescriptions.create", patient.id)}
                className="rounded bg-violet-600 px-3 py-2 text-sm text-white hover:bg-violet-700"
              >
                + Prescription
              </Link>
            )}

            {can.header.printOverview && (
              <a
                href={route("doctor.patients.overview.print", patient.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                <Printer size={16} />
                Print
              </a>
            )}

            {can.header.patientDetails && (
              <Link
                href={route("doctor.patients.show", patient.id)}
                className="rounded border px-3 py-2 text-sm"
              >
                Patient Details
              </Link>
            )}
          </div>
        </div>

        {/* Allergies */}
        {hasAllergies && renderAllergies()}

        {/* Recent Visits */}
        {hasVisits && (
          <div className="bg-white rounded-xl shadow">
            <div className="px-6 py-4 border-b font-medium">Recent Visits</div>
            <div className="p-6">
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
                    {Array.isArray(v.provisional_diagnoses) && v.provisional_diagnoses.length > 0 && (
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
            </div>
          </div>
        )}

        {/* Lab Orders & Results */}
        {hasLab && (
          <div className="bg-white rounded-xl shadow">
            <div className="px-6 py-4 border-b font-medium">Lab Orders & Results</div>
            <div className="p-6">
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

                        {can.labs.editOrder && (
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
                        )}
                      </div>

                      <ul className="mt-3 divide-y">
                        {(o.items || []).map((it) => {
                          const hasResult = !!it.result;
                          return (
                            <li key={it.id} className="py-2">
                              <div className="flex items-start justify-between">
                                <div className="flex flex-col">
                                  <div className="text-indigo-900 font-medium">
                                    {it.test?.code} — {it.test?.name}
                                  </div>

                                  {hasResult ? (
                                    <div className="text-sm text-gray-700">
                                      {it.result.result_value !== null ? (
                                        <>
                                          Result:{" "}
                                          <span className="font-medium">{it.result.result_value}</span>{" "}
                                          {it.result.unit || it.test?.units}
                                        </>
                                      ) : (
                                        <>Panel recorded</>
                                      )}
                                      {it.result.flag ? (
                                        <>
                                          {" "}
                                          • Flag: <span className="font-medium">{it.result.flag}</span>
                                        </>
                                      ) : null}
                                    </div>
                                  ) : (
                                    <div className="text-xs text-gray-500">No result yet</div>
                                  )}
                                </div>

                                {/* Add/Edit Result (nurse + others) */}
                                <div className="shrink-0">
                                  {hasResult ? (
                                    <Link
                                      className="text-sm text-indigo-700 underline"
                                      href={route("doctor.patients.lab-results.edit", [
                                        patient.id,
                                        o.id,
                                        it.id,
                                      ])}
                                    >
                                      Edit result
                                    </Link>
                                  ) : (
                                    <Link
                                      className="text-sm text-emerald-700 underline"
                                      href={route("doctor.patients.lab-results.create", [
                                        patient.id,
                                        o.id,
                                        it.id,
                                      ])}
                                    >
                                      Add result
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Recent Prescriptions */}
        {hasPrescriptions && (
          <div className="bg-white rounded-xl shadow">
            <div className="px-6 py-4 border-b font-medium">Recent Prescriptions</div>
            <div className="p-6">
              <ul className="space-y-4">
                {pres.map((p) => (
                  <li key={p.id} className="rounded border p-4">
                    <div className="text-sm text-gray-600">
                      {p.prescribed_date || "—"}
                      {p.diagnosis && (
                        <>
                          {" "}
                          · Dx: <span className="font-medium">{p.diagnosis}</span>
                        </>
                      )}
                    </div>

                    <div className="mt-2 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b font-medium">
                            <th className="text-left py-1 pr-3">Drug</th>
                            <th className="text-left py-1 pr-3">Dosage</th>
                            <th className="text-left py-1 pr-3">Frequency</th>
                            <th className="text-left py-1 pr-3">Duration</th>
                            <th className="text-left py-1 pr-3">Route</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(p.items || []).map((i) => (
                            <tr key={i.id} className="border-b last:border-0">
                              <td className="py-1 pr-3">{i.drug_name_cache}</td>
                              <td className="py-1 pr-3">{i.dosage}</td>
                              <td className="py-1 pr-3">{i.frequency}</td>
                              <td className="py-1 pr-3">{i.duration}</td>
                              <td className="py-1 pr-3">{i.route}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      {/* Print always available (nurse too) */}
                      <button onClick={() => printRx(p.id)} className="text-sm underline">
                        Print
                      </button>

                      {/* Edit only for non-nurse */}
                      {can.rx.edit && (
                        <Link
                          href={route("doctor.patients.prescriptions.edit", [patient.id, p.id])}
                          className="text-sm text-indigo-700 underline"
                        >
                          Edit
                        </Link>
                      )}
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      Created by {p.created_by_name ?? "—"}
                      {p.created_at && ` on ${new Date(p.created_at).toLocaleString()}`}
                      {p.updated_by_name && ` · Last edited by ${p.updated_by_name}`}
                      {p.updated_at && ` on ${new Date(p.updated_at).toLocaleString()}`}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* CDAI */}
        {hasCdai && renderCdai(cdai, patient, can)}
        {/* DAS28 */}
        {hasDas28 && renderDas28(das28, patient, can)}
        {/* SDAI */}
        {hasSdai && renderSdai(sdai, patient, can)}
        {/* ASDAS, HAQ-DI, DAPSA, VAS, BMI, BASDAI, EULAR */}
        {hasAsdas && renderAsdas(asdas, patient, can)}
        {hasHaqdi && renderHaqdi(haqdi, patient, can)}
        {hasDapsa && renderDapsa(dapsa, patient, can)}
        {hasVas && renderVas(vas, patient, can)}
        {hasBmi && renderBmi(bmi, patient, can)}
        {hasBasdai && renderBasdai(basdai, patient, can)}
        {hasEular && renderEular(eular, patient, can)}
      </div>
    </AppShell>
  );
}

/* =======================
   RENDER HELPERS (10)
   ======================= */

// 1) CDAI
function renderCdai(cdai, patient, can) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="px-6 py-4 border-b font-medium flex items-center justify-between">
        <span>Recent CDAI</span>
        {can.calcs?.edit && (
          <Link className="text-blue-700 underline text-sm" href={route("doctor.patients.calculators.cdai", patient.id)}>
            New CDAI
          </Link>
        )}
      </div>
      <div className="p-6">
        <ul className="space-y-3">
          {cdai.map((c) => {
            const score = Number(c.score);
            const scoreStr = Number.isFinite(score) ? score.toFixed(1) : c.score ?? "-";
            const when = c.assessed_at ? new Date(c.assessed_at).toLocaleString() : "";
            const rowCls = catRowCls(c.category);
            const textCls = catTextCls(c.category);
            const isHigh = (c.category || "").toLowerCase() === "high";

            return (
              <li key={c.id} className={`rounded border p-3 ${rowCls} flex items-center justify-between`}>
                <div className="text-sm">
                  <div className={`font-medium ${textCls} flex items-center gap-2`}>
                    {isHigh && <AlertTriangle size={16} className="text-rose-600" />}
                    Score {scoreStr} · {c.category ?? "-"}
                  </div>
                  <div className="text-gray-700">
                    TJC {c.tjc28} · SJC {c.sjc28} · PtG {c.ptg} · PhG {c.phg}
                    {when && <> · {when}</>}
                  </div>
                </div>

                {can.calcs?.edit && (
                  <div className="flex items-center gap-3 text-xs">
                    <Link
                      className="text-indigo-700 underline"
                      href={route("doctor.patients.calculators.cdai.edit", [patient.id, c.id])}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="text-rose-700 underline"
                      onClick={() => {
                        if (confirm("Delete this CDAI?")) {
                          router.delete(route("doctor.patients.calculators.cdai.destroy", [patient.id, c.id]), {
                            preserveScroll: true,
                          });
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// 2) DAS28
function renderDas28(das28, patient, can) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="px-6 py-4 border-b font-medium flex items-center justify-between">
        <span>Recent DAS28</span>
        {can.calcs?.edit && (
          <Link className="text-blue-700 underline text-sm" href={route("doctor.patients.calculators.das28", patient.id)}>
            New DAS28
          </Link>
        )}
      </div>
      <div className="p-6">
        <ul className="space-y-3">
          {das28.map((d) => {
            const score = typeof d.score === "number" && !Number.isNaN(d.score) ? d.score.toFixed(2) : d.score ?? "-";
            const when = d.assessed_at ? new Date(d.assessed_at).toLocaleString() : "";
            const rowCls = catRowCls(d.category);
            const textCls = catTextCls(d.category);
            const isHigh = (d.category || "").toLowerCase() === "high";

            return (
              <li key={d.id} className={`rounded border p-3 ${rowCls} flex items-center justify-between`}>
                <div className="text-sm">
                  <div className={`font-medium ${textCls} flex items-center gap-2`}>
                    {isHigh && <AlertTriangle size={16} className="text-rose-600" />}
                    {d.variant} · Score {score} · {d.category}
                  </div>
                  <div className="text-gray-700">
                    TJC {d.tjc28} · SJC {d.sjc28} {when && <>· {when}</>}
                  </div>
                </div>

                {can.calcs?.edit && (
                  <div className="flex items-center gap-3 text-xs">
                    <Link
                      className="text-indigo-700 underline"
                      href={route("doctor.patients.calculators.das28.edit", [patient.id, d.id])}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="text-rose-700 underline"
                      onClick={() => {
                        if (confirm("Delete this DAS28?")) {
                          router.delete(route("doctor.patients.calculators.das28.destroy", [patient.id, d.id]), {
                            preserveScroll: true,
                          });
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// 3) SDAI
function renderSdai(sdai, patient, can) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="px-6 py-4 border-b font-medium flex items-center justify-between">
        <span>Recent SDAI</span>
        {can.calcs?.edit && (
          <Link className="text-blue-700 underline text-sm" href={route("doctor.patients.calculators.sdai", patient.id)}>
            New SDAI
          </Link>
        )}
      </div>
      <div className="p-6">
        <ul className="space-y-3">
          {sdai.map((s) => {
            const v = Number(s.score);
            const scoreStr = Number.isFinite(v) ? v.toFixed(1) : s.score ?? "-";
            const cat = sdaiCategory(v);
            const when = s.assessed_at ? new Date(s.assessed_at).toLocaleString() : "";
            const rowCls = catRowCls(cat);
            const textCls = catTextCls(cat);
            const isHigh = (cat || "").toLowerCase() === "high";

            return (
              <li key={s.id} className={`rounded border p-3 ${rowCls} flex items-center justify-between`}>
                <div className="text-sm">
                  <div className={`font-medium ${textCls} flex items-center gap-2`}>
                    {isHigh && <AlertTriangle size={16} className="text-rose-600" />}
                    Score {scoreStr} · {cat}
                  </div>
                  <div className="text-gray-700">
                    TJC {s.tjc28} · SJC {s.sjc28} · PtG {s.pt_global} · PhG {s.ph_global} · CRP {s.crp}
                    {when && <> · {when}</>}
                  </div>
                </div>

                {can.calcs?.edit && (
                  <div className="flex items-center gap-3 text-xs">
                    <Link
                      className="text-indigo-700 underline"
                      href={route("doctor.patients.calculators.sdai.edit", [patient.id, s.id])}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="text-rose-700 underline"
                      onClick={() => {
                        if (confirm("Delete this SDAI?")) {
                          router.delete(route("doctor.patients.calculators.sdai.destroy", [patient.id, s.id]), {
                            preserveScroll: true,
                          });
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// 4) BASDAI
function renderBasdai(basdai, patient, can) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="px-6 py-4 border-b font-medium flex items-center justify-between">
        <span>Recent BASDAI</span>
        {can.calcs?.edit && (
          <Link className="text-blue-700 underline text-sm" href={route("doctor.patients.calculators.basdai", patient.id)}>
            New BASDAI
          </Link>
        )}
      </div>
      <div className="p-6">
        <ul className="space-y-3">
          {basdai.map((b) => {
            const score = Number(b.score);
            const scoreStr = Number.isFinite(score) ? score.toFixed(2) : b.score ?? "-";
            const when = b.assessed_at ? new Date(b.assessed_at).toLocaleString() : "";

            return (
              <li key={b.id} className="rounded border p-3 flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">Score {scoreStr}</div>
                  <div className="text-gray-700">
                    Q1 {b.q1} · Q2 {b.q2} · Q3 {b.q3} · Q4 {b.q4} · Q5 {b.q5} · Q6 {b.q6}
                    {when && <> · {when}</>}
                  </div>
                </div>

                {can.calcs?.edit && (
                  <div className="flex items-center gap-3 text-xs">
                    <Link
                      className="text-indigo-700 underline"
                      href={route("doctor.patients.calculators.basdai.edit", [patient.id, b.id])}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="text-rose-700 underline"
                      onClick={() => {
                        if (confirm("Delete this BASDAI?")) {
                          router.delete(route("doctor.patients.calculators.basdai.destroy", [patient.id, b.id]), {
                            preserveScroll: true,
                          });
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// 5) ASDAS-CRP
function renderAsdas(asdas, patient, can) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="px-6 py-4 border-b font-medium flex items-center justify-between">
        <span>Recent ASDAS-CRP</span>
        {can.calcs?.edit && (
          <Link className="text-blue-700 underline text-sm" href={route("doctor.patients.calculators.asdas_crp", patient.id)}>
            New ASDAS-CRP
          </Link>
        )}
      </div>
      <div className="p-6">
        <ul className="space-y-3">
          {asdas.map((a) => {
            const score = Number(a.score);
            const scoreStr = Number.isFinite(score) ? score.toFixed(2) : a.score ?? "-";
            const when = a.assessed_at ? new Date(a.assessed_at).toLocaleString() : "";

            return (
              <li key={a.id} className="rounded border p-3 flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">Score {scoreStr}</div>
                  <div className="text-gray-700">
                    Back pain {a.back_pain} · Stiffness {a.morning_stiffness_duration} · Pt Global {a.pt_global} ·
                    Peripheral {a.peripheral_pain_swelling} · CRP {a.crp}
                    {when && <> · {when}</>}
                  </div>
                </div>

                {can.calcs?.edit && (
                  <div className="flex items-center gap-3 text-xs">
                    <Link
                      className="text-indigo-700 underline"
                      href={route("doctor.patients.calculators.asdas_crp.edit", [patient.id, a.id])}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="text-rose-700 underline"
                      onClick={() => {
                        if (confirm("Delete this ASDAS-CRP?")) {
                          router.delete(route("doctor.patients.calculators.asdas_crp.destroy", [patient.id, a.id]), {
                            preserveScroll: true,
                          });
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// 6) HAQ-DI
function renderHaqdi(haqdi, patient, can) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="px-6 py-4 border-b font-medium flex items-center justify-between">
        <span>Recent HAQ-DI</span>
        {can.calcs?.edit && (
          <Link className="text-blue-700 underline text-sm" href={route("doctor.patients.calculators.haqdi", patient.id)}>
            New HAQ-DI
          </Link>
        )}
      </div>
      <div className="p-6">
        <ul className="space-y-3">
          {haqdi.map((h) => {
            const score = Number(h.score);
            const scoreStr = Number.isFinite(score) ? score.toFixed(2) : h.score ?? "-";
            const when = h.assessed_at ? new Date(h.assessed_at).toLocaleString() : "";

            return (
              <li key={h.id} className="rounded border p-3 flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">Score {scoreStr}</div>
                  {when && <div className="text-gray-700">{when}</div>}
                </div>

                {can.calcs?.edit && (
                  <div className="flex items-center gap-3 text-xs">
                    <Link
                      className="text-indigo-700 underline"
                      href={route("doctor.patients.calculators.haqdi.edit", [patient.id, h.id])}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="text-rose-700 underline"
                      onClick={() => {
                        if (confirm("Delete this HAQ-DI?")) {
                          router.delete(route("doctor.patients.calculators.haqdi.destroy", [patient.id, h.id]), {
                            preserveScroll: true,
                          });
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// 7) DAPSA
function renderDapsa(dapsa, patient, can) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="px-6 py-4 border-b font-medium flex items-center justify-between">
        <span>Recent DAPSA</span>
        {can.calcs?.edit && (
          <Link className="text-blue-700 underline text-sm" href={route("doctor.patients.calculators.dapsa", patient.id)}>
            New DAPSA
          </Link>
        )}
      </div>
      <div className="p-6">
        <ul className="space-y-3">
          {dapsa.map((d) => {
            const score = Number(d.score);
            const scoreStr = Number.isFinite(score) ? score.toFixed(1) : d.score ?? "-";
            const when = d.assessed_at ? new Date(d.assessed_at).toLocaleString() : "";

            return (
              <li key={d.id} className="rounded border p-3 flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">Score {scoreStr}</div>
                  <div className="text-gray-700">
                    TJC68 {d.tjc68} · SJC66 {d.sjc66} · Pt Global {d.pt_global} · Pain VAS {d.pain} · CRP {d.crp}
                    {when && <> · {when}</>}
                  </div>
                </div>

                {can.calcs?.edit && (
                  <div className="flex items-center gap-3 text-xs">
                    <Link
                      className="text-indigo-700 underline"
                      href={route("doctor.patients.calculators.dapsa.edit", [patient.id, d.id])}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="text-rose-700 underline"
                      onClick={() => {
                        if (confirm("Delete this DAPSA?")) {
                          router.delete(route("doctor.patients.calculators.dapsa.destroy", [patient.id, d.id]), {
                            preserveScroll: true,
                          });
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// 8) VAS
function renderVas(vas, patient, can) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="px-6 py-4 border-b font-medium flex items-center justify-between">
        <span>Recent VAS (0–100)</span>
        {can.calcs?.edit && (
          <Link className="text-blue-700 underline text-sm" href={route("doctor.patients.calculators.vas", patient.id)}>
            New VAS
          </Link>
        )}
      </div>
      <div className="p-6">
        <ul className="space-y-3">
          {vas.map((v) => {
            const value = Number(v.value);
            const valueStr = Number.isFinite(value) ? value.toFixed(0) : v.value ?? "-";
            const when = v.assessed_at ? new Date(v.assessed_at).toLocaleString() : "";
            const label = v.label || "Global health";

            return (
              <li key={v.id} className="rounded border p-3 flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">
                    {label}: {valueStr}/100
                  </div>
                  {when && <div className="text-gray-700">{when}</div>}
                </div>

                {can.calcs?.edit && (
                  <div className="flex items-center gap-3 text-xs">
                    <Link
                      className="text-indigo-700 underline"
                      href={route("doctor.patients.calculators.vas.edit", [patient.id, v.id])}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="text-rose-700 underline"
                      onClick={() => {
                        if (confirm("Delete this VAS entry?")) {
                          router.delete(route("doctor.patients.calculators.vas.destroy", [patient.id, v.id]), {
                            preserveScroll: true,
                          });
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// 9) BMI
function renderBmi(bmi, patient, can) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="px-6 py-4 border-b font-medium flex items-center justify-between">
        <span>Recent BMI</span>
        {can.calcs?.edit && (
          <Link className="text-blue-700 underline text-sm" href={route("doctor.patients.calculators.bmi", patient.id)}>
            New BMI
          </Link>
        )}
      </div>
      <div className="p-6">
        <ul className="space-y-3">
          {bmi.map((b) => {
            const w = b.weight_kg ?? b.weight ?? null;
            const h = b.height_m ?? b.height ?? null;
            const bmiVal = Number(b.bmi);
            const bmiStr = Number.isFinite(bmiVal) ? bmiVal.toFixed(1) : b.bmi ?? "-";
            const when = b.assessed_at ? new Date(b.assessed_at).toLocaleString() : "";
            const band = b.band ?? "-";

            return (
              <li key={b.id} className="rounded border p-3 flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">
                    BMI {bmiStr} {band !== "-" && <>· {band}</>}
                  </div>
                  <div className="text-gray-700">
                    {w != null && <>Wt {w} kg</>} {h != null && <>· Ht {h} m</>} {when && <>· {when}</>}
                  </div>
                </div>

                {can.calcs?.edit && (
                  <div className="flex items-center gap-3 text-xs">
                    <Link
                      className="text-indigo-700 underline"
                      href={route("doctor.patients.calculators.bmi.edit", [patient.id, b.id])}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="text-rose-700 underline"
                      onClick={() => {
                        if (confirm("Delete this BMI entry?")) {
                          router.delete(route("doctor.patients.calculators.bmi.destroy", [patient.id, b.id]), {
                            preserveScroll: true,
                          });
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// 10) EULAR
function renderEular(eular, patient, can) {
  return (
    <div className="bg-white rounded-xl shadow">
      <div className="px-6 py-4 border-b font-medium flex items-center justify-between">
        <span>Recent EULAR Response</span>
        {can.calcs?.edit && (
          <Link className="text-blue-700 underline text-sm" href={route("doctor.patients.calculators.eular_resp", patient.id)}>
            New EULAR
          </Link>
        )}
      </div>
      <div className="p-6">
        <ul className="space-y-3">
          {eular.map((e) => {
            const base = Number(e.baseline_das28);
            const foll = e.current_das28 != null ? Number(e.current_das28) : Number(e.current_das28);
            const delta = e.delta != null ? Number(e.delta) : (Number.isFinite(base) && Number.isFinite(foll) ? base - foll : null);
            const baseStr = Number.isFinite(base) ? base.toFixed(2) : e.baseline_das28 ?? "-";
            const follStr = Number.isFinite(foll) ? foll.toFixed(2) : (e.current_das28 ?? e.current_das28 ?? "-");
            const deltaStr = Number.isFinite(delta) ? delta.toFixed(2) : "—";
            const when = e.assessed_at ? new Date(e.assessed_at).toLocaleString() : "";
            const resp = e.response ?? "-";

            return (
              <li key={e.id} className="rounded border p-3 flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">Response: {resp}</div>
                  <div className="text-gray-700">
                    Baseline {baseStr} · Follow-up {follStr} · Δ {deltaStr}
                    {when && <> · {when}</>}
                  </div>
                </div>

                {can.calcs?.edit && (
                  <div className="flex items-center gap-3 text-xs">
                    <Link
                      className="text-indigo-700 underline"
                      href={route("doctor.patients.calculators.eular_resp.edit", [patient.id, e.id])}
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="text-rose-700 underline"
                      onClick={() => {
                        if (confirm("Delete this EULAR response?")) {
                          router.delete(route("doctor.patients.calculators.eular_resp.destroy", [patient.id, e.id]), {
                            preserveScroll: true,
                          });
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
