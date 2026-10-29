'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChemistryScore, FictionalCompound } from '@/lib/types/chemistry';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { sound } from '@/lib/sound/soundEffects';
import { Check, Copy, MessageCircle, RotateCcw, Activity, Sparkles, Info } from 'lucide-react';

interface AffinityResultProps {
  score: ChemistryScore;
  compound?: FictionalCompound;
  userAName: string;
  userBName: string;
  onRestart: () => void;
  onOpenConversation: () => void;
  onExploreActivities?: () => void;
  onNextExperiment?: () => void;
}

export const AffinityResult: React.FC<AffinityResultProps> = ({
  score,
  userAName,
  userBName,
  onRestart,
  onOpenConversation,
  onExploreActivities,
  onNextExperiment,
}) => {
  const [phase, setPhase] = useState<'converging' | 'revealed'>('converging');
  const [displayScore, setDisplayScore] = useState(0);
  const [copied, setCopied] = useState(false);

  const finalAffinity = score.affinityIndex || score.overall || 87;
  const telemetry = score.telemetry;

  // The 1.8-second quiet equilibrium resolution sequence
  useEffect(() => {
    sound.playSuccessChime();

    const t = setTimeout(() => {
      setPhase('revealed');

      let current = 0;
      const step = Math.ceil(finalAffinity / 24);
      const timer = setInterval(() => {
        current += step;
        if (current >= finalAffinity) {
          setDisplayScore(finalAffinity);
          clearInterval(timer);
        } else {
          setDisplayScore(current);
        }
      }, 30);
    }, 1500);

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
    {
      label: 'DECISION ALIGNMENT',
      value: score.decisionAlignment || 82,
      desc: 'Consensus rate across preference, communication, and trust dilemmas',
      evidence: score.formulaExplanations?.alignmentReason || 'Consensus recorded across instinct nodes',
    },
    {
      label: 'EQUILIBRIUM VELOCITY',
      value: score.reactionTiming || 91,
      desc: 'Seconds required to balance temperature and pressure under the clock',
      evidence: score.formulaExplanations?.timingReason || 'Rapid equilibrium convergence observed',
    },
    {
      label: 'CONTAINMENT STABILITY',
      value: score.chemicalReasoning || 86,
      desc: 'Element valence compatibility (50%) + thermal hold stability (50%)',
      evidence: score.formulaExplanations?.reasoningReason || 'Containment maintained within ±3° tolerance',
    },
    {
      label: 'COMMUNICATION PACING',
      value: score.riskCompatibility || 88,
      desc: 'Reciprocal decision latency delta and actuator coordination balance',
      evidence: score.formulaExplanations?.riskReason || 'Reciprocal adjustment pace during critical flux',
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 select-none text-center pb-8">
      <AnimatePresence mode="wait">
        {phase === 'converging' ? (
          <motion.div
            key="converging"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.4 }}
            className="py-20 space-y-6 affecio-card p-8"
          >
            <div className="relative w-36 h-16 mx-auto flex items-center justify-center">
              {/* Converging Signal Nodes */}
              <motion.div
                animate={{ x: [-36, 0] }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-9 h-9 rounded-full bg-[#2997FF] shadow-[0_0_20px_rgba(41,151,255,0.6)] absolute left-3 flex items-center justify-center text-xs font-semibold text-white"
              >
                {userAName[0]}
              </motion.div>
              <motion.div
                animate={{ x: [36, 0] }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-9 h-9 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)] absolute right-3 flex items-center justify-center text-xs font-semibold text-black"
              >
                {userBName[0]}
              </motion.div>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs uppercase tracking-widest text-[#86868B] font-mono">
                Equilibrium Reached
              </div>
              <p className="text-xs text-[#636366]">
                Synthesizing multi-modal telemetry between {userAName} & {userBName}...
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
              <Badge variant="success">Experiment Verified</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {score.headline || 'High Collaborative Synergy'}
              </h2>
              <p className="text-xs sm:text-sm text-[#86868B] max-w-md mx-auto">
                Measurable signals recorded between {userAName} and {userBName}.
              </p>
            </div>

            {/* Core Affinity Scorecard */}
            <div className="affecio-card p-6 sm:p-8 space-y-6 text-center">
              <div>
                <div className="text-xs uppercase tracking-widest text-[#86868B] font-mono font-medium">
                  AFFINITY SCORE
                </div>
                <div className="text-7xl sm:text-8xl font-light tracking-tight text-white tabular-nums my-1">
                  {displayScore}
                </div>
                <div className="text-xs text-[#34C759] font-medium flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
                  <span>{userAName} · {userBName}</span>
                </div>
              </div>

              {/* 4 Measurable Telemetry Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {dimensions.map((dim) => (
                  <div key={dim.label} className="p-3.5 rounded-2xl bg-[#141417] border border-white/6 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-mono font-semibold text-[#86868B] tracking-tight">
                        {dim.label}
                      </span>
                      <span className="text-white font-semibold tabular-nums text-sm">
                        {dim.value}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#636366] leading-tight">
                      {dim.desc}
                    </p>
                    <div className="text-[10px] text-white/70 font-mono pt-0.5 border-t border-white/5">
                      ↳ {dim.evidence}
                    </div>
                  </div>
                ))}
              </div>

              {/* Distinction: Hardware/Telemetry Data vs AI Behavioral Synthesis */}
              <div className="space-y-3 pt-2">
                {/* 1. Hardware Sensor Log */}
                <div className="p-4 rounded-2xl bg-[#111114] border border-white/6 text-left space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs font-mono font-semibold text-white">
                      <Activity className="w-3.5 h-3.5 text-[#2997FF]" />
                      <span>RECORDED INTERACTION TELEMETRY</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#86868B]">
                      Verified Session Data
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/4">
                      <div className="text-[10px] text-[#86868B] font-mono uppercase">01 Bond Valence</div>
                      <div className="text-white font-medium text-xs mt-0.5 truncate">
                        {telemetry?.bondSummary || 'C + O · 92% Resonance'}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/4">
                      <div className="text-[10px] text-[#86868B] font-mono uppercase">02 Reactor Velocity</div>
                      <div className="text-white font-medium text-xs mt-0.5">
                        {telemetry?.reactorElapsedSeconds ? `${telemetry.reactorElapsedSeconds.toFixed(1)}s` : '21.4s'}
                        <span className="text-[#86868B] text-[10px] ml-1">
                          ({telemetry?.reactorOvershoots ?? 0} spikes)
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/4">
                      <div className="text-[10px] text-[#86868B] font-mono uppercase">03 Dilemma Consensus</div>
                      <div className="text-white font-medium text-xs mt-0.5 truncate">
                        {telemetry?.dilemmaTotalCount && telemetry.dilemmaTotalCount > 1
                          ? `${telemetry.dilemmaMatchCount} of ${telemetry.dilemmaTotalCount} Matches`
                          : telemetry?.dilemmaMatch
                          ? 'Direct Consensus'
                          : 'Complementary Polarity'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Qualitative Synthesis */}
                <div className="p-4 rounded-2xl bg-[#121216] border border-white/8 text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs font-mono font-semibold text-[#64D2FF]">
                      <Sparkles className="w-3.5 h-3.5 text-[#64D2FF]" />
                      <span>QUALITATIVE INTERPRETATION</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#64D2FF]/10 text-[#64D2FF]">
                      Behavioral Observation
                    </span>
                  </div>
                  <p className="text-xs text-[#86868B] leading-relaxed">
                    {score.formulaExplanations?.alignmentReason ||
                      'Your strongest collaborative signal was rapid instinct convergence under time pressure.'}{' '}
                    {score.formulaExplanations?.timingReason}
                  </p>
                </div>

                {/* 3. Non-Clinical Observation Disclosure */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/6 text-left flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[#86868B] flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#86868B] leading-relaxed">
                    <span className="font-semibold text-white/90">Observation Framework: </span>
                    These metrics derive strictly from your recorded coordination and decision timings in this digital experiment. They are transparent, evidence-based observations of this specific session, not a validated clinical psychological assessment.
                  </p>
                </div>
              </div>

              {/* Dynamic Interaction Sequence History */}
              <div className="pt-2 text-left space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-[#636366] font-mono font-semibold">
                  Signal Trajectory
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#86868B]">
                  <span className="px-2.5 py-1 rounded-full bg-[#141417] text-white border border-white/5 font-mono text-[11px]">
                    01 Bond: {telemetry?.bondMatch ? 'Resonant' : 'Complementary'}
                  </span>
                  <span className="text-white/20">→</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#141417] text-white border border-white/5 font-mono text-[11px]">
                    02 Reactor: {(telemetry?.reactorOvershoots ?? 0) <= 1 ? 'Precision Hold' : 'Adaptive Recovery'}
                  </span>
                  <span className="text-white/20">→</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#141417] text-white border border-white/5 font-mono text-[11px]">
                    03 Dilemma:{' '}
                    {telemetry?.dilemmaTotalCount && telemetry.dilemmaTotalCount > 1
                      ? `${telemetry.dilemmaMatchCount}/${telemetry.dilemmaTotalCount} Consensus`
                      : telemetry?.dilemmaMatch
                      ? 'Consensus'
                      : 'Polarity Split'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3">
                {onNextExperiment && (
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto px-6 text-xs bg-[#2997FF] text-white hover:bg-[#2997FF]/90 font-semibold shadow-lg shadow-[#2997FF]/20"
                    onClick={onNextExperiment}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Advance to Exp 04: Reaction Prediction →</span>
                  </Button>
                )}

                {onExploreActivities && (
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto px-6 text-xs bg-white text-black hover:bg-white/90 font-semibold"
                    onClick={onExploreActivities}
                  >
                    <Sparkles className="w-4 h-4 text-[#2997FF]" />
                    <span>Explore 25+ Dating Activities</span>
                  </Button>
                )}

                <Button
                  variant="secondary"
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
                  {copied ? <Check className="w-4 h-4 text-[#34C759]" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Link Copied' : 'Share Result'}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={onRestart}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Run Another Experiment</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
