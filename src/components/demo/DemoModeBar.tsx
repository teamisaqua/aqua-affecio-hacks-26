'use client';

import React from 'react';
import { UserRole, ExperienceStage } from '@/lib/types/chemistry';
import { UserCheck, Sparkles, Compass, Sliders } from 'lucide-react';
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
  const isExplore = currentRole === 'explore' || currentRole === 'observer';

  const stages: { id: ExperienceStage; label: string }[] = [
    { id: 'lobby', label: 'Lobby' },
    { id: 'bond', label: '01 Bond' },
    { id: 'reactor', label: '02 Reaction' },
    { id: 'dilemma', label: '03 Dilemma' },
    { id: 'engine', label: 'Affinity' },
    { id: 'card', label: 'Card' },
    { id: 'conversation', label: 'Chat' },
  ];

  return (
    <aside
      aria-label="Presenter Controls"
      className="fixed bottom-5 inset-x-0 mx-auto w-fit z-50 px-4 py-2 rounded-full bg-[#171717]/95 border border-white/10 shadow-2xl flex items-center space-x-3 text-xs select-none backdrop-blur-md"
    >
      <div className="flex items-center gap-1.5 text-white font-medium pr-2 border-r border-white/10">
        <Sparkles className="w-3.5 h-3.5 text-apple-blue" />
        <span className="hidden sm:inline">Demo Mode</span>
      </div>

      {/* Role Switcher */}
      <div className="flex items-center p-0.5 rounded-full bg-[#242426] border border-white/8">
        <button
          onClick={() => {
            sound.playGlassClick();
            onSwitchRole('explore');
          }}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
            isExplore
              ? 'bg-white text-black shadow-sm'
              : 'text-[#A1A1A6] hover:text-white'
          }`}
        >
          <Compass className="w-3 h-3" />
          <span>Explore</span>
        </button>
        <button
          onClick={() => {
            sound.playGlassClick();
            onSwitchRole('control');
          }}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
            !isExplore
              ? 'bg-white text-black shadow-sm'
              : 'text-[#A1A1A6] hover:text-white'
          }`}
        >
          <Sliders className="w-3 h-3" />
          <span>Control</span>
        </button>
      </div>

      {/* Partner Simulation Action */}
      <button
        onClick={() => {
          sound.playGlassClick();
          onSimulatePartnerAction();
        }}
        className="px-3 py-1 rounded-full bg-[#242426] hover:bg-[#2C2C2E] text-white border border-white/8 transition-all flex items-center gap-1.5 text-xs font-medium"
      >
        <UserCheck className="w-3.5 h-3.5 text-apple-green" />
        <span>Simulate Partner</span>
      </button>

      {/* Quick Jump Stages */}
      <div className="hidden md:flex items-center space-x-1 pl-1 border-l border-white/10">
        {stages.map((st) => (
          <button
            key={st.id}
            onClick={() => {
              sound.playGlassClick();
              onSkipToStage(st.id);
            }}
            className={`px-2.5 py-0.5 rounded-full text-[11px] transition-all ${
              currentStage === st.id
                ? 'bg-apple-blue/20 text-apple-blue border border-apple-blue/40 font-medium'
                : 'text-[#A1A1A6] hover:text-white'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>
    </aside>
  );
};
