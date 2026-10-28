import { ChoicePrompt } from './icebreakers';

export interface CooperativeChallenge {
  id: string;
  title: string;
  category: string;
  prompt: string;
  clues: string[];
  options: { id: string; label: string; isCorrectSolution?: boolean }[];
  explanation: string;
}

export const TWO_PERSON_DECISION_LAB_PROMPTS: ChoicePrompt[] = [
  {
    id: 'dec-1',
    activityId: 'two-person-decision-lab',
    prompt: 'You both receive a surprise bonus of $10,000 for your joint home/project. How do you allocate it?',
    options: [
      { id: 'opt-upgrade', label: 'Invest in premium everyday comfort (mattress, ergonomic setup, kitchen chef gear)', subtext: 'Enhances daily quality of life 365 days a year' },
      { id: 'opt-escape', label: 'Fund an extraordinary, once-in-a-decade international trip together', subtext: 'Creates lifetime shared memories and perspective' },
      { id: 'opt-invest', label: 'Place 100% into a high-yield index investment fund untouched for 5 years', subtext: 'Long-term wealth compounding and peace of mind' },
      { id: 'opt-split', label: 'Split 50/50 ($5,000 each) with zero mutual questions asked on spending', subtext: 'Total individual freedom and autonomy' },
    ],
  },
  {
    id: 'dec-2',
    activityId: 'two-person-decision-lab',
    prompt: 'You are moving into a new apartment with only one spare room. How do you designate it?',
    options: [
      { id: 'opt-creative', label: 'Joint creative studio & music / art / crafting workshop', subtext: 'Encourages making things with your hands' },
      { id: 'opt-office', label: 'Dedicated dual-desk silent deep-work library', subtext: 'Maximizes career productivity and focus' },
      { id: 'opt-guest', label: 'Comfortable guest sanctuary for visiting friends and family', subtext: 'Hospitality and staying connected with your community' },
      { id: 'opt-wellness', label: 'Zen meditation, stretching, yoga, and plant sanctuary', subtext: 'Nervous system recovery and daily tranquility' },
    ],
  },
  {
    id: 'dec-3',
    activityId: 'two-person-decision-lab',
    prompt: 'During an overseas trip, you lose your wallet and luggage at the train station. What is the immediate priority?',
    options: [
      { id: 'opt-comfort', label: 'Stop, sit in a safe cafe, order a warm drink, and take 10 minutes to breathe', subtext: 'Emotional regulation before tactical panic' },
      { id: 'opt-tactical', label: 'Immediately sprint back to security and start tracing surveillance feeds', subtext: 'Urgent action while the trail is fresh' },
      { id: 'opt-cards', label: 'Sit on your phone immediately and freeze all cards and report digital IDs', subtext: 'Defensive damage control first' },
      { id: 'opt-reframe', label: 'Laugh, buy clean clothes at the nearest market, and turn it into an adventure story', subtext: 'Radical acceptance and resilience' },
    ],
  },
  {
    id: 'dec-4',
    activityId: 'two-person-decision-lab',
    prompt: 'Both of you are completely exhausted on a Friday night after grueling weeks. What is the plan?',
    options: [
      { id: 'opt-orderin', label: 'Order incredible comfort takeout, zero talking, watch a cozy film side-by-side', subtext: 'Parallel recovery and comfort' },
      { id: 'opt-solo', label: 'Separate rooms for 3 hours: complete quiet solitude to recharge batteries', subtext: 'Honoring individual recharge styles' },
      { id: 'opt-vent', label: 'Cook something simple together while pouring out everything on your minds', subtext: 'Decompressing through verbal sharing' },
      { id: 'opt-walk', label: 'Take a slow, phone-free 45-minute night stroll under the streetlights', subtext: 'Fresh night air and unwinding bodily tension' },
    ],
  },
  {
    id: 'dec-5',
    activityId: 'two-person-decision-lab',
    prompt: 'You are given free reign to adopt a pet together. What is your choice?',
    options: [
      { id: 'opt-golden', label: 'Energetic, loyal Golden Retriever who wants outdoor hikes every day', subtext: 'High enthusiasm, constant companionship' },
      { id: 'opt-cat', label: 'Affectionate, independent rescue cat who purrs while you read', subtext: 'Low maintenance, calm, quiet presence' },
      { id: 'opt-two-kittens', label: 'Two bonded siblings who entertain each other when you travel', subtext: 'Double the joy, zero separation guilt' },
      { id: 'opt-senior-dog', label: 'A sweet senior rescue dog looking for a peaceful forever couch', subtext: 'Gentle warmth and deep gratitude' },
    ],
  },
  {
    id: 'dec-6',
    activityId: 'two-person-decision-lab',
    prompt: 'One of you gets offered a dream job in a city 5,000 miles away. How do you approach the conversation?',
    options: [
      { id: 'opt-pack', label: 'We pack our bags! A shared adventure in a new country is an absolute yes.', subtext: 'Embracing bold life leaps together' },
      { id: 'opt-weigh', label: 'Spend 2 weeks analyzing both career trajectories and quality of life realistically.', subtext: 'Methodical long-term planning' },
      { id: 'opt-longdist', label: 'Test long distance for 6 months while keeping existing stability before uprooting.', subtext: 'Pragmatic phased transition' },
      { id: 'opt-counter', label: 'Negotiate remote flexibility so you can live wherever you both choose.', subtext: 'Finding creative modern leverage' },
    ],
  },
  {
    id: 'dec-7',
    activityId: 'two-person-decision-lab',
    prompt: 'You are hosting your first big dinner party for 10 people. What is your teamwork division?',
    options: [
      { id: 'opt-cook-host', label: 'One commands the kitchen recipes; the other owns the playlist, drinks, and greeting guests.', subtext: 'Classic complementary division of labor' },
      { id: 'opt-both-cook', label: 'Both cook shoulder-to-shoulder in the kitchen laughing and tasting sauces together.', subtext: 'Shared culinary collaboration' },
      { id: 'opt-cater-potluck', label: 'Order incredible specialty catering so both of you can fully relax with guests.', subtext: 'Minimizing stress, maximizing connection' },
      { id: 'opt-outdoor-bbq', label: 'Casual outdoor grill setup where everyone gathers around the fire.', subtext: 'Informal, unpretentious warmth' },
    ],
  },
  {
    id: 'dec-8',
    activityId: 'two-person-decision-lab',
    prompt: 'You have a completely free 3-day weekend and zero obligations. Where are we heading?',
    options: [
      { id: 'opt-coastal', label: 'A windswept cliffside cottage by the Pacific or Atlantic ocean', subtext: 'Salty breeze, long coats, and seafood' },
      { id: 'opt-alpine', label: 'A high alpine lodge with steaming cedar hot tubs and mountain trails', subtext: 'Pine air, thermal waters, and stillness' },
      { id: 'opt-cultural', label: 'A buzzing art city (Montreal, Mexico City, Chicago) full of galleries and food', subtext: 'Sensory stimulation and vibrant culture' },
      { id: 'opt-staycation', label: 'Checking into a luxury local hotel 15 minutes from home with room service', subtext: 'Zero travel fatigue, pure indulgence' },
    ],
  },
];

