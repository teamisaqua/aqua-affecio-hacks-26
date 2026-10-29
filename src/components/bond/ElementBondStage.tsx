'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EXPANDED_ELEMENTS,
  BOND_CHALLENGE_ROUNDS,
  getDetailedBondOutcome,
  DetailedBondOutcome,
  ChemicalElement,
} from '@/lib/data/experiments/elementBondMatrix';
import { BondResult, UserRole } from '@/lib/types/chemistry';
import { sound } from '@/lib/sound/soundEffects';
import { Sparkles, ArrowRight, Check, Zap, Info, RotateCcw } from 'lucide-react';

interface ElementBondStageProps {
  role: UserRole;
  userAName: string;
  userBName: string;
  userAChoice: string | null;
  userBChoice: string | null;
  onSelectElement: (elementId: string) => void;
  onComplete: (result: BondResult) => void;
  demoMode?: boolean;
}

export const ElementBondStage: React.FC<ElementBondStageProps> = ({
  role,
  userAName,
  userBName,
  userAChoice,
  userBChoice,
  onSelectElement,
  onComplete,
  demoMode = false,
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [detailedOutcome, setDetailedOutcome] = useState<DetailedBondOutcome | null>(null);
  const [completedRounds, setCompletedRounds] = useState<DetailedBondOutcome[]>([]);
  const isCountingDownRef = useRef(false);

  const currentRound = BOND_CHALLENGE_ROUNDS[currentRoundIdx] || BOND_CHALLENGE_ROUNDS[0];
  const isExplore = role === 'explore' || role === 'observer';
  const myChoice = isExplore ? userAChoice : userBChoice;
  const partnerChoice = isExplore ? userBChoice : userAChoice;
  const partnerName = isExplore ? userBName : userAName;

  const handlePick = (id: string) => {
    sound.playSliderTick(480);
    setSelectedId(id);
    onSelectElement(id);
  };

  // When both users choose, run 3-2-1 countdown reveal
  useEffect(() => {
    if (userAChoice && userBChoice && !detailedOutcome && !isCountingDownRef.current) {
      isCountingDownRef.current = true;
      setCountdown(3);
      sound.playCountdownBeep(false);

      const t2 = setTimeout(() => {
        setCountdown(2);
        sound.playCountdownBeep(false);
      }, 750);

      const t1 = setTimeout(() => {
        setCountdown(1);
        sound.playCountdownBeep(true);
      }, 1500);

      const t0 = setTimeout(() => {
        setCountdown(null);
        const outcome = getDetailedBondOutcome(userAChoice, userBChoice);
        setDetailedOutcome(outcome);
        sound.playSuccessChime();
        isCountingDownRef.current = false;
      }, 2250);

      return () => {
        clearTimeout(t2);
        clearTimeout(t1);
        clearTimeout(t0);
        isCountingDownRef.current = false;
      };
    }
  }, [userAChoice, userBChoice, detailedOutcome]);

  const handleNextRound = () => {
    sound.playGlassClick();
    if (detailedOutcome) {
      setCompletedRounds((prev) => [...prev, detailedOutcome]);
    }
    const nextIdx = currentRoundIdx + 1;
    if (nextIdx < BOND_CHALLENGE_ROUNDS.length) {
      setCurrentRoundIdx(nextIdx);
      setSelectedId(null);
      setDetailedOutcome(null);
      isCountingDownRef.current = false;
      // Re-trigger pick for the new round
      onSelectElement('');
    } else {
      // Completed all 3 rounds -> conclude Experiment 01
      finishExperiment();
    }
  };

  const finishExperiment = () => {
    sound.playSuccessChime();
    const finalOutcome = detailedOutcome || completedRounds[completedRounds.length - 1];
    const elA = EXPANDED_ELEMENTS.find((e) => e.id === finalOutcome?.elementAId) || EXPANDED_ELEMENTS[1];
    const elB = EXPANDED_ELEMENTS.find((e) => e.id === finalOutcome?.elementBId) || EXPANDED_ELEMENTS[3];

    const bondResult: BondResult = {
      elementA: {
        id: elA.id,
        name: elA.name,
        symbol: elA.symbol,
        atomicNumber: elA.atomicNumber,
        category: elA.category,
        tag: elA.category,
        valence: elA.valenceElectrons,
        color: elA.color,
      },
      elementB: {
        id: elB.id,
        name: elB.name,
        symbol: elB.symbol,
        atomicNumber: elB.atomicNumber,
        category: elB.category,
        tag: elB.category,
        valence: elB.valenceElectrons,
        color: elB.color,
      },
      bondType: finalOutcome?.bondType || 'Polar Covalent',
      bondName: finalOutcome?.compoundName || 'Synthesized Compound',
      formula: finalOutcome?.compoundFormula || 'AB',
      compatibility: finalOutcome?.valenceCompatibility || 90,
      description: finalOutcome?.description || 'Stable valence resonance achieved.',
    };
    onComplete(bondResult);
  };

  // If in demoMode, automatically advance after viewing
  useEffect(() => {
    if (detailedOutcome && demoMode) {
      const t = setTimeout(() => {
        if (currentRoundIdx < BOND_CHALLENGE_ROUNDS.length - 1) {
          handleNextRound();
        } else {
          finishExperiment();
        }
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [detailedOutcome, demoMode, currentRoundIdx]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 select-none py-2">
      {/* Experiment Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16161A] border border-white/8 text-xs font-medium text-[#86868B]">
          <Sparkles className="w-3.5 h-3.5 text-[#2997FF]" />
          <span>Experiment 01 · {currentRound.title}</span>
          <span className="text-white/20">·</span>
          <span className="text-[#34C759] font-mono">Round {currentRoundIdx + 1} of 3</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Element Bond & Valence Synthesis
        </h2>
        <p className="text-xs sm:text-sm text-[#86868B] max-w-lg mx-auto">
          {currentRound.subtext}
        </p>
      </div>

      {/* Participants Status Bar */}
      <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-[#121216] border border-white/8 text-xs">
        <div className="flex items-center space-x-2.5">
          <span className="w-2 h-2 rounded-full bg-[#2997FF]" />
          <span className="text-white font-medium">You</span>
          <span className="text-[#86868B]">
            {myChoice ? '· Locked in' : '· Selecting instinct...'}
          </span>
        </div>

        <div className="flex items-center space-x-2.5">
          <span className="text-[#86868B]">
            {partnerName}: {partnerChoice ? 'Locked in' : 'Selecting...'}
          </span>
          <span className={`w-2 h-2 rounded-full ${partnerChoice ? 'bg-[#34C759]' : 'bg-white/20'}`} />
        </div>
      </div>

      {/* Active Stage: Element Grid vs Countdown vs Detailed Outcome */}
      <AnimatePresence mode="wait">
        {!detailedOutcome && countdown === null && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {EXPANDED_ELEMENTS.map((el) => {
                const isSelected = (selectedId || myChoice) === el.id;
                return (
                  <button
                    key={el.id}
                    onClick={() => handlePick(el.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'bg-[#1C1C22] border-[#2997FF] ring-1 ring-[#2997FF]/50 text-white shadow-lg shadow-[#2997FF]/10'
                        : 'bg-[#121216] border-white/8 text-[#86868B] hover:text-white hover:border-white/20 hover:bg-[#16161C]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="text-base font-bold font-mono px-2 py-0.5 rounded-lg bg-black/40 border border-white/5"
                          style={{ color: el.color }}
                        >
                          {el.symbol}
                        </span>
                        <span className="text-[10px] font-mono text-[#86868B]">Z={el.atomicNumber}</span>
                      </div>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-[#2997FF]" />
                      ) : (
                        <span className="text-[10px] text-white/30 font-mono">
                          {el.valenceElectrons}e⁻
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-white tracking-tight">{el.name}</div>
                    <div className="text-[10px] text-[#86868B] mt-0.5 truncate">{el.tagline}</div>
                  </button>
                );
              })}
            </div>
            <div className="text-center text-[11px] text-[#86868B]">
              Goal: {currentRound.suggestedGoal}
            </div>
          </motion.div>
        )}

        {countdown !== null && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="py-16 text-center space-y-4 rounded-3xl bg-[#121216] border border-white/8"
          >
            <div className="text-xs text-[#86868B] uppercase tracking-widest font-mono font-medium">
              Synthesizing Valence Bond
            </div>
            <div className="text-8xl font-light text-white tracking-tight tabular-nums">
              {countdown}
            </div>
            <p className="text-xs text-[#86868B]">
              Aligning electron densities and molecular orbital symmetries...
            </p>
          </motion.div>
        )}

        {detailedOutcome && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 sm:p-8 rounded-3xl bg-[#121216] border border-white/10 space-y-6 text-center"
          >
            {/* Visual Bonding Orbit */}
            <div className="relative w-64 h-32 mx-auto flex items-center justify-center">
              {/* Atom A */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: -20, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                className="w-16 h-16 rounded-full border border-white/20 flex flex-col items-center justify-center text-white shadow-xl z-10 bg-[#16161C]"
              >
                <span className="text-xl font-bold font-mono text-[#38BDF8]">
                  {detailedOutcome.compoundFormula.slice(0, 2)}
                </span>
              </motion.div>

              {/* Shared Valence Link */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="w-16 h-[3px] bg-gradient-to-r from-[#2997FF] via-white to-[#34C759] rounded-full z-0"
              />

              {/* Atom B */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 20, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                className="w-16 h-16 rounded-full border border-white/20 flex flex-col items-center justify-center text-white shadow-xl z-10 bg-[#16161C]"
              >
                <span className="text-xl font-bold font-mono text-[#34C759]">
                  {detailedOutcome.compoundFormula.slice(-2)}
                </span>
              </motion.div>
            </div>

            {/* Bond Description & Chemical Accuracy */}
            <div className="space-y-2 max-w-lg mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16161C] border border-white/10 text-xs font-medium text-[#2997FF]">
                <span className="font-semibold">{detailedOutcome.compoundFormula}</span>
                <span className="text-white/20">·</span>
                <span>{detailedOutcome.bondType}</span>
                <span className="text-white/20">·</span>
                <span className="text-[#34C759] font-mono">{detailedOutcome.valenceCompatibility}% Resonance</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {detailedOutcome.compoundName}
              </h3>
              <p className="text-xs text-[#86868B] leading-relaxed">
                {detailedOutcome.description}
              </p>
            </div>

            {/* Scientific Real-World Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto pt-2">
              <div className="p-3.5 rounded-2xl bg-[#16161C] border border-white/6 text-xs space-y-1">
                <div className="text-[10px] uppercase font-mono tracking-wider text-[#86868B]">
                  Molecular Geometry
                </div>
                <div className="text-white font-medium text-xs">{detailedOutcome.structure}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#16161C] border border-white/6 text-xs space-y-1">
                <div className="text-[10px] uppercase font-mono tracking-wider text-[#86868B]">
                  Real-World Application
                </div>
                <div className="text-white font-medium text-xs truncate" title={detailedOutcome.realWorldApplication}>
                  {detailedOutcome.realWorldApplication}
                </div>
              </div>
            </div>

            {/* Chemical Fun Fact Card */}
            <div className="p-3.5 rounded-2xl bg-[#16161C]/60 border border-white/6 text-left max-w-lg mx-auto flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#2997FF] shrink-0 mt-0.5" />
              <div className="text-[11px] text-[#86868B] leading-relaxed">
                <span className="text-white font-medium">Chemical Fact: </span>
                {detailedOutcome.chemicalFunFact}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/8 flex items-center justify-center gap-3">
              {currentRoundIdx < BOND_CHALLENGE_ROUNDS.length - 1 ? (
                <button
                  onClick={handleNextRound}
                  className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-white/90 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Next Round: {BOND_CHALLENGE_ROUNDS[currentRoundIdx + 1]?.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={finishExperiment}
                  className="px-8 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:bg-white/90 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Complete Element Bond → Continue to Reaction</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
