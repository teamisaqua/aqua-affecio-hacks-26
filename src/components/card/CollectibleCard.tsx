'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChemistryScore, FictionalCompound } from '@/lib/types/chemistry';
import { MessageCircle, Check, Copy, RotateCcw, Sparkles } from 'lucide-react';
import { sound } from '@/lib/sound/soundEffects';

interface CollectibleCardProps {
  score: ChemistryScore;
  compound: FictionalCompound;
  userAName: string;
  userBName: string;
  onOpenConversation: () => void;
  onRestart?: () => void;
}

export const CollectibleCard: React.FC<CollectibleCardProps> = ({
  score,
  compound,
  userAName,
  userBName,
  onOpenConversation,
  onRestart,
}) => {
  const [copied, setCopied] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const affinity = score.affinityIndex || score.overall || 82;
  const specimenId = `AFC-2026-${Math.abs((affinity * 37) % 900 + 100)}`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -10);
    setRotateY(((x - centerX) / centerX) * 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleCopyLink = () => {
    sound.playGlassClick();
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6 select-none text-center">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          {score.headline || 'Your chemistry is strong.'}
        </h2>
        <p className="text-xs text-[#A1A1A6]">
          Interactive specimen record · Tilt to inspect
        </p>
      </div>

      {/* 3D Holographic Card (Apple Wallet / Specimen Pass aesthetic) */}
      <div
        className="perspective-1000 flex justify-center cursor-pointer select-none py-1"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          animate={{ rotateX, rotateY }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-sm rounded-3xl p-7 overflow-hidden border border-white/12 bg-gradient-to-b from-[#202022] via-[#171717] to-[#111111] shadow-2xl text-left"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Dynamic Specular Sheen */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              background: `linear-gradient(${125 + rotateY * 5}deg, rgba(255,255,255,0.12) 0%, rgba(41,151,255,0.14) 40%, rgba(52,199,89,0.06) 70%, rgba(255,255,255,0) 100%)`,
            }}
          />

          {/* Background SVG Molecule Watermark */}
          <div className="pointer-events-none absolute right-[-20px] bottom-[-20px] opacity-10">
            <svg width="180" height="180" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="30" stroke="#FFFFFF" strokeWidth="1" fill="none" />
              <circle cx="50" cy="50" r="10" fill="#FFFFFF" />
              <circle cx="20" cy="20" r="6" fill="#2997FF" />
              <circle cx="80" cy="80" r="6" fill="#34C759" />
              <line x1="50" y1="50" x2="20" y2="20" stroke="#FFFFFF" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="80" y2="80" stroke="#FFFFFF" strokeWidth="0.5" />
            </svg>
          </div>

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between text-xs text-[#A1A1A6] pb-4 border-b border-white/8">
            <span className="font-semibold text-white tracking-tight">Affecio Lab</span>
            <span className="text-apple-blue font-semibold">{compound.formula}</span>
          </div>

          {/* Molecule Name & Overall Score */}
          <div className="relative z-10 my-6 text-center space-y-1">
            <div className="text-2xl font-bold tracking-tight text-white">
              {compound.name}
            </div>
            <div className="text-xs text-[#A1A1A6]">
              {compound.classification}
            </div>

            <div className="py-2">
              <div className="text-[11px] uppercase tracking-wider text-[#A1A1A6]">
                Affinity
              </div>
              <div className="text-6xl font-light text-white tracking-tight tabular-nums mt-0.5">
                {affinity}
              </div>
            </div>

            <div className="text-xs text-[#A1A1A6]">
              Synthesized by {userAName} & {userBName}
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div className="relative z-10 grid grid-cols-4 gap-2 py-3 border-y border-white/8 text-center text-xs">
            <div>
              <div className="text-[10px] text-[#A1A1A6]">Reasoning</div>
              <div className="font-semibold text-white tabular-nums mt-0.5">
                {score.chemicalReasoning || score.teamwork}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#A1A1A6]">Alignment</div>
              <div className="font-semibold text-white tabular-nums mt-0.5">
                {score.decisionAlignment || score.synchronization}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#A1A1A6]">Timing</div>
              <div className="font-semibold text-white tabular-nums mt-0.5">
                {score.reactionTiming || score.adaptability}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#A1A1A6]">Risk</div>
              <div className="font-semibold text-white tabular-nums mt-0.5">
                {score.riskCompatibility || score.balance}
              </div>
            </div>
          </div>

          {/* Synthesis Lore Quote */}
          <div className="relative z-10 mt-4 text-xs text-[#A1A1A6] italic text-center leading-relaxed px-2">
            &ldquo;{compound.loreDescription}&rdquo;
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-5 pt-3 border-t border-white/8 flex items-center justify-between text-[11px] text-[#A1A1A6]">
            <span className="flex items-center gap-1 text-apple-green font-medium">
              <Sparkles className="w-3 h-3" /> Verified Reaction
            </span>
            <span>{specimenId}</span>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={handleCopyLink}
          className="apple-btn-secondary w-full sm:w-auto px-6 text-xs"
        >
          {copied ? <Check className="w-4 h-4 text-apple-green" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Link Copied' : 'Share Result'}</span>
        </button>

        <button
          onClick={() => {
            sound.playGlassClick();
            onOpenConversation();
          }}
          className="apple-btn-primary w-full sm:w-auto px-6 text-xs"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Conversation Sparks</span>
        </button>

        {onRestart && (
          <button
            onClick={() => {
              sound.playGlassClick();
              onRestart();
            }}
            className="apple-btn-secondary w-full sm:w-auto px-5 text-xs text-[#A1A1A6] hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Run Another</span>
          </button>
        )}
      </div>
    </div>
  );
};
