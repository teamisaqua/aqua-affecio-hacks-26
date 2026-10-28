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
    if (isSuccess) return 'from-emerald-500/80 via-teal-500/70 to-emerald-400/90';
    if (isStabilized) return 'from-sky-500/80 via-cyan-500/70 to-blue-500/80';
    if (currentTemp > 85 || currentPressure > 6.0) return 'from-amber-500/80 via-orange-500/70 to-rose-500/80';
    return 'from-blue-600/70 via-indigo-500/60 to-sky-500/70';
  };

  const fillHeight = Math.min(88, Math.max(22, 18 + currentPressure * 6.8));

  return (
    <div className="relative w-52 h-72 md:w-60 md:h-80 mx-auto flex items-center justify-center select-none">
      {/* Outer Borosilicate Glass Cylinder */}
      <div className="absolute inset-0 rounded-[2.5rem] border border-white/[0.12] bg-white/[0.02] backdrop-blur-xl shadow-apple-card overflow-hidden flex flex-col justify-end p-2.5">
        {/* Specular Glare Lines */}
        <div className="absolute top-4 left-5 w-1.5 h-24 bg-gradient-to-b from-white/25 via-white/10 to-transparent rounded-full pointer-events-none" />
        <div className="absolute top-4 right-5 w-1 h-14 bg-gradient-to-b from-white/15 to-transparent rounded-full pointer-events-none" />

        {/* Graduation Marks (Scientific Precision) */}
        <div className="absolute left-3 inset-y-10 flex flex-col justify-between pointer-events-none opacity-40 text-[9px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-[1px] bg-white" /><span>100</span></div>
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-[1px] bg-white/70" /><span>80</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-[1px] bg-white" /><span>60</span></div>
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-[1px] bg-white/70" /><span>40</span></div>
          <div className="flex items-center gap-1.5"><span className="w-2.5 h-[1px] bg-white" /><span>20</span></div>
        </div>

        {/* Liquid Fluid Column */}
        <motion.div
          className={`w-full rounded-b-[2rem] bg-gradient-to-t ${getFluidColor()} relative overflow-hidden transition-all duration-300 ease-out`}
          style={{ height: `${fillHeight}%` }}
        >
          {/* Surface Meniscus Line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-white/40 blur-[1px] rounded-full" />

          {/* Gentle Micro-Bubbles */}
          <div className="absolute inset-0 pointer-events-none opacity-70">
            <span className="absolute bottom-2 left-10 w-2 h-2 bg-white/50 rounded-full animate-bubble" style={{ animationDuration: '2.5s' }} />
            <span className="absolute bottom-1 right-12 w-1.5 h-1.5 bg-white/60 rounded-full animate-bubble" style={{ animationDuration: '3s', animationDelay: '0.6s' }} />
          </div>
        </motion.div>
      </div>

      {/* Stability Progress Ring (Subtle Apple-style metric halo) */}
      <div className="absolute -inset-2.5 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1.5"
          />
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke={isSuccess ? '#34c759' : isStabilized ? '#38bdf8' : '#818cf8'}
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
        <div className={`px-3.5 py-1 rounded-full text-[11px] font-medium tracking-wide uppercase backdrop-blur-xl border transition-all duration-200 ${
          isSuccess
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            : isStabilized
            ? 'bg-sky-500/20 text-sky-200 border-sky-500/40'
            : 'bg-black/50 text-slate-300 border-white/10'
        }`}>
          {isSuccess ? 'Synthesis Complete' : isStabilized ? `Locking ${stabilityPercentage}%` : 'Calibrating'}
        </div>
      </div>
    </div>
  );
};
