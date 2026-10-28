import { WOULD_YOU_RATHER_PROMPTS, THIS_OR_THAT_PAIRS, ChoicePrompt } from './icebreakers';
import {
  VALUES_AND_PRIORITIES_PROMPTS,
  GREEN_FLAG_RED_FLAG_PROMPTS,
  DEEP_TALK_PROMPTS,
  DeepTalkPrompt,
} from './personality';
import { QUIZ_QUESTIONS, QuizQuestion } from './quizBattle';
import {
  TWO_PERSON_DECISION_LAB_PROMPTS,
  SOLVE_IT_TOGETHER_CHALLENGES,
  CooperativeChallenge,
} from './cooperative';
import { PERFECT_DATE_STEPS, DREAM_TRIP_STEPS, ItineraryStep } from './creative';

export * from './icebreakers';
export * from './personality';
export * from './quizBattle';
export * from './cooperative';
export * from './creative';

// Simple deterministic pseudo-random number generator for seeded question ordering
function createSeededRandom(seedStr: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return function () {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getQuestionsForActivity(activityId: string, seed: string = 'default', count?: number): ChoicePrompt[] {
  let pool: ChoicePrompt[] = [];

  switch (activityId) {
    case 'would-you-rather':
      pool = WOULD_YOU_RATHER_PROMPTS;
      break;
    case 'this-or-that':
      pool = THIS_OR_THAT_PAIRS;
      break;
    case 'values-and-priorities':
      pool = VALUES_AND_PRIORITIES_PROMPTS;
      break;
    case 'green-flag-red-flag':
      pool = GREEN_FLAG_RED_FLAG_PROMPTS;
      break;
    case 'two-person-decision-lab':
      pool = TWO_PERSON_DECISION_LAB_PROMPTS;
      break;
    default:
      pool = WOULD_YOU_RATHER_PROMPTS;
  }

  const rng = createSeededRandom(seed + activityId);
  // Deterministic shuffle
  const shuffled = [...pool].sort(() => rng() - 0.5);
  return count ? shuffled.slice(0, count) : shuffled;
}

export function getQuizQuestions(seed: string = 'default', count: number = 8, categoryFilter?: string): QuizQuestion[] {
  let pool = QUIZ_QUESTIONS;
  if (categoryFilter && categoryFilter !== 'all') {
    pool = pool.filter((q) => q.category === categoryFilter);
  }
  const rng = createSeededRandom(seed + 'quiz');
  const shuffled = [...pool].sort(() => rng() - 0.5);
  return shuffled.slice(0, count);
}

export function getDeepTalkPrompts(level?: 1 | 2 | 3 | 4 | 5): DeepTalkPrompt[] {
  if (level) {
    return DEEP_TALK_PROMPTS.filter((p) => p.level === level);
  }
  return DEEP_TALK_PROMPTS;
}
