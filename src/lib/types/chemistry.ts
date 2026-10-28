export type UserRole = 'observer' | 'operator';

export type ExperienceStage =
  | 'lobby'
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

export interface ReactorTarget {
  temp: number;        // e.g. 72 °C
  pressure: number;    // e.g. 4.2 bar
  colorName: string;   // e.g. "Hyper-Cyan"
  colorHex: string;    // e.g. "#00f0ff"
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

export interface ChemistryScore {
  overall: number;       // 65 - 98
  synchronization: number;
  teamwork: number;
  adaptability: number;
  balance: number;
  formulaExplanations: {
    syncReason: string;
    teamworkReason: string;
    adaptabilityReason: string;
    balanceReason: string;
  };
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
  reactorTarget: ReactorTarget;
  reactorState: ReactorState;
  dilemmaState: DilemmaState;
  chemistryScore: ChemistryScore | null;
  compound: FictionalCompound | null;
  catalyticMoments: CatalyticMoment[];
  demoMode: boolean;
}
