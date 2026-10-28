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

      {/* Target Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Metric 1: Temperature */}
        <LiquidGlassPanel className="p-5 flex flex-col justify-between" tint={isTempGood ? 'green' : 'none'}>
          <div className="flex items-center justify-between text-xs text-[#A1A1A6] font-medium">
            <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-apple-blue" /> Target Temperature</span>
            <span className="text-white font-semibold tabular-data">{target.temp} °C</span>
          </div>

          <div className="my-4 text-center">
            <div className="text-3xl font-semibold text-white tracking-tight tabular-data">
              {state.currentTemp} <span className="text-sm font-normal text-[#A1A1A6]">°C</span>
            </div>
            <div className={`mt-1.5 text-xs font-medium flex items-center justify-center gap-1 ${
              isTempGood ? 'text-apple-green' : 'text-apple-amber'
            }`}>
              {isTempGood ? (
                <> <Check className="w-3.5 h-3.5" /> Target Held (±{target.tolerance}°) </>
              ) : tempDiff > 0 ? (
                <> <ArrowDown className="w-3.5 h-3.5" /> Tell partner: Lower by {Math.abs(tempDiff)}° </>
              ) : (
                <> <ArrowUp className="w-3.5 h-3.5" /> Tell partner: Raise by {Math.abs(tempDiff)}° </>
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
        <LiquidGlassPanel className="p-5 flex flex-col justify-between" tint={isPressureGood ? 'green' : 'none'}>
          <div className="flex items-center justify-between text-xs text-[#A1A1A6] font-medium">
            <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-apple-blue" /> Target Pressure</span>
            <span className="text-white font-semibold tabular-data">{target.pressure} bar</span>
          </div>

          <div className="my-4 text-center">
            <div className="text-3xl font-semibold text-white tracking-tight tabular-data">
              {state.currentPressure.toFixed(1)} <span className="text-sm font-normal text-[#A1A1A6]">bar</span>
            </div>
            <div className={`mt-1.5 text-xs font-medium flex items-center justify-center gap-1 ${
              isPressureGood ? 'text-apple-green' : 'text-apple-amber'
            }`}>
              {isPressureGood ? (
                <> <Check className="w-3.5 h-3.5" /> Pressure Held </>
              ) : pressureDiff > 0 ? (
                <> <ArrowDown className="w-3.5 h-3.5" /> Tell partner: Release -{Math.abs(pressureDiff).toFixed(1)} bar </>
              ) : (
                <> <ArrowUp className="w-3.5 h-3.5" /> Tell partner: Increase +{Math.abs(pressureDiff).toFixed(1)} bar </>
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
        <LiquidGlassPanel className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#A1A1A6] font-medium">
            <span>Fluid Phase</span>
            <span className="text-apple-blue font-semibold">{target.colorName}</span>
          </div>

          <div className="my-4 text-center">
            <div className="text-xl font-semibold text-white tracking-tight">
              {state.isStabilized ? 'Equilibrium Phase' : 'Active Calibration'}
            </div>
            <p className="text-xs text-[#A1A1A6] mt-1">
              {state.isStabilized ? 'Holding equilibrium...' : 'Guide partner with clear verbal cues'}
            </p>
          </div>

          <div className="px-3 py-2 rounded-[12px] bg-[#2C2C2E] border border-white/10 text-xs text-[#A1A1A6] flex items-center justify-center gap-1.5">
            <span>Hold stable for 3 continuous seconds</span>
          </div>
        </LiquidGlassPanel>
      </div>
    </div>
  );
};
