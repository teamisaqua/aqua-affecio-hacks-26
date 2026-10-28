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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-[#2C2C2E] border border-white/10 text-apple-blue flex items-center justify-center">
            <Eye className="w-4 h-4" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">
              Observer Console
            </h3>
            <p className="text-xs text-[#A1A1A6]">
              Direct <span className="text-apple-blue font-medium">{partnerName}</span> to match these target specifications.
            </p>
          </div>
        </div>

        <div className="self-start sm:self-auto px-3 py-1 rounded-full bg-[#2C2C2E] border border-white/10 text-[#A1A1A6] text-xs tabular-data">
          Live Telemetry
        </div>
      </div>

      {/* Target Metric Cards Stack */}
      <div className="flex flex-col gap-3">
        {/* Metric 1: Temperature */}
        <LiquidGlassPanel className="p-4 flex flex-col justify-between" tint={isTempGood ? 'green' : 'none'}>
          <div className="flex items-center justify-between text-xs text-[#A1A1A6] font-medium">
            <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-apple-blue" /> Target Temperature</span>
            <span className="text-white font-semibold tabular-data">{target.temp} °C</span>
          </div>

          <div className="my-2.5 flex items-center justify-between">
            <div className="text-2xl font-semibold text-white tracking-tight tabular-data">
              {state.currentTemp} <span className="text-xs font-normal text-[#A1A1A6]">°C</span>
            </div>
            <div className={`text-xs font-medium flex items-center gap-1 px-2.5 py-1 rounded-full ${
              isTempGood ? 'bg-emerald-500/15 text-apple-green border border-emerald-500/30' : 'bg-amber-500/15 text-apple-amber border border-amber-500/30'
            }`}>
              {isTempGood ? (
                <> <Check className="w-3 h-3" /> In Zone (±{target.tolerance}°) </>
              ) : tempDiff > 0 ? (
                <> <ArrowDown className="w-3 h-3" /> Lower by {Math.abs(tempDiff)}° </>
              ) : (
                <> <ArrowUp className="w-3 h-3" /> Raise by {Math.abs(tempDiff)}° </>
              )}
            </div>
          </div>

          <div className="w-full bg-[#2C2C2E] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${isTempGood ? 'bg-apple-green' : 'bg-apple-amber'}`}
              style={{ width: `${Math.min(100, (state.currentTemp / 120) * 100)}%` }}
            />
          </div>
        </LiquidGlassPanel>

        {/* Metric 2: Pressure */}
        <LiquidGlassPanel className="p-4 flex flex-col justify-between" tint={isPressureGood ? 'green' : 'none'}>
          <div className="flex items-center justify-between text-xs text-[#A1A1A6] font-medium">
            <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-apple-blue" /> Target Pressure</span>
            <span className="text-white font-semibold tabular-data">{target.pressure} bar</span>
          </div>

          <div className="my-2.5 flex items-center justify-between">
            <div className="text-2xl font-semibold text-white tracking-tight tabular-data">
              {state.currentPressure.toFixed(1)} <span className="text-xs font-normal text-[#A1A1A6]">bar</span>
            </div>
            <div className={`text-xs font-medium flex items-center gap-1 px-2.5 py-1 rounded-full ${
              isPressureGood ? 'bg-emerald-500/15 text-apple-green border border-emerald-500/30' : 'bg-amber-500/15 text-apple-amber border border-amber-500/30'
            }`}>
              {isPressureGood ? (
                <> <Check className="w-3 h-3" /> In Zone </>
              ) : pressureDiff > 0 ? (
                <> <ArrowDown className="w-3 h-3" /> Release -{Math.abs(pressureDiff).toFixed(1)} bar </>
              ) : (
                <> <ArrowUp className="w-3 h-3" /> Add +{Math.abs(pressureDiff).toFixed(1)} bar </>
              )}
            </div>
          </div>

          <div className="w-full bg-[#2C2C2E] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${isPressureGood ? 'bg-apple-green' : 'bg-apple-red'}`}
              style={{ width: `${Math.min(100, (state.currentPressure / 10) * 100)}%` }}
            />
          </div>
        </LiquidGlassPanel>

        {/* Metric 3: Stabilization Window */}
        <LiquidGlassPanel className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#A1A1A6] font-medium">
            <span>Fluid Phase Target</span>
            <span className="text-apple-blue font-semibold">{target.colorName}</span>
          </div>

          <div className="my-2.5 flex items-center justify-between">
            <div className="text-sm font-semibold text-white tracking-tight">
              {state.isStabilized ? 'Equilibrium Phase' : 'Active Calibration'}
            </div>
            <div className="text-[11px] font-mono text-[#A1A1A6]">
              3.0s Hold Target
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-[10px] bg-[#2C2C2E] border border-white/10 text-xs text-[#A1A1A6] flex items-center justify-center gap-1.5">
            <span>Direct {partnerName} using clear verbal cues</span>
          </div>
        </LiquidGlassPanel>
      </div>
    </div>
  );
};
