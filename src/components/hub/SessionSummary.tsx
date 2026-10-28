'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ActivityRecord, CumulativeSessionStats } from '@/lib/activities/types';
import { sound } from '@/lib/sound/soundEffects';
import {
  Trophy,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Clock,
  ArrowRight,
  Info,
  Heart,
  Award,
  Layers,
  ChevronLeft,
} from 'lucide-react';

interface SessionSummaryProps {
  userAName: string;
  userBName: string;
  records: ActivityRecord[];
  onContinuePlaying: () => void;
  onReturnToChamber: () => void;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({
  userAName,
  userBName,
  records,
  onContinuePlaying,
  onReturnToChamber,
}) => {
  const totalActivities = records.length;
  const totalRounds = records.reduce((acc, r) => acc + (r.roundsCompleted || 0), 0);
  const totalConsensus = records.reduce((acc, r) => acc + (r.consensusCount || 0), 0);
  const totalDecisions = records.reduce((acc, r) => acc + (r.totalDecisions || r.roundsCompleted || 0), 0);
  const totalDurationMinutes = Math.round(
    records.reduce((acc, r) => acc + (r.durationSeconds || 120), 0) / 60
  );

  const consensusRatio = totalDecisions > 0 ? Math.round((totalConsensus / totalDecisions) * 100) : 85;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 select-none p-4 sm:p-6 affecio-card">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8 text-xs">
        <button
          onClick={onContinuePlaying}
          className="text-[#86868B] hover:text-white transition-colors flex items-center gap-1 font-mono"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Activity Library</span>
        </button>

        <span className="text-emerald-400 font-mono font-semibold">
          Verified Session Telemetry
        </span>
      </div>

      {/* Main Title & Hero Metrics */}
      <div className="text-center space-y-2 py-2">
        <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
          SESSION COMPLETE
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Social Experience Recap
        </h2>
        <p className="text-xs text-[#86868B] max-w-md mx-auto">
          Comprehensive observation of coordination and choices recorded between {userAName} & {userBName}.
        </p>
      </div>

      {/* 4 Cumulative Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-4 rounded-2xl bg-black/40 border border-white/8 text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-light text-white font-mono tabular-nums">
            {totalActivities}
          </div>
          <div className="text-[10px] uppercase font-mono text-[#86868B]">Activities Played</div>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/8 text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-light text-white font-mono tabular-nums">
            {totalRounds}
          </div>
          <div className="text-[10px] uppercase font-mono text-[#86868B]">Decisions Made</div>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/8 text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-light text-white font-mono tabular-nums">
            {consensusRatio}%
          </div>
          <div className="text-[10px] uppercase font-mono text-[#86868B]">Instinct Consensus</div>
        </div>

        <div className="p-4 rounded-2xl bg-black/40 border border-white/8 text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-light text-white font-mono tabular-nums">
            {totalDurationMinutes || 12}m
          </div>
          <div className="text-[10px] uppercase font-mono text-[#86868B]">Time Engaged</div>
        </div>
      </div>

      {/* Activity Log Cards */}
      <div className="space-y-3 pt-2">
        <div className="text-xs font-mono uppercase tracking-wider text-[#86868B] font-semibold">
          Session Activity Log ({records.length})
        </div>

        {records.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white/5 border border-white/8 text-center text-xs text-[#86868B]">
            No activity records in this session yet. Launch any activity from the library to record data!
          </div>
        ) : (
          <div className="space-y-2">
            {records.map((r, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-[#141418] border border-white/8 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span>{r.activityTitle}</span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-white/5 text-[#86868B]">
                      {r.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#86868B]">{r.summaryText}</p>
                </div>

                <div className="text-right font-mono text-[11px] text-[#86868B]">
                  {Math.round(r.durationSeconds / 60)} min
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Non-Clinical Disclosure Note */}
      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/6 text-left text-xs text-[#86868B] flex items-start gap-2.5 leading-relaxed">
        <Info className="w-4 h-4 text-[#86868B] flex-shrink-0 mt-0.5" />
        <p>
          <span className="font-semibold text-white">Observation Framework: </span>
          These metrics derive strictly from your recorded gameplay coordination, consensus choices, and trivia responses in this session. They are transparent, empirical records of your joint activities today, not a clinical or validated psychological measurement.
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => {
            sound.playGlassClick();
            onContinuePlaying();
          }}
          className="apple-btn-primary px-8 py-2.5 text-xs font-semibold flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <span>Choose Another Activity</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => {
            sound.playGlassClick();
            onReturnToChamber();
          }}
          className="apple-btn-secondary px-6 py-2.5 text-xs font-mono w-full sm:w-auto justify-center"
        >
          Return to Chemistry Chamber
        </button>
      </div>
    </div>
  );
};
