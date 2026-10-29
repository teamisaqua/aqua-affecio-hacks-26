export interface ExtendedDilemmaOption {
  id: string;
  label: string;
  subtext: string;
  archetype: 'spontaneous' | 'calculated' | 'adventurous' | 'intimate' | 'collaborative' | 'direct';
}

export interface ExtendedDilemmaScenario {
  id: string;
  prompt: string;
  category: 'spontaneous' | 'communication' | 'conflict' | 'teamwork' | 'lifestyle' | 'travel' | 'creative';
  categoryLabel: string;
  context: string;
  options: ExtendedDilemmaOption[];
  discussionSpark: string; // The conversation starter revealed after choices
}

export const DILEMMAS_40: ExtendedDilemmaScenario[] = [
  // ==========================================
  // CATEGORY 1: SPONTANEOUS CHOICES (6 scenarios)
  // ==========================================
  {
    id: 'dil-spon-1',
    prompt: 'You find two unclaimed first-class plane tickets boarding in 30 minutes to an unknown destination. What do you do?',
    category: 'spontaneous',
    categoryLabel: 'Spontaneous Choices',
    context: 'Dilemma · Spontaneous Impulse',
    options: [
      { id: 'opt-board-now', label: 'Drop Everything & Board', subtext: 'Run to the gate immediately with only the clothes on your back.', archetype: 'spontaneous' },
      { id: 'opt-verify-gate', label: 'Inquire with Gate Agent', subtext: 'Ensure the tickets won’t strand you or belong to someone in distress.', archetype: 'calculated' },
      { id: 'opt-gift-travelers', label: 'Gift to Honeymooners', subtext: 'Hand them to an exhausted young couple waiting at standby.', archetype: 'collaborative' },
      { id: 'opt-pack-delay', label: 'Take Next Flight Tomorrow', subtext: 'Go home, pack properly, and embark on a well-planned departure.', archetype: 'direct' },
    ],
    discussionSpark: 'What is the most impulsive decision you have ever made that actually turned out wonderfully?',
  },
  {
    id: 'dil-spon-2',
    prompt: 'Walking past a vibrant underground jazz cellar at midnight on a Tuesday, you hear incredible music. What is your reaction?',
    category: 'spontaneous',
    categoryLabel: 'Spontaneous Choices',
    context: 'Dilemma · Night Impulse',
    options: [
      { id: 'opt-walk-in', label: 'Step Inside Immediately', subtext: 'Tomorrow’s alarm can wait; live music in a dark corner is rare.', archetype: 'spontaneous' },
      { id: 'opt-listen-outside', label: 'Listen for 5 Minutes Outside', subtext: 'Soak in the melody on the sidewalk, then head home to sleep.', archetype: 'calculated' },
      { id: 'opt-bookmark-weekend', label: 'Bookmark for the Weekend', subtext: 'Save the spot on your map and return when you can stay late.', archetype: 'direct' },
      { id: 'opt-invite-friends', label: 'Call Friends to Join', subtext: 'Rally others nearby to turn it into an impromptu celebration.', archetype: 'collaborative' },
    ],
    discussionSpark: 'Do you feel more alive when adhering to a healthy routine or breaking it for serendipity?',
  },
  {
    id: 'dil-spon-3',
    prompt: 'A street artisan offers you a handcrafted mystery box: pay \$50 and open it, or keep your cash. What do you choose?',
    category: 'spontaneous',
    categoryLabel: 'Spontaneous Choices',
    context: 'Dilemma · Mystery Trade-off',
    options: [
      { id: 'opt-buy-box', label: 'Buy the Mystery Box', subtext: 'The story and curiosity are worth far more than fifty dollars.', archetype: 'spontaneous' },
      { id: 'opt-bargain-reveal', label: 'Ask for a Riddle First', subtext: 'Engage the artisan to guess the general nature of the contents.', archetype: 'calculated' },
      { id: 'opt-keep-cash', label: 'Walk Away with Cash', subtext: 'Keep your money for things you intentionally choose.', archetype: 'direct' },
      { id: 'opt-split-box', label: 'Split Cost with Partner', subtext: 'Open the box together as a joint micro-gamble.', archetype: 'collaborative' },
    ],
    discussionSpark: 'Are you more drawn to the thrill of the unknown or the satisfaction of certainty?',
  },
  {
    id: 'dil-spon-4',
    prompt: 'Sudden summer rainstorm drenches the city streets. You have no umbrella. How do you navigate?',
    category: 'spontaneous',
    categoryLabel: 'Spontaneous Choices',
    context: 'Dilemma · Sudden Weather',
    options: [
      { id: 'opt-dance-rain', label: 'Embrace the Downpour', subtext: 'Slow down and walk right through it; clothes dry eventually.', archetype: 'spontaneous' },
      { id: 'opt-dash-cafe', label: 'Duck Into Nearest Warm Cafe', subtext: 'Order hot drinks and watch the torrent through steaming windows.', archetype: 'intimate' },
      { id: 'opt-hail-cab', label: 'Sprint to Nearest Cab', subtext: 'Prioritize staying dry and efficient above all else.', archetype: 'direct' },
      { id: 'opt-find-awning', label: 'Share an Awning with Strangers', subtext: 'Stand close under a store overhang and chat with fellow commuters.', archetype: 'collaborative' },
    ],
    discussionSpark: 'Do you lean toward embracing chaotic weather or engineering shelter immediately?',
  },
  {
    id: 'dil-spon-5',
    prompt: 'You are handed an unexpected \$1,000 cash bonus that must be spent completely within 24 hours. What is your priority?',
    category: 'spontaneous',
    categoryLabel: 'Spontaneous Choices',
    context: 'Dilemma · Rapid Windfall',
    options: [
      { id: 'opt-tasting-menu', label: 'A Michelin Feast for Two', subtext: 'Book an extraordinary dining experience with wine pairings.', archetype: 'intimate' },
      { id: 'opt-weekend-escape', label: 'Instant Coastal Flight', subtext: 'Fly out tonight to wake up beside the ocean waves.', archetype: 'adventurous' },
      { id: 'opt-home-upgrade', label: 'High-End Design Object', subtext: 'Buy a timeless designer chair or espresso machine that lasts decades.', archetype: 'calculated' },
      { id: 'opt-group-experience', label: 'Host a Grand Gathering', subtext: 'Cover drinks, food, and music for your closest group of friends.', archetype: 'collaborative' },
    ],
    discussionSpark: 'If resources are fleeting, do you prefer memorable tastes, travel, objects, or shared celebrations?',
  },
  {
    id: 'dil-spon-6',
    prompt: 'A friend invites you on an impulse 3-day road trip leaving in one hour. Your apartment is messy. Do you go?',
    category: 'spontaneous',
    categoryLabel: 'Spontaneous Choices',
    context: 'Dilemma · Departure Window',
    options: [
      { id: 'opt-throw-bag', label: 'Throw a Bag Together & Run', subtext: 'A clean apartment won’t make memories; adventures wait for no one.', archetype: 'spontaneous' },
      { id: 'opt-negotiate-time', label: 'Ask for a 2-Hour Buffer', subtext: 'Tidy up, secure deadlines, and catch up with them at the highway.', archetype: 'calculated' },
      { id: 'opt-decline-recharge', label: 'Politely Decline to Rest', subtext: 'Honor your scheduled downtime and personal recharge.', archetype: 'direct' },
      { id: 'opt-join-day-two', label: 'Meet Them on Day Two', subtext: 'Finish current obligations and take the train to join the midway stop.', archetype: 'collaborative' },
    ],
    discussionSpark: 'How much friction or disarray can your mind tolerate before spontaneous joy kicks in?',
  },

  // ==========================================
  // CATEGORY 2: COMMUNICATION STYLES (6 scenarios)
  // ==========================================
  {
    id: 'dil-comm-1',
    prompt: 'When someone close to you is hurt or agitated, what is your instinctual first response?',
    category: 'communication',
    categoryLabel: 'Communication Styles',
    context: 'Dilemma · Empathy Mechanics',
    options: [
      { id: 'opt-listen-space', label: 'Silent, Unhurried Presence', subtext: 'Listen without offering advice, fixing, or interrupting.', archetype: 'intimate' },
      { id: 'opt-problem-solve', label: 'Structured Solution Finding', subtext: 'Help isolate the exact problem and brainstorm actionable fixes.', archetype: 'calculated' },
      { id: 'opt-validate-emotion', label: 'Passionate Emotional Validation', subtext: 'Explicitly echo their feelings: "You have every right to feel furious."', archetype: 'collaborative' },
      { id: 'opt-lighten-mood', label: 'Gentle Distraction & Comfort', subtext: 'Make tea, order favorite comfort food, and soften the tension.', archetype: 'spontaneous' },
    ],
    discussionSpark: 'When you are upset, do you want someone to listen silently, brainstorm solutions, or make you laugh?',
  },
  {
    id: 'dil-comm-2',
    prompt: 'You notice your partner has been unusually quiet for the past two hours. How do you approach them?',
    category: 'communication',
    categoryLabel: 'Communication Styles',
    context: 'Dilemma · Subconscious Distance',
    options: [
      { id: 'opt-direct-ask', label: 'Ask Gently but Directly', subtext: '"I noticed you’ve been quiet. Is something on your mind?"', archetype: 'direct' },
      { id: 'opt-give-room', label: 'Give Them Open Space', subtext: 'Allow them to process internally without interrogating them.', archetype: 'calculated' },
      { id: 'opt-nonverbal-touch', label: 'Offer Warm Non-Verbal Touch', subtext: 'Place a gentle hand on their shoulder or bring them a fresh drink.', archetype: 'intimate' },
      { id: 'opt-lighthearted-break', label: 'Break the Fog with Play', subtext: 'Propose a quick walk or play a favorite track to shift the energy.', archetype: 'spontaneous' },
    ],
    discussionSpark: 'Does silence between two people feel like peace, disconnection, or tension to you?',
  },
  {
    id: 'dil-comm-3',
    prompt: 'How do you prefer to communicate important or vulnerable feelings?',
    category: 'communication',
    categoryLabel: 'Communication Styles',
    context: 'Dilemma · Vulnerability Medium',
    options: [
      { id: 'opt-in-person-quiet', label: 'Face-to-Face in Quiet Room', subtext: 'Direct eye contact in a private, unhurried physical space.', archetype: 'intimate' },
      { id: 'opt-written-note', label: 'A Carefully Written Letter', subtext: 'Allows words to be chosen with precision without emotional interruptions.', archetype: 'calculated' },
      { id: 'opt-side-by-side', label: 'Side-by-Side While Driving', subtext: 'Looking forward together rather than staring directly at each other.', archetype: 'collaborative' },
      { id: 'opt-realtime-voice', label: 'Late-Night Long Audio Call', subtext: 'Intimate vocal tone without visual performance pressure.', archetype: 'spontaneous' },
    ],
    discussionSpark: 'Why do so many profound conversations happen late at night in moving cars?',
  },
  {
    id: 'dil-comm-4',
    prompt: 'You and your partner strongly disagree on a major design aesthetic choice for your shared home. What is your approach?',
    category: 'communication',
    categoryLabel: 'Communication Styles',
    context: 'Dilemma · Compromise Dynamics',
    options: [
      { id: 'opt-take-turns', label: 'Room-by-Room Ownership', subtext: 'You curate the living space; they curate the studio/bedroom.', archetype: 'direct' },
      { id: 'opt-blend-synthesis', label: 'Seek a Hybrid Aesthetic', subtext: 'Spend hours searching until you find an option you both genuinely love.', archetype: 'collaborative' },
      { id: 'opt-concede-priority', label: 'Concede to Who Cares More', subtext: 'Gauge who feels more passionate and graciously defer to them.', archetype: 'intimate' },
      { id: 'opt-consult-expert', label: 'Consult an Architect / Neutral Eye', subtext: 'Let a design professional arbitrate the functional balance.', archetype: 'calculated' },
    ],
    discussionSpark: 'Can two people with contrasting aesthetic tastes build a harmonious physical sanctuary together?',
  },
  {
    id: 'dil-comm-5',
    prompt: 'Your partner gives you a gift that is clearly well-intentioned, but completely misses your taste. How do you respond?',
    category: 'communication',
    categoryLabel: 'Communication Styles',
    context: 'Dilemma · Truth vs Sensitivity',
    options: [
      { id: 'opt-pure-gratitude', label: 'Treasure the Gesture Fully', subtext: 'Focus 100% on their intention and keep it proudly.', archetype: 'intimate' },
      { id: 'opt-gentle-truth', label: 'Gentle Honesty with Affection', subtext: 'Express genuine love for their effort, but suggest swapping it together.', archetype: 'direct' },
      { id: 'opt-humor-ribbing', label: 'Laugh Together Lovingly', subtext: 'Tease them gently and make a memorable inside joke out of it.', archetype: 'spontaneous' },
      { id: 'opt-find-utility', label: 'Find a Unique Re-Purpose', subtext: 'Find a creative way to use it that makes both of you smile.', archetype: 'collaborative' },
    ],
    discussionSpark: 'Is absolute emotional candor always better than gentle protective kindness?',
  },
  {
    id: 'dil-comm-6',
    prompt: 'In a group dinner, someone shares an opinion you know to be factually incorrect. Do you speak up?',
    category: 'communication',
    categoryLabel: 'Communication Styles',
    context: 'Dilemma · Social Friction',
    options: [
      { id: 'opt-let-it-go', label: 'Let It Pass in Silence', subtext: 'Preserve the evening’s social warmth; truth doesn’t need immediate defense.', archetype: 'intimate' },
      { id: 'opt-curious-question', label: 'Ask a Subtle Question', subtext: '"Interesting—what led you to that conclusion?" to let them re-examine.', archetype: 'collaborative' },
      { id: 'opt-polite-correction', label: 'Offer Clear Gentle Correction', subtext: 'State the accurate information pleasantly without condescension.', archetype: 'direct' },
      { id: 'opt-side-chat', label: 'Discuss It Later Privately', subtext: 'Mention it in one-on-one conversation afterward if relevant.', archetype: 'calculated' },
    ],
    discussionSpark: 'When does correcting someone stem from a desire for truth versus a desire to be right?',
  },

  // ==========================================
  // CATEGORY 3: CONFLICT RESOLUTION (6 scenarios)
  // ==========================================
  {
    id: 'dil-conf-1',
    prompt: 'During a heated disagreement, temperatures begin to rise. What is your de-escalation rhythm?',
    category: 'conflict',
    categoryLabel: 'Conflict Resolution',
    context: 'Dilemma · Heat Regulation',
    options: [
      { id: 'opt-timeout-walk', label: 'A Mandatory 20-Minute Pause', subtext: 'Step outside to breathe and reset heart rate before returning.', archetype: 'calculated' },
      { id: 'opt-push-through', label: 'Stay & Resolve Before Sleeping', subtext: 'Refuse to go to bed angry; talk it through until peace is restored.', archetype: 'direct' },
      { id: 'opt-hug-first', label: 'Physical Embrace First', subtext: 'Re-establish physical safety and touch before continuing the debate.', archetype: 'intimate' },
      { id: 'opt-write-points', label: 'Write Down Key Grievances', subtext: 'Trade notes to remove vocal tone and reactive interruptions.', archetype: 'collaborative' },
    ],
    discussionSpark: 'Do you believe in "never go to bed angry," or is sleeping on it wiser when flooded?',
  },
  {
    id: 'dil-conf-2',
    prompt: 'You realize halfway through an argument that your partner is actually 100% correct and you were wrong. What do you do?',
    category: 'conflict',
    categoryLabel: 'Conflict Resolution',
    context: 'Dilemma · Concession Grace',
    options: [
      { id: 'opt-immediate-stop', label: 'Stop Immediately & Apologize', subtext: '"Wait—you are completely right. I was wrong and I am sorry."', archetype: 'direct' },
      { id: 'opt-laugh-concede', label: 'Laugh at Your Own Stubbornness', subtext: 'Disarm the moment with humor and acknowledge your error warmly.', archetype: 'spontaneous' },
      { id: 'opt-explain-why', label: 'Explain Why You Thought That', subtext: 'Clarify the misunderstanding before formally agreeing with them.', archetype: 'calculated' },
      { id: 'opt-make-up-treat', label: 'Offer a Reparation Gesture', subtext: 'Admit defeat and declare you are buying dinner tonight.', archetype: 'intimate' },
    ],
    discussionSpark: 'How easy or difficult is it for you to say the words "I was wrong" out loud?',
  },
  {
    id: 'dil-conf-3',
    prompt: 'Both of you are physically exhausted, and a domestic chore was forgotten. Who handles it?',
    category: 'conflict',
    categoryLabel: 'Conflict Resolution',
    context: 'Dilemma · Friction Under Fatigue',
    options: [
      { id: 'opt-handle-quietly', label: 'Do It Yourself Without Words', subtext: 'Step up and solve it quietly to let your partner rest.', archetype: 'intimate' },
      { id: 'opt-do-together-speed', label: 'Tackle It Together in 3 Minutes', subtext: 'Put on high-tempo music and knock it out as a synchronized team.', archetype: 'collaborative' },
      { id: 'opt-leave-morning', label: 'Deliberately Leave It for Morning', subtext: 'Give yourselves grace; sleep is more important than tidy counters.', archetype: 'spontaneous' },
      { id: 'opt-rock-paper-scissors', label: 'Decide by a Quick Coin Flip', subtext: 'A playful game removes resentment and decides instantly.', archetype: 'calculated' },
    ],
    discussionSpark: 'When you do something extra for a partner, do you secretly expect acknowledgment?',
  },
  {
    id: 'dil-conf-4',
    prompt: 'A recurring small habit of your partner annoys you (e.g. leaving cabinet doors open). How do you address it?',
    category: 'conflict',
    categoryLabel: 'Conflict Resolution',
    context: 'Dilemma · Minor Irritants',
    options: [
      { id: 'opt-playful-callout', label: 'Lighthearted Teasing', subtext: 'Call it out with a smile and playful exaggerated mimicry.', archetype: 'spontaneous' },
      { id: 'opt-direct-request', label: 'A Direct, Calm Request', subtext: '"Hey, would you mind closing these when you finish? It helps me."', archetype: 'direct' },
      { id: 'opt-close-silently', label: 'Close Them Yourself Without Thought', subtext: 'Everyone has quirks; close them and move on with love.', archetype: 'intimate' },
      { id: 'opt-environmental-fix', label: 'Re-Engineer the Environment', subtext: 'Install soft-close magnetic hinges that shut automatically.', archetype: 'calculated' },
    ],
    discussionSpark: 'Which micro-habits in a shared space test your patience the most?',
  },
  {
    id: 'dil-conf-5',
    prompt: 'You both receive competing social invitations for the same Saturday evening: your best friend’s party vs their family milestone.',
    category: 'conflict',
    categoryLabel: 'Conflict Resolution',
    context: 'Dilemma · Competing Priorities',
    options: [
      { id: 'opt-split-evening', label: 'Attend Both: Split the Evening', subtext: 'Start at the family dinner, then head to the party together later.', archetype: 'collaborative' },
      { id: 'opt-divide-conquer', label: 'Divide and Go Independently', subtext: 'You attend yours, they attend theirs; reunite late night at home.', archetype: 'direct' },
      { id: 'opt-prioritize-family', label: 'Prioritize the Family Milestone', subtext: 'Family milestones come fewer times in life; celebrate with friends soon.', archetype: 'calculated' },
      { id: 'opt-alternate-rule', label: 'Use Established Alternating Rule', subtext: 'Check whose turn it was to pick and abide by the system.', archetype: 'intimate' },
    ],
    discussionSpark: 'Is it healthier for couples to be attached at the hip at events or circulate independently?',
  },
  {
    id: 'dil-conf-6',
    prompt: 'After a dispute, how long does emotional residue linger in you before you feel fully restored?',
    category: 'conflict',
    categoryLabel: 'Conflict Resolution',
    context: 'Dilemma · Recovery Half-Life',
    options: [
      { id: 'opt-seconds-flash', label: 'Instant Reset (< 5 Minutes)', subtext: 'Once words are resolved, the slate is completely clean.', archetype: 'spontaneous' },
      { id: 'opt-hour-breather', label: 'An Hour or Two of Soft Space', subtext: 'Need quiet recovery time before physical affection feels natural.', archetype: 'calculated' },
      { id: 'opt-overnight-reset', label: 'A Good Night’s Sleep', subtext: 'Sleep acts as the necessary neurological boundary to wipe tension.', archetype: 'direct' },
      { id: 'opt-connection-ritual', label: 'Requires a Shared Reconnection Meal', subtext: 'Restored when sharing a meaningful positive experience together.', archetype: 'intimate' },
    ],
    discussionSpark: 'What is your fastest pathway back to feeling safe and warm after emotional friction?',
  },

  // ==========================================
  // CATEGORY 4: TEAMWORK & COLLABORATION (6 scenarios)
  // ==========================================
  {
    id: 'dil-team-1',
    prompt: 'You are assembling a complex flat-pack furniture piece together with 150 screws. What is your dynamic?',
    category: 'teamwork',
    categoryLabel: 'Teamwork & Collaboration',
    context: 'Dilemma · Assembly Dynamics',
    options: [
      { id: 'opt-read-manual', label: 'One Directs, One Assembles', subtext: 'Strict division: one reads instructions and hands parts, one operates tools.', archetype: 'calculated' },
      { id: 'opt-parallel-subunits', label: 'Divide into Parallel Sub-Assemblies', subtext: 'Work independently on drawers while partner builds the frame.', archetype: 'collaborative' },
      { id: 'opt-play-instinct', label: 'Skip Manual & Rely on Intuition', subtext: 'Jump right in based on the picture on the box; improvise as you go.', archetype: 'spontaneous' },
      { id: 'opt-hire-enjoy', label: 'Pay Tasker & Enjoy Drinks Together', subtext: 'Protect relationship harmony by outsourcing the tedious build.', archetype: 'intimate' },
    ],
    discussionSpark: 'Have you ever had an argument while assembling furniture or navigating in an unfamiliar city?',
  },
  {
    id: 'dil-team-2',
    prompt: 'You are hosting a 12-person dinner party tonight and the oven fails at 5:00 PM. How do you respond?',
    category: 'teamwork',
    categoryLabel: 'Teamwork & Collaboration',
    context: 'Dilemma · Crisis Coordination',
    options: [
      { id: 'opt-pivot-outdoor', label: 'Pivot to Grill & Raw Charcuterie', subtext: 'Fire up the outdoor grill and turn it into an artisanal tapas party.', archetype: 'spontaneous' },
      { id: 'opt-order-local', label: 'Order Gourmet Catering Takeout', subtext: 'Transfer takeout into elegant ceramic dishes; no guest will mind.', archetype: 'direct' },
      { id: 'opt-debug-element', label: 'Try to Fix the Thermal Fuse', subtext: 'Grab tools and check breakers; 45 minutes to salvage the roast.', archetype: 'calculated' },
      { id: 'opt-transparent-fun', label: 'Embrace Chaos: Potluck Party', subtext: 'Text guests honestly: "Oven died! Bring your favorite dish or snack."', archetype: 'collaborative' },
    ],
    discussionSpark: 'When plans collapse in front of guests, do you get anxious or excited to improvise?',
  },
  {
    id: 'dil-team-3',
    prompt: 'In a collaborative creative endeavor, how do you handle critique of your ideas?',
    category: 'teamwork',
    categoryLabel: 'Teamwork & Collaboration',
    context: 'Dilemma · Creative Friction',
    options: [
      { id: 'opt-rigorous-debate', label: 'Rigorous Intellectual Sparring', subtext: 'Tear ideas apart aggressively to find the strongest surviving concept.', archetype: 'direct' },
      { id: 'opt-gentle-refinement', label: '"Yes, And..." Iteration', subtext: 'Build positively on every thought before discarding anything.', archetype: 'collaborative' },
      { id: 'opt-incubate-alone', label: 'Incubate Privately First', subtext: 'Flesh out concepts fully in isolation before opening them to critique.', archetype: 'calculated' },
      { id: 'opt-instinct-gut', label: 'Follow Resonant Emotional Instinct', subtext: 'If an idea feels electric and thrilling, trust the intuition.', archetype: 'spontaneous' },
    ],
    discussionSpark: 'Do you create better work in solitary reflection or high-energy debate with a partner?',
  },
  {
    id: 'dil-team-4',
    prompt: 'When managing a shared household budget, what financial philosophy suits you best?',
    category: 'teamwork',
    categoryLabel: 'Teamwork & Collaboration',
    context: 'Dilemma · Resource Governance',
    options: [
      { id: 'opt-three-pot', label: 'Yours, Mine, and Ours', subtext: 'Shared pool for expenses, plus independent private discretionary accounts.', archetype: 'calculated' },
      { id: 'opt-complete-pool', label: '100% Total Unity', subtext: 'All income flows into one combined pool; complete transparency.', archetype: 'intimate' },
      { id: 'opt-proportional-split', label: 'Proportional to Income', subtext: 'Contribute relative percentages based on earnings each month.', archetype: 'collaborative' },
      { id: 'opt-fluid-alternating', label: 'Fluid Alternating Flow', subtext: 'No rigid spreadsheets; one covers rent, one covers groceries and life.', archetype: 'spontaneous' },
    ],
    discussionSpark: 'What was money’s emotional tone in your childhood home: anxious, generous, or unspoken?',
  },
  {
    id: 'dil-team-5',
    prompt: 'You are on an escape-room challenge and stuck with 5 minutes left. What role do you naturally assume?',
    category: 'teamwork',
    categoryLabel: 'Teamwork & Collaboration',
    context: 'Dilemma · Puzzle Pressure',
    options: [
      { id: 'opt-macro-coordinator', label: 'The Strategic Coordinator', subtext: 'Step back, review all solved clues, and spot the missing logical bridge.', archetype: 'calculated' },
      { id: 'opt-hands-on-tester', label: 'The Rapid Prototyper', subtext: 'Test physical keys, dials, and mechanisms through rapid brute force.', archetype: 'spontaneous' },
      { id: 'opt-clue-hunter', label: 'The Detail Inspector', subtext: 'Examine corners, textures, and subtle inscriptions others overlooked.', archetype: 'intimate' },
      { id: 'opt-energy-booster', label: 'The Morale Engine', subtext: 'Keep spirits high, eliminate panic, and focus team momentum.', archetype: 'collaborative' },
    ],
    discussionSpark: 'Under ticking countdown pressure, do you get laser-focused, quiet, or energetic?',
  },
  {
    id: 'dil-team-6',
    prompt: 'A joint venture you both poured months into fails to gain traction. How do you navigate the aftermath?',
    category: 'teamwork',
    categoryLabel: 'Teamwork & Collaboration',
    context: 'Dilemma · Shared Setback',
    options: [
      { id: 'opt-post-mortem', label: 'Rigorous Post-Mortem', subtext: 'Document lessons learned, identify inflection points, and archive data.', archetype: 'calculated' },
      { id: 'opt-celebrate-effort', label: 'Celebrate the Audacity', subtext: 'Pop champagne for the courage to try; failure is just tuition.', archetype: 'spontaneous' },
      { id: 'opt-pivot-next', label: 'Immediate Next Hypothesis', subtext: 'Channel the momentum into the next concept within 48 hours.', archetype: 'direct' },
      { id: 'opt-retreat-rest', label: 'Take an Unplugged Sanctuary Week', subtext: 'Rest, heal, and completely detach from output for a while.', archetype: 'intimate' },
    ],
    discussionSpark: 'What has been the most instructive failure of your adult life so far?',
  },

  // ==========================================
  // CATEGORY 5: LIFESTYLE PREFERENCES (6 scenarios)
  // ==========================================
  {
    id: 'dil-life-1',
    prompt: 'An ideal Sunday morning: which rhythm feels most deeply replenishing?',
    category: 'lifestyle',
    categoryLabel: 'Lifestyle Preferences',
    context: 'Dilemma · Replenishment Rhythm',
    options: [
      { id: 'opt-slow-coffee-books', label: 'Slow Coffee & Deep Reading', subtext: 'No alarms, soft morning light, fresh brew, and hours of literature.', archetype: 'intimate' },
      { id: 'opt-trail-run-sun', label: 'Sunrise Trail Run or Swim', subtext: 'High physical exertion in nature before the world wakes up.', archetype: 'adventurous' },
      { id: 'opt-barmarket-cook', label: 'Farmers Market & Big Brunch', subtext: 'Browse artisanal produce stalls, listen to buskers, and cook together.', archetype: 'collaborative' },
      { id: 'opt-creative-flow', label: 'Early Uninterrupted Project Flow', subtext: '3 hours of deep creative writing, coding, or artistic craft.', archetype: 'calculated' },
    ],
    discussionSpark: 'Do you recharge through absolute stillness, physical movement, or creative focus?',
  },
  {
    id: 'dil-life-2',
    prompt: 'Where would your long-term sanctuary home be situated?',
    category: 'lifestyle',
    categoryLabel: 'Lifestyle Preferences',
    context: 'Dilemma · Sanctuary Geography',
    options: [
      { id: 'opt-coastal-cliff', label: 'Windswept Coastal Cliff', subtext: 'Glass pavilion overlooking ocean swells, salt air, and horizon sunset.', archetype: 'adventurous' },
      { id: 'opt-dense-urban-loft', label: 'Historic High-Ceiling Urban Loft', subtext: 'Heart of a walking metropolis; world-class galleries outside your door.', archetype: 'spontaneous' },
      { id: 'opt-mountain-forest', label: 'Deep Forest Pine Mountain Chalet', subtext: 'Wood fire, towering cedar trees, snowfall, and absolute silence.', archetype: 'intimate' },
      { id: 'opt-sunlit-farm', label: 'Mediterranean Olive Orchard Estate', subtext: 'Warm terracotta, stone walls, vegetable gardens, and vineyard tables.', archetype: 'collaborative' },
    ],
    discussionSpark: 'What sound outside your window makes you feel most profoundly at peace?',
  },
  {
    id: 'dil-life-3',
    prompt: 'How do you structure your typical evening wind-down?',
    category: 'lifestyle',
    categoryLabel: 'Lifestyle Preferences',
    context: 'Dilemma · Evening Wind-Down',
    options: [
      { id: 'opt-screenless-ritual', label: 'Strict Screen-Free Sanctuary', subtext: 'Analog records, warm tea, physical books, and dim ambient candles.', archetype: 'intimate' },
      { id: 'opt-cinematic-immersion', label: 'High-Art Cinema Experience', subtext: 'Projector screening of an extraordinary film with discussion.', archetype: 'calculated' },
      { id: 'opt-evening-stroll', label: 'Night City Walk for Gelato', subtext: 'Strolling quiet neighborhood streets under glowing streetlamps.', archetype: 'spontaneous' },
      { id: 'opt-deep-conversation', label: 'Late-Night Living Room Dialogue', subtext: 'Talking about everything and nothing until your eyelids grow heavy.', archetype: 'collaborative' },
    ],
    discussionSpark: 'Are you a true night owl who comes alive at midnight, or an early riser?',
  },
  {
    id: 'dil-life-4',
    prompt: 'When it comes to social circles, which environment do you thrive in most?',
    category: 'lifestyle',
    categoryLabel: 'Lifestyle Preferences',
    context: 'Dilemma · Social Architecture',
    options: [
      { id: 'opt-tight-few', label: 'A Tight Tribe of 3–4 Deep Friends', subtext: 'Decade-long bonds with unconditional emotional trust.', archetype: 'intimate' },
      { id: 'opt-wide-dynamic', label: 'A Wide, Eclectic Salon of Many', subtext: 'Entrepreneurs, artists, travelers, and thinkers constantly circulating.', archetype: 'spontaneous' },
      { id: 'opt-duo-focused', label: 'Partner & Select Guests', subtext: 'Primarily content in your primary partnership with intentional dinners.', archetype: 'calculated' },
      { id: 'opt-community-rooted', label: 'A Neighborhood Village Ecosystem', subtext: 'Knowing local bakers, neighbors, and baristas by their first names.', archetype: 'collaborative' },
    ],
    discussionSpark: 'Do large parties energize you or drain your battery after two hours?',
  },
  {
    id: 'dil-life-5',
    prompt: 'Your relationship with physical clutter and possessions in your living space:',
    category: 'lifestyle',
    categoryLabel: 'Lifestyle Preferences',
    context: 'Dilemma · Physical Spatial Order',
    options: [
      { id: 'opt-pure-minimalism', label: 'Extreme Architectural Minimalism', subtext: 'Bare white oak, empty surfaces, zero unnecessary objects.', archetype: 'calculated' },
      { id: 'opt-warm-maximalism', label: 'Warm, Lived-In Storybook Layering', subtext: 'Loaded bookshelves, art walls, travel textiles, and botanical plants.', archetype: 'intimate' },
      { id: 'opt-functional-utility', label: 'Pure Practical Utility', subtext: 'Things live where they are used; convenience trumps design trends.', archetype: 'direct' },
      { id: 'opt-ever-shifting', label: 'Constantly Re-arranged Gallery', subtext: 'Shifting furniture, art, and decor seasonally to reflect your mood.', archetype: 'spontaneous' },
    ],
    discussionSpark: 'Does visual clutter inside a room create mental clutter inside your head?',
  },
  {
    id: 'dil-life-6',
    prompt: 'Food philosophy: when cooking dinner at home, what is your signature mode?',
    category: 'lifestyle',
    categoryLabel: 'Lifestyle Preferences',
    context: 'Dilemma · Culinary Philosophy',
    options: [
      { id: 'opt-recipe-precision', label: 'Methodical Recipe Execution', subtext: 'Measure by the gram, follow culinary masters, achieve culinary precision.', archetype: 'calculated' },
      { id: 'opt-jazz-improvisation', label: 'Pure Intuitive Jazz Cooking', subtext: 'Taste as you go, throw spices by instinct, never make the same dish twice.', archetype: 'spontaneous' },
      { id: 'opt-farm-simplicity', label: '3 Ingredients, Peak Quality', subtext: 'Heirloom tomatoes, flaky sea salt, fresh sourdough, extraordinary olive oil.', archetype: 'intimate' },
      { id: 'opt-comfort-nourish', label: 'Hearty One-Pot Nourishment', subtext: 'Slow-simmered stews, rich curries, and warm comfort bowls.', archetype: 'collaborative' },
    ],
    discussionSpark: 'What is a comfort meal that immediately connects you to a feeling of home?',
  },

  // ==========================================
  // CATEGORY 6: TRAVEL & ADVENTURE (6 scenarios)
  // ==========================================
  {
    id: 'dil-trav-1',
    prompt: 'You arrive in Tokyo or Paris for the first time. How do you spend Day 1?',
    category: 'travel',
    categoryLabel: 'Travel & Adventure',
    context: 'Dilemma · Exploration Strategy',
    options: [
      { id: 'opt-get-lost', label: 'Put Away the Phone & Get Lost', subtext: 'Pick a direction, follow alluring alleyways, discover covert bakeries.', archetype: 'spontaneous' },
      { id: 'opt-curated-itinerary', label: 'Execute a Curated Master Map', subtext: 'Pre-vetted coffee shops, architecture icons, and museum reservations.', archetype: 'calculated' },
      { id: 'opt-slow-cafe-watch', label: 'Camp Out at a Busy Sidewalk Table', subtext: 'People-watch for hours with an espresso and journal to absorb the city.', archetype: 'intimate' },
      { id: 'opt-local-guide', label: 'Connect with a Passionate Local', subtext: 'Have a local resident reveal the secret subcultures tourists never see.', archetype: 'collaborative' },
    ],
    discussionSpark: 'Do you prefer travel itineraries packed with sights or days with zero plans?',
  },
  {
    id: 'dil-trav-2',
    prompt: 'Your travel accommodation preference for a 2-week journey:',
    category: 'travel',
    categoryLabel: 'Travel & Adventure',
    context: 'Dilemma · Travel Lodging',
    options: [
      { id: 'opt-boutique-design', label: 'Architectural Boutique Hotel', subtext: 'Exceptional interior design, crisp linens, impeccable aesthetic details.', archetype: 'calculated' },
      { id: 'opt-remote-cabin', label: 'Off-Grid Wilderness Cabin', subtext: 'Wood stove, outdoor cedar tub, stargazing, zero cell reception.', archetype: 'adventurous' },
      { id: 'opt-local-apartment', label: 'Living Like a Local in an Apartment', subtext: 'Local grocery shopping, cooking breakfast, greeting the neighbors.', archetype: 'intimate' },
      { id: 'opt-van-nomad', label: 'Camper Van Along Coastal Roads', subtext: 'Wake up wherever you park, sleep beside crashing waves.', archetype: 'spontaneous' },
    ],
    discussionSpark: 'What is the most extraordinary place you have ever woken up in?',
  },
  {
    id: 'dil-trav-3',
    prompt: 'On a mountain hike, the marked trail turns left toward the easy summit, but an unmarked ridge path climbs higher right. Which do you take?',
    category: 'travel',
    categoryLabel: 'Travel & Adventure',
    context: 'Dilemma · Trail Choice',
    options: [
      { id: 'opt-take-ridge', label: 'Climb the Unmarked Ridge', subtext: 'Breathtaking exposure, wild ridge scramble, zero other hikers.', archetype: 'adventurous' },
      { id: 'opt-stay-marked', label: 'Follow the Safe Marked Route', subtext: 'Guaranteed safe descent, predictable arrival, zero search-and-rescue risk.', archetype: 'calculated' },
      { id: 'opt-scout-first', label: 'Scout 100 Meters First', subtext: 'Inspect the footing and weather before committing to the unknown route.', archetype: 'direct' },
      { id: 'opt-pause-view', label: 'Sit and Enjoy the Meadow', subtext: 'Why race to either summit? This meadow is already magnificent.', archetype: 'intimate' },
    ],
    discussionSpark: 'Are you naturally risk-seeking or risk-averse in the wilderness?',
  },
  {
    id: 'dil-trav-4',
    prompt: 'You have a 48-hour layover in Iceland during winter. What is your priority?',
    category: 'travel',
    categoryLabel: 'Travel & Adventure',
    context: 'Dilemma · Sub-Arctic Layover',
    options: [
      { id: 'opt-aurora-chase', label: 'All-Night Aurora Borealis Chase', subtext: 'Drive through blizzard darkness to photograph the Northern Lights.', archetype: 'adventurous' },
      { id: 'opt-thermal-soak', label: 'Geothermal Lagoon Immersion', subtext: 'Steam rising into freezing arctic air while floating in mineral waters.', archetype: 'intimate' },
      { id: 'opt-ice-caving', label: 'Glacier Crevasse Exploration', subtext: 'Crampons and ice axes inside deep neon-blue volcanic glacier tunnels.', archetype: 'spontaneous' },
      { id: 'opt-reykjavik-design', label: 'Reykjavik Architecture & Book Cafes', subtext: 'Explore Icelandic literature, cozy cafes, and timber architecture.', archetype: 'calculated' },
    ],
    discussionSpark: 'Does extreme cold weather invigorate you or make you want to hibernate?',
  },
  {
    id: 'dil-trav-5',
    prompt: 'While traveling in a foreign land, a friendly village family invites you into their home for dinner. Do you accept?',
    category: 'travel',
    categoryLabel: 'Travel & Adventure',
    context: 'Dilemma · Hospitality Trust',
    options: [
      { id: 'opt-accept-delight', label: 'Accept Immediately with Gratitude', subtext: 'These human moments are the entire purpose of world travel.', archetype: 'spontaneous' },
      { id: 'opt-gentle-verify', label: 'Accept, but Bring Gift/Wine', subtext: 'Stop by a local shop first so you arrive with reciprocal hospitality.', archetype: 'intimate' },
      { id: 'opt-assess-safety', label: 'Assess Surroundings Carefully', subtext: 'Ensure comfort and safety boundaries before entering a private home.', archetype: 'calculated' },
      { id: 'opt-counter-cafe', label: 'Invite Them to a Public Cafe Instead', subtext: 'Share a meal in neutral territory where everyone is comfortable.', archetype: 'direct' },
    ],
    discussionSpark: 'How easily do you extend deep trust to strangers in foreign environments?',
  },
  {
    id: 'dil-trav-6',
    prompt: 'If you had to relocate to a new country for exactly one year, which culture would you immerse in?',
    category: 'travel',
    categoryLabel: 'Travel & Adventure',
    context: 'Dilemma · Cultural Immersion',
    options: [
      { id: 'opt-japan-craft', label: 'Kyoto, Japan: Master Crafts & Stillness', subtext: 'Wooden machiya homes, tea ceremonies, gardens, and artisanal craft.', archetype: 'calculated' },
      { id: 'opt-italy-slow', label: 'Tuscany, Italy: The Art of Slow Living', subtext: 'Long family meals, vineyards, medieval hills, and historic beauty.', archetype: 'intimate' },
      { id: 'opt-nordic-design', label: 'Copenhagen, Denmark: Design & Hygge', subtext: 'Bicycle culture, democratic design, harbor saunas, and social warmth.', archetype: 'collaborative' },
      { id: 'opt-nz-wild', label: 'South Island, New Zealand: Pure Nature', subtext: 'Fjords, alpine peaks, ocean wildlife, and unbounded open air.', archetype: 'adventurous' },
    ],
    discussionSpark: 'What cultural habit from another country do you wish your home country adopted?',
  },

  // ==========================================
  // CATEGORY 7: CREATIVE PROBLEM-SOLVING (6 scenarios)
  // ==========================================
  {
    id: 'dil-creat-1',
    prompt: 'You are granted a team of 10 world-class engineers for 6 months. What do you build?',
    category: 'creative',
    categoryLabel: 'Creative Problem-Solving',
    context: 'Dilemma · Engineering Audacity',
    options: [
      { id: 'opt-clean-energy', label: 'Next-Gen Modular Clean Energy Core', subtext: 'Compact fusion or ultra-efficient decentralized solar storage.', archetype: 'calculated' },
      { id: 'opt-human-connection', label: 'A Mindful Anti-Addictive Social Platform', subtext: 'Designed entirely to foster deep real-world intimacy and presence.', archetype: 'intimate' },
      { id: 'opt-wild-exploration', label: 'An Autonomous Ocean Deep-Diving Rover', subtext: 'Map the unexplored 80% of the abyssal oceanic seabed.', archetype: 'adventurous' },
      { id: 'opt-creative-tool', label: 'A Tactile Collaborative Instrument', subtext: 'A physical device allowing two people to compose music through touch.', archetype: 'spontaneous' },
    ],
    discussionSpark: 'If technology could solve only one human crisis next decade, what should it be?',
  },
  {
    id: 'dil-creat-2',
    prompt: 'You discover an unsolved riddle in an antique clockwork desk you purchased. How do you solve it?',
    category: 'creative',
    categoryLabel: 'Creative Problem-Solving',
    context: 'Dilemma · Hidden Mechanism',
    options: [
      { id: 'opt-decode-symbols', label: 'Decipher the Inscribed Latin Cipher', subtext: 'Linguistic and mathematical code-breaking by candlelight.', archetype: 'calculated' },
      { id: 'opt-feel-gears', label: 'Listen to the Acoustic Mechanics', subtext: 'Rotate dials slowly, feeling for subtle tumbler clicks by ear.', archetype: 'spontaneous' },
      { id: 'opt-seek-historian', label: 'Consult a Horological Historian', subtext: 'Research the master clockmaker’s archives across European records.', archetype: 'collaborative' },
      { id: 'opt-invite-partner', label: 'Make It an Unhurried Weekend Puzzle', subtext: 'Leave it on the table and tinker with it over glasses of red wine.', archetype: 'intimate' },
    ],
    discussionSpark: 'Do you enjoy puzzles with one definitive solution or open-ended creative riddles?',
  },
  {
    id: 'dil-creat-3',
    prompt: 'You must design a public monument celebrating human cooperation. What is its core form?',
    category: 'creative',
    categoryLabel: 'Creative Problem-Solving',
    context: 'Dilemma · Monument Design',
    options: [
      { id: 'opt-living-forest', label: 'A Regenerative Living Grove', subtext: 'Trees from every continent interwoven into a self-healing canopy.', archetype: 'collaborative' },
      { id: 'opt-light-tower', label: 'A Tower of Resonant Light', subtext: 'Beams of light that illuminate only when two citizens hold hands.', archetype: 'spontaneous' },
      { id: 'opt-infinite-library', label: 'An Open Subterranean Archive', subtext: 'Every citizen can contribute one handwritten page of life wisdom.', archetype: 'intimate' },
      { id: 'opt-pure-water', label: 'A Circular Infinity Fountain', subtext: 'Crystal water flowing endlessly over black granite in quiet balance.', archetype: 'calculated' },
    ],
    discussionSpark: 'What work of art or architecture has ever made you stop in your tracks with chills?',
  },
  {
    id: 'dil-creat-4',
    prompt: 'Your small team has 24 hours to present a breakthrough pitch to investors. How do you prepare?',
    category: 'creative',
    categoryLabel: 'Creative Problem-Solving',
    context: 'Dilemma · High-Stakes Narrative',
    options: [
      { id: 'opt-bulletproof-data', label: 'Obsessive Data Rigor & Proof', subtext: 'Every financial model verified, citations bulletproof, zero fluff.', archetype: 'calculated' },
      { id: 'opt-emotional-story', label: 'A Riveting Emotional Story', subtext: 'Open with a profound human dilemma that moves the room to tears.', archetype: 'intimate' },
      { id: 'opt-live-demo-risk', label: 'A Live, Unrehearsed Demonstration', subtext: 'Show the physical product working in real time; high risk, high reward.', archetype: 'spontaneous' },
      { id: 'opt-co-presentation', label: 'Harmonious Co-Presentation', subtext: 'Seamlessly passing the mic back and forth, showcasing unified trust.', archetype: 'collaborative' },
    ],
    discussionSpark: 'Are people ultimately persuaded by impeccable data or unforgettable stories?',
  },
  {
    id: 'dil-creat-5',
    prompt: 'You find an old unreleased film roll from a deceased famous artist. Developing it will reveal personal secrets. Do you publish it?',
    category: 'creative',
    categoryLabel: 'Creative Problem-Solving',
    context: 'Dilemma · Ethics of Art',
    options: [
      { id: 'opt-publish-museum', label: 'Donate Directly to an Art Museum', subtext: 'History deserves complete cultural truth regardless of discomfort.', archetype: 'direct' },
      { id: 'opt-keep-private', label: 'Protect Their Private Sanctity', subtext: 'Keep the photos sealed; an artist’s private dignity is sacred.', archetype: 'intimate' },
      { id: 'opt-consult-heirs', label: 'Consult Their Living Heirs', subtext: 'Allow those closest to their legacy to decide together.', archetype: 'collaborative' },
      { id: 'opt-creative-blend', label: 'Weave Into an Anonymous Work', subtext: 'Incorporate the imagery into a new abstract piece without naming them.', archetype: 'spontaneous' },
    ],
    discussionSpark: 'Does the public have a right to an artist’s private life after they pass away?',
  },
  {
    id: 'dil-creat-6',
    prompt: 'You have the opportunity to master one impossible skill instantaneously through neuro-plastic transfer. Which do you choose?',
    category: 'creative',
    categoryLabel: 'Creative Problem-Solving',
    context: 'Dilemma · Singular Mastery',
    options: [
      { id: 'opt-master-all-languages', label: 'Fluency in Every Earth Language', subtext: 'The ability to speak, read, and converse with every human alive.', archetype: 'collaborative' },
      { id: 'opt-virtuoso-music', label: 'Virtuoso Piano & Symphony Composition', subtext: 'Channeling profound human emotion into transcendent music.', archetype: 'intimate' },
      { id: 'opt-mathematics-physics', label: 'Unified Mathematical & Quantum Intuition', subtext: 'Seeing the fundamental fabric of spacetime and gravity directly.', archetype: 'calculated' },
      { id: 'opt-deep-healing', label: 'World-Class Surgical & Healing Hands', subtext: 'Diagnosing and repairing human physical ailments with perfection.', archetype: 'direct' },
    ],
    discussionSpark: 'If you had to spend the next 5 years mastering one single craft, what would it be?',
  },
];

export function getDilemmaById(id: string): ExtendedDilemmaScenario | undefined {
  return DILEMMAS_40.find((d) => d.id === id);
}

export function getDilemmasByCategory(category: string): ExtendedDilemmaScenario[] {
  return DILEMMAS_40.filter((d) => d.category === category);
}
