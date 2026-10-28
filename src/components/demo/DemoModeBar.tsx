'use client';

import React from 'react';
import { UserRole, ExperienceStage } from '@/lib/types/chemistry';
import { Play, FastForward, UserCheck, ShieldAlert } from 'lucide-react';
import { sound } from '@/lib/sound/soundEffects';

interface DemoModeBarProps {
  currentStage: ExperienceStage;
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onSkipToStage: (stage: ExperienceStage) => void;
  onSimulatePartnerAction: () => void;
}

export const DemoModeBar: React.FC<DemoModeBarProps> = ({
  currentStage,
  currentRole,
  onSwitchRole,
  onSkipToStage,
  onSimulatePartnerAction,
}) => {
  const stages: ExperienceStage[] = [
    'lobby',
    'reactor',
    'dilemma',
    'engine',
    'compound',
    'card',
    'conversation',
  ];

  return (
    <aside
      aria-label="Hackathon Demo Controller"
      className="fixed bottom-3 inset-x-0 mx-auto w-fit z-50 px-4 py-2 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/20 shadow-glass-lg flex items-center space-x-3 text-xs font-mono"
    >
      <div className="flex items-center gap-1.5 text-lab-cyan font-bold border-r border-white/15 pr-3">
        <ShieldAlert className="w-3.5 h-3.5" />
        <span>DEMO CONTROLLER</span>
      </div>

      {/* Role Toggle */}
      <div className="flex items-center space-x-1 border-r border-white/15 pr-3">
        <button
          onClick={() => {
            sound.playGlassClick();
            onSwitchRole('observer');
          }}
          className={`px-2 py-1 rounded-md transition-all ${
            currentRole === 'observer'
              ? 'bg-lab-cyan text-black font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          View A (Observer)
        </button>
        <button
          onClick={() => {
            sound.playGlassClick();
            onSwitchRole('operator');
          }}
          className={`px-2 py-1 rounded-md transition-all ${
            currentRole === 'operator'
              ? 'bg-lab-pink text-white font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          View B (Operator)
        </button>
      </div>

      {/* Simulate Partner Button */}
      <button
        onClick={() => {
          sound.playGlassClick();
          onSimulatePartnerAction();
        }}
        className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all flex items-center gap-1"
      >
        <UserCheck className="w-3 h-3" />
        <span>Simulate Partner</span>
      </button>

      {/* Quick Stage Jump Dropdown / Pill */}
      <div className="hidden md:flex items-center space-x-1 pl-1">
        {stages.map((st) => (
          <button
            key={st}
            onClick={() => {
              sound.playGlassClick();
              onSkipToStage(st);
            }}
            className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono transition-all ${
              currentStage === st
                ? 'bg-white/20 text-white font-bold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {st}
          </button>
        ))}
      </div>
    </aside>
  );
};
