'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChoicePrompt } from '@/lib/data/questionBank';
import { sound } from '@/lib/sound/soundEffects';
import { ActivityRecord } from '@/lib/activities/types';
import { Sparkles, Check, ArrowRight, RotateCcw, MessageCircle, HelpCircle } from 'lucide-react';

interface ChoiceVotingGameProps {
  activityId: string;
  activityTitle: string;
  prompts: ChoicePrompt[];
  userAName: string;
  userBName: string;
  isUserA: boolean;
  isSimulatedPartner?: boolean;
  onBroadcastAction?: (action: string, payload: unknown) => void;
  onFinishGame: (record: ActivityRecord) => void;
  onExitToHub: () => void;
}

export const ChoiceVotingGame: React.FC<ChoiceVotingGameProps> = ({
  activityId,
  activityTitle,
  prompts,
  userAName,
  userBName,
  isUserA,
  isSimulatedPartner = true,
  onBroadcastAction,
  onFinishGame,
  onExitToHub,
}) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [userAChoice, setUserAChoice] = useState<string | null>(null);
  const [userBChoice, setUserBChoice] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [history, setHistory] = useState<{ prompt: string; choiceA: string; choiceB: string; isMatch: boolean }[]>([]);
  const startTimeRef = useRef(Date.now());

  const currentPrompt = prompts[roundIdx] || prompts[0];
  const myChoice = isUserA ? userAChoice : userBChoice;
  const partnerChoice = isUserA ? userBChoice : userAChoice;
  const partnerName = isUserA ? userBName : userAName;

  const totalRounds = Math.min(5, prompts.length);
  const bothSelected = Boolean(userAChoice && userBChoice);

  // Synchronized 3-2-1 Reveal Countdown
  useEffect(() => {
    if (bothSelected && !isRevealed && countdown === null) {
      setCountdown(3);
      sound.playCountdownBeep(false);

      const t2 = setTimeout(() => {
        setCountdown(2);
        sound.playCountdownBeep(false);
      }, 900);

      const t1 = setTimeout(() => {
        setCountdown(1);
        sound.playCountdownBeep(true);
      }, 1800);

      const t0 = setTimeout(() => {
        setCountdown(0);
        setIsRevealed(true);
        sound.playSuccessChime();

        // Record history
        const optA = currentPrompt.options.find((o) => o.id === userAChoice)?.label || userAChoice || '';
        const optB = currentPrompt.options.find((o) => o.id === userBChoice)?.label || userBChoice || '';
        setHistory((prev) => [
          ...prev,
          {
            prompt: currentPrompt.prompt,
            choiceA: optA,
            choiceB: optB,
            isMatch: userAChoice === userBChoice,
          },
        ]);
      }, 2700);

      return () => {
        clearTimeout(t2);
        clearTimeout(t1);
        clearTimeout(t0);
      };
    }
  }, [bothSelected, isRevealed, countdown, currentPrompt, userAChoice, userBChoice]);

  const handlePick = (optionId: string) => {
    sound.playGlassClick();
    if (isUserA) {
      setUserAChoice(optionId);
      onBroadcastAction?.('CHOICE_SUBMIT', { role: 'userA', optionId });
    } else {
      setUserBChoice(optionId);
      onBroadcastAction?.('CHOICE_SUBMIT', { role: 'userB', optionId });
    }

    // Simulated partner auto-pick after 1.2s
    if (isSimulatedPartner) {
      setTimeout(() => {
        // ~70% match probability for engaging synergy
        const partnerPick =
          Math.random() < 0.7
            ? optionId
            : currentPrompt.options.find((o) => o.id !== optionId)?.id || optionId;

        if (isUserA) {
          setUserBChoice(partnerPick);
        } else {
          setUserAChoice(partnerPick);
        }
      }, 1200);
    }
  };

  const handleNextRound = () => {
    sound.playGlassClick();
    if (roundIdx < totalRounds - 1) {
      setRoundIdx((prev) => prev + 1);
      setUserAChoice(null);
      setUserBChoice(null);
      setIsRevealed(false);
      setCountdown(null);
    } else {
      // Finish game
      const consensusCount = history.filter((h) => h.isMatch).length;
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      const record: ActivityRecord = {
        activityId,
        activityTitle,
        category: 'icebreakers',
        completedAt: Date.now(),
        durationSeconds: duration,
        roundsCompleted: totalRounds,
        consensusCount,
        totalDecisions: totalRounds,
        summaryText: `Completed ${totalRounds} rounds with ${consensusCount} consensus match(es).`,
      };
      onFinishGame(record);
    }
  };

  const isGameOver = isRevealed && roundIdx >= totalRounds - 1;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 select-none p-4 sm:p-6 affecio-card">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8 text-xs">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full bg-[#18181D] border border-white/10 font-mono text-white font-semibold">
            {activityTitle}
          </span>
          <span className="text-[#86868B] font-mono">
            Round {roundIdx + 1} of {totalRounds}
          </span>
        </div>

        <button
          onClick={onExitToHub}
          className="text-[#86868B] hover:text-white transition-colors font-mono"
        >
          Exit to Hub
        </button>
      </div>

      {/* Prompt */}
      <div className="text-center space-y-2 py-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
          {currentPrompt.prompt}
        </h2>
        <div className="flex items-center justify-center gap-4 text-xs font-mono text-[#86868B]">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${myChoice ? 'bg-blue-500' : 'bg-white/20'}`} />
            You: {myChoice ? 'Locked' : 'Choosing...'}
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${partnerChoice ? 'bg-emerald-400' : 'bg-white/20'}`} />
            {partnerName}: {partnerChoice ? 'Locked' : 'Choosing...'}
          </span>
        </div>
      </div>

      {/* Countdown overlay */}
      <AnimatePresence>
        {countdown !== null && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="p-6 text-center rounded-2xl bg-black/80 border border-blue-500/40 max-w-xs mx-auto shadow-2xl"
          >
            <div className="text-xs uppercase font-mono text-[#86868B] mb-1">Revealing In</div>
            <div className="text-6xl font-light text-white tabular-nums">{countdown}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options grid */}
      <div className={`grid ${currentPrompt.options.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'} gap-3`}>
        {currentPrompt.options.map((option) => {
          const isMyPick = myChoice === option.id;
          const isPartnerPick = partnerChoice === option.id;

          let cardClass = 'bg-[#121216] border-white/8 hover:border-white/20 text-[#86868B]';

          if (isMyPick && !isRevealed) {
            cardClass = 'bg-[#18181F] border-blue-500 ring-1 ring-blue-500/40 text-white';
          } else if (isRevealed) {
            if (isMyPick && isPartnerPick) {
              cardClass = 'bg-[#122216] border-emerald-500 ring-2 ring-emerald-500/40 text-white';
            } else if (isMyPick) {
              cardClass = 'bg-[#18181F] border-blue-500 text-white';
            } else if (isPartnerPick) {
              cardClass = 'bg-[#1A1624] border-purple-400 text-white';
            } else {
              cardClass = 'bg-[#0E0E12] opacity-40 border-white/5 text-[#86868B]';
            }
          }

          return (
            <div
              key={option.id}
              onClick={() => !isRevealed && handlePick(option.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${cardClass}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-white">{option.label}</span>

                  <div className="flex items-center space-x-1.5">
                    {isMyPick && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-mono font-semibold">
                        You
                      </span>
                    )}
                    {isRevealed && isPartnerPick && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-semibold">
                        {partnerName}
                      </span>
                    )}
                  </div>
                </div>

                {option.subtext && (
                  <p className="text-xs text-[#86868B] leading-relaxed">
                    {option.subtext}
                  </p>
                )}
              </div>

              {isRevealed && isMyPick && isPartnerPick && (
                <div className="mt-3 pt-2 border-t border-emerald-500/30 flex items-center text-xs text-emerald-400 font-medium gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Consensus Match
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reveal Feedback & Next Round Controls */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-3 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
        >
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="font-semibold">
              {myChoice === partnerChoice ? 'Direct Agreement!' : 'Complementary Perspectives'}
            </span>
          </div>

          <button
            onClick={handleNextRound}
            className="apple-btn-primary px-6 py-2 text-xs font-semibold flex items-center gap-1.5 w-full sm:w-auto justify-center"
          >
            <span>{roundIdx < totalRounds - 1 ? 'Next Question →' : 'Complete Activity'}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
};
