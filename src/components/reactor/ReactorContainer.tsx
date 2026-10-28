'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ReactorTarget, ReactorState, UserRole } from '@/lib/types/chemistry';
import { ReactorVessel } from './ReactorVessel';
import { ObserverView } from './ObserverView';
import { OperatorView } from './OperatorView';
import { sound } from '@/lib/sound/soundEffects';
import { Timer, CheckCircle2, Sparkles } from 'lucide-react';

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
  const [activeTabRole, setActiveTabRole] = useState<UserRole>(role);
  const [timeLeft, setTimeLeft] = useState(45);
  const isCompletedRef = useRef(false);

  useEffect(() => {
    setActiveTabRole(role);
  }, [role]);

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
              particleCount: 60,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#38bdf8', '#34c759', '#2997ff', '#fb7185'],
            });
          } catch {
            // ignore confetti error
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
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Status Console */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl apple-glass">
        {/* Timer */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 flex items-center justify-center">
            <Timer className="w-4 h-4 text-sky-400" strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">
              Time Remaining
            </div>
            <div className={`text-xl font-semibold tabular-data ${timeLeft < 10 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Demo Mode Role Switcher (Apple-style Segmented Control) */}
        {demoMode && (
          <div className="flex items-center p-1 rounded-full bg-black/40 border border-white/10">
            <button
              onClick={() => setActiveTabRole('observer')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeTabRole === 'observer'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Observer
            </button>
            <button
              onClick={() => setActiveTabRole('operator')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                activeTabRole === 'operator'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Operator
            </button>
          </div>
        )}

        {/* Status Badge */}
        <div className="flex items-center space-x-2 text-xs">
          {state.isSuccess ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> Reaction Successful
            </span>
          ) : state.isStabilized ? (
            <span className="flex items-center gap-1.5 text-sky-300 font-medium bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/30">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Stabilizing ({state.stabilityPercentage}%)
            </span>
          ) : (
            <span className="text-slate-300 bg-white/[0.05] px-3 py-1 rounded-full border border-white/10">
              Awaiting Target Match
            </span>
          )}
        </div>
      </div>

      {/* Central Glassware Visualizer */}
      <div className="py-2">
        <ReactorVessel
          currentTemp={state.currentTemp}
          currentPressure={state.currentPressure}
          isStabilized={state.isStabilized}
          isSuccess={state.isSuccess}
          stabilityPercentage={state.stabilityPercentage}
        />
      </div>

      {/* Active Role Console (Observer or Operator) */}
      <div className="transition-all duration-200">
        {activeTabRole === 'observer' ? (
          <ObserverView
            target={target}
            state={state}
            partnerName={userBName}
          />
        ) : (
          <OperatorView
            state={state}
            partnerName={userAName}
            onTempChange={handleTempChange}
            onPressureChange={handlePressureChange}
            onValveToggle={handleValveToggle}
            disabled={state.isSuccess}
          />
        )}
      </div>

      {/* Success Notification Banner */}
      {state.isSuccess && (
        <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center space-y-1.5 animate-fadeIn">
          <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Reaction Synthesis Achieved
          </h2>
          <p className="text-xs text-slate-300">
            Chamber stabilized in {state.elapsedSeconds.toFixed(1)} seconds. Advancing to Synchronized Dilemma...
          </p>
        </div>
      )}
    </div>
  );
};
