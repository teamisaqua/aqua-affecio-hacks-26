'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlassPanel } from '../ui/LiquidGlassPanel';
import { DilemmaState, DilemmaOption, UserRole } from '@/lib/types/chemistry';
import { sound } from '@/lib/sound/soundEffects';
import { Compass, Flame, Heart, Zap, Sparkles, Activity } from 'lucide-react';

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
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Experiment Protocol Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between pb-3 border-b border-white/10 text-xs font-mono gap-2">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded bg-[#2C2C2E] text-white font-bold">EXPERIMENT 02</span>
          <span className="text-white text-sm font-semibold tracking-wide">SYNCHRONIZED DILEMMA</span>
        </div>
        <div className="flex items-center space-x-2 text-[#A1A1A6]">
          <Activity className="w-3.5 h-3.5 text-apple-blue" />
          <span>COGNITIVE HARMONY PROTOCOL</span>
        </div>
      </div>

      {/* Large Typography Scenario Prompt */}
      <div className="text-center space-y-2 py-4">
        <h2 className="text-2xl sm:text-4xl font-semibold text-white tracking-tight leading-snug max-w-2xl mx-auto">
          {state.scenario.prompt}
        </h2>
        <p className="text-xs sm:text-sm text-[#A1A1A6] max-w-md mx-auto">
          {state.scenario.context}
        </p>
      </div>

      {/* Synchronous 3-2-1 Reveal Countdown */}
      <AnimatePresence>
        {countdown !== null && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="p-8 text-center rounded-[24px] bg-[#1C1C1E] border border-apple-blue/50 shadow-apple-card max-w-sm mx-auto"
          >
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#A1A1A6] mb-1">
              REVEALING HARMONY IN
            </div>
            <div className="text-7xl font-light tabular-data text-white font-mono">
              {countdown}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decision Quadrant Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.scenario.options.map((option) => {
          const isMyPick = myChoice === option.id;
          const isPartnerPick = partnerChoice === option.id;
          const isRevealed = countdown === 0 || state.isRevealed;

          return (
            <div
              key={option.id}
              onClick={() => !isRevealed && handleSelect(option.id)}
              className={`p-6 rounded-[20px] transition-all duration-150 border cursor-pointer ${
                isMyPick
                  ? 'bg-[#2C2C2E] border-apple-blue ring-1 ring-apple-blue/50'
                  : 'bg-[#1C1C1E] border-white/10 hover:border-white/20'
              } ${isRevealed && isPartnerPick && !isMyPick ? 'ring-1 ring-apple-green border-apple-green/60' : ''}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-full bg-[#2C2C2E] border border-white/10 flex items-center justify-center">
                  {getOptionIcon(option.archetype)}
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[10px]">
                  {isMyPick && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                      YOUR LOCK
                    </span>
                  )}
                  {isRevealed && isPartnerPick && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      {partnerName.toUpperCase()}&apos;S LOCK
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white tracking-tight mb-1">
                {option.label}
              </h3>
              <p className="text-xs text-[#A1A1A6] leading-relaxed">
                {option.subtext}
              </p>
            </div>
          );
        })}
      </div>

      {/* Lock Status Console */}
      <div className="p-4 rounded-[18px] bg-[#1C1C1E] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-6 text-white">
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${myChoice ? 'bg-apple-green' : 'bg-white/20'}`} />
            <span>YOU: {myChoice ? 'LOCKED' : 'CALCULATING...'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${partnerChoice ? 'bg-apple-green' : 'bg-white/20'}`} />
            <span>{partnerName.toUpperCase()}: {partnerChoice ? 'LOCKED' : 'CALCULATING...'}</span>
          </div>
        </div>

        {demoMode && !partnerChoice && (
          <button
            onClick={() => onChoiceSelect(state.scenario.options[0].id, role === 'observer' ? 'operator' : 'observer')}
            className="apple-btn-secondary !min-h-[32px] !py-1 !px-3 !text-xs font-mono"
          >
            [Demo] Auto-Lock Partner
          </button>
        )}
      </div>

      {/* Reveal Outcome: Behavioral Relationship */}
      {(countdown === 0 || state.isRevealed) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-[20px] border text-center space-y-1.5 ${
            state.userAChoice === state.userBChoice
              ? 'bg-[#1C1C1E] border-apple-green/50'
              : 'bg-[#1C1C1E] border-apple-blue/50'
          }`}
        >
          <div className="flex items-center justify-center gap-2 font-semibold text-white text-base font-mono">
            <Sparkles className="w-4 h-4 text-apple-blue" />
            <span>{state.userAChoice === state.userBChoice ? 'HARMONIC CONVERGENCE' : 'DYNAMIC COMPLEMENTARY TENSION'}</span>
          </div>
          <p className="text-xs text-[#A1A1A6] max-w-md mx-auto">
            {state.userAChoice === state.userBChoice
              ? 'Identical instinctual frequency. High baseline decision alignment.'
              : 'Complementary polarity: differing instinctual pathways produce balanced tension.'}
          </p>
        </motion.div>
      )}
    </div>
  );
};
