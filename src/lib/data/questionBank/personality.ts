import { ChoicePrompt } from './icebreakers';

export interface DeepTalkPrompt {
  id: string;
  level: 1 | 2 | 3 | 4 | 5;
  levelTitle: string;
  prompt: string;
  context?: string;
}

export const VALUES_AND_PRIORITIES_PROMPTS: ChoicePrompt[] = [
  {
    id: 'val-1',
    activityId: 'values-and-priorities',
    prompt: 'If you received an unexpected free month with full pay, what would you prioritize?',
    options: [
      { id: 'opt-skill', label: 'Mastering an intense creative or physical craft', subtext: 'Deep self-actualization and personal mastery' },
      { id: 'opt-travel', label: 'Solo or partner backpacking through a new continent', subtext: 'Perspective shift, novelty, and adventure' },
      { id: 'opt-people', label: 'Spending slow quality time with family and close friends', subtext: 'Deepening roots and nurturing bonds' },
      { id: 'opt-project', label: 'Starting a passion project or entrepreneurial idea', subtext: 'Channeling momentum into something lasting' },
    ],
  },
  {
    id: 'val-2',
    activityId: 'values-and-priorities',
    prompt: 'When you encounter a fundamental disagreement with a close partner, what is your instinct?',
    options: [
      { id: 'opt-root', label: 'Deconstruct underlying assumptions to find root truth', subtext: 'Seeking logical clarity and alignment' },
      { id: 'opt-empathy', label: 'Prioritize how the other person is feeling before debating facts', subtext: 'Emotional safety over being "right"' },
      { id: 'opt-space', label: 'Request an hour of space so neither speaks out of anger', subtext: 'Deliberate de-escalation and calm' },
      { id: 'opt-compromise', label: 'Identify a pragmatic middle ground quickly to keep momentum', subtext: 'Constructive teamwork and forward motion' },
    ],
  },
  {
    id: 'val-3',
    activityId: 'values-and-priorities',
    prompt: 'What relationship balance feels most natural to you?',
    options: [
      { id: 'opt-independent', label: 'Two deeply independent orbits who cheer each other on', subtext: 'Strong individual hobbies, careers, and alone time' },
      { id: 'opt-intertwined', label: 'A close team who shares most daily routines and hobbies', subtext: 'High shared rhythm, constant collaboration' },
      { id: 'opt-growth', label: 'A growth-partnership where both hold each other to high standards', subtext: 'Mutual accountability and continuous self-improvement' },
      { id: 'opt-sanctuary', label: 'A soft sanctuary away from the world’s demands', subtext: 'Gentle unconditional peace and refuge' },
    ],
  },
  {
    id: 'val-4',
    activityId: 'values-and-priorities',
    prompt: 'How do you view money and financial security?',
    options: [
      { id: 'opt-freedom', label: 'Money is purely a vehicle for autonomy and flexibility', subtext: 'Working less to have more free time' },
      { id: 'opt-experiences', label: 'Money is best spent on unforgettable shared experiences and travel', subtext: 'Memories compound more than material wealth' },
      { id: 'opt-safety', label: 'Strong savings and long-term security bring peace of mind', subtext: 'Preparedness for family and unexpected crises' },
      { id: 'opt-generosity', label: 'Being able to spoil loved ones and support good causes', subtext: 'Generosity as the ultimate metric of success' },
    ],
  },
  {
    id: 'val-5',
    activityId: 'values-and-priorities',
    prompt: 'What kind of career success matters most to you in 10 years?',
    options: [
      { id: 'opt-impact', label: 'Working on problems that genuinely benefit society or the planet', subtext: 'Mission and purpose over prestige' },
      { id: 'opt-craft', label: 'Becoming a recognized master of your specific craft or trade', subtext: 'Peer respect, excellence, and creative autonomy' },
      { id: 'opt-lifestyle', label: 'A flexible career that never interferes with family and personal life', subtext: 'Strict boundaries and living richly outside work' },
      { id: 'opt-leadership', label: 'Building and leading an organization with significant scale', subtext: 'Influence, responsibility, and building institutions' },
    ],
  },
  {
    id: 'val-6',
    activityId: 'values-and-priorities',
    prompt: 'In friendships, what do you value above all else?',
    options: [
      { id: 'opt-unwavering', label: 'Unwavering loyalty: being there at 3 AM when life falls apart', subtext: 'Reliability and showing up in crises' },
      { id: 'opt-candor', label: 'Radical candor: friends who tell you the truth when you’re wrong', subtext: 'Honesty and mutual evolution' },
      { id: 'opt-effortless', label: 'Effortless continuity: picking up where you left off after 6 months', subtext: 'Zero maintenance guilt and easy warmth' },
      { id: 'opt-curiosity', label: 'Intellectual sparks: conversations that expand your worldview', subtext: 'Curiosity, new ideas, and deep debate' },
    ],
  },
  {
    id: 'val-7',
    activityId: 'values-and-priorities',
    prompt: 'What makes you feel most valued in a relationship?',
    options: [
      { id: 'opt-words', label: 'Specific, observant compliments about your character or effort', subtext: 'Feeling truly seen and verbally appreciated' },
      { id: 'opt-acts', label: 'Thoughtful everyday actions that lighten your load without asking', subtext: 'Practical care and consideration' },
      { id: 'opt-time', label: 'Undivided attention with phones away and zero multitasking', subtext: 'Intentional presence and focus' },
      { id: 'opt-physical', label: 'Unspoken physical warmth, hugs, and close grounding contact', subtext: 'Somatic comfort and reassurance' },
    ],
  },
  {
    id: 'val-8',
    activityId: 'values-and-priorities',
    prompt: 'When making a major life decision (like relocating), what guides you most?',
    options: [
      { id: 'opt-gut-feel', label: 'Intuitive instinct: does my body feel expanded or contracted?', subtext: 'Subconscious wisdom and gut compass' },
      { id: 'opt-analytical', label: 'Careful risk-benefit analysis and forecasting outcomes', subtext: 'Clear thinking and probabilistic planning' },
      { id: 'opt-relational', label: 'How this decision impacts the people I love most', subtext: 'Relational harmony and mutual happiness' },
      { id: 'opt-adventure', label: 'Which path creates the most growth and least regret later?', subtext: 'Courage and expanding horizons' },
    ],
  },
];

