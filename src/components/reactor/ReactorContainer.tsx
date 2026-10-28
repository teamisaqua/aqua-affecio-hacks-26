'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ReactorTarget, ReactorState, UserRole } from '@/lib/types/chemistry';
import { ReactorVessel } from './ReactorVessel';
import { ObserverView } from './ObserverView';
import { OperatorView } from './OperatorView';
import { sound } from '@/lib/sound/soundEffects';
import { Timer, CheckCircle2, Sparkles, Activity, Shield } from 'lucide-react';

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
  const [viewFilter, setViewFilter] = useState<'all' | 'observer' | 'vessel' | 'operator'>('all');
  const [timeLeft, setTimeLeft] = useState(45);
  const isCompletedRef = useRef(false);


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
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Hierarchy Step 1 & 2: Experiment Number & Title */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 pb-3 border-b border-white/10 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="px-2.5 py-1 rounded bg-[#2C2C2E] text-white font-bold">EXPERIMENT 01</span>
          <span className="text-white text-sm font-semibold tracking-wide">ASYMMETRIC REACTOR CALIBRATION</span>
          <span className="text-[#A1A1A6]">· 45s COOPERATIVE TIME PRESSURE</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Reaction Stability Status */}
          <div className="flex items-center space-x-2">
            <span className="text-[#A1A1A6]">EQUILIBRIUM:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold tabular-data ${
              state.isSuccess
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : state.isStabilized
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'bg-[#2C2C2E] text-[#A1A1A6]'
            }`}>
              {state.isSuccess ? '100% STABLE' : `${state.stabilityPercentage}%`}
            </span>
          </div>

          {/* Time Remaining */}
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#1C1C1E] border border-white/10 tabular-data text-white font-bold">
            <Timer className="w-3.5 h-3.5 text-apple-blue" />
            <span>00:{timeLeft.toString().padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet View Segmented Switch */}
      <div className="flex lg:hidden items-center justify-center">
        <div className="inline-flex items-center p-1 rounded-full bg-[#1C1C1E] border border-white/10 text-xs">
          <button
            onClick={() => setViewFilter('all')}
            className={`px-3 py-1 rounded-full transition-all ${
              viewFilter === 'all' ? 'bg-white text-black font-semibold' : 'text-[#A1A1A6]'
            }`}
          >
            All Panels
          </button>
          <button
            onClick={() => setViewFilter('observer')}
            className={`px-3 py-1 rounded-full transition-all ${
              viewFilter === 'observer' ? 'bg-white text-black font-semibold' : 'text-[#A1A1A6]'
            }`}
          >
            Alpha {role === 'observer' ? '(You)' : ''}
          </button>
          <button
            onClick={() => setViewFilter('vessel')}
            className={`px-3 py-1 rounded-full transition-all ${
              viewFilter === 'vessel' ? 'bg-white text-black font-semibold' : 'text-[#A1A1A6]'
            }`}
          >
            Core
          </button>
          <button
            onClick={() => setViewFilter('operator')}
            className={`px-3 py-1 rounded-full transition-all ${
              viewFilter === 'operator' ? 'bg-white text-black font-semibold' : 'text-[#A1A1A6]'
            }`}
          >
            Beta {role === 'operator' ? '(You)' : ''}
          </button>
        </div>
      </div>

      {/* Tri-Panel Scientific Instrument Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT CONSOLE: Participant A (Observer / Diagnostic) */}
        <div className={`lg:col-span-4 apple-card p-5 space-y-4 bg-[#1C1C1E] border border-white/10 ${
          viewFilter !== 'all' && viewFilter !== 'observer' ? 'hidden lg:block' : 'block'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-mono">
            <div className="flex items-center space-x-2 text-apple-blue">
              <span className="w-2 h-2 rounded-full bg-apple-blue" />
              <span className="font-bold">STATION ALPHA [OBSERVER]</span>
              {role === 'observer' && (
                <span className="px-1.5 py-0.5 rounded bg-apple-blue/20 text-apple-blue border border-apple-blue/30 text-[9px] font-bold">
                  YOU
                </span>
              )}
            </div>
            <span className="text-[#A1A1A6]">{userAName}</span>
          </div>

          <ObserverView
            target={target}
            state={state}
            partnerName={userBName}
          />
        </div>

        {/* CENTER STAGE: The Living Reaction Core Vessel */}
        <div className={`lg:col-span-4 apple-card p-6 flex flex-col items-center justify-between bg-[#1C1C1E] border border-white/10 min-h-[460px] ${
          viewFilter !== 'all' && viewFilter !== 'vessel' ? 'hidden lg:flex' : 'flex'
        }`}>
          <div className="w-full flex items-center justify-between pb-2 border-b border-white/10 text-[11px] font-mono text-[#A1A1A6]">
            <span>REACTION VESSEL</span>
            <span className="text-apple-green font-semibold">BOROSILICATE CORE</span>
          </div>

          {/* Graduated Glass Cylinder with Meniscus and Micro-Bubbles */}
          <div className="my-auto py-2">
            <ReactorVessel
              currentTemp={state.currentTemp}
              currentPressure={state.currentPressure}
              isStabilized={state.isStabilized}
              isSuccess={state.isSuccess}
              stabilityPercentage={state.stabilityPercentage}
            />
          </div>

          {/* Status Message */}
          <div className="w-full pt-3 border-t border-white/10 text-center text-xs font-mono text-[#A1A1A6]">
            {state.isSuccess ? (
              <span className="text-apple-green font-bold flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> REACTION EQUILIBRIUM ACHIEVED
              </span>
            ) : state.isStabilized ? (
              <span className="text-apple-blue font-semibold animate-pulse flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4" /> HOLDING EQUILIBRIUM ({state.stabilityPercentage}%)
              </span>
            ) : (
              <span>STABILIZE WITHIN ±{target.tolerance}° FOR 3.0 SECONDS</span>
            )}
          </div>
        </div>

        {/* RIGHT CONSOLE: Participant B (Operator / Actuator Controls) */}
        <div className={`lg:col-span-4 apple-card p-5 space-y-4 bg-[#1C1C1E] border border-white/10 ${
          viewFilter !== 'all' && viewFilter !== 'operator' ? 'hidden lg:block' : 'block'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-mono">
            <div className="flex items-center space-x-2 text-apple-blue">
              <span className="w-2 h-2 rounded-full bg-apple-blue" />
              <span className="font-bold">STATION BETA [OPERATOR]</span>
              {role === 'operator' && (
                <span className="px-1.5 py-0.5 rounded bg-apple-blue/20 text-apple-blue border border-apple-blue/30 text-[9px] font-bold">
                  YOU
                </span>
              )}
            </div>
            <span className="text-[#A1A1A6]">{userBName}</span>
          </div>

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
        <div className="p-5 rounded-[18px] bg-[#1C1C1E] border border-apple-green/50 text-center space-y-1">
          <h3 className="text-base font-semibold text-white tracking-tight flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-apple-green" />
            Reaction Calibration Complete
          </h3>
          <p className="text-xs text-[#A1A1A6] font-mono">
            Chamber stabilized in {state.elapsedSeconds.toFixed(1)}s with {state.overshootCount} overshoots. Advancing to Dilemma Experiment...
          </p>
        </div>
      )}
    </div>
  );
};