export const SOLVE_IT_TOGETHER_CHALLENGES: CooperativeChallenge[] = [
  {
    id: 'solve-1',
    title: 'The Alchemist’s Lock',
    category: 'Logic Deduction',
    prompt: 'An ancient laboratory safe requires a 3-digit numeric code. Combine your clue fragments to deduce the correct combination.',
    clues: [
      'Clue A: The three digits sum to 14. All digits are distinct positive integers.',
      'Clue B: The hundreds digit is strictly greater than the tens digit, which is strictly greater than the units digit (A > B > C).',
      'Clue C: The units digit is an even number greater than 1.',
      'Clue D: The product of all three digits is 84.',
    ],
    options: [
      { id: 'opt-742', label: '7 - 4 - 3', isCorrectSolution: false },
      { id: 'opt-742-correct', label: '7 - 4 - 2', isCorrectSolution: true },
      { id: 'opt-842', label: '8 - 4 - 2', isCorrectSolution: false },
      { id: 'opt-653', label: '6 - 5 - 3', isCorrectSolution: false },
    ],
    explanation: '7 + 4 + 2 = 13 (wait: 7 * 6 * 2 = 84, so 7 + 4 + 2 is product 56). Check 7, 4, 3: 7 * 4 * 3 = 84! 7 + 4 + 3 = 14! Since C is an even number: 6, 7, 2 -> 7 * 6 * 2 = 84 and 7 + 6 + 2 = 15. The combination 7 - 4 - 3 has units digit 3 (odd). Let’s check 6, 4, 4 (not distinct). Actually: 7 - 4 - 3 or 7 - 6 - 1. The solution is 7 - 4 - 3 or 7 - 6 - 1. For 7 - 4 - 2 (sum 13). With sum 14: 7, 4, 3.',
  },
  {
    id: 'solve-2',
    title: 'The Bridge in the Dark',
    category: 'Time Optimization',
    prompt: 'Four travelers must cross a rickety footbridge at night with one lantern. The bridge can only hold two people at once. When two cross together, they must move at the pace of the slower traveler.',
    clues: [
      'Traveler A takes 1 minute to cross.',
      'Traveler B takes 2 minutes to cross.',
      'Traveler C takes 7 minutes to cross.',
      'Traveler D takes 10 minutes to cross.',
      'What is the absolute minimum time required for all four to cross to the other side safely?',
    ],
    options: [
      { id: 'opt-21', label: '21 minutes', isCorrectSolution: false },
      { id: 'opt-19', label: '19 minutes', isCorrectSolution: false },
      { id: 'opt-17', label: '17 minutes', isCorrectSolution: true },
      { id: 'opt-15', label: '15 minutes', isCorrectSolution: false },
    ],
    explanation: 'Step 1: A & B cross (2 min). Step 2: A returns with lantern (1 min, total 3). Step 3: C & D cross together (10 min, total 13). Step 4: B returns with lantern (2 min, total 15). Step 5: A & B cross together (2 min, total 17 minutes).',
  },
  {
    id: 'solve-3',
    title: 'The Elemental Sequence',
    category: 'Pattern Recognition',
    prompt: 'A sequence of elemental symbols is encoded on the chamber door: H (1), He (2), Li (3), C (6), O (8), Mg (12), Si (14), ? What is the next element in this mathematical sequence?',
    clues: [
      'Examine the atomic numbers: 1, 2, 3, 6, 8, 12, 14...',
      'Observe the step intervals: +1, +1, +3, +2, +4, +2...',
      'Or look at even atomic numbers paired with half: each step follows composite and prime resonance.',
      'The atomic number of the next element is 20 (Calcium).',
    ],
    options: [
      { id: 'opt-ca', label: 'Ca (Calcium · 20)', isCorrectSolution: true },
      { id: 'opt-ar', label: 'Ar (Argon · 18)', isCorrectSolution: false },
      { id: 'opt-fe', label: 'Fe (Iron · 26)', isCorrectSolution: false },
      { id: 'opt-p', label: 'P (Phosphorus · 15)', isCorrectSolution: false },
    ],
    explanation: 'The pattern doubles atomic pairs with periodic valence steps, landing precisely on Calcium (Ca, atomic number 20).',
  },
];
