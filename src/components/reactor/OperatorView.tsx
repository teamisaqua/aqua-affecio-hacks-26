'use client';

import React from 'react';
import { Sliders, Wrench, Flame, Gauge, Zap } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Role Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-lab-pink/10 border border-lab-pink/30 text-lab-pink">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white tracking-wide text-sm md:text-base">
              ROLE: OPERATOR (YOU)
            </h3>
            <p className="text-xs text-slate-400">
              You hold the controls, but <span className="text-lab-cyan font-semibold">{partnerName}</span> has the target recipe!
            </p>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-lab-pink/10 border border-lab-pink/30 text-lab-pink text-xs font-mono">
          MANUAL ACTUATORS ONLINE
        </div>
      </div>

      {/* Control Actuators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Control 1: Temperature Slider */}
        <LiquidGlassPanel className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
            <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-amber-400" /> Thermal Actuator</span>
            <span className="text-white font-bold text-base">{state.currentTemp} °C</span>
          </div>

          <div className="my-6">
            <input
              type="range"
              min="0"
              max="120"
              value={state.currentTemp}
              onChange={handleTemp}
              disabled={disabled}
              className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-lab-cyan hover:accent-cyan-300 focus:outline-none transition-all disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
              <span>0°C (Inert)</span>
              <span>60°C</span>
              <span>120°C (Critical)</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center font-mono">
            Listen to {partnerName} for the target thermal range
          </div>
        </LiquidGlassPanel>

        {/* Control 2: Pressure Regulator */}
        <LiquidGlassPanel className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
            <span className="flex items-center gap-1.5"><Gauge className="w-4 h-4 text-lab-pink" /> Pressure Regulator</span>
            <span className="text-white font-bold text-base">{state.currentPressure.toFixed(1)} bar</span>
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
              className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-lab-pink hover:accent-pink-400 focus:outline-none transition-all disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2">
              <span>0.0 bar</span>
              <span>5.0 bar</span>
              <span>10.0 bar</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center font-mono">
            Adjust pressure slowly to avoid overshoots
          </div>
        </LiquidGlassPanel>

        {/* Control 3: Catalyst Valve Switch */}
        <LiquidGlassPanel className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-emerald-400" /> Catalyst Flow</span>
            <span className={`font-mono text-xs px-2 py-0.5 rounded ${state.catalystValve ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-400'}`}>
              {state.catalystValve ? 'OPEN' : 'BYPASS'}
            </span>
          </div>

          <div className="my-5 flex justify-center">
            <button
              onClick={handleValve}
              disabled={disabled}
              className={`px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all ${
                state.catalystValve
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-glow-cyan'
                  : 'bg-white/5 text-slate-300 border border-white/15 hover:bg-white/10'
              } disabled:opacity-50`}
            >
              {state.catalystValve ? 'Valve: Open (Accelerating)' : 'Valve: Closed (Normal)'}
            </button>
          </div>

          <div className="text-[11px] text-slate-400 text-center font-mono">
            Click to engage secondary catalyst stream
          </div>
        </LiquidGlassPanel>
      </div>
    </div>
  );
};
