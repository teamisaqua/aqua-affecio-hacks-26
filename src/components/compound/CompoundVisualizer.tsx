'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LiquidGlassPanel } from '../ui/LiquidGlassPanel';
import { FictionalCompound } from '@/lib/types/chemistry';
import { Atom, Sparkles, ArrowRight } from 'lucide-react';
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
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Visual Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lab-cyan/10 border border-lab-cyan/30 text-lab-cyan text-xs font-mono uppercase tracking-widest">
          <Atom className="w-3.5 h-3.5" /> Compound Synthesized
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold font-mono tracking-tight text-white">
          {compound.name}
        </h2>
        <div className="text-sm font-mono text-lab-pink font-semibold tracking-wider">
          {compound.formula} · {compound.classification}
        </div>
      </div>

      {/* Main Molecular Chamber Display */}
      <LiquidGlassPanel className="p-8 md:p-12 text-center relative overflow-hidden" glow="cyan">
        {/* Animated Molecular Structure */}
        <div className="relative w-64 h-64 mx-auto my-4 flex items-center justify-center">
          {/* Pulsing Core Glow */}
          <div
            className="absolute w-32 h-32 rounded-full blur-2xl opacity-40 animate-pulse-slow pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${compound.colorGradient[0]}, ${compound.colorGradient[1]})`,
            }}
          />

          {/* SVG Orbital Bond Connections */}
          <motion.svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 200 200"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 32, ease: 'linear' }}
          >
            {/* Center Nucleus */}
            <circle cx="100" cy="100" r="16" fill="rgba(255, 255, 255, 0.9)" />
            <circle cx="100" cy="100" r="22" fill="none" stroke={compound.colorGradient[0]} strokeWidth="1.5" opacity="0.6" />

            {/* Orbit paths & Nodes */}
            {compound.nodes.map((node, i) => (
              <g key={i}>
                <line
                  x1="100"
                  y1="100"
                  x2={node.x}
                  y2={node.y}
                  stroke="rgba(255, 255, 255, 0.25)"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size}
                  fill={i % 2 === 0 ? compound.colorGradient[0] : compound.colorGradient[1]}
                  opacity="0.85"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size + 4}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="1"
                />
              </g>
            ))}
          </motion.svg>
        </div>

        {/* Tagline & Synthesis Lore */}
        <div className="max-w-xl mx-auto space-y-3 mt-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
            {compound.tagline}
          </div>
          <p className="text-sm text-slate-300 leading-relaxed italic">
            &ldquo;{compound.loreDescription}&rdquo;
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
          <button
            onClick={() => {
              sound.playGlassClick();
              onContinue();
            }}
            className="px-8 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold bg-white text-black hover:bg-slate-200 transition-all flex items-center gap-2 shadow-glass-md"
          >
            <span>Mint Chemistry Card</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </LiquidGlassPanel>
    </div>
  );
};
