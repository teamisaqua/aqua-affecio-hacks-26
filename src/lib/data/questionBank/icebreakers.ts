export interface ChoicePrompt {
  id: string;
  activityId: string;
  prompt: string;
  categoryTag?: string;
  options: {
    id: string;
    label: string;
    subtext?: string;
  }[];
}

export const WOULD_YOU_RATHER_PROMPTS: ChoicePrompt[] = [
  {
    id: 'wyr-1',
    activityId: 'would-you-rather',
    prompt: 'How would you prefer to stay in touch during a busy week?',
    options: [
      { id: 'opt-letter', label: 'Handwritten letter every week', subtext: 'Tangible, thoughtful, and unhurried' },
      { id: 'opt-voicenote', label: 'Unexpected voice note every morning', subtext: 'Intimate, spontaneous, and immediate' },
    ],
  },
  {
    id: 'wyr-2',
    activityId: 'would-you-rather',
    prompt: 'For an anniversary trip, would you prefer...',
    options: [
      { id: 'opt-cabin', label: 'Secluded cabin with no cell reception', subtext: 'Fireside evenings, books, and stars' },
      { id: 'opt-villa', label: 'Vibrant boutique hotel in Tokyo or Lisbon', subtext: 'Night markets, design districts, and energy' },
    ],
  },
  {
    id: 'wyr-3',
    activityId: 'would-you-rather',
    prompt: 'When you are having a difficult day, would you rather...',
    options: [
      { id: 'opt-listen', label: 'Have someone listen without offering solutions', subtext: 'Pure emotional presence and comfort' },
      { id: 'opt-distract', label: 'Be whisked away for an unexpected fun distraction', subtext: 'A change of scenery and laughter' },
    ],
  },
  {
    id: 'wyr-4',
    activityId: 'would-you-rather',
    prompt: 'Would you rather explore...',
    options: [
      { id: 'opt-deep-sea', label: 'A bioluminescent deep ocean trench', subtext: 'Mysterious, quiet, and uncharted' },
      { id: 'opt-orbital', label: 'An orbital space station overlooking Earth', subtext: 'Infinite perspective and zero gravity' },
    ],
  },
  {
    id: 'wyr-5',
    activityId: 'would-you-rather',
    prompt: 'On a spontaneous Sunday afternoon, would you rather...',
    options: [
      { id: 'opt-cook', label: 'Spend 4 hours mastering a complex recipe together', subtext: 'Handmade pasta, good music, and wine' },
      { id: 'opt-walk', label: 'Walk 15,000 steps through neighborhoods you’ve never seen', subtext: 'Coffee stops and discovering architecture' },
    ],
  },
  {
    id: 'wyr-6',
    activityId: 'would-you-rather',
    prompt: 'In a long conversation, would you rather learn...',
    options: [
      { id: 'opt-childhood', label: 'Their funniest unhinged childhood memory', subtext: 'Raw nostalgia and laughter' },
      { id: 'opt-future', label: 'Their private dream project they haven’t told anyone', subtext: 'Unfiltered ambition and vulnerability' },
    ],
  },
  {
    id: 'wyr-7',
    activityId: 'would-you-rather',
    prompt: 'Would you rather have a partner who...',
    options: [
      { id: 'opt-playlist', label: 'Curates incredible personalized playlists for you', subtext: 'Always finding songs that match your mood' },
      { id: 'opt-breakfast', label: 'Wakes up early to make your favorite coffee and breakfast', subtext: 'Tactile morning care and routine' },
    ],
  },
  {
    id: 'wyr-8',
    activityId: 'would-you-rather',
    prompt: 'When traveling, would you rather...',
    options: [
      { id: 'opt-itinerary', label: 'Have every hour researched with top reservations', subtext: 'Zero wasted time and guaranteed quality' },
      { id: 'opt-wander', label: 'Have zero plans and follow recommendations from locals', subtext: 'High serendipity and unexpected adventure' },
    ],
  },
  {
    id: 'wyr-9',
    activityId: 'would-you-rather',
    prompt: 'Would you rather receive...',
    options: [
      { id: 'opt-surprise-gift', label: 'A deeply thoughtful gift you mentioned 6 months ago', subtext: 'Proof of attentive listening' },
      { id: 'opt-surprise-date', label: 'A fully planned surprise date you just have to dress for', subtext: 'Zero decision fatigue and sheer delight' },
    ],
  },
  {
    id: 'wyr-10',
    activityId: 'would-you-rather',
    prompt: 'Would you rather live in a home with...',
    options: [
      { id: 'opt-library', label: 'A floor-to-ceiling library with a fireplace', subtext: 'Warm wood, quiet sanctuary, and books' },
      { id: 'opt-garden', label: 'A sunlit glasshouse garden and rooftop terrace', subtext: 'Botanicals, morning sunlight, and fresh air' },
    ],
  },
  {
    id: 'wyr-11',
    activityId: 'would-you-rather',
    prompt: 'If you had an extra 2 hours every day, would you rather spend it...',
    options: [
      { id: 'opt-create', label: 'Making art, music, or building a side craft', subtext: 'Creative fulfillment and expression' },
      { id: 'opt-rest', label: 'Sleeping deeply and having completely unrushed mornings', subtext: 'Rejuvenation and tranquility' },
    ],
  },
  {
    id: 'wyr-12',
    activityId: 'would-you-rather',
    prompt: 'Would you rather have a partner who is...',
    options: [
      { id: 'opt-grounded', label: 'Unshakably calm and grounded during a crisis', subtext: 'A rock of composure when things get chaotic' },
      { id: 'opt-charismatic', label: 'Infectiously enthusiastic and sparks energy everywhere', subtext: 'Brings excitement and lightness to any room' },
    ],
  },
  {
    id: 'wyr-13',
    activityId: 'would-you-rather',
    prompt: 'When attending a big social event, would you rather...',
    options: [
      { id: 'opt-deep-corner', label: 'Find one person and have a 2-hour mesmerizing talk in a corner', subtext: 'Depth over breadth' },
      { id: 'opt-dance-mingle', label: 'Mingle across 10 groups, dance, and keep the energy electric', subtext: 'Social momentum and dynamism' },
    ],
  },
  {
    id: 'wyr-14',
    activityId: 'would-you-rather',
    prompt: 'Would you rather be able to...',
    options: [
      { id: 'opt-teleport', label: 'Teleport to any city for dinner and be back in bed by midnight', subtext: 'Ramen in Kyoto, gelato in Rome' },
      { id: 'opt-pause-time', label: 'Pause time for 1 hour every day just to breathe', subtext: 'Complete stillness in an accelerated world' },
    ],
  },
  {
    id: 'wyr-15',
    activityId: 'would-you-rather',
    prompt: 'Would you rather celebrate milestones with...',
    options: [
      { id: 'opt-intimate-two', label: 'Just the two of you at a Michelin chef’s counter', subtext: 'Private celebration focused entirely on each other' },
      { id: 'opt-house-party', label: 'A lively dinner party packed with your closest 15 friends', subtext: 'Shared warmth, toasts, and communal celebration' },
    ],
  },
  {
    id: 'wyr-16',
    activityId: 'would-you-rather',
    prompt: 'Would you rather discover that your partner...',
    options: [
      { id: 'opt-secret-musician', label: 'Secretly plays piano or cello like a virtuoso', subtext: 'Hidden acoustic genius' },
      { id: 'opt-secret-linguist', label: 'Speaks 4 languages fluently without bragging about it', subtext: 'Effortless cosmopolitan grace' },
    ],
  },
  {
    id: 'wyr-17',
    activityId: 'would-you-rather',
    prompt: 'Would you rather spend a rainy Saturday...',
    options: [
      { id: 'opt-boardgame', label: 'Playing cooperative strategy board games in loungewear', subtext: 'Tactile gaming and friendly rivalries' },
      { id: 'opt-film-marathon', label: 'Binge-watching an iconic film trilogy with homemade snacks', subtext: 'Cinematic immersion under cozy blankets' },
    ],
  },
  {
    id: 'wyr-18',
    activityId: 'would-you-rather',
    prompt: 'In a disagreement, would you rather your partner...',
    options: [
      { id: 'opt-say-it-now', label: 'Speak their mind immediately, even if a bit raw', subtext: 'Instant transparency and immediate resolution' },
      { id: 'opt-take-space', label: 'Take an hour to process calmly, then discuss gently', subtext: 'Emotional regulation and thoughtful words' },
    ],
  },
  {
    id: 'wyr-19',
    activityId: 'would-you-rather',
    prompt: 'Would you rather give up...',
    options: [
      { id: 'opt-no-coffee', label: 'All coffee, tea, and caffeinated drinks forever', subtext: 'Natural energy only' },
      { id: 'opt-no-streaming', label: 'All video streaming and social media for a year', subtext: 'Books, radio, and offline living' },
    ],
  },
  {
    id: 'wyr-20',
    activityId: 'would-you-rather',
    prompt: 'Would you rather have your life narrated by...',
    options: [
      { id: 'opt-attenborough', label: 'David Attenborough with quiet wonder and reverence', subtext: 'Observing your human habits with gentle awe' },
      { id: 'opt-morgan', label: 'Morgan Freeman with commanding cinematic gravitas', subtext: 'Making grocery runs sound legendary' },
    ],
  },
  {
    id: 'wyr-21',
    activityId: 'would-you-rather',
    prompt: 'Would you rather take a road trip in...',
    options: [
      { id: 'opt-vintage', label: 'A restored vintage 1970s Alfa Romeo with manual steering', subtext: 'Classic curves, wind in your hair, and analog feel' },
      { id: 'opt-luxury-camper', label: 'A high-tech panoramic campervan with a queen bed and espresso bar', subtext: 'Off-grid luxury anywhere you park' },
    ],
  },
  {
    id: 'wyr-22',
    activityId: 'would-you-rather',
    prompt: 'Would you rather always know...',
    options: [
      { id: 'opt-good-restaurant', label: 'The absolute best hidden restaurant wherever you are', subtext: 'Never eating a mediocre meal again' },
      { id: 'opt-good-weather', label: 'Have perfectly clear, 22°C golden hour weather on every weekend', subtext: 'Every day off is outdoor perfection' },
    ],
  },
  {
    id: 'wyr-23',
    activityId: 'would-you-rather',
    prompt: 'Would you rather have your partner be...',
    options: [
      { id: 'opt-hilarious', label: 'So funny you laugh until your stomach hurts every single day', subtext: 'Endless lightness and humor' },
      { id: 'opt-attentive', label: 'So intuitive they understand how you feel before you even speak', subtext: 'Deep psychological comfort and safety' },
    ],
  },
  {
    id: 'wyr-24',
    activityId: 'would-you-rather',
    prompt: 'Would you rather spend a year living in...',
    options: [
      { id: 'opt-nordic', label: 'A minimalist Nordic cabin overlooking a Norwegian fjord', subtext: 'Northern lights, hot saunas, and silence' },
      { id: 'opt-mediterranean', label: 'A sun-drenched stone farmhouse in Tuscany with an olive grove', subtext: 'Long alfresco lunches, wine, and warm breezes' },
    ],
  },
  {
    id: 'wyr-25',
    activityId: 'would-you-rather',
    prompt: 'Would you rather your first date be...',
    options: [
      { id: 'opt-arcade', label: 'Late night retro arcade, air hockey, and ice cream', subtext: 'Playful competition and laughing at bad attempts' },
      { id: 'opt-jazz', label: 'A dimly lit subterranean jazz club with candlelight', subtext: 'Low murmur, sultry sax, and rich ambience' },
    ],
  },
  {
    id: 'wyr-26',
    activityId: 'would-you-rather',
    prompt: 'Would you rather be known for...',
    options: [
      { id: 'opt-kindness', label: 'Being the kindest, most generous presence in any room', subtext: 'People feel fundamentally safe around you' },
      { id: 'opt-brilliance', label: 'Creating an original breakthrough invention or masterpiece', subtext: 'Leaving a permanent dent in the universe' },
    ],
  },
  {
    id: 'wyr-27',
    activityId: 'would-you-rather',
    prompt: 'When moving to a new home, would you rather...',
    options: [
      { id: 'opt-loft', label: 'An open-concept industrial brick loft with 16-foot ceilings', subtext: 'Sprawling creative studio vibes' },
      { id: 'opt-brownstone', label: 'A historic ivy-covered brownstone with arched doorways', subtext: 'Intimate character, history, and craft' },
    ],
  },
  {
    id: 'wyr-28',
    activityId: 'would-you-rather',
    prompt: 'Would you rather have an unlimited budget for...',
    options: [
      { id: 'opt-dinners', label: 'Culinary dining experiences anywhere in the world', subtext: 'Every meal is a multi-course adventure' },
      { id: 'opt-flights', label: 'First-class flights to any destination on earth', subtext: 'Zero friction globe-trotting' },
    ],
  },
  {
    id: 'wyr-29',
    activityId: 'would-you-rather',
    prompt: 'Would you rather have a partner who...',
    options: [
      { id: 'opt-cooks-great', label: 'Cooks magnificent meals every evening from scratch', subtext: 'Warm domestic culinary wizardry' },
      { id: 'opt-plans-dates', label: 'Discovers the coolest secret events and exhibits every week', subtext: 'Constantly keeping life fresh and curious' },
    ],
  },
  {
    id: 'wyr-30',
    activityId: 'would-you-rather',
    prompt: 'Would you rather spend New Year’s Eve...',
    options: [
      { id: 'opt-nye-fire', label: 'Watching fireworks from a hot spring under snowfall', subtext: 'Quiet, serene, and restorative' },
      { id: 'opt-nye-rooftop', label: 'Dancing on a rooftop party overlooking an illuminated harbor', subtext: 'Champagne, music, and countdown roar' },
    ],
  },
  {
    id: 'wyr-31',
    activityId: 'would-you-rather',
    prompt: 'Would you rather receive...',
    options: [
      { id: 'opt-honest-truth', label: 'Tough honest truths delivered with genuine love', subtext: 'Zero sugarcoating, 100% real growth' },
      { id: 'opt-gentle-praise', label: 'Constant affirming encouragement and unconditional cheer', subtext: 'An unwavering emotional boost every day' },
    ],
  },
  {
    id: 'wyr-32',
    activityId: 'would-you-rather',
    prompt: 'Would you rather wake up tomorrow...',
    options: [
      { id: 'opt-fluent-instruments', label: 'Able to play any musical instrument by ear', subtext: 'Instant acoustic mastery' },
      { id: 'opt-fluent-languages', label: 'Able to speak every human language fluently', subtext: 'Connect with any human on earth' },
    ],
  },
  {
    id: 'wyr-33',
    activityId: 'would-you-rather',
    prompt: 'Would you rather experience...',
    options: [
      { id: 'opt-aurora', label: 'A week under the green dancing Northern Lights in Lapland', subtext: 'Husky sleds, glass igloos, and winter magic' },
      { id: 'opt-safari', label: 'A dawn hot air balloon ride over the Serengeti migration', subtext: 'Golden sunrise, wildlife, and vast plains' },
    ],
  },
  {
    id: 'wyr-34',
    activityId: 'would-you-rather',
    prompt: 'Would you rather have your partner be...',
    options: [
      { id: 'opt-morning-person', label: 'An energized morning lark who loves sunrise walks', subtext: 'Making the most of quiet early daylight' },
      { id: 'opt-night-owl', label: 'A deep night owl who loves 1:00 AM philosophical conversations', subtext: 'Midnight tea and stargazing' },
    ],
  },
  {
    id: 'wyr-35',
    activityId: 'would-you-rather',
    prompt: 'Would you rather never have to do...',
    options: [
      { id: 'opt-no-dishes', label: 'Dishes or kitchen cleaning ever again', subtext: 'Cook freely without dreading the sink' },
      { id: 'opt-no-laundry', label: 'Laundry, folding, or ironing ever again', subtext: 'Wardrobe always magically fresh' },
    ],
  },
  {
    id: 'wyr-36',
    activityId: 'would-you-rather',
    prompt: 'Would you rather spend your 50th birthday...',
    options: [
      { id: 'opt-island-villa', label: 'Renting a private Greek island villa with your favorite people', subtext: 'Sun-bleached terraces and Mediterranean wine' },
      { id: 'opt-tented-camp', label: 'Trekking to Everest Base Camp together in mountain air', subtext: 'Rugged endurance and high adventure' },
    ],
  },
  {
    id: 'wyr-37',
    activityId: 'would-you-rather',
    prompt: 'In conversation, would you rather your partner have...',
    options: [
      { id: 'opt-sharp-wit', label: 'Lightning-fast dry wit and playful sarcasm', subtext: 'Banter that keeps you on your toes' },
      { id: 'opt-earnest-warmth', label: 'Pure unpretentious sincerity and deep curiosity', subtext: 'No games, pure warmth and listening' },
    ],
  },
  {
    id: 'wyr-38',
    activityId: 'would-you-rather',
    prompt: 'Would you rather have a partner who...',
    options: [
      { id: 'opt-takes-photos', label: 'Is an incredible photographer who captures your best angles candidly', subtext: 'A lifetime of beautiful visual memories' },
      { id: 'opt-journaler', label: 'Keeps a handwritten journal documenting all your adventures and funny quotes', subtext: 'A written chronicle of your life together' },
    ],
  },
  {
    id: 'wyr-39',
    activityId: 'would-you-rather',
    prompt: 'Would you rather eat only...',
    options: [
      { id: 'opt-pasta-tacos', label: 'Fresh handmade pasta and artisan street tacos', subtext: 'Carbs, savory sauces, and comfort' },
      { id: 'opt-sushi-thai', label: 'Pristine fresh sushi and aromatic Thai curries', subtext: 'Umami, fresh herbs, and spicy broths' },
    ],
  },
  {
    id: 'wyr-40',
    activityId: 'would-you-rather',
    prompt: 'Would you rather have...',
    options: [
      { id: 'opt-few-deep', label: 'A tight circle of 3 ride-or-die lifelong confidants', subtext: 'Immense depth, total trust, zero small talk' },
      { id: 'opt-wide-network', label: 'A vast vibrant network of 50 friends across 10 countries', subtext: 'A couch to sleep on anywhere you land' },
    ],
  },
  {
    id: 'wyr-41',
    activityId: 'would-you-rather',
    prompt: 'Would you rather design your dream weekend as...',
    options: [
      { id: 'opt-high-energy', label: 'Concert, gallery opening, dinner party, and morning brunch', subtext: 'Non-stop cultural pulse' },
      { id: 'opt-low-stim', label: 'Baking, reading 200 pages, long bath, and early sleep', subtext: 'Recharging your nervous system completely' },
    ],
  },
  {
    id: 'wyr-42',
    activityId: 'would-you-rather',
    prompt: 'When you get good news, would you rather...',
    options: [
      { id: 'opt-call-first', label: 'Call your partner immediately before telling anyone else', subtext: 'Sharing the initial spark of joy together' },
      { id: 'opt-surprise-in-person', label: 'Wait to see them in person that evening with a bottle to celebrate', subtext: 'The anticipation of an in-person toast' },
    ],
  },
];

