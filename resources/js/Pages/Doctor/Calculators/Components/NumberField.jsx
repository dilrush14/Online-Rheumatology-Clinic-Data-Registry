import React from 'react';
export default function NumberField({ label, value, onChange, min=0, step=1, placeholder, suffix }) {
  return (
    <div>
      <label className="block text-sm text-slate-600 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number" min={min} step={step} value={value ?? ''} placeholder={placeholder}
          onChange={(e)=>onChange(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-full rounded-lg border px-3 py-2"
        />
        {suffix ? <span className="text-sm text-slate-500">{suffix}</span> : null}
      </div>
    </div>
  );
}
