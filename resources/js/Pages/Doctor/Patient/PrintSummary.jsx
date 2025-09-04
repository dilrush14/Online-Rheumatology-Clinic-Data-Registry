import React, { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export default function PrintSummary() {
  const { patient, visits } = usePage().props;

  useEffect(() => {
    // auto-open system print dialog
    setTimeout(() => window.print(), 300);
  }, []);

  return (
    <div className="p-6 print:p-0">
      <style>{`
        @media print {
          @page { size: A4; margin: 12mm; }
          .noprint { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>

      <div className="noprint mb-4">
        <button onClick={() => window.print()} className="rounded bg-indigo-600 px-3 py-2 text-white text-sm">Print</button>
      </div>

      <header className="mb-4">
        <h1 className="text-xl font-semibold">Patient Summary</h1>
        <div className="text-sm text-gray-700">
          <div><strong>Name:</strong> {patient.name}</div>
          <div><strong>NIC:</strong> {patient.national_id}</div>
          <div><strong>Sex/Age:</strong> {patient.gender} · {patient.age ?? '—'} yrs</div>
        </div>
      </header>

      <section>
        <h2 className="text-lg font-medium mb-2">Visits</h2>
        <div className="space-y-3">
          {visits.map((v) => {
            const complaints = Array.isArray(v.complaints) ? v.complaints : [];
            const pdx = Array.isArray(v.provisional_diagnoses) ? v.provisional_diagnoses : [];
            return (
              <div key={v.id} className="rounded border p-3">
                <div className="text-sm text-gray-600 mb-1">
                  <strong>Date:</strong> {new Date(v.visit_date).toLocaleDateString()}
                </div>
                {complaints.length > 0 && (
                  <div className="text-sm">
                    <strong>Complaints:</strong>{' '}
                    {complaints.map(c => `${c.code} — ${c.title}`).join(', ')}
                  </div>
                )}
                {pdx.length > 0 && (
                  <div className="text-sm">
                    <strong>Provisional Dx:</strong>{' '}
                    {pdx.map(c => `${c.code} — ${c.title}`).join(', ')}
                  </div>
                )}
                {v.plan && <div className="text-sm"><strong>Plan:</strong> {v.plan}</div>}
                {v.notes && <div className="text-sm"><strong>Notes:</strong> {v.notes}</div>}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
