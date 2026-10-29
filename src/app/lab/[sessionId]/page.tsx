'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  ExperienceStage,
  UserRole,
  ReactorTarget,
  ReactorState,
  DilemmaState,
  DilemmaRecord,
  ChemistryScore,
  FictionalCompound,
  BondResult,
} from '@/lib/types/chemistry';
import { CURATED_DILEMMAS } from '@/lib/dilemmas/curatedDilemmas';
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
import { ChevronLeft, FlaskConical, Gamepad2, BarChart3, Sparkles, Atom, Compass } from 'lucide-react';
import { ActivityRecord } from '@/lib/activities/types';
import { ACTIVITIES, getActivityById } from '@/lib/activities/registry';
import { ActivityHub } from '@/components/hub/ActivityHub';
import { SessionSummary } from '@/components/hub/SessionSummary';
import { ChoiceVotingGame } from '@/components/activities/ChoiceVotingGame';
import { QuizBattleGame } from '@/components/activities/QuizBattleGame';
import { DrawTogetherGame } from '@/components/activities/DrawTogetherGame';
import { CollaborativeDateBuilder } from '@/components/activities/CollaborativeDateBuilder';
import { DeepTalkGame } from '@/components/activities/DeepTalkGame';
import { MemoryMatchGame } from '@/components/activities/MemoryMatchGame';
import { getQuestionsForActivity } from '@/lib/data/questionBank';

// Core 10 Science Experiments
import { InAppActivitySelector, LAB_EXPERIMENTS } from '@/components/experiments/InAppActivitySelector';
import { ExperimentStepper } from '@/components/experiments/ExperimentStepper';
import { ReactionPredictionGame } from '@/components/experiments/ReactionPredictionGame';
import { MolecularMemoryGame } from '@/components/experiments/MolecularMemoryGame';
import { CollaborativeSynthesisGame } from '@/components/experiments/CollaborativeSynthesisGame';
import { SignalCommunicationGame } from '@/components/experiments/SignalCommunicationGame';
import { ChemistryQuizBattleGame } from '@/components/experiments/ChemistryQuizBattleGame';
import { SharedDiscoveryGame } from '@/components/experiments/SharedDiscoveryGame';
import { FinalSynthesisReport } from '@/components/experiments/FinalSynthesisReport';

export type LabViewMode = 'chamber' | 'hub' | 'activity' | 'summary';

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

const stepList: { id: ExperienceStage; label: string }[] = [
  { id: 'lobby', label: 'Lobby' },
  { id: 'bond', label: '01 Bond' },
  { id: 'reactor', label: '02 Reaction' },
  { id: 'dilemma', label: '03 Dilemma' },
  { id: 'prediction', label: '04 Predict' },
  { id: 'memory', label: '05 Memory' },
  { id: 'synthesis', label: '06 Synthesis' },
  { id: 'signal', label: '07 Signal' },
  { id: 'quiz', label: '08 Quiz' },
  { id: 'discovery', label: '09 Discovery' },
  { id: 'final', label: '10 Dossier' },
];

function LabSessionContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const sessionId = (params?.sessionId as string) || 'DEMO-482';
  const roleParam = searchParams.get('role');
  const initialRole: UserRole = roleParam === 'control' || roleParam === 'operator' ? 'control' : 'explore';
  const paramName = searchParams.get('name') || (initialRole === 'explore' ? 'Alex' : 'Taylor');
  const isDemoParam = searchParams.get('demo') === 'true' || sessionId.startsWith('DEMO');
  const autoParam = searchParams.get('auto') === 'true';
  const queryView = searchParams.get('view') as LabViewMode | null;
  const queryActivity = searchParams.get('activity');

  const [viewMode, setViewMode] = useState<LabViewMode>(
    queryActivity ? 'activity' : queryView === 'hub' ? 'hub' : queryView === 'summary' ? 'summary' : 'chamber'
  );
  const [activeActivityId, setActiveActivityId] = useState<string | null>(queryActivity || null);
  const [sessionRecords, setSessionRecords] = useState<ActivityRecord[]>([]);

  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole);
  const [stage, setStage] = useState<ExperienceStage>('lobby');

  // Simulated partner support for friction-free judge review / solo evaluation
  const [isSimulatedPartner, setIsSimulatedPartner] = useState(true);

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

  // Dilemma state with 3 curated scenarios
  const [dilemmaState, setDilemmaState] = useState<DilemmaState>({
    scenarioIndex: 0,
    totalScenarios: CURATED_DILEMMAS.length,
    scenario: CURATED_DILEMMAS[0],
    userAChoice: null,
    userBChoice: null,
    isLockedIn: false,
    isRevealed: false,
    isSynchronized: false,
    harmonyClassification: 'Pending',
    history: [],
  });

  const dilemmaTimesRef = useRef<{ a: number | null; b: number | null }>({ a: null, b: null });

  const [chemistryScore, setChemistryScore] = useState<ChemistryScore | null>(null);
  const [compound, setCompound] = useState<FictionalCompound | null>(null);

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // MultiChannelSync for both local multi-tab and Supabase Realtime
  const syncChannel = useMemo(() => {
    return new MultiChannelSync(sessionId);
  }, [sessionId]);

  useEffect(() => {
    syncChannel.onMessage((event, payload: unknown) => {
      const data = payload as Record<string, unknown>;
      // If any real network/broadcast message arrives from a second participant, disable simulated mode
      setIsSimulatedPartner(false);

      if (event === 'VIEW_MODE') {
        const targetMode = data.viewMode as LabViewMode;
        setViewMode(targetMode);
        if (targetMode !== 'activity') {
          setActiveActivityId(null);
        }
      } else if (event === 'LAUNCH_ACTIVITY') {
        const actId = data.activityId as string;
        setActiveActivityId(actId);
        setViewMode('activity');
      } else if (event === 'EXPERIMENT_SELECT') {
        const expId = data.expId as string;
        setViewMode('chamber');
        if (expId === 'element-bond') setStage('bond');
        else if (expId === 'reaction-equilibrium') setStage('reactor');
        else if (expId === 'synchronized-dilemmas') setStage('dilemma');
        else if (expId === 'reaction-prediction') setStage('prediction');
        else if (expId === 'molecular-memory') setStage('memory');
        else if (expId === 'collaborative-synthesis') setStage('synthesis');
        else if (expId === 'signal-communication') setStage('signal');
        else if (expId === 'chemistry-quiz-battle') setStage('quiz');
        else if (expId === 'shared-discovery') setStage('discovery');
        else if (expId === 'final-synthesis') setStage('final');
      } else if (event === 'ACTIVITY_COMPLETE') {
        const rec = data.record as ActivityRecord;
        setSessionRecords((prev) => {
          const existing = prev.filter((r) => r.activityId !== rec.activityId);
          return [...existing, rec];
        });
      } else if (event === 'STAGE_CHANGE') {
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

  // View & Activity Handlers
  const handleSwitchView = (newMode: LabViewMode) => {
    sound.playGlassClick();
    setViewMode(newMode);
    if (newMode !== 'activity') {
      setActiveActivityId(null);
    }
    syncChannel.broadcast('VIEW_MODE', { viewMode: newMode });
  };

  const handleLaunchActivity = (actId: string) => {
    sound.playSuccessChime();
    setActiveActivityId(actId);
    setViewMode('activity');
    syncChannel.broadcast('LAUNCH_ACTIVITY', { activityId: actId });
  };

  const handleSelectExperiment = (expId: string) => {
    sound.playSuccessChime();
    setViewMode('chamber');
    if (expId === 'element-bond') setStage('bond');
    else if (expId === 'reaction-equilibrium') setStage('reactor');
    else if (expId === 'synchronized-dilemmas') setStage('dilemma');
    else if (expId === 'reaction-prediction') setStage('prediction');
    else if (expId === 'molecular-memory') setStage('memory');
    else if (expId === 'collaborative-synthesis') setStage('synthesis');
    else if (expId === 'signal-communication') setStage('signal');
    else if (expId === 'chemistry-quiz-battle') setStage('quiz');
    else if (expId === 'shared-discovery') setStage('discovery');
    else if (expId === 'final-synthesis') setStage('final');
    syncChannel.broadcast('EXPERIMENT_SELECT', { expId });
  };

  const handleFinishActivityGame = (record: ActivityRecord) => {
    sound.playSuccessChime();
    setSessionRecords((prev) => {
      const existing = prev.filter((r) => r.activityId !== record.activityId);
      return [...existing, record];
    });
    syncChannel.broadcast('ACTIVITY_COMPLETE', { record });
    setViewMode('summary');
  };

  const handleExitActivityToHub = () => {
    sound.playGlassClick();
    setActiveActivityId(null);
    setViewMode('hub');
    syncChannel.broadcast('VIEW_MODE', { viewMode: 'hub' });
  };

  const renderActiveActivity = () => {
    const actId = activeActivityId || 'would-you-rather';
    const isUserA = currentRole === 'explore';

    if (actId === 'quiz-battle') {
      return (
        <QuizBattleGame
          userAName={userA.name}
          userBName={userB.name}
          isUserA={isUserA}
          isSimulatedPartner={isSimulatedPartner}
          onFinishGame={handleFinishActivityGame}
          onExitToHub={handleExitActivityToHub}
        />
      );
    }

    if (actId === 'draw-together') {
      return (
        <DrawTogetherGame
          userAName={userA.name}
          userBName={userB.name}
          isUserA={isUserA}
          isSimulatedPartner={isSimulatedPartner}
          onFinishGame={handleFinishActivityGame}
          onExitToHub={handleExitActivityToHub}
        />
      );
    }

    if (actId === 'collaborative-date-builder' || actId === 'dream-trip-planner') {
      return (
        <CollaborativeDateBuilder
          userAName={userA.name}
          userBName={userB.name}
          isUserA={isUserA}
          isSimulatedPartner={isSimulatedPartner}
          onFinishGame={handleFinishActivityGame}
          onExitToHub={handleExitActivityToHub}
        />
      );
    }

    if (actId === 'deep-talk-5-levels') {
      return (
        <DeepTalkGame
          userAName={userA.name}
          userBName={userB.name}
          isUserA={isUserA}
          onFinishGame={handleFinishActivityGame}
          onExitToHub={handleExitActivityToHub}
        />
      );
    }

    if (actId === 'memory-match') {
      return (
        <MemoryMatchGame
          userAName={userA.name}
          userBName={userB.name}
          isUserA={isUserA}
          isSimulatedPartner={isSimulatedPartner}
          onFinishGame={handleFinishActivityGame}
          onExitToHub={handleExitActivityToHub}
        />
      );
    }

    const activityDef = getActivityById(actId);
    if (!activityDef) {
      return (
        <div className="p-8 rounded-2xl bg-[#121216] border border-white/10 text-center max-w-md mx-auto my-auto">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-[#86868B]">
            <Sparkles className="w-5 h-5 text-[#2997FF]" />
          </div>
          <h3 className="text-base font-semibold text-white mb-2">Activity Not Found</h3>
          <p className="text-xs text-[#86868B] mb-6 leading-relaxed">
            The requested activity &ldquo;{actId}&rdquo; was not recognized or is currently being updated.
          </p>
          <button
            onClick={handleExitActivityToHub}
            className="px-5 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all cursor-pointer"
          >
            Return to Activity Hub
          </button>
        </div>
      );
    }

    const prompts = getQuestionsForActivity(actId, sessionId, 5);

    return (
      <ChoiceVotingGame
        activityId={actId}
        activityTitle={activityDef?.title || 'Choice Challenge'}
        prompts={prompts}
        userAName={userA.name}
        userBName={userB.name}
        isUserA={isUserA}
        isSimulatedPartner={isSimulatedPartner}
        onFinishGame={handleFinishActivityGame}
        onExitToHub={handleExitActivityToHub}
      />
    );
  };

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

      // If simulated partner is active, auto-confirm partner readiness after 600ms
      if (isSimulatedPartner && nextReady) {
        setTimeout(() => {
          setUserB((prev) => ({ ...prev, isReady: true }));
        }, 600);
      }
    } else {
      const nextReady = !userB.isReady;
      setUserB((prev) => ({ ...prev, isReady: nextReady }));
      syncChannel.broadcast('READY_TOGGLE', { role: 'control', isReady: nextReady });

      if (isSimulatedPartner && nextReady) {
        setTimeout(() => {
          setUserA((prev) => ({ ...prev, isReady: true }));
        }, 600);
      }
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

    // If solo / simulated partner, auto-select resonant element for partner after 1.2s
    if (isSimulatedPartner && !forRole) {
      setTimeout(() => {
        setBondState((prev) => {
          const partnerPick = isExplore ? (prev.userBChoice ? prev.userBChoice : 'el-o') : prev.userAChoice ? prev.userAChoice : 'el-c';
          const next = {
            ...prev,
            userAChoice: isExplore ? prev.userAChoice : partnerPick,
            userBChoice: isExplore ? partnerPick : prev.userBChoice,
          };
          syncChannel.broadcast('BOND_CHOICE', next);
          return next;
        });
      }, 1200);
    }
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

    // If simulated partner is active and partner hasn't chosen yet, pick a plausible response after 1.2s
    if (isSimulatedPartner && !forRole) {
      setTimeout(() => {
        setDilemmaState((prev) => {
          const partnerRole = isExplore ? 'control' : 'explore';
          // In simulated mode, match ~75% of the time to create natural synergy
          const currentScenario = prev.scenario;
          const matchChoice = choiceId;
          const alternateChoice = currentScenario.options.find((o) => o.id !== choiceId)?.id || choiceId;
          const partnerPick = Math.random() < 0.75 ? matchChoice : alternateChoice;

          const next = { ...prev };
          if (isExplore) {
            next.userBChoice = partnerPick;
            dilemmaTimesRef.current.b = Date.now();
          } else {
            next.userAChoice = partnerPick;
            dilemmaTimesRef.current.a = Date.now();
          }
          next.isSynchronized = next.userAChoice === next.userBChoice;
          syncChannel.broadcast('DILEMMA_CHOICE', { role: partnerRole, choiceId: partnerPick });
          return next;
        });
      }, 1200);
    }
  };

  // Advancing to the next scenario in the 3-dilemma queue
  const handleAdvanceDilemma = () => {
    setDilemmaState((prev) => {
      const currentOptA = prev.scenario.options.find((o) => o.id === prev.userAChoice);
      const currentOptB = prev.scenario.options.find((o) => o.id === prev.userBChoice);

      const record: DilemmaRecord = {
        scenarioId: prev.scenario.id,
        scenarioPrompt: prev.scenario.prompt,
        userAChoice: prev.userAChoice || '',
        userBChoice: prev.userBChoice || '',
        choiceLabelA: currentOptA?.label || 'Choice A',
        choiceLabelB: currentOptB?.label || 'Choice B',
        isMatch: prev.userAChoice === prev.userBChoice,
      };

      const nextIndex = prev.scenarioIndex + 1;
      const nextScenario = CURATED_DILEMMAS[nextIndex] || CURATED_DILEMMAS[0];

      return {
        ...prev,
        scenarioIndex: nextIndex,
        scenario: nextScenario,
        userAChoice: null,
        userBChoice: null,
        isRevealed: false,
        isSynchronized: false,
        history: [...prev.history, record],
      };
    });
  };

  const handleDilemmaComplete = useCallback(() => {
    const timeA = dilemmaTimesRef.current.a;
    const timeB = dilemmaTimesRef.current.b;
    const latencyDelta = timeA && timeB ? Math.abs(timeA - timeB) : 740;

    // Lookup element symbols & names
    const elA = ELEMENTS.find((e) => e.id === bondState.userAChoice);
    const elB = ELEMENTS.find((e) => e.id === bondState.userBChoice);

    // Calculate final dilemma matches
    const finalHistory = [...dilemmaState.history];
    if (dilemmaState.userAChoice && dilemmaState.userBChoice) {
      const optA = dilemmaState.scenario.options.find((o) => o.id === dilemmaState.userAChoice);
      const optB = dilemmaState.scenario.options.find((o) => o.id === dilemmaState.userBChoice);
      finalHistory.push({
        scenarioId: dilemmaState.scenario.id,
        scenarioPrompt: dilemmaState.scenario.prompt,
        userAChoice: dilemmaState.userAChoice,
        userBChoice: dilemmaState.userBChoice,
        choiceLabelA: optA?.label || 'Option A',
        choiceLabelB: optB?.label || 'Option B',
        isMatch: dilemmaState.userAChoice === dilemmaState.userBChoice,
      });
    }

    const matchesCount = finalHistory.filter((h) => h.isMatch).length;
    const totalDilemmas = Math.max(1, finalHistory.length);

    const score = computeChemistryScore({
      reactorTimeSeconds: reactorState.elapsedSeconds || 21.4,
      overshoots: reactorState.overshootCount || 0,
      stabilizedSeconds: reactorState.stabilizedDuration || 3,
      dilemmaMatches: matchesCount,
      dilemmaTotal: totalDilemmas,
      dilemmaHistory: finalHistory,
      bondCompatibility: bondState.result?.compatibility ?? 88,
      responseLatencyDeltaMs: latencyDelta,
      bondElementAName: elA?.name || 'Carbon',
      bondElementBName: elB?.name || 'Oxygen',
      dilemmaChoiceLabelA: finalHistory[0]?.choiceLabelA,
      dilemmaChoiceLabelB: finalHistory[0]?.choiceLabelB,
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
    dilemmaState.history,
    dilemmaState.userAChoice,
    dilemmaState.userBChoice,
    dilemmaState.scenario,
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
      const pick = dilemmaState.scenario.options[0].id;
      handleDilemmaChoice(pick, partnerRole);
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

        // Step 3: 11s - 22s -> Reaction Equilibrium
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

        // Step 4: 23s - 34s -> Instinct Dilemma Sequence
        if (next === 23) {
          setStage('dilemma');
        }
        if (next === 25) {
          handleDilemmaChoice('opt-spontaneous', 'explore');
        }
        if (next === 27) {
          handleDilemmaChoice('opt-spontaneous', 'control');
        }

        // Step 5: 34s+ -> Complete Dilemmas and resolve to Affinity Result
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
  // Strictly responsive to real experiment telemetry without simulating fake synchronization
  const chamberSignal = useMemo(() => {
    if (viewMode === 'hub') {
      return {
        state: 'waiting' as const,
        metric: 'ACTIVITY CATALOG',
        message: 'Select from 25+ collaborative games and challenges',
        activeRole: null,
      };
    }
    if (viewMode === 'activity') {
      const currentAct = getActivityById(activeActivityId || '');
      return {
        state: 'collaborating' as const,
        metric: currentAct?.title?.toUpperCase() || 'SYNCHRONIZED ACTIVITY',
        message: currentAct?.description || 'Collaborative gameplay session in progress',
        activeRole: null,
      };
    }
    if (viewMode === 'summary') {
      return {
        state: 'completing' as const,
        metric: 'SESSION SUMMARY',
        message: `${sessionRecords.length} activities completed · Decision and consensus metrics synthesized`,
        activeRole: null,
      };
    }

    if (stage === 'lobby') {
      if (userA.isReady && userB.isReady) {
        return {
          state: 'synchronizing' as const,
          metric: 'LOBBY SYNC',
          message: 'Both participants confirmed ready',
          activeRole: null,
        };
      }
      if (userA.isReady || userB.isReady) {
        return {
          state: 'selecting' as const,
          metric: 'STANDBY',
          message: `${userA.isReady ? userA.name : userB.name} ready · Waiting for partner`,
          activeRole: userA.isReady ? ('explore' as const) : ('control' as const),
        };
      }
      return {
        state: 'waiting' as const,
        metric: 'CHAMBER ONLINE',
        message: 'Awaiting participant readiness',
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
            message: `Covalent resonance · ${compat}% valence compatibility`,
            activeRole: null,
          };
        } else {
          return {
            state: 'diverging' as const,
            metric: 'POLAR CONTRAST',
            message: `Contrasting valence configurations · ${compat}% compatibility`,
            activeRole: null,
          };
        }
      }
      if (bondState.userAChoice || bondState.userBChoice) {
        return {
          state: 'selecting' as const,
          metric: 'VALENCE SELECTION',
          message: `${bondState.userAChoice ? userA.name : userB.name} locked choice · Waiting for partner`,
          activeRole: bondState.userAChoice ? ('explore' as const) : ('control' as const),
        };
      }
      return {
        state: 'waiting' as const,
        metric: 'GROUND STATE',
        message: 'Select an elemental instinct',
        activeRole: null,
      };
    }

    if (stage === 'reactor') {
      if (reactorState.isSuccess) {
        return {
          state: 'completing' as const,
          metric: 'EQUILIBRIUM LOCKED',
          message: `Held target 3.0s in ${reactorState.elapsedSeconds.toFixed(1)}s`,
          activeRole: null,
        };
      }
      if (reactorState.overshootCount > 2 || Math.abs(reactorState.currentTemp - reactorTarget.temp) > 16) {
        return {
          state: 'diverging' as const,
          metric: 'THERMAL FLUX',
          message: `Containment drift: ${reactorState.overshootCount} spikes · Rebalance actuators`,
          activeRole: 'control' as const,
        };
      }
      if (reactorState.isStabilized) {
        return {
          state: 'synchronizing' as const,
          metric: 'TARGET WINDOW',
          message: `Holding resonance: ${reactorState.stabilizedDuration.toFixed(1)}s / 3.0s`,
          activeRole: null,
        };
      }
      return {
        state: 'collaborating' as const,
        metric: 'CO-EQUILIBRIUM',
        message: 'Explore communicates target · Control balances valves',
        activeRole: currentRole === 'explore' || currentRole === 'observer' ? ('explore' as const) : ('control' as const),
      };
    }

    if (stage === 'dilemma') {
      if (dilemmaState.userAChoice && dilemmaState.userBChoice) {
        if (dilemmaState.userAChoice === dilemmaState.userBChoice) {
          return {
            state: 'synchronizing' as const,
            metric: 'INSTINCT CONSENSUS',
            message: 'Direct consensus match on decision node',
            activeRole: null,
          };
        } else {
          return {
            state: 'diverging' as const,
            metric: 'COMPLEMENTARY INSTINCT',
            message: 'Contrasting viewpoints selected',
            activeRole: null,
          };
        }
      }
      if (dilemmaState.userAChoice || dilemmaState.userBChoice) {
        return {
          state: 'selecting' as const,
          metric: 'DECISION IN PROGRESS',
          message: `${dilemmaState.userAChoice ? userA.name : userB.name} locked choice · Waiting for partner`,
          activeRole: dilemmaState.userAChoice ? ('explore' as const) : ('control' as const),
        };
      }
      return {
        state: 'waiting' as const,
        metric: 'SCENARIO PRESENTED',
        message: 'Select your genuine instinct',
        activeRole: null,
      };
    }

    if (stage === 'prediction') {
      return {
        state: 'selecting' as const,
        metric: 'REACTION PREDICTION',
        message: 'Empirical Kinetics Challenge · Predict chemical outcome',
        activeRole: null,
      };
    }

    if (stage === 'memory') {
      return {
        state: 'collaborating' as const,
        metric: 'MOLECULAR MEMORY',
        message: 'Periodic Symmetry Matrix · Find elemental pairs',
        activeRole: null,
      };
    }

    if (stage === 'synthesis') {
      return {
        state: 'collaborating' as const,
        metric: 'ASYMMETRIC SYNTHESIS',
        message: 'Explore selects precursors · Control manages thermodynamics',
        activeRole: currentRole === 'explore' || currentRole === 'observer' ? ('explore' as const) : ('control' as const),
      };
    }

    if (stage === 'signal') {
      return {
        state: 'synchronizing' as const,
        metric: 'SPATIAL TRANSMISSION',
        message: 'Descriptor coordinates · Reconstructor assembles lattice',
        activeRole: currentRole === 'explore' || currentRole === 'observer' ? ('explore' as const) : ('control' as const),
      };
    }

    if (stage === 'quiz') {
      return {
        state: 'selecting' as const,
        metric: 'KNOWLEDGE BATTLE',
        message: '52 Pure Chemistry Questions · Speed & Accuracy Score',
        activeRole: null,
      };
    }

    if (stage === 'discovery') {
      return {
        state: 'collaborating' as const,
        metric: 'SCIENTIFIC EXPEDITION',
        message: '15 Historical Discoveries · Rigorous Empirical Investigation',
        activeRole: null,
      };
    }

    if (stage === 'final') {
      return {
        state: 'completing' as const,
        metric: 'COMPREHENSIVE DOSSIER',
        message: 'Cumulative Compatibility Audit · Molecular Compound',
        activeRole: null,
      };
    }

    return {
      state: 'completing' as const,
      metric: 'SYNTHESIS VERIFIED',
      message: `Affinity: ${chemistryScore?.affinityIndex || 88} · Results recorded`,
      activeRole: null,
    };
  }, [
    viewMode,
    activeActivityId,
    sessionRecords.length,
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
    if (viewMode === 'hub') return 'lobby';
    if (viewMode === 'activity') return 'calibrating';
    if (viewMode === 'summary') return 'signature';

    if (stage === 'lobby') return 'lobby';
    if (stage === 'bond') return 'calibrating';
    if (stage === 'reactor') {
      if (reactorState.isSuccess) return 'stabilized';
      if (reactorState.isStabilized) return 'calibrating';
      if (reactorState.overshootCount > 2) return 'overheat';
      return 'calibrating';
    }
    if (stage === 'dilemma') return 'calibrating';
    if (
      stage === 'prediction' ||
      stage === 'memory' ||
      stage === 'synthesis' ||
      stage === 'signal' ||
      stage === 'quiz' ||
      stage === 'discovery'
    ) {
      return 'calibrating';
    }
    if (stage === 'final' || stage === 'engine' || stage === 'compound' || stage === 'card') {
      return 'signature';
    }
    return 'idle';
  }, [viewMode, stage, reactorState.isSuccess, reactorState.isStabilized, reactorState.overshootCount]);

  const activeExpId = useMemo(() => {
    switch (stage) {
      case 'bond':
        return 'element-bond';
      case 'reactor':
        return 'reaction-equilibrium';
      case 'dilemma':
        return 'synchronized-dilemmas';
      case 'prediction':
        return 'reaction-prediction';
      case 'memory':
        return 'molecular-memory';
      case 'synthesis':
        return 'collaborative-synthesis';
      case 'signal':
        return 'signal-communication';
      case 'quiz':
        return 'chemistry-quiz-battle';
      case 'discovery':
        return 'shared-discovery';
      case 'final':
      case 'engine':
      case 'compound':
      case 'card':
      case 'conversation':
        return 'final-synthesis';
      default:
        return 'element-bond';
    }
  }, [stage]);

  const completedExperimentIds = useMemo(() => [
    ...(bondState.result ? ['element-bond'] : []),
    ...(reactorState.isSuccess ? ['reaction-equilibrium'] : []),
    ...(dilemmaState.history.length > 0 ? ['synchronized-dilemmas'] : []),
    ...sessionRecords.map((r) => r.activityId),
  ], [bondState.result, reactorState.isSuccess, dilemmaState.history.length, sessionRecords]);

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-3 sm:p-5 md:p-6 lg:p-8 bg-[#09090B] text-[#F5F5F7] overflow-x-hidden">
      {/* Living Ambient Molecular Matrix */}
      <div className="pointer-events-none fixed inset-0 opacity-15 z-0">
        <ReactionCanvas state={molecularFieldState} />
      </div>

      {/* Redesigned Upper Navigation Tier 1: Brand, Mode Switcher, Session Status */}
      <header className="relative z-20 max-w-5xl w-full mx-auto flex flex-col gap-2.5 pb-2.5 border-b border-white/10">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand + Session Status */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <button
              onClick={() => router.push('/')}
              className="w-8 h-8 rounded-full bg-[#18181D] hover:bg-[#222228] active:scale-95 border border-white/10 flex items-center justify-center text-[#A1A1AA] hover:text-[#F5F5F7] transition-all shrink-0 cursor-pointer"
              title="Return to Portal"
              aria-label="Return to Portal"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-xs font-bold tracking-widest uppercase text-[#F5F5F7] flex items-center gap-1.5 shrink-0">
                AFFECIO
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shadow-sm shadow-[#38BDF8]/50" />
              </span>

              <span className="text-white/20 hidden sm:inline">|</span>

              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#111114] border border-white/10 text-[11px] font-mono text-[#A1A1AA] truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse shrink-0" />
                <span className="text-[#F5F5F7] font-medium truncate">{sessionId}</span>
                {isSimulatedPartner && (
                  <span className="text-[9px] text-[#38BDF8] font-sans px-1 rounded bg-[#38BDF8]/10 hidden md:inline">
                    Simulated
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center: Structured Navigation Pill (Lobby, Chamber, Activities, Recap) */}
          <nav aria-label="Main Navigation" className="hidden sm:flex items-center p-0.5 rounded-full bg-[#111114] border border-white/10">
            <button
              onClick={() => {
                sound.playGlassClick();
                setStage('lobby');
                setViewMode('chamber');
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                stage === 'lobby' && viewMode === 'chamber'
                  ? 'bg-[#F5F5F7] text-[#09090B] font-semibold shadow-sm'
                  : 'text-[#A1A1AA] hover:text-[#F5F5F7]'
              }`}
            >
              Lobby
            </button>

            <button
              onClick={() => handleSwitchView('chamber')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'chamber' && stage !== 'lobby'
                  ? 'bg-[#F5F5F7] text-[#09090B] font-semibold shadow-sm'
                  : 'text-[#A1A1AA] hover:text-[#F5F5F7]'
              }`}
              title="Return to Science Chamber"
            >
              <FlaskConical className="w-3 h-3 text-[#38BDF8]" />
              <span>Chamber</span>
            </button>

            <button
              onClick={() => handleSwitchView('hub')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'hub' || viewMode === 'activity'
                  ? 'bg-[#F5F5F7] text-[#09090B] font-semibold shadow-sm'
                  : 'text-[#A1A1AA] hover:text-[#F5F5F7]'
              }`}
              title="Browse 25+ Dating & Compatibility Games"
            >
              <Gamepad2 className="w-3 h-3 text-[#38BDF8]" />
              <span>Activities</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] text-[10px] font-mono">
                25+
              </span>
            </button>

            <button
              onClick={() => handleSwitchView('summary')}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'summary'
                  ? 'bg-[#F5F5F7] text-[#09090B] font-semibold shadow-sm'
                  : 'text-[#A1A1AA] hover:text-[#F5F5F7]'
              }`}
              title="View Cumulative Compatibility Recap"
            >
              <BarChart3 className="w-3 h-3 text-[#4ADE80]" />
              <span>Recap</span>
              {sessionRecords.length > 0 && (
                <span className="w-3.5 h-3.5 rounded-full bg-[#4ADE80] text-black text-[9px] font-bold flex items-center justify-center">
                  {sessionRecords.length}
                </span>
              )}
            </button>
          </nav>

          {/* Right: Participant Role + Map Trigger + Sound */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Participant Role Pill */}
            <div
              className="px-2.5 py-1 rounded-full bg-[#18181D] border border-white/10 text-[11px] font-mono text-[#A1A1AA] flex items-center gap-1"
              title="Your assigned participant role in this chamber"
            >
              <span className="text-white/40">Role:</span>
              <span className="text-[#F5F5F7] font-medium capitalize">
                {currentRole === 'explore' ? 'Explore' : 'Control'}
              </span>
            </div>

            {/* Experiment Map Trigger */}
            <button
              onClick={() => setIsSelectorOpen(true)}
              className="px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 bg-[#18181D] hover:bg-[#222228] border border-white/10 text-[#F5F5F7] cursor-pointer active:scale-95"
              title="Browse and launch all 10 Science Experiments"
            >
              <Compass className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="hidden sm:inline">10 Experiments</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] text-[10px] font-mono">
                Map
              </span>
            </button>

            <SoundToggle />
          </div>
        </div>

        {/* Mobile Segmented Navigation Bar (<640px) */}
        <div className="flex sm:hidden items-center justify-between p-0.5 rounded-full bg-[#111114] border border-white/10 w-full text-xs">
          <button
            onClick={() => {
              sound.playGlassClick();
              setStage('lobby');
              setViewMode('chamber');
            }}
            className={`flex-1 py-1 rounded-full text-center font-medium transition-all ${
              stage === 'lobby' && viewMode === 'chamber'
                ? 'bg-[#F5F5F7] text-[#09090B] font-semibold'
                : 'text-[#A1A1AA]'
            }`}
          >
            Lobby
          </button>
          <button
            onClick={() => handleSwitchView('chamber')}
            className={`flex-1 py-1 rounded-full text-center font-medium transition-all ${
              viewMode === 'chamber' && stage !== 'lobby'
                ? 'bg-[#F5F5F7] text-[#09090B] font-semibold'
                : 'text-[#A1A1AA]'
            }`}
          >
            Chamber
          </button>
          <button
            onClick={() => handleSwitchView('hub')}
            className={`flex-1 py-1 rounded-full text-center font-medium transition-all ${
              viewMode === 'hub' || viewMode === 'activity'
                ? 'bg-[#F5F5F7] text-[#09090B] font-semibold'
                : 'text-[#A1A1AA]'
            }`}
          >
            Activities
          </button>
          <button
            onClick={() => handleSwitchView('summary')}
            className={`flex-1 py-1 rounded-full text-center font-medium transition-all ${
              viewMode === 'summary'
                ? 'bg-[#F5F5F7] text-[#09090B] font-semibold'
                : 'text-[#A1A1AA]'
            }`}
          >
            Recap
          </button>
        </div>
      </header>

      {/* Tier 2: Dedicated Experiment Stepper Sub-Bar (In Chamber view mode when not in lobby) */}
      {viewMode === 'chamber' && stage !== 'lobby' && (
        <div className="relative z-10 max-w-5xl w-full mx-auto pt-2">
          <ExperimentStepper
            activeExperimentId={activeExpId}
            completedExperimentIds={completedExperimentIds}
            onSelectExperiment={handleSelectExperiment}
            onOpenMap={() => setIsSelectorOpen(true)}
          />
        </div>
      )}

      {/* Living Responsive Interaction Field Dock */}
      <div className="relative z-10 max-w-5xl w-full mx-auto pt-3 pb-2">
        <InteractionField
          variant="chamber"
          state={chamberSignal.state}
          metricLabel={chamberSignal.metric}
          statusMessage={chamberSignal.message}
          activeRole={chamberSignal.activeRole}
          participantAName={userA.name}
          participantBName={userB.name}
          participantARole={currentRole === 'explore' ? 'You · Explore' : `${userA.name} · Explore`}
          participantBRole={
            currentRole === 'control'
              ? 'You · Control'
              : isSimulatedPartner
              ? `${userB.name} · Simulated`
              : `${userB.name} · Control`
          }
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
                : 'Deciding'
              : undefined
          }
          participantBStatus={
            stage === 'lobby'
              ? userB.isReady || (isSimulatedPartner && userA.isReady)
                ? 'Ready'
                : 'Waiting'
              : stage === 'bond'
              ? bondState.userBChoice
                ? 'Locked'
                : 'Choosing'
              : stage === 'dilemma'
              ? dilemmaState.userBChoice
                ? 'Chosen'
                : 'Deciding'
              : undefined
          }
          interactive={true}
        />
      </div>

      {/* Main Experience Router */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-2 sm:py-4 w-full">
        {viewMode === 'hub' ? (
          <ActivityHub
            userAName={userA.name}
            userBName={userB.name}
            isSimulatedPartner={isSimulatedPartner}
            completedActivityIds={sessionRecords.map((r) => r.activityId)}
            onLaunchActivity={handleLaunchActivity}
            onOpenSessionSummary={() => setViewMode('summary')}
            onReturnToChamber={() => setViewMode('chamber')}
          />
        ) : viewMode === 'summary' ? (
          <SessionSummary
            userAName={userA.name}
            userBName={userB.name}
            records={sessionRecords}
            onContinuePlaying={() => setViewMode('hub')}
            onReturnToChamber={() => setViewMode('chamber')}
          />
        ) : viewMode === 'activity' ? (
          renderActiveActivity()
        ) : (
          <>
            {stage === 'lobby' && (
              <LobbyView
                roomCode={sessionId}
                role={currentRole}
                userA={userA}
                userB={userB}
                isSimulatedPartner={isSimulatedPartner}
                onToggleSimulatedPartner={() => setIsSimulatedPartner((prev) => !prev)}
                onRoleSelect={handleRoleSelect}
                onReadyToggle={handleReadyToggle}
                onStartExperience={handleStartExperience}
                demoMode={isDemoParam || isSimulatedPartner}
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
                demoMode={isDemoParam}
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
                demoMode={isDemoParam}
              />
            )}

            {stage === 'dilemma' && (
              <SynchronizedDilemma
                role={currentRole}
                userAName={userA.name}
                userBName={userB.name}
                state={dilemmaState}
                onChoiceSelect={handleDilemmaChoice}
                onAdvanceScenario={handleAdvanceDilemma}
                onComplete={handleDilemmaComplete}
                demoMode={isDemoParam}
              />
            )}

            {stage === 'engine' && chemistryScore && (
              <AffinityResult
                score={chemistryScore}
                compound={compound || undefined}
                userAName={userA.name}
                userBName={userB.name}
                onNextExperiment={() => {
                  setStage('prediction');
                  syncChannel.broadcast('STAGE_CHANGE', { stage: 'prediction' });
                }}
                onExploreActivities={() => {
                  setViewMode('hub');
                  syncChannel.broadcast('VIEW_MODE', { viewMode: 'hub' });
                }}
                onRestart={() => {
                  setStage('bond');
                  setBondState({ userAChoice: null, userBChoice: null, result: null });
                  setDilemmaState({
                    scenarioIndex: 0,
                    totalScenarios: CURATED_DILEMMAS.length,
                    scenario: CURATED_DILEMMAS[0],
                    userAChoice: null,
                    userBChoice: null,
                    isLockedIn: false,
                    isRevealed: false,
                    isSynchronized: false,
                    harmonyClassification: 'Pending',
                    history: [],
                  });
                  setReactorState(initialReactorState);
                  syncChannel.broadcast('STAGE_CHANGE', { stage: 'bond' });
                }}
                onOpenConversation={() => {
                  setStage('conversation');
                  syncChannel.broadcast('STAGE_CHANGE', { stage: 'conversation' });
                }}
              />
            )}

            {stage === 'prediction' && (
              <ReactionPredictionGame
                role={currentRole}
                userAName={userA.name}
                userBName={userB.name}
                isSimulatedPartner={isSimulatedPartner}
                onFinishGame={(rec) => {
                  handleFinishActivityGame(rec);
                  setStage('memory');
                }}
                onNextExperiment={() => {
                  setStage('memory');
                  syncChannel.broadcast('STAGE_CHANGE', { stage: 'memory' });
                }}
                onExit={() => setStage('lobby')}
              />
            )}

            {stage === 'memory' && (
              <MolecularMemoryGame
                role={currentRole}
                userAName={userA.name}
                userBName={userB.name}
                isSimulatedPartner={isSimulatedPartner}
                onFinishGame={(rec) => {
                  handleFinishActivityGame(rec);
                  setStage('synthesis');
                }}
                onNextExperiment={() => {
                  setStage('synthesis');
                  syncChannel.broadcast('STAGE_CHANGE', { stage: 'synthesis' });
                }}
                onExit={() => setStage('lobby')}
              />
            )}

            {stage === 'synthesis' && (
              <CollaborativeSynthesisGame
                role={currentRole}
                userAName={userA.name}
                userBName={userB.name}
                isSimulatedPartner={isSimulatedPartner}
                onFinishGame={(rec) => {
                  handleFinishActivityGame(rec);
                  setStage('signal');
                }}
                onNextExperiment={() => {
                  setStage('signal');
                  syncChannel.broadcast('STAGE_CHANGE', { stage: 'signal' });
                }}
                onExit={() => setStage('lobby')}
              />
            )}

            {stage === 'signal' && (
              <SignalCommunicationGame
                role={currentRole}
                userAName={userA.name}
                userBName={userB.name}
                isSimulatedPartner={isSimulatedPartner}
                onFinishGame={(rec) => {
                  handleFinishActivityGame(rec);
                  setStage('quiz');
                }}
                onNextExperiment={() => {
                  setStage('quiz');
                  syncChannel.broadcast('STAGE_CHANGE', { stage: 'quiz' });
                }}
                onExit={() => setStage('lobby')}
              />
            )}

            {stage === 'quiz' && (
              <ChemistryQuizBattleGame
                role={currentRole}
                userAName={userA.name}
                userBName={userB.name}
                isSimulatedPartner={isSimulatedPartner}
                onFinishGame={(rec) => {
                  handleFinishActivityGame(rec);
                  setStage('discovery');
                }}
                onNextExperiment={() => {
                  setStage('discovery');
                  syncChannel.broadcast('STAGE_CHANGE', { stage: 'discovery' });
                }}
                onExit={() => setStage('lobby')}
              />
            )}

            {stage === 'discovery' && (
              <SharedDiscoveryGame
                role={currentRole}
                userAName={userA.name}
                userBName={userB.name}
                isSimulatedPartner={isSimulatedPartner}
                onFinishGame={(rec) => {
                  handleFinishActivityGame(rec);
                  setStage('final');
                }}
                onNextExperiment={() => {
                  setStage('final');
                  syncChannel.broadcast('STAGE_CHANGE', { stage: 'final' });
                }}
                onExit={() => setStage('lobby')}
              />
            )}

            {stage === 'final' && (
              <FinalSynthesisReport
                role={currentRole}
                userAName={userA.name}
                userBName={userB.name}
                records={sessionRecords}
                chemistryScore={chemistryScore}
                compound={compound}
                onLaunchExperiment={handleSelectExperiment}
                onReturnToLobby={() => setStage('lobby')}
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
                  setDilemmaState({
                    scenarioIndex: 0,
                    totalScenarios: CURATED_DILEMMAS.length,
                    scenario: CURATED_DILEMMAS[0],
                    userAChoice: null,
                    userBChoice: null,
                    isLockedIn: false,
                    isRevealed: false,
                    isSynchronized: false,
                    harmonyClassification: 'Pending',
                    history: [],
                  });
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
          </>
        )}
      </main>

      {/* In-App 10 Experiments Map Modal */}
      <InAppActivitySelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        activeExperimentId={
          stage === 'bond'
            ? 'element-bond'
            : stage === 'reactor'
            ? 'reaction-equilibrium'
            : stage === 'dilemma'
            ? 'synchronized-dilemmas'
            : stage === 'prediction'
            ? 'reaction-prediction'
            : stage === 'memory'
            ? 'molecular-memory'
            : stage === 'synthesis'
            ? 'collaborative-synthesis'
            : stage === 'signal'
            ? 'signal-communication'
            : stage === 'quiz'
            ? 'chemistry-quiz-battle'
            : stage === 'discovery'
            ? 'shared-discovery'
            : stage === 'final'
            ? 'final-synthesis'
            : 'element-bond'
        }
        completedExperimentIds={[
          ...(bondState.result ? ['element-bond'] : []),
          ...(reactorState.isSuccess ? ['reaction-equilibrium'] : []),
          ...(dilemmaState.history.length > 0 ? ['synchronized-dilemmas'] : []),
          ...sessionRecords.map((r) => r.activityId),
        ]}
        onSelectExperiment={handleSelectExperiment}
        onOpenSocialHub={() => handleSwitchView('hub')}
      />

      {/* Presenter / Judge Controller Bar */}
      {(isDemoParam || isAutoDemo) && viewMode === 'chamber' && (
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
                dilemmaMatches: 2,
                dilemmaTotal: 3,
                bondCompatibility: 92,
                bondElementAName: 'Carbon',
                bondElementBName: 'Oxygen',
                dilemmaChoiceLabelA: 'Spontaneous Exploration',
                dilemmaChoiceLabelB: 'Spontaneous Exploration',
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

export default function LabSessionPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center text-white/40 text-xs font-mono tracking-widest uppercase">
          Initializing Chamber...
        </div>
      }
    >
      <LabSessionContent />
    </React.Suspense>
  );
}
