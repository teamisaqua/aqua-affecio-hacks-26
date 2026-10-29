'use client';

import React, { useRef } from 'react';
import { LAB_EXPERIMENTS, LabExperimentItem } from './InAppActivitySelector';
import { sound } from '@/lib/sound/soundEffects';
import {
  CheckCircle2,
  Atom,
  ChevronRight,
  Layers,
  Sparkles,
  MapPin,
  Compass,
} from 'lucide-react';

interface ExperimentStepperProps {
  activeExperimentId: string;
  completedExperimentIds: string[];
  onSelectExperiment: (expId: string) => void;
  onOpenMap: () => void;
}

export const ExperimentStepper: React.FC<ExperimentStepperProps> = ({
  activeExperimentId,
  completedExperimentIds,
  onSelectExperiment,
  onOpenMap,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleStepClick = (expId: string) => {
    sound.playGlassClick();
    onSelectExperiment(expId);
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected) {
      sound.playGlassClick();
      onSelectExperiment(selected);
    }
  };

  const currentExp =
    LAB_EXPERIMENTS.find((e) => e.id === activeExperimentId) || LAB_EXPERIMENTS[0];

  return (
    <div className="w-full bg-[#0E0E12]/95 border border-white/8 rounded-2xl p-1.5 sm:p-2 backdrop-blur-xl shadow-lg space-y-1.5">
      {/* Top Meta Line: Current Experiment Info + Quick Dropdown + Map Button */}
      <div className="flex items-center justify-between px-2 pt-0.5 pb-1 border-b border-white/5 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#2997FF] font-semibold flex items-center gap-1">
            <Atom className="w-3 h-3 text-[#2997FF]" />
            <span>Experiment Sequence</span>
          </span>
          <span className="text-white/20 hidden sm:inline">·</span>
          <span className="text-xs text-white font-medium truncate max-w-[200px] sm:max-w-none">
            {currentExp.number}. {currentExp.title}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Mobile / Compact Quick Switcher Dropdown */}
          <div className="relative md:hidden">
            <select
              aria-label="Select Experiment"
              value={activeExperimentId}
              onChange={handleDropdownChange}
              className="bg-[#16161A] border border-white/10 rounded-lg px-2 py-1 text-[11px] font-mono text-white outline-none cursor-pointer pr-6 appearance-none focus:border-[#2997FF]"
            >
              {LAB_EXPERIMENTS.map((exp) => (
                <option key={exp.id} value={exp.id} className="bg-[#121216] text-white">
                  {exp.number} · {exp.title} {completedExperimentIds.includes(exp.id) ? '✓' : ''}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-white/40 text-[9px]">
              ▼
            </div>
          </div>

          {/* Full Map Modal Trigger */}
          <button
            onClick={() => {
              sound.playGlassClick();
              onOpenMap();
            }}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 text-[11px] font-mono text-white hover:text-[#2997FF] transition-all flex items-center gap-1 cursor-pointer"
            title="Open Complete 10 Experiments Lab Map"
          >
            <Compass className="w-3 h-3 text-[#2997FF]" />
            <span className="hidden sm:inline">Lab Map</span>
          </button>
        </div>
      </div>

      {/* Horizontal Stepper Row: Clean Apple HIG Pills */}
      <div className="relative w-full overflow-hidden">
        <div
          ref={scrollRef}
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5 px-0.5"
        >
          {LAB_EXPERIMENTS.map((exp) => {
            const isActive = activeExperimentId === exp.id;
            const isCompleted = completedExperimentIds.includes(exp.id);

            return (
              <button
                key={exp.id}
                onClick={() => handleStepClick(exp.id)}
                className={`flex-shrink-0 px-2.5 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isActive
                    ? 'bg-white text-black font-semibold border-white shadow-md'
                    : isCompleted
                    ? 'bg-[#141C16] border-[#34C759]/40 text-white hover:border-[#34C759]'
                    : 'bg-[#141418] border-white/6 text-[#86868B] hover:text-white hover:border-white/15'
                }`}
                title={`${exp.number}. ${exp.title} (${exp.category})`}
              >
                <span
                  className={`text-[10px] font-mono font-bold ${
                    isActive
                      ? 'text-black'
                      : isCompleted
                      ? 'text-[#34C759]'
                      : 'text-white/40'
                  }`}
                >
                  {exp.number}
                </span>

                <span className="text-[11px] whitespace-nowrap">
                  {exp.title}
                </span>

                {isCompleted && (
                  <CheckCircle2
                    className={`w-3 h-3 flex-shrink-0 ${
                      isActive ? 'text-black' : 'text-[#34C759]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
