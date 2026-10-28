'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizQuestion, getQuizQuestions } from '@/lib/data/questionBank';
import { sound } from '@/lib/sound/soundEffects';
import { ActivityRecord } from '@/lib/activities/types';
import { Award, Check, X, ArrowRight, Clock, Trophy, Flame } from 'lucide-react';

interface QuizBattleGameProps {
  userAName: string;
  userBName: string;
  isUserA: boolean;
  isSimulatedPartner?: boolean;
  onFinishGame: (record: ActivityRecord) => void;
  onExitToHub: () => void;
}

export const QuizBattleGame: React.FC<QuizBattleGameProps> = ({
  userAName,
  userBName,
  isUserA,
  isSimulatedPartner = true,
  onFinishGame,
  onExitToHub,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [userAPick, setUserAPick] = useState<number | null>(null);
  const [userBPick, setUserBPick] = useState<number | null>(null);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [streakA, setStreakA] = useState(0);
  const [streakB, setStreakB] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const startTimeRef = useRef(Date.now());

  // Load 6 questions for an intense battle round
  useEffect(() => {
    setQuestions(getQuizQuestions('battle-seed', 6));
  }, []);

  const currentQ = questions[roundIdx];
  const myPick = isUserA ? userAPick : userBPick;
  const partnerPick = isUserA ? userBPick : userAPick;
  const partnerName = isUserA ? userBName : userAName;

  // 15-Second Timer Loop
  useEffect(() => {
    if (!currentQ || isRevealed) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerReveal();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQ, isRevealed, roundIdx]);

  const triggerReveal = () => {
    setIsRevealed(true);
    sound.playSuccessChime();

    // Calculate score
    if (currentQ) {
      const correctIdx = currentQ.correctIndex;
      if (userAPick === correctIdx) {
        setScoreA((prev) => prev + 100 + timeLeft * 5);
        setStreakA((prev) => prev + 1);
      } else {
        setStreakA(0);
      }

      if (userBPick === correctIdx) {
        setScoreB((prev) => prev + 100 + timeLeft * 5);
        setStreakB((prev) => prev + 1);
      } else {
        setStreakB(0);
      }
    }
  };

  const handlePick = (idx: number) => {
    sound.playGlassClick();
    if (isUserA) {
      setUserAPick(idx);
    } else {
      setUserBPick(idx);
    }

    // Simulated partner action after 1.2s
    if (isSimulatedPartner) {
      setTimeout(() => {
        // 75% accuracy for simulated partner
        const isCorrect = Math.random() < 0.75;
        const simulatedPick = isCorrect ? currentQ.correctIndex : (currentQ.correctIndex + 1) % 4;

        if (isUserA) {
          setUserBPick(simulatedPick);
        } else {
          setUserAPick(simulatedPick);
        }

        // Trigger reveal once both answered
        setTimeout(() => {
          triggerReveal();
        }, 500);
      }, 1200);
    }
  };

  const handleNextQuestion = () => {
    sound.playGlassClick();
    if (roundIdx < questions.length - 1) {
      setRoundIdx((prev) => prev + 1);
      setUserAPick(null);
      setUserBPick(null);
      setTimeLeft(15);
      setIsRevealed(false);
    } else {
      // Game Complete
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      const record: ActivityRecord = {
        activityId: 'quiz-battle',
        activityTitle: 'Quiz Battle',
        category: 'competitive',
        completedAt: Date.now(),
        durationSeconds: duration,
        roundsCompleted: questions.length,
        userAScore: scoreA,
        userBScore: scoreB,
        summaryText: `Quiz Battle ended ${scoreA} pts to ${scoreB} pts across ${questions.length} questions.`,
      };
      onFinishGame(record);
    }
  };

  if (!currentQ) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 select-none p-4 sm:p-6 affecio-card">
      {/* Top Header & Live Scoreboard */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8 text-xs">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-mono font-semibold">
            {currentQ.categoryLabel}
          </span>
          <span className="text-[#86868B] font-mono">
            Q {roundIdx + 1} of {questions.length}
          </span>
        </div>

        {/* Live Head-to-Head Scores */}
        <div className="flex items-center space-x-3 font-mono font-semibold text-xs">
          <span className="text-white flex items-center gap-1">
            <span>{userAName}: {scoreA}</span>
            {streakA >= 2 && <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
          </span>
          <span className="text-white/20">vs</span>
          <span className="text-[#86868B] flex items-center gap-1">
            <span>{userBName}: {scoreB}</span>
            {streakB >= 2 && <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
          </span>
        </div>

        <button
          onClick={onExitToHub}
          className="text-[#86868B] hover:text-white transition-colors font-mono"
        >
          Exit
        </button>
      </div>

      {/* Timer Bar */}
      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${(timeLeft / 15) * 100}%` }}
          transition={{ duration: 1, ease: 'linear' }}
          className={`h-full ${timeLeft <= 4 ? 'bg-red-500' : 'bg-blue-500'}`}
        />
      </div>

      {/* Question */}
      <div className="text-center space-y-2 py-1">
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-[#86868B]">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>{timeLeft}s remaining</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug max-w-xl mx-auto">
          {currentQ.question}
        </h2>
      </div>

      {/* 4 Multiple Choice Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {currentQ.options.map((optText, idx) => {
          const isMyPick = myPick === idx;
          const isPartnerPick = partnerPick === idx;
          const isCorrect = idx === currentQ.correctIndex;

          let cardClass = 'bg-[#121216] border-white/8 hover:border-white/20 text-[#86868B]';

          if (isMyPick && !isRevealed) {
            cardClass = 'bg-[#18181F] border-blue-500 ring-1 ring-blue-500/50 text-white';
          } else if (isRevealed) {
            if (isCorrect) {
              cardClass = 'bg-[#122216] border-emerald-500 ring-2 ring-emerald-500/50 text-white';
            } else if (isMyPick || isPartnerPick) {
              cardClass = 'bg-[#221416] border-red-500/50 text-white';
            } else {
              cardClass = 'bg-[#0E0E12] opacity-35 border-white/4 text-[#86868B]';
            }
          }

          return (
            <div
              key={idx}
              onClick={() => !isRevealed && handlePick(idx)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between min-h-[64px] ${cardClass}`}
            >
              <span className="text-xs sm:text-sm font-semibold">{optText}</span>

              <div className="flex items-center space-x-1.5 flex-shrink-0 ml-2">
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
                {isRevealed && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Educational Explanation Card on Reveal */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-left space-y-1 text-xs"
        >
          <div className="font-semibold text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Answer: {currentQ.options[currentQ.correctIndex]}</span>
          </div>
          <p className="text-[#86868B] leading-relaxed">
            {currentQ.explanation}
          </p>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="apple-btn-primary px-5 py-1.5 text-xs font-semibold flex items-center gap-1.5"
            >
              <span>{roundIdx < questions.length - 1 ? 'Next Question →' : 'View Match Results'}</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
