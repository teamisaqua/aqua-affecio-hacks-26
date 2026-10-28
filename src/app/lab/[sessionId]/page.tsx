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
  BondResult,
} from '@/lib/types/chemistry';
import { computeChemistryScore } from '@/lib/engine/chemistryEngine';
import { generateFictionalCompound } from '@/lib/compound/compoundMatrix';
import { generateCatalyticMoments } from '@/lib/conversation/catalyticPrompts';
import { MultiChannelSync } from '@/lib/supabase/client';
import { SoundToggle } from '@/components/ui/SoundToggle';
import { LobbyView } from '@/components/lobby/LobbyView';
import { ElementBondStage } from '@/components/bond/ElementBondStage';
import { ReactorContainer } from '@/components/reactor/ReactorContainer';
import { SynchronizedDilemma } from '@/components/dilemma/SynchronizedDilemma';
import { ChemistryScoreboard } from '@/components/engine/ChemistryScoreboard';
import { CollectibleCard } from '@/components/card/CollectibleCard';
import { CatalyticChat } from '@/components/conversation/CatalyticChat';
import { DemoModeBar } from '@/components/demo/DemoModeBar';
import { ReactionCanvas, ReactionFieldState } from '@/components/molecular/ReactionCanvas';
import { sound } from '@/lib/sound/soundEffects';
import { ChevronLeft } from 'lucide-react';

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
  { id: 'bond', label: '01 Bond' },
  { id: 'reactor', label: '02 Reaction' },
  { id: 'dilemma', label: '03 Dilemma' },
  { id: 'engine', label: 'Affinity' },
  { id: 'card', label: 'Card' },
  { id: 'conversation', label: 'Sparks' },
];

