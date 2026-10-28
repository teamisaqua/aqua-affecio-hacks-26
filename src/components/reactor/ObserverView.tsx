'use client';

import React from 'react';
import { LiquidGlassPanel } from '../ui/LiquidGlassPanel';
import { Target, Eye, AlertCircle, ArrowUp, ArrowDown, Check } from 'lucide-react';
import { ReactorTarget, ReactorState } from '@/lib/types/chemistry';

interface ObserverViewProps {
  target: ReactorTarget;
  state: ReactorState;
  partnerName: string;
}

export const ObserverView: React.FC<ObserverViewProps> = ({
  target,
  state,
  partnerName,
}) => {
  const tempDiff = state.currentTemp - target.temp;
  const pressureDiff = Number((state.currentPressure - target.pressure).toFixed(1));

  const isTempGood = Math.abs(tempDiff) <= target.tolerance;
  const isPressureGood = Math.abs(pressureDiff) <= 0.3;

  return (
    <div className="space-y-6">
      {/* Role Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-lab-cyan/10 border border-lab-cyan/30 text-lab-cyan">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white tracking-wide text-sm md:text-base">
              ROLE: OBSERVER (YOU)
            </h3>
            <p className="text-xs text-slate-400">
              You hold the formula targets. Direct <span className="text-lab-pink font-semibold">{partnerName}</span> to match them!
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-lab-cyan/10 border border-lab-cyan/30 text-lab-cyan text-xs font-mono">
          TELEMETRY FEED ACTIVE
        </div>
      </div>

      {/* Target Dials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Target 1: Temperature */}
        <LiquidGlassPanel className="p-5 flex flex-col justify-between" glow={isTempGood ? 'cyan' : 'none'}>
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-mono">
            <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-lab-cyan" /> Target Temp</span>
            <span className="text-lab-cyan font-bold">{target.temp} °C</span>
          </div>

          <div className="my-4 text-center">
            <div className="text-3xl font-mono font-bold text-white tracking-tight">
              {state.currentTemp} <span className="text-sm font-normal text-slate-400">°C</span>
            </div>
            <div className={`mt-1 text-xs font-mono font-medium flex items-center justify-center gap-1 ${
              isTempGood ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {isTempGood ? (
                <> <Check className="w-3 h-3" /> In Stable Range (±{target.tolerance}°) </>
              ) : tempDiff > 0 ? (
                <> <ArrowDown className="w-3 h-3" /> Tell partner: Lower by {Math.abs(tempDiff)}° </>
              ) : (
                <> <ArrowUp className="w-3 h-3" /> Tell partner: Raise by {Math.abs(tempDiff)}° </>
              )}
            </div>
          </div>

          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${isTempGood ? 'bg-emerald-400' : 'bg-amber-400'}`}
              style={{ width: `${Math.min(100, (state.currentTemp / 120) * 100)}%` }}
            />
          </div>
        </LiquidGlassPanel>

        {/* Target 2: Pressure */}
        <LiquidGlassPanel className="p-5 flex flex-col justify-between" glow={isPressureGood ? 'cyan' : 'none'}>
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-mono">
            <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-lab-cyan" /> Target Pressure</span>
            <span className="text-lab-cyan font-bold">{target.pressure} bar</span>
          </div>

          <div className="my-4 text-center">
            <div className="text-3xl font-mono font-bold text-white tracking-tight">
              {state.currentPressure.toFixed(1)} <span className="text-sm font-normal text-slate-400">bar</span>
            </div>
            <div className={`mt-1 text-xs font-mono font-medium flex items-center justify-center gap-1 ${
              isPressureGood ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {isPressureGood ? (
                <> <Check className="w-3 h-3" /> Pressure Calibrated </>
              ) : pressureDiff > 0 ? (
                <> <ArrowDown className="w-3 h-3" /> Tell partner: Release pressure (-{Math.abs(pressureDiff).toFixed(1)}) </>
              ) : (
                <> <ArrowUp className="w-3 h-3" /> Tell partner: Increase pressure (+{Math.abs(pressureDiff).toFixed(1)}) </>
              )}
            </div>
          </div>

          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${isPressureGood ? 'bg-emerald-400' : 'bg-lab-pink'}`}
              style={{ width: `${Math.min(100, (state.currentPressure / 10) * 100)}%` }}
            />
          </div>
        </LiquidGlassPanel>

        {/* Target 3: Catalyst Fluid Hue */}
        <LiquidGlassPanel className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-mono">
            <span>Fluid State</span>
            <span className="text-lab-cyan font-bold">{target.colorName}</span>
          </div>

          <div className="my-4 text-center">
            <div className="text-lg font-bold text-white tracking-wide">
              {state.isStabilized ? 'Hyper-Cyan Phase' : 'Unstable Mixture'}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {state.isStabilized ? 'Holding equilibrium...' : 'Guide partner with verbal cues'}
            </p>
          </div>

          <div className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-[11px] text-slate-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-lab-cyan flex-shrink-0" />
            <span>Hold stable for 3 continuous seconds</span>
          </div>
        </LiquidGlassPanel>
      </div>
    </div>
  );
};
