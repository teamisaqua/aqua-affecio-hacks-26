'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export type ChamberSignalState =
  | 'idle'
  | 'connecting'
  | 'active'
  | 'synchronized'
  | 'equilibrium';

interface InteractionFieldProps {
  state?: ChamberSignalState;
  participantAName?: string;
  participantBName?: string;
  participantAStatus?: string;
  participantBStatus?: string;
  interactive?: boolean;
  className?: string;
}

export const InteractionField: React.FC<InteractionFieldProps> = ({
  state = 'idle',
  participantAName = 'You',
  participantBName = 'Partner',
  participantAStatus,
  participantBStatus,
  interactive = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [phase, setPhase] = useState(0);

  // Smooth harmonic carrier wave loop
  useEffect(() => {
    let animId: number;
    let currentPhase = 0;
    const speed = state === 'active' ? 0.08 : state === 'synchronized' ? 0.05 : 0.03;

    const animate = () => {
      currentPhase += speed;
      setPhase(currentPhase);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [state]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMouseOffset({ x: x * 15, y: y * 12 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Generate responsive harmonic SVG wave path connecting Left Node (x: 40) to Right Node (x: 280)
  const width = 320;
  const height = 120;
  const startX = 50;
  const endX = width - 50;
  const midY = height / 2 + mouseOffset.y * 0.4;

  const points = 24;
  let pathD = `M ${startX} ${midY}`;
  const amplitude =
    state === 'active' ? 14 :
    state === 'synchronized' ? 8 :
    state === 'equilibrium' ? 4 : 7;

  for (let i = 1; i <= points; i++) {
    const t = i / points;
    const x = startX + t * (endX - startX);
    // Sine wave modulation with envelope (tapered at ends)
    const envelope = Math.sin(t * Math.PI);
    const y = midY + Math.sin(t * Math.PI * 4 + phase) * amplitude * envelope;
    pathD += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`w-full max-w-lg mx-auto p-6 rounded-3xl bg-[#0C0C0E] border border-white/8 relative select-none transition-all ${className}`}
    >
      <div className="flex items-center justify-between relative z-10">
        {/* Node A (YOU) */}
        <div className="flex flex-col items-center space-y-2">
          <motion.div
            animate={{
              scale: state === 'active' ? [1, 1.06, 1] : 1,
              borderColor: state === 'synchronized' ? '#34C759' : '#2997FF',
            }}
            transition={{ repeat: state === 'active' ? Infinity : 0, duration: 2 }}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#141418] border-2 border-[#2997FF] flex items-center justify-center text-white shadow-lg relative"
          >
            <span className="text-xs font-semibold tracking-tight">{participantAName}</span>
            <span className="w-2 h-2 rounded-full bg-[#2997FF] absolute -top-0.5 -right-0.5" />
          </motion.div>
          {participantAStatus && (
            <span className="text-[11px] text-[#9E9EA7] font-medium tracking-tight">
              {participantAStatus}
            </span>
          )}
        </div>

        {/* Central Dynamic Interaction Field Display */}
        <div className="flex-1 px-2 flex flex-col items-center justify-center relative h-28">
          <svg
            className="w-full h-full overflow-visible"
            viewBox={`0 0 ${width} ${height}`}
          >
            {/* Guide Hairline */}
            <line
              x1={startX}
              y1={height / 2}
              x2={endX}
              y2={height / 2}
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth="1"
              strokeDasharray="2 3"
            />

            {/* Dynamic Signal Carrier Wave */}
            <path
              d={pathD}
              fill="none"
              stroke={
                state === 'synchronized'
                  ? '#34C759'
                  : state === 'equilibrium'
                  ? '#2997FF'
                  : 'rgba(255, 255, 255, 0.45)'
              }
              strokeWidth={state === 'synchronized' || state === 'equilibrium' ? '2' : '1.5'}
              strokeLinecap="round"
            />

            {/* Equilibrium Center Marker */}
            {state === 'equilibrium' ? (
              <circle
                cx={width / 2}
                cy={height / 2}
                r="10"
                fill="none"
                stroke="#34C759"
                strokeWidth="1.5"
                className="animate-pulse"
              />
            ) : (
              <circle
                cx={width / 2}
                cy={midY}
                r="3"
                fill="#2997FF"
                opacity="0.8"
              />
            )}
          </svg>

          {/* Signal State Label */}
          <div className="text-[10px] uppercase tracking-widest text-[#62626B] font-medium -mt-2">
            {state === 'synchronized' ? (
              <span className="text-apple-green font-semibold">Resonance locked</span>
            ) : state === 'equilibrium' ? (
              <span className="text-apple-blue font-semibold">Equilibrium stable</span>
            ) : state === 'active' ? (
              <span>Signal active</span>
            ) : (
              <span>Interaction field</span>
            )}
          </div>
        </div>

        {/* Node B (PARTNER) */}
        <div className="flex flex-col items-center space-y-2">
          <motion.div
            animate={{
              scale: state === 'active' ? [1, 1.06, 1] : 1,
              borderColor: state === 'synchronized' ? '#34C759' : '#FFFFFF',
            }}
            transition={{ repeat: state === 'active' ? Infinity : 0, duration: 2, delay: 0.3 }}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#141418] border-2 border-white/40 flex items-center justify-center text-white shadow-lg relative"
          >
            <span className="text-xs font-semibold tracking-tight">{participantBName}</span>
            <span className="w-2 h-2 rounded-full bg-apple-green absolute -top-0.5 -right-0.5" />
          </motion.div>
          {participantBStatus && (
            <span className="text-[11px] text-[#9E9EA7] font-medium tracking-tight">
              {participantBStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
