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
  // Determine fluid color based on stability and temperature
  const getFluidGradient = () => {
    if (isSuccess) {
      return 'from-emerald-400 via-cyan-400 to-teal-500';
    }
    if (isStabilized) {
      return 'from-cyan-400 via-teal-400 to-blue-500';
    }
    if (currentTemp > 85 || currentPressure > 6.0) {
      return 'from-rose-500 via-amber-500 to-red-600';
    }
    return 'from-purple-500 via-indigo-500 to-cyan-500';
  };

  const fillHeight = Math.min(88, Math.max(25, 20 + (currentPressure * 6.5)));

  return (
    <div className="relative w-48 h-64 md:w-56 md:h-72 mx-auto flex items-center justify-center">
      {/* Outer Chamber Glass Flask Frame */}
      <div className="absolute inset-0 rounded-[2.5rem] border-2 border-white/15 bg-white/[0.02] backdrop-blur-md shadow-glass-lg overflow-hidden flex flex-col justify-end p-2">
        {/* Specular glass reflection bar */}
        <div className="absolute top-2 left-4 w-2 h-20 bg-white/20 rounded-full blur-[1px] transform -rotate-6 pointer-events-none" />
        <div className="absolute top-2 right-4 w-1 h-12 bg-white/10 rounded-full pointer-events-none" />

        {/* Liquid Fluid Column */}
        <motion.div
          className={`w-full rounded-b-[2rem] bg-gradient-to-t ${getFluidGradient()} opacity-80 relative overflow-hidden transition-all duration-300`}
          style={{ height: `${fillHeight}%` }}
          animate={{
            scaleY: [1, 1.02, 0.99, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            ease: 'easeInOut',
          }}
        >
          {/* Internal rising bubbles */}
          <div className="absolute inset-0 pointer-events-none">
            <span className="absolute bottom-2 left-6 w-3 h-3 bg-white/40 rounded-full animate-bubble" style={{ animationDuration: '2.2s' }} />
            <span className="absolute bottom-1 left-20 w-2 h-2 bg-white/50 rounded-full animate-bubble" style={{ animationDuration: '1.8s', animationDelay: '0.4s' }} />
            <span className="absolute bottom-3 right-8 w-2.5 h-2.5 bg-white/40 rounded-full animate-bubble" style={{ animationDuration: '2.6s', animationDelay: '0.8s' }} />
          </div>

          {/* Meniscus Wave */}
          <div className="absolute top-0 inset-x-0 h-3 bg-white/30 blur-[2px] rounded-full" />
        </motion.div>

        {/* Overheating warning steam pulse */}
        {(currentTemp > 85 || currentPressure > 6.0) && (
          <div className="absolute inset-0 bg-red-500/15 animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Stability Orbital Ring */}
      <div className="absolute -inset-3 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1.5"
          />
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke={isSuccess ? '#10b981' : isStabilized ? '#00f0ff' : '#9d4edd'}
            strokeWidth="2.5"
            strokeDasharray="301.6"
            strokeDashoffset={301.6 - (301.6 * stabilityPercentage) / 100}
            strokeLinecap="round"
            className="transition-all duration-150 transform -rotate-90 origin-center"
          />
        </svg>
      </div>

      {/* Center Stability Status Badge */}
      <div className="absolute bottom-4 inset-x-0 flex justify-center pointer-events-none">
        <div className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase backdrop-blur-md border ${
          isSuccess
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            : isStabilized
            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
            : 'bg-black/40 text-slate-400 border-white/10'
        }`}>
          {isSuccess ? 'REACTION STABLE' : isStabilized ? `LOCKING ${stabilityPercentage}%` : 'CALIBRATING'}
        </div>
      </div>
    </div>
  );
};
