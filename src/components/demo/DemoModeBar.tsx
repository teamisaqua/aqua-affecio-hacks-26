'use client';

import React from 'react';
import { UserRole, ExperienceStage } from '@/lib/types/chemistry';
import { UserCheck, Sparkles, Compass, Sliders, Play, Pause, FastForward, User } from 'lucide-react';
import { sound } from '@/lib/sound/soundEffects';

interface DemoModeBarProps {
  currentStage: ExperienceStage;
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onSkipToStage: (stage: ExperienceStage) => void;
  onSimulatePartnerAction: () => void;
  isAutoDemo?: boolean;
  demoSeconds?: number;
  totalSeconds?: number;
  isPaused?: boolean;
  onTogglePause?: () => void;
  onTakeControl?: () => void;
}

export const DemoModeBar: React.FC<DemoModeBarProps> = ({
  currentStage,
  currentRole,
  onSwitchRole,
  onSkipToStage,
  onSimulatePartnerAction,
  isAutoDemo = false,
  demoSeconds = 0,
  totalSeconds = 48,
  isPaused = false,
  onTogglePause,
  onTakeControl,
}) => {
  const isExplore = currentRole === 'explore' || currentRole === 'observer';

  const stages: { id: ExperienceStage; label: string }[] = [
    { id: 'lobby', label: 'Lobby' },
    { id: 'bond', label: '01 Bond' },
    { id: 'reactor', label: '02 Reaction' },
    { id: 'dilemma', label: '03 Dilemma' },
    { id: 'engine', label: 'Affinity' },
    { id: 'card', label: 'Card' },
    { id: 'conversation', label: 'Sparks' },
  ];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <aside
      aria-label="Presenter Controls"
      className="fixed bottom-4 sm:bottom-6 inset-x-0 mx-auto w-fit max-w-[95vw] z-50 px-3.5 sm:px-4 py-2 rounded-full bg-[#121215]/95 border border-white/12 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex items-center space-x-2 sm:space-x-3 text-xs select-none backdrop-blur-xl transition-all"
    >
      {/* Auto Demo Tour Indicators */}
      {isAutoDemo ? (
        <div className="flex items-center space-x-2 pr-2 border-r border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#2997FF] animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white font-semibold flex items-center gap-1">
              <span>JUDGE EVALUATION TOUR</span>
              <span className="text-[#86868B]">({formatTime(demoSeconds)}/{formatTime(totalSeconds)})</span>
            </span>
            <span className="text-[9px] text-[#86868B] font-mono">
              Simulated: Alex & Taylor
            </span>
          </div>

          {onTogglePause && (
            <button
              onClick={() => {
                sound.playGlassClick();
                onTogglePause();
              }}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white ml-1 transition-all"
              title={isPaused ? 'Resume Tour' : 'Pause Tour'}
              aria-label={isPaused ? 'Resume Tour' : 'Pause Tour'}
            >
              {isPaused ? <Play className="w-3 h-3 fill-white" /> : <Pause className="w-3 h-3" />}
            </button>
          )}

          <button
            onClick={() => {
              sound.playGlassClick();
              onSkipToStage('engine');
            }}
            className="px-2 py-0.5 rounded-full bg-[#2997FF]/15 text-[#2997FF] hover:bg-[#2997FF]/25 border border-[#2997FF]/30 text-[10px] font-mono flex items-center gap-1 transition-all"
            title="Skip directly to Affinity Result"
          >
            <FastForward className="w-3 h-3" />
            <span className="hidden sm:inline">Skip to Results</span>
          </button>

          {onTakeControl && (
            <button
              onClick={() => {
                sound.playGlassClick();
                onTakeControl();
              }}
              className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono flex items-center gap-1 transition-all"
              title="Pause automation and control manually"
            >
              <User className="w-3 h-3" />
              <span className="hidden sm:inline">Manual Control</span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-white font-medium pr-2 border-r border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-[#2997FF]" />
          <span className="hidden sm:inline">Presenter Tools</span>
        </div>
      )}

      {/* Role Switcher */}
      <div className="flex items-center p-0.5 rounded-full bg-[#1C1C20] border border-white/8">
        <button
          onClick={() => {
            sound.playGlassClick();
            onSwitchRole('explore');
          }}
          className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
            isExplore
              ? 'bg-white text-black shadow-sm'
              : 'text-[#86868B] hover:text-white'
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
          className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1 ${
            !isExplore
              ? 'bg-white text-black shadow-sm'
              : 'text-[#86868B] hover:text-white'
          }`}
        >
          <Sliders className="w-3 h-3" />
          <span>Control</span>
        </button>
      </div>

      {/* Partner Simulation Action */}
      {!isAutoDemo && (
        <button
          onClick={() => {
            sound.playGlassClick();
            onSimulatePartnerAction();
          }}
          className="px-2.5 sm:px-3 py-1 rounded-full bg-[#1C1C20] hover:bg-[#25252A] text-white border border-white/8 transition-all flex items-center gap-1 text-[11px] font-medium"
        >
          <UserCheck className="w-3 h-3 text-[#34C759]" />
          <span>Simulate Partner</span>
        </button>
      )}

      {/* Quick Jump Stages */}
      <div className="hidden lg:flex items-center space-x-1 pl-1 border-l border-white/10">
        {stages.map((st) => (
          <button
            key={st.id}
            onClick={() => {
              sound.playGlassClick();
              onSkipToStage(st.id);
            }}
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-all ${
              currentStage === st.id
                ? 'bg-[#2997FF]/20 text-[#2997FF] border border-[#2997FF]/40 font-medium'
                : 'text-[#86868B] hover:text-white'
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>
    </aside>
  );
};
