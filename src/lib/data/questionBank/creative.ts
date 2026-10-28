export interface ItineraryStep {
  stepId: string;
  stepNumber: number;
  categoryTitle: string;
  question: string;
  options: {
    id: string;
    title: string;
    description: string;
    icon: string;
    tag?: string;
  }[];
}

export const PERFECT_DATE_STEPS: ItineraryStep[] = [
  {
    stepId: 'location',
    stepNumber: 1,
    categoryTitle: 'Setting & Backdrop',
    question: 'Where does your dream date take place?',
    options: [
      { id: 'loc-coastal', title: 'Saltwater Coast', description: 'Cliffside ocean path, sea breeze, and golden sunset', icon: 'Waves', tag: 'Romantic' },
      { id: 'loc-city', title: 'Historic Old Town', description: 'Cobblestone alleyways, string lights, and hidden courtyard cafes', icon: 'Building', tag: 'Charming' },
      { id: 'loc-nature', title: 'Alpine Meadow / Botanical Garden', description: 'Lush greenery, glasshouses, and mountain peaks', icon: 'TreePine', tag: 'Peaceful' },
      { id: 'loc-rooftop', title: 'Illuminated Skyline Rooftop', description: 'Panoramic city lights, ambient deep house, and starlight', icon: 'Sparkles', tag: 'Sleek' },
    ],
  },
  {
    stepId: 'time',
    stepNumber: 2,
    categoryTitle: 'Timing & Rhythm',
    question: 'What time of day suits this date best?',
    options: [
      { id: 'time-golden', title: 'Late Afternoon to Twilight', description: 'Catching the warm golden hour light and the first evening stars', icon: 'Sun', tag: 'Atmospheric' },
      { id: 'time-night', title: 'Late Evening into Midnight', description: 'Dim lighting, nocturnal energy, and unhurried quiet hours', icon: 'Moon', tag: 'Intimate' },
      { id: 'time-morning', title: 'Early Sunlit Morning', description: 'Fresh coffee, quiet streets, and crisp dewy air', icon: 'Coffee', tag: 'Fresh' },
      { id: 'time-allday', title: 'Sprawling All-Day Odyssey', description: 'Breakfast, exploration, lunch, adventure, and late dinner', icon: 'Compass', tag: 'Immersive' },
    ],
  },
  {
    stepId: 'food',
    stepNumber: 3,
    categoryTitle: 'Culinary Experience',
    question: 'What are you eating together?',
    options: [
      { id: 'food-tasting', title: 'Multi-Course Tasting Menu', description: 'Intimate chef’s counter with paired natural wines', icon: 'UtensilsCrossed', tag: 'Indulgent' },
      { id: 'food-cook', title: 'Homemade Pasta & Fresh Herbs', description: 'Rolling dough together with good music and laughter', icon: 'Flame', tag: 'Playful' },
      { id: 'food-street', title: 'Night Market Street Food Crawl', description: 'Sampling 5 different sizzling skewers, tacos, and desserts', icon: 'Store', tag: 'Lively' },
      { id: 'food-picnic', title: 'Artisan Blanket Picnic', description: 'Sourdough, aged cheeses, fig jam, prosciutto, and crisp cider', icon: 'Apple', tag: 'Rustic' },
    ],
  },
  {
    stepId: 'activity',
    stepNumber: 4,
    categoryTitle: 'Shared Activity',
    question: 'What is the signature interactive moment?',
    options: [
      { id: 'act-jazz', title: 'Underground Live Jazz / Acoustic Gig', description: 'Soulful sax, upright bass, and intimate table seating', icon: 'Music', tag: 'Sensual' },
      { id: 'act-arcade', title: 'Retro Arcade & Air Hockey Match', description: 'Fierce friendly competition and winning cheesy prizes', icon: 'Gamepad2', tag: 'Fun' },
      { id: 'act-art', title: 'Private Pottery or Painting Studio', description: 'Getting your hands dirty creating something tangible together', icon: 'Palette', tag: 'Creative' },
      { id: 'act-stargaze', title: 'Thermal Hot Spring & Stargazing', description: 'Steaming mineral water under a crisp blanket of constellations', icon: 'Eye', tag: 'Relaxing' },
    ],
  },
  {
    stepId: 'atmosphere',
    stepNumber: 5,
    categoryTitle: 'Music & Ambience',
    question: 'What is the acoustic vibe?',
    options: [
      { id: 'atm-bossa', title: 'Warm Vinyl Bossa Nova & Lo-Fi Jazz', description: 'Gentle acoustic warmth that invites effortless conversation', icon: 'Disc', tag: 'Smooth' },
      { id: 'atm-indie', title: 'Nostalgic Indie Folk & Melodic Strings', description: 'Heartfelt storytelling, acoustic guitars, and warmth', icon: 'Headphones', tag: 'Cozy' },
      { id: 'atm-ambient', title: 'Natural Soundscapes (Waves & Wind)', description: 'The soothing natural rhythm of nature without recorded music', icon: 'Wind', tag: 'Organic' },
      { id: 'atm-french', title: 'Upbeat French Nu-Disco & Soul', description: 'Head-bobbing rhythms and infectious joyful energy', icon: 'Radio', tag: 'Upbeat' },
    ],
  },
  {
    stepId: 'transport',
    stepNumber: 6,
    categoryTitle: 'Getting There & Back',
    question: 'How are you traveling between spots?',
    options: [
      { id: 'tra-walk', title: 'Slow Hand-in-Hand Walk', description: 'No vehicles needed—everything is within picturesque walking distance', icon: 'Footprints', tag: 'Romantic' },
      { id: 'tra-vintage', title: 'Vintage Convertible Car', description: 'Windows down, cool evening air, singing along to the radio', icon: 'Car', tag: 'Classic' },
      { id: 'tra-vespa', title: 'Two-Up on a Classic Scooter', description: 'Zipping through winding streets holding on tight', icon: 'Bike', tag: 'Spontaneous' },
      { id: 'tra-boat', title: 'Wooden Harbor Launch / Gondola', description: 'Gliding silently across illuminated dark water', icon: 'Ship', tag: 'Magical' },
    ],
  },
];

