'use client';

import React from 'react';
import { UserRole, ExperienceStage } from '@/lib/types/chemistry';
import { Play, FastForward, UserCheck, Shield } from 'lucide-react';
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
  const stages: { id: ExperienceStage; label: string }[] = [
    { id: 'lobby', label: 'Lobby' },
    { id: 'reactor', label: 'Reactor' },
    { id: 'dilemma', label: 'Dilemma' },
    { id: 'engine', label: 'Engine' },
    { id: 'compound', label: 'Compound' },
    { id: 'card', label: 'Card' },
    { id: 'conversation', label: 'Chat' },
  ];

  return (
    <aside
      aria-label="Presenter Controls"
      className="fixed bottom-4 inset-x-0 mx-auto w-fit z-50 px-3.5 py-2 rounded-full bg-[#12141c]/90 backdrop-blur-2xl border border-white/[0.14] shadow-apple-card flex items-center space-x-3 text-xs select-none"
    >
      <div className="flex items-center gap-1.5 text-slate-300 font-medium pl-1 pr-2 border-r border-white/10">
        <Shield className="w-3.5 h-3.5 text-sky-400" />
        <span className="hidden sm:inline">Presenter Bar</span>
      </div>

      {/* Role Switcher (Apple Segmented Control) */}
      <div className="flex items-center p-0.5 rounded-full bg-black/40 border border-white/10">
        <button
          onClick={() => {
            sound.playGlassClick();
            onSwitchRole('observer');
          }}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
            currentRole === 'observer'
              ? 'bg-white text-black shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Observer
        </button>
        <button
          onClick={() => {
            sound.playGlassClick();
            onSwitchRole('operator');
          }}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
            currentRole === 'operator'
              ? 'bg-white text-black shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Operator
        </button>
      </div>

      {/* Partner Simulation Action */}
      <button
        onClick={() => {
          sound.playGlassClick();
          onSimulatePartnerAction();
        }}
        className="px-2.5 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-slate-200 border border-white/10 transition-all flex items-center gap-1.5 text-xs font-medium"
      >
        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>Simulate Partner</span>
      </button>

      {/* Jump Stage Segmented Control */}
      <div className="hidden lg:flex items-center space-x-1 pl-1 border-l border-white/10">
        {stages.map((st) => (
          <button
            key={st.id}
            onClick={() => {
              sound.playGlassClick();
              onSkipToStage(st.id);
            }}
            className={`px-2 py-0.5 rounded-full text-[11px] transition-all ${
              currentStage === st.id
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>
    </aside>
  );
};
