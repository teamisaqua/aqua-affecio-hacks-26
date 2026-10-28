'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '@/lib/sound/soundEffects';

export const SoundToggle: React.FC = () => {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(sound.getMuted());
  }, []);

  const toggle = () => {
    const next = !muted;
    sound.setMuted(next);
    setMuted(next);
    if (!next) {
      sound.playGlassClick();
    }
  };

  return (
    <button
      onClick={toggle}
      className="p-2.5 rounded-full glass-btn text-slate-300 hover:text-white transition-colors"
      title={muted ? 'Unmute Lab Audio' : 'Mute Lab Audio'}
      aria-label="Toggle Sound"
    >
      {muted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-lab-cyan" />}
    </button>
  );
};
