'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ReactorTarget, ReactorState, UserRole } from '@/lib/types/chemistry';
import { ReactorVessel } from './ReactorVessel';
import { ObserverView } from './ObserverView';
import { OperatorView } from './OperatorView';
import { sound } from '@/lib/sound/soundEffects';
import { Timer, Sparkles, CheckCircle2 } from 'lucide-react';

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

  // Sync prop role
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

      // Telemetry evaluation
      onStateUpdate((current) => {
        if (current.isSuccess) return current;

        const tempOk = Math.abs(current.currentTemp - target.temp) <= target.tolerance;
        const pressureOk = Math.abs(current.currentPressure - target.pressure) <= 0.3;
        const inZone = tempOk && pressureOk;

        let nextStabilized = current.stabilizedDuration;
        let nextOvershoots = current.overshootCount;

        // Check if overheating/overshooting
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

        // Check for victory
        if (nextStabilized >= 3.0 && !isCompletedRef.current) {
          isCompletedRef.current = true;
          sound.playSuccessChime();

          // Confetti celebration
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#00f0ff', '#ff2a85', '#9d4edd', '#10b981'],
            });
          } catch {
            // ignore canvas confetti errors
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
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Status Bar: Time & Stability */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-lab-cyan/10 border border-lab-cyan/30 text-lab-cyan">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-slate-400 font-mono">
              Reaction Window
            </div>
            <div className={`text-2xl font-mono font-bold ${timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* Demo Mode Quick Perspective Switcher */}
        {demoMode && (
          <div className="flex items-center space-x-2 bg-black/40 p-1.5 rounded-xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-mono px-2">Demo View:</span>
            <button
              onClick={() => setActiveTabRole('observer')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                activeTabRole === 'observer'
                  ? 'bg-lab-cyan text-black font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              User A (Observer)
            </button>
            <button
              onClick={() => setActiveTabRole('operator')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                activeTabRole === 'operator'
                  ? 'bg-lab-pink text-white font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              User B (Operator)
            </button>
          </div>
        )}

        {/* Reaction Status Indicator */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="text-slate-400">STATUS:</span>
          {state.isSuccess ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> REACTION SUCCESS
            </span>
          ) : state.isStabilized ? (
            <span className="flex items-center gap-1.5 text-lab-cyan font-bold bg-lab-cyan/10 px-3 py-1 rounded-full border border-lab-cyan/30 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> STABILIZING ({state.stabilityPercentage}%)
            </span>
          ) : (
            <span className="text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              SEARCHING HARMONY
            </span>
          )}
        </div>
      </div>

      {/* Center Chamber Vessel Visualizer */}
      <div className="py-2">
        <ReactorVessel
          currentTemp={state.currentTemp}
          currentPressure={state.currentPressure}
          isStabilized={state.isStabilized}
          isSuccess={state.isSuccess}
          stabilityPercentage={state.stabilityPercentage}
        />
      </div>

      {/* Active Role Console (User A vs User B) */}
      <div className="transition-all duration-300">
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
        <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 shadow-glow-cyan text-center space-y-2 animate-bounce-short">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            REACTION SYNTHESIS COMPLETE!
          </h2>
          <p className="text-sm text-emerald-200">
            Chamber stabilized in {state.elapsedSeconds.toFixed(1)} seconds. Advancing to Synchronized Dilemma...
          </p>
        </div>
      )}
    </div>
  );
};
