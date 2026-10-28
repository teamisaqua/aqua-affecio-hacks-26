'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DilemmaState, DilemmaOption, UserRole } from '@/lib/types/chemistry';
import { sound } from '@/lib/sound/soundEffects';
import { Compass, Flame, Heart, Zap, Sparkles, Check } from 'lucide-react';

interface SynchronizedDilemmaProps {
  role: UserRole;
  userAName: string;
  userBName: string;
  state: DilemmaState;
  onChoiceSelect: (choiceId: string, forRole?: UserRole) => void;
  onComplete: () => void;
  demoMode?: boolean;
}

export const SynchronizedDilemma: React.FC<SynchronizedDilemmaProps> = ({
  role,
  userAName,
  userBName,
  state,
  onChoiceSelect,
  onComplete,
  demoMode = false,
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);

  const isExplore = role === 'explore' || role === 'observer';
  const myChoice = isExplore ? state.userAChoice : state.userBChoice;
  const partnerChoice = isExplore ? state.userBChoice : state.userAChoice;
  const partnerName = isExplore ? userBName : userAName;

  const bothSelected = Boolean(state.userAChoice && state.userBChoice);

  useEffect(() => {
    if (bothSelected && !state.isRevealed && countdown === null) {
      setCountdown(3);
      sound.playCountdownBeep(false);

      const timer3 = setTimeout(() => {
        setCountdown(2);
        sound.playCountdownBeep(false);
      }, 1000);

      const timer2 = setTimeout(() => {
        setCountdown(1);
        sound.playCountdownBeep(true);
      }, 2000);

      const timer1 = setTimeout(() => {
        setCountdown(0);
        sound.playSuccessChime();
        setTimeout(() => {
          onComplete();
        }, 3200);
      }, 3000);

      return () => {
        clearTimeout(timer3);
        clearTimeout(timer2);
        clearTimeout(timer1);
      };
    }
  }, [bothSelected, state.isRevealed, countdown, onComplete]);

  const handleSelect = (optionId: string) => {
    sound.playGlassClick();
    onChoiceSelect(optionId, role);
  };

  const getOptionIcon = (archetype: DilemmaOption['archetype']) => {
    switch (archetype) {
      case 'spontaneous':
        return <Flame className="w-4 h-4 text-apple-amber" />;
      case 'calculated':
        return <Compass className="w-4 h-4 text-apple-blue" />;
      case 'adventurous':
        return <Zap className="w-4 h-4 text-apple-red" />;
      case 'intimate':
        return <Heart className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 select-none">
      {/* Experiment Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8">
        <div className="flex items-center space-x-2.5">
          <span className="px-2.5 py-1 rounded-full bg-[#171717] border border-white/8 text-white text-xs font-semibold">
            Experiment 03
          </span>
          <span className="text-white text-sm font-semibold tracking-tight">
            Instinct Alignment
          </span>
        </div>

        <div className="text-xs text-[#A1A1A6]">
          {bothSelected ? 'Both locked in' : 'Choose privately'}
        </div>
      </div>

      {/* Scenario Prompt */}
      <div className="text-center space-y-2 py-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight leading-snug max-w-xl mx-auto">
          {state.scenario.prompt}
        </h2>
        <p className="text-xs sm:text-sm text-[#A1A1A6] max-w-md mx-auto">
          {state.scenario.context}
        </p>
      </div>

      {/* Participants Status Bar */}
      <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-[#111111] border border-white/8 text-xs">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${myChoice ? 'bg-apple-blue' : 'bg-white/20'}`} />
          <span className="text-white font-medium">You</span>
          <span className="text-[#A1A1A6]">{myChoice ? '· Chosen' : '· Thinking...'}</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[#A1A1A6]">
            {partnerName}: {partnerChoice ? 'Chosen' : 'Thinking...'}
          </span>
          <span className={`w-2 h-2 rounded-full ${partnerChoice ? 'bg-apple-green' : 'bg-white/20'}`} />
        </div>
      </div>

      {/* Synchronous 3-2-1 Reveal Countdown */}
      <AnimatePresence>
        {countdown !== null && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="p-8 text-center rounded-3xl bg-[#141416] border border-apple-blue/40 shadow-2xl max-w-xs mx-auto"
          >
            <div className="text-xs uppercase tracking-wider text-[#A1A1A6] mb-1">
              Revealing in
            </div>
            <div className="text-7xl font-light tabular-nums text-white">
              {countdown}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decision 4-Quadrant Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {state.scenario.options.map((option) => {
          const isMyPick = myChoice === option.id;
          const isPartnerPick = partnerChoice === option.id;
          const isRevealed = countdown === 0 || state.isRevealed;

          let cardStyle = 'bg-[#141416] border-white/8 text-[#A1A1A6] hover:border-white/15';

          if (isMyPick && !isRevealed) {
            cardStyle = 'bg-[#1C1C1E] border-apple-blue ring-1 ring-apple-blue/50 text-white';
          } else if (isRevealed) {
            if (isMyPick && isPartnerPick) {
              cardStyle = 'bg-[#1C1C1E] border-emerald-500 ring-2 ring-emerald-500/40 text-white';
            } else if (isMyPick) {
              cardStyle = 'bg-[#1C1C1E] border-apple-blue text-white';
            } else if (isPartnerPick) {
              cardStyle = 'bg-[#1C1C1E] border-purple-400 text-white';
            } else {
              cardStyle = 'bg-[#111111] opacity-40 border-white/5 text-[#A1A1A6]';
            }
          }

          return (
            <div
              key={option.id}
              onClick={() => !isRevealed && handleSelect(option.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[120px] ${cardStyle}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getOptionIcon(option.archetype)}
                    <span className="text-sm font-semibold text-white">{option.label}</span>
                  </div>

                  {/* Pick Badges */}
                  <div className="flex items-center space-x-1.5">
                    {isMyPick && (
                      <span className="px-2 py-0.5 rounded-full bg-apple-blue/20 text-apple-blue text-[10px] font-semibold">
                        You
                      </span>
                    )}
                    {isRevealed && isPartnerPick && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-semibold">
                        {partnerName}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#A1A1A6] leading-relaxed">
                  {option.subtext}
                </p>
              </div>

              {isRevealed && isMyPick && isPartnerPick && (
                <div className="mt-3 pt-2 border-t border-emerald-500/30 flex items-center text-xs text-apple-green font-medium gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Synchronized Instinct
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reveal Verdict Banner */}
      {countdown === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-[#141416] border border-white/10 text-center space-y-1"
        >
          <div className="text-base font-semibold text-white tracking-tight flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-apple-blue" />
            {myChoice === partnerChoice ? 'Synchronous Instinct' : 'Complementary Balance'}
          </div>
          <p className="text-xs text-[#A1A1A6]">
            {myChoice === partnerChoice
              ? 'You both chose the exact same pathway without speaking.'
              : 'Different impulses create dynamic counterweights in your connection.'}
          </p>
        </motion.div>
      )}
    </div>
  );
};
