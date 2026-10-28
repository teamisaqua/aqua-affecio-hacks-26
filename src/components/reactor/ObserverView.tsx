'use client';

import React from 'react';
import { LiquidGlassPanel } from '../ui/LiquidGlassPanel';
import { Target, Eye, ArrowUp, ArrowDown, Check } from 'lucide-react';
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
    <div className="space-y-4">
      {/* Role Sub-header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
            <Eye className="w-4 h-4" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">
              Observer Console
            </h3>
            <p className="text-xs text-slate-400">
              Direct <span className="text-rose-400 font-medium">{partnerName}</span> to match these target specifications.
            </p>
          </div>
        </div>

        <div className="self-start sm:self-auto px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-slate-300 text-xs tabular-data">
          Live Telemetry
        </div>
      </div>

      {/* Target Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Metric 1: Temperature */}
        <LiquidGlassPanel className="p-5 flex flex-col justify-between" tint={isTempGood ? 'emerald' : 'none'}>
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-sky-400" /> Target Temperature</span>
            <span className="text-sky-400 font-semibold tabular-data">{target.temp} °C</span>
          </div>

          <div className="my-4 text-center">
            <div className="text-3xl font-semibold text-white tracking-tight tabular-data">
              {state.currentTemp} <span className="text-sm font-normal text-slate-400">°C</span>
            </div>
            <div className={`mt-1.5 text-xs font-medium flex items-center justify-center gap-1 ${
              isTempGood ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {isTempGood ? (
                <> <Check className="w-3.5 h-3.5" /> Within target (±{target.tolerance}°) </>
              ) : tempDiff > 0 ? (
                <> <ArrowDown className="w-3.5 h-3.5" /> Tell partner: Lower by {Math.abs(tempDiff)}° </>
              ) : (
                <> <ArrowUp className="w-3.5 h-3.5" /> Tell partner: Raise by {Math.abs(tempDiff)}° </>
              )}
            </div>
          </div>

          <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${isTempGood ? 'bg-emerald-400' : 'bg-amber-400'}`}
              style={{ width: `${Math.min(100, (state.currentTemp / 120) * 100)}%` }}
            />
          </div>
        </LiquidGlassPanel>

        {/* Metric 2: Pressure */}
        <LiquidGlassPanel className="p-5 flex flex-col justify-between" tint={isPressureGood ? 'emerald' : 'none'}>
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-sky-400" /> Target Pressure</span>
            <span className="text-sky-400 font-semibold tabular-data">{target.pressure} bar</span>
          </div>

          <div className="my-4 text-center">
            <div className="text-3xl font-semibold text-white tracking-tight tabular-data">
              {state.currentPressure.toFixed(1)} <span className="text-sm font-normal text-slate-400">bar</span>
            </div>
            <div className={`mt-1.5 text-xs font-medium flex items-center justify-center gap-1 ${
              isPressureGood ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {isPressureGood ? (
                <> <Check className="w-3.5 h-3.5" /> Target pressure held </>
              ) : pressureDiff > 0 ? (
                <> <ArrowDown className="w-3.5 h-3.5" /> Tell partner: Release -{Math.abs(pressureDiff).toFixed(1)} bar </>
              ) : (
                <> <ArrowUp className="w-3.5 h-3.5" /> Tell partner: Increase +{Math.abs(pressureDiff).toFixed(1)} bar </>
              )}
            </div>
          </div>

          <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${isPressureGood ? 'bg-emerald-400' : 'bg-rose-400'}`}
              style={{ width: `${Math.min(100, (state.currentPressure / 10) * 100)}%` }}
            />
          </div>
        </LiquidGlassPanel>

        {/* Metric 3: Stabilization Window */}
        <LiquidGlassPanel className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Fluid Phase</span>
            <span className="text-sky-400 font-semibold">{target.colorName}</span>
          </div>

          <div className="my-4 text-center">
            <div className="text-xl font-semibold text-white tracking-tight">
              {state.isStabilized ? 'Equilibrium Phase' : 'Active Calibration'}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {state.isStabilized ? 'Holding equilibrium...' : 'Guide partner with clear verbal cues'}
            </p>
          </div>

          <div className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 flex items-center justify-center gap-1.5">
            <span>Hold stable for 3 continuous seconds</span>
          </div>
        </LiquidGlassPanel>
      </div>
    </div>
  );
};
