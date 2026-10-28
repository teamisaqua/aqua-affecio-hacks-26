'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDeepTalkPrompts, DeepTalkPrompt } from '@/lib/data/questionBank';
import { sound } from '@/lib/sound/soundEffects';
import { ActivityRecord } from '@/lib/activities/types';
import { MessageSquare, SkipForward, ArrowRight, Sparkles, Heart } from 'lucide-react';

interface DeepTalkGameProps {
  userAName: string;
  userBName: string;
  isUserA: boolean;
  onFinishGame: (record: ActivityRecord) => void;
  onExitToHub: () => void;
}

export const DeepTalkGame: React.FC<DeepTalkGameProps> = ({
  userAName,
  userBName,
  isUserA,
  onFinishGame,
  onExitToHub,
}) => {
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [promptIdx, setPromptIdx] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const prompts = getDeepTalkPrompts(currentLevel);
  const curPrompt: DeepTalkPrompt = prompts[promptIdx % prompts.length] || prompts[0];

  const levels: { level: 1 | 2 | 3 | 4 | 5; title: string; color: string }[] = [
    { level: 1, title: '1. Light', color: 'text-sky-400' },
    { level: 2, title: '2. Personal', color: 'text-blue-400' },
    { level: 3, title: '3. Memories', color: 'text-purple-400' },
    { level: 4, title: '4. Values', color: 'text-rose-400' },
    { level: 5, title: '5. Vulnerability', color: 'text-amber-400' },
  ];

  const handleNext = () => {
    sound.playGlassClick();
    setPromptIdx((prev) => prev + 1);
    setAnsweredCount((prev) => prev + 1);
  };

  const handleSkip = () => {
    sound.playGlassClick();
    setPromptIdx((prev) => prev + 1);
  };

  const handleLevelSelect = (lvl: 1 | 2 | 3 | 4 | 5) => {
    sound.playGlassClick();
    setCurrentLevel(lvl);
    setPromptIdx(0);
  };

  const handleFinish = () => {
    sound.playSuccessChime();
    const record: ActivityRecord = {
      activityId: 'deep-talk',
      activityTitle: 'Deep Talk',
      category: 'personality',
      completedAt: Date.now(),
      durationSeconds: 300,
      roundsCompleted: Math.max(1, answeredCount),
      summaryText: `Explored Level ${currentLevel} Deep Talk conversations across ${answeredCount} prompt(s).`,
    };
    onFinishGame(record);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 select-none p-4 sm:p-6 affecio-card">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8 text-xs">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 font-mono font-semibold">
            Deep Talk
          </span>
          <span className="text-[#86868B] font-mono">
            {curPrompt?.levelTitle}
          </span>
        </div>

        <button onClick={onExitToHub} className="text-[#86868B] hover:text-white font-mono">
          Exit to Hub
        </button>
      </div>

      {/* 5-Level Selector Tabs */}
      <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-[#141418] border border-white/8 text-xs overflow-x-auto">
        {levels.map((lvl) => (
          <button
            key={lvl.level}
            onClick={() => handleLevelSelect(lvl.level)}
            className={`px-3 py-1.5 rounded-lg font-mono text-[11px] whitespace-nowrap transition-all ${
              currentLevel === lvl.level
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-[#86868B] hover:text-white'
            }`}
          >
            {lvl.title}
          </button>
        ))}
      </div>

      {/* Main Conversation Prompt Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={curPrompt?.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="p-8 sm:p-10 rounded-2xl bg-[#121216] border border-white/10 text-center space-y-4 my-2"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-purple-400">
            <MessageSquare className="w-5 h-5" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-relaxed max-w-lg mx-auto">
            {curPrompt?.prompt}
          </h2>

          <p className="text-xs text-[#86868B] max-w-sm mx-auto">
            Take unhurried time. Either person may skip freely without explanation.
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <button
          onClick={handleSkip}
          className="apple-btn-secondary px-5 py-2 text-xs font-mono text-[#86868B] hover:text-white flex items-center gap-1.5 w-full sm:w-auto justify-center"
        >
          <SkipForward className="w-3.5 h-3.5" />
          <span>Skip Prompt (No Penalty)</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleNext}
            className="apple-btn-primary px-6 py-2 text-xs font-semibold flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
          >
            <span>Next Question</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleFinish}
            className="apple-btn-secondary px-4 py-2 text-xs font-mono flex-1 sm:flex-none justify-center"
          >
            Finish Discussion
          </button>
        </div>
      </div>
    </div>
  );
};
