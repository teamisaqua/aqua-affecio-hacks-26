import { ChemistryScore, ExperimentTelemetry } from '../types/chemistry';

interface EngineInput {
  reactorTimeSeconds: number;      // e.g. 24.5s
  overshoots: number;              // how many times temp or pressure flew past target
  stabilizedSeconds: number;       // total time held in target window
  dilemmaChoiceA: string | null;
  dilemmaChoiceB: string | null;
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
    reactorTimeSeconds,
    overshoots,
    dilemmaChoiceA,
    dilemmaChoiceB,
    bondCompatibility = 86,
    responseLatencyDeltaMs = 820,
    bondElementAName = 'Carbon',
    bondElementBName = 'Oxygen',
    dilemmaChoiceLabelA,
    dilemmaChoiceLabelB,
  } = input;

  // 1. CHEMICAL REASONING (25% weight)
  // Evaluates element bond harmonic resonance + chamber calibration accuracy
  const overshootDeduction = overshoots * 4;
  const rawReasoning = bondCompatibility * 0.5 + (100 - overshootDeduction) * 0.5;
  const chemicalReasoning = clamp(rawReasoning, 65, 98);
  const reasoningReason = overshoots === 0
    ? `Precision calibration held within ±3° target with zero containment loss`
    : `Stabilized despite ${overshoots} thermal spikes through adaptive correction`;

  // 2. DECISION ALIGNMENT (30% weight)
  // Evaluates dilemma consensus + cognitive instinct harmony
  const isDirectMatch = dilemmaChoiceA && dilemmaChoiceB && dilemmaChoiceA === dilemmaChoiceB;
  const syncPenalty = Math.min(10, Math.floor(responseLatencyDeltaMs / 500));
  const rawAlignment = isDirectMatch ? 94 : 80;
  const decisionAlignment = clamp(rawAlignment - syncPenalty, 64, 96);
  const alignmentReason = isDirectMatch
    ? 'Identical instinct on the Dilemma decision node without prior alignment'
    : 'Complementary viewpoints creating dynamic balance rather than friction';

  // 3. REACTION TIMING (25% weight)
  // Evaluates velocity to achieve stable equilibrium under the 45s clock
  // Fast (e.g. 15-25s) gets high score 88-96; slower gets 70-84
  const timeFactor = Math.max(0, reactorTimeSeconds - 14) * 1.1;
  const rawTiming = 98 - timeFactor;
  const reactionTiming = clamp(rawTiming, 66, 96);
  const timingReason = reactorTimeSeconds < 25
    ? `Rapid equilibrium achieved in ${reactorTimeSeconds.toFixed(1)} seconds`
    : `Calculated steady convergence holding 3-second equilibrium`;

  // 4. RISK COMPATIBILITY (20% weight)
  // Evaluates boldness under pressure, catalyst valve usage, and stability hold
  const latencyBalance = Math.min(12, Math.floor(responseLatencyDeltaMs / 450));
  const rawRisk = 90 - latencyBalance + (overshoots > 0 ? 4 : 8);
  const riskCompatibility = clamp(rawRisk, 65, 95);
  const riskReason = latencyBalance < 5
    ? `High mutual trust with reciprocal response timing (${responseLatencyDeltaMs}ms delta)`
    : `Distinct risk tolerances that balanced each other when adjusting actuators`;

  // PROPRIETARY AFFINITY INDEX (0 to 100)
  // Weighted: 25% Reasoning + 30% Alignment + 25% Timing + 20% Risk
  const weightedAffinity =
    chemicalReasoning * 0.25 +
    decisionAlignment * 0.30 +
    reactionTiming * 0.25 +
    riskCompatibility * 0.20;

  const affinityIndex = clamp(weightedAffinity, 70, 96);

  const headline = affinityIndex >= 82
    ? 'Your chemistry is strong.'
    : 'Interesting reaction.';

  const telemetry: ExperimentTelemetry = {
    bondSummary: `${bondElementAName} + ${bondElementBName} · ${bondCompatibility}% Resonance`,
    bondMatch: bondCompatibility >= 80,
    reactorElapsedSeconds: reactorTimeSeconds,
    reactorOvershoots: overshoots,
    dilemmaMatch: Boolean(isDirectMatch),
    dilemmaChoiceLabelA: dilemmaChoiceLabelA || 'Spontaneous Road Trip',
    dilemmaChoiceLabelB: dilemmaChoiceLabelB || (isDirectMatch ? dilemmaChoiceLabelA || 'Spontaneous Road Trip' : 'Hidden Culinary Spot'),
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
      // Backwards compatibility aliases
      syncReason: alignmentReason,
      teamworkReason: reasoningReason,
      adaptabilityReason: timingReason,
      balanceReason: riskReason,
    },
    // Backwards compatibility aliases
    synchronization: decisionAlignment,
    teamwork: chemicalReasoning,
    adaptability: reactionTiming,
    balance: riskCompatibility,
  };
}
