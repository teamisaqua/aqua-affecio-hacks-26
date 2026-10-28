'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChemistryScore } from '@/lib/types/chemistry';
import { ArrowRight, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { sound } from '@/lib/sound/soundEffects';

interface ChemistryScoreboardProps {
  score: ChemistryScore;
  onContinue: () => void;
}

export const ChemistryScoreboard: React.FC<ChemistryScoreboardProps> = ({
  score,
  onContinue,
}) => {
  const [displayAffinity, setDisplayAffinity] = useState(0);
  const [showFormula, setShowFormula] = useState(false);

  const targetAffinity = score.affinityIndex || score.overall || 82;

  useEffect(() => {
    sound.playSuccessChime();
    let current = 0;
    const step = Math.ceil(targetAffinity / 24);
    const timer = setInterval(() => {
      current += step;
      if (current >= targetAffinity) {
        setDisplayAffinity(targetAffinity);
        clearInterval(timer);
      } else {
        setDisplayAffinity(current);
      }
    }, 32);

    return () => clearInterval(timer);
  }, [targetAffinity]);

  const metrics = [
    {
      label: 'Chemical reasoning',
      value: score.chemicalReasoning || score.teamwork,
      reason: score.formulaExplanations?.reasoningReason || score.formulaExplanations?.teamworkReason,
      bar: 'bg-apple-blue',
    },
    {
      label: 'Decision alignment',
      value: score.decisionAlignment || score.synchronization,
      reason: score.formulaExplanations?.alignmentReason || score.formulaExplanations?.syncReason,
      bar: 'bg-apple-green',
    },
    {
      label: 'Reaction timing',
      value: score.reactionTiming || score.adaptability,
      reason: score.formulaExplanations?.timingReason || score.formulaExplanations?.adaptabilityReason,
      bar: 'bg-purple-400',
    },
    {
      label: 'Risk compatibility',
      value: score.riskCompatibility || score.balance,
      reason: score.formulaExplanations?.riskReason || score.formulaExplanations?.balanceReason,
      bar: 'bg-apple-amber',
    },
  ];

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 select-none text-center">
      {/* Result Hero Headline */}
      <div className="space-y-2">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171717] border border-white/8 text-xs font-medium text-apple-blue"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Synthesis Complete</span>
        </motion.div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
          {score.headline || 'Your chemistry is strong.'}
        </h2>
        <p className="text-sm text-[#A1A1A6] max-w-md mx-auto">
          Calculated from elemental resonance, cooperative calibration, and synchronized choices.
        </p>
      </div>

      {/* Hero Affinity Index */}
      <div className="p-8 rounded-3xl bg-[#111111] border border-white/8 space-y-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#A1A1A6] font-medium">
            Affinity
          </div>
          <div className="text-7xl sm:text-8xl font-light text-white tracking-tight tabular-nums flex items-baseline justify-center mt-1">
            <span>{displayAffinity}</span>
          </div>
        </div>

        {/* 4 Gameplay Behavioral Pillars */}
        <div className="grid grid-cols-2 gap-3 text-left">
          {metrics.map((m) => (
            <div key={m.label} className="p-3.5 rounded-2xl bg-[#171717] border border-white/6 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#A1A1A6] font-medium">{m.label}</span>
                <span className="text-white font-semibold tabular-nums text-sm">{m.value}</span>
              </div>
              <div className="w-full bg-[#242426] h-1.5 rounded-full overflow-hidden">
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
        <div className="pt-4 border-t border-white/8 flex flex-col items-center gap-3">
          <button
            onClick={() => {
              sound.playGlassClick();
              setShowFormula(!showFormula);
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#A1A1A6] hover:text-white transition-colors"
          >
            <span>{showFormula ? 'Hide breakdown details' : 'How this score was generated'}</span>
            {showFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showFormula && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="w-full text-left p-4 rounded-2xl bg-[#171717] border border-white/6 text-xs space-y-2.5 text-[#A1A1A6]"
            >
              <div className="text-white font-medium text-xs pb-1 border-b border-white/8">
                Empirical Telemetry Formulation
              </div>
              {metrics.map((m) => (
                <div key={m.label} className="text-[11px] leading-relaxed">
                  <span className="text-white font-semibold">{m.label}:</span>{' '}
                  <span>{m.reason}</span>
                </div>
              ))}
            </motion.div>
          )}

          <button
            onClick={() => {
              sound.playSuccessChime();
              onContinue();
            }}
            className="apple-btn-primary w-full sm:w-auto px-8 mt-2"
          >
            <span>View Chemistry Record</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
