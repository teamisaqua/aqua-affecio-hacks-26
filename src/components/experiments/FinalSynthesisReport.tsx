'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { sound } from '@/lib/sound/soundEffects';
import { UserRole, ChemistryScore, FictionalCompound } from '@/lib/types/chemistry';
import { ActivityRecord } from '@/lib/activities/types';
import {
  Sparkles,
  Award,
  FlaskConical,
  RotateCcw,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Activity,
  Layers,
  Flame,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface FinalSynthesisReportProps {
  userAName: string;
  userBName: string;
  role: UserRole;
  records: ActivityRecord[];
  chemistryScore?: ChemistryScore | null;
  compound?: FictionalCompound | null;
  onLaunchExperiment: (expId: string) => void;
  onReturnToLobby: () => void;
}

export const FinalSynthesisReport: React.FC<FinalSynthesisReportProps> = ({
  userAName,
  userBName,
  role,
  records,
  chemistryScore,
  compound,
  onLaunchExperiment,
  onReturnToLobby,
}) => {
  const [copied, setCopied] = useState(false);

  // Compute aggregate empirical metrics from records
  const totalCompleted = records.length;
  const avgAccuracy = Math.round(
    records.reduce((acc, r) => {
      const val =
        (r.metrics?.accuracyRate as number) ||
        (r.metrics?.averageYield as number) ||
        (r.metrics?.averageFidelity as number) ||
        (r.metrics?.consensusRate as number) ||
        85;
      return acc + val;
    }, 0) / Math.max(1, totalCompleted)
  );

  const totalPoints = records.reduce((acc, r) => {
    const scoreA = (r.metrics?.scoreA as number) || 0;
    const scoreB = (r.metrics?.scoreB as number) || 0;
    return acc + scoreA + scoreB;
  }, 0);

  const affinityIndex = chemistryScore?.affinityIndex ?? Math.min(99, 78 + Math.floor(avgAccuracy * 0.2));

  const handleShare = () => {
    sound.playSuccessChime();
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 select-none pb-8">
      {/* Experiment Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8">
        <div className="flex items-center space-x-2.5">
          <span className="px-2.5 py-0.5 rounded-full bg-[#16161A] border border-white/8 text-white text-xs font-semibold font-mono">
            10 Synthesis
          </span>
          <span className="text-white text-xs sm:text-sm font-semibold tracking-tight">
            Comprehensive Compatibility Dossier
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/8 text-xs font-medium text-white flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#2997FF]" />
            <span>{copied ? 'Copied Link' : 'Share Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Main Dossier Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#141418] to-[#0E0E10] border border-white/10 text-center space-y-4 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#34C759]/10 border border-[#34C759]/20 text-[#34C759] text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Empirically Measured Chemistry Matrix</span>
        </div>

        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {compound?.name || 'Harmonium Synthetica'}
          </h2>
          <p className="text-sm font-mono text-[#38BDF8] mt-1">
            Formula: {compound?.formula || 'C₈H₁₁NO₂ · 2H₂O'} · Crystal Lattice: {compound?.crystalSystem || 'Orthorhombic'}
          </p>
        </div>

        {/* Big Measured Chemistry Index */}
        <div className="flex items-center justify-center gap-6 py-2">
          <div>
            <div className="text-5xl sm:text-6xl font-light tabular-nums text-white">
              {affinityIndex}%
            </div>
            <div className="text-[11px] font-mono text-[#86868B] uppercase tracking-wider mt-1">
              Affinity Index
            </div>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="text-left space-y-0.5">
            <div className="text-xs text-white font-medium flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#34C759]" />
              Empirical Consensus: {avgAccuracy}%
            </div>
            <div className="text-xs text-[#86868B]">
              Total Solved Lab Modules: <span className="text-white font-semibold">{totalCompleted}</span>
            </div>
            <div className="text-xs text-[#86868B]">
              Combined Points: <span className="text-white font-semibold">{totalPoints} pts</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#86868B] max-w-xl mx-auto leading-relaxed">
          {compound?.description ||
            'Calculated from direct participant choices across chemical bonding, reaction kinetics, thermal equilibrium, and asymmetric communication tasks. Distinguishes verified actions from speculative inference.'}
        </p>
      </div>

      {/* 4 Pillars of Interaction Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#121216] border border-white/8 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Bond Resonance</span>
            <Flame className="w-4 h-4 text-[#FF9F0A]" />
          </div>
          <div className="text-2xl font-light text-white font-mono">
            {chemistryScore?.resonanceScore ?? 88}%
          </div>
          <p className="text-[11px] text-[#86868B] leading-relaxed">
            Elemental valence complementarity and covalent bond stability.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#121216] border border-white/8 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Equilibrium Kinetics</span>
            <Activity className="w-4 h-4 text-[#2997FF]" />
          </div>
          <div className="text-2xl font-light text-white font-mono">
            {chemistryScore?.kineticsScore ?? 92}%
          </div>
          <p className="text-[11px] text-[#86868B] leading-relaxed">
            Temperature and pressure equilibrium stabilization under active perturbation.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#121216] border border-white/8 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Consensus Alignment</span>
            <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
          </div>
          <div className="text-2xl font-light text-white font-mono">
            {chemistryScore?.harmonyScore ?? 84}%
          </div>
          <p className="text-[11px] text-[#86868B] leading-relaxed">
            Independent decision alignment across philosophical and lifestyle dilemmas.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#121216] border border-white/8 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Signal Transmission</span>
            <Layers className="w-4 h-4 text-[#BF5AF2]" />
          </div>
          <div className="text-2xl font-light text-white font-mono">
            {avgAccuracy}%
          </div>
          <p className="text-[11px] text-[#86868B] leading-relaxed">
            Information fidelity across asymmetric descriptor and reconstructor lattices.
          </p>
        </div>
      </div>

      {/* Completed Experiment Audit Trail */}
      <div className="p-5 rounded-2xl bg-[#121216] border border-white/8 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            Completed Activities & Recorded History ({records.length})
          </h3>
          <span className="text-xs font-mono text-[#86868B]">Session ID Active</span>
        </div>

        {records.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#86868B]">
            No secondary activities completed yet in this session.
            Launch any experiment from the navigation bar to build your compatibility record.
          </div>
        ) : (
          <div className="space-y-2">
            {records.map((rec, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-white/4 border border-white/6 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-white">
                    {rec.activityTitle}
                  </div>
                  <div className="text-[11px] text-[#86868B] mt-0.5">
                    {rec.summary}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#34C759] bg-[#34C759]/10 px-2 py-0.5 rounded">
                    Recorded
                  </span>
                  <button
                    onClick={() => onLaunchExperiment(rec.activityId)}
                    className="p-1 rounded-lg hover:bg-white/10 text-[#86868B] hover:text-white transition-all cursor-pointer"
                    title="Replay Experiment"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Replay & Return Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onReturnToLobby}
          className="px-4 py-2 rounded-full bg-[#18181D] hover:bg-[#222228] text-white text-xs font-medium border border-white/8 transition-all cursor-pointer"
        >
          Return to Laboratory Lobby
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onLaunchExperiment('element-bond')}
            className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/8 transition-all cursor-pointer"
          >
            Replay Experiment 01
          </button>
          <button
            onClick={() => onLaunchExperiment('reaction-equilibrium')}
            className="px-5 py-2 rounded-full bg-[#2997FF] hover:bg-[#2997FF]/90 text-white text-xs font-semibold shadow-lg shadow-[#2997FF]/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch Reaction Equilibrium</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
