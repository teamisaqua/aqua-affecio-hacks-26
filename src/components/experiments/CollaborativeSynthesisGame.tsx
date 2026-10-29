'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  COLLABORATIVE_CHALLENGES,
  CollaborativeChallenge,
} from '@/lib/data/experiments/collaborativeChallenges';
import { sound } from '@/lib/sound/soundEffects';
import { UserRole } from '@/lib/types/chemistry';
import { ActivityRecord } from '@/lib/activities/types';
import {
  FlaskConical,
  Gauge,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Send,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldAlert,
  Beaker,
} from 'lucide-react';

interface CollaborativeSynthesisGameProps {
  role: UserRole;
  userAName: string;
  userBName: string;
  isSimulatedPartner?: boolean;
  onFinishGame?: (record: ActivityRecord) => void;
  onExit?: () => void;
  onNextExperiment?: () => void;
}

export const CollaborativeSynthesisGame: React.FC<CollaborativeSynthesisGameProps> = ({
  role,
  userAName,
  userBName,
  isSimulatedPartner = true,
  onFinishGame,
  onExit,
  onNextExperiment,
}) => {
  const isExplore = role === 'explore' || role === 'observer';
  const myName = isExplore ? userAName : userBName;
  const partnerName = isExplore ? userBName : userAName;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [exploreChoice, setExploreChoice] = useState<string | null>(null);
  const [controlChoice, setControlChoice] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [sharedMessages, setSharedMessages] = useState<
    { sender: string; text: string; time: string }[]
  >([]);

  // Score states
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const [totalYieldSum, setTotalYieldSum] = useState(0);

  const currentChallenge: CollaborativeChallenge =
    COLLABORATIVE_CHALLENGES[currentIndex % COLLABORATIVE_CHALLENGES.length];

  const totalChallenges = 5;
  const isGameOver = solvedChallenges.length >= totalChallenges;

  const myChoice = isExplore ? exploreChoice : controlChoice;
  const partnerChoice = isExplore ? controlChoice : exploreChoice;

  // Auto partner choice in simulated mode
  useEffect(() => {
    if (isSimulatedPartner && myChoice && !partnerChoice && !isResolved) {
      const timer = setTimeout(() => {
        if (isExplore) {
          // Partner is Control
          const shouldPickCorrect = Math.random() < 0.85;
          const pick = shouldPickCorrect
            ? currentChallenge.controlClues.correctOption
            : currentChallenge.controlClues.validOptions.find(
                (o) => o !== currentChallenge.controlClues.correctOption
              ) || currentChallenge.controlClues.validOptions[0];
          setControlChoice(pick);
        } else {
          // Partner is Explore
          const shouldPickCorrect = Math.random() < 0.85;
          const pick = shouldPickCorrect
            ? currentChallenge.exploreClues.correctOption
            : currentChallenge.exploreClues.validOptions.find(
                (o) => o !== currentChallenge.exploreClues.correctOption
              ) || currentChallenge.exploreClues.validOptions[0];
          setExploreChoice(pick);
        }
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [myChoice, partnerChoice, isSimulatedPartner, isExplore, currentChallenge, isResolved]);

  // When both choices are submitted, trigger reaction synthesis run
  useEffect(() => {
    if (exploreChoice && controlChoice && !isResolved && !isSynthesizing) {
      setIsSynthesizing(true);
      sound.playCountdownBeep(true);

      const timer = setTimeout(() => {
        setIsSynthesizing(false);
        setIsResolved(true);

        const exploreCorrect = exploreChoice === currentChallenge.exploreClues.correctOption;
        const controlCorrect = controlChoice === currentChallenge.controlClues.correctOption;

        let runYield = 0;
        if (exploreCorrect && controlCorrect) runYield = 98;
        else if (exploreCorrect || controlCorrect) runYield = 45;
        else runYield = 12;

        setTotalYieldSum((prev) => prev + runYield);
        setSolvedChallenges((prev) => [...prev, currentChallenge.id]);

        if (runYield >= 80) {
          sound.playSuccessChime();
        } else {
          sound.playOverheatWarning();
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [exploreChoice, controlChoice, isResolved, isSynthesizing, currentChallenge]);

  const handleSendClueToPartner = () => {
    sound.playGlassClick();
    const clueText = isExplore
      ? `[Explore Clue] ${currentChallenge.exploreClues.criticalHint}`
      : `[Control Clue] ${currentChallenge.controlClues.criticalHint}`;

    setSharedMessages((prev) => [
      ...prev,
      {
        sender: myName,
        text: clueText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      },
    ]);

    // Simulated reply
    if (isSimulatedPartner) {
      setTimeout(() => {
        const reply = isExplore
          ? `[Control Clue] ${currentChallenge.controlClues.criticalHint}`
          : `[Explore Clue] ${currentChallenge.exploreClues.criticalHint}`;
        setSharedMessages((prev) => [
          ...prev,
          {
            sender: partnerName,
            text: reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          },
        ]);
      }, 900);
    }
  };

  const handleNextChallenge = () => {
    sound.playGlassClick();
    setExploreChoice(null);
    setControlChoice(null);
    setIsResolved(false);
    setIsSynthesizing(false);
    setCurrentIndex((prev) => (prev + 1) % COLLABORATIVE_CHALLENGES.length);
  };

  const currentYield =
    exploreChoice === currentChallenge.exploreClues.correctOption &&
    controlChoice === currentChallenge.controlClues.correctOption
      ? 98
      : exploreChoice === currentChallenge.exploreClues.correctOption ||
        controlChoice === currentChallenge.controlClues.correctOption
      ? 45
      : 12;

  const averageYield = Math.round(
    totalYieldSum / Math.max(1, solvedChallenges.length || 1)
  );

  const handleFinishAndSave = () => {
    sound.playSuccessChime();
    const record: ActivityRecord = {
      activityId: 'collaborative-synthesis',
      activityTitle: 'Experiment 06: Collaborative Synthesis',
      completedAt: Date.now(),
      durationSeconds: 120,
      participantA: userAName,
      participantB: userBName,
      metrics: {
        completedSyntheses: solvedChallenges.length,
        averageYield,
        bestTarget: currentChallenge.targetProduct,
      },
      summary: `Synthesized ${solvedChallenges.length} chemical targets with ${averageYield}% mean yield.`,
      highlights: [
        `Mean Synthetic Yield: ${averageYield}%`,
        `Cross-Role Collaboration: ${isExplore ? 'Explore' : 'Control'} + ${isExplore ? 'Control' : 'Explore'}`,
      ],
    };

    if (onFinishGame) onFinishGame(record);
    if (onNextExperiment) onNextExperiment();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8">
        <div className="flex items-center space-x-2.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#16161A] border border-white/8 text-white text-xs font-semibold font-mono">
            06 Synthesis
          </span>
          <span className="text-white text-xs sm:text-sm font-semibold tracking-tight">
            Target {solvedChallenges.length + 1} of {totalChallenges}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#86868B]">
            Mean Yield: <span className="text-[#34C759] font-semibold">{averageYield}%</span>
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[#86868B]">
            Role: <span className="text-[#2997FF] font-semibold">{isExplore ? 'Explore (Reagents)' : 'Control (Conditions)'}</span>
          </span>
        </div>
      </div>

      {/* Target Product Dossier */}
      <div className="p-5 rounded-2xl bg-[#121216] border border-white/8 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#2997FF] bg-[#2997FF]/10 px-2 py-0.5 rounded">
              {currentChallenge.code} · {currentChallenge.category}
            </span>
            <span className="text-[10px] font-mono text-[#86868B] px-1.5 py-0.5 rounded bg-white/5">
              Difficulty: {currentChallenge.difficulty}
            </span>
          </div>

          <div className="text-xs text-[#86868B] font-mono">
            {exploreChoice && controlChoice ? 'Parameters Interlocked' : 'Adjusting Chambers'}
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {currentChallenge.title}
            </h3>
            <div className="text-xs font-mono text-[#34C759] mt-0.5">
              Target Formula: {currentChallenge.targetProduct}
            </div>
          </div>

          <button
            onClick={handleSendClueToPartner}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white flex items-center gap-1.5 transition-all cursor-pointer"
            title="Transmit your critical role clue to partner terminal"
          >
            <Send className="w-3.5 h-3.5 text-[#2997FF]" />
            <span className="hidden sm:inline">Transmit Clue</span>
          </button>
        </div>
      </div>

      {/* Transmitted Messages Bar */}
      {sharedMessages.length > 0 && (
        <div className="space-y-1.5 max-h-28 overflow-y-auto p-2.5 rounded-xl bg-[#0F0F12] border border-white/6 text-xs">
          {sharedMessages.map((msg, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] leading-relaxed">
              <span className="text-white/40 font-mono text-[9px] shrink-0 pt-0.5">{msg.time}</span>
              <span className="text-white font-medium shrink-0">{msg.sender}:</span>
              <span className="text-[#86868B]">{msg.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Asymmetric View Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Explore Terminal Box */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isExplore
              ? 'bg-[#141418] border-[#2997FF]/50 ring-1 ring-[#2997FF]/20'
              : 'bg-[#101014] border-white/6 opacity-75'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <FlaskConical className="w-3.5 h-3.5 text-[#2997FF]" />
              <span>Explore Terminal (Reagents)</span>
            </div>
            {isExplore && (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#2997FF]/20 text-[#2997FF]">
                Your Console
              </span>
            )}
          </div>

          <div className="text-[11px] text-[#86868B] space-y-1 mb-3">
            <div className="text-white/60 font-medium">Reagent Precursors:</div>
            {currentChallenge.exploreClues.reagents.map((r, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2997FF]/60" />
                <span>{r}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/6">
            <div className="text-xs font-medium text-white mb-2">
              {currentChallenge.exploreClues.targetParameterKey}
            </div>

            <div className="space-y-1.5">
              {currentChallenge.exploreClues.validOptions.map((opt) => {
                const isSelected = exploreChoice === opt;
                return (
                  <button
                    key={opt}
                    disabled={!isExplore || isResolved}
                    onClick={() => {
                      sound.playGlassClick();
                      setExploreChoice(opt);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#2997FF]/20 text-white border border-[#2997FF]'
                        : 'bg-white/4 text-[#86868B] hover:text-white hover:bg-white/8 border border-transparent'
                    } ${!isExplore ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#2997FF]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Control Terminal Box */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            !isExplore
              ? 'bg-[#141418] border-[#34C759]/50 ring-1 ring-[#34C759]/20'
              : 'bg-[#101014] border-white/6 opacity-75'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Gauge className="w-3.5 h-3.5 text-[#34C759]" />
              <span>Control Terminal (Environment)</span>
            </div>
            {!isExplore && (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#34C759]/20 text-[#34C759]">
                Your Console
              </span>
            )}
          </div>

          <div className="text-[11px] text-[#86868B] space-y-1 mb-3">
            <div className="text-white/60 font-medium">Thermodynamic Constraints:</div>
            {currentChallenge.controlClues.environmentConstraints.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]/60" />
                <span>{c}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/6">
            <div className="text-xs font-medium text-white mb-2">
              {currentChallenge.controlClues.targetParameterKey}
            </div>

            <div className="space-y-1.5">
              {currentChallenge.controlClues.validOptions.map((opt) => {
                const isSelected = controlChoice === opt;
                return (
                  <button
                    key={opt}
                    disabled={isExplore || isResolved}
                    onClick={() => {
                      sound.playGlassClick();
                      setControlChoice(opt);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#34C759]/20 text-white border border-[#34C759]'
                        : 'bg-white/4 text-[#86868B] hover:text-white hover:bg-white/8 border border-transparent'
                    } ${isExplore ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Synthesis Active Animation */}
      {isSynthesizing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-5 rounded-2xl bg-[#141416] border border-[#2997FF]/40 text-center space-y-2 shadow-xl"
        >
          <div className="text-xs font-mono uppercase tracking-wider text-[#2997FF] animate-pulse">
            Executing Chemical Synthesis Sequence...
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#2997FF] h-full animate-[progress_2s_ease-in-out_infinite]" />
          </div>
        </motion.div>
      )}

      {/* Resolved Synthesis Result */}
      <AnimatePresence>
        {isResolved && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-[#121216] border border-white/10 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {currentYield >= 80 ? (
                  <CheckCircle2 className="w-5 h-5 text-[#34C759]" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-[#FF9F0A]" />
                )}
                <span className="text-sm font-semibold text-white">
                  {currentYield >= 80
                    ? 'High-Yield Synthesis Achieved'
                    : 'Partial Synthesis with Byproduct Formation'}
                </span>
              </div>
              <span
                className={`text-sm font-bold font-mono ${
                  currentYield >= 80 ? 'text-[#34C759]' : 'text-[#FF9F0A]'
                }`}
              >
                {currentYield}% Yield
              </span>
            </div>

            <div className="text-xs text-[#86868B] leading-relaxed space-y-1">
              <div>
                <span className="text-white font-medium">Mechanism: </span>
                {currentChallenge.synthesisMechanism}
              </div>
              <div>
                <span className="text-white font-medium">Impact: </span>
                {currentChallenge.realWorldImpact}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              {solvedChallenges.length < totalChallenges ? (
                <button
                  onClick={handleNextChallenge}
                  className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next Synthesis Target</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleFinishAndSave}
                  className="px-5 py-2 rounded-full bg-[#2997FF] text-white text-xs font-semibold hover:bg-[#2997FF]/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#2997FF]/20"
                >
                  <span>Complete Experiment 06</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
