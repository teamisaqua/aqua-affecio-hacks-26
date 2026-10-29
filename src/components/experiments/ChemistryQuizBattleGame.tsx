'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHEMISTRY_QUIZ_50, PureChemistryQuestion } from '@/lib/data/experiments/chemistryQuiz50';
import { sound } from '@/lib/sound/soundEffects';
import { UserRole } from '@/lib/types/chemistry';
import { ActivityRecord } from '@/lib/activities/types';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ChemistryQuizBattleGameProps {
  role: UserRole;
  userAName: string;
  userBName: string;
  isSimulatedPartner?: boolean;
  onFinishGame?: (record: ActivityRecord) => void;
  onExit?: () => void;
  onNextExperiment?: () => void;
}

export const ChemistryQuizBattleGame: React.FC<ChemistryQuizBattleGameProps> = ({
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

  const [discipline, setDiscipline] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAChoice, setUserAChoice] = useState<number | null>(null);
  const [userBChoice, setUserBChoice] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [roundTimer, setRoundTimer] = useState(15);
  const [history, setHistory] = useState<{
    qId: string;
    choiceA: number;
    choiceB: number;
    correct: boolean;
  }[]>([]);

  const filteredQuestions = React.useMemo(() => {
    if (discipline === 'All') return CHEMISTRY_QUIZ_50;
    return CHEMISTRY_QUIZ_50.filter((q) => q.discipline === discipline);
  }, [discipline]);

  const currentQ: PureChemistryQuestion =
    filteredQuestions[currentIndex % filteredQuestions.length] || CHEMISTRY_QUIZ_50[0];

  const totalRounds = 5;
  const isGameOver = history.length >= totalRounds;

  const myChoice = isExplore ? userAChoice : userBChoice;
  const partnerChoice = isExplore ? userBChoice : userAChoice;

  // Round countdown timer for speed bonus
  useEffect(() => {
    if (isRevealed || isGameOver) return;
    setRoundTimer(15);
    const interval = setInterval(() => {
      setRoundTimer((t) => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, isRevealed, isGameOver]);

  // Simulated partner response
  useEffect(() => {
    if (isSimulatedPartner && myChoice !== null && partnerChoice === null && !isRevealed) {
      const delay = 1000 + Math.random() * 800;
      const timer = setTimeout(() => {
        const isPartnerCorrect = Math.random() < 0.8;
        let pick: number;
        if (isPartnerCorrect) {
          pick = currentQ.correctIndex;
        } else {
          const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQ.correctIndex);
          pick = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
        }

        if (isExplore) {
          setUserBChoice(pick);
        } else {
          setUserAChoice(pick);
        }
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [myChoice, partnerChoice, isSimulatedPartner, isExplore, currentQ, isRevealed]);

  // Trigger reveal when both submit
  useEffect(() => {
    if (userAChoice !== null && userBChoice !== null && !isRevealed) {
      const timer = setTimeout(() => {
        setIsRevealed(true);

        const aCorrect = userAChoice === currentQ.correctIndex;
        const bCorrect = userBChoice === currentQ.correctIndex;

        const pointsA = aCorrect ? 500 + roundTimer * 30 : 0;
        const pointsB = bCorrect ? 500 + Math.max(1, roundTimer - 1) * 30 : 0;

        setScoreA((prev) => prev + pointsA);
        setScoreB((prev) => prev + pointsB);

        setHistory((prev) => [
          ...prev,
          {
            qId: currentQ.id,
            choiceA: userAChoice,
            choiceB: userBChoice,
            correct: aCorrect && bCorrect,
          },
        ]);

        if (aCorrect || bCorrect) {
          sound.playSuccessChime();
        } else {
          sound.playOverheatWarning();
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [userAChoice, userBChoice, isRevealed, currentQ, roundTimer]);

  const handleSelect = (idx: number) => {
    if (myChoice !== null || isRevealed) return;
    sound.playGlassClick();
    if (isExplore) {
      setUserAChoice(idx);
    } else {
      setUserBChoice(idx);
    }
  };

  const handleNextQuestion = () => {
    sound.playGlassClick();
    setUserAChoice(null);
    setUserBChoice(null);
    setIsRevealed(false);
    setCurrentIndex((prev) => (prev + 1) % filteredQuestions.length);
  };

  const disciplines = [
    'All',
    'Chemical Elements',
    'Atomic Structure',
    'Chemical Bonds',
    'Acids & Bases',
    'Chemical Reactions',
    'Periodic Table',
    'General Chemistry',
  ];

  const handleFinishAndSave = () => {
    sound.playSuccessChime();
    const correctCount = history.filter((h) => h.choiceA === currentQ.correctIndex).length;
    const record: ActivityRecord = {
      activityId: 'chemistry-quiz-battle',
      activityTitle: 'Experiment 08: Chemistry Quiz Battle',
      completedAt: Date.now(),
      durationSeconds: 90,
      participantA: userAName,
      participantB: userBName,
      metrics: {
        scoreA,
        scoreB,
        accuracyA: Math.round((scoreA / (totalRounds * 950)) * 100),
        accuracyB: Math.round((scoreB / (totalRounds * 950)) * 100),
        winner: scoreA >= scoreB ? userAName : userBName,
      },
      summary: `Completed 5-round scientific chemistry battle. ${scoreA >= scoreB ? userAName : userBName} achieved top honors.`,
      highlights: [
        `${userAName}: ${scoreA} pts · ${userBName}: ${scoreB} pts`,
        `Discipline Focus: ${discipline}`,
      ],
    };

    if (onFinishGame) onFinishGame(record);
    if (onNextExperiment) onNextExperiment();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8">
        <div className="flex items-center space-x-2.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#16161A] border border-white/8 text-white text-xs font-semibold font-mono">
            08 Quiz Battle
          </span>
          <span className="text-white text-xs sm:text-sm font-semibold tracking-tight">
            Question {history.length + 1} of {totalRounds}
          </span>
        </div>

        {/* Live Score & Speed Timer */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#86868B]">
            {userAName}: <span className="text-white font-semibold">{scoreA}</span>
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[#86868B]">
            {userBName}: <span className="text-white font-semibold">{scoreB}</span>
          </span>
          <span className="text-white/20">|</span>
          <span className={`flex items-center gap-1 ${roundTimer <= 5 ? 'text-[#FF453A] animate-pulse' : 'text-[#38BDF8]'}`}>
            <Clock className="w-3 h-3" />
            {roundTimer}s
          </span>
        </div>
      </div>

      {/* Discipline Filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {disciplines.map((d) => (
          <button
            key={d}
            onClick={() => {
              setDiscipline(d);
              setCurrentIndex(0);
              setUserAChoice(null);
              setUserBChoice(null);
              setIsRevealed(false);
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
              discipline === d
                ? 'bg-white text-black font-semibold'
                : 'bg-[#121216] text-[#86868B] hover:text-white border border-white/6'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <div className="p-5 rounded-2xl bg-[#121216] border border-white/8 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded">
            {currentQ.discipline} · {currentQ.difficulty.toUpperCase()}
          </span>
          <span className="text-xs text-[#86868B] font-mono">
            {userAChoice !== null && userBChoice !== null ? 'Both Locked' : 'Speed Response Active'}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight leading-snug">
          {currentQ.question}
        </h3>
      </div>

      {/* 4 Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {currentQ.options.map((optText, idx) => {
          const isMyPick = myChoice === idx;
          const isPartnerPick = partnerChoice === idx;
          const isCorrect = idx === currentQ.correctIndex;

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
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between min-h-[64px] ${cardStyle}`}
            >
              <div className="flex items-center space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white">{optText}</span>
              </div>

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
                {isRevealed && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Post-Question Scientific Review */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-5 rounded-2xl bg-[#141416] border border-white/10 space-y-2.5"
          >
            <div className="flex items-center space-x-2 text-xs font-semibold text-white">
              <BookOpen className="w-4 h-4 text-[#2997FF]" />
              <span>Scientific Explanation</span>
            </div>

            <p className="text-xs text-[#86868B] leading-relaxed">
              {currentQ.explanation}
            </p>

            <div className="pt-2 flex items-center justify-end space-x-3">
              {history.length < totalRounds ? (
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleFinishAndSave}
                  className="px-5 py-2 rounded-full bg-[#2997FF] text-white text-xs font-semibold hover:bg-[#2997FF]/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#2997FF]/20"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Complete Experiment 08</span>
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
