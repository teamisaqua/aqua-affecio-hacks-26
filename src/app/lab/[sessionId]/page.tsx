'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ExperienceStage,
  UserRole,
  SessionData,
  ReactorTarget,
  ReactorState,
  DilemmaState,
  DilemmaScenario,
  ChemistryScore,
  FictionalCompound,
} from '@/lib/types/chemistry';
import { computeChemistryScore } from '@/lib/engine/chemistryEngine';
import { generateFictionalCompound } from '@/lib/compound/compoundMatrix';
import { generateCatalyticMoments } from '@/lib/conversation/catalyticPrompts';
import { MultiChannelSync } from '@/lib/supabase/client';
import { SoundToggle } from '@/components/ui/SoundToggle';
import { LobbyView } from '@/components/lobby/LobbyView';
import { ReactorContainer } from '@/components/reactor/ReactorContainer';
import { SynchronizedDilemma } from '@/components/dilemma/SynchronizedDilemma';
import { ChemistryScoreboard } from '@/components/engine/ChemistryScoreboard';
import { CompoundVisualizer } from '@/components/compound/CompoundVisualizer';
import { CollectibleCard } from '@/components/card/CollectibleCard';
import { CatalyticChat } from '@/components/conversation/CatalyticChat';
import { DemoModeBar } from '@/components/demo/DemoModeBar';
import { sound } from '@/lib/sound/soundEffects';
import { Atom, Shield } from 'lucide-react';

const initialTarget: ReactorTarget = {
  temp: 72,
  pressure: 4.2,
  colorName: 'Hyper-Cyan',
  colorHex: '#00f0ff',
  tolerance: 3,
};

const initialReactorState: ReactorState = {
  currentTemp: 22,
  currentPressure: 1.0,
  catalystValve: false,
  isStabilized: false,
  stabilizedDuration: 0,
  stabilityPercentage: 0,
  overshootCount: 0,
  elapsedSeconds: 0,
  isSuccess: false,
};

const defaultDilemma: DilemmaScenario = {
  id: 'dilemma-1',
  prompt: 'You suddenly have one free day and ₹5,000. What do you do?',
  context: 'Choose with pure instinct. Neither option is wrong — your chemistry is in how your polarities align.',
  options: [
    {
      id: 'opt-roadtrip',
      label: 'Spontaneous Road Trip',
      subtext: 'Tank of gas, playlist on shuffle, no map or destination.',
      archetype: 'spontaneous',
    },
    {
      id: 'opt-tasting',
      label: 'Hidden Culinary Spot',
      subtext: 'Intimate candlelit tasting menu at a secret hole-in-the-wall.',
      archetype: 'intimate',
    },
    {
      id: 'opt-project',
      label: 'Creative Gear & Build',
      subtext: 'Supplies and tools to build something bold and creative together.',
      archetype: 'calculated',
    },
    {
      id: 'opt-adrenaline',
      label: 'Adrenaline Rush',
      subtext: 'High-speed go-karting, rock climbing, or outdoor thrills.',
      archetype: 'adventurous',
    },
  ],
};

