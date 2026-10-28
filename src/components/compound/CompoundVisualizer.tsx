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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-slate-300 text-xs font-medium">
          <Atom className="w-3.5 h-3.5 text-sky-400" />
          <span>Synthesized Molecular Signature</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
          {compound.name}
        </h2>
        <div className="text-sm text-slate-400 font-medium">
          {compound.formula} <span className="text-slate-600">·</span> {compound.classification}
        </div>
      </div>

      {/* Main Molecular Chamber Display */}
      <LiquidGlassPanel className="p-8 md:p-10 text-center relative">
        {/* Animated Molecular Structure */}
        <div className="relative w-56 h-56 mx-auto my-2 flex items-center justify-center select-none">
          {/* Subtle Ambient Core Glow */}
          <div
            className="absolute w-28 h-28 rounded-full blur-2xl opacity-25 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${compound.colorGradient[0]}, transparent)`,
            }}
          />

          {/* SVG Orbital Bond Connections */}
          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 200 200"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
          >
            {/* Center Nucleus */}
            <circle cx="100" cy="100" r="14" fill="#ffffff" opacity="0.9" />
            <circle cx="100" cy="100" r="20" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />

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
                  r={node.size * 0.85}
                  fill={i % 2 === 0 ? compound.colorGradient[0] : compound.colorGradient[1]}
                  opacity="0.85"
                />
              </g>
            ))}
          </motion.svg>
        </div>

        {/* Tagline & Synthesis Lore */}
        <div className="max-w-lg mx-auto space-y-2.5 mt-4">
          <div className="inline-block px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-300">
            {compound.tagline}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
            {compound.loreDescription}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.08] flex justify-center">
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
