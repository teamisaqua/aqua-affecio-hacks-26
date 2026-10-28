export type ActivityCategory =
  | 'icebreakers'
  | 'personality'
  | 'competitive'
  | 'creative'
  | 'cooperative';

export type PlayStyle =
  | 'conversational'
  | 'competitive'
  | 'cooperative'
  | 'creative';

export interface ActivityDefinition {
  id: string;
  title: string;
  tagline: string;
  category: ActivityCategory;
  estimatedMinutes: number;
  playstyle: PlayStyle;
  questionCount: number;
  iconName: string; // Lucide icon identifier
  description: string;
  rules: string[];
  engineType:
    | 'choice-voting'
    | 'quiz-battle'
    | 'prediction'
    | 'deep-talk'
    | 'draw-together'
    | 'date-builder'
    | 'memory-match'
    | 'rapid-fire'
    | 'story-builder'
    | 'word-association';
  badge?: string;
  supportsSimulatedPartner: boolean;
}

export interface ActivityRecord {
  activityId: string;
  activityTitle: string;
  category: ActivityCategory;
  completedAt: number;
  durationSeconds: number;
  roundsCompleted: number;
  userAScore?: number;
  userBScore?: number;
  consensusCount?: number;
  totalDecisions?: number;
  summaryText: string;
  details?: Record<string, unknown>;
}

export interface CumulativeSessionStats {
  sessionStartTime: number;
  activitiesCompleted: ActivityRecord[];
  totalQuestionsAnswered: number;
  totalConsensusMatches: number;
  totalDivergentChoices: number;
  quizPointsUserA: number;
  quizPointsUserB: number;
  gamesWonUserA: number;
  gamesWonUserB: number;
  drawingsCreated: number;
  datesDesigned: number;
}
