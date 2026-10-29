'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/lib/sound/soundEffects';
import { UserRole } from '@/lib/types/chemistry';
import { ActivityRecord } from '@/lib/activities/types';
import {
  RotateCcw,
  Trophy,
  Check,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
  Award,
  Zap,
} from 'lucide-react';

interface ChemicalElementCard {
  symbol: string;
  name: string;
  atomicNumber: number;
  group: string;
  color: string;
  note: string;
}

const ELEMENT_POOL: ChemicalElementCard[] = [
  { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, group: 'Non-metal', color: '#38BDF8', note: 'Most abundant cosmic element' },
  { symbol: 'He', name: 'Helium', atomicNumber: 2, group: 'Noble Gas', color: '#10B981', note: 'Inert superfluid at 2.17 K' },
  { symbol: 'Li', name: 'Lithium', atomicNumber: 3, group: 'Alkali Metal', color: '#EC4899', note: 'Highest electrochemical potential' },
  { symbol: 'C', name: 'Carbon', atomicNumber: 6, group: 'Reactive Non-metal', color: '#A855F7', note: 'Tetravalent backbone of life' },
  { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, group: 'Reactive Non-metal', color: '#6366F1', note: '78% of Earth atmosphere (triple bond)' },
  { symbol: 'O', name: 'Oxygen', atomicNumber: 8, group: 'Chalcogen', color: '#EF4444', note: 'Essential electron acceptor' },
  { symbol: 'F', name: 'Fluorine', atomicNumber: 9, group: 'Halogen', color: '#F97316', note: 'Highest electronegativity (3.98 Pauling)' },
  { symbol: 'Ne', name: 'Neon', atomicNumber: 10, group: 'Noble Gas', color: '#FB923C', note: 'Brilliant orange-red glow in discharge' },
  { symbol: 'Na', name: 'Sodium', atomicNumber: 11, group: 'Alkali Metal', color: '#FACC15', note: 'Vital biological electrolyte' },
  { symbol: 'Fe', name: 'Iron', atomicNumber: 26, group: 'Transition Metal', color: '#EAB308', note: 'Core of planetary magnetic fields' },
  { symbol: 'Cu', name: 'Copper', atomicNumber: 29, group: 'Transition Metal', color: '#F59E0B', note: 'Exceptional electrical conductor' },
  { symbol: 'Au', name: 'Gold', atomicNumber: 79, group: 'Transition Metal', color: '#E5C07B', note: 'Relativistic color and noble unreactivity' },
];

type Difficulty = 'novice' | 'standard' | 'master';

