'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DilemmaState, DilemmaOption, UserRole } from '@/lib/types/chemistry';
import { sound } from '@/lib/sound/soundEffects';
import { Compass, Flame, Heart, Zap, Sparkles, Check, ArrowRight } from 'lucide-react';

interface SynchronizedDilemmaProps {
  role: UserRole;
  userAName: string;
  userBName: string;
  state: DilemmaState;
  onChoiceSelect: (choiceId: string, forRole?: UserRole) => void;
  onAdvanceScenario?: () => void;
  onComplete: () => void;
  demoMode?: boolean;
}

export const SynchronizedDilemma: React.FC<SynchronizedDilemmaProps> = ({
  role,
  userAName,
  userBName,
  state,
  onChoiceSelect,
  onAdvanceScenario,
  onComplete,
  demoMode = false,
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const isCountingDownRef = useRef(false);

  const isExplore = role === 'explore' || role === 'observer';
  const myChoice = isExplore ? state.userAChoice : state.userBChoice;
  const partnerChoice = isExplore ? state.userBChoice : state.userAChoice;
  const partnerName = isExplore ? userBName : userAName;

  const bothSelected = Boolean(state.userAChoice && state.userBChoice);
  const currentIndex = state.scenarioIndex ?? 0;
  const totalCount = state.totalScenarios ?? 3;
  const isFinalScenario = currentIndex >= totalCount - 1;

  // Reset local state if scenarioIndex changes
  useEffect(() => {
    isCountingDownRef.current = false;
    setCountdown(null);
    setRevealed(false);
  }, [state.scenarioIndex]);

  // When both users choose, start the 3-2-1 reveal countdown
  useEffect(() => {
    if (bothSelected && !revealed && !isCountingDownRef.current) {
      isCountingDownRef.current = true;
      setCountdown(3);
      sound.playCountdownBeep(false);

      const timer3 = setTimeout(() => {
        setCountdown(2);
        sound.playCountdownBeep(false);
      }, 750);

      const timer2 = setTimeout(() => {
        setCountdown(1);
        sound.playCountdownBeep(true);
      }, 1500);

      const timer1 = setTimeout(() => {
        setCountdown(0);
        setRevealed(true);
        sound.playSuccessChime();

        // After reveal, auto-advance or complete
        setTimeout(() => {
          if (isFinalScenario) {
            onComplete();
          } else if (onAdvanceScenario) {
            isCountingDownRef.current = false;
            setCountdown(null);
            setRevealed(false);
            onAdvanceScenario();
          }
        }, 2400);
      }, 2250);

      return () => {
        clearTimeout(timer3);
        clearTimeout(timer2);
        clearTimeout(timer1);
        isCountingDownRef.current = false;
      };
    }
  }, [bothSelected, revealed, isFinalScenario, onAdvanceScenario, onComplete]);

  const handleSelect = (optionId: string) => {
    sound.playGlassClick();
    onChoiceSelect(optionId, role);
  };

  const getOptionIcon = (archetype: DilemmaOption['archetype']) => {
    switch (archetype) {
      case 'spontaneous':
        return <Flame className="w-4 h-4 text-[#FF9F0A]" />;
      case 'calculated':
        return <Compass className="w-4 h-4 text-[#2997FF]" />;
      case 'adventurous':
        return <Zap className="w-4 h-4 text-[#FF453A]" />;
      case 'intimate':
        return <Heart className="w-4 h-4 text-[#BF5AF2]" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5 select-none">
      {/* Experiment Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8">
        <div className="flex items-center space-x-2.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#16161A] border border-white/8 text-white text-xs font-semibold font-mono">
            03 Dilemma
          </span>
          <span className="text-white text-xs sm:text-sm font-semibold tracking-tight">
            Decision {currentIndex + 1} of {totalCount}
          </span>
        </div>

        <div className="text-xs text-[#86868B] font-mono">
          {bothSelected ? 'Both Locked In' : 'Private Selection'}
        </div>
      </div>

      {/* Scenario Prompt */}
      <div className="text-center space-y-1.5 py-1">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-snug max-w-xl mx-auto">
          {state.scenario.prompt}
        </h2>
        <p className="text-xs text-[#86868B] max-w-md mx-auto">
          {state.scenario.context}
        </p>
      </div>

      {/* Participants Status Bar */}
      <div className="flex items-center justify-between px-5 py-2.5 rounded-2xl bg-[#111114] border border-white/8 text-xs">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${myChoice ? 'bg-[#2997FF]' : 'bg-white/20'}`} />
          <span className="text-white font-medium">You</span>
          <span className="text-[#86868B]">{myChoice ? '· Chosen' : '· Deciding...'}</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[#86868B]">
            {partnerName}: {partnerChoice ? 'Chosen' : 'Deciding...'}
          </span>
          <span className={`w-2 h-2 rounded-full ${partnerChoice ? 'bg-[#34C759]' : 'bg-white/20'}`} />
        </div>
      </div>

      {/* Synchronous 3-2-1 Reveal Countdown */}
      <AnimatePresence>
        {countdown !== null && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="p-6 text-center rounded-3xl bg-[#141416] border border-[#2997FF]/40 shadow-2xl max-w-xs mx-auto"
          >
            <div className="text-xs uppercase tracking-wider text-[#86868B] mb-1 font-mono">
              Revealing Answers In
            </div>
            <div className="text-6xl font-light tabular-nums text-white">
              {countdown}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decision 4-Quadrant Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {state.scenario.options.map((option) => {
          const isMyPick = myChoice === option.id;
          const isPartnerPick = partnerChoice === option.id;
          const isRevealed = countdown === 0 || revealed;

          let cardStyle = 'bg-[#121215] border-white/8 text-[#86868B] hover:border-white/15';

          if (isMyPick && !isRevealed) {
            cardStyle = 'bg-[#18181D] border-[#2997FF] ring-1 ring-[#2997FF]/50 text-white';
          } else if (isRevealed) {
            if (isMyPick && isPartnerPick) {
              cardStyle = 'bg-[#141E16] border-[#34C759] ring-2 ring-[#34C759]/40 text-white';
            } else if (isMyPick) {
              cardStyle = 'bg-[#18181D] border-[#2997FF] text-white';
            } else if (isPartnerPick) {
              cardStyle = 'bg-[#18181D] border-[#BF5AF2] text-white';
            } else {
              cardStyle = 'bg-[#0E0E10] opacity-35 border-white/4 text-[#86868B]';
            }
          }

          return (
            <div
              key={option.id}
              onClick={() => !isRevealed && handleSelect(option.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${cardStyle}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getOptionIcon(option.archetype)}
                    <span className="text-xs sm:text-sm font-semibold text-white">{option.label}</span>
                  </div>

                  {/* Pick Badges */}
                  <div className="flex items-center space-x-1.5">
                    {isMyPick && (
                      <span className="px-2 py-0.5 rounded-full bg-[#2997FF]/20 text-[#2997FF] text-[10px] font-semibold font-mono">
                        You
                      </span>
                    )}
                    {isRevealed && isPartnerPick && (
                      <span className="px-2 py-0.5 rounded-full bg-[#BF5AF2]/20 text-[#BF5AF2] text-[10px] font-semibold font-mono">
                        {partnerName}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#86868B] leading-relaxed">
                  {option.subtext}
                </p>
              </div>

              {isRevealed && isMyPick && isPartnerPick && (
                <div className="mt-2.5 pt-2 border-t border-[#34C759]/30 flex items-center text-xs text-[#34C759] font-medium gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Consensus Match
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reveal Verdict Banner */}
      {countdown === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-[#141416] border border-white/10 text-center space-y-1"
        >
          <div className="text-sm font-semibold text-white tracking-tight flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#2997FF]" />
            {myChoice === partnerChoice ? 'Direct Consensus Match' : 'Complementary Perspectives'}
          </div>
          <p className="text-xs text-[#86868B]">
            {myChoice === partnerChoice
              ? 'Both participants made the identical instinctual choice independently.'
              : 'Different instincts create dynamic balance rather than friction.'}
          </p>
        </motion.div>
      )}
    </div>
  );
};
