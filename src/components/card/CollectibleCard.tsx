'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChemistryScore, FictionalCompound } from '@/lib/types/chemistry';
import { MessageCircle, Check, Copy, Sparkles } from 'lucide-react';
import { sound } from '@/lib/sound/soundEffects';

interface CollectibleCardProps {
  score: ChemistryScore;
  compound: FictionalCompound;
  userAName: string;
  userBName: string;
  onOpenConversation: () => void;
}

export const CollectibleCard: React.FC<CollectibleCardProps> = ({
  score,
  compound,
  userAName,
  userBName,
  onOpenConversation,
}) => {
  const [copied, setCopied] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -8);
    setRotateY(((x - centerX) / centerX) * 8);
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
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
          Chemistry Card
        </h2>
        <p className="text-xs text-[#A1A1A6]">
          Verified synthesis record · Tilt card to inspect depth
        </p>
      </div>

      {/* 3D Holographic Card (Apple Wallet / Pass aesthetic) */}
      <div
        className="perspective-1000 flex justify-center cursor-pointer select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          animate={{ rotateX, rotateY }}
          transition={{ type: 'spring', stiffness: 280, damping: 25 }}
          className="relative w-full max-w-sm rounded-[24px] p-7 overflow-hidden border border-white/10 bg-[#1C1C1E] shadow-apple-card"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Card Header: Laboratory Pass info */}
          <div className="flex items-center justify-between text-[11px] text-[#A1A1A6] tracking-wide uppercase pb-4 border-b border-white/10">
            <span className="font-medium text-white">Affecio Laboratory</span>
            <span className="text-apple-blue font-semibold">{compound.formula}</span>
          </div>

          {/* Card Body: Molecule Name & Overall Score */}
          <div className="my-6 text-center space-y-1.5">
            <div className="text-2xl font-bold tracking-tight text-white">
              {compound.name}
            </div>
            <div className="text-xs text-[#A1A1A6]">
              {compound.classification}
            </div>

            <div className="py-4 flex items-baseline justify-center tabular-data">
              <span className="text-6xl font-light text-white tracking-tight">
                {score.overall}
              </span>
              <span className="text-2xl text-[#A1A1A6] font-normal ml-1">%</span>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-[#A1A1A6]">
              Synthesized by {userAName} & {userBName}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-2 py-3 border-y border-white/10 text-center">
            <div>
              <div className="text-[10px] text-[#A1A1A6] uppercase font-medium">Team</div>
              <div className="text-xs font-semibold text-white tabular-data mt-0.5">{score.teamwork}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#A1A1A6] uppercase font-medium">Sync</div>
              <div className="text-xs font-semibold text-white tabular-data mt-0.5">{score.synchronization}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#A1A1A6] uppercase font-medium">Adapt</div>
              <div className="text-xs font-semibold text-white tabular-data mt-0.5">{score.adaptability}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#A1A1A6] uppercase font-medium">Balance</div>
              <div className="text-xs font-semibold text-white tabular-data mt-0.5">{score.balance}</div>
            </div>
          </div>

          {/* Lore Quote */}
          <div className="mt-4 text-xs text-[#A1A1A6] italic text-center leading-relaxed">
            &ldquo;{compound.loreDescription}&rdquo;
          </div>

          {/* Card Footer */}
          <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#A1A1A6]">
            <span className="flex items-center gap-1 text-apple-green">
              <Sparkles className="w-3 h-3" /> Verified Reaction
            </span>
            <span>Affecio MVP</span>
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
          <span>{copied ? 'Link Copied' : 'Copy Card Link'}</span>
        </button>

        <button
          onClick={() => {
            sound.playGlassClick();
            onOpenConversation();
          }}
          className="apple-btn-primary w-full sm:w-auto px-6 text-xs"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Open Conversation Sparks</span>
        </button>
      </div>
    </div>
  );
};
