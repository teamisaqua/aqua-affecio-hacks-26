'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SIGNAL_PATTERN_ROUNDS, SignalPatternRound } from '@/lib/data/experiments/signalPatterns';
import { sound } from '@/lib/sound/soundEffects';
import { UserRole } from '@/lib/types/chemistry';
import { ActivityRecord } from '@/lib/activities/types';
import {
  Radio,
  Send,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Eye,
  Grid,
} from 'lucide-react';

interface SignalCommunicationGameProps {
  role: UserRole;
  userAName: string;
  userBName: string;
  isSimulatedPartner?: boolean;
  onFinishGame?: (record: ActivityRecord) => void;
  onExit?: () => void;
  onNextExperiment?: () => void;
}

const PALETTE = ['H', 'C', 'O', 'N', 'Na', 'Cl', ''];

export const SignalCommunicationGame: React.FC<SignalCommunicationGameProps> = ({
  role,
  userAName,
  userBName,
  isSimulatedPartner = true,
  onFinishGame,
  onExit,
  onNextExperiment,
}) => {
  const isExplore = role === 'explore' || role === 'observer';
  // Explore = Descriptor, Control = Reconstructor
  const isDescriptor = isExplore;

  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const currentRound: SignalPatternRound =
    SIGNAL_PATTERN_ROUNDS[currentRoundIdx % SIGNAL_PATTERN_ROUNDS.length];

  const gridSize = currentRound.gridSize;
  const totalCells = gridSize * gridSize;

  const [reconstructedGrid, setReconstructedGrid] = useState<string[]>(
    Array(totalCells).fill('')
  );
  const [selectedPalette, setSelectedPalette] = useState<string>('H');
  const [transmittedClues, setTransmittedClues] = useState<string[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [fidelityScore, setFidelityScore] = useState<number | null>(null);

  // History & Metrics
  const [completedRounds, setCompletedRounds] = useState<{
    round: number;
    fidelity: number;
  }[]>([]);

  // Reset grid when round changes
  useEffect(() => {
    setReconstructedGrid(Array(currentRound.gridSize * currentRound.gridSize).fill(''));
    setTransmittedClues([]);
    setIsVerified(false);
    setFidelityScore(null);
  }, [currentRoundIdx, currentRound.gridSize]);

  // If partner is Reconstructor in simulated mode, auto-reconstruct when clues are sent
  const handleTransmitClue = (clue: string) => {
    sound.playGlassClick();
    if (!transmittedClues.includes(clue)) {
      setTransmittedClues((prev) => [...prev, clue]);
    }

    if (isSimulatedPartner && isDescriptor) {
      // Partner auto fills a portion of the target grid accurately
      setTimeout(() => {
        setReconstructedGrid((prev) => {
          const next = [...prev];
          currentRound.targetGrid.forEach((val, idx) => {
            if (val && Math.random() < 0.85) {
              next[idx] = val;
            }
          });
          return next;
        });
      }, 700);
    }
  };

  // Reconstructor cell click
  const handleCellClick = (index: number) => {
    if (isVerified) return;
    sound.playGlassClick();
    setReconstructedGrid((prev) => {
      const next = [...prev];
      next[index] = next[index] === selectedPalette ? '' : selectedPalette;
      return next;
    });
  };

  const handleVerifyAlignment = () => {
    sound.playCountdownBeep(true);
    let matches = 0;
    const target = currentRound.targetGrid;
    for (let i = 0; i < totalCells; i++) {
      if ((reconstructedGrid[i] || '') === (target[i] || '')) {
        matches++;
      }
    }

    const accuracy = Math.round((matches / totalCells) * 100);
    setFidelityScore(accuracy);
    setIsVerified(true);
    setCompletedRounds((prev) => [...prev, { round: currentRound.roundNumber, fidelity: accuracy }]);

    if (accuracy >= 80) {
      sound.playSuccessChime();
    } else {
      sound.playOverheatWarning();
    }
  };

  const handleNextRound = () => {
    sound.playGlassClick();
    setCurrentRoundIdx((prev) => prev + 1);
  };

  const averageFidelity = Math.round(
    completedRounds.reduce((acc, r) => acc + r.fidelity, 0) /
      Math.max(1, completedRounds.length)
  );

  const handleFinishAndSave = () => {
    sound.playSuccessChime();
    const record: ActivityRecord = {
      activityId: 'signal-communication',
      activityTitle: 'Experiment 07: Signal & Communication',
      completedAt: Date.now(),
      durationSeconds: 110,
      participantA: userAName,
      participantB: userBName,
      metrics: {
        roundsCompleted: completedRounds.length,
        averageFidelity,
        descriptorRole: isExplore ? userAName : userBName,
        reconstructorRole: !isExplore ? userAName : userBName,
      },
      summary: `Completed ${completedRounds.length} molecular signal lattices with ${averageFidelity}% transmission fidelity.`,
      highlights: [
        `Mean Transmission Fidelity: ${averageFidelity}%`,
        `Target Geometries Solved: Bent, Linear, Tetrahedral, Trigonal Pyramidal`,
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
            07 Signal
          </span>
          <span className="text-white text-xs sm:text-sm font-semibold tracking-tight">
            Round {currentRound.roundNumber} of {SIGNAL_PATTERN_ROUNDS.length}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-[#86868B]">
            Fidelity: <span className="text-[#34C759] font-semibold">{averageFidelity || 100}%</span>
          </span>
          <span className="text-white/20">|</span>
          <span className="text-[#86868B]">
            Your Role: <span className="text-[#2997FF] font-semibold">{isDescriptor ? 'Descriptor' : 'Reconstructor'}</span>
          </span>
        </div>
      </div>

      {/* Target Molecule Brief */}
      <div className="p-4 rounded-2xl bg-[#121216] border border-white/8 flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono text-[#2997FF] uppercase tracking-wider">
            Lattice Topology
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            {currentRound.title}
          </h3>
          <p className="text-xs text-[#86868B] mt-0.5">{currentRound.moleculeName}</p>
        </div>

        <div className="text-right text-xs font-mono text-[#86868B]">
          <div>Grid Size: {gridSize}x{gridSize}</div>
          <div className="text-white/40">{totalCells} Node Matrix</div>
        </div>
      </div>

      {/* Two Column Layout: Descriptor View & Reconstructor View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Descriptor Terminal */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isDescriptor
              ? 'bg-[#141418] border-[#2997FF]/50 ring-1 ring-[#2997FF]/20'
              : 'bg-[#101014] border-white/6 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Eye className="w-3.5 h-3.5 text-[#2997FF]" />
              <span>Descriptor Matrix (Source Blueprint)</span>
            </div>
            {isDescriptor && (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#2997FF]/20 text-[#2997FF]">
                Active
              </span>
            )}
          </div>

          {/* Blueprint Grid Preview (Visible to Descriptor) */}
          <div
            className={`grid gap-1.5 max-w-[200px] mx-auto mb-3 ${
              gridSize === 3 ? 'grid-cols-3' : 'grid-cols-4'
            }`}
          >
            {currentRound.targetGrid.map((val, idx) => (
              <div
                key={idx}
                className={`aspect-square rounded-xl border flex items-center justify-center font-mono font-bold text-sm ${
                  val
                    ? 'bg-[#1A1A22] border-[#2997FF]/60 text-[#2997FF]'
                    : 'bg-[#0E0E10] border-white/6 text-transparent'
                }`}
              >
                {val || '·'}
              </div>
            ))}
          </div>

          {/* Signal Transmit Buttons */}
          <div className="space-y-1.5 pt-2 border-t border-white/6">
            <div className="text-[11px] font-medium text-white/60">
              Transmit Coordinate Clues to Partner:
            </div>
            {currentRound.keyPoints.map((point, i) => {
              const isSent = transmittedClues.includes(point);
              return (
                <button
                  key={i}
                  disabled={!isDescriptor || isSent || isVerified}
                  onClick={() => handleTransmitClue(point)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    isSent
                      ? 'bg-white/10 text-white/40 border border-white/10 line-through'
                      : 'bg-white/5 text-[#86868B] hover:text-white hover:bg-white/10 border border-transparent cursor-pointer'
                  }`}
                >
                  <span className="truncate pr-2">{point}</span>
                  <Send className="w-3 h-3 text-[#2997FF] shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Reconstructor Terminal */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            !isDescriptor
              ? 'bg-[#141418] border-[#34C759]/50 ring-1 ring-[#34C759]/20'
              : 'bg-[#101014] border-white/6'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
              <Grid className="w-3.5 h-3.5 text-[#34C759]" />
              <span>Reconstruction Canvas (Assembly)</span>
            </div>
            {!isDescriptor && (
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#34C759]/20 text-[#34C759]">
                Active
              </span>
            )}
          </div>

          {/* Element Palette */}
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {PALETTE.map((el) => (
              <button
                key={el || 'clear'}
                disabled={isVerified}
                onClick={() => {
                  sound.playGlassClick();
                  setSelectedPalette(el);
                }}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all border ${
                  selectedPalette === el
                    ? 'bg-[#34C759] text-black border-[#34C759] shadow-md'
                    : 'bg-[#16161A] text-white hover:border-white/20 border-white/8'
                }`}
              >
                {el || '✕'}
              </button>
            ))}
          </div>

          {/* Interactive Reconstruction Grid */}
          <div
            className={`grid gap-1.5 max-w-[200px] mx-auto mb-3 ${
              gridSize === 3 ? 'grid-cols-3' : 'grid-cols-4'
            }`}
          >
            {reconstructedGrid.map((val, idx) => (
              <button
                key={idx}
                disabled={isVerified}
                onClick={() => handleCellClick(idx)}
                className={`aspect-square rounded-xl border flex items-center justify-center font-mono font-bold text-sm transition-all cursor-pointer ${
                  val
                    ? 'bg-[#162218] border-[#34C759] text-[#34C759] shadow-sm'
                    : 'bg-[#121216] border-white/8 hover:border-white/20 text-white/20'
                }`}
              >
                {val || '+'}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/6 flex items-center justify-between">
            <button
              onClick={() => setReconstructedGrid(Array(totalCells).fill(''))}
              disabled={isVerified}
              className="text-[11px] text-[#86868B] hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Clear Canvas
            </button>

            <button
              onClick={handleVerifyAlignment}
              disabled={isVerified}
              className="px-3 py-1.5 rounded-full bg-[#34C759] text-black text-xs font-semibold hover:bg-[#34C759]/90 transition-all flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verify Geometry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verification Result Banner */}
      <AnimatePresence>
        {isVerified && fidelityScore !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-[#121216] border border-white/10 space-y-2 text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#34C759]" />
              <span className="text-sm font-semibold text-white">
                {fidelityScore >= 80 ? 'Signal Transmission Synchronized' : 'Geometric Deviation Detected'}
              </span>
              <span className="font-mono text-sm font-bold text-[#34C759]">
                {fidelityScore}% Fidelity
              </span>
            </div>

            <p className="text-xs text-[#86868B] max-w-md mx-auto">
              {fidelityScore >= 80
                ? 'Your spatial communication successfully recreated the target chemical topology.'
                : 'Reconstruction differed from the original crystal lattice. Practice coordinate clarity.'}
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              {currentRoundIdx < SIGNAL_PATTERN_ROUNDS.length - 1 ? (
                <button
                  onClick={handleNextRound}
                  className="px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next Round</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleFinishAndSave}
                  className="px-5 py-2 rounded-full bg-[#2997FF] text-white text-xs font-semibold hover:bg-[#2997FF]/90 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Save & Complete Exp 07</span>
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
