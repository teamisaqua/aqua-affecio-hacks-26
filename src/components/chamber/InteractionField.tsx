'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export type InteractionFieldSignalState =
  | 'waiting'
  | 'selecting'
  | 'diverging'
  | 'synchronizing'
  | 'collaborating'
  | 'completing'
  // Backward compatibility aliases
  | 'idle'
  | 'connecting'
  | 'active'
  | 'synchronized'
  | 'equilibrium';

interface InteractionFieldProps {
  state?: InteractionFieldSignalState;
  participantAName?: string;
  participantBName?: string;
  participantARole?: string;
  participantBRole?: string;
  participantAStatus?: string;
  participantBStatus?: string;
  activeRole?: 'explore' | 'control' | 'observer' | 'operator' | null;
  statusMessage?: string;
  metricLabel?: string;
  interactive?: boolean;
  variant?: 'hero' | 'chamber' | 'compact';
  className?: string;
}

export const InteractionField: React.FC<InteractionFieldProps> = ({
  state = 'waiting',
  participantAName = 'You',
  participantBName = 'Partner',
  participantARole = 'Explore',
  participantBRole = 'Control',
  participantAStatus,
  participantBStatus,
  activeRole = null,
  statusMessage,
  metricLabel,
  interactive = true,
  variant = 'hero',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [phase, setPhase] = useState(0);

  // Normalize state alias
  const normalizedState: 'waiting' | 'selecting' | 'diverging' | 'synchronizing' | 'collaborating' | 'completing' =
    state === 'idle' || state === 'connecting'
      ? 'waiting'
      : state === 'active'
      ? 'selecting'
      : state === 'synchronized'
      ? 'synchronizing'
      : state === 'equilibrium'
      ? 'completing'
      : state;

  // Real-time carrier wave animation loop with state-specific harmonic velocity
  useEffect(() => {
    let animId: number;
    let currentPhase = 0;

    const getSpeed = () => {
      switch (normalizedState) {
        case 'waiting':
          return 0.025; // Gentle ambient baseline
        case 'selecting':
          return 0.06; // Active input excitation
        case 'diverging':
          return 0.04; // Out-of-phase tension speed
        case 'synchronizing':
          return 0.05; // Coherent harmonic flow
        case 'collaborating':
          return 0.075; // Active joint manipulation speed
        case 'completing':
          return 0.025; // Calm standing wave
      }
    };

    const animate = () => {
      currentPhase += getSpeed();
      setPhase(currentPhase);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [normalizedState]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMouseOffset({ x: Math.max(-1, Math.min(1, x)) * 10, y: Math.max(-1, Math.min(1, y)) * 8 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Dimensions for central wave container
  const svgWidth = 260;
  const svgHeight = 44;
  const startX = 6;
  const endX = svgWidth - 6;
  const midY = svgHeight / 2 + mouseOffset.y * 0.2;

  // Visual Styling per State with defined palette tokens
  const stateConfig = {
    waiting: {
      color: 'rgba(245, 245, 247, 0.35)',
      glow: 'none',
      badgeBg: 'bg-white/5',
      badgeText: 'text-[#A1A1AA]',
      badgeBorder: 'border-white/10',
      label: 'CHAMBER ONLINE',
      subtext: statusMessage || 'Awaiting participant readiness',
      detail: 'Channel Connected',
      nodeAColor: 'border-white/20',
      nodeBColor: 'border-white/20',
    },
    selecting: {
      color: '#38BDF8', // Electric Blue
      glow: 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.4))',
      badgeBg: 'bg-[#38BDF8]/10',
      badgeText: 'text-[#38BDF8]',
      badgeBorder: 'border-[#38BDF8]/30',
      label: 'CHOICE IN PROGRESS',
      subtext: statusMessage || `${activeRole === 'control' ? participantBName : participantAName} selecting`,
      detail: 'Input Active',
      nodeAColor: activeRole === 'explore' ? 'border-[#38BDF8] shadow-[0_0_10px_rgba(56,189,248,0.35)]' : 'border-white/30',
      nodeBColor: activeRole === 'control' ? 'border-[#38BDF8] shadow-[0_0_10px_rgba(56,189,248,0.35)]' : 'border-white/30',
    },
    diverging: {
      color: '#FB7185', // Warm Coral
      glow: 'drop-shadow(0 0 8px rgba(251, 113, 133, 0.35))',
      badgeBg: 'bg-[#FB7185]/10',
      badgeText: 'text-[#FB7185]',
      badgeBorder: 'border-[#FB7185]/30',
      label: 'DISTINCT CHOICES',
      subtext: statusMessage || 'Contrasting viewpoints selected',
      detail: 'Phase Split',
      nodeAColor: 'border-[#FB7185]/80 shadow-[0_0_8px_rgba(251,113,133,0.25)]',
      nodeBColor: 'border-[#FB7185]/80 shadow-[0_0_8px_rgba(251,113,133,0.25)]',
    },
    synchronizing: {
      color: '#4ADE80', // Success Green
      glow: 'drop-shadow(0 0 8px rgba(74, 222, 128, 0.4))',
      badgeBg: 'bg-[#4ADE80]/10',
      badgeText: 'text-[#4ADE80]',
      badgeBorder: 'border-[#4ADE80]/30',
      label: 'CONSENSUS MATCH',
      subtext: statusMessage || 'Both choices aligned',
      detail: 'Resonant Lock',
      nodeAColor: 'border-[#4ADE80] shadow-[0_0_10px_rgba(74,222,128,0.3)]',
      nodeBColor: 'border-[#4ADE80] shadow-[0_0_10px_rgba(74,222,128,0.3)]',
    },
    collaborating: {
      color: '#A78BFA', // Soft Lavender
      glow: 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.4))',
      badgeBg: 'bg-[#A78BFA]/10',
      badgeText: 'text-[#A78BFA]',
      badgeBorder: 'border-[#A78BFA]/30',
      label: 'RECIPROCAL STEERING',
      subtext: statusMessage || 'Balancing temperature & pressure controls',
      detail: 'Live Adjustment',
      nodeAColor: 'border-[#38BDF8]',
      nodeBColor: 'border-[#A78BFA]',
    },
    completing: {
      color: '#38BDF8', // Electric Blue
      glow: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.45))',
      badgeBg: 'bg-[#38BDF8]/10',
      badgeText: 'text-[#38BDF8]',
      badgeBorder: 'border-[#38BDF8]/30',
      label: 'EQUILIBRIUM ACHIEVED',
      subtext: statusMessage || 'Stage complete · Results recorded',
      detail: 'Verified Hold',
      nodeAColor: 'border-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.35)]',
      nodeBColor: 'border-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.35)]',
    },
  }[normalizedState];

  // Mathematical wave generation with windowing envelope
  const points = 28;
  let primaryPath = `M ${startX} ${midY}`;
  let secondaryPath = `M ${startX} ${midY}`;

  const baseAmp =
    normalizedState === 'waiting'
      ? 4
      : normalizedState === 'selecting'
      ? 9
      : normalizedState === 'diverging'
      ? 11
      : normalizedState === 'synchronizing'
      ? 6
      : normalizedState === 'collaborating'
      ? 9
      : 3;

  for (let i = 1; i <= points; i++) {
    const t = i / points;
    const x = startX + t * (endX - startX);
    const envelope = Math.sin(t * Math.PI);

    if (normalizedState === 'diverging') {
      const y1 = midY + Math.sin(t * Math.PI * 4 + phase) * baseAmp * envelope;
      const y2 = midY + Math.sin(t * Math.PI * 4 - phase + Math.PI) * (baseAmp * 0.85) * envelope;
      primaryPath += ` L ${x.toFixed(1)} ${y1.toFixed(1)}`;
      secondaryPath += ` L ${x.toFixed(1)} ${y2.toFixed(1)}`;
    } else if (normalizedState === 'collaborating') {
      const y1 = midY + Math.sin(t * Math.PI * 3 + phase) * baseAmp * envelope;
      const y2 = midY + Math.sin(t * Math.PI * 5 - phase * 0.7) * (baseAmp * 0.6) * envelope;
      primaryPath += ` L ${x.toFixed(1)} ${y1.toFixed(1)}`;
      secondaryPath += ` L ${x.toFixed(1)} ${y2.toFixed(1)}`;
    } else {
      const harmonics = normalizedState === 'selecting' ? 4 : 2.5;
      const y = midY + Math.sin(t * Math.PI * harmonics + phase) * baseAmp * envelope;
      primaryPath += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  }

  // Format initials for circular avatar (e.g. "Alex" -> "AL", "Taylor" -> "TA")
  const getInitials = (nameStr: string) => {
    const trimmed = nameStr.trim();
    if (!trimmed) return 'US';
    const parts = trimmed.split(/\s+/);
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return trimmed.slice(0, 2).toUpperCase();
  };

  // Format clean role label (e.g. "You · Explore" -> "EXPLORE", "Taylor · Simulated" -> "SIMULATED")
  const formatRoleLabel = (roleStr?: string, fallback = 'PARTICIPANT') => {
    if (!roleStr) return fallback;
    const parts = roleStr.split('·');
    const lastPart = parts[parts.length - 1].trim();
    return lastPart.toUpperCase();
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`w-full max-w-3xl mx-auto p-3.5 sm:p-5 rounded-2xl bg-[#111114] border border-white/10 relative select-none transition-all shadow-md ${className}`}
    >
      {/* 3-Column Balanced CSS Grid Layout */}
      <div className="grid grid-cols-[minmax(72px,1fr)_minmax(140px,2fr)_minmax(72px,1fr)] sm:grid-cols-[minmax(100px,1fr)_minmax(220px,2fr)_minmax(100px,1fr)] items-center gap-1.5 sm:gap-4 w-full">
        {/* Left Column: Participant A (First Participant) */}
        <div className="flex flex-col items-center text-center space-y-1 min-w-0">
          {/* Circular Avatar */}
          <motion.div
            animate={{
              scale: activeRole === 'explore' || normalizedState === 'selecting' ? [1, 1.05, 1] : 1,
            }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#18181D] border-2 ${stateConfig.nodeAColor} flex items-center justify-center text-[#F5F5F7] relative transition-all duration-300 shadow-sm shrink-0`}
          >
            <span className="text-xs sm:text-sm font-bold font-mono text-[#F5F5F7] tracking-wider">
              {getInitials(participantAName)}
            </span>
            {/* Status Dot */}
            <span
              className={`w-2.5 h-2.5 rounded-full absolute -top-0.5 -right-0.5 border-2 border-[#111114] ${
                normalizedState === 'diverging'
                  ? 'bg-[#FB7185]'
                  : normalizedState === 'synchronizing' || normalizedState === 'completing'
                  ? 'bg-[#4ADE80]'
                  : normalizedState === 'waiting'
                  ? 'bg-white/30'
                  : 'bg-[#38BDF8]'
              }`}
            />
          </motion.div>

          {/* Participant Name */}
          <div
            className="text-xs sm:text-sm font-semibold text-[#F5F5F7] tracking-tight break-words max-w-full overflow-hidden leading-tight pt-0.5"
            style={{ overflowWrap: 'anywhere' }}
          >
            {participantAName}
          </div>

          {/* Role Label */}
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA]">
            {formatRoleLabel(participantARole, 'EXPLORE')}
          </div>

          {/* Connection / Action Status Below Role */}
          <div className="text-[10px] sm:text-[11px] font-medium text-[#71717A] tracking-tight truncate max-w-full">
            {participantAStatus || (normalizedState === 'waiting' ? 'Waiting' : 'Connected')}
          </div>
        </div>

        {/* Center Column: Connection Visualization & Channel Status */}
        <div className="flex flex-col items-center justify-center text-center space-y-2 min-w-0 w-full px-1 sm:px-2">
          {/* Dedicated Waveform Container */}
          <div className="w-full h-11 sm:h-12 flex items-center justify-center relative overflow-hidden">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              style={{ filter: stateConfig.glow }}
            >
              {/* Center Baseline Guide Gridline */}
              <line
                x1={startX}
                y1={svgHeight / 2}
                x2={endX}
                y2={svgHeight / 2}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
                strokeDasharray="2 3"
              />

              {/* Out-of-phase secondary wave for diverging / collaborating */}
              {(normalizedState === 'diverging' || normalizedState === 'collaborating') && (
                <path
                  d={secondaryPath}
                  fill="none"
                  stroke={
                    normalizedState === 'diverging'
                      ? 'rgba(251, 113, 133, 0.45)'
                      : 'rgba(167, 139, 250, 0.45)'
                  }
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={normalizedState === 'diverging' ? '4 3' : undefined}
                />
              )}

              {/* Primary Signal Waveform */}
              <path
                d={primaryPath}
                fill="none"
                stroke={stateConfig.color}
                strokeWidth={
                  normalizedState === 'synchronizing' || normalizedState === 'completing'
                    ? '2.2'
                    : '1.75'
                }
                strokeLinecap="round"
              />

              {/* Center Status Node & Moving Signal Point */}
              {normalizedState === 'completing' ? (
                <g transform={`translate(${svgWidth / 2}, ${svgHeight / 2})`}>
                  <circle r="8" fill="none" stroke="#64D2FF" strokeWidth="1.5" className="animate-pulse" />
                  <circle r="3" fill="#34C759" />
                </g>
              ) : normalizedState === 'synchronizing' ? (
                <circle
                  cx={svgWidth / 2}
                  cy={svgHeight / 2}
                  r="4"
                  fill="#34C759"
                  className="animate-pulse shadow-lg"
                />
              ) : normalizedState === 'diverging' ? (
                <g transform={`translate(${svgWidth / 2}, ${svgHeight / 2})`}>
                  <line x1="-4" y1="-4" x2="4" y2="4" stroke="#FF9F0A" strokeWidth="1.5" />
                  <line x1="4" y1="-4" x2="-4" y2="4" stroke="#FF9F0A" strokeWidth="1.5" />
                </g>
              ) : (
                <circle
                  cx={svgWidth / 2}
                  cy={midY}
                  r="2.5"
                  fill="rgba(255, 255, 255, 0.6)"
                />
              )}
            </svg>
          </div>

          {/* Three Clearly Separated Status Elements */}
          <div className="flex flex-col items-center space-y-1 sm:space-y-1.5 mt-1 sm:mt-1.5 max-w-full">
            {/* First Line: Compact status badge (e.g. "CHAMBER ONLINE") */}
            <span
              className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-widest font-semibold border ${stateConfig.badgeBg} ${stateConfig.badgeText} ${stateConfig.badgeBorder}`}
            >
              {metricLabel || (normalizedState === 'waiting' ? 'CHAMBER ONLINE' : stateConfig.label)}
            </span>

            {/* Second Line: Channel state (e.g. "Channel Connected") */}
            <div className="text-[11px] font-mono font-medium text-[#F5F5F7] tracking-tight">
              {stateConfig.detail}
            </div>

            {/* Third Line: Short status message (e.g. "Awaiting participant readiness") */}
            <div className="text-[10px] sm:text-[11px] text-[#A1A1AA] leading-tight max-w-[240px] truncate sm:whitespace-normal">
              {statusMessage || stateConfig.subtext}
            </div>
          </div>
        </div>

        {/* Right Column: Participant B (Second Participant) */}
        <div className="flex flex-col items-center text-center space-y-1 min-w-0">
          {/* Circular Avatar */}
          <motion.div
            animate={{
              scale: activeRole === 'control' || normalizedState === 'selecting' ? [1, 1.05, 1] : 1,
            }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', delay: 0.2 }}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#18181D] border-2 ${stateConfig.nodeBColor} flex items-center justify-center text-[#F5F5F7] relative transition-all duration-300 shadow-sm shrink-0`}
          >
            <span className="text-xs sm:text-sm font-bold font-mono text-[#F5F5F7] tracking-wider">
              {getInitials(participantBName)}
            </span>
            {/* Status Dot */}
            <span
              className={`w-2.5 h-2.5 rounded-full absolute -top-0.5 -right-0.5 border-2 border-[#111114] ${
                normalizedState === 'diverging'
                  ? 'bg-[#FB7185]'
                  : normalizedState === 'synchronizing' || normalizedState === 'completing'
                  ? 'bg-[#4ADE80]'
                  : normalizedState === 'waiting'
                  ? 'bg-white/30'
                  : 'bg-[#38BDF8]'
              }`}
            />
          </motion.div>

          {/* Participant Name */}
          <div
            className="text-xs sm:text-sm font-semibold text-[#F5F5F7] tracking-tight break-words max-w-full overflow-hidden leading-tight pt-0.5"
            style={{ overflowWrap: 'anywhere' }}
          >
            {participantBName}
          </div>

          {/* Role Label */}
          <div className="text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA]">
            {formatRoleLabel(participantBRole, 'CONTROL')}
          </div>

          {/* Connection / Action Status Below Role */}
          <div className="text-[10px] sm:text-[11px] font-medium text-[#71717A] tracking-tight truncate max-w-full">
            {participantBStatus || (normalizedState === 'waiting' ? 'Waiting' : 'Connected')}
          </div>
        </div>
      </div>
    </div>
  );
};
