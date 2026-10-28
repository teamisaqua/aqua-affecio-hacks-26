'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LiquidGlassPanel } from '@/components/ui/LiquidGlassPanel';
import { SoundToggle } from '@/components/ui/SoundToggle';
import { sound } from '@/lib/sound/soundEffects';
import {
  Atom,
  Flame,
  Zap,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  Shield,
  Play,
  Share2,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<'observer' | 'operator'>('observer');

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
    router.push(`/lab/DEMO-26?demo=true&name=PitchDemo&role=observer`);
  };

  const features = [
    { title: '1. Liquid Glass Lobby', desc: 'Synchronous cinematic chamber for two' },
    { title: '2. Asymmetric Reactor', desc: 'Hero 45s co-op calibration challenge' },
    { title: '3. Synchronized Dilemma', desc: '3-2-1 instant instinct reveal' },
    { title: '4. Deterministic Engine', desc: 'Transparent mathematical telemetry scoring' },
    { title: '5. Dynamic Compound', desc: 'Procedural fictional molecule generation' },
    { title: '6. Chemistry Card', desc: 'Holographic collectible 3D shareable card' },
    { title: '7. Catalytic Sparks', desc: 'Icebreakers born from your actual lab moments' },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 md:p-8 relative">
      {/* Top Navbar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-lab-cyan via-purple-600 to-lab-pink p-[1px] shadow-glow-cyan">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Atom className="w-5 h-5 text-lab-cyan" />
            </div>
          </div>
          <div>
            <div className="text-sm font-black tracking-widest uppercase font-mono text-white">
              AFFECIO
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-wider">
              CHEMISTRY LAB
            </div>
          </div>
        </div>

        <SoundToggle />
      </header>

      {/* Hero Body */}
      <div className="flex-1 max-w-4xl w-full mx-auto flex flex-col justify-center items-center text-center space-y-8 py-8">
        {/* Pitch Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest uppercase text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-lab-cyan" />
          <span>Don&apos;t just match. Discover your chemistry.</span>
        </div>

        {/* Hero Headline */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Match → Experience → Collaborate → <span className="bg-gradient-to-r from-lab-cyan via-purple-300 to-lab-pink bg-clip-text text-transparent">Connect</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Connection is something two people <strong className="text-white">experience</strong> together, not something an algorithm predicts from a static photo. Enter a shared virtual lab and put your chemistry to the test.
          </p>
        </div>

        {/* Action Panel */}
        <LiquidGlassPanel className="p-6 md:p-8 w-full max-w-xl text-left space-y-6" glow="cyan">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Your Codename / Handle
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aria"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-lab-cyan/50 font-mono text-sm"
              />
            </div>

            {/* Choose Starting Role */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Starting Role Assignment
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('observer')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedRole === 'observer'
                      ? 'bg-lab-cyan/15 border-lab-cyan/50 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-mono font-bold text-lab-cyan">User A (Observer)</div>
                  <div className="text-[11px] text-slate-400 mt-1">Holds target dials</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('operator')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedRole === 'operator'
                      ? 'bg-lab-pink/15 border-lab-pink/50 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-mono font-bold text-lab-pink">User B (Operator)</div>
                  <div className="text-[11px] text-slate-400 mt-1">Controls the sliders</div>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleCreateRoom}
              className="w-full sm:flex-1 py-3.5 rounded-xl font-mono text-xs uppercase tracking-wider font-bold bg-gradient-to-r from-lab-cyan to-purple-600 text-black shadow-glow-cyan hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <span>Create Lab Chamber</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Code (e.g. LAB-482)"
                className="w-32 px-3 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-lab-cyan/50 font-mono text-xs text-center uppercase"
              />
              <button
                onClick={handleJoinRoom}
                className="px-4 py-3 rounded-xl glass-btn font-mono text-xs font-bold text-white hover:border-white/30"
              >
                Join
              </button>
            </div>
          </div>

          {/* Hackathon Quick Demo Button */}
          <div className="pt-4 border-t border-white/10 text-center">
            <button
              onClick={handleLaunchDemo}
              className="w-full py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>⚡ Launch Instant Hackathon Demo Mode (Judge Presentation)</span>
            </button>
            <p className="text-[10px] text-slate-500 font-mono mt-1.5">
              Opens pre-configured chamber with presenter controller and simulated partner actions.
            </p>
          </div>
        </LiquidGlassPanel>

        {/* 7 Experiences Feature Strip */}
        <div className="pt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 w-full max-w-5xl">
          {features.map((f, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <div className="text-[11px] font-mono font-bold text-slate-300">{f.title}</div>
              <div className="text-[9px] text-slate-500 mt-0.5">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center py-4 text-xs font-mono text-slate-500 border-t border-white/5">
        AFFECIO CHEMISTRY LAB · Built for Hackathon 2026 · teamisaqua
      </footer>
    </div>
  );
}
