'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LiquidGlassPanel } from '../ui/LiquidGlassPanel';
import { ChemistryScore } from '@/lib/types/chemistry';
import { ChevronDown, ChevronUp, ArrowRight, CheckCircle2 } from 'lucide-react';
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
    }, 30);

    return () => clearInterval(timer);
  }, [score.overall]);

  const metrics = [
    { label: 'Teamwork', value: score.teamwork, bar: 'bg-apple-blue', reason: score.formulaExplanations.teamworkReason },
    { label: 'Sync', value: score.synchronization, bar: 'bg-apple-green', reason: score.formulaExplanations.syncReason },
    { label: 'Adaptability', value: score.adaptability, bar: 'bg-indigo-400', reason: score.formulaExplanations.adaptabilityReason },
    { label: 'Balance', value: score.balance, bar: 'bg-apple-amber', reason: score.formulaExplanations.balanceReason },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Hero Scoreboard */}
      <LiquidGlassPanel className="p-8 md:p-10 text-center relative bg-[#1C1C1E]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2C2C2E] border border-white/10 text-xs font-medium text-[#A1A1A6] mb-6">
          <CheckCircle2 className="w-3.5 h-3.5 text-apple-green" />
          <span>Deterministic Interaction Telemetry</span>
        </div>

        <div className="space-y-1">
          <div className="text-xs uppercase tracking-wider text-[#A1A1A6] font-medium">
            Chemistry Affinity
          </div>
          <div className="text-7xl md:text-8xl font-light text-white tracking-tight tabular-data flex items-baseline justify-center">
            <span>{displayScore}</span>
            <span className="text-3xl text-[#A1A1A6] font-normal ml-1">%</span>
          </div>
        </div>

        {/* 4 Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
          {metrics.map((m) => (
            <div key={m.label} className="p-3.5 rounded-[14px] bg-[#2C2C2E] border border-white/10 text-center">
              <div className="text-xs font-medium text-[#A1A1A6]">
                {m.label}
              </div>
              <div className="text-2xl font-semibold tabular-data mt-1 text-white">
                {m.value}
              </div>
              <div className="w-full bg-[#3A3A3C] h-1.5 rounded-full mt-2.5 overflow-hidden">
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

        {/* Scoring Transparency Drawer */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center gap-4">
          <button
            onClick={() => {
              sound.playGlassClick();
              setShowFormula(!showFormula);
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#A1A1A6] hover:text-white transition-colors"
          >
            <span>{showFormula ? 'Hide Scoring Formulation' : 'View Explainable Scoring Formulation'}</span>
            {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showFormula && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="w-full text-left p-4 rounded-[14px] bg-[#2C2C2E] border border-white/10 text-xs space-y-2 text-white"
            >
              <div className="text-[#A1A1A6] font-mono text-[11px]">
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

          <button
            onClick={() => {
              sound.playGlassClick();
              onContinue();
            }}
            className="apple-btn-primary w-full sm:w-auto px-8"
          >
            <span>Synthesize Fictional Compound</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </LiquidGlassPanel>
    </div>
  );
};
