'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/lib/sound/soundEffects';
import {
  X,
  Sparkles,
  CheckCircle2,
  Play,
  RotateCcw,
  Clock,
  FlaskConical,
  Flame,
  Activity,
  Layers,
  HelpCircle,
  Award,
  ChevronRight,
  Gamepad2,
  Atom,
} from 'lucide-react';

export interface LabExperimentItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  duration: string;
  playstyle: string;
  icon: React.ElementType;
}

export const LAB_EXPERIMENTS: LabExperimentItem[] = [
  {
    id: 'element-bond',
    number: '01',
    title: 'Element Bond',
    subtitle: '12 Chemical Elements · Valence Matrix · 3 Rounds',
    category: 'Atomic Bonding',
    duration: '2 min',
    playstyle: 'Synchronous Choice',
    icon: Atom,
  },
  {
    id: 'reaction-equilibrium',
    number: '02',
    title: 'Reaction Equilibrium',
    subtitle: '10 Target Scenarios · Dual Sliders · Catalyst Valve',
    category: 'Thermodynamics',
    duration: '3 min',
    playstyle: 'Collaborative Control',
    icon: Activity,
  },
  {
    id: 'synchronized-dilemmas',
    number: '03',
    title: 'Synchronized Dilemmas',
    subtitle: '42 Scenarios · 7 Life Domains · Discussion Sparks',
    category: 'Social Chemistry',
    duration: '3 min',
    playstyle: 'Synchronous Choice',
    icon: Flame,
  },
  {
    id: 'reaction-prediction',
    number: '04',
    title: 'Reaction Prediction',
    subtitle: '32 Empirical Challenges · Real Kinetics · Fun Facts',
    category: 'Kinetics & Physics',
    duration: '3 min',
    playstyle: 'Objective Prediction',
    icon: HelpCircle,
  },
  {
    id: 'molecular-memory',
    number: '05',
    title: 'Molecular Memory',
    subtitle: 'Novice/Standard/Master · Periodic Element Pairs',
    category: 'Chemical Symmetry',
    duration: '2 min',
    playstyle: 'Turn-based Co-op',
    icon: Layers,
  },
  {
    id: 'collaborative-synthesis',
    number: '06',
    title: 'Collaborative Synthesis',
    subtitle: '20 Drug & Material Targets · Asymmetric Role Clues',
    category: 'Applied Chemistry',
    duration: '4 min',
    playstyle: 'Asymmetric Co-op',
    icon: FlaskConical,
  },
  {
    id: 'signal-communication',
    number: '07',
    title: 'Signal & Communication',
    subtitle: '6 Molecular Lattices · Descriptor & Reconstructor',
    category: 'Spatial Geometry',
    duration: '3 min',
    playstyle: 'Asymmetric Spatial',
    icon: Sparkles,
  },
  {
    id: 'chemistry-quiz-battle',
    number: '08',
    title: 'Chemistry Quiz Battle',
    subtitle: '52 Verified Questions · 7 Core Disciplines · Speed Score',
    category: 'Knowledge Battle',
    duration: '3 min',
    playstyle: 'Competitive Speed',
    icon: Award,
  },
  {
    id: 'shared-discovery',
    number: '09',
    title: 'Shared Discovery',
    subtitle: '15 Multi-Stage Expeditions · Empirical Scientific Rigor',
    category: 'Scientific History',
    duration: '4 min',
    playstyle: 'Branching Discovery',
    icon: Sparkles,
  },
  {
    id: 'final-synthesis',
    number: '10',
    title: 'Final Synthesis Dossier',
    subtitle: 'Empirical Compatibility Audit · Molecular Card · Summary',
    category: 'Session Synthesis',
    duration: '2 min',
    playstyle: 'Cumulative Dossier',
    icon: CheckCircle2,
  },
];

interface InAppActivitySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  activeExperimentId: string;
  completedExperimentIds: string[];
  onSelectExperiment: (expId: string) => void;
  onOpenSocialHub: () => void;
}

export const InAppActivitySelector: React.FC<InAppActivitySelectorProps> = ({
  isOpen,
  onClose,
  activeExperimentId,
  completedExperimentIds,
  onSelectExperiment,
  onOpenSocialHub,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-3xl max-h-[90vh] bg-[#121216] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/8 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#2997FF] mb-1">
                Laboratory Operations Map
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                10 Core Science Experiments
              </h2>
              <p className="text-xs text-[#86868B] mt-0.5">
                Launch or replay any experiment without leaving the active chamber.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#18181D] hover:bg-[#222228] border border-white/8 flex items-center justify-center text-[#86868B] hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Experiments List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5">
            {LAB_EXPERIMENTS.map((exp) => {
              const isActive = activeExperimentId === exp.id;
              const isCompleted = completedExperimentIds.includes(exp.id);
              const IconComp = exp.icon;

              return (
                <div
                  key={exp.id}
                  onClick={() => {
                    sound.playGlassClick();
                    onSelectExperiment(exp.id);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-[#181822] border-[#2997FF] ring-1 ring-[#2997FF]/30'
                      : isCompleted
                      ? 'bg-[#141A16] border-[#34C759]/40 hover:border-[#34C759]'
                      : 'bg-[#141418] border-white/6 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                        isActive
                          ? 'bg-[#2997FF]/20 text-[#2997FF]'
                          : isCompleted
                          ? 'bg-[#34C759]/20 text-[#34C759]'
                          : 'bg-white/5 text-white/50'
                      }`}
                    >
                      {exp.number}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-white">
                          {exp.title}
                        </span>
                        {isActive && (
                          <span className="px-2 py-0.2 rounded-full bg-[#2997FF]/20 text-[#2997FF] text-[9px] font-mono font-semibold">
                            Active
                          </span>
                        )}
                        {isCompleted && !isActive && (
                          <span className="px-2 py-0.2 rounded-full bg-[#34C759]/20 text-[#34C759] text-[9px] font-mono font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Completed
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#86868B] mt-0.5">
                        {exp.subtitle}
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-[#86868B]">
                        <span className="px-1.5 py-0.2 rounded bg-white/5 text-white/60">
                          {exp.category}
                        </span>
                        <span>·</span>
                        <span>{exp.playstyle}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {exp.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        isActive
                          ? 'bg-[#2997FF] text-white'
                          : isCompleted
                          ? 'bg-[#34C759]/20 text-[#34C759] hover:bg-[#34C759] hover:text-black'
                          : 'bg-white text-black hover:bg-white/90'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <RotateCcw className="w-3 h-3" />
                          <span>Replay</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Launch</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer with Activity Hub Link */}
          <div className="p-4 sm:p-5 border-t border-white/8 bg-[#0E0E10] flex items-center justify-between">
            <div className="text-xs text-[#86868B]">
              Looking for informal social dating games?
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenSocialHub();
              }}
              className="px-4 py-2 rounded-full bg-[#18181D] hover:bg-[#222228] text-white text-xs font-medium border border-white/8 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-[#2997FF]" />
              <span>Browse 25+ Dating Games Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
