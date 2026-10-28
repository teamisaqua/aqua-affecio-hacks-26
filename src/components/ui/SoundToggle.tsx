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
      className="w-10 h-10 rounded-full flex items-center justify-center bg-[#2C2C2E] hover:bg-[#3A3A3C] active:bg-[#1C1C1E] border border-white/10 text-[#A1A1A6] hover:text-white transition-all duration-120"
      title={muted ? 'Unmute Audio' : 'Mute Audio'}
      aria-label={muted ? 'Unmute Audio' : 'Mute Audio'}
    >
      {muted ? (
        <VolumeX className="w-4 h-4 text-[#A1A1A6]" strokeWidth={1.75} />
      ) : (
        <Volume2 className="w-4 h-4 text-white" strokeWidth={1.75} />
      )}
    </button>
  );
};
