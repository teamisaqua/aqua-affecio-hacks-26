'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChemistryScore, FictionalCompound } from '@/lib/types/chemistry';
import { MessageCircle, Check, Copy, Sparkles, Shield, QrCode } from 'lucide-react';
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

  const specimenId = `AFC-2026-${Math.abs((score.overall * 37) % 900 + 100)}`;

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
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C1C1E] border border-white/10 text-xs font-medium text-[#A1A1A6]">
          <Shield className="w-3.5 h-3.5 text-apple-green" />
          <span>Verified Reaction Record</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
          Chemistry Card
        </h2>
        <p className="text-xs text-[#A1A1A6]">
          Permanent cryptographic synthesis record · Tilt card to inspect holographic sheen
        </p>
      </div>

      {/* 3D Holographic Card (Apple Wallet / Pass aesthetic) */}
      <div
        className="perspective-1000 flex justify-center cursor-pointer select-none py-2"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          animate={{ rotateX, rotateY }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-sm rounded-[24px] p-7 overflow-hidden border border-white/15 bg-gradient-to-b from-[#242426] via-[#1C1C1E] to-[#141416] shadow-2xl"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Dynamic Holographic Specular Sheen */}
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
            style={{
              background: `linear-gradient(${125 + rotateY * 5}deg, rgba(255,255,255,0.12) 0%, rgba(41,151,255,0.14) 35%, rgba(52,199,89,0.08) 65%, rgba(255,255,255,0) 100%)`,
            }}
          />

          {/* Background SVG Watermark of the Compound */}
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

          {/* Card Header: Laboratory Pass info */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-[#A1A1A6] tracking-wide uppercase pb-4 border-b border-white/10 font-mono">
            <span className="font-semibold text-white tracking-widest">AFFECIO LAB</span>
            <span className="text-apple-blue font-bold">{compound.formula}</span>
          </div>

          {/* Card Body: Molecule Name & Overall Score */}
          <div className="relative z-10 my-6 text-center space-y-1.5">
            <div className="text-2xl font-bold tracking-tight text-white">
              {compound.name}
            </div>
            <div className="text-xs text-[#A1A1A6]">
              {compound.classification}
            </div>

            <div className="py-3 flex items-baseline justify-center tabular-data">
              <span className="text-6xl md:text-7xl font-light text-white tracking-tight">
                {score.overall}
              </span>
              <span className="text-2xl text-apple-blue font-normal ml-1">%</span>
            </div>
            <div className="text-[11px] uppercase tracking-wider text-[#A1A1A6] font-mono">
              SYNTHESIZED BY {userAName} & {userBName}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="relative z-10 grid grid-cols-4 gap-2 py-3 border-y border-white/10 text-center font-mono">
            <div>
              <div className="text-[9px] text-[#A1A1A6] uppercase font-medium">Team</div>
              <div className="text-xs font-semibold text-white tabular-data mt-0.5">{score.teamwork}</div>
            </div>
            <div>
              <div className="text-[9px] text-[#A1A1A6] uppercase font-medium">Sync</div>
              <div className="text-xs font-semibold text-white tabular-data mt-0.5">{score.synchronization}</div>
            </div>
            <div>
              <div className="text-[9px] text-[#A1A1A6] uppercase font-medium">Adapt</div>
              <div className="text-xs font-semibold text-white tabular-data mt-0.5">{score.adaptability}</div>
            </div>
            <div>
              <div className="text-[9px] text-[#A1A1A6] uppercase font-medium">Balance</div>
              <div className="text-xs font-semibold text-white tabular-data mt-0.5">{score.balance}</div>
            </div>
          </div>

          {/* Lore Quote */}
          <div className="relative z-10 mt-4 text-xs text-[#A1A1A6] italic text-center leading-relaxed px-2">
            &ldquo;{compound.loreDescription}&rdquo;
          </div>

          {/* Card Footer with Specimen Serial Hash */}
          <div className="relative z-10 mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-[#A1A1A6] font-mono">
            <span className="flex items-center gap-1 text-apple-green font-semibold">
              <Sparkles className="w-3 h-3" /> VERIFIED SPECIMEN
            </span>
            <span className="tracking-wider">{specimenId}</span>
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
          <span>{copied ? 'Link Copied to Clipboard' : 'Share Specimen Record'}</span>
        </button>

        <button
          onClick={() => {
            sound.playGlassClick();
            onOpenConversation();
          }}
          className="apple-btn-primary w-full sm:w-auto px-6 text-xs"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Catalytic Sparks & Chat</span>
        </button>
      </div>
    </div>
  );
};
