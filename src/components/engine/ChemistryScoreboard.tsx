'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LiquidGlassPanel } from '../ui/LiquidGlassPanel';
import { ChemistryScore } from '@/lib/types/chemistry';
import { Sparkles, Calculator, ArrowRight, ShieldCheck } from 'lucide-react';
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

  // Animated counting up of the score
  useEffect(() => {
    sound.playSuccessChime();
    let current = 0;
    const step = Math.ceil(score.overall / 30);
    const timer = setInterval(() => {
      current += step;
      if (current >= score.overall) {
        setDisplayScore(score.overall);
        clearInterval(timer);
      } else {
        setDisplayScore(current);
      }
    }, 35);

    return () => clearInterval(timer);
  }, [score.overall]);

  const metrics = [
    { label: 'SYNC', value: score.synchronization, color: 'text-lab-cyan', bg: 'bg-lab-cyan', reason: score.formulaExplanations.syncReason },
    { label: 'TEAMWORK', value: score.teamwork, color: 'text-lab-pink', bg: 'bg-lab-pink', reason: score.formulaExplanations.teamworkReason },
    { label: 'ADAPTABILITY', value: score.adaptability, color: 'text-lab-purple', bg: 'bg-lab-purple', reason: score.formulaExplanations.adaptabilityReason },
    { label: 'BALANCE', value: score.balance, color: 'text-amber-400', bg: 'bg-amber-400', reason: score.formulaExplanations.balanceReason },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Hero Score Showcase */}
      <LiquidGlassPanel className="p-8 md:p-12 text-center relative overflow-hidden" glow="purple">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono uppercase tracking-widest text-slate-400 mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Deterministic Telemetry Analysis
        </div>

        <div className="space-y-1">
          <div className="text-xs uppercase tracking-widest font-mono text-slate-400">
            TOTAL CHEMISTRY RESONANCE
          </div>
          <div className="text-7xl md:text-8xl font-black font-mono tracking-tight text-white flex items-baseline justify-center gap-1">
            <span className="bg-gradient-to-r from-lab-cyan via-purple-300 to-lab-pink bg-clip-text text-transparent">
              {displayScore}
            </span>
            <span className="text-3xl font-light text-slate-400">%</span>
          </div>
        </div>

        {/* 4 Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {metrics.map((m) => (
            <div key={m.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-center">
              <div className="text-[11px] font-mono tracking-widest text-slate-400">
                {m.label}
              </div>
              <div className={`text-2xl font-mono font-bold mt-1 ${m.color}`}>
                {m.value}
              </div>
              <div className="w-full bg-white/5 h-1 rounded-full mt-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.value}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className={`h-full ${m.bg}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Explainability / Formula Toggle */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center gap-4">
          <button
            onClick={() => {
              sound.playGlassClick();
              setShowFormula(!showFormula);
            }}
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            <Calculator className="w-4 h-4 text-lab-cyan" />
            {showFormula ? 'Hide Scoring Formula' : 'View Explainable Scoring Formula'}
          </button>

          {showFormula && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="w-full text-left p-4 rounded-xl bg-black/40 border border-white/10 text-xs font-mono space-y-2 text-slate-300"
            >
              <div className="text-lab-cyan font-bold">Mathematical Formulation:</div>
              <div className="text-slate-400">
                Score = 0.35 × Teamwork + 0.30 × Sync + 0.20 × Adaptability + 0.15 × Balance
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-white/10">
                {metrics.map((m) => (
                  <div key={m.label} className="text-[11px]">
                    <span className="text-white font-bold">{m.label}:</span> {m.reason}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <button
            onClick={() => {
              sound.playGlassClick();
              onContinue();
            }}
            className="w-full md:w-auto px-8 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-lab-cyan via-purple-500 to-lab-pink text-white shadow-glow-cyan hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <span>Synthesize Fictional Compound</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </LiquidGlassPanel>
    </div>
  );
};
