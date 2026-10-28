'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LiquidGlassPanel } from '@/components/ui/LiquidGlassPanel';
import { SoundToggle } from '@/components/ui/SoundToggle';
import { sound } from '@/lib/sound/soundEffects';
import { Atom, ArrowRight, Play, Eye, Wrench } from 'lucide-react';

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
    router.push(`/lab/DEMO-26?demo=true&name=Presenter&role=observer`);
  };

  const experiences = [
    { num: '01', title: 'Shared Lobby', desc: 'Synchronous chamber for two' },
    { num: '02', title: 'Asymmetric Reactor', desc: '45-second collaborative calibration' },
    { num: '03', title: 'Synchronized Dilemma', desc: 'Instant 3-2-1 instinct reveal' },
    { num: '04', title: 'Chemistry Engine', desc: 'Deterministic telemetry analysis' },
    { num: '05', title: 'Dynamic Compound', desc: 'Unique procedural molecule synthesis' },
    { num: '06', title: 'Chemistry Card', desc: 'Collectible holographic record' },
    { num: '07', title: 'Catalytic Sparks', desc: 'Prompts born from real shared moments' },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 md:p-8 relative">
      {/* Top Navbar */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between pb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-sky-400">
            <Atom className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight text-white">
              AFFECIO
            </div>
            <div className="text-xs text-slate-400">
              Chemistry Lab
            </div>
          </div>
        </div>

        <SoundToggle />
      </header>

      {/* Hero Body */}
      <div className="flex-1 max-w-3xl w-full mx-auto flex flex-col justify-center items-center text-center space-y-8 py-6">
        {/* Apple Pill Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-medium text-slate-300">
          <span>Match</span>
          <span className="text-slate-500">→</span>
          <span>Experience</span>
          <span className="text-slate-500">→</span>
          <span>Collaborate</span>
          <span className="text-slate-500">→</span>
          <span className="text-white font-semibold">Connect</span>
        </div>

        {/* Large Headline */}
        <div className="space-y-3 max-w-2xl">
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white leading-tight">
            Don&apos;t just match. Discover your chemistry.
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Connection is something you experience together. Enter a shared virtual laboratory to solve short collaborative challenges and measure real-time affinity.
          </p>
        </div>

        {/* Action Panel */}
        <LiquidGlassPanel className="p-6 md:p-8 w-full max-w-lg text-left space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="handle-input" className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                Your Name or Handle
              </label>
              <input
                id="handle-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aria"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400/50 text-sm"
              />
            </div>

            {/* Role Selection (Apple Segmented Style) */}
            <div>
              <span id="role-select-label" className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                Starting Role
              </span>
              <div role="radiogroup" aria-labelledby="role-select-label" className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  role="radio"
                  aria-checked={selectedRole === 'observer'}
                  onClick={() => setSelectedRole('observer')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedRole === 'observer'
                      ? 'bg-sky-500/10 border-sky-500/40 text-white'
                      : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-400">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Observer</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Holds target dials</div>
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={selectedRole === 'operator'}
                  onClick={() => setSelectedRole('operator')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedRole === 'operator'
                      ? 'bg-rose-500/10 border-rose-500/40 text-white'
                      : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Operator</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Controls the sliders</div>
                </button>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={handleCreateRoom}
              className="apple-btn-primary w-full sm:flex-1"
            >
              <span>Create Chamber</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Code (e.g. LAB-482)"
                aria-label="Chamber Code to Join"
                className="w-32 px-3 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400/50 text-xs text-center uppercase"
              />
              <button
                onClick={handleJoinRoom}
                className="apple-btn-secondary !px-4 !py-2.5 !min-h-[40px] text-xs"
              >
                Join
              </button>
            </div>
          </div>

          {/* Hackathon Demo Launcher */}
          <div className="pt-4 border-t border-white/[0.08] text-center">
            <button
              onClick={handleLaunchDemo}
              className="apple-btn-tinted w-full"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Hackathon Demo Mode</span>
            </button>
            <p className="text-[11px] text-slate-400 mt-2">
              Pre-configured single-screen chamber with presenter controller and partner simulation.
            </p>
          </div>
        </LiquidGlassPanel>

        {/* 7 Experiences Overview Strip */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 w-full max-w-4xl">
          {experiences.map((exp) => (
            <div key={exp.num} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
              <div className="text-[10px] text-slate-400 font-mono">{exp.num}</div>
              <div className="text-xs font-semibold text-slate-300 mt-0.5">{exp.title}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{exp.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto text-center py-4 text-xs text-slate-500 border-t border-white/[0.06]">
        AFFECIO CHEMISTRY LAB · Team Aqua
      </footer>
    </div>
  );
}
