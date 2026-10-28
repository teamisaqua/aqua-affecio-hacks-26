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
        return <Zap className="w-3.5 h-3.5 text-blue-400" />;
      case 'personality':
        return <UserCheck className="w-3.5 h-3.5 text-purple-400" />;
      case 'competitive':
        return <Award className="w-3.5 h-3.5 text-amber-400" />;
      case 'creative':
        return <PenTool className="w-3.5 h-3.5 text-rose-400" />;
      case 'cooperative':
        return <Puzzle className="w-3.5 h-3.5 text-emerald-400" />;
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
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none p-3 sm:p-6">
      {/* Top Banner: Session Status & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#111115] border border-white/8">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-[#86868B] uppercase">Multiplayer Session Active</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            {userAName} · {userBName}
          </h2>
          <div className="text-xs text-[#86868B]">
            {completedActivityIds.length} activity session(s) completed
            {isSimulatedPartner && <span className="text-blue-400 font-mono ml-2">(Simulated Partner Active)</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              sound.playGlassClick();
              onReturnToChamber();
            }}
            className="apple-btn-secondary px-3.5 py-2 text-xs font-mono flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
          >
            <FlaskConical className="w-3.5 h-3.5 text-blue-400" />
            <span>Lab Chamber</span>
          </button>

          <button
            onClick={() => {
              sound.playGlassClick();
              onOpenSessionSummary();
            }}
            className="apple-btn-secondary px-3.5 py-2 text-xs font-mono flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Session Recap</span>
          </button>
        </div>
      </div>

      {/* Featured Recommendation Card */}
      {recommendedActivity && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#181824] to-[#121218] border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[11px] font-mono font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>Recommended Next Activity</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {recommendedActivity.title}
            </h3>
            <p className="text-xs text-[#86868B] leading-relaxed">
              {recommendedActivity.tagline}. Estimated duration: {recommendedActivity.estimatedMinutes} minutes.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playSuccessChime();
              onLaunchActivity(recommendedActivity.id);
            }}
            className="apple-btn-primary px-6 py-2.5 text-xs font-semibold flex items-center gap-2 flex-shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Launch Together</span>
          </button>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activities, games, topics, or question styles..."
            className="w-full bg-[#121216] border border-white/8 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#86868B] outline-none focus:border-blue-500/50 transition-all"
          />
        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => {
              sound.playGlassClick();
              setSelectedCategory('all');
            }}
            className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] whitespace-nowrap transition-all border ${
              selectedCategory === 'all'
                ? 'bg-white text-black font-semibold border-white'
                : 'bg-[#121216] border-white/8 text-[#86868B] hover:text-white'
            }`}
          >
            All Activities ({ACTIVITIES.length})
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playGlassClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-white text-black font-semibold border-white'
                  : 'bg-[#121216] border-white/8 text-[#86868B] hover:text-white'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredActivities.map((act) => {
          const isDone = completedActivityIds.includes(act.id);

          return (
            <div
              key={act.id}
              className="p-5 rounded-2xl bg-[#101014] border border-white/8 hover:border-white/20 transition-all flex flex-col justify-between min-h-[170px] group"
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
                      <span className="px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-bold">
                        {act.badge}
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-base font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
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
                  className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                    isDone
                      ? 'apple-btn-secondary text-emerald-400 border-emerald-500/30'
                      : 'apple-btn-primary'
                  }`}
                >
                  <span>{isDone ? 'Replay' : 'Play'}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
