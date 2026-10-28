'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sound } from '@/lib/sound/soundEffects';
import { ActivityRecord } from '@/lib/activities/types';
import { Grid, RotateCcw, Trophy, Check, ArrowRight } from 'lucide-react';

interface MemoryCard {
  id: number;
  symbol: string;
  name: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchGameProps {
  userAName: string;
  userBName: string;
  isUserA: boolean;
  isSimulatedPartner?: boolean;
  onFinishGame: (record: ActivityRecord) => void;
  onExitToHub: () => void;
}

const BASE_PAIRS = [
  { symbol: 'C', name: 'Carbon', color: '#38BDF8' },
  { symbol: 'O', name: 'Oxygen', color: '#EF4444' },
  { symbol: 'N', name: 'Nitrogen', color: '#A855F7' },
  { symbol: 'He', name: 'Helium', color: '#10B981' },
  { symbol: 'Fe', name: 'Iron', color: '#EAB308' },
  { symbol: 'Ne', name: 'Neon', color: '#F97316' },
  { symbol: 'Au', name: 'Gold', color: '#FACC15' },
  { symbol: 'Li', name: 'Lithium', color: '#EC4899' },
];

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({
  userAName,
  userBName,
  isUserA,
  isSimulatedPartner = true,
  onFinishGame,
  onExitToHub,
}) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Initialize randomized 16-card deck
  useEffect(() => {
    initDeck();
  }, []);

  const initDeck = () => {
    const deck: MemoryCard[] = [];
    let id = 0;
    BASE_PAIRS.forEach((item) => {
      // 2 cards per pair
      deck.push({ id: id++, ...item, isFlipped: false, isMatched: false });
      deck.push({ id: id++, ...item, isFlipped: false, isMatched: false });
    });
    // Shuffle
    setCards(deck.sort(() => Math.random() - 0.5));
    setFlippedIds([]);
    setMoves(0);
    setMatches(0);
    setIsWon(false);
  };

  const handleCardClick = (id: number) => {
    const card = cards.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched || flippedIds.length >= 2) return;

    sound.playGlassClick();
    const nextFlipped = [...flippedIds, id];
    setFlippedIds(nextFlipped);

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
    );

    if (nextFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const card1 = cards.find((c) => c.id === nextFlipped[0]);
      const card2 = card;

      if (card1 && card1.symbol === card2.symbol) {
        // Match!
        sound.playSuccessChime();
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === nextFlipped[0] || c.id === nextFlipped[1]
                ? { ...c, isMatched: true }
                : c
            )
          );
          setFlippedIds([]);
          setMatches((prev) => {
            const next = prev + 1;
            if (next === 8) {
              setIsWon(true);
            }
            return next;
          });
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.id === nextFlipped[0] || c.id === nextFlipped[1]
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedIds([]);
        }, 900);
      }
    }
  };

  const handleFinish = () => {
    const record: ActivityRecord = {
      activityId: 'memory-match',
      activityTitle: 'Memory Match',
      category: 'competitive',
      completedAt: Date.now(),
      durationSeconds: 150,
      roundsCompleted: 1,
      consensusCount: 8,
      totalDecisions: moves,
      summaryText: `Solved all 8 memory pairs in ${moves} moves.`,
    };
    onFinishGame(record);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 select-none p-4 sm:p-6 affecio-card">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8 text-xs">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono font-semibold">
            Memory Match
          </span>
          <span className="text-[#86868B] font-mono">Pairs: {matches} / 8</span>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-[#86868B]">
          <span>Moves: {moves}</span>
          <button onClick={onExitToHub} className="hover:text-white transition-colors">
            Exit
          </button>
        </div>
      </div>

      {/* 4x4 Card Grid */}
      <div className="grid grid-cols-4 gap-2.5 my-2">
        {cards.map((card) => {
          const showFace = card.isFlipped || card.isMatched;

          return (
            <motion.div
              key={card.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card.id)}
              className={`aspect-square rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all ${
                showFace
                  ? card.isMatched
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                    : 'bg-[#181820] border-blue-500/60 text-white'
                  : 'bg-[#121216] border-white/10 hover:border-white/25 text-[#86868B]'
              }`}
            >
              {showFace ? (
                <div className="text-center">
                  <span className="text-xl font-bold font-mono" style={{ color: card.color }}>
                    {card.symbol}
                  </span>
                  <div className="text-[10px] text-[#86868B] mt-0.5 font-medium">{card.name}</div>
                </div>
              ) : (
                <div className="w-3 h-3 rounded-full bg-white/15" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Victory Banner */}
      {isWon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2"
        >
          <div className="text-emerald-400 font-bold flex items-center justify-center gap-1.5 text-sm">
            <Trophy className="w-4 h-4" />
            <span>Board Cleared in {moves} Moves!</span>
          </div>
          <button onClick={handleFinish} className="apple-btn-primary px-6 py-2 text-xs font-semibold">
            Save Match Record
          </button>
        </motion.div>
      )}
    </div>
  );
};
