'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChemistryScore, FictionalCompound } from '@/lib/types/chemistry';
import { Sparkles, Share2, MessageCircle, Check, Copy } from 'lucide-react';
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
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          Collectible Chemistry Card
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Hover to inspect holographic depth · Shareable certificate of synthesis
        </p>
      </div>

      {/* 3D Holographic Card Container */}
      <div
        className="perspective-1000 flex justify-center cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          animate={{ rotateX, rotateY }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-sm rounded-[2rem] p-7 overflow-hidden border border-white/20 shadow-glass-lg backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 via-[#0e1628]/95 to-slate-950/90"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Holographic Sheen Layer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-lab-cyan/15 via-transparent to-lab-pink/15 opacity-60 pointer-events-none mix-blend-overlay" />
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* Card Header: Laboratory Tag & Serial */}
          <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-slate-400 uppercase pb-4 border-b border-white/10">
            <span>AFFECIO LAB CERTIFIED</span>
            <span className="text-lab-cyan font-bold">{compound.formula}</span>
          </div>

          {/* Card Body: Molecule Name & Overall Score */}
          <div className="my-6 text-center space-y-2">
            <div className="text-3xl font-black font-mono tracking-tight text-white">
              {compound.name}
            </div>
            <div className="text-xs font-mono text-lab-pink tracking-wider font-semibold">
              {compound.classification}
            </div>

            <div className="py-4 flex items-center justify-center gap-1 font-mono">
              <span className="text-6xl font-extrabold bg-gradient-to-r from-lab-cyan via-purple-300 to-lab-pink bg-clip-text text-transparent">
                {score.overall}
              </span>
              <span className="text-2xl text-slate-400 font-light">%</span>
            </div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              SYNTHESIZED BY {userAName} & {userBName}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-2 py-4 border-y border-white/10 text-center font-mono">
            <div>
              <div className="text-[9px] text-slate-400">SYNC</div>
              <div className="text-sm font-bold text-lab-cyan">{score.synchronization}</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400">TEAM</div>
              <div className="text-sm font-bold text-lab-pink">{score.teamwork}</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400">ADAPT</div>
              <div className="text-sm font-bold text-lab-purple">{score.adaptability}</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400">BAL</div>
              <div className="text-sm font-bold text-amber-400">{score.balance}</div>
            </div>
          </div>

          {/* Lore Quote */}
          <div className="mt-5 text-[11px] text-slate-300 italic text-center leading-relaxed">
            &ldquo;{compound.loreDescription}&rdquo;
          </div>

          {/* Card Footer: Hologram Seal */}
          <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <Sparkles className="w-3 h-3" /> VERIFIED REACTION
            </span>
            <span>EXPERIENCE MVP</span>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={handleCopyLink}
          className="w-full sm:w-auto px-6 py-3 rounded-xl glass-btn text-xs font-mono font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Link Copied to Clipboard!' : 'Share Chemistry Card'}</span>
        </button>

        <button
          onClick={() => {
            sound.playGlassClick();
            onOpenConversation();
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-lab-pink to-purple-600 text-white shadow-glow-pink hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Catalytic Conversation Sparks</span>
        </button>
      </div>
    </div>
  );
};