export const THIS_OR_THAT_PAIRS: ChoicePrompt[] = [
  { id: 'tot-1', activityId: 'this-or-that', prompt: 'Scenery', options: [{ id: 'opt-mountains', label: 'Mountains' }, { id: 'opt-beach', label: 'Beaches' }] },
  { id: 'tot-2', activityId: 'this-or-that', prompt: 'Conversations', options: [{ id: 'opt-latenight', label: 'Late-night talks' }, { id: 'opt-earlymorning', label: 'Early-morning coffee' }] },
  { id: 'tot-3', activityId: 'this-or-that', prompt: 'Dating Style', options: [{ id: 'opt-planned', label: 'Curated reservations' }, { id: 'opt-spontaneous', label: 'Spontaneous wanders' }] },
  { id: 'tot-4', activityId: 'this-or-that', prompt: 'Communication', options: [{ id: 'opt-longcalls', label: 'Long 1-hour calls' }, { id: 'opt-shorttexts', label: 'Frequent short texts' }] },
  { id: 'tot-5', activityId: 'this-or-that', prompt: 'Atmosphere', options: [{ id: 'opt-speakeasy', label: 'Intimate speakeasy' }, { id: 'opt-rooftop', label: 'Bustling rooftop' }] },
  { id: 'tot-6', activityId: 'this-or-that', prompt: 'Music', options: [{ id: 'opt-headphones', label: 'Headphones alone' }, { id: 'opt-livegigs', label: 'Live concerts' }] },
  { id: 'tot-7', activityId: 'this-or-that', prompt: 'Reading', options: [{ id: 'opt-physicalbooks', label: 'Physical paper books' }, { id: 'opt-audiobooks', label: 'Audiobooks & Kindle' }] },
  { id: 'tot-8', activityId: 'this-or-that', prompt: 'Coffee Order', options: [{ id: 'opt-black', label: 'Black espresso / pour-over' }, { id: 'opt-creamy', label: 'Oat latte / flavored' }] },
  { id: 'tot-9', activityId: 'this-or-that', prompt: 'Vacation Pace', options: [{ id: 'opt-packed', label: 'See everything on foot' }, { id: 'opt-slow', label: 'Lounge poolside with a book' }] },
  { id: 'tot-10', activityId: 'this-or-that', prompt: 'Cooking', options: [{ id: 'opt-cook', label: 'Cook at home together' }, { id: 'opt-eatout', label: 'Explore new restaurants' }] },
  { id: 'tot-11', activityId: 'this-or-that', prompt: 'Home Vibe', options: [{ id: 'opt-minimalist', label: 'Sleek & minimalist' }, { id: 'opt-boho', label: 'Cozy & plant-filled' }] },
  { id: 'tot-12', activityId: 'this-or-that', prompt: 'Cinema', options: [{ id: 'opt-theater', label: 'Big screen cinema' }, { id: 'opt-couch', label: 'Living room projector' }] },
  { id: 'tot-13', activityId: 'this-or-that', prompt: 'Exercise', options: [{ id: 'opt-outdoors', label: 'Trail runs & cycling' }, { id: 'opt-gym', label: 'Gym & studio weights' }] },
  { id: 'tot-14', activityId: 'this-or-that', prompt: 'Dessert', options: [{ id: 'opt-chocolate', label: 'Dark chocolate rich cake' }, { id: 'opt-fruit', label: 'Lemon tart & sorbet' }] },
  { id: 'tot-15', activityId: 'this-or-that', prompt: 'Social Battery', options: [{ id: 'opt-extrovert', label: 'Recharged around people' }, { id: 'opt-introvert', label: 'Recharged in solitude' }] },
  { id: 'tot-16', activityId: 'this-or-that', prompt: 'Work Style', options: [{ id: 'opt-deepfocus', label: 'Silent uninterrupted blocks' }, { id: 'opt-buzz', label: 'Bustling café with background buzz' }] },
  { id: 'tot-17', activityId: 'this-or-that', prompt: 'Gift Giving', options: [{ id: 'opt-experiences', label: 'Shared experiential tickets' }, { id: 'opt-objects', label: 'Cherished physical keepsakes' }] },
  { id: 'tot-18', activityId: 'this-or-that', prompt: 'Morning Alarm', options: [{ id: 'opt-firstring', label: 'Up on the first ring' }, { id: 'opt-snooze', label: 'Snooze twice minimum' }] },
  { id: 'tot-19', activityId: 'this-or-that', prompt: 'Season', options: [{ id: 'opt-autumn', label: 'Crisp autumn & sweaters' }, { id: 'opt-summer', label: 'Sun-drenched golden summer' }] },
  { id: 'tot-20', activityId: 'this-or-that', prompt: 'Humor', options: [{ id: 'opt-drywit', label: 'Dry deadpan irony' }, { id: 'opt-silly', label: 'Goofy absurd impressions' }] },
  { id: 'tot-21', activityId: 'this-or-that', prompt: 'Night In', options: [{ id: 'opt-film', label: 'Deep cinematic movie' }, { id: 'opt-game', label: 'Board games & banter' }] },
  { id: 'tot-22', activityId: 'this-or-that', prompt: 'Packing', options: [{ id: 'opt-carryon', label: 'Strict carry-on only' }, { id: 'opt-checked', label: 'Check a bag for extra outfits' }] },
  { id: 'tot-23', activityId: 'this-or-that', prompt: 'Pet Preference', options: [{ id: 'opt-dogs', label: 'Loyal adventurous dogs' }, { id: 'opt-cats', label: 'Independent elegant cats' }] },
  { id: 'tot-24', activityId: 'this-or-that', prompt: 'Appetizers', options: [{ id: 'opt-charcuterie', label: 'Artisan cheese board' }, { id: 'opt-crispy', label: 'Crispy warm dumplings / fries' }] },
  { id: 'tot-25', activityId: 'this-or-that', prompt: 'City Living', options: [{ id: 'opt-heart', label: 'Right in the lively center' }, { id: 'opt-quiet', label: 'Green quiet tree-lined edge' }] },
  { id: 'tot-26', activityId: 'this-or-that', prompt: 'Flirting', options: [{ id: 'opt-subtle', label: 'Lingering eye contact' }, { id: 'opt-verbal', label: 'Playful teasing banter' }] },
  { id: 'tot-27', activityId: 'this-or-that', prompt: 'Bedtime', options: [{ id: 'opt-early', label: 'Asleep by 10:30 PM' }, { id: 'opt-late', label: 'Wide awake at 1:00 AM' }] },
  { id: 'tot-28', activityId: 'this-or-that', prompt: 'Transport', options: [{ id: 'opt-train', label: 'Scenic train with window seat' }, { id: 'opt-road', label: 'Open road trip with snacks' }] },
  { id: 'tot-29', activityId: 'this-or-that', prompt: 'Photography', options: [{ id: 'opt-candid', label: 'Candid unposed moments' }, { id: 'opt-scenic', label: 'Carefully framed landscapes' }] },
  { id: 'tot-30', activityId: 'this-or-that', prompt: 'Rainy Days', options: [{ id: 'opt-cozyinside', label: 'Tea, blanket, and rain sounds' }, { id: 'opt-rainwalk', label: 'Walking outside in an oversized coat' }] },
  { id: 'tot-31', activityId: 'this-or-that', prompt: 'Sunday Vibe', options: [{ id: 'opt-productive', label: 'Reset, grocery prep, organize' }, { id: 'opt-sloth', label: 'Zero chores, 100% relaxation' }] },
  { id: 'tot-32', activityId: 'this-or-that', prompt: 'Dining Out', options: [{ id: 'opt-streetfood', label: 'Sensational street food stall' }, { id: 'opt-finedining', label: 'Immaculate tasting menu' }] },
  { id: 'tot-33', activityId: 'this-or-that', prompt: 'Decision Making', options: [{ id: 'opt-gut', label: 'Trusting first gut instinct' }, { id: 'opt-proscons', label: 'Weighing all options on paper' }] },
  { id: 'tot-34', activityId: 'this-or-that', prompt: 'Living Room', options: [{ id: 'opt-tvfocus', label: 'Huge OLED screen & surround sound' }, { id: 'opt-loungefocus', label: 'Vinyl record player & conversation seating' }] },
  { id: 'tot-35', activityId: 'this-or-that', prompt: 'Texting Habit', options: [{ id: 'opt-novels', label: 'Thoughtful paragraph messages' }, { id: 'opt-bulletpoints', label: 'Quick fire one-liners and memes' }] },
  { id: 'tot-36', activityId: 'this-or-that', prompt: 'Museums', options: [{ id: 'opt-art', label: 'Modern art & design' }, { id: 'opt-history', label: 'Natural history & ancient relics' }] },
  { id: 'tot-37', activityId: 'this-or-that', prompt: 'Weekend Escape', options: [{ id: 'opt-spa', label: 'Thermal hot springs & massage' }, { id: 'opt-climb', label: 'Alpine hiking & wild camping' }] },
  { id: 'tot-38', activityId: 'this-or-that', prompt: 'Comfort Food', options: [{ id: 'opt-ramen', label: 'Steaming bowl of rich ramen' }, { id: 'opt-pizza', label: 'Wood-fired sourdough pizza' }] },
  { id: 'tot-39', activityId: 'this-or-that', prompt: 'Road Trip DJ', options: [{ id: 'opt-fullalbum', label: 'Listening to an album front to back' }, { id: 'opt-shuffle', label: 'Eclectic shuffle jumping across genres' }] },
  { id: 'tot-40', activityId: 'this-or-that', prompt: 'Life Outlook', options: [{ id: 'opt-realist', label: 'Grounded pragmatic realist' }, { id: 'opt-optimist', label: 'Unshakably hopeful romantic' }] },
  { id: 'tot-41', activityId: 'this-or-that', prompt: 'Date Night Beverage', options: [{ id: 'opt-wine', label: 'Natural wine or craft cider' }, { id: 'opt-cocktail', label: 'Smoky artisanal cocktail or mocktail' }] },
  { id: 'tot-42', activityId: 'this-or-that', prompt: 'Celebration', options: [{ id: 'opt-extravagant', label: 'Go big with fireworks and fanfare' }, { id: 'opt-quiettoast', label: 'A quiet clinking of glasses by candlelight' }] },
];
