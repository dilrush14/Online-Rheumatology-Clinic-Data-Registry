import React from "react";
import { useForm, Link, usePage } from "@inertiajs/react";
import { route } from 'ziggy-js';
import AppShell from "@/components/app-shell";
import IcdMultiSelect from "@/components/IcdMultiSelect";

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
    {children}
  </label>
);

const Input = ({ id, type = "text", ...props }) => (
  <input
    id={id}
    type={type}
    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    {...props}
  />
);

const Textarea = ({ id, rows = 4, ...props }) => (
  <textarea
    id={id}
    rows={rows}
    className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    {...props}
  />
);

const ErrorText = ({ children }) => (children ? <p className="mt-1 text-xs text-red-600">{children}</p> : null);

export default function CreateVisit() {
  const { patient, defaults } = usePage().props;

// UTC—can be yesterday locally //  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    const today = d.toISOString().slice(0, 10); // now “local” date

  const { data, setData, post, processing, errors } = useForm({
    visit_date: defaults?.visit_date || "",
    complaints: [],                // [{code,title}]
    provisional_diagnoses: [],     // [{code,title}]
    history: "",
    vitals: {
      height_cm: "",
      weight_kg: "",
      bp: "",
      pulse_bpm: "",
      temp_c: "",
    },
    plan: "",
    notes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Front-end guard (backend also validates)
    if (data.visit_date && data.visit_date > today) {
      alert("Visit date cannot be in the future.");
      return;
    }
    post(route("doctor.patients.visits.store", patient.id), {
      preserveScroll: true,
      onSuccess: () => {
        // After save, go to Patient Overview
        window.location.assign(route("doctor.patients.overview", patient.id));
      },
    });
  };

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">New Clinic Visit</h1>
            <p className="mt-1 text-sm text-gray-600">
              {patient.name} &middot; {patient.national_id} &middot; {patient.gender} &middot;{" "}
              {patient.age ?? "—"} yrs
            </p>
          </div>
          <Link
            href={route("doctor.patients.overview", patient.id)}
            className="text-sm text-indigo-600 hover:underline"
          >
            Back to Overview
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-8">
          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-medium mb-4">Visit Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="visit_date">Visit Date *</Label>
                <Input
                  id="visit_date"
                  type="date"
                  value={data.visit_date}
                  onChange={(e) => setData("visit_date", e.target.value)}
                  max={today} // ⛔ future dates
                />
                <ErrorText>{errors.visit_date}</ErrorText>
              </div>

              <div className="md:col-span-3">
                <Label>Chief Complaints *</Label>
                <IcdMultiSelect
                  category="complaint"
                  value={data.complaints}
                  onChange={(arr) => setData("complaints", arr)}
                  placeholder="Search and select one or more ICD‑11 complaints…"
                />
                <ErrorText>{errors.complaints}</ErrorText>
              </div>

              <div className="md:col-span-3">
                <Label>History of Presenting Complaint</Label>
                <Textarea
                  id="history"
                  rows={5}
                  placeholder="Onset, duration, pattern, relieving/exacerbating factors, red flags, past treatment, relevant PMH/FH/SH…"
                  value={data.history}
                  onChange={(e) => setData("history", e.target.value)}
                />
                <ErrorText>{errors.history}</ErrorText>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-medium mb-4">Assessment & Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Provisional Diagnosis (ICD‑11)</Label>
                <IcdMultiSelect
                  category="diagnosis"
                  value={data.provisional_diagnoses}
                  onChange={(arr) => setData("provisional_diagnoses", arr)}
                  placeholder="Search and select one or more ICD‑11 diagnoses…"
                />
                <ErrorText>{errors.provisional_diagnoses}</ErrorText>
              </div>
              <div>
                <Label htmlFor="plan">Plan</Label>
                <Textarea
                  id="plan"
                  rows={4}
                  placeholder="Labs/imaging, medications, counseling, referrals, follow‑up…"
                  value={data.plan}
                  onChange={(e) => setData("plan", e.target.value)}
                />
                <ErrorText>{errors.plan}</ErrorText>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" rows={4} value={data.notes} onChange={(e) => setData("notes", e.target.value)} />
                <ErrorText>{errors.notes}</ErrorText>
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={processing}
              className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-2.5 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              {processing ? "Saving…" : "Save Visit"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
