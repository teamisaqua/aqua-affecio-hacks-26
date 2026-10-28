export type UserRole = 'explore' | 'control' | 'observer' | 'operator';

export type ExperienceStage =
  | 'lobby'
  | 'bond'
  | 'reactor'
  | 'dilemma'
  | 'engine'
  | 'compound'
  | 'card'
  | 'conversation';

export interface Participant {
  id: string;
  name: string;
  role: UserRole;
  isReady: boolean;
}

export interface ElementItem {
  id: string;
  symbol: string;
  name: string;
  category: 'reactive' | 'stable' | 'magnetic' | 'catalytic';
  tag: string;
  color: string;
  valence: number;
}

export interface BondResult {
  elementA: ElementItem;
  elementB: ElementItem;
  bondName: string;
  bondType: 'Covalent' | 'Ionic' | 'Resonance' | 'Hydrogen Polar';
  formula: string;
  compatibility: number;
  description: string;
}

export interface BondState {
  userAChoice: string | null;
  userBChoice: string | null;
  isRevealed: boolean;
  result: BondResult | null;
}

export interface ReactorTarget {
  temp: number;        // e.g. 72 °C
  pressure: number;    // e.g. 4.2 bar
  colorName: string;   // e.g. "Equilibrium Cyan"
  colorHex: string;    // e.g. "#38bdf8"
  tolerance: number;   // e.g. 3
}

export interface ReactorState {
  currentTemp: number;
  currentPressure: number;
  catalystValve: boolean;
  isStabilized: boolean;
  stabilizedDuration: number; // in seconds, needs 3s to trigger success
  stabilityPercentage: number;
  overshootCount: number;
  elapsedSeconds: number;
  isSuccess: boolean;
}

export interface DilemmaOption {
  id: string;
  label: string;
  subtext: string;
  archetype: 'spontaneous' | 'calculated' | 'adventurous' | 'intimate';
}

export interface DilemmaScenario {
  id: string;
  prompt: string;
  context: string;
  options: [DilemmaOption, DilemmaOption, DilemmaOption, DilemmaOption];
}

export interface DilemmaState {
  scenario: DilemmaScenario;
  userAChoice: string | null;
  userBChoice: string | null;
  isLockedIn: boolean;
  isRevealed: boolean;
  isSynchronized: boolean;
  harmonyClassification: string;
}

export interface ExperimentTelemetry {
  bondSummary: string;
  bondMatch: boolean;
  reactorElapsedSeconds: number;
  reactorOvershoots: number;
  dilemmaMatch: boolean;
  dilemmaChoiceLabelA?: string;
  dilemmaChoiceLabelB?: string;
  responseLatencyDeltaMs?: number;
}

export interface ChemistryScore {
  overall: number;              // Affinity Index, e.g. 82
  affinityIndex: number;        // e.g. 82
  chemicalReasoning: number;    // e.g. 82
  decisionAlignment: number;    // e.g. 74
  reactionTiming: number;       // e.g. 91
  riskCompatibility: number;    // e.g. 68
  headline: string;             // e.g. "Your chemistry is strong."
  telemetry?: ExperimentTelemetry;
  formulaExplanations: {
    reasoningReason: string;
    alignmentReason: string;
    timingReason: string;
    riskReason: string;
    // Backwards compatibility aliases
    syncReason: string;
    teamworkReason: string;
    adaptabilityReason: string;
    balanceReason: string;
  };
  // Backwards compatibility aliases
  synchronization: number;
  teamwork: number;
  adaptability: number;
  balance: number;
}

export interface FictionalCompound {
  name: string;             // e.g. "LUMINA-KINETICS"
  formula: string;          // e.g. "Lk₇-Ψ₄"
  classification: string;   // e.g. "Exothermic Resonance Polymer"
  tagline: string;          // e.g. "High Reactivity · Rapid Consensus"
  loreDescription: string;  // AI / Deterministic generated
  colorGradient: [string, string];
  nodes: { x: number; y: number; size: number; pulseDelay: number }[];
}

export interface CatalyticMoment {
  id: string;
  triggerEvent: string;
  icebreaker: string;
  followUp: string;
  badge: string;
}

export interface SessionData {
  id: string;
  roomCode: string;
  stage: ExperienceStage;
  userA: Participant;
  userB: Participant;
  bondState?: BondState;
  reactorTarget: ReactorTarget;
  reactorState: ReactorState;
  dilemmaState: DilemmaState;
  chemistryScore: ChemistryScore | null;
  compound: FictionalCompound | null;
  catalyticMoments: CatalyticMoment[];
  demoMode: boolean;
}