interface CardInstance {
  instanceId: number;
  symbol: string;
  name: string;
  atomicNumber: number;
  group: string;
  color: string;
  note: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MolecularMemoryGameProps {
  role: UserRole;
  userAName: string;
  userBName: string;
  isSimulatedPartner?: boolean;
  onFinishGame?: (record: ActivityRecord) => void;
  onExit?: () => void;
  onNextExperiment?: () => void;
}

export const MolecularMemoryGame: React.FC<MolecularMemoryGameProps> = ({
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

  const [difficulty, setDifficulty] = useState<Difficulty>('standard');
  const [cards, setCards] = useState<CardInstance[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [turn, setTurn] = useState<'A' | 'B'>('A');
  const [matchesA, setMatchesA] = useState(0);
  const [matchesB, setMatchesB] = useState(0);
  const [totalMoves, setTotalMoves] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [lastMatchedElement, setLastMatchedElement] = useState<ChemicalElementCard | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const partnerAIThinkingRef = useRef(false);

  // Difficulty configurations
  const pairCount = difficulty === 'novice' ? 6 : difficulty === 'standard' ? 8 : 10;
  const gridColsClass =
    difficulty === 'novice'
      ? 'grid-cols-3 sm:grid-cols-4'
      : difficulty === 'standard'
      ? 'grid-cols-4 sm:grid-cols-4'
      : 'grid-cols-4 sm:grid-cols-5';

  const initGame = (diff: Difficulty = difficulty) => {
    const selectedElements = ELEMENT_POOL.slice(0, diff === 'novice' ? 6 : diff === 'standard' ? 8 : 10);
    const deck: CardInstance[] = [];
    let id = 0;
    selectedElements.forEach((el) => {
      deck.push({ ...el, instanceId: id++, isFlipped: false, isMatched: false });
      deck.push({ ...el, instanceId: id++, isFlipped: false, isMatched: false });
    });

    setCards(deck.sort(() => Math.random() - 0.5));
    setFlippedIds([]);
    setTurn('A');
    setMatchesA(0);
    setMatchesB(0);
    setTotalMoves(0);
    setElapsedSeconds(0);
    setLastMatchedElement(null);
    setIsGameOver(false);
  };

  useEffect(() => {
    initGame(difficulty);
  }, [difficulty]);

  // Elapsed timer
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameOver]);

  // Handle Card Click
  const handleCardClick = (instanceId: number) => {
    if (flippedIds.length >= 2) return;
    const target = cards.find((c) => c.instanceId === instanceId);
    if (!target || target.isFlipped || target.isMatched) return;

    sound.playGlassClick();
    const newFlipped = [...flippedIds, instanceId];
    setFlippedIds(newFlipped);

    setCards((prev) =>
      prev.map((c) => (c.instanceId === instanceId ? { ...c, isFlipped: true } : c))
    );

    if (newFlipped.length === 2) {
      setTotalMoves((m) => m + 1);
      const [id1, id2] = newFlipped;
      const c1 = cards.find((c) => c.instanceId === id1);
      const c2 = target;

      if (c1 && c2 && c1.symbol === c2.symbol) {
        // Match!
        sound.playSuccessChime();
        setLastMatchedElement(c1);

        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.instanceId === id1 || c.instanceId === id2
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            )
          );
          setFlippedIds([]);

          if (turn === 'A') {
            setMatchesA((m) => m + 1);
          } else {
            setMatchesB((m) => m + 1);
          }

          // Check if all matched
          const remainingUnmatched = cards.filter(
            (c) => !c.isMatched && c.instanceId !== id1 && c.instanceId !== id2
          );
          if (remainingUnmatched.length === 0) {
            setIsGameOver(true);
            sound.playSuccessChime();
          }
        }, 550);
      } else {
        // Mismatch
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.instanceId === id1 || c.instanceId === id2
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedIds([]);
          // Alternate turn
          setTurn((t) => (t === 'A' ? 'B' : 'A'));
        }, 950);
      }
    }
  };

  // Simulated partner auto-play on Partner's turn
  useEffect(() => {
    const isPartnerTurn = (isExplore && turn === 'B') || (!isExplore && turn === 'A');
    if (isSimulatedPartner && isPartnerTurn && !isGameOver && flippedIds.length === 0 && !partnerAIThinkingRef.current) {
      partnerAIThinkingRef.current = true;
      const timer = setTimeout(() => {
        const available = cards.filter((c) => !c.isMatched && !c.isFlipped);
        if (available.length >= 2) {
          // Pick first
          const pick1 = available[Math.floor(Math.random() * available.length)];
          handleCardClick(pick1.instanceId);

          setTimeout(() => {
            // 45% chance of picking the exact match if available
            const matchingPair = available.find(
              (c) => c.instanceId !== pick1.instanceId && c.symbol === pick1.symbol
            );
            const pick2 =
              matchingPair && Math.random() < 0.45
                ? matchingPair
                : available.filter((c) => c.instanceId !== pick1.instanceId)[0];

            if (pick2) {
              handleCardClick(pick2.instanceId);
            }
            partnerAIThinkingRef.current = false;
          }, 800);
        } else {
          partnerAIThinkingRef.current = false;
        }
      }, 1100);

      return () => {
        clearTimeout(timer);
        partnerAIThinkingRef.current = false;
      };
    }
  }, [turn, isSimulatedPartner, isExplore, cards, isGameOver, flippedIds]);

  const handleFinishAndSave = () => {
    sound.playSuccessChime();
    const record: ActivityRecord = {
      activityId: 'molecular-memory',
      activityTitle: 'Experiment 05: Molecular Memory',
      completedAt: Date.now(),
      durationSeconds: elapsedSeconds,
      participantA: userAName,
      participantB: userBName,
      metrics: {
        matchesA,
        matchesB,
        totalMoves,
        accuracy: Math.round(((matchesA + matchesB) / Math.max(1, totalMoves)) * 100),
        elapsedSeconds,
      },
      summary: `Cleared ${pairCount} element pairs in ${totalMoves} moves (${elapsedSeconds}s).`,
      highlights: [
        `${userAName}: ${matchesA} pairs · ${userBName}: ${matchesB} pairs`,
        `Efficiency: ${Math.round(((matchesA + matchesB) / Math.max(1, totalMoves)) * 100)}% accuracy`,
      ],
    };

    if (onFinishGame) onFinishGame(record);
    if (onNextExperiment) onNextExperiment();
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 select-none">
      {/* Experiment Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8">
        <div className="flex items-center space-x-2.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#16161A] border border-white/8 text-white text-xs font-semibold font-mono">
            05 Memory
          </span>
          <span className="text-white text-xs sm:text-sm font-semibold tracking-tight">
            Molecular Matrix
          </span>
        </div>

        {/* Turn indicator & stats */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                turn === 'A' ? 'bg-[#2997FF] animate-pulse' : 'bg-white/20'
              }`}
            />
            <span className={turn === 'A' ? 'text-white font-semibold' : 'text-[#86868B]'}>
              {userAName}: {matchesA}
            </span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                turn === 'B' ? 'bg-[#34C759] animate-pulse' : 'bg-white/20'
              }`}
            />
            <span className={turn === 'B' ? 'text-white font-semibold' : 'text-[#86868B]'}>
              {userBName}: {matchesB}
            </span>
          </div>
          <span className="text-white/20">|</span>
          <span className="text-[#86868B] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTime(elapsedSeconds)}
          </span>
        </div>
      </div>

      {/* Difficulty Switcher & Reset */}
      <div className="flex items-center justify-between">
        <div className="flex items-center p-0.5 rounded-full bg-[#121216] border border-white/8 text-xs">
          {(['novice', 'standard', 'master'] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => {
                setDifficulty(d);
                initGame(d);
              }}
              className={`px-3 py-1 rounded-full text-[11px] font-medium capitalize transition-all ${
                difficulty === d
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-[#86868B] hover:text-white'
              }`}
            >
              {d} {d === 'novice' ? '(12)' : d === 'standard' ? '(16)' : '(20)'}
            </button>
          ))}
        </div>

        <button
          onClick={() => initGame(difficulty)}
          className="p-1.5 rounded-full bg-[#16161A] hover:bg-[#222228] text-[#86868B] hover:text-white border border-white/8 transition-all"
          title="Reset Matrix"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cards Grid */}
      <div className={`grid ${gridColsClass} gap-2 sm:gap-3`}>
        {cards.map((card) => {
          const isRevealed = card.isFlipped || card.isMatched;

          return (
            <motion.div
              key={card.instanceId}
              whileHover={!isRevealed ? { scale: 1.02 } : {}}
              whileTap={!isRevealed ? { scale: 0.98 } : {}}
              onClick={() => handleCardClick(card.instanceId)}
              className={`aspect-square rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center p-2 relative ${
                card.isMatched
                  ? 'bg-[#142318] border-[#34C759]/60 text-white ring-1 ring-[#34C759]/30'
                  : isRevealed
                  ? 'bg-[#18181D] border-[#2997FF] text-white shadow-lg shadow-[#2997FF]/10'
                  : 'bg-[#121216] border-white/8 hover:border-white/20 text-white/20'
              }`}
            >
              {isRevealed ? (
                <div className="text-center space-y-0.5">
                  <div className="text-[10px] font-mono text-[#86868B]">
                    #{card.atomicNumber}
                  </div>
                  <div
                    className="text-2xl sm:text-3xl font-bold font-mono tracking-tight"
                    style={{ color: card.color }}
                  >
                    {card.symbol}
                  </div>
                  <div className="text-[10px] font-medium text-white/90 truncate max-w-[68px]">
                    {card.name}
                  </div>
                  {card.isMatched && (
                    <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#34C759] text-black flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-white/30">?</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Chemical Property Flashcard on Match */}
      {lastMatchedElement && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-[#141416] border border-white/10 flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-base"
              style={{ backgroundColor: `${lastMatchedElement.color}20`, color: lastMatchedElement.color }}
            >
              {lastMatchedElement.symbol}
            </div>
            <div>
              <div className="text-xs font-semibold text-white">
                {lastMatchedElement.name} (Atomic #{lastMatchedElement.atomicNumber})
              </div>
              <div className="text-[11px] text-[#86868B]">{lastMatchedElement.note}</div>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">
            {lastMatchedElement.group}
          </span>
        </motion.div>
      )}

      {/* Completion Banner */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-2xl bg-[#121216] border border-[#34C759]/40 text-center space-y-3 shadow-2xl"
          >
            <div className="w-10 h-10 rounded-full bg-[#34C759]/20 border border-[#34C759]/40 flex items-center justify-center mx-auto text-[#34C759]">
              <Trophy className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-white">
                Periodic Matrix Fully Resolved
              </h3>
              <p className="text-xs text-[#86868B] mt-0.5">
                Completed in {totalMoves} moves across {formatTime(elapsedSeconds)}.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs font-mono py-1">
              <span className="text-white">
                {userAName}: <span className="text-[#2997FF] font-semibold">{matchesA} pairs</span>
              </span>
              <span className="text-white/20">|</span>
              <span className="text-white">
                {userBName}: <span className="text-[#34C759] font-semibold">{matchesB} pairs</span>
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={() => initGame(difficulty)}
                className="px-4 py-2 rounded-full bg-[#18181D] hover:bg-[#222228] text-white text-xs font-medium border border-white/10 transition-all cursor-pointer"
              >
                Replay Challenge
              </button>
              <button
                onClick={handleFinishAndSave}
                className="px-5 py-2 rounded-full bg-[#2997FF] hover:bg-[#2997FF]/90 text-white text-xs font-semibold shadow-lg shadow-[#2997FF]/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Save & Proceed to Exp 06</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
