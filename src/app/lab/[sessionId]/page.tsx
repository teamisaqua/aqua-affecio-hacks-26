'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  ExperienceStage,
  UserRole,
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
import { Atom, ChevronLeft } from 'lucide-react';

const initialTarget: ReactorTarget = {
  temp: 72,
  pressure: 4.2,
  colorName: 'Equilibrium Cyan',
  colorHex: '#38bdf8',
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
  prompt: 'You have one free day and ₹5,000. What is your choice?',
  context: 'Follow your genuine instinct. Alignment reveals synchronicity; contrast reveals complementary balance.',
  options: [
    {
      id: 'opt-roadtrip',
      label: 'Spontaneous Road Trip',
      subtext: 'Fuel up, start the playlist, and drive without an agenda.',
      archetype: 'spontaneous',
    },
    {
      id: 'opt-tasting',
      label: 'Hidden Culinary Spot',
      subtext: 'Discover an intimate local kitchen for two.',
      archetype: 'intimate',
    },
    {
      id: 'opt-project',
      label: 'Creative Supplies & Build',
      subtext: 'Gather materials to craft a shared art or hardware build.',
      archetype: 'calculated',
    },
    {
      id: 'opt-adrenaline',
      label: 'Outdoor Adventure',
      subtext: 'High-speed karting, climbing, or outdoor thrills.',
      archetype: 'adventurous',
    },
  ],
};

const stepList: { id: ExperienceStage; label: string }[] = [
  { id: 'lobby', label: 'Lobby' },
  { id: 'reactor', label: 'Reactor' },
  { id: 'dilemma', label: 'Dilemma' },
  { id: 'engine', label: 'Analysis' },
  { id: 'compound', label: 'Compound' },
  { id: 'card', label: 'Card' },
  { id: 'conversation', label: 'Sparks' },
];

export default function LabSessionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

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

  const handleReactorComplete = useCallback(() => {
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
    const score = computeChemistryScore({
      reactorTimeSeconds: reactorState.elapsedSeconds || 24,
      overshoots: reactorState.overshootCount || 0,
      stabilizedSeconds: reactorState.stabilizedDuration || 3,
      dilemmaChoiceA: dilemmaState.userAChoice,
      dilemmaChoiceB: dilemmaState.userBChoice,
    });
    setChemistryScore(score);

    const newCompound = generateFictionalCompound({
      score,
      reactorTimeSeconds: reactorState.elapsedSeconds || 24,
      overshoots: reactorState.overshootCount || 0,
    });
    setCompound(newCompound);

    setStage('engine');
    syncChannel.broadcast('STAGE_CHANGE', { stage: 'engine' });
  }, [dilemmaState.userAChoice, dilemmaState.userBChoice, reactorState.elapsedSeconds, reactorState.overshootCount, reactorState.stabilizedDuration, syncChannel]);

  const handleSimulatePartner = () => {
    if (stage === 'lobby') {
      if (currentRole === 'observer') {
        setUserB((prev) => ({ ...prev, isReady: true }));
      } else {
        setUserA((prev) => ({ ...prev, isReady: true }));
      }
    } else if (stage === 'reactor') {
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

  const currentStepIdx = stepList.findIndex((s) => s.id === stage);

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-4 md:p-8">
      {/* Top Header & Navigation Bar */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between pb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push('/')}
            className="w-10 h-10 rounded-full bg-white/[0.06] hover:bg-white/[0.12] active:bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all"
            title="Return to Portal"
            aria-label="Return to Portal"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
              <span>Affecio Lab</span>
              <span className="text-slate-500 font-normal">·</span>
              <span className="text-xs text-slate-400 font-mono">{sessionId}</span>
            </div>
            <div className="text-xs text-slate-400">
              Role: <span className={currentRole === 'observer' ? 'text-sky-400 font-medium' : 'text-rose-400 font-medium'}>{currentRole === 'observer' ? 'Observer' : 'Operator'}</span>
            </div>
          </div>
        </div>

        {/* Apple-style Step Progress Strip */}
        <nav aria-label="Experiment Progress" className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
          {stepList.map((st, i) => (
            <div key={st.id} className="flex items-center">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full transition-colors ${
                  st.id === stage
                    ? 'bg-white text-black font-semibold'
                    : i < currentStepIdx
                    ? 'text-slate-300 font-medium'
                    : 'text-slate-500'
                }`}
              >
                {st.label}
              </span>
              {i < stepList.length - 1 && (
                <span className="text-slate-600 text-xs mx-0.5">/</span>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <SoundToggle />
        </div>
      </header>

      {/* Main Experience Router */}
      <main className="flex-1 flex items-center justify-center py-4 w-full">
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

      {/* Presenter Controller Bar */}
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
