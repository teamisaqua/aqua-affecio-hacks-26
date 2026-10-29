export interface PredictionChallenge {
  id: string;
  category: 'Chemical Phenomenon' | 'Physics & Kinetics' | 'Social Chemistry' | 'Thermal Dynamics';
  title: string;
  setupPrompt: string; // The situation described before the outcome
  options: {
    id: string;
    text: string;
    subtext: string;
  }[];
  correctOptionId: string; // The objectively correct outcome
  scientificExplanation: string;
  funFact: string;
}

export const PREDICTION_CHALLENGES: PredictionChallenge[] = [
  // 1. Potassium in Water
  {
    id: 'pred-1',
    category: 'Chemical Phenomenon',
    title: 'Potassium Dropped into Pure Water',
    setupPrompt: 'A 2-gram cube of pure solid elemental potassium (K) is dropped into a glass tank filled with distilled water at 22°C. What immediately happens?',
    options: [
      { id: 'opt-a', text: 'It sinks to the bottom and slowly dissolves over 10 minutes without bubbles.', subtext: 'Slow passive ionic hydration.' },
      { id: 'opt-b', text: 'It floats, skates across the surface, generates lilac flames, and detonates.', subtext: 'Violent exothermic hydrogen liberation.' },
      { id: 'opt-c', text: 'It instantly freezes the surrounding water into a solid ice sphere.', subtext: 'Endothermic phase collapse.' },
      { id: 'opt-d', text: 'It turns the water neon green and emits a sweet almond scent.', subtext: 'Organic esterification.' },
    ],
    correctOptionId: 'opt-b',
    scientificExplanation: 'Potassium reacts violently with water: 2K + 2H₂O → 2KOH + H₂ + Heat. Because potassium is less dense than water, it skates on the surface. The reaction is so exothermic that the liberated hydrogen gas ignites immediately, tinged with a signature potassium lilac/purple flame.',
    funFact: 'Alkali metals get progressively more reactive down the periodic table: Lithium fizzes, Sodium burns yellow, Potassium ignites lilac, and Cesium instantly shatters glass containers.',
  },

  // 2. Mentos in Diet Coke
  {
    id: 'pred-2',
    category: 'Physics & Kinetics',
    title: 'Mentos Candy in Diet Soda',
    setupPrompt: 'Five rough mint candies are dropped simultaneously into a freshly opened 2-liter bottle of Diet Coke. Why does the dramatic geyser erupt?',
    options: [
      { id: 'opt-a', text: 'An acid-base chemical neutralization produces high-pressure carbon dioxide gas.', subtext: 'Chemical reaction producing gas.' },
      { id: 'opt-b', text: 'Physical nucleation sites on the candy surface catalyze rapid CO₂ gas release.', subtext: 'Physical phase separation without chemical reaction.' },
      { id: 'opt-c', text: 'The gelatin in the candy boils the soda through an exothermic chain reaction.', subtext: 'Rapid thermal surge.' },
      { id: 'opt-d', text: 'Artificial aspartame sweetener splits into volatile methane gas.', subtext: 'Molecular decomposition.' },
    ],
    correctOptionId: 'opt-b',
    scientificExplanation: 'This is a physical nucleation phenomenon, not a chemical reaction. The surface of a Mentos candy is covered in microscopic craters that dramatically lower the activation energy for dissolved CO₂ to form bubbles. The aspartame and potassium benzoate lower surface tension, accelerating the rapid geyser cascade.',
    funFact: 'Under an electron microscope, the surface of a single Mentos looks like a rough lunar landscape covered in millions of microscopic nucleation pits.',
  },

  // 3. Gallium Spoon in Hot Tea
  {
    id: 'pred-3',
    category: 'Thermal Dynamics',
    title: 'The Vanishing Gallium Spoon',
    setupPrompt: 'A solid silver-colored spoon crafted from pure elemental gallium (Ga) is used to stir a steaming cup of Earl Grey tea at 65°C. What occurs?',
    options: [
      { id: 'opt-a', text: 'The spoon liquefies into a molten silver puddle at the bottom of the cup.', subtext: 'Melting point at human body temperature.' },
      { id: 'opt-b', text: 'The spoon absorbs all the heat and rapidly chills the tea to freezing.', subtext: 'High thermal heat capacity.' },
      { id: 'opt-c', text: 'The spoon turns pitch black and emits harmless nitrogen gas.', subtext: 'Surface oxidation.' },
      { id: 'opt-d', text: 'Nothing happens; gallium is a durable structural transition metal.', subtext: 'Heat resistant lattice.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Gallium has an exceptionally low melting point of just 29.76°C (85.57°F). It melts in the human hand and completely liquefies in hot tea into a shiny non-toxic liquid metal pool, famously inspiring chemist Primo Levi’s stories.',
    funFact: 'Gallium will attack aluminum structure; a single drop of liquid gallium will permeate the crystal boundaries of an aluminum beverage can, making it crumble like dry paper.',
  },

  // 4. Sodium Polyacrylate in Water
  {
    id: 'pred-4',
    category: 'Chemical Phenomenon',
    title: 'Super-Absorbent Polymer Hydration',
    setupPrompt: '5 grams of white sodium polyacrylate powder is placed into a beaker, and 200 ml of pure water is poured on top. What occurs within 5 seconds?',
    options: [
      { id: 'opt-a', text: 'The liquid completely vanishes into a solid fluffy white gel that won’t spill if inverted.', subtext: 'High-osmotic hydrogel expansion.' },
      { id: 'opt-b', text: 'The beaker shatters from an explosive freezing shockwave.', subtext: 'Rapid crystallization.' },
      { id: 'opt-c', text: 'The powder dissolves into clear liquid identical to tap water.', subtext: 'Complete simple dissolution.' },
      { id: 'opt-d', text: 'Thick violet smoke billows out of the beaker.', subtext: 'Gas combustion.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Sodium polyacrylate contains sodium carboxylate groups that draw water into the cross-linked polymer network via strong osmotic pressure. It can absorb 300 to 800 times its own mass in distilled water, instantly locking liquid into an immovable solid gel.',
    funFact: 'This same non-toxic polymer is the active absorbent material inside disposable diapers and artificial movie snow.',
  },

  // 5. Helium Balloon in Accelerating Car
  {
    id: 'pred-5',
    category: 'Physics & Kinetics',
    title: 'The Floating Helium Car Paradox',
    setupPrompt: 'A helium-filled party balloon floats freely inside a car with all windows closed. When the driver presses the gas pedal and accelerates forward, which way does the balloon move?',
    options: [
      { id: 'opt-a', text: 'It drifts backward toward the rear window due to classical inertia.', subtext: 'Newtonian backward inertia.' },
      { id: 'opt-b', text: 'It moves forward toward the front windshield.', subtext: 'Air pressure buoyancy gradient.' },
      { id: 'opt-c', text: 'It stays completely still at its exact spatial coordinate.', subtext: 'Neutral equilibrium.' },
      { id: 'opt-d', text: 'It immediately pops from the cabin pressure shock.', subtext: 'Pressure drop.' },
    ],
    correctOptionId: 'opt-b',
    scientificExplanation: 'Because the heavier air inside the car has more mass than the helium balloon, the air rushes to the back of the car when accelerating forward. This creates a dense high-pressure pocket at the rear, which buoys the lighter helium balloon forward toward the windshield!',
    funFact: 'Einstein used this exact principle of equivalence (gravitational mass vs inertial mass) to develop the foundations of General Relativity.',
  },

  // 6. Copper Coin in Nitric Acid
  {
    id: 'pred-6',
    category: 'Chemical Phenomenon',
    title: 'Copper Coin Meets Concentrated Nitric Acid',
    setupPrompt: 'A shiny pure copper coin is submerged in concentrated nitric acid (HNO₃). What observable transformation takes place?',
    options: [
      { id: 'opt-a', text: 'The liquid turns vibrant emerald blue-green while dense reddish-brown gas billows out.', subtext: 'Cu²⁺ ion solvation and toxic NO₂ gas evolution.' },
      { id: 'opt-b', text: 'The coin is electroplated with pure gold luster.', subtext: 'Surface transmutation.' },
      { id: 'opt-c', text: 'Zero reaction; copper is a noble metal that does not react with acids.', subtext: 'Acid-resistant passivation.' },
      { id: 'opt-d', text: 'The solution turns milky white and precipitates as chalk.', subtext: 'Carbonate formation.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Concentrated nitric acid is a powerful oxidizing acid: Cu + 4HNO₃ → Cu(NO₃)₂ + 2NO₂ + 2H₂O. The hydrated Cu²⁺ copper ions impart an intense green-blue color, while toxic, choking reddish-brown nitrogen dioxide (NO₂) gas violently boils off.',
    funFact: 'American chemist Ira Remsen famously recalled discovering this in 1865: "I learned more chemistry in those five minutes than in years of book reading."',
  },

  // 7. Elephant Toothpaste (Hydrogen Peroxide + Potassium Iodide)
  {
    id: 'pred-7',
    category: 'Chemical Phenomenon',
    title: 'Catalyzed Hydrogen Peroxide Decomposition',
    setupPrompt: 'Concentrated 30% hydrogen peroxide is mixed with dish soap, and a dissolved potassium iodide catalyst is added. What happens?',
    options: [
      { id: 'opt-a', text: 'A massive steaming cylinder of warm oxygen foam erupts high into the air.', subtext: 'Extreme enzymatic/catalytic foam eruption.' },
      { id: 'opt-b', text: 'The mixture turns into an ultra-cold block of solid dry ice.', subtext: 'Endothermic crystal formation.' },
      { id: 'opt-c', text: 'The solution forms a thin oily film with no visible bubbles.', subtext: 'Soap emulsification.' },
      { id: 'opt-d', text: 'It generates electric sparks without producing foam.', subtext: 'Plasma discharge.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Iodide ions catalytically accelerate the decomposition of hydrogen peroxide: 2H₂O₂ → 2H₂O + O₂. The immense volume of released oxygen gas is instantly trapped by the dish soap bubbles, erupting into a gigantic, hot steaming tower of foam.',
    funFact: 'Because the reaction is highly exothermic, the resulting foam can reach over 80°C (176°F) and emits pure steam.',
  },

  // 8. Water Boiled in a Vacuum
  {
    id: 'pred-8',
    category: 'Thermal Dynamics',
    title: 'Room-Temperature Water Under Deep Vacuum',
    setupPrompt: 'A glass of room-temperature water at 20°C is placed inside a sealed bell jar, and a mechanical vacuum pump extracts the air. What occurs as pressure falls below 23 mbar?',
    options: [
      { id: 'opt-a', text: 'The water boils vigorously at room temperature, then freezes into solid ice.', subtext: 'Simultaneous boiling and evaporative freezing.' },
      { id: 'opt-b', text: 'The water gets burning hot to the touch as it boils.', subtext: 'Thermal pressure transfer.' },
      { id: 'opt-c', text: 'The water stays completely still and turns bright blue.', subtext: 'Atmospheric light shift.' },
      { id: 'opt-d', text: 'The glass container implodes into sand.', subtext: 'Tensile collapse.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Boiling occurs when vapor pressure equals external pressure. In a vacuum, water boils vigorously at 20°C. The latent heat of vaporization carries away so much thermal energy from the remaining liquid that it rapidly chills and freezes into solid ice while still boiling!',
    funFact: 'The intersection where water simultaneously boils, freezes, and condenses is called the "Triple Point" (0.01°C and 6.11 mbar).',
  },

  // 9. Prince Rupert's Drop
  {
    id: 'pred-9',
    category: 'Physics & Kinetics',
    title: 'The Indestructible Prince Rupert’s Drop',
    setupPrompt: 'A molten glass tadpole quenched in cold water creates a Prince Rupert’s Drop. You hit the bulbous head with a steel hammer, but nip the thin tail with pliers. What happens?',
    options: [
      { id: 'opt-a', text: 'The bulb withstands the hammer blow, but clipping the tail causes the entire drop to explosively pulverize.', subtext: 'Extreme internal compressive tension.' },
      { id: 'opt-b', text: 'The bulb shatters like ordinary glass on the first hammer tap.', subtext: 'Brittle glass failure.' },
      { id: 'opt-c', text: 'The drop bounces like rubber and cannot be damaged by any tool.', subtext: 'Polymerized elasticity.' },
      { id: 'opt-d', text: 'Clipping the tail causes the glass to melt back into molten lava.', subtext: 'Friction release.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Quenching cools the exterior glass rapidly while the molten interior slowly contracts, locking the outer surface into massive compressive stress (>100,000 psi). The bulb can resist bullets and hammers, but disrupting the fragile tail releases a stress shockwave traveling at 1.5 km/s, instantly shattering the entire drop into fine powder.',
    funFact: 'High-speed cameras filming at 100,000 frames per second show the crack bifurcation wave traveling through the drop at Mach 4.5.',
  },

  // 10. Social Chemistry: The Elevator Mirror Effect
  {
    id: 'pred-10',
    category: 'Social Chemistry',
    title: 'The Elevator Social Calibration Effect',
    setupPrompt: 'Two strangers enter an empty elevator with mirror-backed walls. Where do their eyes gaze within the first 6 seconds?',
    options: [
      { id: 'opt-a', text: 'Unbroken direct eye contact with each other while standing still.', subtext: 'Dominance calibration.' },
      { id: 'opt-b', text: 'Upward at floor numbers, downward at phone screens, or into their own reflection to minimize mutual gaze tension.', subtext: 'Subconscious civil inattention.' },
      { id: 'opt-c', text: 'Staring continuously at the door handles.', subtext: 'Spatial exit bias.' },
      { id: 'opt-d', text: 'Spontaneously introducing themselves 90% of the time.', subtext: 'High conversational impulse.' },
    ],
    correctOptionId: 'opt-b',
    scientificExplanation: 'Sociologist Erving Goffman termed this "Civil Inattention": in confined physical spaces like elevators, strangers unconsciously respect mutual personal boundary bubbles by deliberately diverting gaze to floor indicators, reflections, or phones to signal non-threatening presence.',
    funFact: 'When a confederate actor deliberately faces backward in an elevator, up to 75% of naive passengers will turn around and face backward too due to conformity pressure.',
  },

  // 11. Bismuth Crystal Rainbow
  {
    id: 'pred-11',
    category: 'Chemical Phenomenon',
    title: 'The Iridescent Bismuth Hopper Crystal',
    setupPrompt: 'High-purity molten bismuth metal is cooled slowly in an insulated ceramic ladle. As the geometric hopper crystals solidify in air, why do they glow in rainbow iridescent hues?',
    options: [
      { id: 'opt-a', text: 'A microscopically thin bismuth oxide layer causes optical thin-film light interference.', subtext: 'Interference wave phase cancellation.' },
      { id: 'opt-b', text: 'Radioactive decay produces visible Cherenkov radiation.', subtext: 'Subatomic particle glow.' },
      { id: 'opt-c', text: 'The metal absorbs ambient indoor dye pigments.', subtext: 'Pigment absorption.' },
      { id: 'opt-d', text: 'Bismuth contains natural prismatic glass fibers.', subtext: 'Fiber optic refraction.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'When hot bismuth contacts air, it forms a microscopic transparent bismuth oxide (Bi₂O₃) surface film. Light reflecting off the top of the oxide layer interferes with light reflecting off the metal beneath. Varying film thickness across the stepped crystal creates vibrant rainbow interference colors, similar to an oil slick.',
    funFact: 'Bismuth is element 83. Although technically radioactive, its half-life of 20 quintillion years is over a billion times older than the age of the universe!',
  },

  // 12. Supercooled Beer Tap
  {
    id: 'pred-12',
    category: 'Thermal Dynamics',
    title: 'The Instant Freeze Beer Bottle Tap',
    setupPrompt: 'An unopened glass bottle of filtered beer is chilled undisturbed to -3°C without freezing. You open the cap and tap the base on the table. What happens?',
    options: [
      { id: 'opt-a', text: 'A wave of solid slushy ice cascades from the neck to the base in under 3 seconds.', subtext: 'Sudden nucleation of supercooled liquid.' },
      { id: 'opt-b', text: 'The bottle explodes from instantaneous thermal steam shock.', subtext: 'Vapor explosion.' },
      { id: 'opt-c', text: 'The beer separates into pure water at the top and pure alcohol at the bottom.', subtext: 'Density stratification.' },
      { id: 'opt-d', text: 'Nothing happens; alcohol prevents all freezing.', subtext: 'Antifreeze stability.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Without dust or scratches to act as seed crystals, pure liquid can be "supercooled" below its normal freezing point. Opening the cap releases pressure and tapping the base creates cavitation bubbles that provide instant nucleation sites, triggering rapid dendritic ice crystal propagation through the bottle.',
    funFact: 'Airplane wings encounter the same danger from supercooled water droplets in clouds, which instantly freeze on leading edges upon impact.',
  },

  // 13. Lycopodium Powder on Water
  {
    id: 'pred-13',
    category: 'Physics & Kinetics',
    title: 'The Dry Hand in Water Trick',
    setupPrompt: 'A fine layer of non-polar lycopodium spore powder is dusted over a bowl of water. You plunge your dry hand directly to the bottom and pull it out. What does your hand look like?',
    options: [
      { id: 'opt-a', text: 'Your hand emerges completely bone-dry with powder clinging to the skin.', subtext: 'Extreme hydrophobic barrier envelope.' },
      { id: 'opt-b', text: 'Your hand turns into a solid slippery slime that cannot be washed off.', subtext: 'Cross-linked mucilage.' },
      { id: 'opt-c', text: 'Your hand is soaking wet with zero powder remaining.', subtext: 'Complete powder displacement.' },
      { id: 'opt-d', text: 'Your skin is stained dark indigo blue.', subtext: 'Iodine indicator reaction.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Lycopodium spores are coated in waxy, hydrophobic fats. The water’s high surface tension prevents wetting the spores, so as your hand enters, the powder wraps around your skin like a flexible hydrophobic glove, keeping your hand 100% dry!',
    funFact: 'Because lycopodium powder is so fine and flammable when dispersed in air, it was used as early camera flash powder and stage fire effects in the 19th century.',
  },

  // 14. Non-Newtonian Oobleck Impact
  {
    id: 'pred-14',
    category: 'Physics & Kinetics',
    title: 'Sprinting Across Cornstarch & Water (Oobleck)',
    setupPrompt: 'A 2:1 mix of cornstarch and water fills a swimming pool. If you run across it rapidly vs standing still, what happens?',
    options: [
      { id: 'opt-a', text: 'Running feels like solid ground underfoot, but stopping causes you to sink like quicksand.', subtext: 'Shear-thickening dilatant fluid mechanics.' },
      { id: 'opt-b', text: 'You sink immediately whether running or standing.', subtext: 'Ordinary low viscosity fluid.' },
      { id: 'opt-c', text: 'Running causes it to become slippery like ice.', subtext: 'Shear-thinning pseudoplastic.' },
      { id: 'opt-d', text: 'Standing still pushes you upward like a trampoline.', subtext: 'Hydraulic spring recoil.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Oobleck is a shear-thickening non-Newtonian fluid. Under high stress (striking or running), the starch granules jam together, forcing water out from between them and behaving like a rigid solid. Under gentle low stress (standing), water lubricates the granules and you sink.',
    funFact: 'Engineers are testing shear-thickening fluids inside body armor to create flexible vests that instantly lock rigid upon bullet impact.',
  },

  // 15. Social Chemistry: Synchronous Tapping & Affiliation
  {
    id: 'pred-15',
    category: 'Social Chemistry',
    title: 'The Shared Rhythmic Synchrony Effect',
    setupPrompt: 'Two participants are asked to tap their fingers to a metronome: Group A taps to the exact same synchronized beat; Group B taps to contrasting out-of-sync beats. Afterwards, they play a cooperation game. What happens?',
    options: [
      { id: 'opt-a', text: 'Group A (synchronized) shows significantly higher mutual trust, generosity, and collaboration.', subtext: 'Neurological behavioral entrainment.' },
      { id: 'opt-b', text: 'Group B (out-of-sync) shows higher cooperation due to perceived individuality.', subtext: 'Complementarity bias.' },
      { id: 'opt-c', text: 'Finger tapping has zero measurable correlation to social trust.', subtext: 'Null cognitive linkage.' },
      { id: 'opt-d', text: 'Both groups become competitive and refuse to share tokens.', subtext: 'Rhythm fatigue.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Extensive psychological research (Hove & Risen, 2009) confirms that synchronous rhythmic movement triggers neural entrainment and releases endorphins/oxytocin. Moving together in time creates perceived self-other overlap, boosting interpersonal liking, empathy, and collaborative generosity.',
    funFact: 'Military marching, choral singing, and communal tribal dancing evolved over millennia as evolutionary bonding rituals specifically to induce rhythmic social cohesion.',
  },

  // 16. Magnesium Ribbon in Dry Ice
  {
    id: 'pred-16',
    category: 'Chemical Phenomenon',
    title: 'Magnesium Burning Inside Solid Carbon Dioxide',
    setupPrompt: 'A burning magnesium ribbon is sealed inside a hollow cavity between two blocks of solid dry ice (CO₂). Since CO₂ extinguishes normal fire, what happens to the magnesium?',
    options: [
      { id: 'opt-a', text: 'The magnesium burns blindingly bright, stealing oxygen from CO₂ and depositing black elemental carbon.', subtext: 'Extreme reduction stripping oxygen from carbon.' },
      { id: 'opt-b', text: 'The fire goes out instantly within 0.1 seconds from oxygen starvation.', subtext: 'Fire suppression.' },
      { id: 'opt-c', text: 'The dry ice shatters into liquid carbon monoxide bubbles.', subtext: 'Phase collapse.' },
      { id: 'opt-d', text: 'The magnesium turns into gold foil.', subtext: 'Alchemical myth.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Magnesium has an extraordinary affinity for oxygen that exceeds carbon: 2Mg + CO₂ → 2MgO + C. Magnesium rips the oxygen directly out of carbon dioxide, continuing to burn brilliantly while leaving behind white magnesium oxide and black soot of elemental carbon!',
    funFact: 'Because burning magnesium reacts with both water and carbon dioxide, standard class A/B/C fire extinguishers only feed magnesium fires; only Class D dry powder can extinguish it.',
  },

  // 17. The Chameleon Chemical Reaction (Sugar + NaOH + KMnO4)
  {
    id: 'pred-17',
    category: 'Chemical Phenomenon',
    title: 'The Chemical Chameleon Flask',
    setupPrompt: 'Potassium permanganate (purple) is stirred into a basic sugar solution. What visual color progression occurs as manganese changes oxidation states?',
    options: [
      { id: 'opt-a', text: 'Purple (+7) shifts to Green (+6) to Yellow/Amber (+4) in continuous sequence.', subtext: 'Stepwise reduction of manganese valence states.' },
      { id: 'opt-b', text: 'It stays dark purple and turns into solid stone.', subtext: 'Precipitation.' },
      { id: 'opt-c', text: 'It flashes bright neon pink and immediately clears to water.', subtext: 'Rapid bleaching.' },
      { id: 'opt-d', text: 'It turns jet black and emits steam.', subtext: 'Complete reduction.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'The sugar slowly donates electrons to reduce manganese: MnO₄⁻ (purple, +7) reduces to manganate MnO₄²⁻ (deep green, +6), which further reduces to colloidal manganese dioxide MnO₂ (golden yellow/amber, +4).',
    funFact: 'Manganese has the widest range of oxidation states of any common element, from -3 all the way to +7, each with a distinct color signature.',
  },

  // 18. Boiling Water in Liquid Nitrogen
  {
    id: 'pred-18',
    category: 'Thermal Dynamics',
    title: 'Boiling Water Poured into Liquid Nitrogen',
    setupPrompt: 'A kettle of boiling water at 100°C is dumped directly into a bucket of liquid nitrogen at -196°C. What is the immediate result?',
    options: [
      { id: 'opt-a', text: 'A massive 10-meter white cloud volcano explodes upward with a loud roar.', subtext: 'Instantaneous nitrogen vaporization and condensed steam fog.' },
      { id: 'opt-b', text: 'A completely silent block of transparent glass forms at the bottom.', subtext: 'Vitrifaction.' },
      { id: 'opt-c', text: 'The liquid nitrogen turns bright neon yellow.', subtext: 'Hydride formation.' },
      { id: 'opt-d', text: 'The boiling water chills to room temperature peacefully.', subtext: 'Equilibrium.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'The 300°C temperature delta causes liquid nitrogen to flash-boil into gas, expanding roughly 700 times in volume within milliseconds. The violent upward rush carries atomized water droplets, which condense atmospheric moisture into an immense rolling white cloud plume.',
    funFact: 'The white cloud you see is not nitrogen (nitrogen gas is invisible); it is liquid water droplets condensed out of the surrounding ambient air.',
  },

  // 19. Lenz's Law Magnet Down Copper Pipe
  {
    id: 'pred-19',
    category: 'Physics & Kinetics',
    title: 'Neodymium Magnet Dropped Through a Copper Pipe',
    setupPrompt: 'Copper is non-magnetic. If you drop a strong neodymium magnet down a 1-meter vertical hollow copper pipe, what happens?',
    options: [
      { id: 'opt-a', text: 'The magnet falls in extreme slow-motion as if floating through thick honey.', subtext: 'Eddy current Lenz’s Law magnetic braking.' },
      { id: 'opt-b', text: 'The magnet falls at normal gravitational acceleration (9.8 m/s²) with zero delay.', subtext: 'Zero attraction.' },
      { id: 'opt-c', text: 'The magnet sticks permanently to the top rim and refuses to fall.', subtext: 'Permanent lock.' },
      { id: 'opt-d', text: 'The copper pipe heats up to cherry red and melts.', subtext: 'Resistance overload.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'By Faraday’s and Lenz’s laws, the falling magnetic field induces swirling electrical eddy currents in the conductive copper pipe. These currents generate an opposing magnetic field pointing upward, creating magnetic levitation braking that slows the magnet to a slow glide.',
    funFact: 'Modern high-speed magnetic rollercoasters and bullet trains use this exact eddy-current mechanism for friction-free, fail-safe emergency brakes.',
  },

  // 20. Social Chemistry: The 36 Questions to Love
  {
    id: 'pred-20',
    category: 'Social Chemistry',
    title: 'The Aron Interpersonal Closeness Protocol',
    setupPrompt: 'In Arthur Aron’s famous 1997 study, two complete strangers spent 45 minutes answering progressively deeper, vulnerable personal questions followed by 4 minutes of silent mutual eye contact. What was the measured outcome?',
    options: [
      { id: 'opt-a', text: 'Significantly elevated feelings of mutual intimacy, closeness, and trust compared to casual conversation controls.', subtext: 'Structured reciprocal vulnerability.' },
      { id: 'opt-b', text: 'Extreme social awkwardness and resentment that caused both to leave early.', subtext: 'Vulnerability rejection.' },
      { id: 'opt-c', text: 'Zero measurable change in relationship closeness.', subtext: 'Standard baseline.' },
      { id: 'opt-d', text: 'Participants forgot what their partner looked like within 24 hours.', subtext: 'Cognitive erasure.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Aron proved that intimacy between humans does not require years of passive contact; it is accelerated by "sustained, escalating, reciprocal, personal self-disclosure." Sharing vulnerabilities signals safety and prompts mutual emotional investment.',
    funFact: 'Two of the test subjects in the original 1997 study fell in love and invited the research laboratory team to their wedding six months later.',
  },

  // 21. Sulfuric Acid on Pure Sugar
  {
    id: 'pred-21',
    category: 'Chemical Phenomenon',
    title: 'Sulfuric Acid Meets Cane Sugar (The Carbon Snake)',
    setupPrompt: 'Concentrated sulfuric acid (H₂SO₄) is poured over a beaker of pure granulated table sugar (C₁₂H₂₂O₁₁). What emerges?',
    options: [
      { id: 'opt-a', text: 'A towering, steaming black column of pure carbon erupts out of the beaker smelling of burnt caramel.', subtext: 'Dehydration stripping water from carbohydrates.' },
      { id: 'opt-b', text: 'The sugar dissolves into a clear, sweet syrup.', subtext: 'Simple dissolution.' },
      { id: 'opt-c', text: 'The mixture turns bright pink and turns to glass.', subtext: 'Condensation.' },
      { id: 'opt-d', text: 'The beaker freezes solid with blue crystals.', subtext: 'Hydrate crystallization.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Sulfuric acid has an immense affinity for water. It chemically rips the hydrogen and oxygen atoms out of the carbohydrate molecule (C₁₂H₂₂O₁₁ → 12C + 11H₂O). The heat vaporizes the water into steam, puffing the remaining elemental carbon into an expanding black porous pillar.',
    funFact: 'The resulting black snake is nearly 100% pure elemental carbon, identical in chemistry to charcoal.',
  },

  // 22. Sound Wave Fire Extinguisher
  {
    id: 'pred-22',
    category: 'Physics & Kinetics',
    title: 'Extinguishing Flames with Deep Bass Sound Waves',
    setupPrompt: 'A directional acoustic subwoofer blasts low-frequency deep bass sound waves (30 to 60 Hz) directly at an open campfire flame. What happens?',
    options: [
      { id: 'opt-a', text: 'The acoustic pressure wave thins the boundary layer and snuffs out the flame instantly.', subtext: 'Acoustic boundary displacement.' },
      { id: 'opt-b', text: 'The sound waves feed oxygen and cause a giant fireball explosion.', subtext: 'Acoustic acceleration.' },
      { id: 'opt-c', text: 'Sound waves pass right through flames with zero physical effect.', subtext: 'Wave decoupling.' },
      { id: 'opt-d', text: 'The fire changes color to bright green.', subtext: 'Sonic ionization.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Sound waves are mechanical pressure waves. At 30–60 Hz, the acoustic air velocity increases local air velocity, thinning the thermal boundary layer where combustion occurs and separating the vaporized fuel from oxygen, cleanly extinguishing the fire without water or chemicals.',
    funFact: 'DARPA and George Mason University engineering students patented hand-held acoustic fire extinguishers for use in zero-gravity space stations.',
  },

  // 23. Iodine Clock Reaction (Starch + Hydrogen Peroxide)
  {
    id: 'pred-23',
    category: 'Chemical Phenomenon',
    title: 'The Landolt Iodine Clock Reaction',
    setupPrompt: 'Two completely clear, transparent liquids are poured together into a beaker and stirred. For 40 seconds, absolutely nothing seems to happen. Suddenly, at second 41, what occurs?',
    options: [
      { id: 'opt-a', text: 'In a single millisecond fraction of a second, the liquid turns jet midnight blue-black.', subtext: 'Instantaneous triiodide-starch complex formation.' },
      { id: 'opt-b', text: 'The liquid slowly fades through pale yellow over 10 minutes.', subtext: 'Gradual oxidation.' },
      { id: 'opt-c', text: 'The liquid boils over with green sparks.', subtext: 'Thermal ignition.' },
      { id: 'opt-d', text: 'The liquid turns into solid ice.', subtext: 'Phase shift.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Two competing reactions occur: triiodide is rapidly consumed by thiosulfate. The moment thiosulfate runs out completely, free triiodide accumulates instantly and binds into the helical core of starch molecules, producing an instantaneous color flip from clear to black.',
    funFact: 'The transition happens so quickly (<0.01 seconds) that to the human eye it appears like a digital light switch turned on.',
  },

  // 24. Ferrofluid Magnetic Spike Art
  {
    id: 'pred-24',
    category: 'Physics & Kinetics',
    title: 'Ferrofluid Near a Rare-Earth Magnet',
    setupPrompt: 'A smooth black puddle of colloidal ferrofluid (nanoscale iron oxide particles in oil) sits in a petri dish. A strong neodymium magnet is brought beneath the dish. What happens to the liquid surface?',
    options: [
      { id: 'opt-a', text: 'The liquid self-organizes into an array of sharp 3D spikes resembling an alien hedgehog.', subtext: 'Rosensweig normal-field magnetic instability.' },
      { id: 'opt-b', text: 'The liquid boils away into colorless gas.', subtext: 'Magnetic heating.' },
      { id: 'opt-c', text: 'The liquid flattens out into an ultra-thin mirror.', subtext: 'Magnetic compression.' },
      { id: 'opt-d', text: 'The liquid turns bright silver.', subtext: 'Valence reduction.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'The magnetic particles align with magnetic field lines. Above a threshold field strength, the magnetic force overcomes surface tension and gravity in the Cowley-Rosensweig instability, forming geometric conical spikes that minimize the total energetic state.',
    funFact: 'NASA originally invented ferrofluid in the 1960s to pump rocket fuel in zero-gravity space environments without mechanical gravity feed.',
  },

  // 25. Liquid Nitrogen Balloon Contraction
  {
    id: 'pred-25',
    category: 'Thermal Dynamics',
    title: 'Inflated Party Balloon in Liquid Nitrogen',
    setupPrompt: 'A fully inflated, tied latex balloon is plunged into liquid nitrogen at -196°C. It shrivels down to a flat, wrinkled disk. What happens when you set it back on the room table?',
    options: [
      { id: 'opt-a', text: 'It spontaneously re-inflates back to its original bouncy spherical shape undamaged.', subtext: 'Charles’s Law gas expansion and latex polymer elastic recovery.' },
      { id: 'opt-b', text: 'It remains permanently flat and brittle forever.', subtext: 'Permanent molecular damage.' },
      { id: 'opt-c', text: 'It explodes violently into a thousand rubber pieces.', subtext: 'Rupture.' },
      { id: 'opt-d', text: 'It melts into a gooey puddle of liquid latex.', subtext: 'Polymer degradation.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'By Charles’s Law (V ∝ T), cooling the air from 293 K to 77 K reduces gas volume by over 73%, and oxygen/nitrogen liquefy inside. Once placed back on the table, ambient heat vaporizes the liquid back into gas, re-inflating the balloon to its original volume!',
    funFact: 'If you look through the translucent latex while it is cold, you can actually see a tiny puddle of liquid air sloshing around inside!',
  },

  // 26. Social Chemistry: The Chameleon Mimicry Effect
  {
    id: 'pred-26',
    category: 'Social Chemistry',
    title: 'Unconscious Postural Mirroring in Dialogue',
    setupPrompt: 'In a blind conversational study, an interviewer discreetly mirrors the interviewee’s subtle physical posture (crossing legs, touching chin). What is the measured effect on the interviewee?',
    options: [
      { id: 'opt-a', text: 'The interviewee reports liking the interviewer significantly more and rates the conversation as smoother.', subtext: 'The Chartrand & Bargh Chameleon Effect.' },
      { id: 'opt-b', text: 'The interviewee immediately notices the mimicry and becomes irritated.', subtext: 'Mimicry aversion.' },
      { id: 'opt-c', text: 'The interviewee falls asleep.', subtext: 'Hypnotic state.' },
      { id: 'opt-d', text: 'Zero measurable psychological difference.', subtext: 'Null effect.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Tanya Chartrand and John Bargh (1999) documented the "Chameleon Effect": subconscious nonverbal mimicry of postures, mannerisms, and facial expressions facilitates social affiliation and increases prosocial rapport without either person consciously realizing it.',
    funFact: 'Brain scans reveal that mirror neurons fire both when we perform an action and when we watch someone else perform that same action.',
  },

  // 27. Dry Ice Bubble Dome
  {
    id: 'pred-27',
    category: 'Thermal Dynamics',
    title: 'The Giant Carbon Dioxide Soap Bubble Dome',
    setupPrompt: 'Warm water and dry ice are placed in a bowl, creating a steady fog of sublimating CO₂. A soapy rag is swiped across the rim, creating a flat soap film lid. What occurs?',
    options: [
      { id: 'opt-a', text: 'A shimmering smoke-filled translucent bubble dome expands upward until it gently pops, spilling a foggy waterfall.', subtext: 'Sublimation vapor pressure trapped by surface tension.' },
      { id: 'opt-b', text: 'The soap film freezes solid and turns into clear glass.', subtext: 'Instant freezing.' },
      { id: 'opt-c', text: 'The bubble bursts downward and shatters the bowl.', subtext: 'Implosion.' },
      { id: 'opt-d', text: 'The fog ignites into an emerald green flame.', subtext: 'Combustion.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Solid CO₂ sublimates directly into gas, generating positive vapor pressure inside the bowl. The elastic soap film stretches into a spherical dome to accommodate the expanding gas, trapping the condensed fog until the bubble film thins and breaks.',
    funFact: 'Because carbon dioxide gas is 1.5 times denser than ambient air, when the bubble bursts, the fog cascades downward onto the table like a liquid waterfall.',
  },

  // 28. Glowstick in Boiling Water vs Ice Water
  {
    id: 'pred-28',
    category: 'Chemical Phenomenon',
    title: 'Temperature Kinetics of Chemiluminescence',
    setupPrompt: 'Two identical activated green glowsticks are placed in beakers: one in boiling water (100°C), one in freezing ice water (0°C). What happens to their luminescence?',
    options: [
      { id: 'opt-a', text: 'The hot glowstick glows blindingly bright but expires quickly; the cold glowstick dims to a faint glow that lasts for days.', subtext: 'Arrhenius reaction rate temperature dependence.' },
      { id: 'opt-b', text: 'The cold glowstick shines much brighter than the hot one.', subtext: 'Cold excitation.' },
      { id: 'opt-c', text: 'Both glowsticks maintain identical brightness.', subtext: 'Fixed emission rate.' },
      { id: 'opt-d', text: 'The hot glowstick changes from green to bright blue.', subtext: 'Wavelength shift.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'By the Arrhenius equation, reaction rates roughly double for every 10°C increase in temperature. In boiling water, the chemical dye excitation proceeds at furious speed, releasing immense light output over a short duration, whereas near freezing, the reaction slows to a crawl.',
    funFact: 'You can extend the lifespan of an activated Halloween glowstick by storing it overnight inside your home freezer.',
  },

  // 29. Magnetic Silly Putty Swallowing a Magnet
  {
    id: 'pred-29',
    category: 'Physics & Kinetics',
    title: 'Viscoelastic Ferro-Putty Slow Consumption',
    setupPrompt: 'A powerful shiny neodymium cube magnet is placed on top of a blob of dark magnetic silly putty. If left undisturbed for 45 minutes, what happens?',
    options: [
      { id: 'opt-a', text: 'The viscoelastic putty slowly and silently creeps up the sides and completely engulfs the magnet.', subtext: 'Viscoelastic polymer flow driven by magnetic attraction.' },
      { id: 'opt-b', text: 'The magnet repels the putty, pushing it off the desk.', subtext: 'Diamagnetic repulsion.' },
      { id: 'opt-c', text: 'The putty turns rock-hard within 10 seconds.', subtext: 'Instant cure.' },
      { id: 'opt-d', text: 'The magnet loses its magnetic charge completely.', subtext: 'Demagnetization.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'The putty contains polydimethylsiloxane (a viscoelastic polymer) doped with microscopic iron particles. The mutual magnetic attraction between the cube and the iron particles overcomes the putty’s viscous resistance over time, causing it to flow like a slow liquid until the cube is swallowed.',
    funFact: 'Viscoelastic materials act like elastic solids on short timescales (bouncing if dropped) and liquids on long timescales (flowing flat like honey).',
  },

  // 30. The Paradox of Choice in Social Decisions
  {
    id: 'pred-30',
    category: 'Social Chemistry',
    title: 'The Iyengar Jam Tasting Paradox',
    setupPrompt: 'In Sheena Iyengar’s Columbia University experiment, a supermarket tasting booth displayed either 24 gourmet jam varieties (Group A) or 6 jam varieties (Group B). What was the real purchasing behavior?',
    options: [
      { id: 'opt-a', text: 'More people stopped at the 24-jam booth, but 10x more people actually bought jam at the 6-jam booth.', subtext: 'The Paradox of Choice & decision paralysis.' },
      { id: 'opt-b', text: 'The 24-jam booth sold 100% of all inventory immediately.', subtext: 'Variety preference.' },
      { id: 'opt-c', text: 'Zero people purchased jam from either booth.', subtext: 'Sampling fatigue.' },
      { id: 'opt-d', text: 'Shoppers purchased both booths equally.', subtext: 'Neutral baseline.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'While a large array of choices attracts initial curiosity, having 24 options causes cognitive overload and decision paralysis. Having just 6 clear options reduced cognitive evaluation friction, resulting in 30% of shoppers purchasing versus just 3% at the 24-option booth.',
    funFact: 'This psychological principle explains why dating apps with endless infinite swiping can leave users feeling less satisfied and less committed than smaller curated cohorts.',
  },

  // 31. Superhydrophobic Metal Water Bounce
  {
    id: 'pred-31',
    category: 'Physics & Kinetics',
    title: 'Laser-Etched Superhydrophobic Water Bounce',
    setupPrompt: 'A metal plate etched with nanoscale laser pillars creates a contact angle of 170°. When a water droplet falls from a dropper onto the plate, what happens on contact?',
    options: [
      { id: 'opt-a', text: 'The droplet bounces completely off the metal like a rubber ball without leaving a trace of moisture.', subtext: 'Cassie-Baxter superhydrophobic bounce.' },
      { id: 'opt-b', text: 'The droplet instantly spreads into a thin mirror sheen.', subtext: 'Complete wetting.' },
      { id: 'opt-c', text: 'The droplet boils into steam on contact.', subtext: 'Surface friction.' },
      { id: 'opt-d', text: 'The metal plate turns transparent.', subtext: 'Optical index match.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Water forms a spherical bead supported on micro-cushions of trapped air between the nanoscale pillars (the Lotus Effect). The surface energy is so low that the droplet recoils and rebounds like a miniature rubber ball without wetting the surface at all.',
    funFact: 'Lotus leaves and water strider insect legs use this exact nanostructure to stay clean and walk on water surfaces without sinking.',
  },

  // 32. Social Chemistry: The Pratfall Effect
  {
    id: 'pred-32',
    category: 'Social Chemistry',
    title: 'The Aronson Pratfall Likability Phenomenon',
    setupPrompt: 'An extraordinarily competent speaker aces a quiz, and then accidentally spills a cup of coffee all over themselves. How does the audience rate their likability compared to before the spill?',
    options: [
      { id: 'opt-a', text: 'Their perceived likability significantly increases; the blunder makes them endearing and relatable.', subtext: 'The Pratfall Effect.' },
      { id: 'opt-b', text: 'Their likability plummets and they are viewed as incompetent.', subtext: 'Competence penalty.' },
      { id: 'opt-c', text: 'The audience forgets their answers completely.', subtext: 'Distraction wipe.' },
      { id: 'opt-d', text: 'The audience views the spill as intentional performance art.', subtext: 'Interpretation shift.' },
    ],
    correctOptionId: 'opt-a',
    scientificExplanation: 'Elliot Aronson’s classic experiment (1966) showed that a small mistake or clumsy moment (a "pratfall") increases the perceived warmth and likability of an otherwise highly competent person by making them feel human, vulnerable, and approachable.',
    funFact: 'However, the effect reverses if the person was not already perceived as competent; a blunder by an insecure performer merely confirms their perceived incompetence!',
  },
];

export function getPredictionChallengeById(id: string): PredictionChallenge | undefined {
  return PREDICTION_CHALLENGES.find((p) => p.id === id);
}

export function getPredictionChallengesByCategory(category: string): PredictionChallenge[] {
  return PREDICTION_CHALLENGES.filter((p) => p.category === category);
}
