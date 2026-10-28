'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ReactionCanvas, ReactionFieldState } from '@/components/molecular/ReactionCanvas';
import { SoundToggle } from '@/components/ui/SoundToggle';
import { sound } from '@/lib/sound/soundEffects';
import { Atom, ArrowRight, Play, Eye, Wrench, Shield, Activity } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<'observer' | 'operator'>('observer');
  const [fieldState, setFieldState] = useState<ReactionFieldState>('idle');

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'LAB-';
    for (let i = 0; i < 3; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playGlassClick();
    const code = generateRoomCode();
    const finalName = name.trim() || 'Aria';
    router.push(`/lab/${code}?name=${encodeURIComponent(finalName)}&role=${selectedRole}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    sound.playGlassClick();
    const code = roomCode.trim().toUpperCase();
    const finalName = name.trim() || 'Leo';
    router.push(`/lab/${code}?name=${encodeURIComponent(finalName)}&role=operator`);
  };

  const handleLaunchDemo = () => {
    sound.playSuccessChime();
    router.push(`/lab/DEMO-26?demo=true&name=Presenter&role=observer`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 md:p-8 bg-black text-white relative">
      {/* Top Laboratory Instrument Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold tracking-widest text-sm text-white">AFFECIO</span>
            <span className="text-[#A1A1A6] text-[10px]">CHEMISTRY SPECIMEN LAB</span>
          </div>
          <span className="hidden sm:inline text-white/20">|</span>
          <div className="hidden sm:flex items-center space-x-1.5 text-apple-green">
            <span className="w-1.5 h-1.5 rounded-full bg-apple-green animate-pulse" />
            <span>CORE: ONLINE</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-[#A1A1A6]">
          <div className="hidden md:flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-apple-blue" />
            <span>REACTION PROTOCOL v2.6</span>
          </div>
          <SoundToggle />
        </div>
      </header>

      {/* Main Laboratory Viewport */}
      <main className="flex-1 max-w-4xl w-full mx-auto flex flex-col justify-center items-center py-6 space-y-6">
        {/* Scientific Protocol Banner */}
        <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#A1A1A6] bg-[#1C1C1E] px-3.5 py-1.5 rounded-full border border-white/10">
          <span>PERSON</span>
          <span className="text-white/30">→</span>
          <span>SIGNAL</span>
          <span className="text-white/30">→</span>
          <span>INTERACTION</span>
          <span className="text-white/30">→</span>
          <span>REACTION</span>
          <span className="text-white/30">→</span>
          <span className="text-apple-blue font-semibold">AFFINITY</span>
        </div>

        {/* Central Living Reaction Visualization (The Main Differentiator) */}
        <div className="w-full relative">
          <ReactionCanvas
            state={fieldState}
            participantAName={name.trim() || 'Participant Alpha'}
            participantBName={selectedRole === 'observer' ? 'Beta (Operator)' : 'Alpha (Observer)'}
          />
        </div>

        {/* Docked Chamber Entry Instrument */}
        <div className="w-full max-w-md apple-card p-6 space-y-5 bg-[#1C1C1E] border border-white/10 shadow-apple-card">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-mono">
            <span className="font-semibold text-white tracking-wide uppercase">ENTER CHAMBER</span>
            <span className="text-[#A1A1A6] text-[10px]">CHAMBER CALIBRATION</span>
          </div>

          <div className="space-y-4">
            {/* Handle Input */}
            <div>
              <label htmlFor="handle-input" className="block text-[11px] font-mono uppercase tracking-wider text-[#A1A1A6] mb-1.5">
                Participant Handle
              </label>
              <input
                id="handle-input"
                type="text"
                value={name}
                onFocus={() => setFieldState('lobby')}
                onBlur={() => !name && setFieldState('idle')}
                onChange={(e) => {
                  setName(e.target.value);
                  setFieldState(e.target.value ? 'lobby' : 'idle');
                }}
                placeholder="e.g. Aria"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#2C2C2E] border border-white/10 text-white placeholder-[#A1A1A6] text-sm focus:outline-none focus:border-apple-blue font-mono"
              />
            </div>

            {/* Role Assignment */}
            <div>
              <span className="block text-[11px] font-mono uppercase tracking-wider text-[#A1A1A6] mb-1.5">
                Chamber Station Role
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playGlassClick();
                    setSelectedRole('observer');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all duration-120 ${
                    selectedRole === 'observer'
                      ? 'bg-[#2C2C2E] border-apple-blue text-white ring-1 ring-apple-blue/40'
                      : 'bg-[#2C2C2E]/50 border-white/10 text-[#A1A1A6] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-apple-blue font-mono">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Observer [α]</span>
                  </div>
                  <div className="text-[10px] text-[#A1A1A6] mt-0.5">Diagnostic targets</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playGlassClick();
                    setSelectedRole('operator');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all duration-120 ${
                    selectedRole === 'operator'
                      ? 'bg-[#2C2C2E] border-apple-blue text-white ring-1 ring-apple-blue/40'
                      : 'bg-[#2C2C2E]/50 border-white/10 text-[#A1A1A6] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-apple-blue font-mono">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Operator [β]</span>
                  </div>
                  <div className="text-[10px] text-[#A1A1A6] mt-0.5">Physical actuators</div>
                </button>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={handleCreateRoom}
              className="apple-btn-primary w-full sm:flex-1 font-mono text-xs"
            >
              <span>Initialize Chamber</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="w-full sm:w-auto flex items-center gap-1.5">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="LAB-KEY"
                aria-label="Chamber Code to Join"
                className="w-24 px-2.5 py-2.5 rounded-full bg-[#2C2C2E] border border-white/10 text-white placeholder-[#A1A1A6] text-xs font-mono text-center uppercase focus:outline-none focus:border-apple-blue"
              />
              <button
                onClick={handleJoinRoom}
                className="apple-btn-secondary !min-h-[40px] !px-3 !py-2 text-xs font-mono"
              >
                Join
              </button>
            </div>
          </div>

          {/* Instant Hackathon Judge Demo Link */}
          <div className="pt-3 border-t border-white/10 text-center">
            <button
              onClick={handleLaunchDemo}
              className="apple-btn-tinted w-full font-mono text-xs flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>⚡ Enter Demo Chamber (Judge Presentation)</span>
            </button>
            <p className="text-[10px] text-[#A1A1A6] mt-1.5 font-mono">
              Direct access: Observer vs Operator instrument with simulated partner.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Instrument Status Strip */}
      <footer className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between py-3 border-t border-white/10 text-[11px] font-mono text-[#A1A1A6] gap-2">
        <div className="flex items-center space-x-3">
          <span>AFFECIO EXPERIMENTAL SPECIMEN</span>
          <span>·</span>
          <span>HACKATHON 2026</span>
        </div>
        <div>
          <span>LIVE TELEMETRY DETERMINISTIC AFFINITY ENGINE</span>
        </div>
      </footer>
    </div>
  );
}