export const DREAM_TRIP_STEPS: ItineraryStep[] = [
  {
    stepId: 'dest',
    stepNumber: 1,
    categoryTitle: 'Destination Archetype',
    question: 'Where are your passports taking you?',
    options: [
      { id: 'dest-kyoto', title: 'Kyoto & Tokyo, Japan', description: 'Neon streets, bamboo groves, zen temples, and unmatched food', icon: 'Compass', tag: 'Cultural' },
      { id: 'dest-iceland', title: 'Ring Road, Iceland', description: 'Volcanoes, cascading waterfalls, glaciers, and geothermal lagoons', icon: 'Mountain', tag: 'Wild' },
      { id: 'dest-amalfi', title: 'Amalfi Coast, Italy', description: 'Terraced lemon cliffs, turquoise Mediterranean, and fresh seafood', icon: 'Sun', tag: 'Idyllic' },
      { id: 'dest-patagonia', title: 'Patagonia & Andes, Chile', description: 'Granite spires, turquoise glacial lakes, and windswept silence', icon: 'Wind', tag: 'Adventurous' },
    ],
  },
  {
    stepId: 'lodging',
    stepNumber: 2,
    categoryTitle: 'Lodging Sanctuary',
    question: 'Where are you waking up every morning?',
    options: [
      { id: 'lod-ryokan', title: 'Traditional Wood Ryokan with Private Onsen', description: 'Tatami mats, cedar wood, sliding shoji screens, and garden baths', icon: 'Home', tag: 'Serene' },
      { id: 'lod-boutique', title: 'Design-Forward Boutique Hotel', description: 'Mid-century furniture, curated art, and outstanding espresso', icon: 'Building2', tag: 'Chic' },
      { id: 'lod-cabin', title: 'Off-Grid Glass-Roof Panoramic Cabin', description: 'Watch the aurora or stars from bed with a wood-burning stove', icon: 'Sparkles', tag: 'Magical' },
      { id: 'lod-villa', title: 'Stone Farmhouse with Infinity Pool', description: 'Surrounded by lavender fields and ancient olive trees', icon: 'Castle', tag: 'Luxurious' },
    ],
  },
  {
    stepId: 'style',
    stepNumber: 3,
    categoryTitle: 'Travel Rhythm',
    question: 'What is your pacing philosophy?',
    options: [
      { id: 'sty-slow', title: 'Slow Living & Lingering', description: 'Wake up with no alarm, spend 3 hours at lunch, soak in the vibe', icon: 'Coffee', tag: 'Restorative' },
      { id: 'sty-adventure', title: 'High-Octane Exploration', description: 'Hiking 10 miles, kayaking fjords, and seeing every hidden viewpoint', icon: 'Activity', tag: 'Active' },
      { id: 'sty-gourmet', title: 'Food & Wine Pilgrimage', description: 'Planning each day around historic bakeries, markets, and culinary gems', icon: 'Utensils', tag: 'Delicious' },
      { id: 'sty-spontaneous', title: 'Pure Serendipity', description: 'No reservations—following local tips wherever the day leads', icon: 'Compass', tag: 'Exciting' },
    ],
  },
];

export const STORY_STARTERS = [
  'The train made an unscheduled stop in a misty valley neither of us had ever heard of...',
  'In the basement of the antique bookstore, an ornate brass key was tucked inside an unread atlas...',
  'The storm knocked out the island’s power right as the radio announced...',
  'We both reached for the exact same anonymous handwritten postcard at the flea market...',
  'The vintage radio in the cabin suddenly started receiving transmissions from 1974...',
];
