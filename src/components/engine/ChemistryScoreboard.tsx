'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LiquidGlassPanel } from '../ui/LiquidGlassPanel';
import { ChemistryScore } from '@/lib/types/chemistry';
import { ChevronDown, ChevronUp, ArrowRight, CheckCircle2, Activity, Shield, Terminal } from 'lucide-react';
import { sound } from '@/lib/sound/soundEffects';

interface ChemistryScoreboardProps {
  score: ChemistryScore;
  onContinue: () => void;
}

export const ChemistryScoreboard: React.FC<ChemistryScoreboardProps> = ({
  score,
  onContinue,
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [showFormula, setShowFormula] = useState(false);
  const [showTelemetry, setShowTelemetry] = useState(false);

  useEffect(() => {
    sound.playSuccessChime();
    let current = 0;
    const step = Math.ceil(score.overall / 28);
    const timer = setInterval(() => {
      current += step;
      if (current >= score.overall) {
        setDisplayScore(score.overall);
        clearInterval(timer);
      } else {
        setDisplayScore(current);
      }
    }, 28);

    return () => clearInterval(timer);
  }, [score.overall]);

  const energyMetric = Math.min(98, Math.max(68, Math.round((score.teamwork * 0.6 + score.adaptability * 0.4))));

  const radarPillars = [
    { label: 'STABILITY', value: score.teamwork, angle: -Math.PI / 2 },
    { label: 'RESONANCE', value: score.synchronization, angle: -Math.PI / 2 + (2 * Math.PI) / 5 },
    { label: 'ADAPTABILITY', value: score.adaptability, angle: -Math.PI / 2 + (4 * Math.PI) / 5 },
    { label: 'ENERGY', value: energyMetric, angle: -Math.PI / 2 + (6 * Math.PI) / 5 },
    { label: 'PARITY', value: score.balance, angle: -Math.PI / 2 + (8 * Math.PI) / 5 },
  ];

  const cx = 130;
  const cy = 130;
  const maxR = 82;

  const dataPoints = radarPillars.map((p) => {
    const r = (p.value / 100) * maxR;
    return `${cx + r * Math.cos(p.angle)},${cy + r * Math.sin(p.angle)}`;
  }).join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const metrics = [
    { label: 'Teamwork', value: score.teamwork, bar: 'bg-apple-blue', reason: score.formulaExplanations.teamworkReason },
    { label: 'Sync', value: score.synchronization, bar: 'bg-apple-green', reason: score.formulaExplanations.syncReason },
    { label: 'Adaptability', value: score.adaptability, bar: 'bg-indigo-400', reason: score.formulaExplanations.adaptabilityReason },
    { label: 'Balance', value: score.balance, bar: 'bg-apple-amber', reason: score.formulaExplanations.balanceReason },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded bg-[#2C2C2E] text-white font-bold">EXPERIMENT 03</span>
          <span className="text-white text-sm font-semibold tracking-wide">REACTION SIGNATURE ANALYSIS</span>
        </div>
        <div className="flex items-center space-x-2 text-apple-green">
          <CheckCircle2 className="w-4 h-4" />
          <span>DETERMINISTIC TELEMETRY VERIFIED</span>
        </div>
      </div>

      {/* Main Analysis Card */}
      <LiquidGlassPanel className="p-6 md:p-8 bg-[#1C1C1E] border border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* LEFT COLUMN: Affinity Index & Metrics Breakdown */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1A6]">
                CHEMISTRY AFFINITY INDEX
              </div>
              <div className="text-6xl md:text-8xl font-light text-white tracking-tight tabular-data flex items-baseline">
                <span>{displayScore}</span>
                <span className="text-3xl text-apple-blue font-normal ml-1.5">%</span>
              </div>
              <p className="text-xs text-[#A1A1A6] mt-2 leading-relaxed">
                Empirical synthesis computed from cooperative reaction telemetry, pressure convergence speed, and synchronization consensus.
              </p>
            </div>

            {/* 4 Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((m) => (
                <div key={m.label} className="p-3.5 rounded-[14px] bg-[#2C2C2E] border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[#A1A1A6]">{m.label}</span>
                    <span className="text-base font-semibold tabular-data text-white">{m.value}</span>
                  </div>
                  <div className="w-full bg-[#3A3A3C] h-1.5 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${m.value}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full ${m.bar}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: 5-Axis Reaction Signature Radar */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-[20px] bg-[#2C2C2E]/60 border border-white/10">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#A1A1A6] mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-apple-blue" />
              <span>5-AXIS REACTION SIGNATURE</span>
            </div>

            {/* SVG Radar Chart */}
            <div className="relative w-64 h-64 flex items-center justify-center select-none">
              <svg className="w-full h-full" viewBox="0 0 260 260">
                {/* Concentric Polygonal Grid Rings */}
                {gridLevels.map((lvl, idx) => {
                  const ringPoints = radarPillars.map((p) => {
                    const r = lvl * maxR;
                    return `${cx + r * Math.cos(p.angle)},${cy + r * Math.sin(p.angle)}`;
                  }).join(' ');

                  return (
                    <polygon
                      key={idx}
                      points={ringPoints}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Radial Axis Lines */}
                {radarPillars.map((p, idx) => {
                  const outerX = cx + maxR * Math.cos(p.angle);
                  const outerY = cy + maxR * Math.sin(p.angle);
                  return (
                    <line
                      key={idx}
                      x1={cx}
                      y1={cy}
                      x2={outerX}
                      y2={outerY}
                      stroke="rgba(255, 255, 255, 0.12)"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  );
                })}

                {/* The Reaction Signature Luminous Polygon */}
                <motion.polygon
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  points={dataPoints}
                  fill="rgba(41, 151, 255, 0.22)"
                  stroke="#2997FF"
                  strokeWidth="2"
                />

                {/* Vertex Dots */}
                {radarPillars.map((p, idx) => {
                  const r = (p.value / 100) * maxR;
                  const vx = cx + r * Math.cos(p.angle);
                  const vy = cy + r * Math.sin(p.angle);
                  return (
                    <circle
                      key={idx}
                      cx={vx}
                      cy={vy}
                      r="3.5"
                      fill="#FFFFFF"
                      stroke="#2997FF"
                      strokeWidth="1.5"
                    />
                  );
                })}

                {/* Axis Labels */}
                {radarPillars.map((p, idx) => {
                  const labelR = maxR + 24;
                  const lx = cx + labelR * Math.cos(p.angle);
                  const ly = cy + labelR * Math.sin(p.angle);
                  return (
                    <text
                      key={idx}
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#A1A1A6"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="600"
                    >
                      {p.label}
                    </text>
                  );
                })}
              </svg>
            </div>

            <span className="text-[10px] font-mono text-[#A1A1A6] mt-2">
              ORBITAL SYMMETRY: HIGH RESONANCE
            </span>
          </div>
        </div>

        {/* Explainable Formulation & Raw Telemetry Drawers */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <button
              onClick={() => {
                sound.playGlassClick();
                setShowFormula(!showFormula);
              }}
              className="inline-flex items-center gap-1.5 text-[#A1A1A6] hover:text-white transition-colors"
            >
              <span>{showFormula ? 'Hide Scoring Formulation' : 'View Explainable Scoring Formulation'}</span>
              {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <span className="text-white/20">·</span>

            <button
              onClick={() => {
                sound.playGlassClick();
                setShowTelemetry(!showTelemetry);
              }}
              className="inline-flex items-center gap-1.5 text-[#A1A1A6] hover:text-white transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{showTelemetry ? 'Hide Sensor Telemetry' : 'Inspect Raw Sensor Telemetry'}</span>
            </button>
          </div>

          {/* Formula Drawer */}
          {showFormula && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="w-full text-left p-4 rounded-[14px] bg-[#2C2C2E] border border-white/10 text-xs space-y-2 text-white"
            >
              <div className="text-apple-blue font-mono text-[11px]">
                Score = (0.35 × Teamwork) + (0.30 × Sync) + (0.20 × Adaptability) + (0.15 × Balance)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/10">
                {metrics.map((m) => (
                  <div key={m.label} className="text-[11px] leading-relaxed">
                    <span className="font-semibold text-white">{m.label}:</span>{' '}
                    <span className="text-[#A1A1A6]">{m.reason}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Raw Telemetry Inspector Drawer */}
          {showTelemetry && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="w-full text-left p-4 rounded-[14px] bg-black border border-white/10 text-xs font-mono space-y-2 text-[#A1A1A6]"
            >
              <div className="text-white font-semibold text-[11px] flex items-center justify-between pb-1 border-b border-white/10">
                <span>TELEMETRY_LOG_CHAMBER_01</span>
                <span className="text-apple-green text-[10px]">VERIFIED_HASH_OK</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                <div><span className="text-white/40">CALIBRATION_TIME:</span> 24.2s</div>
                <div><span className="text-white/40">THERMAL_OVERSHOOTS:</span> 0</div>
                <div><span className="text-white/40">HOLD_DURATION:</span> 3.0s</div>
                <div><span className="text-white/40">DILEMMA_CONSENSUS:</span> MATCH</div>
              </div>
            </motion.div>
          )}

          <button
            onClick={() => {
              sound.playGlassClick();
              onContinue();
            }}
            className="apple-btn-primary w-full sm:w-auto px-8 mt-2"
          >
            <span>Synthesize Fictional Compound</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </LiquidGlassPanel>
    </div>
  );
};
