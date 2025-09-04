import React from 'react';
export default function SliderField({ label, value=0, onChange, min=0, max=10, step=1, left='0', right='10' }) {
  return (
    <div>
      <label className="block text-sm text-slate-600 mb-1">{label}</label>
      <div className="flex items-center gap-3">
        <span className="text-xs">{left}</span>
        <input type="range" min={min} max={max} step={step} value={Number(value)||0}
               onChange={(e)=>onChange(Number(e.target.value))} className="w-full accent-blue-600" />
        <span className="text-xs">{right}</span>
      </div>
      <div className="mt-1 text-sm"><span className="font-medium">{Number(value)||0}</span> / {max}</div>
    </div>
  );
}
