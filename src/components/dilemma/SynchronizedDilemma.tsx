'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DilemmaState, DilemmaOption, UserRole } from '@/lib/types/chemistry';
import { DILEMMAS_40, ExtendedDilemmaScenario } from '@/lib/data/experiments/dilemmas40';
import { sound } from '@/lib/sound/soundEffects';
import {
  Compass,
  Flame,
  Heart,
  Zap,
  Sparkles,
  Check,
  ArrowRight,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Users,
} from 'lucide-react';

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

  // Category filter state for 42 scenarios
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [scenarioIndexOffset, setScenarioIndexOffset] = useState<number>(0);

  const isExplore = role === 'explore' || role === 'observer';
  const myChoice = isExplore ? state.userAChoice : state.userBChoice;
  const partnerChoice = isExplore ? state.userBChoice : state.userAChoice;
  const partnerName = isExplore ? userBName : userAName;

  const bothSelected = Boolean(state.userAChoice && state.userBChoice);
  const currentIndex = (state.scenarioIndex ?? 0) + scenarioIndexOffset;

  // Filtered pool from 42 dilemmas
  const filteredDilemmas = React.useMemo(() => {
    if (selectedCategory === 'All') return DILEMMAS_40;
    return DILEMMAS_40.filter((d) => d.category === selectedCategory);
  }, [selectedCategory]);

  const activeDilemma: ExtendedDilemmaScenario =
    filteredDilemmas[currentIndex % filteredDilemmas.length] || {
      id: state.scenario.id,
      prompt: state.scenario.prompt,
      category: 'spontaneous',
      categoryLabel: 'Curated Decision',
      context: state.scenario.context,
      options: state.scenario.options as any,
      discussionSpark: 'What instinct drove your choice in this moment?',
    };

  const totalCount = Math.min(filteredDilemmas.length, 5);
  const isFinalScenario = (state.scenarioIndex ?? 0) >= totalCount - 1;

  // Reset local state if scenarioIndex changes
  useEffect(() => {
    isCountingDownRef.current = false;
    setCountdown(null);
    setRevealed(false);
  }, [state.scenarioIndex, scenarioIndexOffset]);

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
        }, 3200);
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

  const getOptionIcon = (archetype: string) => {
    switch (archetype) {
      case 'spontaneous':
        return <Flame className="w-4 h-4 text-[#FB7185]" />;
      case 'calculated':
        return <Compass className="w-4 h-4 text-[#38BDF8]" />;
      case 'adventurous':
        return <Zap className="w-4 h-4 text-[#FB7185]" />;
      case 'intimate':
      case 'collaborative':
        return <Heart className="w-4 h-4 text-[#A78BFA]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#4ADE80]" />;
    }
  };

  const categories = [
    'All',
    'spontaneous',
    'communication',
    'conflict',
    'teamwork',
    'lifestyle',
    'travel',
    'creative',
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 select-none">
      {/* Experiment Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#18181D] border border-white/10 text-[#F5F5F7] text-xs font-semibold font-mono">
            03 Dilemma
          </span>
          <span className="text-[#F5F5F7] text-xs sm:text-sm font-semibold tracking-tight">
            Decision {(state.scenarioIndex ?? 0) + 1} of {totalCount}
          </span>
          <span className="text-[10px] font-mono text-[#A1A1AA] px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
            42 Dilemmas Bank
          </span>
        </div>

        <div className="text-xs text-[#A1A1AA] font-mono">
          {bothSelected ? 'Both Locked In' : 'Private Selection'}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setScenarioIndexOffset(0);
              setRevealed(false);
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-medium capitalize transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#F5F5F7] text-[#09090B] font-semibold shadow-sm'
                : 'bg-[#111114] text-[#A1A1AA] hover:text-[#F5F5F7] border border-white/10 hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scenario Prompt */}
      <div className="text-center space-y-1.5 py-2">
        <div className="text-[10px] font-mono uppercase tracking-widest text-[#38BDF8]">
          {activeDilemma.categoryLabel || activeDilemma.category}
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-[#F5F5F7] tracking-tight leading-snug max-w-xl mx-auto">
          {activeDilemma.prompt}
        </h2>
        <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
          {activeDilemma.context}
        </p>
      </div>

      {/* Participants Status Bar */}
      <div className="flex items-center justify-between px-5 py-2.5 rounded-2xl bg-[#111114] border border-white/10 text-xs">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${myChoice ? 'bg-[#38BDF8]' : 'bg-white/20'}`} />
          <span className="text-[#F5F5F7] font-medium">You</span>
          <span className="text-[#A1A1AA]">{myChoice ? '· Chosen' : '· Deciding...'}</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[#A1A1AA]">
            {partnerName}: {partnerChoice ? 'Chosen' : 'Deciding...'}
          </span>
          <span className={`w-2 h-2 rounded-full ${partnerChoice ? 'bg-[#4ADE80]' : 'bg-white/20'}`} />
        </div>
      </div>

      {/* Synchronous 3-2-1 Reveal Countdown */}
      <AnimatePresence>
        {countdown !== null && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="p-6 text-center rounded-3xl bg-[#111114] border border-[#38BDF8]/40 shadow-2xl max-w-xs mx-auto"
          >
            <div className="text-xs uppercase tracking-wider text-[#A1A1AA] mb-1 font-mono">
              Revealing Answers In
            </div>
            <div className="text-6xl font-light tabular-nums text-[#F5F5F7]">
              {countdown}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decision 4-Quadrant Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {activeDilemma.options.map((option) => {
          const isMyPick = myChoice === option.id;
          const isPartnerPick = partnerChoice === option.id;
          const isRevealed = countdown === 0 || revealed;

          let cardStyle = 'bg-[#111114] border-white/10 text-[#A1A1AA] hover:border-white/20';

          if (isMyPick && !isRevealed) {
            cardStyle = 'bg-[#18181D] border-[#38BDF8] ring-1 ring-[#38BDF8]/50 text-[#F5F5F7]';
          } else if (isRevealed) {
            if (isMyPick && isPartnerPick) {
              cardStyle = 'bg-[#111114] border-[#4ADE80] ring-1 ring-[#4ADE80]/40 text-[#F5F5F7]';
            } else if (isMyPick) {
              cardStyle = 'bg-[#18181D] border-[#38BDF8] text-[#F5F5F7]';
            } else if (isPartnerPick) {
              cardStyle = 'bg-[#18181D] border-[#A78BFA] text-[#F5F5F7]';
            } else {
              cardStyle = 'bg-[#09090B] opacity-40 border-white/5 text-[#71717A]';
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
                    <span className="text-xs sm:text-sm font-semibold text-[#F5F5F7]">{option.label}</span>
                  </div>

                  {/* Pick Badges */}
                  <div className="flex items-center space-x-1.5">
                    {isMyPick && (
                      <span className="px-2 py-0.5 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8] text-[10px] font-semibold font-mono">
                        You
                      </span>
                    )}
                    {isRevealed && isPartnerPick && (
                      <span className="px-2 py-0.5 rounded-full bg-[#A78BFA]/15 border border-[#A78BFA]/30 text-[#A78BFA] text-[10px] font-semibold font-mono">
                        {partnerName}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  {option.subtext}
                </p>
              </div>

              {isRevealed && isMyPick && isPartnerPick && (
                <div className="mt-2.5 pt-2 border-t border-[#4ADE80]/30 flex items-center text-xs text-[#4ADE80] font-medium gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Consensus Match
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reveal Verdict Banner & Post-Reveal Discussion Spark */}
      {countdown === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 sm:p-5 rounded-2xl bg-[#111114] border border-white/10 space-y-3 text-center"
        >
          <div className="text-sm font-semibold text-[#F5F5F7] tracking-tight flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            {myChoice === partnerChoice ? 'Direct Consensus Match' : 'Complementary Perspectives'}
          </div>

          <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
            {myChoice === partnerChoice
              ? 'Both participants made the identical instinctual choice independently.'
              : 'Different instincts create dynamic balance rather than friction.'}
          </p>

          {/* Conversation Spark */}
          {activeDilemma.discussionSpark && (
            <div className="p-3 rounded-xl bg-[#18181D] border border-white/10 text-left space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#38BDF8]">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Discussion Spark</span>
              </div>
              <p className="text-xs text-[#F5F5F7] italic">
                &ldquo;{activeDilemma.discussionSpark}&rdquo;
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};
