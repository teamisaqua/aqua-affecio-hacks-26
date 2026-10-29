'use client';

import React from 'react';
import { LAB_EXPERIMENTS, LabExperimentItem } from './InAppActivitySelector';
import { sound } from '@/lib/sound/soundEffects';
import {
  CheckCircle2,
  Atom,
  ChevronRight,
  ChevronLeft,
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
  const currentIdx = LAB_EXPERIMENTS.findIndex((e) => e.id === activeExperimentId);
  const safeIdx = currentIdx >= 0 ? currentIdx : 0;
  const currentExp = LAB_EXPERIMENTS[safeIdx];
  const prevExp = safeIdx > 0 ? LAB_EXPERIMENTS[safeIdx - 1] : null;
  const nextExp = safeIdx < LAB_EXPERIMENTS.length - 1 ? LAB_EXPERIMENTS[safeIdx + 1] : null;

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

  return (
    <nav
      aria-label="Experiment Progress Navigator"
      className="w-full bg-[#111114] border border-white/10 rounded-2xl p-3 sm:p-4 shadow-md select-none space-y-2.5"
    >
      {/* 10-Segment Continuous Progress Rail */}
      <div className="grid grid-cols-10 gap-1 sm:gap-1.5 w-full h-1.5">
        {LAB_EXPERIMENTS.map((exp) => {
          const isCompleted = completedExperimentIds.includes(exp.id);
          const isActive = activeExperimentId === exp.id;
          return (
            <div
              key={exp.id}
              className={`h-full rounded-full transition-all duration-300 ${
                isCompleted
                  ? 'bg-[#4ADE80]'
                  : isActive
                  ? 'bg-[#38BDF8] ring-1 ring-[#38BDF8]/50'
                  : 'bg-white/10'
              }`}
            />
          );
        })}
      </div>

      {/* Meta Bar: Active Experiment Info & Secondary Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-b border-white/[0.06] pb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] text-[10px] font-mono uppercase tracking-wider font-semibold shrink-0 border border-[#38BDF8]/20">
            <Atom className="w-3 h-3 text-[#38BDF8]" />
            <span>Exp {currentExp.number}/10</span>
          </span>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#F5F5F7] truncate leading-tight">
              {currentExp.title}
            </h3>
            <p className="text-[11px] text-[#A1A1AA] truncate hidden md:block">
              {currentExp.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          {/* Progress Count */}
          <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA] font-mono mr-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
            <span>
              {completedExperimentIds.length}/10 Done
            </span>
          </div>

          {/* Stepper Step Arrows (< and >) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => prevExp && handleStepClick(prevExp.id)}
              disabled={!prevExp}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center text-[#F5F5F7] transition-all cursor-pointer"
              title={prevExp ? `Previous: ${prevExp.title}` : 'First Experiment'}
              aria-label="Previous Experiment"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => nextExp && handleStepClick(nextExp.id)}
              disabled={!nextExp}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed flex items-center justify-center text-[#F5F5F7] transition-all cursor-pointer"
              title={nextExp ? `Next: ${nextExp.title}` : 'Last Experiment'}
              aria-label="Next Experiment"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Dropdown Switcher (<md screens) */}
          <div className="relative md:hidden">
            <select
              aria-label="Jump to Experiment"
              value={activeExperimentId}
              onChange={handleDropdownChange}
              className="bg-[#18181D] border border-white/10 rounded-lg px-2.5 py-1 text-[11px] font-mono text-[#F5F5F7] outline-none cursor-pointer pr-6 appearance-none focus:border-[#38BDF8]"
            >
              {LAB_EXPERIMENTS.map((exp) => (
                <option key={exp.id} value={exp.id} className="bg-[#111114] text-[#F5F5F7]">
                  {exp.number}. {exp.title} {completedExperimentIds.includes(exp.id) ? '✓' : ''}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/40 text-[9px]">
              ▼
            </div>
          </div>

          {/* Complete 10 Experiments Lab Map Trigger */}
          <button
            onClick={() => {
              sound.playGlassClick();
              onOpenMap();
            }}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-[#F5F5F7] hover:text-[#38BDF8] transition-all flex items-center gap-1.5 cursor-pointer"
            title="Browse full 10-experiment lab map and curriculum"
          >
            <Compass className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden sm:inline">Lab Map</span>
          </button>
        </div>
      </div>

      {/* Desktop Intentional 10-Step Navigator Grid (Hidden on Mobile) */}
      <div className="hidden md:grid grid-cols-5 lg:grid-cols-10 gap-1.5 pt-0.5">
        {LAB_EXPERIMENTS.map((exp) => {
          const isActive = activeExperimentId === exp.id;
          const isCompleted = completedExperimentIds.includes(exp.id);

          return (
            <button
              key={exp.id}
              onClick={() => handleStepClick(exp.id)}
              className={`px-2 py-2 rounded-xl text-left transition-all flex flex-col justify-between border cursor-pointer ${
                isActive
                  ? 'bg-[#18181D] border-[#38BDF8] ring-1 ring-[#38BDF8]/40 shadow-sm'
                  : isCompleted
                  ? 'bg-[#111114] border-[#4ADE80]/30 hover:border-[#4ADE80]'
                  : 'bg-[#111114] border-white/[0.08] hover:border-white/20'
              }`}
              title={`${exp.number}. ${exp.title} (${exp.category})`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`text-[10px] font-mono font-bold ${
                    isActive
                      ? 'text-[#38BDF8]'
                      : isCompleted
                      ? 'text-[#4ADE80]'
                      : 'text-white/40'
                  }`}
                >
                  {exp.number}
                </span>

                {isCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-[#4ADE80] shrink-0" />
                ) : (
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isActive ? 'bg-[#38BDF8]' : 'bg-transparent'
                    }`}
                  />
                )}
              </div>

              <span
                className={`text-[11px] leading-tight font-medium truncate w-full ${
                  isActive
                    ? 'text-[#F5F5F7] font-semibold'
                    : isCompleted
                    ? 'text-[#F5F5F7]'
                    : 'text-[#71717A]'
                }`}
              >
                {exp.title}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
