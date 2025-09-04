import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppShell from "@/components/app-shell";

export default function Index() {
  const { patient, orders, sidebar } = usePage().props;
  return (
    <AppShell sidebarExtras={sidebar}>
      <Head title={`Lab Orders • ${patient.name}`} />
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Lab Orders • {patient.name}</h1>
          <Link href={route('doctor.patients.lab-orders.create', patient.id)} className="rounded bg-indigo-600 px-3 py-2 text-white">+ New Lab Order</Link>
        </div>

        <div className="mt-4 space-y-4">
          {orders.map(o => (
            <div key={o.id} className="border rounded-lg bg-white p-4">
              <div className="text-sm text-gray-600">
                Ordered: {new Date(o.ordered_at).toLocaleString()} • Status: <span className="font-medium">{o.status}</span>
              </div>
              <ul className="mt-2 text-sm">
                {o.items.map(it => (
                  <li key={it.id} className="flex items-center justify-between border-t py-1">
                    <span>{it.test.code} — {it.test.name}</span>
                    <div className="flex gap-2">
                      {it.result ? (
                        <Link className="text-indigo-600 underline"
                          href={route('doctor.patients.lab-results.edit', [patient.id, o.id, it.id])}>
                          Edit Result
                        </Link>
                      ) : (
                        <Link className="text-indigo-600 underline"
                          href={route('doctor.patients.lab-results.create', [patient.id, o.id, it.id])}>
                          Add Result
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex gap-2">
                <Link className="text-sm underline" href={route('doctor.patients.lab-orders.edit', [patient.id, o.id])}>Edit Order</Link>
                <Link className="text-sm underline text-red-600" as="button" method="delete"
                      href={route('doctor.patients.lab-orders.destroy', [patient.id, o.id])}>Delete</Link>
              </div>
            </div>
          ))}
          {orders.length === 0 && <div className="text-sm text-gray-500">No lab orders.</div>}
        </div>
      </div>
    </AppShell>
  );
}
