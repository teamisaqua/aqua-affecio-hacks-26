import { ChemistryScore } from '../types/chemistry';

interface EngineInput {
  reactorTimeSeconds: number;     // e.g. 24.5s
  overshoots: number;             // how many times temp or pressure flew past target
  stabilizedSeconds: number;       // total time held in target window
  dilemmaChoiceA: string | null;
  dilemmaChoiceB: string | null;
  responseLatencyDeltaMs?: number; // delta in ms between User A and User B locks
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function computeChemistryScore(input: EngineInput): ChemistryScore {
  const {
    reactorTimeSeconds,
    overshoots,
    dilemmaChoiceA,
    dilemmaChoiceB,
    responseLatencyDeltaMs = 1200,
  } = input;

  // 1. TEAMWORK SCORE (35% weight)
  // Base 100 - penalties for time past 15s and excessive overshoots
  const timeFactor = Math.max(0, reactorTimeSeconds - 12) * 1.1;
  const overshootFactor = overshoots * 4.5;
  const rawTeamwork = 100 - timeFactor - overshootFactor;
  const teamwork = clamp(rawTeamwork, 68, 98);

  const teamworkReason = overshoots === 0
    ? `Flawless calibration in ${reactorTimeSeconds.toFixed(1)}s with zero containment breach`
    : `Recovered stability in ${reactorTimeSeconds.toFixed(1)}s despite ${overshoots} thermal spikes`;

  // 2. SYNCHRONIZATION SCORE (30% weight)
  // Agreement on dilemma gives 95; complementary gives 84; hold stability adds bonus
  const isDirectMatch = dilemmaChoiceA && dilemmaChoiceB && dilemmaChoiceA === dilemmaChoiceB;
  const rawSync = isDirectMatch ? 94 : 83;
  const syncPenalty = Math.min(10, Math.floor((responseLatencyDeltaMs) / 600));
  const synchronization = clamp(rawSync - syncPenalty, 65, 97);

  const syncReason = isDirectMatch
    ? "Synchronous instincts on the Dilemma decision node"
    : "Complementary polarity — differing viewpoints with balanced counterweights";

  // 3. ADAPTABILITY SCORE (20% weight)
  // Measures swift correction and responsiveness under 45-second clock
  const rawAdaptability = 100 - (overshoots * 3.5) - (reactorTimeSeconds > 30 ? 12 : 2);
  const adaptability = clamp(rawAdaptability, 62, 96);

  const adaptabilityReason = reactorTimeSeconds < 25
    ? "Rapid convergence: near-instant adaptation to asymmetric cues"
    : "Resilient composure under thermal load and clock constraints";

  // 4. BALANCE SCORE (15% weight)
  // Symmetry in participation and decision latency parity
  const latencyPenalty = Math.min(18, Math.floor(responseLatencyDeltaMs / 400));
  const rawBalance = 96 - latencyPenalty;
  const balance = clamp(rawBalance, 66, 95);

  const balanceReason = latencyPenalty < 6
    ? "High cadence symmetry: smooth conversational turn-taking"
    : "Dynamic tension with reciprocal steering between partners";

  // OVERALL WEIGHTED CHEMISTRY SCORE
  // Formula: 35% Teamwork + 30% Sync + 20% Adaptability + 15% Balance
  const weightedOverall =
    teamwork * 0.35 +
    synchronization * 0.30 +
    adaptability * 0.20 +
    balance * 0.15;

  const overall = clamp(weightedOverall, 68, 98);

  return {
    overall,
    synchronization,
    teamwork,
    adaptability,
    balance,
    formulaExplanations: {
      teamworkReason,
      syncReason,
      adaptabilityReason,
      balanceReason,
    },
  };
}
