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
  coherence?: number; // 0 - 100
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
  coherence,
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
          return 0.065; // Higher frequency excitation
        case 'diverging':
          return 0.045; // Dissonant tension speed
        case 'synchronizing':
          return 0.055; // Coherent resonant flow
        case 'collaborating':
          return 0.08; // High active interaction velocity
        case 'completing':
          return 0.03; // Serene quiet standing wave
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
    setMouseOffset({ x: Math.max(-1, Math.min(1, x)) * 14, y: Math.max(-1, Math.min(1, y)) * 10 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  // Canvas / SVG Dimensions
  const isCompact = variant === 'compact';
  const isChamber = variant === 'chamber';
  const width = isCompact ? 280 : isChamber ? 380 : 340;
  const height = isCompact ? 60 : isChamber ? 72 : 96;
  const startX = 40;
  const endX = width - 40;
  const midY = height / 2 + mouseOffset.y * 0.35;

  // Color & Visual Styling per State (strictly Apple HIG palette)
  const stateConfig = {
    waiting: {
      color: 'rgba(255, 255, 255, 0.35)',
      glow: 'none',
      badgeBg: 'bg-white/5',
      badgeText: 'text-[#86868B]',
      label: 'AWAITING RESONANCE',
      subtext: statusMessage || 'Both nodes in ground state',
      nodeAColor: 'border-white/20',
      nodeBColor: 'border-white/20',
    },
    selecting: {
      color: '#2997FF', // Apple Blue
      glow: 'drop-shadow(0 0 6px rgba(41, 151, 255, 0.4))',
      badgeBg: 'bg-[#2997FF]/10',
      badgeText: 'text-[#2997FF]',
      label: 'SIGNAL EXCITATION',
      subtext: statusMessage || `${activeRole === 'control' ? participantBName : participantAName} selecting instinct`,
      nodeAColor: activeRole === 'explore' ? 'border-[#2997FF] shadow-[0_0_12px_rgba(41,151,255,0.4)]' : 'border-white/30',
      nodeBColor: activeRole === 'control' ? 'border-[#2997FF] shadow-[0_0_12px_rgba(41,151,255,0.4)]' : 'border-white/30',
    },
    diverging: {
      // Dissonance / phase offset: restrained warm amber (contrast without neon red)
      color: '#FF9F0A', // Apple Amber
      glow: 'drop-shadow(0 0 6px rgba(255, 159, 10, 0.35))',
      badgeBg: 'bg-[#FF9F0A]/10',
      badgeText: 'text-[#FF9F0A]',
      label: 'PHASE OFFSET DETECTED',
      subtext: statusMessage || 'Divergent polarity · Complementary instincts',
      nodeAColor: 'border-[#FF9F0A]/80 shadow-[0_0_8px_rgba(255,159,10,0.3)]',
      nodeBColor: 'border-[#FF9F0A]/80 shadow-[0_0_8px_rgba(255,159,10,0.3)]',
    },
    synchronizing: {
      color: '#34C759', // Apple Green
      glow: 'drop-shadow(0 0 8px rgba(52, 199, 89, 0.45))',
      badgeBg: 'bg-[#34C759]/10',
      badgeText: 'text-[#34C759]',
      label: 'HARMONIC LOCK',
      subtext: statusMessage || 'Constructive interference · Resonance 92%',
      nodeAColor: 'border-[#34C759] shadow-[0_0_12px_rgba(52,199,89,0.35)]',
      nodeBColor: 'border-[#34C759] shadow-[0_0_12px_rgba(52,199,89,0.35)]',
    },
    collaborating: {
      color: '#30D158', // Apple Mint/Cyan
      glow: 'drop-shadow(0 0 7px rgba(48, 209, 88, 0.4))',
      badgeBg: 'bg-[#30D158]/10',
      badgeText: 'text-[#30D158]',
      label: 'CO-EQUILIBRIUM FLUX',
      subtext: statusMessage || 'Reciprocal adjustment active',
      nodeAColor: 'border-[#2997FF]',
      nodeBColor: 'border-[#30D158]',
    },
    completing: {
      color: '#64D2FF', // Apple Cyan
      glow: 'drop-shadow(0 0 10px rgba(100, 210, 255, 0.5))',
      badgeBg: 'bg-[#64D2FF]/10',
      badgeText: 'text-[#64D2FF]',
      label: 'EQUILIBRIUM ACHIEVED',
      subtext: statusMessage || 'Field convergence stabilized',
      nodeAColor: 'border-[#64D2FF] shadow-[0_0_14px_rgba(100,210,255,0.4)]',
      nodeBColor: 'border-[#64D2FF] shadow-[0_0_14px_rgba(100,210,255,0.4)]',
    },
  }[normalizedState];

  // Construct mathematical wave path
  const points = 32;
  let primaryPath = `M ${startX} ${midY}`;
  let secondaryPath = `M ${startX} ${midY}`;

  // Amplitudes
  const baseAmp =
    normalizedState === 'waiting'
      ? 5
      : normalizedState === 'selecting'
      ? 11
      : normalizedState === 'diverging'
      ? 14
      : normalizedState === 'synchronizing'
      ? 7
      : normalizedState === 'collaborating'
      ? 12
      : 3;

  for (let i = 1; i <= points; i++) {
    const t = i / points;
    const x = startX + t * (endX - startX);
    const envelope = Math.sin(t * Math.PI); // Windowing envelope so wave tapers to zero at both node anchors

    if (normalizedState === 'diverging') {
      // Destructive interference: Primary wave and opposing secondary wave with 180° phase dissonance
      const y1 = midY + Math.sin(t * Math.PI * 4 + phase) * baseAmp * envelope;
      const y2 = midY + Math.sin(t * Math.PI * 4 - phase + Math.PI) * (baseAmp * 0.85) * envelope;
      primaryPath += ` L ${x.toFixed(1)} ${y1.toFixed(1)}`;
      secondaryPath += ` L ${x.toFixed(1)} ${y2.toFixed(1)}`;
    } else if (normalizedState === 'collaborating') {
      // Dual harmonic carrier lines representing bidirectional steering
      const y1 = midY + Math.sin(t * Math.PI * 3 + phase) * baseAmp * envelope;
      const y2 = midY + Math.sin(t * Math.PI * 5 - phase * 0.7) * (baseAmp * 0.6) * envelope;
      primaryPath += ` L ${x.toFixed(1)} ${y1.toFixed(1)}`;
      secondaryPath += ` L ${x.toFixed(1)} ${y2.toFixed(1)}`;
    } else {
      // Coherent harmonic standing wave
      const harmonics = normalizedState === 'selecting' ? 5 : 3;
      const y = midY + Math.sin(t * Math.PI * harmonics + phase) * baseAmp * envelope;
      primaryPath += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  }

  // Calculated coherence percentage if not provided
  const displayCoherence =
    typeof coherence === 'number'
      ? coherence
      : normalizedState === 'synchronizing'
      ? 94
      : normalizedState === 'completing'
      ? 98
      : normalizedState === 'collaborating'
      ? 86
      : normalizedState === 'selecting'
      ? 74
      : normalizedState === 'diverging'
      ? 58
      : 50;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`w-full ${
        isChamber ? 'max-w-xl' : 'max-w-md sm:max-w-lg'
      } mx-auto p-4 sm:p-5 rounded-2xl bg-[#0D0D10] border border-white/8 relative select-none transition-all ${className}`}
    >
      <div className="flex items-center justify-between relative z-10 gap-2 sm:gap-4">
        {/* Node A (YOU / Explore) */}
        <div className="flex flex-col items-center space-y-1.5 flex-shrink-0">
          <motion.div
            animate={{
              scale: activeRole === 'explore' || normalizedState === 'selecting' ? [1, 1.05, 1] : 1,
            }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#16161A] border-2 ${stateConfig.nodeAColor} flex flex-col items-center justify-center text-white relative transition-all duration-300`}
          >
            <span className="text-[11px] font-semibold tracking-tight">{participantAName}</span>
            <span className="text-[8px] uppercase text-[#86868B] font-mono -mt-0.5">{participantARole}</span>
            <span
              className={`w-2 h-2 rounded-full absolute -top-0.5 -right-0.5 ${
                normalizedState === 'diverging'
                  ? 'bg-[#FF9F0A]'
                  : normalizedState === 'synchronizing' || normalizedState === 'completing'
                  ? 'bg-[#34C759]'
                  : 'bg-[#2997FF]'
              }`}
            />
          </motion.div>
          {participantAStatus && (
            <span className="text-[10px] text-[#86868B] font-medium tracking-tight truncate max-w-[70px]">
              {participantAStatus}
            </span>
          )}
        </div>

        {/* Central Field Instrument SVG */}
        <div className="flex-1 px-1 sm:px-2 flex flex-col items-center justify-center relative min-h-[64px]">
          <svg
            className="w-full h-full overflow-visible"
            viewBox={`0 0 ${width} ${height}`}
            style={{ filter: stateConfig.glow }}
          >
            {/* Ambient Reference Gridline */}
            <line
              x1={startX}
              y1={height / 2}
              x2={endX}
              y2={height / 2}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
              strokeDasharray="2 3"
            />

            {/* In Diverging / Collaborating state: Show the out-of-phase secondary wave */}
            {(normalizedState === 'diverging' || normalizedState === 'collaborating') && (
              <path
                d={secondaryPath}
                fill="none"
                stroke={normalizedState === 'diverging' ? 'rgba(255, 159, 10, 0.5)' : 'rgba(48, 209, 88, 0.4)'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={normalizedState === 'diverging' ? '4 3' : undefined}
              />
            )}

            {/* Primary Signal Wave */}
            <path
              d={primaryPath}
              fill="none"
              stroke={stateConfig.color}
              strokeWidth={
                normalizedState === 'synchronizing' || normalizedState === 'completing' ? '2.2' : '1.75'
              }
              strokeLinecap="round"
            />

            {/* Central Equilibrium Resonance Indicator */}
            {normalizedState === 'completing' ? (
              <g transform={`translate(${width / 2}, ${height / 2})`}>
                <circle r="9" fill="none" stroke="#64D2FF" strokeWidth="1.5" className="animate-pulse" />
                <circle r="3" fill="#34C759" />
              </g>
            ) : normalizedState === 'synchronizing' ? (
              <circle
                cx={width / 2}
                cy={height / 2}
                r="4"
                fill="#34C759"
                className="animate-pulse shadow-lg"
              />
            ) : normalizedState === 'diverging' ? (
              <g transform={`translate(${width / 2}, ${height / 2})`}>
                <line x1="-5" y1="-5" x2="5" y2="5" stroke="#FF9F0A" strokeWidth="1.5" />
                <line x1="5" y1="-5" x2="-5" y2="5" stroke="#FF9F0A" strokeWidth="1.5" />
              </g>
            ) : (
              <circle
                cx={width / 2}
                cy={midY}
                r="2.5"
                fill="rgba(255, 255, 255, 0.6)"
              />
            )}
          </svg>

          {/* Precision Signal Metadata & State Badge */}
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider font-semibold ${stateConfig.badgeBg} ${stateConfig.badgeText}`}
            >
              {metricLabel || stateConfig.label}
            </span>
            <span className="text-[10px] text-[#86868B] font-mono tabular-nums">
              {displayCoherence}% COH
            </span>
          </div>

          <p className="text-[10px] text-[#636366] font-medium tracking-tight text-center mt-0.5 truncate max-w-[220px]">
            {stateConfig.subtext}
          </p>
        </div>

        {/* Node B (PARTNER / Control) */}
        <div className="flex flex-col items-center space-y-1.5 flex-shrink-0">
          <motion.div
            animate={{
              scale: activeRole === 'control' || normalizedState === 'selecting' ? [1, 1.05, 1] : 1,
            }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut', delay: 0.2 }}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#16161A] border-2 ${stateConfig.nodeBColor} flex flex-col items-center justify-center text-white relative transition-all duration-300`}
          >
            <span className="text-[11px] font-semibold tracking-tight">{participantBName}</span>
            <span className="text-[8px] uppercase text-[#86868B] font-mono -mt-0.5">{participantBRole}</span>
            <span
              className={`w-2 h-2 rounded-full absolute -top-0.5 -right-0.5 ${
                normalizedState === 'diverging'
                  ? 'bg-[#FF9F0A]'
                  : normalizedState === 'synchronizing' || normalizedState === 'completing'
                  ? 'bg-[#34C759]'
                  : 'bg-white/40'
              }`}
            />
          </motion.div>
          {participantBStatus && (
            <span className="text-[10px] text-[#86868B] font-medium tracking-tight truncate max-w-[70px]">
              {participantBStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
