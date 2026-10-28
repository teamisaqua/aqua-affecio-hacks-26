'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
import { ELEMENTS } from '@/lib/compound/bondElements';
import { SoundToggle } from '@/components/ui/SoundToggle';
import { LobbyView } from '@/components/lobby/LobbyView';
import { ElementBondStage } from '@/components/bond/ElementBondStage';
import { ReactorContainer } from '@/components/reactor/ReactorContainer';
import { SynchronizedDilemma } from '@/components/dilemma/SynchronizedDilemma';
import { AffinityResult } from '@/components/results/AffinityResult';
import { CollectibleCard } from '@/components/card/CollectibleCard';
import { CatalyticChat } from '@/components/conversation/CatalyticChat';
import { DemoModeBar } from '@/components/demo/DemoModeBar';
import { InteractionField } from '@/components/chamber/InteractionField';
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
  const autoParam = searchParams.get('auto') === 'true';

  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole);
  const [stage, setStage] = useState<ExperienceStage>('lobby');

  // Automated Judge Demo state
  const [isAutoDemo, setIsAutoDemo] = useState(autoParam);
  const [isPaused, setIsPaused] = useState(false);
  const [demoSeconds, setDemoSeconds] = useState(0);

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

  // Recorded timestamps for precision telemetry calculation
  const dilemmaTimesRef = useRef<{ a: number | null; b: number | null }>({ a: null, b: null });

  const [chemistryScore, setChemistryScore] = useState<ChemistryScore | null>(null);
  const [compound, setCompound] = useState<FictionalCompound | null>(null);

  // Real-time synchronization channel (Supabase + BroadcastChannel offline fallback)
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
          userAChoice: (data.userAChoice as string) || prev.userAChoice,
          userBChoice: (data.userBChoice as string) || prev.userBChoice,
        }));
      } else if (event === 'DILEMMA_CHOICE') {
        setDilemmaState((prev) => {
          const next = { ...prev };
          if (data.role === 'explore' || data.role === 'observer') {
            next.userAChoice = data.choiceId as string;
            dilemmaTimesRef.current.a = Date.now();
          }
          if (data.role === 'control' || data.role === 'operator') {
            next.userBChoice = data.choiceId as string;
            dilemmaTimesRef.current.b = Date.now();
          }
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
      if (isExplore) {
        next.userAChoice = choiceId;
        dilemmaTimesRef.current.a = Date.now();
      }
      if (!isExplore) {
        next.userBChoice = choiceId;
        dilemmaTimesRef.current.b = Date.now();
      }

      syncChannel.broadcast('DILEMMA_CHOICE', { role: isExplore ? 'explore' : 'control', choiceId });

      if (next.userAChoice && next.userBChoice) {
        next.isSynchronized = next.userAChoice === next.userBChoice;
      }
      return next;
    });
  };

  const handleDilemmaComplete = useCallback(() => {
    const timeA = dilemmaTimesRef.current.a;
    const timeB = dilemmaTimesRef.current.b;
    const latencyDelta = timeA && timeB ? Math.abs(timeA - timeB) : 780;

    // Lookup element symbols & names
    const elA = ELEMENTS.find((e) => e.id === bondState.userAChoice);
    const elB = ELEMENTS.find((e) => e.id === bondState.userBChoice);

    // Lookup dilemma option labels
    const optA = defaultDilemma.options.find((o) => o.id === dilemmaState.userAChoice);
    const optB = defaultDilemma.options.find((o) => o.id === dilemmaState.userBChoice);

    const score = computeChemistryScore({
      reactorTimeSeconds: reactorState.elapsedSeconds || 21.4,
      overshoots: reactorState.overshootCount || 0,
      stabilizedSeconds: reactorState.stabilizedDuration || 3,
      dilemmaChoiceA: dilemmaState.userAChoice,
      dilemmaChoiceB: dilemmaState.userBChoice,
      bondCompatibility: bondState.result?.compatibility ?? 88,
      responseLatencyDeltaMs: latencyDelta,
      bondElementAName: elA?.name || 'Carbon',
      bondElementBName: elB?.name || 'Oxygen',
      dilemmaChoiceLabelA: optA?.label,
      dilemmaChoiceLabelB: optB?.label,
    });
    setChemistryScore(score);

    const newCompound = generateFictionalCompound({
      score,
      reactorTimeSeconds: reactorState.elapsedSeconds || 21.4,
      overshoots: reactorState.overshootCount || 0,
    });
    setCompound(newCompound);

    setStage('engine');
    syncChannel.broadcast('STAGE_CHANGE', { stage: 'engine' });
  }, [
    dilemmaState.userAChoice,
    dilemmaState.userBChoice,
    reactorState.elapsedSeconds,
    reactorState.overshootCount,
    reactorState.stabilizedDuration,
    bondState.result?.compatibility,
    bondState.userAChoice,
    bondState.userBChoice,
    syncChannel,
  ]);

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

  // Automated 48-Second Judge Demonstration Tour
  useEffect(() => {
    if (!isAutoDemo || isPaused) return;

    const interval = setInterval(() => {
      setDemoSeconds((prev) => {
        const next = prev + 1;

        // Step 1: 0s - 2s -> Ready up in Lobby
        if (next === 2) {
          setUserA((prev) => ({ ...prev, isReady: true }));
          setUserB((prev) => ({ ...prev, isReady: true }));
          handleStartExperience();
        }

        // Step 2: 3s - 10s -> Element Bond
        if (next === 4) {
          handleBondChoice('el-c', 'explore');
        }
        if (next === 6) {
          handleBondChoice('el-o', 'control');
        }

        // Step 3: 11s - 23s -> Reaction Equilibrium
        if (next === 11) {
          setStage('reactor');
        }
        if (next === 14) {
          setReactorState((prev) => ({
            ...prev,
            currentTemp: 72,
            currentPressure: 4.2,
            catalystValve: true,
          }));
        }

        // Step 4: 24s - 34s -> Instinct Dilemma
        if (next === 24) {
          setStage('dilemma');
        }
        if (next === 26) {
          handleDilemmaChoice('opt-roadtrip', 'explore');
        }
        if (next === 28) {
          handleDilemmaChoice('opt-roadtrip', 'control');
        }

        // Step 5: 34s+ -> Complete Dilemma and resolve to Affinity Result
        if (next === 34) {
          handleDilemmaComplete();
        }

        if (next >= 48) {
          clearInterval(interval);
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoDemo, isPaused, handleDilemmaComplete]);

  // Derived Genuine Chamber Signal State (Phase 2 & Phase 3)
  // Strictly responsive to real experiment telemetry without simulating fake synchronization!
  const chamberSignal = useMemo(() => {
    if (stage === 'lobby') {
      if (userA.isReady && userB.isReady) {
        return {
          state: 'synchronizing' as const,
          metric: 'LOBBY SYNC',
          message: 'Both nodes connected · Ready to commence',
          coherence: 90,
          activeRole: null,
        };
      }
      if (userA.isReady || userB.isReady) {
        return {
          state: 'selecting' as const,
          metric: 'STANDBY',
          message: `${userA.isReady ? userA.name : userB.name} primed · Waiting for partner`,
          coherence: 65,
          activeRole: userA.isReady ? ('explore' as const) : ('control' as const),
        };
      }
      return {
        state: 'waiting' as const,
        metric: 'CARRIER ONLINE',
        message: 'Awaiting participant lock',
        coherence: 50,
        activeRole: null,
      };
    }

    if (stage === 'bond') {
      if (bondState.userAChoice && bondState.userBChoice) {
        const compat = bondState.result?.compatibility ?? 88;
        if (compat >= 80) {
          return {
            state: 'synchronizing' as const,
            metric: 'BOND HARMONIC',
            message: `Covalent resonance · ${compat}% compatibility`,
            coherence: compat,
            activeRole: null,
          };
        } else {
          // Truthful divergence!
          return {
            state: 'diverging' as const,
            metric: 'VALENCE DIVERGENCE',
            message: `Distinct electron geometries · ${compat}% compatibility`,
            coherence: compat,
            activeRole: null,
          };
        }
      }
      if (bondState.userAChoice || bondState.userBChoice) {
        return {
          state: 'selecting' as const,
          metric: 'INSTINCT DETECTED',
          message: `${bondState.userAChoice ? userA.name : userB.name} chose element · Awaiting partner`,
          coherence: 68,
          activeRole: bondState.userAChoice ? ('explore' as const) : ('control' as const),
        };
      }
      return {
        state: 'waiting' as const,
        metric: 'GROUND STATE',
        message: 'Choose an elemental instinct',
        coherence: 50,
        activeRole: null,
      };
    }

    if (stage === 'reactor') {
      if (reactorState.isSuccess) {
        return {
          state: 'completing' as const,
          metric: 'EQUILIBRIUM LOCKED',
          message: `Held target 3.0s in ${reactorState.elapsedSeconds.toFixed(1)}s`,
          coherence: 98,
          activeRole: null,
        };
      }
      if (reactorState.overshootCount > 2 || Math.abs(reactorState.currentTemp - reactorTarget.temp) > 16) {
        // Truthful divergence when thermal drift occurs
        return {
          state: 'diverging' as const,
          metric: 'THERMAL FLUX',
          message: `Containment drift · ${reactorState.overshootCount} spikes · Rebalance valves`,
          coherence: 54,
          activeRole: 'control' as const,
        };
      }
      if (reactorState.isStabilized) {
        return {
          state: 'synchronizing' as const,
          metric: 'EQUILIBRIUM WINDOW',
          message: `Holding resonance: ${reactorState.stabilizedDuration.toFixed(1)}s / 3.0s`,
          coherence: 92,
          activeRole: null,
        };
      }
      return {
        state: 'collaborating' as const,
        metric: 'CO-EQUILIBRIUM',
        message: 'Explore communicates target · Control balances valves',
        coherence: 78,
        activeRole: currentRole === 'explore' || currentRole === 'observer' ? ('explore' as const) : ('control' as const),
      };
    }

    if (stage === 'dilemma') {
      if (dilemmaState.userAChoice && dilemmaState.userBChoice) {
        if (dilemmaState.userAChoice === dilemmaState.userBChoice) {
          return {
            state: 'synchronizing' as const,
            metric: 'INSTINCT CONSENSUS',
            message: 'Direct instinctive match on decision node',
            coherence: 96,
            activeRole: null,
          };
        } else {
          // Truthful divergence! Never fake synchronization!
          return {
            state: 'diverging' as const,
            metric: 'COMPLEMENTARY POLARITY',
            message: 'Contrasting viewpoints · Complementary instincts',
            coherence: 70,
            activeRole: null,
          };
        }
      }
      if (dilemmaState.userAChoice || dilemmaState.userBChoice) {
        return {
          state: 'selecting' as const,
          metric: 'RECORDING IMPULSE',
          message: `${dilemmaState.userAChoice ? userA.name : userB.name} locked choice · Awaiting partner`,
          coherence: 68,
          activeRole: dilemmaState.userAChoice ? ('explore' as const) : ('control' as const),
        };
      }
      return {
        state: 'waiting' as const,
        metric: 'SCENARIO PRESENTED',
        message: 'Follow genuine spontaneous intuition',
        coherence: 50,
        activeRole: null,
      };
    }

    // Payoff stage (engine, card, conversation)
    return {
      state: 'completing' as const,
      metric: 'SYNTHESIS VERIFIED',
      message: `Affinity Index: ${chemistryScore?.affinityIndex || 88} · Evidence recorded`,
      coherence: chemistryScore?.affinityIndex || 88,
      activeRole: null,
    };
  }, [
    stage,
    userA.isReady,
    userB.isReady,
    userA.name,
    userB.name,
    bondState,
    reactorState,
    reactorTarget.temp,
    dilemmaState,
    chemistryScore?.affinityIndex,
    currentRole,
  ]);

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
    <div className="relative min-h-screen flex flex-col justify-between p-3 sm:p-6 md:p-8 bg-black text-white overflow-x-hidden">
      {/* Living Ambient Molecular Matrix */}
      <div className="pointer-events-none fixed inset-0 opacity-15 z-0">
        <ReactionCanvas state={molecularFieldState} />
      </div>

      {/* Top Header & Navigation Bar */}
      <header className="relative z-10 max-w-5xl w-full mx-auto flex items-center justify-between pb-3 sm:pb-4 border-b border-white/6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push('/')}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#16161A] hover:bg-[#222228] active:scale-95 border border-white/8 flex items-center justify-center text-[#86868B] hover:text-white transition-all"
            title="Return to Portal"
            aria-label="Return to Portal"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-xs sm:text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
              <span>Affecio Lab</span>
              <span className="text-white/20">·</span>
              <span className="text-xs text-[#86868B] font-mono">{sessionId}</span>
            </div>
            <div className="text-[11px] text-[#86868B]">
              Role: <span className="text-white font-medium">{currentRole === 'explore' ? 'Explore' : 'Control'}</span>
            </div>
          </div>
        </div>

        {/* Step Progress Indicator */}
        <nav
          aria-label="Experiment Progress"
          className="hidden md:flex items-center space-x-1 p-1 rounded-full bg-[#111114] border border-white/8"
        >
          {stepList.map((st, i) => (
            <div key={st.id} className="flex items-center">
              <span
                className={`text-xs px-3 py-1 rounded-full transition-all ${
                  st.id === stage
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : i < currentStepIdx
                    ? 'text-white font-medium'
                    : 'text-[#86868B]'
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

      {/* Signature Interaction Field Anchor (Phase 2 & Phase 3) */}
      {/* Mounted persistently across stages to visually represent live participant connection */}
      <div className="relative z-10 max-w-5xl w-full mx-auto pt-3 pb-2">
        <InteractionField
          variant="chamber"
          state={chamberSignal.state}
          metricLabel={chamberSignal.metric}
          statusMessage={chamberSignal.message}
          coherence={chamberSignal.coherence}
          activeRole={chamberSignal.activeRole}
          participantAName={userA.name}
          participantBName={userB.name}
          participantARole={currentRole === 'explore' ? 'You · Explore' : `${userA.name} · Explore`}
          participantBRole={currentRole === 'control' ? 'You · Control' : `${userB.name} · Control`}
          participantAStatus={
            stage === 'lobby'
              ? userA.isReady
                ? 'Ready'
                : 'Waiting'
              : stage === 'bond'
              ? bondState.userAChoice
                ? 'Locked'
                : 'Choosing'
              : stage === 'dilemma'
              ? dilemmaState.userAChoice
                ? 'Chosen'
                : 'Thinking'
              : undefined
          }
          participantBStatus={
            stage === 'lobby'
              ? userB.isReady
                ? 'Ready'
                : 'Waiting'
              : stage === 'bond'
              ? bondState.userBChoice
                ? 'Locked'
                : 'Choosing'
              : stage === 'dilemma'
              ? dilemmaState.userBChoice
                ? 'Chosen'
                : 'Thinking'
              : undefined
          }
          interactive={true}
        />
      </div>

      {/* Main Experience Router */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-2 sm:py-4 w-full">
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
          <AffinityResult
            score={chemistryScore}
            compound={compound || undefined}
            userAName={userA.name}
            userBName={userB.name}
            onRestart={() => {
              setStage('bond');
              setBondState({ userAChoice: null, userBChoice: null, result: null });
              setDilemmaState((prev) => ({ ...prev, userAChoice: null, userBChoice: null, isRevealed: false }));
              setReactorState(initialReactorState);
              syncChannel.broadcast('STAGE_CHANGE', { stage: 'bond' });
            }}
            onOpenConversation={() => {
              setStage('conversation');
              syncChannel.broadcast('STAGE_CHANGE', { stage: 'conversation' });
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

      {/* Presenter / Judge Controller Bar */}
      {isDemo && (
        <DemoModeBar
          currentStage={stage}
          currentRole={currentRole}
          onSwitchRole={(newRole) => setCurrentRole(newRole)}
          onSkipToStage={(targetStage) => {
            if (!chemistryScore) {
              const dummyScore = computeChemistryScore({
                reactorTimeSeconds: 21.4,
                overshoots: 0,
                stabilizedSeconds: 3,
                dilemmaChoiceA: defaultDilemma.options[0].id,
                dilemmaChoiceB: defaultDilemma.options[0].id,
                bondCompatibility: 92,
                bondElementAName: 'Carbon',
                bondElementBName: 'Oxygen',
                dilemmaChoiceLabelA: 'Spontaneous Road Trip',
                dilemmaChoiceLabelB: 'Spontaneous Road Trip',
              });
              setChemistryScore(dummyScore);
              setCompound(generateFictionalCompound({ score: dummyScore, reactorTimeSeconds: 21.4, overshoots: 0 }));
            }
            setStage(targetStage);
          }}
          onSimulatePartnerAction={handleSimulatePartner}
          isAutoDemo={isAutoDemo}
          demoSeconds={demoSeconds}
          totalSeconds={48}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused((prev) => !prev)}
          onTakeControl={() => setIsAutoDemo(false)}
        />
      )}
    </div>
  );
}
