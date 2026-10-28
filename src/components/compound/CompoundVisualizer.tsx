'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LiquidGlassPanel } from '../ui/LiquidGlassPanel';
import { FictionalCompound } from '@/lib/types/chemistry';
import { ArrowRight, Atom } from 'lucide-react';
import { sound } from '@/lib/sound/soundEffects';

interface CompoundVisualizerProps {
  compound: FictionalCompound;
  onContinue: () => void;
}

export const CompoundVisualizer: React.FC<CompoundVisualizerProps> = ({
  compound,
  onContinue,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C1C1E] border border-white/10 text-[#A1A1A6] text-xs font-medium">
          <Atom className="w-3.5 h-3.5 text-apple-blue" />
          <span>Molecular Synthesis Archive</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
          {compound.name}
        </h2>
        <div className="text-sm text-[#A1A1A6] font-medium">
          {compound.formula} <span className="text-white/20">·</span> {compound.classification}
        </div>
      </div>

      {/* Main Molecular Chamber Display */}
      <LiquidGlassPanel className="p-8 md:p-10 text-center relative bg-[#1C1C1E]">
        {/* Animated Molecular Structure */}
        <div className="relative w-56 h-56 mx-auto my-2 flex items-center justify-center select-none">
          {/* SVG Orbital Bond Connections */}
          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 200 200"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 45, ease: 'linear' }}
          >
            {/* Center Nucleus */}
            <circle cx="100" cy="100" r="14" fill="#FFFFFF" />
            <circle cx="100" cy="100" r="22" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />

            {/* Orbit paths & Nodes */}
            {compound.nodes.map((node, i) => (
              <g key={i}>
                <line
                  x1="100"
                  y1="100"
                  x2={node.x}
                  y2={node.y}
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size * 0.8}
                  fill={i % 2 === 0 ? '#2997FF' : '#34C759'}
                />
              </g>
            ))}
          </motion.svg>
        </div>

        {/* Tagline & Synthesis Lore */}
        <div className="max-w-lg mx-auto space-y-2 mt-4">
          <div className="inline-block px-3.5 py-1 rounded-full bg-[#2C2C2E] border border-white/10 text-xs font-medium text-white">
            {compound.tagline}
          </div>
          <p className="text-xs text-[#A1A1A6] leading-relaxed max-w-md mx-auto">
            {compound.loreDescription}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
          <button
            onClick={() => {
              sound.playGlassClick();
              onContinue();
            }}
            className="apple-btn-primary px-8"
          >
            <span>Mint Chemistry Card</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </LiquidGlassPanel>
    </div>
  );
};
