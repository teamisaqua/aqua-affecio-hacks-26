'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ReactorTarget, ReactorState, UserRole } from '@/lib/types/chemistry';
import { ReactorVessel } from './ReactorVessel';
import { ObserverView } from './ObserverView';
import { OperatorView } from './OperatorView';
import { sound } from '@/lib/sound/soundEffects';
import { Timer, CheckCircle2, Sparkles, Sliders, Compass } from 'lucide-react';

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
  const [viewFilter, setViewFilter] = useState<'all' | 'explore' | 'vessel' | 'control'>('all');
  const [timeLeft, setTimeLeft] = useState(45);
  const isCompletedRef = useRef(false);

  const isExplore = role === 'explore' || role === 'observer';

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

        const tempOk = Math.abs(current.currentTemp - target.temp) <= target.tolerance;
        const pressureOk = Math.abs(current.currentPressure - target.pressure) <= 0.3;
        const inZone = tempOk && pressureOk;

        let nextStabilized = current.stabilizedDuration;
        let nextOvershoots = current.overshootCount;

        if (current.currentTemp > target.temp + 15 || current.currentPressure > target.pressure + 2.5) {
          if (!current.isStabilized && Math.random() < 0.05) {
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

          setTimeout(() => {
            onComplete({
              timeTaken: 45 - timeLeft + (3.0 - nextStabilized),
              overshoots: nextOvershoots,
            });
          }, 2400);

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
  }, [state.isSuccess, target, timeLeft, onComplete, onStateUpdate]);

  const handleTempChange = (temp: number) => {
    onStateUpdate((prev) => ({ ...prev, currentTemp: temp }));
  };

  const handlePressureChange = (pressure: number) => {
    onStateUpdate((prev) => ({ ...prev, currentPressure: pressure }));
  };

  const handleValveToggle = () => {
    onStateUpdate((prev) => ({ ...prev, catalystValve: !prev.catalystValve }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 select-none">
      {/* Experiment Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-white/8">
        <div className="flex items-center space-x-2.5">
          <span className="px-2.5 py-1 rounded-full bg-[#171717] border border-white/8 text-white text-xs font-semibold">
            Experiment 02
          </span>
          <span className="text-white text-sm font-semibold tracking-tight">
            Reaction Equilibrium
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Reaction Stability Status */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-[#A1A1A6]">Equilibrium:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-semibold tabular-nums text-xs ${
              state.isSuccess
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : state.isStabilized
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'bg-[#171717] text-[#A1A1A6] border border-white/8'
            }`}>
              {state.isSuccess ? '100% Stable' : `${state.stabilityPercentage}%`}
            </span>
          </div>

          {/* Time Remaining */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#171717] border border-white/8 tabular-nums text-white text-xs font-semibold">
            <Timer className="w-3.5 h-3.5 text-apple-blue" />
            <span>00:{timeLeft.toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Two Participant Status Row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#111111] border border-white/8 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-[#1C1C1E] text-apple-blue flex items-center justify-center text-xs font-semibold">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>{userAName}</span>
                {isExplore && (
                  <span className="px-1.5 py-0.2 rounded-full bg-apple-blue/20 text-apple-blue text-[9px] font-bold">
                    You
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[#A1A1A6]">Explore (Target cues)</div>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#111111] border border-white/8 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-[#1C1C1E] text-apple-blue flex items-center justify-center text-xs font-semibold">
              <Sliders className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>{userBName}</span>
                {!isExplore && (
                  <span className="px-1.5 py-0.2 rounded-full bg-apple-blue/20 text-apple-blue text-[9px] font-bold">
                    You
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[#A1A1A6]">Control (Actuators)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet View Segmented Switch */}
      <div className="flex lg:hidden items-center justify-center">
        <div className="inline-flex items-center p-1 rounded-full bg-[#171717] border border-white/8 text-xs">
          <button
            onClick={() => setViewFilter('all')}
            className={`px-3 py-1 rounded-full transition-all ${
              viewFilter === 'all' ? 'bg-white text-black font-semibold' : 'text-[#A1A1A6]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setViewFilter('explore')}
            className={`px-3 py-1 rounded-full transition-all ${
              viewFilter === 'explore' ? 'bg-white text-black font-semibold' : 'text-[#A1A1A6]'
            }`}
          >
            Explore {isExplore ? '(You)' : ''}
          </button>
          <button
            onClick={() => setViewFilter('vessel')}
            className={`px-3 py-1 rounded-full transition-all ${
              viewFilter === 'vessel' ? 'bg-white text-black font-semibold' : 'text-[#A1A1A6]'
            }`}
          >
            Reaction Core
          </button>
          <button
            onClick={() => setViewFilter('control')}
            className={`px-3 py-1 rounded-full transition-all ${
              viewFilter === 'control' ? 'bg-white text-black font-semibold' : 'text-[#A1A1A6]'
            }`}
          >
            Control {!isExplore ? '(You)' : ''}
          </button>
        </div>
      </div>

      {/* Main Experiment Arena: Central Core Flanked by Consoles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT: Explore Console */}
        <div className={`lg:col-span-4 p-5 rounded-3xl bg-[#111111] border border-white/8 space-y-4 ${
          viewFilter !== 'all' && viewFilter !== 'explore' ? 'hidden lg:block' : 'block'
        }`}>
          <ObserverView
            target={target}
            state={state}
            partnerName={userBName}
          />
        </div>

        {/* CENTER: The Reaction Vessel Core */}
        <div className={`lg:col-span-4 p-6 rounded-3xl bg-[#111111] border border-white/8 flex flex-col items-center justify-between min-h-[440px] ${
          viewFilter !== 'all' && viewFilter !== 'vessel' ? 'hidden lg:flex' : 'flex'
        }`}>
          <div className="w-full flex items-center justify-between pb-2 border-b border-white/8 text-xs text-[#A1A1A6]">
            <span>Reaction Core</span>
            <span className="text-apple-green font-medium">Borosilicate Chamber</span>
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

          <div className="w-full pt-3 border-t border-white/8 text-center text-xs text-[#A1A1A6]">
            {state.isSuccess ? (
              <span className="text-apple-green font-semibold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Reaction Equilibrium Achieved
              </span>
            ) : state.isStabilized ? (
              <span className="text-apple-blue font-medium animate-pulse flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Holding Equilibrium ({state.stabilityPercentage}%)
              </span>
            ) : (
              <span>Hold within target range for 3.0 seconds</span>
            )}
          </div>
        </div>

        {/* RIGHT: Control Console */}
        <div className={`lg:col-span-4 p-5 rounded-3xl bg-[#111111] border border-white/8 space-y-4 ${
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

      {/* Success Notification Banner */}
      {state.isSuccess && (
        <div className="p-5 rounded-2xl bg-[#141416] border border-apple-green/40 text-center space-y-1">
          <h3 className="text-base font-semibold text-white tracking-tight flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-apple-green" />
            Reaction Equilibrium Reached
          </h3>
          <p className="text-xs text-[#A1A1A6]">
            Chamber stabilized in {state.elapsedSeconds.toFixed(1)} seconds. Advancing to Dilemma...
          </p>
        </div>
      )}
    </div>
  );
};
