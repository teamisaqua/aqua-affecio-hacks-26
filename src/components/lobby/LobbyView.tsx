'use client';

import React, { useState } from 'react';
import { LiquidGlassPanel } from '../ui/LiquidGlassPanel';
import { UserRole, Participant } from '@/lib/types/chemistry';
import { sound } from '@/lib/sound/soundEffects';
import { Atom, Eye, Wrench, Copy, Check, ArrowRight } from 'lucide-react';

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

  const me = role === 'observer' ? userA : userB;
  const partner = role === 'observer' ? userB : userA;
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
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-slate-300 text-xs font-medium">
          <Atom className="w-3.5 h-3.5 text-sky-400" />
          <span>Experiment Chamber</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white">
          Shared Lobby
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-md mx-auto">
          Synchronize with your partner to begin the collaborative synthesis.
        </p>

        {/* Room Code Badge */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-slate-300 tabular-data">
            <span className="text-slate-500 font-medium">Chamber Code:</span>
            <span className="font-semibold text-white tracking-wider">{roomCode}</span>
            <button
              onClick={handleCopyCode}
              className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Copy Chamber Code"
              aria-label="Copy Chamber Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Role Pods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pod 1: Observer (User A) */}
        <LiquidGlassPanel
          tint={role === 'observer' ? 'cyan' : 'none'}
          className={`p-6 flex flex-col justify-between transition-all ${
            role === 'observer' ? 'ring-2 ring-sky-400/80' : 'opacity-85'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                <Eye className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                userA.isReady
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-white/5 text-slate-400 border-white/10'
              }`}>
                {userA.isReady ? 'Ready' : 'Not Ready'}
              </span>
            </div>

            <div className="text-xs uppercase tracking-wider text-sky-400 font-medium">
              Observer Role
            </div>
            <h3 className="text-xl font-semibold text-white mt-1">
              {userA.name || 'User A'}
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Monitors the recipe targets, pressure tolerances, and stability feedback. Holds the target values.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <span className="text-slate-400">
              {role === 'observer' ? 'You are assigned here' : 'Partner Role'}
            </span>
            {role !== 'observer' && (
              <button
                onClick={() => {
                  sound.playGlassClick();
                  onRoleSelect('observer');
                }}
                className="text-sky-400 hover:text-sky-300 font-medium"
              >
                Switch to Observer
              </button>
            )}
          </div>
        </LiquidGlassPanel>

        {/* Pod 2: Operator (User B) */}
        <LiquidGlassPanel
          tint={role === 'operator' ? 'rose' : 'none'}
          className={`p-6 flex flex-col justify-between transition-all ${
            role === 'operator' ? 'ring-2 ring-rose-400/80' : 'opacity-85'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
                <Wrench className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                userB.isReady
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-white/5 text-slate-400 border-white/10'
              }`}>
                {userB.isReady ? 'Ready' : 'Not Ready'}
              </span>
            </div>

            <div className="text-xs uppercase tracking-wider text-rose-400 font-medium">
              Operator Role
            </div>
            <h3 className="text-xl font-semibold text-white mt-1">
              {userB.name || 'User B'}
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Controls physical sliders, heat levels, and catalyst valves. Relies on verbal communication.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <span className="text-slate-400">
              {role === 'operator' ? 'You are assigned here' : 'Partner Role'}
            </span>
            {role !== 'operator' && (
              <button
                onClick={() => {
                  sound.playGlassClick();
                  onRoleSelect('operator');
                }}
                className="text-rose-400 hover:text-rose-300 font-medium"
              >
                Switch to Operator
              </button>
            )}
          </div>
        </LiquidGlassPanel>
      </div>

      {/* Readiness & Chamber Launch Bar */}
      <LiquidGlassPanel className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-left">
          <span className={`w-2.5 h-2.5 rounded-full ${bothReady ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <div>
            <div className="text-sm font-medium text-white">
              {bothReady
                ? 'Both participants ready'
                : me.isReady
                ? `Ready. Waiting for ${partner.name}...`
                : 'Confirm readiness when ready to start'}
            </div>
            <div className="text-xs text-slate-400">
              Duration: 45 seconds · Voice communication encouraged
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 w-full sm:w-auto">
          <button
            onClick={() => {
              sound.playGlassClick();
              onReadyToggle();
            }}
            className={`apple-btn-secondary flex-1 sm:flex-none ${
              me.isReady ? '!border-emerald-500/40 !bg-emerald-500/10 text-emerald-300' : ''
            }`}
          >
            {me.isReady ? '✓ You Are Ready' : 'Ready'}
          </button>

          <button
            onClick={() => {
              sound.playGlassClick();
              onStartExperience();
            }}
            disabled={!bothReady && !demoMode}
            className="apple-btn-primary flex-1 sm:flex-none"
          >
            <span>Start Experiment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </LiquidGlassPanel>
    </div>
  );
};