export default function LabSessionPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const sessionId = (params?.sessionId as string) || 'DEMO-482';
  const initialRole: UserRole = searchParams.get('role') === 'operator' ? 'operator' : 'observer';
  const paramName = searchParams.get('name') || (initialRole === 'observer' ? 'Aria' : 'Leo');
  const isDemo = searchParams.get('demo') === 'true' || sessionId.startsWith('DEMO');

  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole);
  const [stage, setStage] = useState<ExperienceStage>('lobby');

  const [userA, setUserA] = useState({
    id: 'user-a',
    name: initialRole === 'observer' ? paramName : 'Aria',
    role: 'observer' as UserRole,
    isReady: false,
  });

  const [userB, setUserB] = useState({
    id: 'user-b',
    name: initialRole === 'operator' ? paramName : 'Leo',
    role: 'operator' as UserRole,
    isReady: false,
  });

  const [reactorTarget] = useState<ReactorTarget>(initialTarget);
  const [reactorState, setReactorState] = useState<ReactorState>(initialReactorState);

  const [dilemmaState, setDilemmaState] = useState<DilemmaState>({
    scenario: defaultDilemma,
    userAChoice: null,
    userBChoice: null,
    isLockedIn: false,
    isRevealed: false,
    isSynchronized: false,
    harmonyClassification: 'Pending',
  });

  const [chemistryScore, setChemistryScore] = useState<ChemistryScore | null>(null);
  const [compound, setCompound] = useState<FictionalCompound | null>(null);

  // Real-time synchronization channel
  const syncChannel = useMemo(() => {
    return new MultiChannelSync(sessionId);
  }, [sessionId]);

  // Synchronize state across both browser tabs or Supabase Realtime
  useEffect(() => {
    syncChannel.onMessage((event, payload: unknown) => {
      const data = payload as Record<string, unknown>;
      if (event === 'STAGE_CHANGE') {
        setStage(data.stage as ExperienceStage);
      } else if (event === 'REACTOR_STATE') {
        setReactorState(data.reactorState as ReactorState);
      } else if (event === 'READY_TOGGLE') {
        if (data.role === 'observer') {
          setUserA((prev) => ({ ...prev, isReady: data.isReady as boolean }));
        } else {
          setUserB((prev) => ({ ...prev, isReady: data.isReady as boolean }));
        }
      } else if (event === 'DILEMMA_CHOICE') {
        setDilemmaState((prev) => {
          const next = { ...prev };
          if (data.role === 'observer') next.userAChoice = data.choiceId as string;
          if (data.role === 'operator') next.userBChoice = data.choiceId as string;
          if (next.userAChoice && next.userBChoice) {
            next.isSynchronized = next.userAChoice === next.userBChoice;
          }
          return next;
        });
      }
    });

    return () => {
      syncChannel.destroy();
    };
  }, [syncChannel]);

  // Handlers
  const handleRoleSelect = (newRole: UserRole) => {
    setCurrentRole(newRole);
  };

  const handleReadyToggle = () => {
    if (currentRole === 'observer') {
      const nextReady = !userA.isReady;
      setUserA((prev) => ({ ...prev, isReady: nextReady }));
      syncChannel.broadcast('READY_TOGGLE', { role: 'observer', isReady: nextReady });
    } else {
      const nextReady = !userB.isReady;
      setUserB((prev) => ({ ...prev, isReady: nextReady }));
      syncChannel.broadcast('READY_TOGGLE', { role: 'operator', isReady: nextReady });
    }
  };

  const handleStartExperience = () => {
    sound.playSuccessChime();
    setStage('reactor');
    syncChannel.broadcast('STAGE_CHANGE', { stage: 'reactor' });
  };

  const handleReactorUpdate = (updater: (prev: ReactorState) => ReactorState) => {
    setReactorState((prev) => {
      const next = updater(prev);
      syncChannel.broadcast('REACTOR_STATE', { reactorState: next });
      return next;
    });
  };

  const handleReactorComplete = useCallback((stats: { timeTaken: number; overshoots: number }) => {
    // Advance to Dilemma
    setStage('dilemma');
    syncChannel.broadcast('STAGE_CHANGE', { stage: 'dilemma' });
  }, [syncChannel]);

  const handleDilemmaChoice = (choiceId: string, forRole?: UserRole) => {
    const targetRole = forRole || currentRole;
    setDilemmaState((prev) => {
      const next = { ...prev };
      if (targetRole === 'observer') next.userAChoice = choiceId;
      if (targetRole === 'operator') next.userBChoice = choiceId;

      syncChannel.broadcast('DILEMMA_CHOICE', { role: targetRole, choiceId });

      if (next.userAChoice && next.userBChoice) {
        next.isSynchronized = next.userAChoice === next.userBChoice;
      }
      return next;
    });
  };

  const handleDilemmaComplete = useCallback(() => {
    // Compute deterministic chemistry score
    const score = computeChemistryScore({
      reactorTimeSeconds: reactorState.elapsedSeconds || 24,
      overshoots: reactorState.overshootCount || 0,
      stabilizedSeconds: reactorState.stabilizedDuration || 3,
      dilemmaChoiceA: dilemmaState.userAChoice,
      dilemmaChoiceB: dilemmaState.userBChoice,
    });
    setChemistryScore(score);

    // Generate fictional compound
    const newCompound = generateFictionalCompound({
      score,
      reactorTimeSeconds: reactorState.elapsedSeconds || 24,
      overshoots: reactorState.overshootCount || 0,
    });
    setCompound(newCompound);

    setStage('engine');
    syncChannel.broadcast('STAGE_CHANGE', { stage: 'engine' });
  }, [dilemmaState.userAChoice, dilemmaState.userBChoice, reactorState.elapsedSeconds, reactorState.overshootCount, reactorState.stabilizedDuration, syncChannel]);

  // Demo simulation helper for live presentation
  const handleSimulatePartner = () => {
    if (stage === 'lobby') {
      if (currentRole === 'observer') {
        setUserB((prev) => ({ ...prev, isReady: true }));
      } else {
        setUserA((prev) => ({ ...prev, isReady: true }));
      }
    } else if (stage === 'reactor') {
      // Operator simulator: adjusts sliders directly into target
      setReactorState((prev) => ({
        ...prev,
        currentTemp: reactorTarget.temp,
        currentPressure: reactorTarget.pressure,
        catalystValve: true,
      }));
    } else if (stage === 'dilemma') {
      const partnerRole = currentRole === 'observer' ? 'operator' : 'observer';
      handleDilemmaChoice(defaultDilemma.options[0].id, partnerRole);
    }
  };

  const catalyticMoments = useMemo(() => {
    return generateCatalyticMoments({
      reactorState,
      dilemmaState,
      userAName: userA.name,
      userBName: userB.name,
    });
  }, [reactorState, dilemmaState, userA.name, userB.name]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-4 md:p-8">
      {/* Top Laboratory Navigation Bar */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-lab-cyan via-purple-600 to-lab-pink p-[1px] shadow-glow-cyan">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Atom className="w-5 h-5 text-lab-cyan" />
            </div>
          </div>
          <div>
            <div className="text-sm font-black tracking-widest uppercase font-mono text-white">
              AFFECIO
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-wider">
              CHEMISTRY LAB · {sessionId}
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">
              Role: <strong className={currentRole === 'observer' ? 'text-lab-cyan' : 'text-lab-pink'}>{currentRole.toUpperCase()}</strong>
            </span>
          </div>
          <SoundToggle />
        </div>
      </header>

      {/* Main Experience Stage Router */}
      <main className="flex-1 flex items-center justify-center py-6 w-full">
        {stage === 'lobby' && (
          <LobbyView
            roomCode={sessionId}
            role={currentRole}
            userA={userA}
            userB={userB}
            onRoleSelect={handleRoleSelect}
            onReadyToggle={handleReadyToggle}
            onStartExperience={handleStartExperience}
            demoMode={isDemo}
          />
        )}

        {stage === 'reactor' && (
          <ReactorContainer
            role={currentRole}
            userAName={userA.name}
            userBName={userB.name}
            target={reactorTarget}
            state={reactorState}
            onStateUpdate={handleReactorUpdate}
            onComplete={handleReactorComplete}
            demoMode={isDemo}
          />
        )}

        {stage === 'dilemma' && (
          <SynchronizedDilemma
            role={currentRole}
            userAName={userA.name}
            userBName={userB.name}
            state={dilemmaState}
            onChoiceSelect={handleDilemmaChoice}
            onComplete={handleDilemmaComplete}
            demoMode={isDemo}
          />
        )}

        {stage === 'engine' && chemistryScore && (
          <ChemistryScoreboard
            score={chemistryScore}
            onContinue={() => {
              setStage('compound');
              syncChannel.broadcast('STAGE_CHANGE', { stage: 'compound' });
            }}
          />
        )}

        {stage === 'compound' && compound && (
          <CompoundVisualizer
            compound={compound}
            onContinue={() => {
              setStage('card');
              syncChannel.broadcast('STAGE_CHANGE', { stage: 'card' });
            }}
          />
        )}

        {stage === 'card' && chemistryScore && compound && (
          <CollectibleCard
            score={chemistryScore}
            compound={compound}
            userAName={userA.name}
            userBName={userB.name}
            onOpenConversation={() => {
              setStage('conversation');
              syncChannel.broadcast('STAGE_CHANGE', { stage: 'conversation' });
            }}
          />
        )}

        {stage === 'conversation' && (
          <CatalyticChat
            moments={catalyticMoments}
            role={currentRole}
            userAName={userA.name}
            userBName={userB.name}
          />
        )}
      </main>

      {/* Demo Controller Presenter Bar (Visible in Demo mode) */}
      {isDemo && (
        <DemoModeBar
          currentStage={stage}
          currentRole={currentRole}
          onSwitchRole={(newRole) => setCurrentRole(newRole)}
          onSkipToStage={(targetStage) => {
            if (!chemistryScore) {
              const dummyScore = computeChemistryScore({
                reactorTimeSeconds: 22,
                overshoots: 0,
                stabilizedSeconds: 3,
                dilemmaChoiceA: defaultDilemma.options[0].id,
                dilemmaChoiceB: defaultDilemma.options[0].id,
              });
              setChemistryScore(dummyScore);
              setCompound(generateFictionalCompound({ score: dummyScore, reactorTimeSeconds: 22, overshoots: 0 }));
            }
            setStage(targetStage);
          }}
          onSimulatePartnerAction={handleSimulatePartner}
        />
      )}
    </div>
  );
}
