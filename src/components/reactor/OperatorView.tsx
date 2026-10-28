'use client';

import React from 'react';
import { Flame, Gauge, Zap, Wrench } from 'lucide-react';
import { LiquidGlassPanel } from '../ui/LiquidGlassPanel';
import { ReactorState } from '@/lib/types/chemistry';
import { sound } from '@/lib/sound/soundEffects';

interface OperatorViewProps {
  state: ReactorState;
  partnerName: string;
  onTempChange: (temp: number) => void;
  onPressureChange: (pressure: number) => void;
  onValveToggle: () => void;
  disabled?: boolean;
}

export const OperatorView: React.FC<OperatorViewProps> = ({
  state,
  partnerName,
  onTempChange,
  onPressureChange,
  onValveToggle,
  disabled = false,
}) => {
  const handleTemp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    sound.playSliderTick(300 + val * 5);
    onTempChange(val);
  };

  const handlePressure = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    sound.playSliderTick(400 + val * 40);
    onPressureChange(val);
  };

  const handleValve = () => {
    sound.playGlassClick();
    onValveToggle();
  };

  return (
    <div className="space-y-4">
      {/* Role Sub-header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-[#2C2C2E] border border-white/10 text-apple-blue flex items-center justify-center">
            <Wrench className="w-4 h-4" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">
              Operator Console
            </h3>
            <p className="text-xs text-[#A1A1A6]">
              You control the instruments. Listen to <span className="text-apple-blue font-medium">{partnerName}</span> for target values.
            </p>
          </div>
        </div>

        <div className="self-start sm:self-auto px-3 py-1 rounded-full bg-[#2C2C2E] border border-white/10 text-[#A1A1A6] text-xs tabular-data">
          Controls Engaged
        </div>
      </div>

      {/* Control Actuators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Actuator 1: Temperature */}
        <LiquidGlassPanel className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#A1A1A6] font-medium">
            <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-apple-amber" /> Thermal Actuator</span>
            <span className="text-white font-semibold tabular-data text-base">{state.currentTemp} °C</span>
          </div>

          <div className="my-6">
            <input
              type="range"
              min="0"
              max="120"
              value={state.currentTemp}
              onChange={handleTemp}
              disabled={disabled}
              aria-label="Adjust Temperature"
              className="w-full h-2 rounded-full appearance-none cursor-pointer focus:outline-none disabled:opacity-50"
            />
            <div className="flex justify-between text-[11px] text-[#A1A1A6] tabular-data mt-2">
              <span>0 °C</span>
              <span>60 °C</span>
              <span>120 °C</span>
            </div>
          </div>

          <div className="text-xs text-[#A1A1A6] text-center">
            Slide to adjust heat based on verbal cues
          </div>
        </LiquidGlassPanel>

        {/* Actuator 2: Pressure */}
        <LiquidGlassPanel className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#A1A1A6] font-medium">
            <span className="flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5 text-apple-blue" /> Pressure Regulator</span>
            <span className="text-white font-semibold tabular-data text-base">{state.currentPressure.toFixed(1)} bar</span>
          </div>

          <div className="my-6">
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={state.currentPressure}
              onChange={handlePressure}
              disabled={disabled}
              aria-label="Adjust Pressure"
              className="w-full h-2 rounded-full appearance-none cursor-pointer focus:outline-none disabled:opacity-50"
            />
            <div className="flex justify-between text-[11px] text-[#A1A1A6] tabular-data mt-2">
              <span>0.0 bar</span>
              <span>5.0 bar</span>
              <span>10.0 bar</span>
            </div>
          </div>

          <div className="text-xs text-[#A1A1A6] text-center">
            Fine-tune pressure smoothly to avoid spikes
          </div>
        </LiquidGlassPanel>

        {/* Actuator 3: Catalyst Valve Switch */}
        <LiquidGlassPanel className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#A1A1A6] font-medium">
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-apple-green" /> Catalyst Flow</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
              state.catalystValve ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-[#2C2C2E] text-[#A1A1A6] border border-white/10'
            }`}>
              {state.catalystValve ? 'Active' : 'Standby'}
            </span>
          </div>

          <div className="my-6 flex justify-center">
            <button
              onClick={handleValve}
              disabled={disabled}
              className={`min-h-[44px] px-6 py-2.5 rounded-full text-xs font-medium transition-all ${
                state.catalystValve
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'apple-btn-secondary'
              } disabled:opacity-50`}
            >
              {state.catalystValve ? '✓ Catalyst Valve Engaged' : 'Engage Catalyst Valve'}
            </button>
          </div>

          <div className="text-xs text-[#A1A1A6] text-center">
            Engages secondary stabilizing stream
          </div>
        </LiquidGlassPanel>
      </div>
    </div>
  );
};