export const GREEN_FLAG_RED_FLAG_PROMPTS: ChoicePrompt[] = [
  {
    id: 'gfrf-1',
    activityId: 'green-flag-red-flag',
    prompt: 'Your partner has a close friendship with an ex that ended amicably 4 years ago.',
    options: [
      { id: 'opt-green', label: 'Green Flag', subtext: 'Shows emotional maturity and capacity for healthy endings' },
      { id: 'opt-context', label: 'Context Dependent', subtext: 'Depends on current boundaries and transparency' },
      { id: 'opt-red', label: 'Red Flag', subtext: 'Uncomfortable with lingering romantic pasts' },
    ],
  },
  {
    id: 'gfrf-2',
    activityId: 'green-flag-red-flag',
    prompt: 'When you share a personal frustration, they immediately say: "Do you want comfort, advice, or to vent?"',
    options: [
      { id: 'opt-green', label: 'Massive Green Flag', subtext: 'Superb communication and emotional intelligence' },
      { id: 'opt-context', label: 'A Bit Clinical', subtext: 'Good intentions, but feels slightly scripted' },
      { id: 'opt-red', label: 'Unnatural', subtext: 'Prefer spontaneous empathy without a menu of options' },
    ],
  },
  {
    id: 'gfrf-3',
    activityId: 'green-flag-red-flag',
    prompt: 'They rarely check their phone when you are having dinner, but can take 6 hours to reply to texts during the day.',
    options: [
      { id: 'opt-green', label: 'Green Flag', subtext: 'Present in real life, focused on deep work during day' },
      { id: 'opt-context', label: 'Context Dependent', subtext: 'Acceptable as long as they communicate their schedule' },
      { id: 'opt-red', label: 'Red Flag', subtext: 'Causes anxiety if there is zero check-in for 6+ hours' },
    ],
  },
  {
    id: 'gfrf-4',
    activityId: 'green-flag-red-flag',
    prompt: 'They openly admit when they made a mistake and apologize without qualifying it with "but you also..."',
    options: [
      { id: 'opt-green', label: 'Ultimate Green Flag', subtext: 'Accountability without defensiveness is rare and gold' },
      { id: 'opt-context', label: 'Expected Baseline', subtext: 'Essential for any adult relationship' },
      { id: 'opt-red', label: 'Neutral', subtext: 'Words are easy; consistency over time matters more' },
    ],
  },
  {
    id: 'gfrf-5',
    activityId: 'green-flag-red-flag',
    prompt: 'On the third date, they mention: "I want to take things slow and really get to know you before rushing into commitments."',
    options: [
      { id: 'opt-green', label: 'Green Flag', subtext: 'Pacing oneself shows respect and intentionality' },
      { id: 'opt-context', label: 'Context Dependent', subtext: 'Healthy if authentic, but can sometimes be a hedge' },
      { id: 'opt-red', label: 'Caution Flag', subtext: 'Prefer clear forward enthusiasm from the start' },
    ],
  },
  {
    id: 'gfrf-6',
    activityId: 'green-flag-red-flag',
    prompt: 'They enjoy spending an entire Saturday doing their own separate hobby in the same room without talking much.',
    options: [
      { id: 'opt-green', label: 'Green Flag (Parallel Play)', subtext: 'Comfortable silence is a sign of deep connection' },
      { id: 'opt-context', label: 'Context Dependent', subtext: 'Great occasionally, but prefer engaged interaction' },
      { id: 'opt-red', label: 'Boring / Distant', subtext: 'Weekends should be for shared interactive activities' },
    ],
  },
  {
    id: 'gfrf-7',
    activityId: 'green-flag-red-flag',
    prompt: 'During an argument, they say: "I feel overwhelmed right now. I need 20 minutes to breathe, but I promise we will resolve this."',
    options: [
      { id: 'opt-green', label: 'Model Green Flag', subtext: 'Self-regulation paired with a commitment to return' },
      { id: 'opt-context', label: 'Context Dependent', subtext: 'Good as long as the 20 minutes does not turn into days' },
      { id: 'opt-red', label: 'Frustrating', subtext: 'Prefer finishing conversations without walking away' },
    ],
  },
  {
    id: 'gfrf-8',
    activityId: 'green-flag-red-flag',
    prompt: 'They frequently tease you playfully about your quirks in front of their close friends.',
    options: [
      { id: 'opt-green', label: 'Green Flag', subtext: 'Affectionate banter and inclusion in their circle' },
      { id: 'opt-context', label: 'Context Dependent', subtext: 'Fine if harmless, red flag if it undermines dignity' },
      { id: 'opt-red', label: 'Red Flag', subtext: 'Public teasing feels disrespectful or insecure' },
    ],
  },
];

