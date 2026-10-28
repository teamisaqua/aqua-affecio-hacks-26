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
import { ArrowRight, Compass, Sliders, Play, X } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col justify-between p-6 sm:p-10 bg-black text-white relative select-none">
      {/* Top Navigation */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between pb-6 border-b border-white/6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm tracking-tight text-white">AFFECIO</span>
            <span className="text-white/20">/</span>
            <Badge variant="live">SYSTEM ONLINE</Badge>
          </div>
        </div>

        {/* Minimal Navigation */}
        <nav aria-label="Main Navigation" className="hidden sm:flex items-center space-x-6 text-xs text-[#9E9EA7]">
          <button
            onClick={() => setModalMode('info')}
            className="hover:text-white transition-colors"
          >
            How it works
          </button>
          <button
            onClick={() => handleLaunchDemo()}
            className="hover:text-white transition-colors"
          >
            45s Experiment
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
      <main className="flex-1 max-w-2xl w-full mx-auto flex flex-col items-center justify-center text-center py-10 space-y-8">
        {/* Short, Powerful Statement */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.08]">
            Chemistry happens between people.
          </h1>
          <p className="text-base sm:text-lg text-[#9E9EA7] font-normal leading-relaxed max-w-lg mx-auto">
            Enter a shared experiment. Make decisions together. Discover what your interaction reveals.
          </p>
        </div>

        {/* Central Visual Object: Living AFFECIO Chamber Field */}
        <div className="w-full">
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm pt-2">
          <Button
            variant="primary"
            size="md"
            className="w-full sm:w-auto px-7"
            onClick={() => setModalMode('create')}
          >
            <span>Start an Experiment</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            variant="secondary"
            size="md"
            className="w-full sm:w-auto px-7"
            onClick={() => setModalMode('join')}
          >
            Join with Code
          </Button>
        </div>

        {/* Subtle 45-Second Demo Link */}
        <div className="pt-1">
          <button
            onClick={handleLaunchDemo}
            className="inline-flex items-center gap-2 text-xs text-[#9E9EA7] hover:text-white transition-colors py-1 px-3 rounded-full hover:bg-white/5"
          >
            <Play className="w-3.5 h-3.5 text-apple-blue fill-apple-blue" />
            <span>Watch the 45-second experiment</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto flex items-center justify-between pt-6 border-t border-white/6 text-xs text-[#62626B]">
        <span>AFFECIO · Social Chemistry Experiment</span>
        <span>Version 2.0</span>
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
              className="w-full max-w-md affecio-card p-7 relative space-y-6 text-left"
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setModalMode(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[#1C1C20] text-[#9E9EA7] hover:text-white flex items-center justify-center transition-colors"
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