export default function LabSessionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = (params?.sessionId as string) || 'DEMO-482';
  const roleParam = searchParams.get('role');
  const initialRole: UserRole = roleParam === 'control' || roleParam === 'operator' ? 'control' : 'explore';
  const paramName = searchParams.get('name') || (initialRole === 'explore' ? 'Alex' : 'Taylor');
  const isDemo = searchParams.get('demo') === 'true' || sessionId.startsWith('DEMO');
  const isAutoDemo = searchParams.get('auto') === 'true';

  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole);
  const [stage, setStage] = useState<ExperienceStage>('lobby');

  const [userA, setUserA] = useState({
    id: 'user-a',
    name: initialRole === 'explore' ? paramName : 'Alex',
    role: 'explore' as UserRole,
    isReady: false,
  });

  const [userB, setUserB] = useState({
    id: 'user-b',
    name: initialRole === 'control' ? paramName : 'Taylor',
    role: 'control' as UserRole,
    isReady: false,
  });

  const [bondState, setBondState] = useState<{
    userAChoice: string | null;
    userBChoice: string | null;
    result: BondResult | null;
  }>({
    userAChoice: null,
    userBChoice: null,
    result: null,
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
        if (data.role === 'explore' || data.role === 'observer') {
          setUserA((prev) => ({ ...prev, isReady: data.isReady as boolean }));
        } else {
          setUserB((prev) => ({ ...prev, isReady: data.isReady as boolean }));
        }
      } else if (event === 'BOND_CHOICE') {
        setBondState((prev) => ({
          ...prev,
          userAChoice: data.userAChoice as string || prev.userAChoice,
          userBChoice: data.userBChoice as string || prev.userBChoice,
        }));
      } else if (event === 'DILEMMA_CHOICE') {
        setDilemmaState((prev) => {
          const next = { ...prev };
          if (data.role === 'explore' || data.role === 'observer') next.userAChoice = data.choiceId as string;
          if (data.role === 'control' || data.role === 'operator') next.userBChoice = data.choiceId as string;
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
    const isExplore = currentRole === 'explore' || currentRole === 'observer';
    if (isExplore) {
      const nextReady = !userA.isReady;
      setUserA((prev) => ({ ...prev, isReady: nextReady }));
      syncChannel.broadcast('READY_TOGGLE', { role: 'explore', isReady: nextReady });
    } else {
      const nextReady = !userB.isReady;
      setUserB((prev) => ({ ...prev, isReady: nextReady }));
      syncChannel.broadcast('READY_TOGGLE', { role: 'control', isReady: nextReady });
    }
  };

  const handleStartExperience = () => {
    sound.playSuccessChime();
    setStage('bond');
    syncChannel.broadcast('STAGE_CHANGE', { stage: 'bond' });
  };

  const handleBondChoice = (elementId: string, forRole?: UserRole) => {
    const roleTarget = forRole || currentRole;
    const isExplore = roleTarget === 'explore' || roleTarget === 'observer';

    setBondState((prev) => {
      const next = {
        ...prev,
        userAChoice: isExplore ? elementId : prev.userAChoice,
        userBChoice: !isExplore ? elementId : prev.userBChoice,
      };
      syncChannel.broadcast('BOND_CHOICE', next);
      return next;
    });
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
    const isExplore = targetRole === 'explore' || targetRole === 'observer';

    setDilemmaState((prev) => {
      const next = { ...prev };
      if (isExplore) next.userAChoice = choiceId;
      if (!isExplore) next.userBChoice = choiceId;

      syncChannel.broadcast('DILEMMA_CHOICE', { role: isExplore ? 'explore' : 'control', choiceId });

      if (next.userAChoice && next.userBChoice) {
        next.isSynchronized = next.userAChoice === next.userBChoice;
      }
      return next;
    });
  };

  const handleDilemmaComplete = useCallback(() => {
    const score = computeChemistryScore({
      reactorTimeSeconds: reactorState.elapsedSeconds || 22,
      overshoots: reactorState.overshootCount || 0,
      stabilizedSeconds: reactorState.stabilizedDuration || 3,
      dilemmaChoiceA: dilemmaState.userAChoice,
      dilemmaChoiceB: dilemmaState.userBChoice,
      bondCompatibility: bondState.result?.compatibility || 90,
    });
    setChemistryScore(score);

    const newCompound = generateFictionalCompound({
      score,
      reactorTimeSeconds: reactorState.elapsedSeconds || 22,
      overshoots: reactorState.overshootCount || 0,
    });
    setCompound(newCompound);

    setStage('engine');
    syncChannel.broadcast('STAGE_CHANGE', { stage: 'engine' });
  }, [dilemmaState.userAChoice, dilemmaState.userBChoice, reactorState.elapsedSeconds, reactorState.overshootCount, reactorState.stabilizedDuration, bondState.result?.compatibility, syncChannel]);

  const handleSimulatePartner = () => {
    if (stage === 'lobby') {
      setUserA((prev) => ({ ...prev, isReady: true }));
      setUserB((prev) => ({ ...prev, isReady: true }));
    } else if (stage === 'bond') {
      handleBondChoice('el-o', 'control');
    } else if (stage === 'reactor') {
      setReactorState((prev) => ({
        ...prev,
        currentTemp: reactorTarget.temp,
        currentPressure: reactorTarget.pressure,
        catalystValve: true,
      }));
    } else if (stage === 'dilemma') {
      const partnerRole = currentRole === 'explore' ? 'control' : 'explore';
      handleDilemmaChoice(defaultDilemma.options[0].id, partnerRole);
    }
  };

  // Automated 90-second / 30-second Demo Tour
  useEffect(() => {
    if (!isAutoDemo) return;

    const t1 = setTimeout(() => {
      setUserA((prev) => ({ ...prev, isReady: true }));
      setUserB((prev) => ({ ...prev, isReady: true }));
      handleStartExperience();
    }, 1200);

    const t2 = setTimeout(() => {
      handleBondChoice('el-c', 'explore');
      handleBondChoice('el-o', 'control');
    }, 2800);

    const t3 = setTimeout(() => {
      setStage('reactor');
    }, 7200);

    const t4 = setTimeout(() => {
      setReactorState((prev) => ({
        ...prev,
        currentTemp: 72,
        currentPressure: 4.2,
        catalystValve: true,
      }));
    }, 9500);

    const t5 = setTimeout(() => {
      setStage('dilemma');
      handleDilemmaChoice('opt-roadtrip', 'explore');
      handleDilemmaChoice('opt-roadtrip', 'control');
    }, 13500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [isAutoDemo]);

  const catalyticMoments = useMemo(() => {
    return generateCatalyticMoments({
      reactorState,
      dilemmaState,
      userAName: userA.name,
      userBName: userB.name,
    });
  }, [reactorState, dilemmaState, userA.name, userB.name]);

  const currentStepIdx = stepList.findIndex((s) => s.id === stage);

  const molecularFieldState: ReactionFieldState = useMemo(() => {
    if (stage === 'lobby') return 'lobby';
    if (stage === 'bond') return 'calibrating';
    if (stage === 'reactor') {
      if (reactorState.isSuccess) return 'stabilized';
      if (reactorState.isStabilized) return 'calibrating';
      if (reactorState.overshootCount > 2) return 'overheat';
      return 'calibrating';
    }
    if (stage === 'dilemma') return 'calibrating';
    if (stage === 'engine' || stage === 'compound' || stage === 'card') return 'signature';
    return 'idle';
  }, [stage, reactorState.isSuccess, reactorState.isStabilized, reactorState.overshootCount]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-4 md:p-8 bg-black text-white overflow-x-hidden">
      {/* Living Ambient Molecular Matrix */}
      <div className="pointer-events-none fixed inset-0 opacity-15 z-0">
        <ReactionCanvas state={molecularFieldState} />
      </div>

      {/* Top Header & Navigation Bar */}
      <header className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between pb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push('/')}
            className="w-9 h-9 rounded-full bg-[#171717] hover:bg-[#242426] active:scale-95 border border-white/8 flex items-center justify-center text-[#A1A1A6] hover:text-white transition-all"
            title="Return to Portal"
            aria-label="Return to Portal"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
              <span>Affecio Lab</span>
              <span className="text-white/20">·</span>
              <span className="text-xs text-[#A1A1A6] font-mono">{sessionId}</span>
            </div>
            <div className="text-xs text-[#A1A1A6]">
              Role: <span className="text-white font-medium">{currentRole === 'explore' ? 'Explore' : 'Control'}</span>
            </div>
          </div>
        </div>

        {/* Step Progress Indicator */}
        <nav aria-label="Experiment Progress" className="hidden md:flex items-center space-x-1 p-1 rounded-full bg-[#111111] border border-white/8">
          {stepList.map((st, i) => (
            <div key={st.id} className="flex items-center">
              <span
                className={`text-xs px-3 py-1 rounded-full transition-all ${
                  st.id === stage
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : i < currentStepIdx
                    ? 'text-white font-medium'
                    : 'text-[#A1A1A6]'
                }`}
              >
                {st.label}
              </span>
            </div>
          ))}
        </nav>

        <div className="flex items-center space-x-2">
          <SoundToggle />
        </div>
      </header>

      {/* Main Experience Router */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-4 w-full">
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

        {stage === 'bond' && (
          <ElementBondStage
            role={currentRole}
            userAName={userA.name}
            userBName={userB.name}
            userAChoice={bondState.userAChoice}
            userBChoice={bondState.userBChoice}
            onSelectElement={(elId) => handleBondChoice(elId)}
            onComplete={(result) => {
              setBondState((prev) => ({ ...prev, result }));
              setStage('reactor');
              syncChannel.broadcast('STAGE_CHANGE', { stage: 'reactor' });
            }}
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
            onRestart={() => {
              setStage('bond');
              setBondState({ userAChoice: null, userBChoice: null, result: null });
              setDilemmaState((prev) => ({ ...prev, userAChoice: null, userBChoice: null, isRevealed: false }));
              setReactorState(initialReactorState);
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
