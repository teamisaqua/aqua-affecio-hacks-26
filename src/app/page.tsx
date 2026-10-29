'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { InteractionField } from '@/components/chamber/InteractionField';
import { SoundToggle } from '@/components/ui/SoundToggle';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { sound } from '@/lib/sound/soundEffects';
import { ArrowRight, Compass, Sliders, Play, X, Sparkles } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<'explore' | 'control'>('explore');
  const [modalMode, setModalMode] = useState<'create' | 'join' | 'info' | null>(null);

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'LAB-';
    for (let i = 0; i < 3; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleStartExperimentDirectly = () => {
    sound.playSuccessChime();
    const code = generateRoomCode();
    router.push(`/lab/${code}?name=Alex&role=explore`);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccessChime();
    const code = generateRoomCode();
    const finalName = name.trim() || 'Alex';
    const legacyRole = selectedRole === 'explore' ? 'observer' : 'operator';
    router.push(`/lab/${code}?name=${encodeURIComponent(finalName)}&role=${legacyRole}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    sound.playSuccessChime();
    const code = roomCode.trim().toUpperCase();
    const finalName = name.trim() || 'Taylor';
    router.push(`/lab/${code}?name=${encodeURIComponent(finalName)}&role=control`);
  };

  const handleLaunchDemo = () => {
    sound.playSuccessChime();
    router.push('/lab/DEMO-26?demo=true&name=Presenter&role=explore&auto=true');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-5 sm:p-8 md:p-10 bg-[#050508] text-white relative select-none overflow-x-hidden">
      {/* Subtle Top Ambient Lighting Aura */}
      <div className="ambient-glow-top" />

      {/* Top Editorial Navigation */}
      <header className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between pb-6 border-b border-white/[0.08]">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              <span>AFFECIO</span>
            </span>
            <span className="text-white/20">/</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono tracking-wider uppercase font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Experiment</span>
            </span>
          </div>
        </div>

        {/* Minimal Navigation */}
        <nav aria-label="Main Navigation" className="hidden sm:flex items-center space-x-6 text-xs text-zinc-400 font-medium">
          <button
            onClick={() => setModalMode('info')}
            className="hover:text-white transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => handleLaunchDemo()}
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>45s Experience</span>
          </button>
          <a
            href="https://github.com/teamisaqua/aqua-affecio-hacks-26"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            About
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          <SoundToggle />
        </div>
      </header>

      {/* Main Hero & Living Interaction Field */}
      <main className="relative z-10 flex-1 max-w-3xl w-full mx-auto flex flex-col items-center justify-center text-center py-8 sm:py-12 space-y-7">
        {/* Gen-Z Expressive Discovery Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium tracking-tight shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-lavender" />
          <span>Next-Gen Social Discovery</span>
        </div>

        {/* Confident Editorial Headline */}
        <div className="space-y-3 max-w-2xl">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.035em] text-white leading-[1.04]">
            Chemistry happens <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
              between two people.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed max-w-lg mx-auto">
            Enter a live interactive chamber. Navigate real tradeoffs together in real time. Discover what your shared instincts reveal.
          </p>
        </div>

        {/* Central Visual Object: Living AFFECIO Chamber Field with Ambient Aura */}
        <div className="w-full relative max-w-2xl mx-auto my-1">
          <div className="absolute -inset-3 bg-gradient-to-r from-violet-600/10 via-blue-500/10 to-rose-500/10 blur-xl rounded-3xl opacity-50 pointer-events-none" />
          <InteractionField
            state="active"
            participantAName="You"
            participantBName="Partner"
            participantAStatus="Ready"
            participantBStatus="Waiting"
            interactive={true}
          />
        </div>

        {/* Primary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm pt-1">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8 !rounded-full shadow-[0_0_24px_rgba(255,255,255,0.18)] font-semibold"
            onClick={handleStartExperimentDirectly}
          >
            <span>Start an Experiment</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto px-7 !rounded-full !bg-white/[0.06] hover:!bg-white/[0.12] !border-white/[0.12] text-white font-medium"
            onClick={() => setModalMode('join')}
          >
            Join with Code
          </Button>
        </div>

        {/* Subtle 45-Second Demo Link */}
        <div className="pt-0.5">
          <button
            onClick={handleLaunchDemo}
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors py-1.5 px-4 rounded-full hover:bg-white/5 cursor-pointer font-medium"
          >
            <Play className="w-3.5 h-3.5 text-electric fill-electric" />
            <span>Watch the 45-second interactive preview</span>
          </button>
        </div>

        {/* Editorial Shared Discovery Preview Strip */}
        <div className="w-full pt-4 max-w-2xl border-t border-white/[0.06]">
          <div className="flex items-center justify-center gap-2 mb-3 text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-400">
            <Sparkles className="w-3 h-3 text-lavender" />
            <span>Shared Discovery Journey</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-left">
            <div className="p-3 rounded-2xl bg-[#0E0E14] border border-white/[0.06] hover:border-white/15 transition-all">
              <div className="text-[10px] font-mono text-electric font-semibold">STAGE 01</div>
              <div className="text-xs font-bold text-white mt-0.5">Element Bond</div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                Instinctive polarity and mutual element pairing.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#0E0E14] border border-white/[0.06] hover:border-white/15 transition-all">
              <div className="text-[10px] font-mono text-apple-green font-semibold">STAGE 02</div>
              <div className="text-xs font-bold text-white mt-0.5">Equilibrium</div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                Real-time thermal & pressure balance steering.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#0E0E14] border border-white/[0.06] hover:border-white/15 transition-all">
              <div className="text-[10px] font-mono text-lavender font-semibold">STAGE 03</div>
              <div className="text-xs font-bold text-white mt-0.5">Dilemmas</div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                Unfiltered tradeoff choices & value discovery.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-[#0E0E14] border border-white/[0.06] hover:border-white/15 transition-all">
              <div className="text-[10px] font-mono text-rose-soft font-semibold">LIBRARY</div>
              <div className="text-xs font-bold text-white mt-0.5">25+ Activities</div>
              <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                Battles, creative challenges & deep talks.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between pt-6 border-t border-white/[0.08] text-xs text-zinc-500">
        <span>AFFECIO · Social Chemistry Experiment</span>
        <span className="font-mono text-[11px]">v2.0 · Gen-Z Edition</span>
      </footer>

      {/* Progressive Onboarding Sheet / Modal */}
      <AnimatePresence>
        {modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md affecio-card p-6 sm:p-8 relative space-y-6 text-left border border-white/10 bg-[#0D0D12]/95 shadow-[0_24px_64px_rgba(0,0,0,0.85)] backdrop-blur-2xl !rounded-3xl"
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setModalMode(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {modalMode === 'create' ? (
                <form onSubmit={handleCreateRoom} className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-white tracking-tight">
                      Start an experiment
                    </h3>
                    <p className="text-xs text-[#9E9EA7]">
                      Choose your name and how you will participate.
                    </p>
                  </div>

                  <Input
                    label="Your name"
                    autoFocus
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex"
                  />

                  {/* Role Selector with Human Explanations */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-[#9E9EA7]">
                      Choose your role
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div
                        onClick={() => setSelectedRole('explore')}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                          selectedRole === 'explore'
                            ? 'bg-[#1C1C20] border-apple-blue ring-1 ring-apple-blue/40 text-white'
                            : 'bg-[#121215] border-white/8 text-[#9E9EA7] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                          <Compass className="w-3.5 h-3.5 text-apple-blue" />
                          <span>Explore</span>
                        </div>
                        <p className="text-[11px] text-[#9E9EA7] mt-1 leading-snug">
                          You see the target equilibrium state and guide your partner.
                        </p>
                      </div>

                      <div
                        onClick={() => setSelectedRole('control')}
                        className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                          selectedRole === 'control'
                            ? 'bg-[#1C1C20] border-apple-blue ring-1 ring-apple-blue/40 text-white'
                            : 'bg-[#121215] border-white/8 text-[#9E9EA7] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                          <Sliders className="w-3.5 h-3.5 text-apple-blue" />
                          <span>Control</span>
                        </div>
                        <p className="text-[11px] text-[#9E9EA7] mt-1 leading-snug">
                          You adjust live frequency and balance actuators.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full text-sm font-semibold"
                  >
                    <span>Enter Chamber</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              ) : modalMode === 'join' ? (
                <form onSubmit={handleJoinRoom} className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-white tracking-tight">
                      Join with code
                    </h3>
                    <p className="text-xs text-[#9E9EA7]">
                      Enter the room code shared by your partner.
                    </p>
                  </div>

                  <Input
                    label="Your name"
                    autoFocus
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Taylor"
                  />

                  <Input
                    label="Room code"
                    required
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="e.g. LAB-X42"
                    className="font-mono tracking-wider uppercase"
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full text-sm font-semibold"
                  >
                    <span>Join Experiment</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white tracking-tight">
                    How AFFECIO works
                  </h3>
                  <div className="space-y-3 text-xs text-[#9E9EA7] leading-relaxed">
                    <p>
                      Instead of static profile cards and swipes, AFFECIO lets two people discover chemistry in a live, interactive experiment.
                    </p>
                    <div className="p-3.5 rounded-2xl bg-[#141417] border border-white/6 space-y-1.5">
                      <div className="font-semibold text-white">45–90 Second Journey</div>
                      <div>1. Calibrate: impulse response</div>
                      <div>2. React: independent polarity choices</div>
                      <div>3. Collaborate: cooperative equilibrium balance</div>
                      <div>4. Dilemma: instinctive tradeoff decision</div>
                      <div>5. Affinity: mathematical compatibility index</div>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full text-xs"
                    onClick={() => setModalMode(null)}
                  >
                    Got it
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
