'use client';

import React from 'react';
import { Target, Compass, ArrowUp, ArrowDown, Check } from 'lucide-react';
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
    <div className="space-y-4 text-left">
      {/* Console Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/8">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-[#1C1C1E] border border-white/10 text-apple-blue flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">
              Explore Guide
            </h3>
            <p className="text-xs text-[#A1A1A6]">
              Guide <span className="text-white font-medium">{partnerName}</span> to the targets
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-[#1C1C1E] border border-white/8 text-[#A1A1A6] text-xs">
          Target values
        </span>
      </div>

      {/* Target Metric Cards Stack */}
      <div className="flex flex-col gap-3">
        {/* Metric 1: Temperature */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isTempGood ? 'bg-[#141416] border-emerald-500/40 ring-1 ring-emerald-500/20' : 'bg-[#141416] border-white/8'
        }`}>
          <div className="flex items-center justify-between text-xs text-[#A1A1A6]">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <Target className="w-3.5 h-3.5 text-apple-blue" />
              Target heat
            </span>
            <span className="text-white font-semibold tabular-nums">{target.temp}°C</span>
          </div>

          <div className="my-2.5 flex items-center justify-between">
            <div className="text-2xl font-semibold text-white tabular-nums">
              {state.currentTemp} <span className="text-xs text-[#A1A1A6] font-normal">°C</span>
            </div>
            <div className={`text-xs font-medium flex items-center gap-1 px-2.5 py-1 rounded-full ${
              isTempGood ? 'bg-emerald-500/15 text-apple-green border border-emerald-500/30' : 'bg-amber-500/15 text-apple-amber border border-amber-500/30'
            }`}>
              {isTempGood ? (
                <> <Check className="w-3 h-3" /> Target reached </>
              ) : tempDiff > 0 ? (
                <> <ArrowDown className="w-3 h-3" /> Tell partner: Lower by {Math.abs(tempDiff)}° </>
              ) : (
                <> <ArrowUp className="w-3 h-3" /> Tell partner: Raise by {Math.abs(tempDiff)}° </>
              )}
            </div>
          </div>

          <div className="w-full bg-[#1C1C1E] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${isTempGood ? 'bg-apple-green' : 'bg-apple-amber'}`}
              style={{ width: `${Math.min(100, (state.currentTemp / 120) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Pressure */}
        <div className={`p-4 rounded-2xl border transition-all ${
          isPressureGood ? 'bg-[#141416] border-emerald-500/40 ring-1 ring-emerald-500/20' : 'bg-[#141416] border-white/8'
        }`}>
          <div className="flex items-center justify-between text-xs text-[#A1A1A6]">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <Target className="w-3.5 h-3.5 text-apple-blue" />
              Target pressure
            </span>
            <span className="text-white font-semibold tabular-nums">{target.pressure} bar</span>
          </div>

          <div className="my-2.5 flex items-center justify-between">
            <div className="text-2xl font-semibold text-white tabular-nums">
              {state.currentPressure.toFixed(1)} <span className="text-xs text-[#A1A1A6] font-normal">bar</span>
            </div>
            <div className={`text-xs font-medium flex items-center gap-1 px-2.5 py-1 rounded-full ${
              isPressureGood ? 'bg-emerald-500/15 text-apple-green border border-emerald-500/30' : 'bg-amber-500/15 text-apple-amber border border-amber-500/30'
            }`}>
              {isPressureGood ? (
                <> <Check className="w-3 h-3" /> Target reached </>
              ) : pressureDiff > 0 ? (
                <> <ArrowDown className="w-3 h-3" /> Tell partner: Release -{Math.abs(pressureDiff).toFixed(1)} </>
              ) : (
                <> <ArrowUp className="w-3 h-3" /> Tell partner: Add +{Math.abs(pressureDiff).toFixed(1)} </>
              )}
            </div>
          </div>

          <div className="w-full bg-[#1C1C1E] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-200 ${isPressureGood ? 'bg-apple-green' : 'bg-apple-red'}`}
              style={{ width: `${Math.min(100, (state.currentPressure / 10) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Stabilization Instruction */}
        <div className="p-4 rounded-2xl bg-[#141416] border border-white/8 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A1A1A6]">
            <span>Goal</span>
            <span className="text-white font-medium">Hold for 3 seconds</span>
          </div>
          <p className="text-xs text-[#A1A1A6] leading-relaxed">
            Both temperature and pressure must stay in the green zone simultaneously for 3 continuous seconds.
          </p>
        </div>
      </div>
    </div>
  );
};
