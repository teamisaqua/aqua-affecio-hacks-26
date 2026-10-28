'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PERFECT_DATE_STEPS, ItineraryStep } from '@/lib/data/questionBank';
import { sound } from '@/lib/sound/soundEffects';
import { ActivityRecord } from '@/lib/activities/types';
import { Sparkles, Check, ArrowRight, Heart, Calendar, MapPin, Compass } from 'lucide-react';

interface CollaborativeDateBuilderProps {
  userAName: string;
  userBName: string;
  isUserA: boolean;
  isSimulatedPartner?: boolean;
  onFinishGame: (record: ActivityRecord) => void;
  onExitToHub: () => void;
}

export const CollaborativeDateBuilder: React.FC<CollaborativeDateBuilderProps> = ({
  userAName,
  userBName,
  isUserA,
  isSimulatedPartner = true,
  onFinishGame,
  onExitToHub,
}) => {
  const steps = PERFECT_DATE_STEPS;
  const [stepIdx, setStepIdx] = useState(0);
  const [picksA, setPicksA] = useState<Record<string, string>>({});
  const [picksB, setPicksB] = useState<Record<string, string>>({});
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const curStep = steps[stepIdx];
  const myPick = isUserA ? picksA[curStep?.stepId] : picksB[curStep?.stepId];
  const partnerPick = isUserA ? picksB[curStep?.stepId] : picksA[curStep?.stepId];
  const partnerName = isUserA ? userBName : userAName;

  const handleSelect = (optionId: string) => {
    sound.playGlassClick();
    if (isUserA) {
      setPicksA((prev) => ({ ...prev, [curStep.stepId]: optionId }));
    } else {
      setPicksB((prev) => ({ ...prev, [curStep.stepId]: optionId }));
    }

    if (isSimulatedPartner) {
      setTimeout(() => {
        // 60% match probability
        const partnerOption =
          Math.random() < 0.6
            ? optionId
            : curStep.options.find((o) => o.id !== optionId)?.id || optionId;

        if (isUserA) {
          setPicksB((prev) => ({ ...prev, [curStep.stepId]: partnerOption }));
        } else {
          setPicksA((prev) => ({ ...prev, [curStep.stepId]: partnerOption }));
        }
        setIsRevealed(true);
        sound.playSuccessChime();
      }, 900);
    }
  };

  const handleNextStep = () => {
    sound.playGlassClick();
    if (stepIdx < steps.length - 1) {
      setStepIdx((prev) => prev + 1);
      setIsRevealed(false);
    } else {
      setIsCompleted(true);
      sound.playSuccessChime();
    }
  };

  const handleFinish = () => {
    const matchingStepsCount = steps.filter((st) => picksA[st.stepId] === picksB[st.stepId]).length;
    const record: ActivityRecord = {
      activityId: 'design-perfect-date',
      activityTitle: 'Design Your Perfect Date',
      category: 'creative',
      completedAt: Date.now(),
      durationSeconds: 240,
      roundsCompleted: steps.length,
      consensusCount: matchingStepsCount,
      totalDecisions: steps.length,
      summaryText: `Synthesized a 6-part date itinerary with ${matchingStepsCount} matching preferences.`,
    };
    onFinishGame(record);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 select-none p-4 sm:p-6 affecio-card">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8 text-xs">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 font-mono font-semibold">
            Date Architect
          </span>
          <span className="text-[#86868B] font-mono">
            Step {stepIdx + 1} of {steps.length}
          </span>
        </div>

        <button onClick={onExitToHub} className="text-[#86868B] hover:text-white font-mono">
          Exit to Hub
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key={curStep.stepId}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-4"
          >
            {/* Step Question */}
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-rose-400 uppercase tracking-wider">
                {curStep.categoryTitle}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
                {curStep.question}
              </h2>
            </div>

            {/* 4 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {curStep.options.map((opt) => {
                const isMyPick = myPick === opt.id;
                const isPartnerPick = partnerPick === opt.id;

                let cardClass = 'bg-[#121216] border-white/8 hover:border-white/20 text-[#86868B]';

                if (isMyPick && !isRevealed) {
                  cardClass = 'bg-[#18181F] border-rose-500 ring-1 ring-rose-500/50 text-white';
                } else if (isRevealed) {
                  if (isMyPick && isPartnerPick) {
                    cardClass = 'bg-[#1E1216] border-rose-500 ring-2 ring-rose-500/50 text-white';
                  } else if (isMyPick) {
                    cardClass = 'bg-[#18181F] border-rose-400 text-white';
                  } else if (isPartnerPick) {
                    cardClass = 'bg-[#18181F] border-blue-400 text-white';
                  } else {
                    cardClass = 'bg-[#0E0E12] opacity-35 border-white/4 text-[#86868B]';
                  }
                }

                return (
                  <div
                    key={opt.id}
                    onClick={() => !isRevealed && handleSelect(opt.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[100px] ${cardClass}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs sm:text-sm font-semibold text-white">{opt.title}</span>

                        <div className="flex items-center space-x-1.5">
                          {isMyPick && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 text-[10px] font-mono font-semibold">
                              You
                            </span>
                          )}
                          {isRevealed && isPartnerPick && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-mono font-semibold">
                              {partnerName}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-[#86868B] leading-relaxed">
                        {opt.description}
                      </p>
                    </div>

                    {isRevealed && isMyPick && isPartnerPick && (
                      <div className="mt-2.5 pt-2 border-t border-rose-500/30 flex items-center text-xs text-rose-400 font-medium gap-1.5">
                        <Heart className="w-3.5 h-3.5 fill-rose-400" /> Perfect Overlap!
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Advance Button on Reveal */}
            {isRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-2 flex justify-end"
              >
                <button
                  onClick={handleNextStep}
                  className="apple-btn-primary px-6 py-2 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>{stepIdx < steps.length - 1 ? 'Next Itinerary Step →' : 'Synthesize Final Date'}</span>
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* Final Date Itinerary Reveal */
          <motion.div
            key="itinerary"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-5 text-center py-2"
          >
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-rose-500/15 text-rose-400 border border-rose-500/30 font-semibold">
                DATE ITINERARY SYNTHESIZED
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
                Your Shared Dream Date
              </h2>
              <p className="text-xs text-[#86868B]">Created collaboratively by {userAName} & {userBName}.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141418] border border-white/10 text-left space-y-3 max-w-lg mx-auto text-xs">
              {steps.map((st) => {
                const pickAOpt = st.options.find((o) => o.id === picksA[st.stepId]);
                const pickBOpt = st.options.find((o) => o.id === picksB[st.stepId]);
                const isMatch = picksA[st.stepId] === picksB[st.stepId];

                return (
                  <div key={st.stepId} className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[#86868B] text-[11px] uppercase">{st.categoryTitle}</span>
                      {isMatch ? (
                        <span className="text-rose-400 font-mono text-[10px] flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-rose-400" /> Mutual Choice
                        </span>
                      ) : (
                        <span className="text-[#86868B] font-mono text-[10px]">Dual Preference</span>
                      )}
                    </div>
                    <div className="text-white font-medium">
                      {isMatch ? pickAOpt?.title : `${pickAOpt?.title} + ${pickBOpt?.title}`}
                    </div>
                    <p className="text-[#86868B] text-[11px]">
                      {isMatch ? pickAOpt?.description : `${pickAOpt?.description} blended with ${pickBOpt?.description}`}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button onClick={handleFinish} className="apple-btn-primary px-8 py-2.5 text-xs font-semibold">
                Complete & Save Itinerary
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
