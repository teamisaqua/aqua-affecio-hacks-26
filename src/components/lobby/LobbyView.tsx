'use client';

import React, { useState } from 'react';
import { UserRole, Participant } from '@/lib/types/chemistry';
import { sound } from '@/lib/sound/soundEffects';
import { Compass, Sliders, Copy, Check, ArrowRight, Sparkles, UserCheck, Bot } from 'lucide-react';

interface LobbyViewProps {
  roomCode: string;
  role: UserRole;
  userA: Participant;
  userB: Participant;
  isSimulatedPartner?: boolean;
  onToggleSimulatedPartner?: () => void;
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
  isSimulatedPartner = false,
  onToggleSimulatedPartner,
  onRoleSelect,
  onReadyToggle,
  onStartExperience,
  demoMode = false,
}) => {
  const [copied, setCopied] = useState(false);

  const isExplore = role === 'explore' || role === 'observer';
  const bothReady = (userA.isReady && userB.isReady) || (isExplore ? userA.isReady && isSimulatedPartner : userB.isReady && isSimulatedPartner);

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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16161A] border border-white/8 text-[#86868B] text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#2997FF]" />
          <span>Experiment Chamber Setup</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Chamber Ready
        </h1>
        <p className="text-xs sm:text-sm text-[#86868B] max-w-md mx-auto">
          Share the room code with your partner, or evaluate with a simulated partner.
        </p>

        {/* Room Code & Connection Badge */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121215] border border-white/8 text-xs text-white">
            <span className="text-[#86868B]">Room:</span>
            <span className="font-semibold text-white tracking-wider font-mono">{roomCode}</span>
            <button
              onClick={handleCopyCode}
              className="p-1 rounded-md hover:bg-white/10 text-[#86868B] hover:text-white transition-colors"
              title="Copy Code"
              aria-label="Copy Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#34C759]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {onToggleSimulatedPartner && (
            <button
              onClick={() => {
                sound.playGlassClick();
                onToggleSimulatedPartner();
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                isSimulatedPartner
                  ? 'bg-[#2997FF]/15 border-[#2997FF]/40 text-[#2997FF]'
                  : 'bg-[#121215] border-white/8 text-[#86868B] hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>{isSimulatedPartner ? 'Simulated Partner: Active' : 'Enable Simulated Partner'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Two Participant Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        {/* User A Card: Explore */}
        <div
          className={`p-6 rounded-3xl border transition-all flex flex-col justify-between min-h-[200px] ${
            isExplore
              ? 'bg-[#141418] border-[#2997FF]/50 ring-1 ring-[#2997FF]/30 shadow-xl'
              : 'bg-[#101013] border-white/8 opacity-90'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-full bg-[#1C1C20] border border-white/10 text-[#2997FF] flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${
                  userA.isReady
                    ? 'bg-[#34C759]/15 text-[#34C759] border-[#34C759]/30 font-semibold'
                    : 'bg-[#1C1C20] text-[#86868B] border-white/8'
                }`}
              >
                {userA.isReady ? 'Ready' : 'Waiting'}
              </span>
            </div>

            <div className="text-[11px] uppercase tracking-wider text-[#2997FF] font-semibold font-mono">
              Explore Role
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {userA.name || 'Alex'}
            </h3>
            <p className="text-xs text-[#86868B] mt-1.5 leading-relaxed">
              Monitors target recipes, tolerances, and guides partner during reactions.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between text-xs">
            <span className="text-[#86868B]">
              {isExplore ? 'You are assigned here' : isSimulatedPartner ? 'Simulated Participant' : 'Multiplayer Partner'}
            </span>
            {!isExplore && (
              <button
                onClick={() => {
                  sound.playGlassClick();
                  onRoleSelect('explore');
                }}
                className="text-[#2997FF] hover:underline font-medium text-xs"
              >
                Switch to Explore
              </button>
            )}
          </div>
        </div>

        {/* User B Card: Control */}
        <div
          className={`p-6 rounded-3xl border transition-all flex flex-col justify-between min-h-[200px] ${
            !isExplore
              ? 'bg-[#141418] border-[#2997FF]/50 ring-1 ring-[#2997FF]/30 shadow-xl'
              : 'bg-[#101013] border-white/8 opacity-90'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-full bg-[#1C1C20] border border-white/10 text-[#2997FF] flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${
                  userB.isReady || (isSimulatedPartner && userA.isReady)
                    ? 'bg-[#34C759]/15 text-[#34C759] border-[#34C759]/30 font-semibold'
                    : 'bg-[#1C1C20] text-[#86868B] border-white/8'
                }`}
              >
                {userB.isReady || (isSimulatedPartner && userA.isReady) ? 'Ready' : 'Waiting'}
              </span>
            </div>

            <div className="text-[11px] uppercase tracking-wider text-[#2997FF] font-semibold font-mono">
              Control Role
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {userB.name || 'Taylor'}
            </h3>
            <p className="text-xs text-[#86868B] mt-1.5 leading-relaxed">
              Adjusts live thermal actuators, pressure regulators, and catalyst flow.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between text-xs">
            <span className="text-[#86868B]">
              {!isExplore ? 'You are assigned here' : isSimulatedPartner ? 'Simulated Participant' : 'Multiplayer Partner'}
            </span>
            {isExplore && (
              <button
                onClick={() => {
                  sound.playGlassClick();
                  onRoleSelect('control');
                }}
                className="text-[#2997FF] hover:underline font-medium text-xs"
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
          className={`apple-btn-secondary w-full sm:w-auto px-6 text-xs font-semibold ${
            (isExplore ? userA.isReady : userB.isReady)
              ? 'border-[#34C759]/50 text-[#34C759]'
              : ''
          }`}
        >
          <span>{(isExplore ? userA.isReady : userB.isReady) ? '✓ You Are Ready' : 'Confirm Ready'}</span>
        </button>

        <button
          onClick={() => {
            sound.playSuccessChime();
            onStartExperience();
          }}
          disabled={!bothReady && !demoMode}
          className="apple-btn-primary w-full sm:w-auto px-8 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Begin Experiment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {!bothReady && !demoMode && (
        <p className="text-xs text-[#86868B]">
          {isSimulatedPartner
            ? 'Confirm ready above to commence with simulated partner.'
            : 'Waiting for partner or activate simulated partner above.'}
        </p>
      )}
    </div>
  );
};
