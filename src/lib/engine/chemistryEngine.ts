import { ChemistryScore, ExperimentTelemetry, DilemmaRecord } from '../types/chemistry';

interface EngineInput {
  reactorTimeSeconds: number;      // e.g. 21.4s
  overshoots: number;              // how many times temp or pressure flew past target
  stabilizedSeconds: number;       // total time held in target window
  dilemmaChoiceA?: string | null;
  dilemmaChoiceB?: string | null;
  dilemmaMatches?: number;         // number of matched dilemmas
  dilemmaTotal?: number;           // total dilemmas evaluated
  dilemmaHistory?: DilemmaRecord[];
  bondCompatibility?: number;      // 70 - 98
  responseLatencyDeltaMs?: number; // delta in ms between User A and User B locks
  bondElementAName?: string;
  bondElementBName?: string;
  dilemmaChoiceLabelA?: string;
  dilemmaChoiceLabelB?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function computeChemistryScore(input: EngineInput): ChemistryScore {
  const {
    reactorTimeSeconds = 21.4,
    overshoots = 0,
    dilemmaChoiceA,
    dilemmaChoiceB,
    dilemmaMatches = dilemmaChoiceA && dilemmaChoiceB && dilemmaChoiceA === dilemmaChoiceB ? 1 : 0,
    dilemmaTotal = 1,
    dilemmaHistory = [],
    bondCompatibility = 88,
    responseLatencyDeltaMs = 780,
    bondElementAName = 'Carbon',
    bondElementBName = 'Oxygen',
    dilemmaChoiceLabelA = 'Spontaneous Exploration',
    dilemmaChoiceLabelB = 'Spontaneous Exploration',
  } = input;

  // 1. CHEMICAL REASONING (25% weight)
  // Evaluates element bond valence + reactor containment hold
  const overshootDeduction = overshoots * 4;
  const rawReasoning = bondCompatibility * 0.5 + (100 - overshootDeduction) * 0.5;
  const chemicalReasoning = clamp(rawReasoning, 65, 98);
  const reasoningReason = overshoots === 0
    ? `Precision calibration held within ±3° target with 0 containment losses`
    : `Stabilized despite ${overshoots} thermal spike(s) through adaptive actuator compensation`;

  // 2. DECISION ALIGNMENT (30% weight)
  // Evaluates real dilemma consensus rate + decision latency delta
  const matchRatio = dilemmaTotal > 0 ? dilemmaMatches / dilemmaTotal : 1;
  const syncPenalty = Math.min(8, Math.floor(responseLatencyDeltaMs / 500));
  const rawAlignment = 72 + matchRatio * 24 - syncPenalty;
  const decisionAlignment = clamp(rawAlignment, 64, 96);
  const alignmentReason = dilemmaMatches === dilemmaTotal
    ? `Identical instincts across ${dilemmaMatches} of ${dilemmaTotal} decision challenges without prior discussion`
    : `Balanced dynamic: ${dilemmaMatches} of ${dilemmaTotal} consensus matches with complementary perspectives`;

  // 3. REACTION TIMING (25% weight)
  // Evaluates velocity to achieve stable equilibrium under the 45s clock
  const timeFactor = Math.max(0, reactorTimeSeconds - 14) * 1.05;
  const rawTiming = 98 - timeFactor;
  const reactionTiming = clamp(rawTiming, 66, 96);
  const timingReason = reactorTimeSeconds < 25
    ? `Rapid equilibrium achieved in ${reactorTimeSeconds.toFixed(1)}s (under 45.0s clock)`
    : `Deliberate steady convergence holding 3-second equilibrium`;

  // 4. RISK COMPATIBILITY (20% weight)
  // Evaluates reciprocal pacing and coordination balance
  const latencyBalance = Math.min(10, Math.floor(responseLatencyDeltaMs / 450));
  const rawRisk = 88 - latencyBalance + (overshoots === 0 ? 8 : 4);
  const riskCompatibility = clamp(rawRisk, 65, 95);
  const riskReason = responseLatencyDeltaMs < 1200
    ? `Tight reciprocal pacing with an average decision delta of ${responseLatencyDeltaMs}ms`
    : `Distinct pacing tolerances that balanced each other during critical flux`;

  // PROPRIETARY AFFINITY INDEX (0 to 100)
  // Weighted: 25% Reasoning + 30% Alignment + 25% Timing + 20% Risk
  const weightedAffinity =
    chemicalReasoning * 0.25 +
    decisionAlignment * 0.30 +
    reactionTiming * 0.25 +
    riskCompatibility * 0.20;

  const affinityIndex = clamp(weightedAffinity, 70, 96);

  const headline = affinityIndex >= 84
    ? 'High Collaborative Synergy'
    : affinityIndex >= 76
    ? 'Complementary Dynamic'
    : 'Distinct Polarities';

  const telemetry: ExperimentTelemetry = {
    bondSummary: `${bondElementAName} + ${bondElementBName} · ${bondCompatibility}% Resonance`,
    bondMatch: bondCompatibility >= 80,
    reactorElapsedSeconds: reactorTimeSeconds,
    reactorOvershoots: overshoots,
    dilemmaMatchCount: dilemmaMatches,
    dilemmaTotalCount: dilemmaTotal,
    dilemmaMatch: dilemmaMatches > 0,
    dilemmaHistory,
    dilemmaChoiceLabelA,
    dilemmaChoiceLabelB,
    responseLatencyDeltaMs,
  };

  return {
    overall: affinityIndex,
    affinityIndex,
    chemicalReasoning,
    decisionAlignment,
    reactionTiming,
    riskCompatibility,
    headline,
    telemetry,
    formulaExplanations: {
      reasoningReason,
      alignmentReason,
      timingReason,
      riskReason,
      syncReason: alignmentReason,
      teamworkReason: reasoningReason,
      adaptabilityReason: timingReason,
      balanceReason: riskReason,
    },
    synchronization: decisionAlignment,
    teamwork: chemicalReasoning,
    adaptability: reactionTiming,
    balance: riskCompatibility,
  };
}