export const DEEP_TALK_PROMPTS: DeepTalkPrompt[] = [
  // LEVEL 1: LIGHT & COMFORTABLE
  { id: 'dt-1', level: 1, levelTitle: 'Light & Comfortable', prompt: 'What is something simple that made you genuinely smile in the last 48 hours?' },
  { id: 'dt-2', level: 1, levelTitle: 'Light & Comfortable', prompt: 'What is your current hyper-fixation or rabbit hole you’ve fallen down recently?' },
  { id: 'dt-3', level: 1, levelTitle: 'Light & Comfortable', prompt: 'If you could be an absolute expert in one obscure, useless subject, what would it be?' },
  { id: 'dt-4', level: 1, levelTitle: 'Light & Comfortable', prompt: 'What is a smell or sound that instantly transports you back to childhood?' },
  { id: 'dt-5', level: 1, levelTitle: 'Light & Comfortable', prompt: 'What is the most pleasant compliment you’ve received from a stranger?' },
  { id: 'dt-6', level: 1, levelTitle: 'Light & Comfortable', prompt: 'What is your favorite low-stakes ritual (e.g. morning tea, Sunday grocery walk)?' },
  { id: 'dt-7', level: 1, levelTitle: 'Light & Comfortable', prompt: 'Which movie or TV show do you rewatch when your brain just needs comfort?' },
  { id: 'dt-8', level: 1, levelTitle: 'Light & Comfortable', prompt: 'What is a food you hated as a kid that you now genuinely enjoy?' },
  { id: 'dt-9', level: 1, levelTitle: 'Light & Comfortable', prompt: 'If your life had a closing theme song today, what track would play?' },
  { id: 'dt-10', level: 1, levelTitle: 'Light & Comfortable', prompt: 'What is something you consider yourself unexpectedly good at?' },

  // LEVEL 2: PERSONAL INTERESTS & EXPERIENCES
  { id: 'dt-11', level: 2, levelTitle: 'Personal Interests & Experiences', prompt: 'What is an experience you had that completely changed your perspective on people?' },
  { id: 'dt-12', level: 2, levelTitle: 'Personal Interests & Experiences', prompt: 'What is a piece of advice you followed that turned out to be completely wrong for you?' },
  { id: 'dt-13', level: 2, levelTitle: 'Personal Interests & Experiences', prompt: 'What is something you worked hard for that didn’t feel as fulfilling as you expected?' },
  { id: 'dt-14', level: 2, levelTitle: 'Personal Interests & Experiences', prompt: 'What is a city or place where you felt unexpectedly at home within minutes of arriving?' },
  { id: 'dt-15', level: 2, levelTitle: 'Personal Interests & Experiences', prompt: 'What is a skill or trait in other people that you admire but don’t naturally possess?' },
  { id: 'dt-16', level: 2, levelTitle: 'Personal Interests & Experiences', prompt: 'When was the last time you surprised yourself by doing something out of character?' },
  { id: 'dt-17', level: 2, levelTitle: 'Personal Interests & Experiences', prompt: 'What is something you loved doing at 12 years old that you still enjoy today?' },
  { id: 'dt-18', level: 2, levelTitle: 'Personal Interests & Experiences', prompt: 'What is a book, essay, or documentary that permanently altered how you think?' },
  { id: 'dt-19', level: 2, levelTitle: 'Personal Interests & Experiences', prompt: 'How do you know when you’ve developed genuine respect for someone?' },
  { id: 'dt-20', level: 2, levelTitle: 'Personal Interests & Experiences', prompt: 'What is an unwritten rule of life you hold yourself to?' },

  // LEVEL 3: MEMORIES & ASPIRATIONS
  { id: 'dt-21', level: 3, levelTitle: 'Memories & Aspirations', prompt: 'What is a moment in your life where you felt completely proud of your resilience?' },
  { id: 'dt-22', level: 3, levelTitle: 'Memories & Aspirations', prompt: 'What is a dream you’ve put on the back burner that you still secretly want to bring to life?' },
  { id: 'dt-23', level: 3, levelTitle: 'Memories & Aspirations', prompt: 'Who was a mentor or teacher who saw something in you before you saw it yourself?' },
  { id: 'dt-24', level: 3, levelTitle: 'Memories & Aspirations', prompt: 'What is a turning point in your life that seemed unfortunate at the time but led somewhere good?' },
  { id: 'dt-25', level: 3, levelTitle: 'Memories & Aspirations', prompt: 'What is a personal tradition you want to carry forward into your future family?' },
  { id: 'dt-26', level: 3, levelTitle: 'Memories & Aspirations', prompt: 'If you could spend one hour with your 16-year-old self, what would you emphasize?' },
  { id: 'dt-27', level: 3, levelTitle: 'Memories & Aspirations', prompt: 'What is an adventure you’ve promised yourself you will take before you turn 40?' },
  { id: 'dt-28', level: 3, levelTitle: 'Memories & Aspirations', prompt: 'What does a truly meaningful Tuesday evening look like to you in five years?' },
  { id: 'dt-29', level: 3, levelTitle: 'Memories & Aspirations', prompt: 'What is something you’ve forgiven yourself for after a long time?' },
  { id: 'dt-30', level: 3, levelTitle: 'Memories & Aspirations', prompt: 'What kind of legacy matters more to you: impact on many or deep loyalty to a few?' },

  // LEVEL 4: VALUES & EMOTIONAL COMMUNICATION
  { id: 'dt-31', level: 4, levelTitle: 'Values & Emotional Communication', prompt: 'How do you usually express love or appreciation when words feel inadequate?' },
  { id: 'dt-32', level: 4, levelTitle: 'Values & Emotional Communication', prompt: 'What does feeling "safe" with another person look and feel like for you?' },
  { id: 'dt-33', level: 4, levelTitle: 'Values & Emotional Communication', prompt: 'What is a boundary you’ve had to learn the hard way to protect your peace?' },
  { id: 'dt-34', level: 4, levelTitle: 'Values & Emotional Communication', prompt: 'When you are hurting, do you naturally withdraw into a shell or seek connection?' },
  { id: 'dt-35', level: 4, levelTitle: 'Values & Emotional Communication', prompt: 'What is a misconception people often have about you when they first meet you?' },
  { id: 'dt-36', level: 4, levelTitle: 'Values & Emotional Communication', prompt: 'What role does vulnerability play in your life: does it feel like bravery or risk?' },
  { id: 'dt-37', level: 4, levelTitle: 'Values & Emotional Communication', prompt: 'How has your definition of a successful romantic partnership evolved over time?' },
  { id: 'dt-38', level: 4, levelTitle: 'Values & Emotional Communication', prompt: 'What is an emotional habit you are actively trying to improve or unlearn?' },
  { id: 'dt-39', level: 4, levelTitle: 'Values & Emotional Communication', prompt: 'What makes you feel most understood by someone you care about?' },
  { id: 'dt-40', level: 4, levelTitle: 'Values & Emotional Communication', prompt: 'When was the last time you felt moved to tears by art, music, or a gesture?' },

  // LEVEL 5: MEANINGFUL REFLECTIONS & VULNERABILITY
  { id: 'dt-41', level: 5, levelTitle: 'Meaningful Reflections & Vulnerability', prompt: 'What is something you rarely speak aloud because you worry about being judged?' },
  { id: 'dt-42', level: 5, levelTitle: 'Meaningful Reflections & Vulnerability', prompt: 'What is your greatest fear about growing older or building a life with someone?' },
  { id: 'dt-43', level: 5, levelTitle: 'Meaningful Reflections & Vulnerability', prompt: 'In what ways do you see yourself resembling your parents, for better or worse?' },
  { id: 'dt-44', level: 5, levelTitle: 'Meaningful Reflections & Vulnerability', prompt: 'What is a part of yourself that you are still learning to embrace and be gentle with?' },
  { id: 'dt-45', level: 5, levelTitle: 'Meaningful Reflections & Vulnerability', prompt: 'What does unconditional acceptance mean to you in practical, everyday terms?' },
  { id: 'dt-46', level: 5, levelTitle: 'Meaningful Reflections & Vulnerability', prompt: 'If you could hear an honest answer to one question about your life, what would you ask?' },
  { id: 'dt-47', level: 5, levelTitle: 'Meaningful Reflections & Vulnerability', prompt: 'What is something you need more of in your life right now that you haven’t asked for?' },
  { id: 'dt-48', level: 5, levelTitle: 'Meaningful Reflections & Vulnerability', prompt: 'What belief did you hold ten years ago that you now see as narrow or incomplete?' },
  { id: 'dt-49', level: 5, levelTitle: 'Meaningful Reflections & Vulnerability', prompt: 'When in your life have you felt the deepest sense of peace and belonging?' },
  { id: 'dt-50', level: 5, levelTitle: 'Meaningful Reflections & Vulnerability', prompt: 'What do you hope someone remembers about you long after this conversation?' },
];
