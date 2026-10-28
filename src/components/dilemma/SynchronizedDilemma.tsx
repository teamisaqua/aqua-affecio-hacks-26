'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlassPanel } from '../ui/LiquidGlassPanel';
import { DilemmaState, DilemmaOption, UserRole } from '@/lib/types/chemistry';
import { sound } from '@/lib/sound/soundEffects';
import { Sparkles, Check, Compass, Eye, Zap, Flame, Heart } from 'lucide-react';

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

  // Trigger countdown when both lock in
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
        // Advance after reveal
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
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'calculated':
        return <Compass className="w-5 h-5 text-lab-cyan" />;
      case 'adventurous':
        return <Zap className="w-5 h-5 text-lab-pink" />;
      case 'intimate':
        return <Heart className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Dilemma Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lab-purple/20 border border-lab-purple/40 text-lab-purple text-xs font-mono uppercase tracking-widest">
          <Eye className="w-3.5 h-3.5" /> Synchronized Dilemma
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          {state.scenario.prompt}
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          {state.scenario.context}
        </p>
      </div>

      {/* Countdown Overlay when both users lock in */}
      <AnimatePresence>
        {countdown !== null && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="p-8 text-center rounded-2xl glass-panel border-glow-cyan shadow-glow-cyan"
          >
            <div className="text-xs uppercase tracking-widest text-lab-cyan font-mono mb-2">
              REVEALING HARMONY IN
            </div>
            <div className="text-7xl font-extrabold font-mono text-white tracking-wider animate-pulse">
              {countdown}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dilemma Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.scenario.options.map((option) => {
          const isMyPick = myChoice === option.id;
          const isPartnerPick = partnerChoice === option.id;
          const isRevealed = countdown === 0 || state.isRevealed;

          let cardGlow: 'none' | 'cyan' | 'pink' | 'purple' = 'none';
          if (isMyPick) cardGlow = 'cyan';
          if (isRevealed && isPartnerPick) cardGlow = isMyPick ? 'purple' : 'pink';

          return (
            <LiquidGlassPanel
              key={option.id}
              onClick={() => !isRevealed && handleSelect(option.id)}
              glow={cardGlow}
              interactive={!isRevealed}
              className={`p-6 transition-all ${
                isMyPick ? 'ring-2 ring-lab-cyan/60 bg-white/[0.08]' : ''
              } ${isRevealed && isPartnerPick && !isMyPick ? 'ring-2 ring-lab-pink/60' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 mb-3">
                  {getOptionIcon(option.archetype)}
                </div>

                <div className="flex items-center gap-2">
                  {isMyPick && (
                    <span className="px-2 py-0.5 rounded-full bg-lab-cyan/20 border border-lab-cyan/40 text-lab-cyan text-[10px] font-mono font-bold">
                      YOUR CHOICE
                    </span>
                  )}
                  {isRevealed && isPartnerPick && (
                    <span className="px-2 py-0.5 rounded-full bg-lab-pink/20 border border-lab-pink/40 text-lab-pink text-[10px] font-mono font-bold">
                      {partnerName}&apos;S CHOICE
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white tracking-wide mb-1">
                {option.label}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {option.subtext}
              </p>
            </LiquidGlassPanel>
          );
        })}
      </div>

      {/* Lock-in Status Bar */}
      <div className="p-4 rounded-xl glass-panel flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-6 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${myChoice ? 'bg-emerald-400 shadow-glow-cyan' : 'bg-slate-600'}`} />
            <span className="text-slate-300">You: {myChoice ? 'Locked In' : 'Deciding...'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${partnerChoice ? 'bg-emerald-400 shadow-glow-cyan' : 'bg-slate-600'}`} />
            <span className="text-slate-300">{partnerName}: {partnerChoice ? 'Locked In' : 'Deciding...'}</span>
          </div>
        </div>

        {/* Demo Mode Quick Lock for partner */}
        {demoMode && !partnerChoice && (
          <button
            onClick={() => onChoiceSelect(state.scenario.options[0].id, role === 'observer' ? 'operator' : 'observer')}
            className="px-3 py-1 rounded-lg text-xs font-mono bg-lab-purple/20 text-purple-300 border border-lab-purple/40 hover:bg-lab-purple/30 transition-all"
          >
            [Demo] Auto-Lock Partner Pick
          </button>
        )}
      </div>

      {/* Reveal Outcome Banner */}
      {(countdown === 0 || state.isRevealed) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl border text-center space-y-2 ${
            state.userAChoice === state.userBChoice
              ? 'bg-emerald-950/40 border-emerald-500/40 shadow-glow-cyan'
              : 'bg-purple-950/40 border-purple-500/40 shadow-glow-purple'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-lab-cyan" />
            <span className="text-lg font-bold text-white tracking-wider">
              {state.userAChoice === state.userBChoice ? 'SYNCHRONIZED MINDS' : 'DYNAMIC PERSPECTIVES'}
            </span>
          </div>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            {state.userAChoice === state.userBChoice
              ? 'You both chose identical spontaneous frequencies! High instinctual convergence.'
              : 'Complementary polarities create balance. Differing instincts reveal diverse depth.'}
          </p>
        </motion.div>
      )}
    </div>
  );
};
