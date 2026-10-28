'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LiquidGlassPanel } from '../ui/LiquidGlassPanel';
import { UserRole, Participant } from '@/lib/types/chemistry';
import { sound } from '@/lib/sound/soundEffects';
import { Atom, Shield, Eye, Wrench, Sparkles, Copy, Check, Users, ArrowRight } from 'lucide-react';

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
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Lobby Hero Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lab-cyan/10 border border-lab-cyan/30 text-lab-cyan text-xs font-mono uppercase tracking-widest">
          <Atom className="w-3.5 h-3.5" /> Affecio Chemistry Lab
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
          Liquid Glass Chamber
        </h1>
        <p className="text-sm md:text-base text-slate-400 max-w-lg mx-auto">
          Don&apos;t just match. Discover your chemistry. Synchronize with your partner to initiate the reactor.
        </p>

        {/* Room Share Pill */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-xs font-mono">
            <span className="text-slate-400">CHAMBER CODE:</span>
            <span className="text-lab-cyan font-bold tracking-widest text-sm">{roomCode}</span>
            <button
              onClick={handleCopyCode}
              className="ml-2 p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Copy Room Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Role Pods: Observer (User A) & Operator (User B) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pod 1: Observer (User A) */}
        <LiquidGlassPanel
          glow={role === 'observer' ? 'cyan' : 'none'}
          className={`p-6 flex flex-col justify-between transition-all ${
            role === 'observer' ? 'ring-2 ring-lab-cyan/60' : 'opacity-85'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-lab-cyan/10 border border-lab-cyan/30 text-lab-cyan">
                <Eye className="w-6 h-6" />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
                userA.isReady
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/5 text-slate-400 border-white/10'
              }`}>
                {userA.isReady ? 'READY FOR SYNTHESIS' : 'WAITING'}
              </span>
            </div>

            <div className="text-xs font-mono uppercase tracking-widest text-lab-cyan font-bold">
              ROLE: OBSERVER
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              {userA.name || 'User A'}
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Receives target temperature, pressure tolerances, and stability diagnostics. Holds the secret formula.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">
              {role === 'observer' ? 'You are assigned here' : 'Partner role'}
            </span>
            {role !== 'observer' && (
              <button
                onClick={() => {
                  sound.playGlassClick();
                  onRoleSelect('observer');
                }}
                className="text-xs font-mono text-lab-cyan hover:underline"
              >
                Switch to Observer
              </button>
            )}
          </div>
        </LiquidGlassPanel>

        {/* Pod 2: Operator (User B) */}
        <LiquidGlassPanel
          glow={role === 'operator' ? 'pink' : 'none'}
          className={`p-6 flex flex-col justify-between transition-all ${
            role === 'operator' ? 'ring-2 ring-lab-pink/60' : 'opacity-85'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-lab-pink/10 border border-lab-pink/30 text-lab-pink">
                <Wrench className="w-6 h-6" />
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
                userB.isReady
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/5 text-slate-400 border-white/10'
              }`}>
                {userB.isReady ? 'READY FOR SYNTHESIS' : 'WAITING'}
              </span>
            </div>

            <div className="text-xs font-mono uppercase tracking-widest text-lab-pink font-bold">
              ROLE: OPERATOR
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              {userB.name || 'User B'}
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Controls physical actuators, thermal sliders, and catalyst valves. Blind to the targets without verbal direction.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">
              {role === 'operator' ? 'You are assigned here' : 'Partner role'}
            </span>
            {role !== 'operator' && (
              <button
                onClick={() => {
                  sound.playGlassClick();
                  onRoleSelect('operator');
                }}
                className="text-xs font-mono text-lab-pink hover:underline"
              >
                Switch to Operator
              </button>
            )}
          </div>
        </LiquidGlassPanel>
      </div>

      {/* Readiness & Chamber Launch Console */}
      <LiquidGlassPanel className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-glow-cyan animate-pulse" />
          <div>
            <div className="text-sm font-semibold text-white">
              {bothReady
                ? 'Both Participants Synchronized!'
                : me.isReady
                ? `You are ready. Waiting for ${partner.name}...`
                : 'Confirm readiness to initiate reaction synthesis.'}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Challenge duration: 45 seconds · Vocal communication required
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => {
              sound.playGlassClick();
              onReadyToggle();
            }}
            className={`w-full md:w-auto px-6 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all border ${
              me.isReady
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'glass-btn text-white hover:border-white/30'
            }`}
          >
            {me.isReady ? '✓ You Are Ready' : 'Mark Ready'}
          </button>

          <button
            onClick={() => {
              sound.playGlassClick();
              onStartExperience();
            }}
            disabled={!bothReady && !demoMode}
            className="w-full md:w-auto px-8 py-3 rounded-xl font-mono text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-lab-cyan to-lab-pink text-black shadow-glow-cyan hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>Initiate Synthesis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </LiquidGlassPanel>
    </div>
  );
};
