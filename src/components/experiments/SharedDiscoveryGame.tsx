'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SHARED_DISCOVERY_SEQUENCES,
  SharedDiscoverySequence,
  DiscoveryStage,
} from '@/lib/data/experiments/sharedDiscoveryScenarios';
import { sound } from '@/lib/sound/soundEffects';
import { UserRole } from '@/lib/types/chemistry';
import { ActivityRecord } from '@/lib/activities/types';
import {
  Compass,
  Search,
  BookOpen,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Award,
  Layers,
  History,
} from 'lucide-react';

interface SharedDiscoveryGameProps {
  role: UserRole;
  userAName: string;
  userBName: string;
  isSimulatedPartner?: boolean;
  onFinishGame?: (record: ActivityRecord) => void;
  onExit?: () => void;
  onNextExperiment?: () => void;
}

export const SharedDiscoveryGame: React.FC<SharedDiscoveryGameProps> = ({
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

  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [currentStageIdx, setCurrentStageIdx] = useState(0); // 0, 1, 2
  const [userAChoice, setUserAChoice] = useState<string | null>(null);
  const [userBChoice, setUserBChoice] = useState<string | null>(null);
  const [isStageResolved, setIsStageResolved] = useState(false);
  const [stageConsequence, setStageConsequence] = useState<string | null>(null);
  const [scientificAccuracyScore, setScientificAccuracyScore] = useState(0);

  const currentSequence: SharedDiscoverySequence =
    SHARED_DISCOVERY_SEQUENCES[sequenceIndex % SHARED_DISCOVERY_SEQUENCES.length];
  const currentStage: DiscoveryStage = currentSequence.stages[currentStageIdx];

  const myChoice = isExplore ? userAChoice : userBChoice;
  const partnerChoice = isExplore ? userBChoice : userAChoice;

  // Partner auto choice in simulated mode
  useEffect(() => {
    if (isSimulatedPartner && myChoice && !partnerChoice && !isStageResolved) {
      const timer = setTimeout(() => {
        // Partner has 80% chance to select the optimal scientific choice
        const optimal = currentStage.choices.find((c) => c.isOptimal);
        const sub = currentStage.choices.find((c) => !c.isOptimal);
        const pick = Math.random() < 0.8 && optimal ? optimal.id : sub?.id || currentStage.choices[0].id;

        if (isExplore) {
          setUserBChoice(pick);
        } else {
          setUserAChoice(pick);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [myChoice, partnerChoice, isSimulatedPartner, isExplore, currentStage, isStageResolved]);

  // When both users make their choice, resolve stage
  useEffect(() => {
    if (userAChoice && userBChoice && !isStageResolved) {
      const timer = setTimeout(() => {
        setIsStageResolved(true);

        // Determine outcome: user's pick consequence
        const selectedChoiceObj = currentStage.choices.find((c) => c.id === myChoice);
        const isOptimal = selectedChoiceObj?.isOptimal;

        if (isOptimal) {
          sound.playSuccessChime();
          setScientificAccuracyScore((prev) => prev + 35);
        } else {
          sound.playCountdownBeep(true);
          setScientificAccuracyScore((prev) => prev + 10);
        }

        setStageConsequence(selectedChoiceObj?.consequence || 'Observation recorded.');
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [userAChoice, userBChoice, isStageResolved, currentStage, myChoice]);

  const handleSelect = (choiceId: string) => {
    if (myChoice || isStageResolved) return;
    sound.playGlassClick();
    if (isExplore) {
      setUserAChoice(choiceId);
    } else {
      setUserBChoice(choiceId);
    }
  };

  const handleNextStage = () => {
    sound.playGlassClick();
    setUserAChoice(null);
    setUserBChoice(null);
    setIsStageResolved(false);
    setStageConsequence(null);
    setCurrentStageIdx((prev) => prev + 1);
  };

  const handleNextSequence = () => {
    sound.playGlassClick();
    setUserAChoice(null);
    setUserBChoice(null);
    setIsStageResolved(false);
    setStageConsequence(null);
    setCurrentStageIdx(0);
    setSequenceIndex((prev) => (prev + 1) % SHARED_DISCOVERY_SEQUENCES.length);
  };

  const isSequenceFinished = isStageResolved && currentStageIdx === 2;

  const handleFinishAndSave = () => {
    sound.playSuccessChime();
    const record: ActivityRecord = {
      activityId: 'shared-discovery',
      activityTitle: 'Experiment 09: Shared Discovery',
      completedAt: Date.now(),
      durationSeconds: 150,
      participantA: userAName,
      participantB: userBName,
      metrics: {
        scientificAccuracyScore,
        scenarioTitle: currentSequence.title,
        discovery: currentSequence.scientificDiscovery,
      },
      summary: `Completed 3-stage investigation into "${currentSequence.title}". Unlocked historical discovery debrief.`,
      highlights: [
        `Historical Breakthrough: ${currentSequence.scientificDiscovery}`,
        `Scientific Rigor Score: ${scientificAccuracyScore} pts`,
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
            09 Discovery
          </span>
          <span className="text-white text-xs sm:text-sm font-semibold tracking-tight">
            Case #{currentSequence.sequenceNumber}: {currentSequence.title}
          </span>
        </div>

        {/* Stage Progress */}
        <div className="flex items-center space-x-1 p-1 rounded-full bg-[#121216] border border-white/8 text-xs font-mono">
          {[1, 2, 3].map((num, i) => (
            <span
              key={num}
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                i === currentStageIdx
                  ? 'bg-white text-black font-bold'
                  : i < currentStageIdx
                  ? 'bg-[#34C759]/20 text-[#34C759]'
                  : 'text-[#86868B]'
              }`}
            >
              Stage 0{num}
            </span>
          ))}
        </div>
      </div>

      {/* Narrative Initial Brief */}
      <div className="p-4 rounded-2xl bg-[#121216] border border-white/8 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#A855F7] bg-[#A855F7]/10 px-2 py-0.5 rounded">
            Historical Expedition · {currentSequence.theme}
          </span>
          <span className="text-xs text-[#86868B] font-mono">
            Rigor: <span className="text-white font-semibold">{scientificAccuracyScore} pts</span>
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#86868B] leading-relaxed">
          {currentSequence.initialBrief}
        </p>
      </div>

      {/* Active Stage Dossier */}
      <div className="p-5 rounded-2xl bg-[#141418] border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#2997FF]/20 text-[#2997FF] font-mono text-[10px] font-bold flex items-center justify-center">
              {currentStage.stageNumber}
            </span>
            <h4 className="text-sm font-semibold text-white tracking-tight">
              {currentStage.stageName}
            </h4>
          </div>

          <div className="text-xs text-[#86868B] font-mono">
            {userAChoice && userBChoice ? 'Deliberation Complete' : 'Awaiting Decisions'}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/6 text-xs text-[#86868B] leading-relaxed">
          <span className="text-white font-medium">Laboratory Observation: </span>
          {currentStage.clueObservation}
        </div>

        <div className="text-xs sm:text-sm font-medium text-white pt-1">
          {currentStage.decisionPrompt}
        </div>
      </div>

      {/* Choices Grid */}
      <div className="space-y-2">
        {currentStage.choices.map((c) => {
          const isMyPick = myChoice === c.id;
          const isPartnerPick = partnerChoice === c.id;

          let cardStyle = 'bg-[#121216] border-white/8 text-[#86868B] hover:border-white/15';

          if (isMyPick && !isStageResolved) {
            cardStyle = 'bg-[#18181D] border-[#2997FF] ring-1 ring-[#2997FF]/50 text-white';
          } else if (isStageResolved) {
            if (c.isOptimal) {
              cardStyle = 'bg-[#142318] border-[#34C759] ring-2 ring-[#34C759]/40 text-white';
            } else if (isMyPick || isPartnerPick) {
              cardStyle = 'bg-[#221416] border-[#FF453A]/70 text-white';
            } else {
              cardStyle = 'bg-[#0E0E10] opacity-35 border-white/4 text-[#86868B]';
            }
          }

          return (
            <div
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${cardStyle}`}
            >
              <div className="pr-3">
                <div className="text-xs sm:text-sm font-semibold text-white leading-snug">
                  {c.label}
                </div>
                <div className="text-[11px] text-[#86868B] mt-0.5">{c.subtext}</div>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0">
                {isMyPick && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#2997FF]/20 text-[#2997FF] text-[9px] font-mono font-semibold">
                    You
                  </span>
                )}
                {isStageResolved && isPartnerPick && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#BF5AF2]/20 text-[#BF5AF2] text-[9px] font-mono font-semibold">
                    {partnerName}
                  </span>
                )}
                {isStageResolved && c.isOptimal && (
                  <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Consequence & Debrief Box */}
      <AnimatePresence>
        {isStageResolved && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-5 rounded-2xl bg-[#141416] border border-white/10 space-y-3"
          >
            <div>
              <div className="text-[10px] font-mono text-[#34C759] uppercase tracking-wider mb-1">
                Investigation Outcome
              </div>
              <p className="text-xs text-[#86868B] leading-relaxed">
                {stageConsequence}
              </p>
            </div>

            {isSequenceFinished && (
              <div className="pt-3 border-t border-white/8 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <History className="w-4 h-4 text-[#A855F7]" />
                  <span>Historical Scientific Breakthrough</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/6 text-xs text-white/90 leading-relaxed">
                  <div className="font-semibold text-white mb-0.5">
                    {currentSequence.scientificDiscovery}
                  </div>
                  <div className="text-[#86868B]">{currentSequence.completionDebrief}</div>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              {!isSequenceFinished ? (
                <button
                  onClick={handleNextStage}
                  className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Advance to Stage 0{currentStageIdx + 2}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleNextSequence}
                    className="px-3.5 py-2 rounded-full bg-[#18181D] hover:bg-[#222228] text-white text-xs font-medium border border-white/8 transition-all cursor-pointer"
                  >
                    Next Case Study
                  </button>
                  <button
                    onClick={handleFinishAndSave}
                    className="px-5 py-2 rounded-full bg-[#2997FF] text-white text-xs font-semibold hover:bg-[#2997FF]/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#2997FF]/20"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Complete Experiment 09</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
