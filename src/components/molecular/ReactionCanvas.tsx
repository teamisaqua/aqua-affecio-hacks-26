'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export type ReactionFieldState =
  | 'idle'
  | 'lobby'
  | 'calibrating'
  | 'stabilized'
  | 'overheat'
  | 'success'
  | 'signature';

interface ReactionCanvasProps {
  state?: ReactionFieldState;
  stability?: number; // 0 to 100
  participantAName?: string;
  participantBName?: string;
  className?: string;
}

export const ReactionCanvas: React.FC<ReactionCanvasProps> = ({
  state = 'idle',
  stability = 0,
  participantAName = 'Alpha',
  participantBName = 'Beta',
  className = '',
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMousePos({ x: x * 12, y: y * 8 });
  };

  // Node spacing based on experiment phase
  const getDistance = () => {
    switch (state) {
      case 'idle':
        return 120; // Separated systems
      case 'lobby':
        return 90;  // Aware of each other
      case 'calibrating':
        return 70;  // Actively interacting
      case 'overheat':
        return 85;  // Erratic repulsion
      case 'stabilized':
        return 50;  // Shared orbital equilibrium
      case 'success':
      case 'signature':
        return 35;  // Covalent fusion
      default:
        return 100;
    }
  };

  const distance = getDistance();

  // Dynamic color palette per state
  const getCoreColor = (node: 'alpha' | 'beta') => {
    if (state === 'success' || state === 'signature') return '#34C759';
    if (state === 'stabilized') return '#2997FF';
    if (state === 'overheat') return '#FF9F0A';
    return node === 'alpha' ? '#2997FF' : '#38BDF8';
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`relative w-full h-64 md:h-80 flex items-center justify-center select-none overflow-hidden ${className}`}
      aria-label="Reaction State Visualization"
    >
      <svg
        className="w-full h-full max-w-lg mx-auto"
        viewBox="0 0 400 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle gradient for magnetic flux connection */}
          <linearGradient id="fluxGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getCoreColor('alpha')} stopOpacity={state === 'idle' ? '0.2' : '0.7'} />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity={state === 'stabilized' || state === 'success' ? '0.9' : '0.3'} />
            <stop offset="100%" stopColor={getCoreColor('beta')} stopOpacity={state === 'idle' ? '0.2' : '0.7'} />
          </linearGradient>

          {/* Core Glow Filter */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Grid Reticle for Instrument feel */}
        <g opacity="0.12" stroke="#FFFFFF" strokeWidth="0.5">
          <line x1="200" y1="20" x2="200" y2="220" strokeDasharray="2 4" />
          <line x1="40" y1="120" x2="360" y2="120" strokeDasharray="2 4" />
          <circle cx="200" cy="120" r="90" strokeDasharray="1 5" />
          <circle cx="200" cy="120" r="140" strokeDasharray="1 8" />
        </g>

        {/* Connecting Magnetic Flux / Orbital Bridges */}
        {state !== 'idle' && (
          <g>
            {/* Primary Covalent Bond Axis */}
            <motion.line
              x1={200 - distance + mousePos.x}
              y1={120 + mousePos.y}
              x2={200 + distance + mousePos.x}
              y2={120 + mousePos.y}
              stroke="url(#fluxGradient)"
              strokeWidth={state === 'stabilized' || state === 'success' ? '2.5' : '1.5'}
              strokeDasharray={state === 'calibrating' ? '4 3' : undefined}
              animate={state === 'calibrating' ? { strokeDashoffset: [0, -20] } : undefined}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            />

            {/* Elliptical Resonance Shell */}
            <motion.ellipse
              cx={200 + mousePos.x}
              cy={120 + mousePos.y}
              rx={distance * 1.25}
              ry={distance * 0.55}
              stroke="url(#fluxGradient)"
              strokeWidth="0.75"
              strokeDasharray="3 3"
              opacity={state === 'stabilized' || state === 'success' ? 0.7 : 0.35}
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            />
          </g>
        )}

        {/* NODE ALPHA (Participant A / Left) */}
        <g transform={`translate(${200 - distance + mousePos.x}, ${120 + mousePos.y})`}>
          {/* Orbital Shell 1 */}
          <motion.ellipse
            rx="34"
            ry="18"
            stroke={getCoreColor('alpha')}
            strokeWidth="0.75"
            strokeOpacity="0.4"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          />
          {/* Orbital Shell 2 */}
          <motion.ellipse
            rx="34"
            ry="18"
            stroke={getCoreColor('alpha')}
            strokeWidth="0.75"
            strokeOpacity="0.3"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
          />

          {/* Center Nucleus */}
          <circle cx="0" cy="0" r="9" fill="#1C1C1E" stroke={getCoreColor('alpha')} strokeWidth="2" filter="url(#softGlow)" />
          <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />

          {/* Node Alpha Label */}
          <text y="42" textAnchor="middle" fill="#A1A1A6" fontSize="9" letterSpacing="0.08em" fontFamily="monospace">
            {participantAName.toUpperCase()} [α]
          </text>
        </g>

        {/* NODE BETA (Participant B / Right) */}
        <g transform={`translate(${200 + distance + mousePos.x}, ${120 + mousePos.y})`}>
          {/* Orbital Shell 1 */}
          <motion.ellipse
            rx="34"
            ry="18"
            stroke={getCoreColor('beta')}
            strokeWidth="0.75"
            strokeOpacity="0.4"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}
          />
          {/* Orbital Shell 2 */}
          <motion.ellipse
            rx="34"
            ry="18"
            stroke={getCoreColor('beta')}
            strokeWidth="0.75"
            strokeOpacity="0.3"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
          />

          {/* Center Nucleus */}
          <circle cx="0" cy="0" r="9" fill="#1C1C1E" stroke={getCoreColor('beta')} strokeWidth="2" filter="url(#softGlow)" />
          <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />

          {/* Node Beta Label */}
          <text y="42" textAnchor="middle" fill="#A1A1A6" fontSize="9" letterSpacing="0.08em" fontFamily="monospace">
            {participantBName.toUpperCase()} [β]
          </text>
        </g>
      </svg>

      {/* State Telemetry Pill (Anchored at the bottom of the field) */}
      <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
        <div className="px-3 py-1 rounded-full bg-[#1C1C1E] border border-white/10 text-[11px] font-mono tracking-wider uppercase text-[#A1A1A6] flex items-center gap-2 shadow-sm">
          <span className={`w-1.5 h-1.5 rounded-full ${
            state === 'success' || state === 'signature'
              ? 'bg-apple-green'
              : state === 'stabilized'
              ? 'bg-apple-blue'
              : state === 'overheat'
              ? 'bg-apple-amber'
              : 'bg-white/40'
          }`} />
          <span>
            {state === 'idle'
              ? 'FIELD: STANDBY · 2 UNCOUPLED SYSTEMS'
              : state === 'lobby'
              ? 'FIELD: RESONANCE LINK ESTABLISHED'
              : state === 'calibrating'
              ? `CALIBRATION IN PROGRESS · STABILITY ${stability}%`
              : state === 'stabilized'
              ? 'FIELD: EQUILIBRIUM ACHIEVED'
              : state === 'overheat'
              ? 'WARNING: THERMAL SPIKE DETECTED'
              : 'REACTION SIGNATURE FORMED'}
          </span>
        </div>
      </div>
    </div>
  );
};
