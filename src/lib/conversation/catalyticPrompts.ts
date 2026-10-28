import { CatalyticMoment, DilemmaState, ReactorState } from '../types/chemistry';

interface PromptGenerationInput {
  reactorState: ReactorState;
  dilemmaState: DilemmaState;
  userAName: string;
  userBName: string;
}

export function generateCatalyticMoments(input: PromptGenerationInput): CatalyticMoment[] {
  const { reactorState, dilemmaState, userAName, userBName } = input;
  const moments: CatalyticMoment[] = [];

  // Moment 1: Reactor pressure/reaction dynamic
  if (reactorState.overshootCount > 0) {
    moments.push({
      id: 'reactor-crisis',
      triggerEvent: `Overheated ${reactorState.overshootCount}x during Stage 2`,
      icebreaker: `${userBName} almost had the reactor core boiling over in Stage 2! 😂`,
      followUp: `Were you actually confident when you turned the valve, or pure instinct?`,
      badge: 'Core Crisis Recovery',
    });
  } else {
    moments.push({
      id: 'reactor-perfection',
      triggerEvent: `Zero breach in ${reactorState.elapsedSeconds.toFixed(1)}s`,
      icebreaker: `You two calibrated the reactor with surgical precision in ${reactorState.elapsedSeconds.toFixed(1)} seconds.`,
      followUp: `Are you normally this calm under high pressure, or did you just click?`,
      badge: 'Surgical Harmony',
    });
  }

  // Moment 2: Dilemma dynamic
  if (dilemmaState.isSynchronized) {
    moments.push({
      id: 'dilemma-sync',
      triggerEvent: `Instant synchronicity on ₹5,000 free day`,
      icebreaker: `Both of you picked the exact same free day scenario without a word.`,
      followUp: `Have you always had that exact same spontaneous impulse?`,
      badge: 'Cognitive Mirror',
    });
  } else {
    moments.push({
      id: 'dilemma-complement',
      triggerEvent: `Differing impulses on ₹5,000 free day`,
      icebreaker: `${userAName} picked one path while ${userBName} chose the opposite adventure.`,
      followUp: `If you had to compromise on that exact day together, who would convince whom?`,
      badge: 'Dynamic Polarity',
    });
  }

  // Moment 3: Communication chemistry
  moments.push({
    id: 'chemistry-spark',
    triggerEvent: `Asymmetric Laboratory Synthesis`,
    icebreaker: `User A had the vision, User B held the controls.`,
    followUp: `In real life, do you prefer giving the directions or driving the speed?`,
    badge: 'Co-Pilot Dynamic',
  });

  return moments;
}
