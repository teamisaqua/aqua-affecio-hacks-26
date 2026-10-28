'use client';

import React, { useState } from 'react';
import { UserRole, Participant } from '@/lib/types/chemistry';
import { sound } from '@/lib/sound/soundEffects';
import { Compass, Sliders, Copy, Check, ArrowRight, Sparkles } from 'lucide-react';

interface LobbyViewProps {
  roomCode: string;
  role: UserRole;
  userA: Participant;
  userB: Participant;
  onRoleSelect: (role: UserRole) => void;
  onReadyToggle: () => void;
  onStartExperience: () => void;
  demoMode?: boolean;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  roomCode,
  role,
  userA,
  userB,
  onRoleSelect,
  onReadyToggle,
  onStartExperience,
  demoMode = false,
}) => {
  const [copied, setCopied] = useState(false);

  const isExplore = role === 'explore' || role === 'observer';
  const bothReady = userA.isReady && userB.isReady;

  const handleCopyCode = () => {
    sound.playGlassClick();
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 select-none text-center">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171717] border border-white/8 text-[#A1A1A6] text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-apple-blue" />
          <span>Experiment Lobby</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
          Ready to begin?
        </h1>
        <p className="text-sm text-[#A1A1A6] max-w-md mx-auto">
          Both players must confirm readiness before entering Experiment 01.
        </p>

        {/* Room Code Badge */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#141416] border border-white/8 text-xs text-white">
            <span className="text-[#A1A1A6]">Room code:</span>
            <span className="font-semibold text-white tracking-wider font-mono">{roomCode}</span>
            <button
              onClick={handleCopyCode}
              className="p-1 rounded-md hover:bg-white/10 text-[#A1A1A6] hover:text-white transition-colors"
              title="Copy Code"
              aria-label="Copy Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-apple-green" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Two Participant Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        {/* User A Card: Explore */}
        <div className={`p-6 rounded-3xl border transition-all flex flex-col justify-between min-h-[220px] ${
          isExplore
            ? 'bg-[#171717] border-apple-blue ring-1 ring-apple-blue/40 shadow-xl'
            : 'bg-[#111111] border-white/8 opacity-90'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 text-apple-blue flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                userA.isReady
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-[#1C1C1E] text-[#A1A1A6] border-white/8'
              }`}>
                {userA.isReady ? 'Ready' : 'Waiting'}
              </span>
            </div>

            <div className="text-xs uppercase tracking-wider text-apple-blue font-semibold">
              Explore Role
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              {userA.name || 'User A'}
            </h3>
            <p className="text-xs text-[#A1A1A6] mt-2 leading-relaxed">
              You monitor target recipes, thermal tolerances, and verbally direct your partner.
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-white/8 flex items-center justify-between text-xs">
            <span className="text-[#A1A1A6]">
              {isExplore ? 'You are assigned here' : 'Partner Role'}
            </span>
            {!isExplore && (
              <button
                onClick={() => {
                  sound.playGlassClick();
                  onRoleSelect('explore');
                }}
                className="text-apple-blue hover:underline font-medium"
              >
                Switch to Explore
              </button>
            )}
          </div>
        </div>

        {/* User B Card: Control */}
        <div className={`p-6 rounded-3xl border transition-all flex flex-col justify-between min-h-[220px] ${
          !isExplore
            ? 'bg-[#171717] border-apple-blue ring-1 ring-apple-blue/40 shadow-xl'
            : 'bg-[#111111] border-white/8 opacity-90'
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 text-apple-blue flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                userB.isReady
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-[#1C1C1E] text-[#A1A1A6] border-white/8'
              }`}>
                {userB.isReady ? 'Ready' : 'Waiting'}
              </span>
            </div>

            <div className="text-xs uppercase tracking-wider text-apple-blue font-semibold">
              Control Role
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              {userB.name || 'User B'}
            </h3>
            <p className="text-xs text-[#A1A1A6] mt-2 leading-relaxed">
              You adjust live thermal actuators, pressure regulators, and secondary catalyst flow.
            </p>
          </div>

          <div className="mt-6 pt-3 border-t border-white/8 flex items-center justify-between text-xs">
            <span className="text-[#A1A1A6]">
              {!isExplore ? 'You are assigned here' : 'Partner Role'}
            </span>
            {isExplore && (
              <button
                onClick={() => {
                  sound.playGlassClick();
                  onRoleSelect('control');
                }}
                className="text-apple-blue hover:underline font-medium"
              >
                Switch to Control
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ready and Launch Actions */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => {
            sound.playGlassClick();
            onReadyToggle();
          }}
          className={`apple-btn-secondary w-full sm:w-auto px-7 text-xs font-semibold ${
            (isExplore ? userA.isReady : userB.isReady)
              ? 'border-emerald-500/50 text-emerald-300'
              : ''
          }`}
        >
          <span>{(isExplore ? userA.isReady : userB.isReady) ? '✓ You Are Ready' : 'Mark Yourself Ready'}</span>
        </button>

        <button
          onClick={() => {
            sound.playSuccessChime();
            onStartExperience();
          }}
          disabled={!bothReady && !demoMode}
          className="apple-btn-primary w-full sm:w-auto px-8 text-xs font-semibold"
        >
          <span>Begin Experiment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {!bothReady && !demoMode && (
        <p className="text-xs text-[#A1A1A6]">
          Waiting for both participants to confirm ready.
        </p>
      )}
    </div>
  );
};
