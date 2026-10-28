'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlassPanel } from '../ui/LiquidGlassPanel';
import { DilemmaState, DilemmaOption, UserRole } from '@/lib/types/chemistry';
import { sound } from '@/lib/sound/soundEffects';
import { Compass, Flame, Heart, Zap, Sparkles } from 'lucide-react';

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

  const myChoice = role === 'observer' ? state.userAChoice : state.userBChoice;
  const partnerChoice = role === 'observer' ? state.userBChoice : state.userAChoice;
  const partnerName = role === 'observer' ? userBName : userAName;

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
        sound.playCountdownBeep(false);
      }, 2000);

      const timer1 = setTimeout(() => {
        setCountdown(0);
        sound.playCountdownBeep(true);
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
        return <Flame className="w-4 h-4 text-apple-amber" strokeWidth={1.75} />;
      case 'calculated':
        return <Compass className="w-4 h-4 text-apple-blue" strokeWidth={1.75} />;
      case 'adventurous':
        return <Zap className="w-4 h-4 text-apple-red" strokeWidth={1.75} />;
      case 'intimate':
        return <Heart className="w-4 h-4 text-purple-400" strokeWidth={1.75} />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Strict Visual Hierarchy: Experiment Number -> Title -> Short Objective */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1C1E] border border-white/10 text-[#A1A1A6] text-xs font-medium uppercase tracking-wider">
          <span>Experiment 02 of 02</span>
          <span className="text-white/20">·</span>
          <span>Intuitive Synchronization</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          {state.scenario.prompt}
        </h2>
        <p className="text-xs sm:text-sm text-[#A1A1A6] max-w-md mx-auto leading-relaxed">
          {state.scenario.context}
        </p>
      </div>

      {/* Countdown Reveal Presentation */}
      <AnimatePresence>
        {countdown !== null && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="p-8 text-center rounded-[20px] bg-[#1C1C1E] border border-apple-blue/40"
          >
            <div className="text-xs uppercase tracking-wider text-[#A1A1A6] mb-1 font-medium">
              Revealing Selections
            </div>
            <div className="text-6xl font-light tabular-data text-white">
              {countdown}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dilemma Option Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {state.scenario.options.map((option) => {
          const isMyPick = myChoice === option.id;
          const isPartnerPick = partnerChoice === option.id;
          const isRevealed = countdown === 0 || state.isRevealed;

          return (
            <LiquidGlassPanel
              key={option.id}
              onClick={() => !isRevealed && handleSelect(option.id)}
              interactive={!isRevealed}
              className={`p-5 transition-all ${
                isMyPick ? 'ring-2 ring-apple-blue bg-[#2C2C2E]' : 'bg-[#1C1C1E]'
              } ${isRevealed && isPartnerPick && !isMyPick ? 'ring-2 ring-apple-green bg-[#2C2C2E]' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-full bg-[#2C2C2E] border border-white/10 flex items-center justify-center mb-3">
                  {getOptionIcon(option.archetype)}
                </div>

                <div className="flex items-center gap-1.5">
                  {isMyPick && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-medium border border-blue-500/30">
                      Your Choice
                    </span>
                  )}
                  {isRevealed && isPartnerPick && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-medium border border-emerald-500/30">
                      {partnerName}&apos;s Choice
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-base font-semibold text-white tracking-tight mb-1">
                {option.label}
              </h3>
              <p className="text-xs text-[#A1A1A6] leading-relaxed">
                {option.subtext}
              </p>
            </LiquidGlassPanel>
          );
        })}
      </div>

      {/* Lock-in Status Bar */}
      <div className="p-4 rounded-[18px] bg-[#1C1C1E] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-5 text-white">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${myChoice ? 'bg-apple-green' : 'bg-slate-600'}`} />
            <span>You: {myChoice ? 'Locked In' : 'Selecting...'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${partnerChoice ? 'bg-apple-green' : 'bg-slate-600'}`} />
            <span>{partnerName}: {partnerChoice ? 'Locked In' : 'Selecting...'}</span>
          </div>
        </div>

        {demoMode && !partnerChoice && (
          <button
            onClick={() => onChoiceSelect(state.scenario.options[0].id, role === 'observer' ? 'operator' : 'observer')}
            className="apple-btn-secondary !min-h-[32px] !py-1 !px-3 !text-xs"
          >
            Simulate Partner Choice
          </button>
        )}
      </div>

      {/* Reveal Outcome */}
      {(countdown === 0 || state.isRevealed) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-[20px] border text-center space-y-1.5 ${
            state.userAChoice === state.userBChoice
              ? 'bg-[#1C1C1E] border-apple-green/40'
              : 'bg-[#1C1C1E] border-apple-blue/40'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 font-semibold text-white text-base">
            <Sparkles className="w-4 h-4 text-apple-blue" />
            <span>{state.userAChoice === state.userBChoice ? 'Synchronized Consensus' : 'Complementary Perspectives'}</span>
          </div>
          <p className="text-xs text-[#A1A1A6] max-w-md mx-auto">
            {state.userAChoice === state.userBChoice
              ? 'Direct instinctive alignment across both participants.'
              : 'Differing choices reflect balanced polarities and depth.'}
          </p>
        </motion.div>
      )}
    </div>
  );
};
