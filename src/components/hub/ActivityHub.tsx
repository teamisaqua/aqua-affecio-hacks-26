'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ACTIVITIES,
  CATEGORIES,
  ActivityDefinition,
  ActivityCategory,
  PlayStyle,
} from '@/lib/activities/registry';
import { sound } from '@/lib/sound/soundEffects';
import {
  Search,
  Filter,
  Sparkles,
  Clock,
  Users,
  Play,
  Flame,
  Award,
  Zap,
  UserCheck,
  PenTool,
  Puzzle,
  ChevronRight,
  FlaskConical,
  BarChart3,
  X,
  Radio,
  CheckCircle2,
} from 'lucide-react';

interface ActivityHubProps {
  userAName: string;
  userBName: string;
  isSimulatedPartner?: boolean;
  completedActivityIds: string[];
  onLaunchActivity: (activityId: string) => void;
  onOpenSessionSummary: () => void;
  onReturnToChamber: () => void;
}

export const ActivityHub: React.FC<ActivityHubProps> = ({
  userAName,
  userBName,
  isSimulatedPartner = false,
  completedActivityIds,
  onLaunchActivity,
  onOpenSessionSummary,
  onReturnToChamber,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlaystyle, setSelectedPlaystyle] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Icon mapping helper
  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'icebreakers':
        return <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />;
      case 'personality':
        return <UserCheck className="w-3.5 h-3.5 text-[#BF5AF2]" />;
      case 'competitive':
        return <Award className="w-3.5 h-3.5 text-[#FF9F0A]" />;
      case 'creative':
        return <PenTool className="w-3.5 h-3.5 text-[#FF453A]" />;
      case 'cooperative':
        return <Puzzle className="w-3.5 h-3.5 text-[#34C759]" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-white" />;
    }
  };

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return ACTIVITIES.filter((act) => {
      const matchCat = selectedCategory === 'all' || act.category === selectedCategory;
      const matchStyle = selectedPlaystyle === 'all' || act.playstyle === selectedPlaystyle;
      const matchSearch =
        !searchQuery.trim() ||
        act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchStyle && matchSearch;
    });
  }, [selectedCategory, selectedPlaystyle, searchQuery]);

  // Recommended next activity
  const recommendedActivity = useMemo(() => {
    const unplayed = ACTIVITIES.filter((a) => !completedActivityIds.includes(a.id));
    return unplayed[0] || ACTIVITIES[0];
  }, [completedActivityIds]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 select-none p-2 sm:p-4 md:p-6">
      {/* Refined Multiplayer Session Header */}
      <section
        aria-label="Multiplayer Session Status"
        className="p-4 sm:p-5 rounded-2xl bg-[#121216] border border-white/8 shadow-md"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#34C759] font-semibold">
                Multiplayer Session Active
              </span>
              {isSimulatedPartner && (
                <span className="text-[10px] font-mono text-[#2997FF] bg-[#2997FF]/10 px-2 py-0.5 rounded-full border border-[#2997FF]/20">
                  Simulated Partner
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {userAName} <span className="text-white/30 font-normal">·</span> {userBName}
              </h2>
              <span className="text-xs text-[#86868B] font-mono">
                ({completedActivityIds.length} of {ACTIVITIES.length} completed)
              </span>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                sound.playGlassClick();
                onReturnToChamber();
              }}
              className="px-4 py-2 rounded-full bg-[#18181D] hover:bg-[#222228] border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 flex-1 sm:flex-none transition-all cursor-pointer active:scale-95"
              title="Return to Laboratory Chamber"
            >
              <FlaskConical className="w-3.5 h-3.5 text-[#2997FF]" />
              <span>Lab Chamber</span>
            </button>

            <button
              onClick={() => {
                sound.playGlassClick();
                onOpenSessionSummary();
              }}
              className="px-4 py-2 rounded-full bg-[#18181D] hover:bg-[#222228] border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1.5 flex-1 sm:flex-none transition-all cursor-pointer active:scale-95"
              title="View Cumulative Compatibility Summary"
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#34C759]" />
              <span>Session Recap</span>
              {completedActivityIds.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#34C759] text-black text-[9px] font-bold flex items-center justify-center">
                  {completedActivityIds.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Refined Recommended Activity Section */}
      {recommendedActivity && (
        <section
          aria-label="Recommended Next Activity"
          className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#141822] via-[#121218] to-[#121216] border border-[#2997FF]/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2997FF]/15 text-[#2997FF] text-[10px] font-mono font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Featured Recommendation</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {recommendedActivity.title}
            </h3>

            <p className="text-xs text-[#86868B] leading-relaxed">
              {recommendedActivity.tagline}
            </p>

            <div className="flex items-center gap-2 pt-0.5 text-[11px] font-mono text-[#86868B]">
              <span className="px-2 py-0.5 rounded bg-white/5 text-white/70">
                {recommendedActivity.category}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> ~{recommendedActivity.estimatedMinutes} min
              </span>
              <span>·</span>
              <span className="capitalize">{recommendedActivity.playstyle}</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playSuccessChime();
              onLaunchActivity(recommendedActivity.id);
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#2997FF] hover:bg-[#2997FF]/90 active:scale-95 text-white text-xs font-semibold shadow-lg shadow-[#2997FF]/20 flex items-center justify-center gap-2 flex-shrink-0 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Together</span>
          </button>
        </section>
      )}

      {/* Refined Search & Category Filters */}
      <section aria-label="Activity Search and Filter Controls" className="space-y-3">
        {/* Search Input Bar with Clear Button */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 25+ activities, games, topics, or interaction styles..."
            className="w-full bg-[#121216] border border-white/8 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-[#86868B] outline-none focus:border-[#2997FF]/60 focus:ring-1 focus:ring-[#2997FF]/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-white transition-colors p-1"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Clean Wrapping / Responsive Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-1 text-xs">
          <button
            onClick={() => {
              sound.playGlassClick();
              setSelectedCategory('all');
            }}
            className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] whitespace-nowrap transition-all border flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-white text-black font-semibold border-white shadow-sm'
                : 'bg-[#121216] border-white/8 text-[#86868B] hover:text-white hover:border-white/15'
            }`}
          >
            <span>All Activities</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === 'all' ? 'bg-black/10 text-black' : 'bg-white/5 text-[#86868B]'
              }`}
            >
              {ACTIVITIES.length}
            </span>
          </button>

          {CATEGORIES.map((cat) => {
            const count = ACTIVITIES.filter((a) => a.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playGlassClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] whitespace-nowrap transition-all border flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black font-semibold border-white shadow-sm'
                    : 'bg-[#121216] border-white/8 text-[#86868B] hover:text-white hover:border-white/15'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-black/10 text-black' : 'bg-white/5 text-[#86868B]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Activities Grid */}
      <section aria-label="Activity Catalog" className="space-y-2">
        <div className="flex items-center justify-between text-xs text-[#86868B] px-1">
          <span>
            Showing <strong className="text-white">{filteredActivities.length}</strong> activity experience(s)
          </span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-[#2997FF] hover:underline cursor-pointer font-mono text-[11px]"
            >
              Reset Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredActivities.map((act) => {
            const isDone = completedActivityIds.includes(act.id);

            return (
              <div
                key={act.id}
                className="p-5 rounded-2xl bg-[#101014] border border-white/8 hover:border-white/20 transition-all flex flex-col justify-between min-h-[170px] group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-white/5 text-[#86868B] border border-white/5">
                      {act.category}
                    </span>

                    <div className="flex items-center gap-1.5 text-[10px] text-[#86868B] font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{act.estimatedMinutes}m</span>
                      {act.badge && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[#2997FF]/15 text-[#2997FF] font-bold">
                          {act.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-white tracking-tight group-hover:text-[#2997FF] transition-colors">
                    {act.title}
                  </h4>
                  <p className="text-xs text-[#86868B] mt-1 leading-relaxed line-clamp-2">
                    {act.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/6 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#86868B] font-mono capitalize">
                    {act.playstyle}
                  </span>

                  <button
                    onClick={() => {
                      sound.playGlassClick();
                      onLaunchActivity(act.id);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer active:scale-95 ${
                      isDone
                        ? 'bg-[#141C16] text-[#34C759] border border-[#34C759]/40 hover:bg-[#34C759] hover:text-black'
                        : 'bg-white text-black hover:bg-white/90'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-3 h-3 text-[#34C759] group-hover:text-black" />}
                    <span>{isDone ? 'Replay' : 'Play'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
