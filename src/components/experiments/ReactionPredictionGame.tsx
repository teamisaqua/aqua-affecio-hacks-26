'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PREDICTION_CHALLENGES, PredictionChallenge } from '@/lib/data/experiments/predictionChallenges';
import { sound } from '@/lib/sound/soundEffects';
import { UserRole } from '@/lib/types/chemistry';
import { ActivityRecord } from '@/lib/activities/types';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ChevronRight,
  RotateCcw,
  BookOpen,
  ArrowRight,
  FlaskConical,
} from 'lucide-react';

interface ReactionPredictionGameProps {
  role: UserRole;
  userAName: string;
  userBName: string;
  isSimulatedPartner?: boolean;
  onFinishGame?: (record: ActivityRecord) => void;
  onExit?: () => void;
  onNextExperiment?: () => void;
}

export const ReactionPredictionGame: React.FC<ReactionPredictionGameProps> = ({
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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [userAChoice, setUserAChoice] = useState<string | null>(null);
  const [userBChoice, setUserBChoice] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isCountingDownRef = useRef(false);

  // Score states
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [consensusCount, setConsensusCount] = useState(0);
  const [history, setHistory] = useState<{
    challengeId: string;
    choiceA: string;
    choiceB: string;
    correct: boolean;
    consensus: boolean;
  }[]>([]);

  const filteredChallenges = React.useMemo(() => {
    if (selectedCategory === 'All') return PREDICTION_CHALLENGES;
    return PREDICTION_CHALLENGES.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  const currentChallenge: PredictionChallenge =
    filteredChallenges[currentIndex % filteredChallenges.length] || PREDICTION_CHALLENGES[0];

  const totalRounds = Math.min(filteredChallenges.length, 5);
  const isFinalRound = history.length >= totalRounds - 1;
  const isGameOver = history.length >= totalRounds;

  const myChoice = isExplore ? userAChoice : userBChoice;
  const partnerChoice = isExplore ? userBChoice : userAChoice;
  const bothSelected = Boolean(userAChoice && userBChoice);

  // Simulated partner auto-selection
  useEffect(() => {
    if (isSimulatedPartner && myChoice && !partnerChoice && !isRevealed) {
      const timer = setTimeout(() => {
        // Partner has 75% chance of picking the scientifically correct answer
        const shouldPickCorrect = Math.random() < 0.75;
        let pick: string;
        if (shouldPickCorrect) {
          pick = currentChallenge.correctOptionId;
        } else {
          const wrongOptions = currentChallenge.options.filter(
            (o) => o.id !== currentChallenge.correctOptionId
          );
          pick = wrongOptions[Math.floor(Math.random() * wrongOptions.length)].id;
        }

        if (isExplore) {
          setUserBChoice(pick);
        } else {
          setUserAChoice(pick);
        }
      }, 1100);
      return () => clearTimeout(timer);
    }
  }, [myChoice, partnerChoice, isSimulatedPartner, isExplore, currentChallenge, isRevealed]);

  // Synchronized countdown reveal
  useEffect(() => {
    if (bothSelected && !isRevealed && !isCountingDownRef.current) {
      isCountingDownRef.current = true;
      setCountdown(3);
      sound.playCountdownBeep(false);

      const t3 = setTimeout(() => {
        setCountdown(2);
        sound.playCountdownBeep(false);
      }, 700);

      const t2 = setTimeout(() => {
        setCountdown(1);
        sound.playCountdownBeep(true);
      }, 1400);

      const t1 = setTimeout(() => {
        setCountdown(0);
        setIsRevealed(true);
        isCountingDownRef.current = false;

        const isACorrect = userAChoice === currentChallenge.correctOptionId;
        const isBCorrect = userBChoice === currentChallenge.correctOptionId;
        const isConsensus = userAChoice === userBChoice;

        let deltaA = isACorrect ? 100 : 0;
        let deltaB = isBCorrect ? 100 : 0;
        if (isConsensus) {
          deltaA += 50;
          deltaB += 50;
        }

        setScoreA((prev) => prev + deltaA);
        setScoreB((prev) => prev + deltaB);
        if (isConsensus) setConsensusCount((prev) => prev + 1);

        setHistory((prev) => [
          ...prev,
          {
            challengeId: currentChallenge.id,
            choiceA: userAChoice || '',
            choiceB: userBChoice || '',
            correct: isACorrect && isBCorrect,
            consensus: isConsensus,
          },
        ]);

        if (isACorrect || isBCorrect) {
          sound.playSuccessChime();
        }
      }, 2100);

      return () => {
        clearTimeout(t3);
        clearTimeout(t2);
        clearTimeout(t1);
        isCountingDownRef.current = false;
      };
    }
  }, [bothSelected, isRevealed, userAChoice, userBChoice, currentChallenge]);

  const handleSelectChoice = (optionId: string) => {
    if (isRevealed || myChoice) return;
    sound.playGlassClick();
    if (isExplore) {
      setUserAChoice(optionId);
    } else {
      setUserBChoice(optionId);
    }
  };

  const handleNextChallenge = () => {
    sound.playGlassClick();
    setUserAChoice(null);
    setUserBChoice(null);
    setIsRevealed(false);
    setCountdown(null);
    isCountingDownRef.current = false;
    setCurrentIndex((prev) => (prev + 1) % filteredChallenges.length);
  };

  const handleFinishAndSave = () => {
    sound.playSuccessChime();
    const record: ActivityRecord = {
      activityId: 'reaction-prediction',
      activityTitle: 'Experiment 04: Reaction Prediction',
      completedAt: Date.now(),
      durationSeconds: 90,
      participantA: userAName,
      participantB: userBName,
      metrics: {
        scoreA,
        scoreB,
        consensusRate: Math.round((consensusCount / Math.max(1, history.length)) * 100),
        accuracyRate: Math.round(
          (history.filter((h) => h.correct).length / Math.max(1, history.length)) * 100
        ),
      },
      summary: `Completed ${history.length} reaction predictions with ${consensusCount} consensus alignments.`,
      highlights: [
        `Score: ${userAName} (${scoreA} pts) · ${userBName} (${scoreB} pts)`,
        `Consensus Alignment: ${Math.round((consensusCount / Math.max(1, history.length)) * 100)}%`,
      ],
    };
    if (onFinishGame) {
      onFinishGame(record);
    }
    if (onNextExperiment) {
      onNextExperiment();
    }
  };

  const categories = ['All', 'Chemical Phenomenon', 'Physics & Kinetics', 'Thermal Dynamics', 'Social Chemistry'];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 select-none">
      {/* Experiment Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8">
        <div className="flex items-center space-x-2.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#16161A] border border-white/8 text-white text-xs font-semibold font-mono">
            04 Prediction
          </span>
          <span className="text-white text-xs sm:text-sm font-semibold tracking-tight">
            Round {history.length + 1} of {totalRounds}
          </span>
        </div>

        {/* Live Scores */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#86868B]">
            {userAName}: <span className="text-white font-semibold">{scoreA}</span>
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[#86868B]">
            {userBName}: <span className="text-white font-semibold">{scoreB}</span>
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[#34C759]">Consensus: {consensusCount}</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentIndex(0);
              setUserAChoice(null);
              setUserBChoice(null);
              setIsRevealed(false);
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-white text-black font-semibold'
                : 'bg-[#121216] text-[#86868B] hover:text-white border border-white/6'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Scenario Card */}
      <div className="p-5 rounded-2xl bg-[#121216] border border-white/8 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#2997FF] bg-[#2997FF]/10 px-2 py-0.5 rounded">
            {currentChallenge.category}
          </span>
          <span className="text-xs text-[#86868B] font-mono">
            {bothSelected ? 'Both Locked' : 'Waiting for selections'}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight leading-snug">
          {currentChallenge.title}
        </h3>

        <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">
          {currentChallenge.setupPrompt}
        </p>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-[#111114] border border-white/6 text-xs">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${myChoice ? 'bg-[#2997FF]' : 'bg-white/20'}`} />
          <span className="text-white font-medium">You ({myName})</span>
          <span className="text-[#86868B]">{myChoice ? '· Locked' : '· Selecting...'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[#86868B]">{partnerName}</span>
          <span className={`w-2 h-2 rounded-full ${partnerChoice ? 'bg-[#34C759]' : 'bg-white/20'}`} />
          <span className="text-xs text-[#86868B]">
            {partnerChoice ? '· Locked' : isSimulatedPartner ? '· Simulating...' : '· Selecting...'}
          </span>
        </div>
      </div>

      {/* Countdown overlay */}
      <AnimatePresence>
        {countdown !== null && countdown > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="p-5 text-center rounded-2xl bg-[#141416] border border-[#2997FF]/40 shadow-xl max-w-xs mx-auto"
          >
            <div className="text-[10px] uppercase tracking-wider text-[#86868B] mb-1 font-mono">
              Revealing Outcome In
            </div>
            <div className="text-5xl font-light tabular-nums text-white">{countdown}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 Prediction Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {currentChallenge.options.map((opt) => {
          const isMyPick = myChoice === opt.id;
          const isPartnerPick = partnerChoice === opt.id;
          const isCorrect = opt.id === currentChallenge.correctOptionId;

          let cardStyle = 'bg-[#121216] border-white/8 text-[#86868B] hover:border-white/15';

          if (isMyPick && !isRevealed) {
            cardStyle = 'bg-[#18181D] border-[#2997FF] ring-1 ring-[#2997FF]/50 text-white';
          } else if (isRevealed) {
            if (isCorrect) {
              cardStyle = 'bg-[#142318] border-[#34C759] ring-2 ring-[#34C759]/40 text-white';
            } else if (isMyPick || isPartnerPick) {
              cardStyle = 'bg-[#221416] border-[#FF453A]/70 text-white';
            } else {
              cardStyle = 'bg-[#0E0E10] opacity-35 border-white/4 text-[#86868B]';
            }
          }

          return (
            <div
              key={opt.id}
              onClick={() => handleSelectChoice(opt.id)}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[96px] ${cardStyle}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs sm:text-sm font-semibold text-white leading-snug">
                    {opt.text}
                  </span>
                  <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                    {isMyPick && (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#2997FF]/20 text-[#2997FF] text-[9px] font-mono font-semibold">
                        You
                      </span>
                    )}
                    {isRevealed && isPartnerPick && (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#BF5AF2]/20 text-[#BF5AF2] text-[9px] font-mono font-semibold">
                        {partnerName}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-[#86868B] leading-relaxed">{opt.subtext}</p>
              </div>

              {isRevealed && isCorrect && (
                <div className="mt-2 pt-1.5 border-t border-[#34C759]/30 flex items-center text-[11px] text-[#34C759] font-medium gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Scientifically Verified Outcome
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Post-Reveal Scientific Analysis & Sparks */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-5 rounded-2xl bg-[#141416] border border-white/10 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-[#2997FF]" />
                <span className="text-xs font-semibold text-white tracking-wide">
                  Scientific Mechanism
                </span>
              </div>
              {myChoice === partnerChoice ? (
                <span className="px-2 py-0.5 rounded-full bg-[#34C759]/20 text-[#34C759] text-[10px] font-semibold">
                  +50 Consensus Alignment
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[#86868B] text-[10px]">
                  Divergent Predictions
                </span>
              )}
            </div>

            <p className="text-xs text-[#86868B] leading-relaxed">
              {currentChallenge.scientificExplanation}
            </p>

            {currentChallenge.funFact && (
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/6 text-[11px] text-[#86868B] leading-relaxed">
                <span className="text-white font-medium">Laboratory Insight: </span>
                {currentChallenge.funFact}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end space-x-3">
              {history.length < totalRounds ? (
                <button
                  onClick={handleNextChallenge}
                  className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next Prediction</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleFinishAndSave}
                  className="px-5 py-2 rounded-full bg-[#2997FF] text-white text-xs font-semibold hover:bg-[#2997FF]/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#2997FF]/20"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Complete Experiment 04</span>
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
