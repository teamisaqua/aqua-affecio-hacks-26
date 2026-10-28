'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ReactorVesselProps {
  currentTemp: number;
  currentPressure: number;
  isStabilized: boolean;
  isSuccess: boolean;
  stabilityPercentage: number;
}

export const ReactorVessel: React.FC<ReactorVesselProps> = ({
  currentTemp,
  currentPressure,
  isStabilized,
  isSuccess,
  stabilityPercentage,
}) => {
  // Fluid gradient communicating reaction state
  const getFluidColor = () => {
    if (isSuccess) return 'from-emerald-500 via-teal-500 to-emerald-400';
    if (isStabilized) return 'from-blue-600 via-sky-500 to-cyan-400';
    if (currentTemp > 85 || currentPressure > 6.0) return 'from-amber-600 via-orange-500 to-rose-500';
    return 'from-blue-700 via-indigo-600 to-blue-500';
  };

  const fillHeight = Math.min(88, Math.max(22, 18 + currentPressure * 6.8));

  return (
    <div className="relative w-52 h-72 md:w-60 md:h-80 mx-auto flex items-center justify-center select-none">
      {/* Outer Borosilicate Glass Cylinder */}
      <div className="absolute inset-0 rounded-[28px] border border-white/10 bg-[#1C1C1E] shadow-apple-card overflow-hidden flex flex-col justify-end p-2.5">
        {/* Specular Glare Lines */}
        <div className="absolute top-4 left-5 w-1.5 h-24 bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-full pointer-events-none" />
        <div className="absolute top-4 right-5 w-1 h-14 bg-gradient-to-b from-white/10 to-transparent rounded-full pointer-events-none" />

        {/* Graduation Marks (Scientific Precision) */}
        <div className="absolute left-3 inset-y-10 flex flex-col justify-between pointer-events-none opacity-40 text-[9px] font-mono text-[#A1A1A6]">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-[1px] bg-white" /><span>100</span></div>
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-[1px] bg-white/70" /><span>80</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-[1px] bg-white" /><span>60</span></div>
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-[1px] bg-white/70" /><span>40</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-[1px] bg-white" /><span>20</span></div>
        </div>

        {/* Liquid Fluid Column */}
        <motion.div
          className={`w-full rounded-b-[20px] bg-gradient-to-t ${getFluidColor()} relative overflow-hidden transition-all duration-250 ease-out`}
          style={{ height: `${fillHeight}%` }}
        >
          {/* Surface Meniscus Line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-white/40 blur-[0.5px] rounded-full" />

          {/* Gentle Micro-Bubbles */}
          <div className="absolute inset-0 pointer-events-none opacity-60">
            <span className="absolute bottom-2 left-10 w-2 h-2 bg-white/50 rounded-full animate-bubble" style={{ animationDuration: '2.5s' }} />
            <span className="absolute bottom-1 right-12 w-1.5 h-1.5 bg-white/60 rounded-full animate-bubble" style={{ animationDuration: '3s', animationDelay: '0.6s' }} />
          </div>
        </motion.div>
      </div>

      {/* Stability Progress Ring */}
      <div className="absolute -inset-2.5 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="1.5"
          />
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke={isSuccess ? '#34C759' : isStabilized ? '#2997FF' : '#3A3A3C'}
            strokeWidth="2"
            strokeDasharray="301.6"
            strokeDashoffset={301.6 - (301.6 * stabilityPercentage) / 100}
            strokeLinecap="round"
            className="transition-all duration-200 ease-out transform -rotate-90 origin-center"
          />
        </svg>
      </div>

      {/* State Pill */}
      <div className="absolute bottom-5 inset-x-0 flex justify-center pointer-events-none">
        <div className={`px-3.5 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase border transition-all duration-200 ${
          isSuccess
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            : isStabilized
            ? 'bg-blue-500/20 text-blue-200 border-blue-500/40'
            : 'bg-[#2C2C2E] text-[#A1A1A6] border-white/10'
        }`}>
          {isSuccess ? 'Synthesis Complete' : isStabilized ? `Locking ${stabilityPercentage}%` : 'Calibrating'}
        </div>
      </div>
    </div>
  );
};
