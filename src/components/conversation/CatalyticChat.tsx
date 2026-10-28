'use client';

import React, { useState } from 'react';
import { LiquidGlassPanel } from '../ui/LiquidGlassPanel';
import { CatalyticMoment, UserRole } from '@/lib/types/chemistry';
import { sound } from '@/lib/sound/soundEffects';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

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
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-slate-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Shared Experience Sparks</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
          Catalytic Conversation
        </h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Topics derived directly from your actions in the lab — not arbitrary dating icebreakers.
        </p>
      </div>

      {/* 3 Experience Spark Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {moments.map((m) => (
          <LiquidGlassPanel key={m.id} className="p-4 flex flex-col justify-between" tint="none">
            <div>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-slate-300 text-[10px] font-medium uppercase tracking-wide">
                {m.badge}
              </span>

              <h4 className="text-xs font-semibold text-white mt-2.5 leading-snug">
                {m.icebreaker}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1.5 italic leading-relaxed">
                &ldquo;{m.followUp}&rdquo;
              </p>
            </div>

            <button
              onClick={() => handleUseSpark(m)}
              className="mt-4 apple-btn-secondary !min-h-[34px] !py-1 !px-3 !text-xs w-full"
            >
              <Send className="w-3 h-3 text-sky-400" />
              <span>Send as Prompt</span>
            </button>
          </LiquidGlassPanel>
        ))}
      </div>

      {/* Live Lab Chat Chamber (Apple iMessage aesthetic) */}
      <LiquidGlassPanel className="p-5 flex flex-col h-80 justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
            <span>Chat: {userAName} & {userBName}</span>
          </span>
          <span className="text-emerald-400 font-medium">● Connected</span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs space-y-1">
              <span>No messages yet.</span>
              <span>Tap a spark card above or type a message below.</span>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderRole === role;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="text-[10px] text-slate-500 mb-1">
                    {msg.senderName} · {msg.timestamp}
                  </div>
                  <div
                    className={`max-w-md px-4 py-2.5 rounded-2xl text-xs md:text-sm ${
                      isMine
                        ? 'bg-[#2997ff] text-white'
                        : 'bg-white/[0.08] text-slate-200 border border-white/[0.06]'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
          className="flex items-center gap-2 pt-3 border-t border-white/[0.08]"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Message ${role === 'observer' ? userBName : userAName}...`}
            className="flex-1 px-4 py-2.5 rounded-full bg-white/[0.05] border border-white/10 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400/50"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-[#f5f5f7] text-[#090a0f] hover:bg-white active:scale-95 transition-all flex items-center justify-center font-medium"
            aria-label="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </LiquidGlassPanel>
    </div>
  );
};
