'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChemistryScore, FictionalCompound } from '@/lib/types/chemistry';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { sound } from '@/lib/sound/soundEffects';
import { Check, Copy, MessageCircle, RotateCcw, ArrowRight } from 'lucide-react';

interface AffinityResultProps {
  score: ChemistryScore;
  compound?: FictionalCompound;
  userAName: string;
  userBName: string;
  onRestart: () => void;
  onOpenConversation: () => void;
}

export const AffinityResult: React.FC<AffinityResultProps> = ({
  score,
  userAName,
  userBName,
  onRestart,
  onOpenConversation,
}) => {
  const [phase, setPhase] = useState<'converging' | 'revealed'>('converging');
  const [displayScore, setDisplayScore] = useState(0);
  const [copied, setCopied] = useState(false);

  const finalAffinity = score.affinityIndex || score.overall || 87;

  // The 2.5-second quiet equilibrium resolution sequence
  useEffect(() => {
    sound.playSuccessChime();

    const t = setTimeout(() => {
      setPhase('revealed');

      let current = 0;
      const step = Math.ceil(finalAffinity / 22);
      const timer = setInterval(() => {
        current += step;
        if (current >= finalAffinity) {
          setDisplayScore(finalAffinity);
          clearInterval(timer);
        } else {
          setDisplayScore(current);
        }
      }, 35);
    }, 1800);

    return () => clearTimeout(t);
  }, [finalAffinity]);

  const handleCopyLink = () => {
    sound.playGlassClick();
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const dimensions = [
    { label: 'SYNC', value: score.decisionAlignment || 82, desc: 'Instinct alignment on dilemmas' },
    { label: 'ADAPTABILITY', value: score.reactionTiming || 91, desc: 'Velocity to restore balance' },
    { label: 'DECISION ALIGNMENT', value: score.chemicalReasoning || 78, desc: 'Impulse polarity consensus' },
    { label: 'COMMUNICATION', value: score.riskCompatibility || 89, desc: 'Bidirectional steering parity' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 select-none text-center">
      <AnimatePresence mode="wait">
        {phase === 'converging' ? (
          <motion.div
            key="converging"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.5 }}
            className="py-16 space-y-6 affecio-card p-8"
          >
            <div className="relative w-32 h-16 mx-auto flex items-center justify-center">
              {/* Converging Signal Nodes */}
              <motion.div
                animate={{ x: [-28, 0] }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-8 h-8 rounded-full bg-apple-blue shadow-lg absolute left-4"
              />
              <motion.div
                animate={{ x: [28, 0] }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-8 h-8 rounded-full bg-white shadow-lg absolute right-4"
              />
            </div>

            <div className="space-y-1">
              <div className="text-xs uppercase tracking-widest text-[#9E9EA7] font-medium">
                Equilibrium Reached
              </div>
              <p className="text-xs text-[#62626B]">
                Synthesizing final interaction data...
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Payoff Header */}
            <div className="space-y-1.5">
              <Badge variant="success">Experiment Complete</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {score.headline || 'Your chemistry is strong.'}
              </h2>
              <p className="text-xs sm:text-sm text-[#9E9EA7] max-w-md mx-auto">
                Measurable signals recorded between {userAName} and {userBName}.
              </p>
            </div>

            {/* Core Affinity Scorecard */}
            <div className="affecio-card p-7 sm:p-8 space-y-6 text-center">
              <div>
                <div className="text-xs uppercase tracking-widest text-[#9E9EA7] font-semibold">
                  AFFINITY
                </div>
                <div className="text-7xl sm:text-8xl font-light tracking-tight text-white tabular-nums my-1">
                  {displayScore}
                </div>
                <div className="text-xs text-apple-green font-medium">
                  {userAName} · {userBName}
                </div>
              </div>

              {/* 4 Measurable Behavioral Dimensions */}
              <div className="grid grid-cols-2 gap-3 text-left">
                {dimensions.map((dim) => (
                  <div key={dim.label} className="p-3.5 rounded-2xl bg-[#141417] border border-white/6 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-xs font-semibold text-[#9E9EA7] tracking-tight">{dim.label}</span>
                      <span className="text-white font-semibold tabular-nums text-sm">{dim.value}</span>
                    </div>
                    <p className="text-[10px] text-[#62626B] leading-tight">
                      {dim.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Scientific Observation Interpretation */}
              <div className="p-4 rounded-2xl bg-[#141417] border border-white/6 text-xs text-[#9E9EA7] leading-relaxed text-left">
                <span className="text-white font-semibold">Primary observation: </span>
                <span>
                  {score.formulaExplanations?.alignmentReason ||
                    'Your strongest signal was synchronized decision-making under time pressure, showing natural instinct convergence.'}
                </span>
              </div>

              {/* Visual Reaction History Timeline */}
              <div className="pt-2 text-left space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-[#62626B] font-semibold">
                  Interaction Sequence
                </div>
                <div className="flex items-center space-x-2 text-xs text-[#9E9EA7]">
                  <span className="px-2.5 py-1 rounded-full bg-[#141417] text-white">01 Calibrate: Synchronous</span>
                  <span className="text-white/20">→</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#141417] text-white">02 React: Resonant</span>
                  <span className="text-white/20">→</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#141417] text-white">03 Dilemma: Matched</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto px-6 text-xs"
                  onClick={onOpenConversation}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Conversation Sparks</span>
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  className="w-full sm:w-auto px-6 text-xs"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="w-4 h-4 text-apple-green" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Link Copied' : 'Share Result'}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={onRestart}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Run Another</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
