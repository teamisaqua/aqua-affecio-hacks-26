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
      className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.12] active:bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white transition-all duration-150"
      title={muted ? 'Unmute Audio' : 'Mute Audio'}
      aria-label={muted ? 'Unmute Audio' : 'Mute Audio'}
    >
      {muted ? (
        <VolumeX className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
      ) : (
        <Volume2 className="w-4 h-4 text-sky-400" strokeWidth={1.75} />
      )}
    </button>
  );
};
