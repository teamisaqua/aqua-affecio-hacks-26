'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ELEMENTS, synthesizeBond } from '@/lib/compound/bondElements';
import { BondResult, UserRole } from '@/lib/types/chemistry';
import { sound } from '@/lib/sound/soundEffects';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [bondResult, setBondResult] = useState<BondResult | null>(null);

  const isExplore = role === 'explore' || role === 'observer';
  const myChoice = isExplore ? userAChoice : userBChoice;
  const partnerChoice = isExplore ? userBChoice : userAChoice;

  const partnerName = isExplore ? userBName : userAName;

  const handlePick = (id: string) => {
    sound.playSliderTick(480);
    setSelectedId(id);
    onSelectElement(id);
  };

  // When both users have chosen, trigger the 3-2-1 countdown reveal
  useEffect(() => {
    if (userAChoice && userBChoice && countdown === null && !bondResult) {
      setCountdown(3);
      sound.playCountdownBeep(false);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(timer);
            const synthesized = synthesizeBond(userAChoice, userBChoice);
            setBondResult(synthesized);
            sound.playSuccessChime();
            return null;
          }
          sound.playCountdownBeep(prev === 2);
          return prev - 1;
        });
      }, 900);

      return () => clearInterval(timer);
    }
  }, [userAChoice, userBChoice, countdown, bondResult]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 select-none">
      {/* Experiment Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171717] border border-white/8 text-xs font-medium text-[#A1A1A6]">
          <Sparkles className="w-3.5 h-3.5 text-apple-blue" />
          <span>Experiment 01</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Element Bond
        </h2>
        <p className="text-sm text-[#A1A1A6] max-w-md mx-auto">
          Choose an elemental instinct. When both of you choose, your bond will form.
        </p>
      </div>

      {/* Participants Bar: You and Partner */}
      <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-[#111111] border border-white/8 text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-apple-blue" />
          <span className="text-white font-medium">You</span>
          <span className="text-[#A1A1A6]">
            {myChoice ? '· Locked in' : '· Choosing...'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[#A1A1A6]">
            {partnerName}: {partnerChoice ? 'Locked in' : 'Choosing...'}
          </span>
          <span className={`w-2 h-2 rounded-full ${partnerChoice ? 'bg-apple-green' : 'bg-white/20'}`} />
        </div>
      </div>

      {/* Active Stage: Selection vs Countdown vs Reveal */}
      <AnimatePresence mode="wait">
        {!bondResult && countdown === null && (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            {ELEMENTS.map((el) => {
              const isSelected = (selectedId || myChoice) === el.id;
              return (
                <button
                  key={el.id}
                  onClick={() => handlePick(el.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#1C1C1E] border-apple-blue ring-1 ring-apple-blue/50 text-white'
                      : 'bg-[#141416] border-white/8 text-[#A1A1A6] hover:text-white hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-lg font-bold font-mono px-2 py-0.5 rounded-lg bg-black/40"
                      style={{ color: el.color }}
                    >
                      {el.symbol}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-apple-blue" />}
                  </div>
                  <div className="text-sm font-semibold text-white">{el.name}</div>
                  <div className="text-xs text-[#A1A1A6] mt-0.5">{el.tag}</div>
                </button>
              );
            })}
          </motion.div>
        )}

        {countdown !== null && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="py-16 text-center space-y-4 rounded-3xl bg-[#111111] border border-white/8"
          >
            <div className="text-xs text-[#A1A1A6] uppercase tracking-wider font-medium">
              Synthesizing Bond
            </div>
            <div className="text-8xl font-light text-white tracking-tight tabular-nums">
              {countdown}
            </div>
            <p className="text-xs text-[#A1A1A6]">
              Aligning elemental valences...
            </p>
          </motion.div>
        )}

        {bondResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 md:p-8 rounded-3xl bg-[#141416] border border-white/10 space-y-6 text-center"
          >
            {/* Visual Bonding Orbit */}
            <div className="relative w-48 h-36 mx-auto flex items-center justify-center">
              {/* Left Atom */}
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: -16, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="w-16 h-16 rounded-full border border-white/20 flex flex-col items-center justify-center text-white shadow-xl z-10"
                style={{ backgroundColor: '#1C1C1E' }}
              >
                <span className="text-xl font-bold font-mono" style={{ color: bondResult.elementA.color }}>
                  {bondResult.elementA.symbol}
                </span>
                <span className="text-[10px] text-[#A1A1A6]">{bondResult.elementA.name}</span>
              </motion.div>

              {/* Central Shared Valence Bond */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="w-14 h-[3px] bg-gradient-to-r from-apple-blue via-white to-apple-green rounded-full z-0"
              />

              {/* Right Atom */}
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 16, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="w-16 h-16 rounded-full border border-white/20 flex flex-col items-center justify-center text-white shadow-xl z-10"
                style={{ backgroundColor: '#1C1C1E' }}
              >
                <span className="text-xl font-bold font-mono" style={{ color: bondResult.elementB.color }}>
                  {bondResult.elementB.symbol}
                </span>
                <span className="text-[10px] text-[#A1A1A6]">{bondResult.elementB.name}</span>
              </motion.div>
            </div>

            {/* Bond Description */}
            <div className="space-y-1.5 max-w-md mx-auto">
              <div className="inline-block px-3 py-1 rounded-full bg-[#1C1C1E] border border-white/10 text-xs font-medium text-apple-blue">
                {bondResult.bondType} Bond · {bondResult.formula}
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {bondResult.bondName}
              </h3>
              <p className="text-xs text-[#A1A1A6] leading-relaxed pt-1">
                {bondResult.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/8 flex justify-center">
              <button
                onClick={() => {
                  sound.playSuccessChime();
                  onComplete(bondResult);
                }}
                className="apple-btn-primary px-8"
              >
                <span>Continue to Reaction</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
