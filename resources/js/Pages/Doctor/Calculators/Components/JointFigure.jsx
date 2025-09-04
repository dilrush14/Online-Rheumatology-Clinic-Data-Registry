import React from 'react';
import joinFigure from '@/assets/join-figure.png'; // ensure this file exists

// 300(w) x 400(h)
const JOINTS = [
  // Shoulders (2)
  { id: 'L_shoulder', label: 'Left Shoulder',  x: 110, y: 78 },
  { id: 'R_shoulder', label: 'Right Shoulder', x: 190, y: 78 },

  // Elbows (2)
  { id: 'L_elbow', label: 'Left Elbow',  x: 101, y: 127 },
  { id: 'R_elbow', label: 'Right Elbow', x: 199, y: 127 },

  // Wrists (2)
  { id: 'L_wrist', label: 'Left Wrist',  x: 82,  y: 172 },
  { id: 'R_wrist', label: 'Right Wrist', x: 218, y: 172 },

  // MCP 1–5 (Left hand; thumb→little)
  { id: 'L_MCP1', label: 'Left MCP1', x: 55, y: 187 },
  { id: 'L_MCP2', label: 'Left MCP2', x: 60, y: 196 },
  { id: 'L_MCP3', label: 'Left MCP3', x: 71, y: 201 },
  { id: 'L_MCP4', label: 'Left MCP4', x: 82, y: 204 },
  { id: 'L_MCP5', label: 'Left MCP5', x: 93, y: 203 },

  // MCP 1–5 (Right hand; thumb→little)
  { id: 'R_MCP1', label: 'Right MCP1', x: 245, y: 187 },
  { id: 'R_MCP2', label: 'Right MCP2', x: 240, y: 196 },
  { id: 'R_MCP3', label: 'Right MCP3', x: 229, y: 201 },
  { id: 'R_MCP4', label: 'Right MCP4', x: 218, y: 204 },
  { id: 'R_MCP5', label: 'Right MCP5', x: 207, y: 203 },

  // PIP 1–5 (Left hand; thumb→little)
  { id: 'L_PIP1', label: 'Left PIP1', x: 41, y: 200 },
  { id: 'L_PIP2', label: 'Left PIP2', x: 52, y: 215 },
  { id: 'L_PIP3', label: 'Left PIP3', x: 65, y: 222 },
  { id: 'L_PIP4', label: 'Left PIP4', x: 80, y: 224 },
  { id: 'L_PIP5', label: 'Left PIP5', x: 94, y: 218 },

  // PIP 1–5 (Right hand; thumb→little)
  { id: 'R_PIP1', label: 'Right PIP1', x: 260, y: 198 },
  { id: 'R_PIP2', label: 'Right PIP2', x: 248, y: 215 },
  { id: 'R_PIP3', label: 'Right PIP3', x: 235, y: 221 },
  { id: 'R_PIP4', label: 'Right PIP4', x: 220, y: 224 },
  { id: 'R_PIP5', label: 'Right PIP5', x: 206, y: 218 },

  // Knees (2)
  { id: 'L_knee', label: 'Left Knee',  x: 130, y: 273 },
  { id: 'R_knee', label: 'Right Knee', x: 171, y: 273 },
];

// Smaller dots for fingers; bigger for large joints
const radiusFor = (id) => (id.includes('MCP') || id.includes('PIP')) ? 5 : 6;

export default function JointFigure({ title, selected, onToggle }) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm bg-white select-none">
      <div className="mb-3 text-lg font-semibold">{title}</div>

      <svg viewBox="0 0 300 400" className="w-full max-w-[420px] mx-auto">
        {/* Background skeleton; no pointer events so clicks go to circles */}
        <image
          href={joinFigure}
          x="0"
          y="0"
          width="300"
          height="400"
          preserveAspectRatio="xMidYMid meet"
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        />

        {/* Overlay joints */}
        {JOINTS.map(j => {
          const isOn = selected.includes(j.id);
          const r = radiusFor(j.id);
          return (
            <g key={j.id} onClick={() => onToggle(j.id)} className="cursor-pointer">
              <circle cx={j.x} cy={j.y} r={r + 4} fill="transparent" stroke="transparent">
                <title>{j.label}</title>
              </circle>
              <circle
                cx={j.x}
                cy={j.y}
                r={r}
                fill={isOn ? '#2563eb' : '#ffffff'}
                stroke={isOn ? '#1d4ed8' : '#94a3b8'}
                strokeWidth="2"
              />
            </g>
          );
        })}
      </svg>

      <div className="mt-3 text-sm text-slate-600">
        Click joints to toggle. Count: <span className="font-semibold">{selected.length}</span>
      </div>
    </div>
  );
}
