'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SoundToggle } from '@/components/ui/SoundToggle';
import { sound } from '@/lib/sound/soundEffects';
import { ArrowRight, Compass, Sliders, Play, X, Sparkles } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<'explore' | 'control'>('explore');
  const [modalMode, setModalMode] = useState<'create' | 'join' | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

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
    router.push(`/lab/${code}?name=${encodeURIComponent(finalName)}&role=operator`);
  };

  const handleLaunchDemo = () => {
    sound.playSuccessChime();
    router.push('/lab/DEMO-26?demo=true&name=Presenter&role=observer&auto=true');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 md:p-10 bg-black text-white relative overflow-hidden select-none">
      {/* Universal Apple Minimal Header */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#171717] border border-white/10 flex items-center justify-center text-white">
            <span className="text-sm font-semibold tracking-tighter">Af</span>
          </div>
          <span className="font-semibold text-sm tracking-tight text-white">AFFECIO</span>
        </div>

        <div className="flex items-center space-x-3">
          <SoundToggle />
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-3xl w-full mx-auto flex flex-col items-center justify-center text-center py-8 space-y-8">
        {/* Subtle pill tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171717] border border-white/10 text-xs font-medium text-[#A1A1A6]"
        >
          <Sparkles className="w-3.5 h-3.5 text-apple-blue" />
          <span>Interactive Chemistry Experience</span>
        </motion.div>

        {/* Large Typography Hero */}
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08]">
            Chemistry is better together.
          </h1>
          <p className="text-lg md:text-xl text-[#A1A1A6] font-normal leading-relaxed max-w-lg mx-auto">
            Two people. One experiment. See what happens.
          </p>
        </div>

        {/* Interactive Visual Representation: Two Participants Bonding */}
        <div
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
          onClick={() => {
            sound.playSliderTick(440);
            setIsInteracting(!isInteracting);
          }}
          className="w-full max-w-md py-6 px-8 rounded-3xl bg-[#111111] border border-white/8 flex items-center justify-between cursor-pointer relative group transition-all hover:border-white/15"
        >
          {/* Participant A Node */}
          <div className="flex flex-col items-center space-y-2 z-10">
            <motion.div
              animate={{ scale: isInteracting ? 1.08 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-14 h-14 rounded-full bg-[#1C1C1E] border border-white/15 flex items-center justify-center text-white shadow-lg"
            >
              <span className="text-xs font-semibold">You</span>
            </motion.div>
            <span className="text-[11px] text-[#A1A1A6]">Participant</span>
          </div>

          {/* Central Dynamic Reaction Bond */}
          <div className="flex-1 flex flex-col items-center px-4 relative">
            <div className="w-full h-[2px] bg-white/10 relative overflow-hidden rounded-full">
              <motion.div
                animate={{
                  x: isInteracting ? ['-100%', '100%'] : ['-50%', '50%'],
                }}
                transition={{ repeat: Infinity, duration: isInteracting ? 1.2 : 2.5, ease: 'easeInOut' }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#2997FF] to-transparent"
              />
            </div>
            <motion.div
              animate={{ scale: isInteracting ? 1.15 : 1 }}
              className="w-7 h-7 rounded-full bg-[#1C1C1E] border border-white/20 flex items-center justify-center -mt-3.5 z-10 text-apple-blue"
            >
              <span className="text-[10px] font-bold">Ψ</span>
            </motion.div>
            <span className="text-[10px] text-[#A1A1A6] mt-2 font-medium">
              {isInteracting ? 'Reaction Active' : 'Tap to interact'}
            </span>
          </div>

          {/* Participant B Node */}
          <div className="flex flex-col items-center space-y-2 z-10">
            <motion.div
              animate={{ scale: isInteracting ? 1.08 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-14 h-14 rounded-full bg-[#1C1C1E] border border-white/15 flex items-center justify-center text-white shadow-lg"
            >
              <span className="text-xs font-semibold">Partner</span>
            </motion.div>
            <span className="text-[11px] text-[#A1A1A6]">Matched</span>
          </div>
        </div>

        {/* Primary & Secondary Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm pt-2">
          <button
            onClick={() => {
              sound.playGlassClick();
              setModalMode('create');
            }}
            className="apple-btn-primary w-full sm:w-auto px-7"
          >
            <span>Start an experiment</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sound.playGlassClick();
              setModalMode('join');
            }}
            className="apple-btn-secondary w-full sm:w-auto px-7"
          >
            Join with code
          </button>
        </div>

        {/* 30-Second Demo Link */}
        <div className="pt-2">
          <button
            onClick={handleLaunchDemo}
            className="inline-flex items-center gap-2 text-xs text-[#A1A1A6] hover:text-white transition-colors"
          >
            <Play className="w-3.5 h-3.5 text-apple-blue fill-apple-blue" />
            <span>Watch a 30-second demo</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto flex items-center justify-between pt-6 text-xs text-[#A1A1A6]">
        <span>Affecio · Real-time Social Chemistry</span>
        <span>MVP 2.0</span>
      </footer>

      {/* Progressive Onboarding Sheet / Modal */}
      <AnimatePresence>
        {modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="w-full max-w-md rounded-3xl p-7 bg-[#171717] border border-white/10 shadow-2xl relative space-y-6"
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setModalMode(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#242426] text-[#A1A1A6] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {modalMode === 'create' ? (
                <form onSubmit={handleCreateRoom} className="space-y-6 text-left">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-white tracking-tight">
                      Start your experiment
                    </h3>
                    <p className="text-xs text-[#A1A1A6]">
                      Choose your name and how you want to participate.
                    </p>
                  </div>

                  {/* Step 1: Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#A1A1A6]">
                      Your name
                    </label>
                    <input
                      type="text"
                      autoFocus
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="w-full px-4 py-3 rounded-2xl bg-[#242426] border border-white/10 text-white text-sm placeholder-[#A1A1A6] focus:outline-none focus:border-apple-blue"
                    />
                  </div>

                  {/* Step 2: Role selection with Human Explanations */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-[#A1A1A6]">
                      Choose your role
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          sound.playGlassClick();
                          setSelectedRole('explore');
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          selectedRole === 'explore'
                            ? 'bg-[#242426] border-apple-blue ring-1 ring-apple-blue/40 text-white'
                            : 'bg-[#1C1C1E] border-white/8 text-[#A1A1A6] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                          <Compass className="w-3.5 h-3.5 text-apple-blue" />
                          <span>Explore</span>
                        </div>
                        <p className="text-[11px] text-[#A1A1A6] mt-1 leading-snug">
                          You see the target equilibrium recipe and guide your partner.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          sound.playGlassClick();
                          setSelectedRole('control');
                        }}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          selectedRole === 'control'
                            ? 'bg-[#242426] border-apple-blue ring-1 ring-apple-blue/40 text-white'
                            : 'bg-[#1C1C1E] border-white/8 text-[#A1A1A6] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                          <Sliders className="w-3.5 h-3.5 text-apple-blue" />
                          <span>Control</span>
                        </div>
                        <p className="text-[11px] text-[#A1A1A6] mt-1 leading-snug">
                          You adjust heat, pressure, and catalyst valves in real time.
                        </p>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="apple-btn-primary w-full py-3.5 text-sm font-semibold"
                  >
                    <span>Create Chamber</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleJoinRoom} className="space-y-6 text-left">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-white tracking-tight">
                      Join an experiment
                    </h3>
                    <p className="text-xs text-[#A1A1A6]">
                      Enter your name and the code shared by your partner.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#A1A1A6]">
                      Your name
                    </label>
                    <input
                      type="text"
                      autoFocus
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Taylor"
                      className="w-full px-4 py-3 rounded-2xl bg-[#242426] border border-white/10 text-white text-sm placeholder-[#A1A1A6] focus:outline-none focus:border-apple-blue"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#A1A1A6]">
                      Room code
                    </label>
                    <input
                      type="text"
                      required
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      placeholder="e.g. LAB-X42"
                      className="w-full px-4 py-3 rounded-2xl bg-[#242426] border border-white/10 text-white text-sm placeholder-[#A1A1A6] focus:outline-none focus:border-apple-blue tracking-wider uppercase font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="apple-btn-primary w-full py-3.5 text-sm font-semibold"
                  >
                    <span>Join Experiment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
