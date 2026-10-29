'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ReactorTarget, ReactorState, UserRole } from '@/lib/types/chemistry';
import { EQUILIBRIUM_SCENARIOS, EquilibriumScenario } from '@/lib/data/experiments/equilibriumScenarios';
import { ReactorVessel } from './ReactorVessel';
import { ObserverView } from './ObserverView';
import { OperatorView } from './OperatorView';
import { sound } from '@/lib/sound/soundEffects';
import { Timer, CheckCircle2, Sparkles, Sliders, Compass, ChevronDown, ArrowRight, RotateCcw, FlaskConical, Award } from 'lucide-react';

interface ReactorContainerProps {
  role: UserRole;
  userAName: string;
  userBName: string;
  target: ReactorTarget;
  state: ReactorState;
  onStateUpdate: (updater: (prev: ReactorState) => ReactorState) => void;
  onComplete: (stats: { timeTaken: number; overshoots: number }) => void;
  demoMode?: boolean;
}

export const ReactorContainer: React.FC<ReactorContainerProps> = ({
  role,
  userAName,
  userBName,
  target,
  state,
  onStateUpdate,
  onComplete,
  demoMode = false,
}) => {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [isScenarioPickerOpen, setIsScenarioPickerOpen] = useState(false);
  const [viewFilter, setViewFilter] = useState<'all' | 'explore' | 'vessel' | 'control'>('all');
  const [timeLeft, setTimeLeft] = useState(45);
  const [solvedScenarios, setSolvedScenarios] = useState<string[]>([]);
  const isCompletedRef = useRef(false);

  const activeScenario: EquilibriumScenario = EQUILIBRIUM_SCENARIOS[selectedScenarioIdx] || EQUILIBRIUM_SCENARIOS[0];
  const isExplore = role === 'explore' || role === 'observer';

  // Dynamic active target derived from selected scenario
  const effectiveTarget: ReactorTarget = {
    temp: activeScenario.targetTemp,
    pressure: activeScenario.targetPressure,
    colorName: activeScenario.colorName,
    colorHex: activeScenario.colorHex,
    tolerance: activeScenario.toleranceTemp,
  };

  // 45-second countdown timer and stability evaluator loop
  useEffect(() => {
    if (state.isSuccess) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });

      onStateUpdate((current) => {
        if (current.isSuccess) return current;

        const tempOk = Math.abs(current.currentTemp - effectiveTarget.temp) <= effectiveTarget.tolerance;
        const pressureOk = Math.abs(current.currentPressure - effectiveTarget.pressure) <= 0.4;
        const valveOk = !activeScenario.catalystRequired || current.catalystValve;
        const inZone = tempOk && pressureOk && valveOk;

        let nextStabilized = current.stabilizedDuration;
        let nextOvershoots = current.overshootCount;

        if (current.currentTemp > effectiveTarget.temp + 20 || current.currentPressure > effectiveTarget.pressure + 3.0) {
          if (!current.isStabilized && Math.random() < 0.04) {
            nextOvershoots += 1;
            sound.playWarningHum();
          }
        }

        if (inZone) {
          nextStabilized += 0.25;
        } else {
          nextStabilized = Math.max(0, nextStabilized - 0.5);
        }

        const stabilityPct = Math.min(100, Math.round((nextStabilized / 3.0) * 100));

        if (nextStabilized >= 3.0 && !isCompletedRef.current) {
          isCompletedRef.current = true;
          sound.playSuccessChime();

          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#2997FF', '#34C759', '#38BDF8'],
            });
          } catch {
            // ignore confetti
          }

          setSolvedScenarios((prev) => Array.from(new Set([...prev, activeScenario.id])));

          if (demoMode) {
            setTimeout(() => {
              onComplete({
                timeTaken: 45 - timeLeft + (3.0 - nextStabilized),
                overshoots: nextOvershoots,
              });
            }, 2600);
          }

          return {
            ...current,
            isStabilized: true,
            stabilizedDuration: 3.0,
            stabilityPercentage: 100,
            isSuccess: true,
            elapsedSeconds: 45 - timeLeft,
          };
        }

        return {
          ...current,
          isStabilized: inZone,
          stabilizedDuration: nextStabilized,
          stabilityPercentage: stabilityPct,
          overshootCount: nextOvershoots,
          elapsedSeconds: 45 - timeLeft,
        };
      });
    }, 250);

    return () => clearInterval(interval);
  }, [state.isSuccess, effectiveTarget, timeLeft, onComplete, onStateUpdate, activeScenario, demoMode]);

  const handleTempChange = (temp: number) => {
    onStateUpdate((prev) => ({ ...prev, currentTemp: temp }));
  };

  const handlePressureChange = (pressure: number) => {
    onStateUpdate((prev) => ({ ...prev, currentPressure: pressure }));
  };

  const handleValveToggle = () => {
    onStateUpdate((prev) => ({ ...prev, catalystValve: !prev.catalystValve }));
  };

  const handleSelectScenario = (idx: number) => {
    sound.playGlassClick();
    setSelectedScenarioIdx(idx);
    setIsScenarioPickerOpen(false);
    isCompletedRef.current = false;
    // Reset reactor conditions for the new scenario
    onStateUpdate((prev) => ({
      ...prev,
      isStabilized: false,
      stabilizedDuration: 0,
      stabilityPercentage: 0,
      isSuccess: false,
      elapsedSeconds: 0,
    }));
    setTimeLeft(45);
  };

  const handleProceedToDilemmas = () => {
    sound.playSuccessChime();
    onComplete({
      timeTaken: state.elapsedSeconds || 21.4,
      overshoots: state.overshootCount || 0,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-5 select-none py-2">
      {/* Primary Experiment Title & Scenario Controls Bar */}
      <div className="space-y-3 pb-3 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8] text-[10px] font-mono uppercase tracking-wider font-semibold">
                Experiment 02
              </span>
              <span className="text-white/20">·</span>
              <span className="text-[#A1A1AA] text-xs font-mono">
                {activeScenario.chemicalEquation}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#F5F5F7] tracking-tight">
              Reaction Equilibrium & Kinetics
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center flex-wrap">
            {/* Scenario Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsScenarioPickerOpen((prev) => !prev)}
                className="px-3 py-1.5 rounded-full bg-[#18181D] hover:bg-[#222228] border border-white/10 text-xs font-medium text-[#F5F5F7] flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FlaskConical className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="font-mono text-xs">{selectedScenarioIdx + 1}/10: {activeScenario.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#A1A1AA]" />
              </button>

              {isScenarioPickerOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#18181D] border border-white/10 shadow-2xl p-2 z-50 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#A1A1AA]">
                    10 Equilibrium Challenge Scenarios
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {EQUILIBRIUM_SCENARIOS.map((sc, i) => {
                      const isCurrent = i === selectedScenarioIdx;
                      const isSolved = solvedScenarios.includes(sc.id);
                      return (
                        <button
                          key={sc.id}
                          onClick={() => handleSelectScenario(i)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer ${
                            isCurrent
                              ? 'bg-[#F5F5F7] text-[#09090B] font-semibold'
                              : 'hover:bg-white/5 text-[#A1A1AA] hover:text-[#F5F5F7]'
                          }`}
                        >
                          <div className="truncate mr-2">
                            <div className="truncate">{i + 1}. {sc.name}</div>
                            <div className={`text-[10px] truncate ${isCurrent ? 'text-black/60 font-mono' : 'text-white/30 font-mono'}`}>
                              {sc.targetTemp}°C · {sc.targetPressure} bar
                            </div>
                          </div>
                          {isSolved && (
                            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-black' : 'text-[#4ADE80]'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Reaction Stability Status */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className={`px-2.5 py-1 rounded-full font-semibold tabular-nums text-xs font-mono border ${
                state.isSuccess
                  ? 'bg-[#4ADE80]/15 text-[#4ADE80] border-[#4ADE80]/30'
                  : state.isStabilized
                  ? 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30'
                  : 'bg-[#18181D] text-[#A1A1AA] border-white/10'
              }`}>
                {state.isSuccess ? '100% Stable' : `${state.stabilityPercentage}%`}
              </span>
            </div>

            {/* Time Remaining */}
            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#18181D] border border-white/10 tabular-nums text-[#F5F5F7] text-xs font-semibold font-mono">
              <Timer className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>00:{timeLeft.toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Action Directives Banner (Clear Instructions) */}
        <div className="p-3 rounded-2xl bg-[#111114] border border-white/[0.08] text-xs text-[#A1A1AA] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
            <span>
              <strong className="text-[#F5F5F7]">Explore</strong> directs target thresholds · <strong className="text-[#F5F5F7]">Control</strong> adjusts thermal actuators and pressure regulators.
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#71717A]">Hold in target window for 3.0 seconds</span>
        </div>
      </div>

      {/* Mobile/Tablet View Segmented Switch */}
      <div className="flex lg:hidden items-center justify-center">
        <div className="inline-flex items-center p-1 rounded-full bg-[#18181D] border border-white/10 text-xs">
          <button
            onClick={() => setViewFilter('all')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              viewFilter === 'all' ? 'bg-[#F5F5F7] text-[#09090B] font-semibold' : 'text-[#A1A1AA]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setViewFilter('explore')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              viewFilter === 'explore' ? 'bg-[#F5F5F7] text-[#09090B] font-semibold' : 'text-[#A1A1AA]'
            }`}
          >
            Explore {isExplore ? '(You)' : ''}
          </button>
          <button
            onClick={() => setViewFilter('vessel')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              viewFilter === 'vessel' ? 'bg-[#F5F5F7] text-[#09090B] font-semibold' : 'text-[#A1A1AA]'
            }`}
          >
            Reaction Core
          </button>
          <button
            onClick={() => setViewFilter('control')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
              viewFilter === 'control' ? 'bg-[#F5F5F7] text-[#09090B] font-semibold' : 'text-[#A1A1AA]'
            }`}
          >
            Control {!isExplore ? '(You)' : ''}
          </button>
        </div>
      </div>

      {/* Main Experiment Arena: Central Core Flanked by Consoles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT: Explore Console */}
        <div className={`lg:col-span-4 p-5 rounded-2xl bg-[#111114] border border-white/10 space-y-4 shadow-sm ${
          viewFilter !== 'all' && viewFilter !== 'explore' ? 'hidden lg:block' : 'block'
        }`}>
          <ObserverView
            target={effectiveTarget}
            state={state}
            partnerName={userBName}
          />
          {/* Active Guidance Note for Explore */}
          <div className="p-3.5 rounded-xl bg-[#18181D] border border-white/[0.08] text-xs space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5 font-semibold">
              <Compass className="w-3 h-3 text-[#38BDF8]" />
              <span>Explore Directives</span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
              {activeScenario.exploreBrief}
            </p>
          </div>
        </div>

        {/* CENTER: The Reaction Vessel Core */}
        <div className={`lg:col-span-4 p-6 rounded-2xl bg-[#111114] border border-white/10 flex flex-col items-center justify-between min-h-[440px] shadow-sm ${
          viewFilter !== 'all' && viewFilter !== 'vessel' ? 'hidden lg:flex' : 'flex'
        }`}>
          <div className="w-full flex items-center justify-between pb-2 border-b border-white/[0.08] text-xs text-[#A1A1AA]">
            <span className="font-medium text-[#F5F5F7]">Reaction Core</span>
            <span className="text-[#4ADE80] font-medium font-mono text-[11px]">
              {activeScenario.catalystRequired ? activeScenario.catalystName : 'Homogeneous Gas'}
            </span>
          </div>

          <div className="my-auto py-2">
            <ReactorVessel
              currentTemp={state.currentTemp}
              currentPressure={state.currentPressure}
              isStabilized={state.isStabilized}
              isSuccess={state.isSuccess}
              stabilityPercentage={state.stabilityPercentage}
            />
          </div>

          <div className="w-full pt-3 border-t border-white/[0.08] text-center text-xs text-[#A1A1AA]">
            {state.isSuccess ? (
              <span className="text-[#4ADE80] font-semibold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" /> Reaction Equilibrium Achieved
              </span>
            ) : state.isStabilized ? (
              <span className="text-[#38BDF8] font-medium animate-pulse flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#38BDF8]" /> Holding Equilibrium ({state.stabilityPercentage}%)
              </span>
            ) : (
              <span>Hold within target range for 3.0 seconds</span>
            )}
          </div>
        </div>

        {/* RIGHT: Control Console */}
        <div className={`lg:col-span-4 p-5 rounded-2xl bg-[#111114] border border-white/10 space-y-4 shadow-sm ${
          viewFilter !== 'all' && viewFilter !== 'control' ? 'hidden lg:block' : 'block'
        }`}>
          <OperatorView
            state={state}
            partnerName={userAName}
            onTempChange={handleTempChange}
            onPressureChange={handlePressureChange}
            onValveToggle={handleValveToggle}
            disabled={state.isSuccess}
          />
        </div>
      </div>

      {/* Comprehensive Results Summary Card upon Success */}
      {state.isSuccess && (
        <div className="p-6 rounded-2xl bg-[#111114] border border-[#4ADE80]/40 space-y-4 text-center max-w-2xl mx-auto shadow-2xl shadow-[#4ADE80]/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4ADE80]/10 border border-[#4ADE80]/30 text-[#4ADE80] text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Equilibrium Objective Solved</span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#F5F5F7] tracking-tight">
              {activeScenario.name}
            </h3>
            <p className="text-xs text-[#A1A1AA] max-w-md mx-auto mt-1 leading-relaxed">
              {activeScenario.scientificContext}
            </p>
          </div>

          {/* Performance Telemetry Grid */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-left pt-1">
            <div className="p-3 rounded-xl bg-[#18181D] border border-white/[0.08] text-xs">
              <div className="text-[10px] font-mono text-[#A1A1AA] uppercase">Hold Time</div>
              <div className="text-[#F5F5F7] font-bold text-sm tabular-nums">3.0s</div>
            </div>

            <div className="p-3 rounded-xl bg-[#18181D] border border-white/[0.08] text-xs">
              <div className="text-[10px] font-mono text-[#A1A1AA] uppercase">Time Elapsed</div>
              <div className="text-[#F5F5F7] font-bold text-sm tabular-nums">
                {state.elapsedSeconds.toFixed(1)}s
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#18181D] border border-white/[0.08] text-xs">
              <div className="text-[10px] font-mono text-[#A1A1AA] uppercase">Overshoots</div>
              <div className="text-[#4ADE80] font-bold text-sm tabular-nums">
                {state.overshootCount}
              </div>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-center gap-3">
            {selectedScenarioIdx < EQUILIBRIUM_SCENARIOS.length - 1 && (
              <button
                onClick={() => handleSelectScenario(selectedScenarioIdx + 1)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#18181D] hover:bg-[#222228] text-[#F5F5F7] font-medium text-xs border border-white/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Next Scenario: {EQUILIBRIUM_SCENARIOS[selectedScenarioIdx + 1]?.name}</span>
              </button>
            )}

            <button
              onClick={handleProceedToDilemmas}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#F5F5F7] text-[#09090B] font-semibold text-xs hover:bg-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>Complete Experiment 02 → The Dilemma Lab</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
