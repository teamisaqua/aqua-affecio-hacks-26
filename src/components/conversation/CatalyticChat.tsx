'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LiquidGlassPanel } from '../ui/LiquidGlassPanel';
import { CatalyticMoment, UserRole } from '@/lib/types/chemistry';
import { sound } from '@/lib/sound/soundEffects';
import { MessageSquare, Send, Sparkles, Flame, Check } from 'lucide-react';

interface ChatMessage {
  id: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  timestamp: string;
}

interface CatalyticChatProps {
  moments: CatalyticMoment[];
  role: UserRole;
  userAName: string;
  userBName: string;
  onSendMessage?: (text: string) => void;
}

export const CatalyticChat: React.FC<CatalyticChatProps> = ({
  moments,
  role,
  userAName,
  userBName,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');

  const myName = role === 'observer' ? userAName : userBName;

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    sound.playGlassClick();
    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      senderRole: role,
      senderName: myName,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');
  };

  const handleUseSpark = (moment: CatalyticMoment) => {
    handleSend(`${moment.icebreaker} ${moment.followUp}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lab-pink/10 border border-lab-pink/30 text-lab-pink text-xs font-mono uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Experience-Driven Banter
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          Catalytic Conversation Sparks
        </h2>
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          Born from your actual shared moments in the reactor — not generic dating algorithms.
        </p>
      </div>

      {/* 3 Experience Spark Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {moments.map((m) => (
          <LiquidGlassPanel key={m.id} className="p-5 flex flex-col justify-between" glow="pink">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-lab-pink/15 border border-lab-pink/30 text-lab-pink text-[10px] font-mono font-bold tracking-wider uppercase">
                {m.badge}
              </span>

              <h4 className="text-sm font-semibold text-white mt-3 leading-snug">
                {m.icebreaker}
              </h4>
              <p className="text-xs text-slate-300 mt-2 italic leading-relaxed">
                &ldquo;{m.followUp}&rdquo;
              </p>
            </div>

            <button
              onClick={() => handleUseSpark(m)}
              className="mt-4 w-full py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-lab-pink" />
              <span>Send Spark to Chat</span>
            </button>
          </LiquidGlassPanel>
        ))}
      </div>

      {/* Live Lab Chat Chamber */}
      <LiquidGlassPanel className="p-5 flex flex-col h-80 justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-lab-cyan" />
            SYNTHESIS CHANNEL: {userAName} & {userBName}
          </span>
          <span className="text-emerald-400">● LIVE LINK ACTIVE</span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs font-mono space-y-1">
              <Sparkles className="w-5 h-5 text-slate-600 mb-1" />
              <span>No messages yet.</span>
              <span>Click a spark above or type below to break the ice!</span>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderRole === role;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] font-mono text-slate-500 mb-0.5">
                    {msg.senderName} · {msg.timestamp}
                  </div>
                  <div
                    className={`max-w-md px-4 py-2.5 rounded-2xl text-xs md:text-sm ${
                      isMine
                        ? 'bg-gradient-to-r from-lab-cyan/20 to-purple-600/30 border border-lab-cyan/30 text-white'
                        : 'bg-white/5 border border-white/10 text-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Chat Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="flex items-center gap-2 pt-3 border-t border-white/10"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Message ${role === 'observer' ? userBName : userAName}...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-lab-cyan/50 font-sans"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-lab-cyan text-black hover:bg-cyan-300 transition-colors font-bold flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </LiquidGlassPanel>
    </div>
  );
};
