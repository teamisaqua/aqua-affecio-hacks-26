export interface DiscoveryStage {
  stageNumber: number;
  stageName: string;
  clueObservation: string;
  decisionPrompt: string;
  choices: {
    id: string;
    label: string;
    subtext: string;
    consequence: string;
    isOptimal: boolean;
  }[];
}

export interface SharedDiscoverySequence {
  id: string;
  sequenceNumber: number;
  title: string;
  theme: string;
  initialBrief: string;
  stages: [DiscoveryStage, DiscoveryStage, DiscoveryStage]; // 3 sequential investigation stages
  completionDebrief: string;
  scientificDiscovery: string;
}

export const SHARED_DISCOVERY_SEQUENCES: SharedDiscoverySequence[] = [
  // 1. The Mysterious Luminescent Mineral
  {
    id: 'disc-1',
    sequenceNumber: 1,
    title: 'The Unstable Luminescent Crystal',
    theme: 'Crystallography & Radioactivity',
    initialBrief: 'A mining team in the Bohemian mountains unearths a dense black mineral that glows faint green in the dark and fogs photographic film plates.',
    stages: [
      {
        stageNumber: 1,
        stageName: 'Initial Spectrometry',
        clueObservation: 'The mineral emits continuous ionizing radiation and heat without any external power source. Mass spectrometry shows heavy uranium oxide (Pitchblende) with unexpected trace peaks.',
        decisionPrompt: 'How do you separate the unknown radioactive fraction from the bulk uranium rock?',
        choices: [
          { id: 'c1', label: 'Fractional Chemical Precipitation', subtext: 'Dissolve in boiling acid and selectively precipitate barium sulfate carrier.', consequence: 'The radioactive trace co-precipitates with barium, isolating the unknown glowing fraction!', isOptimal: true },
          { id: 'c2', label: 'High-Temperature Blast Furnace', subtext: 'Smelt at 2000°C to burn away non-metals.', consequence: 'Volatile radioactive isotopes vaporize and contaminate the laboratory ventilation.', isOptimal: false },
          { id: 'c3', label: 'Magnetic Sieve Separation', subtext: 'Pass ground powder past strong permanent magnets.', consequence: 'Zero magnetic separation; the radioactive component is non-ferromagnetic.', isOptimal: false },
        ],
      },
      {
        stageNumber: 2,
        stageName: 'Fractional Crystallization',
        clueObservation: 'The isolated chloride solution contains barium and the mysterious element. Repeated fractional crystallization concentrates the active fraction in the crystal head.',
        decisionPrompt: 'What optical test verifies whether this is an entirely new chemical element?',
        choices: [
          { id: 'c1', label: 'Emission Flame Spectroscopy', subtext: 'Burn a sample and record the characteristic optical spectral lines.', consequence: 'Reveals vivid carmine-red spectral lines never seen in any known element!', isOptimal: true },
          { id: 'c2', label: 'Measure pH of the Solution', subtext: 'Check if the solution is acidic or basic.', consequence: 'pH measurement only indicates general acidity, not elemental novelty.', isOptimal: false },
          { id: 'c3', label: 'Weigh the Liquid on a Scale', subtext: 'Look for unexpected gravitational weight loss.', consequence: 'Gravity scales cannot resolve isotopic atomic structure.', isOptimal: false },
        ],
      },
      {
        stageNumber: 3,
        stageName: 'Elemental Isolation',
        clueObservation: 'The newly isolated element is 1,000,000 times more radioactive than uranium and glows in air by ionizing nitrogen molecules.',
        decisionPrompt: 'What name and classification do you assign this discovery?',
        choices: [
          { id: 'c1', label: 'Radium (Alkaline Earth Metal)', subtext: 'From the Latin "radius" (ray), atomic number 88 in Group 2.', consequence: 'Marie and Pierre Curie successfully isolate pure Radium, revolutionizing physics!', isOptimal: true },
          { id: 'c2', label: 'Kryptonite (Noble Gas)', subtext: 'Classify as an inert atmospheric gas.', consequence: 'Incorrect classification; it is an active divalent metallic cation.', isOptimal: false },
          { id: 'c3', label: 'Luminite (Halogen)', subtext: 'Group with fluorine and chlorine.', consequence: 'Incorrect group; it forms salts like barium (BaCl₂), not halogen anions.', isOptimal: false },
        ],
      },
    ],
    completionDebrief: 'Together, you replicated Marie and Pierre Curie’s historic 1898 isolation of Radium from pitchblende ore, opening the atomic age.',
    scientificDiscovery: 'Radium (Ra, Z=88) spontaneously undergoes alpha decay, releasing nuclear energy that unlocked the internal structure of the atomic nucleus.',
  },

  // 2. The Great Deep-Sea Vent Chemosynthesis
  {
    id: 'disc-2',
    sequenceNumber: 2,
    title: 'The Sunless Hydrothermal Ecosystem',
    theme: 'Deep-Ocean Chemosynthesis',
    initialBrief: 'Research submarine Alvin dives 2,500 meters deep into the volcanic Galápagos Rift, discovering giant 2-meter red tube worms thriving in total pitch-black darkness.',
    stages: [
      {
        stageNumber: 1,
        stageName: 'Chemical Profiling of Vent Plume',
        clueObservation: 'Water temperature reaches 350°C and carries toxic concentrations of hydrogen sulfide (H₂S) that would instantly kill terrestrial organisms.',
        decisionPrompt: 'What primary metabolic energy source powers this thriving ecosystem without sunlight?',
        choices: [
          { id: 'c1', label: 'Chemosynthetic Sulfide Oxidation', subtext: 'Bacteria oxidize toxic H₂S with dissolved oxygen to generate ATP.', consequence: 'Bacterial symbionts inside the tube worms fix carbon using hydrogen sulfide energy!', isOptimal: true },
          { id: 'c2', label: 'Thermal Infrared Photosynthesis', subtext: 'Worms capture infrared heat from molten lava for photosynthesis.', consequence: 'Infrared photons lack the quantum energy required to split water molecules.', isOptimal: false },
          { id: 'c3', label: 'Consuming Organic Debris from the Surface', subtext: 'Rely entirely on whale carcasses and marine snow from above.', consequence: 'Calculations prove surface debris is 1000x too sparse to support this biomass.', isOptimal: false },
        ],
      },
      {
        stageNumber: 2,
        stageName: 'Tube Worm Anatomy Inspection',
        clueObservation: 'The giant tube worm Riftia pachyptila has no mouth, no gut, and no digestive tract of any kind. Its internal cavity is filled with a dark vascular tissue called the trophosome.',
        decisionPrompt: 'How do nutrients enter the worm’s bloodstream?',
        choices: [
          { id: 'c1', label: 'Specialized Hemoglobin Binding H₂S and O₂', subtext: 'Giant hemoglobin molecules carry toxic sulfide and oxygen safely to the trophosome.', consequence: 'The blood safely transports volatile H₂S and O₂ without poisoning the animal’s tissue!', isOptimal: true },
          { id: 'c2', label: 'Direct Skin Osmosis', subtext: 'Absorb whole bacteria through the outer white chitin tube.', consequence: 'The thick protective chitin tube is completely impermeable to whole cells.', isOptimal: false },
          { id: 'c3', label: 'Passive Filter Feeding', subtext: 'Water filters through microscopic pores in the plume.', consequence: 'The plume lacks mechanical cilia or filter meshes for particle capture.', isOptimal: false },
        ],
      },
      {
        stageNumber: 3,
        stageName: 'Astrobiological Extrapolation',
        clueObservation: 'The entire food chain (crabs, blind shrimp, tube worms) is fundamentally decoupled from solar radiation and atmospheric cycles.',
        decisionPrompt: 'Where in our solar system is this discovery most relevant?',
        choices: [
          { id: 'c1', label: 'Subsurface Ocean of Jupiter’s Moon Europa', subtext: 'Hydrothermal vents on a rocky seafloor beneath miles of outer ice.', consequence: 'Proves life can flourish independently of stars in alien subsurface oceans!', isOptimal: true },
          { id: 'c2', label: 'The Dry Red Dunes of Mars', subtext: 'Surface sand dunes exposed to solar radiation.', consequence: 'Hydrothermal vent mechanics require a deep liquid ocean reservoir.', isOptimal: false },
          { id: 'c3', label: 'The Cloud Tops of Venus', subtext: 'Sulfuric acid aerosol droplets in the upper atmosphere.', consequence: 'Atmospheric aerosols lack the tectonic mineral interfaces of benthic vents.', isOptimal: false },
        ],
      },
    ],
    completionDebrief: 'You unraveled chemosynthetic primary production, showing that life’s energetic foundation can be purely geothermal rather than solar.',
    scientificDiscovery: 'Discovered in 1977, chemosynthesis proved that planetary habitability does not require proximity to a warm, bright star.',
  },

  // 3. The Unexplained Aurora Glow
  {
    id: 'disc-3',
    sequenceNumber: 3,
    title: 'The Stratospheric Green Aurora Line',
    theme: 'Atmospheric Atomic Physics',
    initialBrief: 'In 1868, Anders Ångström observed a bright, sharp emerald-green spectral line at 557.7 nm in the Northern Lights that matched no known element on Earth.',
    stages: [
      {
        stageNumber: 1,
        stageName: 'The "Geocoronium" Hypothesis',
        clueObservation: 'Because the green line appeared in no laboratory gas discharge tube on Earth, scientists proposed a hypothetical mystery element called "Geocoronium".',
        decisionPrompt: 'How do you test if Geocoronium is real or an artifact of upper atmosphere conditions?',
        choices: [
          { id: 'c1', label: 'Simulate Ultra-Low Pressure Vacuum Chambers', subtext: 'Recreate the high-vacuum conditions of the ionosphere (100–150 km altitude).', consequence: 'In extreme vacuum, forbidden atomic transitions that are quenched on Earth can survive!', isOptimal: true },
          { id: 'c2', label: 'Burn Atmospheric Dust in an Arc', subtext: 'Collect high-altitude meteor dust and vaporize it.', consequence: 'Dust spectra show iron, nickel, and magnesium lines, but no 557.7 nm emission.', isOptimal: false },
          { id: 'c3', label: 'Filter Sunlight with Colored Glass', subtext: 'Look for the green line in ordinary daylight.', consequence: 'Daylight is dominated by the solar Fraunhofer absorption spectrum.', isOptimal: false },
        ],
      },
      {
        stageNumber: 2,
        stageName: 'The Forbidden Transition Discovery',
        clueObservation: 'In 1925, McLennan and Shrum proved the line comes from ordinary atomic oxygen (O), but from a "forbidden" metastable state (¹S₀ → ¹D₂) with an unusually long lifetime of 0.74 seconds.',
        decisionPrompt: 'Why does this green line never appear in normal sea-level air?',
        choices: [
          { id: 'c1', label: 'Collisional De-excitation (Quenching)', subtext: 'At sea level, oxygen atoms collide billions of times per second, dissipating energy before emitting.', consequence: 'Only in the near-vacuum of space can the atom wait 0.74 seconds to radiate light!', isOptimal: true },
          { id: 'c2', label: 'Sea-Level Air Has No Oxygen', subtext: 'Oxygen only forms high in the atmosphere.', consequence: 'Incorrect; sea-level air is 21% oxygen.', isOptimal: false },
          { id: 'c3', label: 'Gravity Bends the Light at Sea Level', subtext: 'Gravitational lensing shifts the wavelength.', consequence: 'Earth’s gravity is millions of times too weak to cause optical frequency shifts.', isOptimal: false },
        ],
      },
      {
        stageNumber: 3,
        stageName: 'Solar Wind Energy Mapping',
        clueObservation: 'Solar coronal mass ejections shoot energetic protons and electrons toward Earth, channeled along geomagnetic field lines into the polar ionosphere.',
        decisionPrompt: 'What determines whether the aurora glows emerald green (557 nm) or deep crimson red (630 nm)?',
        choices: [
          { id: 'c1', label: 'Altitude of Collision: Green at 100km, Red above 200km', subtext: 'Lower altitude oxygen emits green; ultra-thin upper atmosphere allows the 110-second red transition.', consequence: 'You accurately mapped the altitude-dependent emission architecture of the aurora borealis!', isOptimal: true },
          { id: 'c2', label: 'The Season of the Year', subtext: 'Summer creates green auroras, winter creates red.', consequence: 'Seasons affect night darkness, but quantum atomic transitions are altitude-governed.', isOptimal: false },
          { id: 'c3', label: 'Moon Phases', subtext: 'Lunar gravity pulls different colors.', consequence: 'Lunar gravity has no effect on atmospheric quantum electron transitions.', isOptimal: false },
        ],
      },
    ],
    completionDebrief: 'You resolved the 60-year mystery of the Green Auroral Line, proving it is ordinary atomic oxygen relaxing in the vacuum of space.',
    scientificDiscovery: 'Forbidden transitions occur when quantum selection rules predict low transition probabilities, observable only where particle density is sparse.',
  },

  // 4. The Miracle Mold (Penicillin Discovery)
  {
    id: 'disc-4',
    sequenceNumber: 4,
    title: 'The Accidental Petri Dish Halo',
    theme: 'Microbiology & Antibiosis',
    initialBrief: 'In September 1928, Alexander Fleming returns from vacation to find a contaminated Staphylococcus culture dish left open beside an open window in London.',
    stages: [
      {
        stageNumber: 1,
        stageName: 'Observing the Clear Zone',
        clueObservation: 'A blue-green mold fungus has grown on the agar. Around the mold colony, all surrounding bacterial colonies have lysed into clear liquid ghost cells.',
        decisionPrompt: 'What is your hypothesis for the clear zone surrounding the mold?',
        choices: [
          { id: 'c1', label: 'The mold secretes a diffusable antibacterial agent', subtext: 'A chemical molecule is leaching into the agar that destroys bacterial cell walls.', consequence: 'Filtration proves the cell-free liquid broth alone destroys bacteria!', isOptimal: true },
          { id: 'c2', label: 'The mold is eating all the nutrient agar physically', subtext: 'Bacteria simply starved to death from lack of sugar.', consequence: 'Assays show plenty of unconsumed glucose remains in the clear zone.', isOptimal: false },
          { id: 'c3', label: 'The bacteria died of old age coincidently', subtext: 'The timing was purely accidental.', consequence: 'Control plates without mold show vigorous bacterial growth.', isOptimal: false },
        ],
      },
      {
        stageNumber: 2,
        stageName: 'Identifying the Fungus',
        clueObservation: 'Microscopic inspection reveals brush-like fruiting bodies (conidiophores) producing chains of spherical spores.',
        decisionPrompt: 'Identify the genus of the mold species:',
        choices: [
          { id: 'c1', label: 'Penicillium notatum', subtext: 'From the Latin "penicillus" (painter’s brush), reflecting the spore structure.', consequence: 'Identified correctly as Penicillium notatum, naming the exudate "Penicillin"!', isOptimal: true },
          { id: 'c2', label: 'Aspergillus niger', subtext: 'Black common bread mold.', consequence: 'Incorrect genus; Aspergillus produces different organic acids.', isOptimal: false },
          { id: 'c3', label: 'Saccharomyces cerevisiae', subtext: 'Brewer’s baker’s yeast.', consequence: 'Yeast is a single-celled budding fungus, not a filamentous brush mold.', isOptimal: false },
        ],
      },
      {
        stageNumber: 3,
        stageName: 'Mechanism of Action Investigation',
        clueObservation: 'Penicillin is remarkably non-toxic to human cells, but rapidly lyses dividing Gram-positive bacteria.',
        decisionPrompt: 'Why does penicillin kill bacteria while leaving human cells completely unharmed?',
        choices: [
          { id: 'c1', label: 'It inhibits peptidoglycan cell wall synthesis', subtext: 'Human cells have only lipid membranes; bacteria have unique peptidoglycan walls.', consequence: 'Without cell walls, internal osmotic pressure causes bacteria to burst!', isOptimal: true },
          { id: 'c2', label: 'It freezes bacterial water into ice', subtext: 'Physical cryo-crystallization.', consequence: 'Penicillin functions chemically at human body temperature (37°C).', isOptimal: false },
          { id: 'c3', label: 'It neutralizes all oxygen in the blood', subtext: 'Deprives pathogens of breath.', consequence: 'Depriving oxygen would kill the human patient.', isOptimal: false },
        ],
      },
    ],
    completionDebrief: 'You recreated Alexander Fleming, Howard Florey, and Ernst Chain’s discovery of Penicillin, heralding the age of modern antibiotics.',
    scientificDiscovery: 'Penicillin irreversibly binds to DD-transpeptidase, preventing bacterial cross-linking and causing osmotic cell lysis.',
  },

  // 5. The Superconducting Breakthrough
  {
    id: 'disc-5',
    sequenceNumber: 5,
    title: 'Zero Resistance at Absolute Zero',
    theme: 'Quantum Condensed Matter',
    initialBrief: 'In Leiden, Netherlands (1911), Heike Kamerlingh Onnes liquefies helium for the first time, reaching a frigid 4.2 Kelvin (-268.95°C).',
    stages: [
      {
        stageNumber: 1,
        stageName: 'Cooling Pure Mercury',
        clueObservation: 'He measures the electrical resistance of solid mercury wire as temperature drops steadily from 10 K downward.',
        decisionPrompt: 'What does classical physics predict should happen to resistance as T → 0 K?',
        choices: [
          { id: 'c1', label: 'Gradual slow decrease approaching a small residual plateau', subtext: 'Electron lattice scattering slows down, but impurities maintain baseline resistance.', consequence: 'Classical physics predicted a smooth gradual curve, but the experiment defies it!', isOptimal: true },
          { id: 'c2', label: 'Resistance should instantly shoot to infinity', subtext: 'Electrons freeze solid in place.', consequence: 'Electrons are quantum fermions that do not freeze motionless.', isOptimal: false },
          { id: 'c3', label: 'Mercury should turn into an insulator like rubber', subtext: 'Electrons escape into the air.', consequence: 'Metals retain their delocalized conduction bands at all temperatures.', isOptimal: false },
        ],
      },
      {
        stageNumber: 2,
        stageName: 'The Discontinuous Cliff',
        clueObservation: 'At precisely 4.19 Kelvin, the needle of the galvanometer drops abruptly to absolute zero within a fraction of a millikelvin.',
        decisionPrompt: 'How do you prove the electrical resistance is truly zero, rather than just very small?',
        choices: [
          { id: 'c1', label: 'Induce a Persistent Closed Ring Current', subtext: 'Start a current in a closed ring; if resistance is zero, current will circulate forever without battery.', consequence: 'The current flows for years with zero measurable decay! True superconductivity is confirmed!', isOptimal: true },
          { id: 'c2', label: 'Touch the Wire with a Finger', subtext: 'Feel if it feels cold or warm.', consequence: 'Touching a 4.2 K wire would destroy the cryostat and freeze flesh.', isOptimal: false },
          { id: 'c3', label: 'Connect a Standard Lightbulb', subtext: 'See if the bulb glows brighter.', consequence: 'Bulb filaments add their own internal resistance.', isOptimal: false },
        ],
      },
      {
        stageNumber: 3,
        stageName: 'The Meissner Effect',
        clueObservation: 'In 1933, Meissner and Ochsenfeld discover that a superconductor placed in a magnetic field expels all magnetic flux lines completely.',
        decisionPrompt: 'What stunning physical behavior does magnetic flux expulsion cause?',
        choices: [
          { id: 'c1', label: 'Stable Magnetic Levitation (Quantum Pinning)', subtext: 'A permanent magnet floats steadily in mid-air above the cooled superconductor.', consequence: 'Perfect diamagnetism levitates the magnet with rock-solid stability!', isOptimal: true },
          { id: 'c2', label: 'The magnet melts into liquid iron', subtext: 'Induction heating.', consequence: 'Superconductors produce zero Joule heating.', isOptimal: false },
          { id: 'c3', label: 'The superconductor begins to spin like a propeller', subtext: 'Rotational torque.', consequence: 'Zero torque is generated without an alternating phased field.', isOptimal: false },
        ],
      },
    ],
    completionDebrief: 'You unlocked Superconductivity and the Meissner Effect, the quantum phenomena powering modern MRI scanners, particle colliders, and Maglev trains.',
    scientificDiscovery: 'BCS theory (1957) revealed that electrons form bosonic "Cooper pairs" via lattice phonon vibrations, moving through the crystal with zero scattering.',
  },

  // 6. The Mystery of Cosmic Microwave Background
  {
    id: 'disc-6',
    sequenceNumber: 6,
    title: 'The Relic Echo of the Big Bang',
    theme: 'Cosmology & Astrophysics',
    initialBrief: 'In 1964 at Bell Labs, New Jersey, Arno Penzias and Robert Wilson build a giant 6-meter horn antenna to study satellite communications, but detect a persistent radio hiss.',
    stages: [
      {
        stageNumber: 1,
        stageName: 'Eliminating Terrestrial Noise',
        clueObservation: 'A continuous, low-level radio noise is detected at 4,080 MHz day and night, coming equally from every single direction in the sky.',
        decisionPrompt: 'What is your initial troubleshooting step to eliminate antenna artifacts?',
        choices: [
          { id: 'c1', label: 'Clean Pigeon Droppings and Check Joints', subtext: 'Scrub the antenna throat and tape aluminum seams to remove local dielectric noise.', consequence: 'The antenna is spotless and pristine, yet the uniform hum remains unchanged!', isOptimal: true },
          { id: 'c2', label: 'Assume New York City Radio Interference', subtext: 'Point the antenna directly at Manhattan.', consequence: 'Noise is identical pointing at Manhattan, the Atlantic Ocean, or straight up.', isOptimal: false },
          { id: 'c3', label: 'Blame Soviet Radar Jamming', subtext: 'File a military complaint.', consequence: 'No military radar transmits uniformly across all celestial coordinates.', isOptimal: false },
        ],
      },
      {
        stageNumber: 2,
        stageName: 'Analyzing the Spectrum',
        clueObservation: 'The radiation matches an exact thermal blackbody curve with a temperature of approximately 2.725 Kelvin.',
        decisionPrompt: 'Why is the signal perfectly isotropic (identical in all directions) across the cosmos?',
        choices: [
          { id: 'c1', label: 'It is the Redshifted Afterglow of the Early Universe', subtext: 'Light emitted 380,000 years after the Big Bang, stretched into microwaves by cosmic expansion.', consequence: 'You discovered the Cosmic Microwave Background (CMB), the prime evidence for the Big Bang!', isOptimal: true },
          { id: 'c2', label: 'Reflections off Jupiter’s Rings', subtext: 'Planetary scattering.', consequence: 'Jupiter occupies a single point in the sky, not the entire celestial sphere.', isOptimal: false },
          { id: 'c3', label: 'Solar Wind Plasma Shock', subtext: 'Sun’s coronal breeze.', consequence: 'Solar wind varies with the 11-year solar cycle; the CMB is timelessly constant.', isOptimal: false },
        ],
      },
      {
        stageNumber: 3,
        stageName: 'Recombination Physics',
        clueObservation: 'Before this light was released, the universe was an opaque, blinding plasma fog of protons and free electrons.',
        decisionPrompt: 'What cosmic atomic event allowed photons to travel freely through space for the first time?',
        choices: [
          { id: 'c1', label: 'Recombination: Electrons bound to protons to form neutral Hydrogen', subtext: 'Neutral atoms don’t scatter light, turning the universe transparent at 3,000 K.', consequence: 'Recombination allowed photons to decouple and travel 13.8 billion years to your antenna!', isOptimal: true },
          { id: 'c2', label: 'First Stars Ignited Nuclear Fusion', subtext: 'Starlight burned away the gas.', consequence: 'The first stars formed hundreds of millions of years after the CMB decoupling.', isOptimal: false },
          { id: 'c3', label: 'Black Holes Swallowed the Plasma', subtext: 'Gravitational filtration.', consequence: 'Black holes absorb photons, they do not release smooth isotropic blackbody CMB radiation.', isOptimal: false },
        ],
      },
    ],
    completionDebrief: 'You confirmed the Cosmic Microwave Background radiation, earning the 1978 Nobel Prize in Physics and cementing the Big Bang cosmological model.',
    scientificDiscovery: 'The CMB shows the universe at age 380,000 years, with tiny 1-part-in-100,000 temperature fluctuations that seeded all galaxies and stars.',
  },

  // 7. The Double Helix Unraveling
  {
    id: 'disc-7',
    sequenceNumber: 7,
    title: 'Photograph 51 & The Code of Life',
    theme: 'Molecular Biology & Genetics',
    initialBrief: 'In May 1952 at King’s College London, Rosalind Franklin and Raymond Gosling expose a crystallized fiber of DNA to an X-ray beam for 62 hours, producing "Photograph 51".',
    stages: [
      {
        stageNumber: 1,
        stageName: 'Analyzing the X-Ray Diffraction Pattern',
        clueObservation: 'The photographic film reveals a prominent, sharp "X" pattern of dark diffraction spots, with empty diamond voids on the sides and missing layer line 4.',
        decisionPrompt: 'What geometric molecular structure does an X-shaped diffraction pattern prove?',
        choices: [
          { id: 'c1', label: 'A Helical Structure (Spiral Coil)', subtext: 'X-ray scattering off helical turns mathematically produces an X-shaped Fourier transform.', consequence: 'Confirms conclusively that the DNA molecule is wound in a continuous helix!', isOptimal: true },
          { id: 'c2', label: 'A Flat 2D Sheet (Like Graphene)', subtext: 'Planar hexagonal packing.', consequence: 'Planar sheets produce parallel line streaks, not an X pattern.', isOptimal: false },
          { id: 'c3', label: 'A Spherical Ball (Like Fullerene)', subtext: 'Concentric ring spheres.', consequence: 'Spherical symmetry produces concentric circular rings (Debye-Scherrer rings).', isOptimal: false },
        ],
      },
      {
        stageNumber: 2,
        stageName: 'Phosphate Backbone Placement',
        clueObservation: 'DNA contains hydrophilic negatively charged phosphate groups and hydrophobic nitrogenous bases (A, T, C, G).',
        decisionPrompt: 'Where must the phosphate groups be positioned in the double helix?',
        choices: [
          { id: 'c1', label: 'On the outside, exposed to the watery aqueous cellular environment', subtext: 'Allows charged phosphates to interact with water while protecting bases inside.', consequence: 'Franklin correctly identified that Linus Pauling’s model with inside phosphates was chemically impossible!', isOptimal: true },
          { id: 'c2', label: 'Packed tightly down the central core', subtext: 'Pauling’s initial hypothesis.', consequence: 'Negative charges on the phosphates would electrostatically repel and blow the molecule apart!', isOptimal: false },
          { id: 'c3', label: 'Randomly interspersed throughout', subtext: 'No spatial segregation.', consequence: 'Random placement would destroy the regular periodic crystal diffraction pattern.', isOptimal: false },
        ],
      },
      {
        stageNumber: 3,
        stageName: 'Base Pairing Complementarity',
        clueObservation: 'Erwin Chargaff discovered that in all cellular DNA, the amount of Adenine equals Thymine (A=T), and Guanine equals Cytosine (G=C).',
        decisionPrompt: 'How do the bases pair together inside the core of the double helix?',
        choices: [
          { id: 'c1', label: 'Specific Hydrogen Bonds: A pairs with T (2 bonds), G with C (3 bonds)', subtext: 'A purine always pairs with a pyrimidine, keeping the helix width constant at 2.0 nm.', consequence: 'Watson and Crick solve the double helix! The pairing immediately suggests a copying mechanism for life!', isOptimal: true },
          { id: 'c2', label: 'A pairs with A, C with C (Like-with-Like)', subtext: 'Self-bonding.', consequence: 'Purine-purine pairs would bulge outward (too wide); pyrimidine-pyrimidine would collapse (too narrow).', isOptimal: false },
          { id: 'c3', label: 'Covalent carbon-carbon bridges', subtext: 'Permanent unbreakable links.', consequence: 'Covalent bonds would prevent the two strands from unwinding during DNA replication.', isOptimal: false },
        ],
      },
    ],
    completionDebrief: 'You resolved the double-helical architecture of DNA, revealing how genetic information is encoded, protected, and faithfully replicated.',
    scientificDiscovery: 'James Watson, Francis Crick, and Maurice Wilkins shared the 1962 Nobel Prize for the double helix, built upon Rosalind Franklin’s foundational crystallography.',
  },

  // 8. The Ozone Hole Rescue
  {
    id: 'disc-8',
    sequenceNumber: 8,
    title: 'The Antarctic Stratospheric Hole',
    theme: 'Environmental Chemistry',
    initialBrief: 'In 1985, British Antarctic Survey scientists at Halley Bay record an alarming 40% collapse in stratospheric ozone levels over the South Pole during the Antarctic spring.',
    stages: [
      {
        stageNumber: 1,
        stageName: 'Isolating the Catalytic Culprit',
        clueObservation: 'Chlorofluorocarbons (CFCs like Freon-12) used in aerosol hairsprays and refrigerators are chemically non-toxic and inert at ground level, but diffuse into the stratosphere.',
        decisionPrompt: 'What happens to CFC molecules when hit by harsh solar ultraviolet light in the upper atmosphere?',
        choices: [
          { id: 'c1', label: 'Photodissociation releases free Chlorine radicals (Cl•)', subtext: 'C-Cl bonds photolyze, generating atomic chlorine free radicals with an unpaired electron.', consequence: 'Active chlorine radicals are liberated into the ozone layer!', isOptimal: true },
          { id: 'c2', label: 'CFCs turn into pure rainwater', subtext: 'Precipitation washout.', consequence: 'CFCs are completely insoluble in water and cannot rain out of the atmosphere.', isOptimal: false },
          { id: 'c3', label: 'They harmlessly freeze into ice crystals', subtext: 'Cryogenic locking.', consequence: 'CFCs remain gaseous and volatile in the stratosphere.', isOptimal: false },
        ],
      },
      {
        stageNumber: 2,
        stageName: 'The Catalytic Destruction Cycle',
        clueObservation: 'One single chlorine radical (Cl•) reacts with ozone: Cl• + O₃ → ClO• + O₂. Then ClO• reacts with an oxygen atom: ClO• + O → Cl• + O₂.',
        decisionPrompt: 'How many ozone molecules can a single chlorine radical destroy before being sequestered?',
        choices: [
          { id: 'c1', label: 'Over 100,000 ozone molecules', subtext: 'The chlorine radical is regenerated each cycle, acting as an exponential catalytic poison.', consequence: 'A microscopic trace of CFCs can obliterate continental-scale ozone shield volumes!', isOptimal: true },
          { id: 'c2', label: 'Exactly 1 ozone molecule', subtext: 'One-to-one stoichiometric neutralization.', consequence: 'If 1:1, CFC concentrations would have been millions of times too low to cause a measurable hole.', isOptimal: false },
          { id: 'c3', label: 'Zero ozone molecules', subtext: 'No catalytic turnover.', consequence: 'Direct satellite and balloon spectroscopy confirmed immense ClO radical concentrations.', isOptimal: false },
        ],
      },
      {
        stageNumber: 3,
        stageName: 'The Polar Stratospheric Cloud Accelerator',
        clueObservation: 'Why is the ozone hole centered dramatically over Antarctica rather than where CFCs are released in the industrialized Northern Hemisphere?',
        decisionPrompt: 'What unique Antarctic meteorological feature accelerates the chlorine activation?',
        choices: [
          { id: 'c1', label: 'Extreme Polar Vortex & Polar Stratospheric Ice Clouds (PSCs)', subtext: 'Nitric acid ice clouds at -80°C provide solid surface reactions that convert inert chlorine reservoirs into active gas.', consequence: 'When spring sunlight returns, the reservoir flash-converts into active radicals, carving the ozone hole!', isOptimal: true },
          { id: 'c2', label: 'Antarctic Penguins Breathe Out Halogens', subtext: 'Biological emission.', consequence: 'Penguin respiration releases standard CO₂ and water vapor, zero halogens.', isOptimal: false },
          { id: 'c3', label: 'Earth’s Magnetic Pole Pulls Chlorine Down', subtext: 'Magnetic particle funneling.', consequence: 'Chlorine molecules are non-magnetic and not influenced by geomagnetic dipoles.', isOptimal: false },
        ],
      },
    ],
    completionDebrief: 'Mario Molina and Sherwood Rowland’s chemical insight led to the 1987 Montreal Protocol, the most successful international environmental treaty in history.',
    scientificDiscovery: 'Thanks to the global phaseout of CFCs, the stratospheric ozone layer is now demonstrably healing and projected to recover fully by 2066.',
  },

  // 9. The Photoelectric Quantum Spark
  {
    id: 'disc-9',
    sequenceNumber: 9,
    title: 'The Photoelectric Anomaly',
    theme: 'Quantum Optics & Physics',
    initialBrief: 'In 1902, Philipp Lenard shines ultraviolet light on a zinc metal plate, knocking loose electric current (electrons). But classical wave physics cannot explain the measurements.',
    stages: [
      {
        stageNumber: 1,
        stageName: 'The Red Light Failure',
        clueObservation: 'Even the most blindingly intense red floodlight produces zero electrons from the metal plate. Yet a microscopic, ultra-dim spark of ultraviolet light instantly ejects electrons with zero delay.',
        decisionPrompt: 'Why does bright red light fail completely while dim UV light succeeds instantly?',
        choices: [
          { id: 'c1', label: 'Light energy is quantized in discrete packets (Photons): E = hf', subtext: 'Red photons lack the threshold frequency to overcome the work function; UV photons carry plenty.', consequence: 'Albert Einstein’s 1905 paper proves light consists of localized quantum energy packets!', isOptimal: true },
          { id: 'c2', label: 'Red light is naturally cold and freezes electrons', subtext: 'Thermal wavelength cooling.', consequence: 'Wavelength dictates photon quantum energy, not freezing.', isOptimal: false },
          { id: 'c3', label: 'UV light reflects off the back of the metal', subtext: 'Internal mirror bounce.', consequence: 'Photoemission is a surface effect, not an internal reflection artifact.', isOptimal: false },
        ],
      },
      {
        stageNumber: 2,
        stageName: 'Kinetic Energy vs Intensity',
        clueObservation: 'When you turn up the brightness (intensity) of the UV light, what happens to the maximum kinetic energy (speed) of the emitted electrons?',
        decisionPrompt: 'Predict the kinetic energy of the ejected electrons as light intensity doubles:',
        choices: [
          { id: 'c1', label: 'The electron kinetic energy remains unchanged; only the total number of electrons increases', subtext: 'Each electron absorbs exactly one photon; more photons mean more electrons, not faster electrons.', consequence: 'Vindicates the one-to-one photon-electron quantum collision model!', isOptimal: true },
          { id: 'c2', label: 'Electrons fly out at double the speed', subtext: 'Wave amplitude acceleration.', consequence: 'Classical wave theory predicted this, but experiments proved it completely false.', isOptimal: false },
          { id: 'c3', label: 'Electrons slow down and turn around', subtext: 'Electrostatic crowding.', consequence: 'Increased flux does not reverse photoemission under applied voltage.', isOptimal: false },
        ],
      },
      {
        stageNumber: 3,
        stageName: 'The Threshold Work Function (Φ)',
        clueObservation: 'Every metal has a characteristic work function Φ (minimum energy to rip an electron from its Fermi sea: e.g. Cesium is 2.1 eV, Platinum is 5.6 eV).',
        decisionPrompt: 'What technology directly harnesses the photoelectric effect in everyday life?',
        choices: [
          { id: 'c1', label: 'Solar Photovoltaic Panels & Digital Camera Image Sensors (CCD/CMOS)', subtext: 'Incoming light photons knock valence electrons into conduction currents to create power and digital images.', consequence: 'Powers the global clean energy transition and every smartphone camera in human hands!', isOptimal: true },
          { id: 'c2', label: 'Internal Combustion Gasoline Engines', subtext: 'Spark plug mechanics.', consequence: 'Gasoline engines use spark discharges from high-voltage coils, not photoemission.', isOptimal: false },
          { id: 'c3', label: 'Analog Vinyl Record Players', subtext: 'Needle groove audio.', consequence: 'Record players use piezoelectric or electromagnetic induction, not photons.', isOptimal: false },
        ],
      },
    ],
    completionDebrief: 'Albert Einstein won the 1921 Nobel Prize in Physics not for his theory of relativity, but specifically for his mathematical explanation of the photoelectric effect.',
    scientificDiscovery: 'Light exhibits wave-particle duality: traveling as continuous electromagnetic waves, but exchanging energy in discrete quantum packets called photons.',
  },

  // 10. The Deep Time Radiocarbon Clock
  {
    id: 'disc-10',
    sequenceNumber: 10,
    title: 'The Cosmic Ray Atomic Clock',
    theme: 'Nuclear Archaeology',
    initialBrief: 'In 1946 at the University of Chicago, Willard Libby proposes that cosmic rays striking nitrogen in the upper atmosphere continuously forge radioactive Carbon-14.',
    stages: [
      {
        stageNumber: 1,
        stageName: 'The Cosmic Ray Transmutation',
        clueObservation: 'Thermal neutrons from cosmic rays collide with atmospheric nitrogen nuclei: ¹⁴N + n → ¹⁴C + p. The ¹⁴C oxidizes into radioactive carbon dioxide (¹⁴CO₂).',
        decisionPrompt: 'How does radioactive Carbon-14 enter living animals, trees, and humans?',
        choices: [
          { id: 'c1', label: 'Plants absorb ¹⁴CO₂ during photosynthesis, entering the global food web', subtext: 'All living organisms continuously assimilate ¹⁴C in equilibrium with the atmosphere.', consequence: 'Every living tree and creature maintains a steady, active ¹⁴C clock while alive!', isOptimal: true },
          { id: 'c2', label: 'Direct skin absorption from cosmic rays', subtext: 'Cosmic radiation deposits it on skin.', consequence: 'Cosmic rays are high-energy particles, not atomic carbon atoms.', isOptimal: false },
          { id: 'c3', label: 'Drinking groundwater from granite aquifers', subtext: 'Geological dissolved minerals.', consequence: 'Ancient groundwater is depleted of modern radiocarbon.', isOptimal: false },
        ],
      },
      {
        stageNumber: 2,
        stageName: 'The Moment of Cessation',
        clueObservation: 'While an organism is alive, the ratio of ¹⁴C to stable ¹²C is constant (~1 part per trillion). When the organism dies, what happens to this ratio?',
        decisionPrompt: 'Why does the clock begin ticking at the moment of death?',
        choices: [
          { id: 'c1', label: 'Metabolism stops; no new ¹⁴C is ingested while existing ¹⁴C decays with a 5,730-year half-life', subtext: 'Radioactive decay decreases the ¹⁴C/¹²C ratio steadily over thousands of years.', consequence: 'Measuring remaining ¹⁴C activity directly calculates the exact years elapsed since death!', isOptimal: true },
          { id: 'c2', label: 'All ¹⁴C instantly disappears at death', subtext: 'Instant radioactive dump.', consequence: 'Radioactive decay is exponential and continuous (t_1/2 = 5,730 yrs), not instantaneous.', isOptimal: false },
          { id: 'c3', label: 'Carbon-14 turns into solid diamond', subtext: 'Phase crystallization.', consequence: 'Carbon-14 decays back into Nitrogen-14 by beta decay, not diamond.', isOptimal: false },
        ],
      },
      {
        stageNumber: 3,
        stageName: 'Accelerator Mass Spectrometry (AMS)',
        clueObservation: 'After 10 half-lives (~57,300 years), less than 0.1% of the original ¹⁴C remains.',
        decisionPrompt: 'What is the absolute maximum age limit for reliable radiocarbon dating?',
        choices: [
          { id: 'c1', label: 'Approximately 50,000 to 60,000 years', subtext: 'Beyond 60,000 years, remaining ¹⁴C atoms are too sparse to distinguish from background cosmic noise.', consequence: 'Accurately dates ancient cave paintings, Neanderthal fossils, and Egyptian mummies!', isOptimal: true },
          { id: 'c2', label: '65 Million Years (Dinosaur Bones)', subtext: 'Dating Tyrannosaurus rex skeletons.', consequence: 'Dinosaur fossils contain zero original radiocarbon; they must be dated with Uranium-Lead.', isOptimal: false },
          { id: 'c3', label: '4.5 Billion Years (Earth Formation)', subtext: 'Dating meteorites and the solar system.', consequence: 'Carbon-14 half-life is far too short to date solar system genesis.', isOptimal: false },
        ],
      },
    ],
    completionDebrief: 'You decoded Radiocarbon Dating, which earned Willard Libby the 1960 Nobel Prize and revolutionized human archaeology, anthropology, and paleoclimatology.',
    scientificDiscovery: 'Carbon-14 decays via beta emission: ¹⁴₆C → ¹⁴₇N + e⁻ + ν̄ₑ, with a precise half-life of 5,730 ± 40 years.',
  },

  // 11. The Discovery of Noble Gases (Argon)
  {
    id: 'disc-11',
    sequenceNumber: 11,
    title: 'The Phantom Weight of Atmospheric Nitrogen',
    theme: 'Inorganic Chemistry & Gas Laws',
    initialBrief: 'In 1894, Lord Rayleigh discovers that nitrogen extracted from atmospheric air is consistently 0.5% heavier than pure chemical nitrogen generated in a laboratory.',
    stages: [
      {
        stageNumber: 1,
        stageName: 'The Rayleigh Density Discrepancy',
        clueObservation: 'One liter of atmospheric nitrogen weighs 1.2572 grams; one liter of chemical nitrogen from ammonia weighs 1.2505 grams. The discrepancy is tiny, but persistent across 50 trials.',
        decisionPrompt: 'What is your hypothesis for the persistent 0.5% extra weight?',
        choices: [
          { id: 'c1', label: 'Atmospheric air contains an undiscovered heavier gas mixed with nitrogen', subtext: 'A denser, chemically unreactive gas survives all standard nitrogen purification steps.', consequence: 'William Ramsay joins Rayleigh to hunt for the hidden atmospheric ghost!', isOptimal: true },
          { id: 'c2', label: 'Rayleigh’s laboratory scales were broken', subtext: 'Measurement error.', consequence: 'Rayleigh was a master experimentalist; three independent balance scales showed the exact same weight.', isOptimal: false },
          { id: 'c3', label: 'Nitrogen atoms absorb gravity in the air', subtext: 'Variable gravitational attraction.', consequence: 'Gravity exerts identical acceleration on identical masses.', isOptimal: false },
        ],
      },
      {
        stageNumber: 2,
        stageName: 'Chemical Stripping of Air',
        clueObservation: 'Ramsay passes atmospheric air repeatedly over red-hot magnesium to absorb nitrogen (forming Mg₃N₂), red-hot copper to absorb oxygen, and phosphorus pentoxide to absorb water.',
        decisionPrompt: 'When all known reactive atmospheric gases are completely chemically consumed, what remains in the tube?',
        choices: [
          { id: 'c1', label: 'A stubborn 1% bubble of unreactive gas that refuses to react with any substance', subtext: 'An entirely new element with zero chemical reactivity.', consequence: 'They isolate a new element: Argon (from Greek "argos" meaning "lazy / inert")!', isOptimal: true },
          { id: 'c2', label: 'A perfect absolute vacuum', subtext: 'All gases were consumed.', consequence: 'A permanent 1/120th volume bubble refused to react with any reagent.', isOptimal: false },
          { id: 'c3', label: 'Liquid gold droplets', subtext: 'Transmutation.', consequence: 'Chemical reactions cannot transmute gases into precious metals.', isOptimal: false },
        ],
      },
      {
        stageNumber: 3,
        stageName: 'Completing the Periodic Table Column',
        clueObservation: 'Argon has an atomic weight of ~40 and a ratio of specific heats (Cp/Cv) of 1.67, proving it is a single monatomic gas atom (not diatomic).',
        decisionPrompt: 'Where does Argon fit on Dmitri Mendeleev’s Periodic Table?',
        choices: [
          { id: 'c1', label: 'An entirely new column: Group 18 (The Noble Gases)', subtext: 'Between halogens and alkali metals, anticipating Helium, Neon, Krypton, and Xenon.', consequence: 'Mendeleev initially doubted it, but soon added the entire Noble Gas group to the periodic table!', isOptimal: true },
          { id: 'c2', label: 'Wedged between Iron and Nickel', subtext: 'Transition metal slot.', consequence: 'Argon is a non-reactive gas, not a ferromagnetic transition metal.', isOptimal: false },
          { id: 'c3', label: 'Inside the Halogen group under Iodine', subtext: 'Halogen column.', consequence: 'Halogens have 7 valence electrons and are highly reactive; Argon has 8 and is inert.', isOptimal: false },
        ],
      },
    ],
    completionDebrief: 'Lord Rayleigh and William Ramsay earned the 1904 Nobel Prizes for discovering Argon and the entire family of Noble Gases.',
    scientificDiscovery: 'Argon makes up nearly 1% (0.934%) of Earth’s atmosphere by volume, making it the third most abundant atmospheric gas after nitrogen and oxygen.',
  },

  // 12. Graphene Scotch Tape Exfoliation
  {
    id: 'disc-12',
    sequenceNumber: 12,
    title: 'The Friday Night Scotch Tape Experiment',
    theme: '2D Materials & Nanotechnology',
    initialBrief: 'In 2004 at the University of Manchester, Andre Geim and Kostya Novoselov conduct informal "Friday night experiments", tinkering with ordinary graphite and household adhesive tape.',
    stages: [
      {
        stageNumber: 1,
        stageName: 'Peeling Graphite with Office Tape',
        clueObservation: 'Cleaning graphite crystals for scanning tunneling microscopy normally involves pressing Scotch tape to graphite and throwing the tape in the trash.',
        decisionPrompt: 'Instead of discarding the tape, what did Geim and Novoselov do?',
        choices: [
          { id: 'c1', label: 'Folded and peeled the tape repeatedly to cleave graphite into progressively thinner flakes', subtext: 'Iterative micromechanical cleavage splitting atomic layers until reaching single-atom thickness.', consequence: 'Graphite layers thin down from thousands of atoms to individual monolayers!', isOptimal: true },
          { id: 'c2', label: 'Burned the tape with a blowtorch', subtext: 'Thermal pyrolyzation.', consequence: 'Burning tape deposits amorphous black soot and destroys crystalline order.', isOptimal: false },
          { id: 'c3', label: 'Dissolved the tape in liquid nitrogen', subtext: 'Cryogenic embrittlement.', consequence: 'Nitrogen freezes the adhesive but does not separate graphite layers.', isOptimal: false },
        ],
      },
      {
        stageNumber: 2,
        stageName: 'Transfer to Silicon Wafer',
        clueObservation: 'When pressed onto an oxidized silicon wafer with an exact 300 nm SiO₂ oxide thickness, optical interference makes single-atom-thick carbon sheets faintly visible under an optical microscope.',
        decisionPrompt: 'What unique electronic behavior do electrons display inside this 2D honeycomb lattice?',
        choices: [
          { id: 'c1', label: 'They behave as massless Dirac fermions traveling at 1/300 the speed of light', subtext: 'Linear relativistic dispersion relation at Dirac points with ballistic conductivity at room temperature.', consequence: 'Graphene conducts electricity better than copper and heat better than diamond!', isOptimal: true },
          { id: 'c2', label: 'Electrons stop moving completely and freeze into insulators', subtext: 'Mott insulator phase.', consequence: 'Graphene is zero-bandgap semimetal with extraordinarily high electrical conductivity.', isOptimal: false },
          { id: 'c3', label: 'Electrons convert into photons', subtext: 'Total luminescence.', consequence: 'Graphene absorbs exactly 2.3% of light across the visible spectrum, rather than glowing.', isOptimal: false },
        ],
      },
      {
        stageNumber: 3,
        stageName: 'Mechanical Strength Testing',
        clueObservation: 'Atomic force microscope nano-indentation tests the ultimate tensile breaking strength of a pristine graphene monolayer sheet.',
        decisionPrompt: 'How strong is a single monolayer of graphene compared to structural steel?',
        choices: [
          { id: 'c1', label: '200 times stronger than structural steel (Intrinsic strength = 130 GPa)', subtext: 'An invisible monolayer hammock of graphene could support a 4 kg cat without tearing.', consequence: 'Confirmed as the strongest material ever measured in human scientific history!', isOptimal: true },
          { id: 'c2', label: 'Equal to fragile tissue paper', subtext: 'Tears at the slightest breeze.', consequence: 'Single-atom thickness does not mean weak; the sp² carbon-carbon sigma bond is the strongest covalent bond in nature.', isOptimal: false },
          { id: 'c3', label: 'Weak and brittle like chalk', subtext: 'Shatters under touch.', consequence: 'Graphene can stretch elastically by up to 20% of its initial length before rupture.', isOptimal: false },
        ],
      },
    ],
    completionDebrief: 'Geim and Novoselov were awarded the 2010 Nobel Prize in Physics for their groundbreaking experiments regarding the two-dimensional material graphene.',
    scientificDiscovery: 'Graphene proved that stable 2D atomic crystals can exist in nature despite the Mermin-Wagner theorem predicting thermal fluctuations would destroy them.',
  },

  // 13. The Discovery of Cosmic Neutrinos
  {
    id: 'disc-13',
    sequenceNumber: 13,
    title: 'The Ghost Particle of the Core of the Sun',
    theme: 'Subatomic Particle Physics',
    initialBrief: 'In 1968, Ray Davis Jr. builds a 100,000-gallon dry-cleaning fluid tank (perchloroethylene, C₂Cl₄) 4,850 feet deep underground in the Homestake Gold Mine, South Dakota.',
    stages: [
      {
        stageNumber: 1,
        stageName: 'Why One Mile Underground?',
        clueObservation: 'Solar fusion produces trillions of uncharged, nearly massless neutrinos that pass straight through the Earth like sunlight through glass.',
        decisionPrompt: 'Why must the neutrino detector be located one mile deep inside a bedrock mine?',
        choices: [
          { id: 'c1', label: 'To shield the tank from cosmic rays that would trigger false-positive signals', subtext: 'One mile of solid rock absorbs atmospheric muons and gamma rays, leaving only ghost neutrinos.', consequence: 'Background cosmic noise drops by 99.999%, allowing single-atom detection!', isOptimal: true },
          { id: 'c2', label: 'Neutrinos only travel underground', subtext: 'Subterranean particle behavior.', consequence: 'Neutrinos pass through space, rock, water, and humans with equal ease.', isOptimal: false },
          { id: 'c3', label: 'The mine contains natural radioactive coolant', subtext: 'Geothermal cooling.', consequence: 'The deep mine is actually very hot (95°F) and requires air conditioning.', isOptimal: false },
        ],
      },
      {
        stageNumber: 2,
        stageName: 'The Chlorine-37 Capture Reaction',
        clueObservation: 'When a solar electron neutrino strikes a chlorine-37 nucleus, it transmutes the chlorine into a single radioactive Argon-37 atom: νₑ + ³⁷Cl → ³⁷Ar + e⁻.',
        decisionPrompt: 'How many single argon atoms does Davis extract from 100,000 gallons of fluid every month?',
        choices: [
          { id: 'c1', label: 'Roughly 15 single atoms out of 10³⁰ molecules', subtext: 'Bubbling helium sweeps out the handful of volatile argon atoms to be counted in a tiny Geiger counter.', consequence: 'The most extraordinary needle-in-a-haystack chemical extraction in human history!', isOptimal: true },
          { id: 'c2', label: '10,000 kilograms of solid argon', subtext: 'Massive bulk accumulation.', consequence: 'Neutrino cross-sections are so tiny that bulk production is impossible.', isOptimal: false },
          { id: 'c3', label: 'Zero atoms every month', subtext: 'Null capture.', consequence: 'The detector reliably produced around 15 atoms of ³⁷Ar each month.', isOptimal: false },
        ],
      },
      {
        stageNumber: 3,
        stageName: 'The Solar Neutrino Problem Solution',
        clueObservation: 'The Homestake experiment consistently measured only ONE-THIRD of the neutrinos predicted by standard solar fusion astrophysics. This became the famous "Solar Neutrino Problem".',
        decisionPrompt: 'What was the revolutionary explanation for the missing two-thirds of solar neutrinos?',
        choices: [
          { id: 'c1', label: 'Neutrino Oscillation: Neutrinos have mass and change flavors during their 8-minute flight', subtext: 'Born as electron neutrinos, they oscillate into muon and tau neutrinos that Homestake could not detect.', consequence: 'The 2015 Nobel Prize confirmed neutrino oscillation, proving neutrinos possess non-zero mass!', isOptimal: true },
          { id: 'c2', label: 'The Sun was shutting down and dying', subtext: 'Solar collapse.', consequence: 'The Sun’s core is in perfect hydrostatic and thermal equilibrium.', isOptimal: false },
          { id: 'c3', label: 'Neutrinos evaporate into empty vacuum', subtext: 'Particle disintegration.', consequence: 'Neutrinos are stable leptons that do not decay in flight.', isOptimal: false },
        ],
      },
    ],
    completionDebrief: 'Ray Davis Jr. and Masatoshi Koshiba shared the 2002 Nobel Prize in Physics for opening neutrino astronomy and testing the furnace of the Sun.',
    scientificDiscovery: 'Neutrino oscillation (mixing of mass eigenstates) provided the first experimental proof of physics beyond the Standard Model of particle physics.',
  },

  // 14. CRISPR Gene Editing Mechanism
  {
    id: 'disc-14',
    sequenceNumber: 14,
    title: 'The Bacterial Adaptive Immune Memory',
    theme: 'Biochemistry & Molecular Genetics',
    initialBrief: 'In 2012, Emmanuelle Charpentier and Jennifer Doudna study how yogurt bacteria (Streptococcus thermophilus) protect themselves against invading bacteriophage viruses.',
    stages: [
      {
        stageNumber: 1,
        stageName: 'Decoding the CRISPR Repeats',
        clueObservation: 'Bacterial genomes contain unusual clusters of repetitive palindromic DNA (CRISPR) separated by short viral DNA "spacers" stolen from past viral invaders.',
        decisionPrompt: 'What is the biological function of these stored viral spacer sequences?',
        choices: [
          { id: 'c1', label: 'A molecular "wanted poster" archive to recognize and destroy returning viruses', subtext: 'Bacteria transcribe these spacers into guide RNAs that identify matching viral DNA.', consequence: 'Unveils that bacteria possess an adaptive immune memory system!', isOptimal: true },
          { id: 'c2', label: 'Useless junk DNA accumulated from infections', subtext: 'Evolutionary trash.', consequence: 'The spacers are active, transcribed into guide RNA arrays.', isOptimal: false },
          { id: 'c3', label: 'Viral poison intended to kill the bacteria', subtext: 'Parasitic destruction.', consequence: 'The bacteria actively use them to synthesize defense endonuclease enzymes.', isOptimal: false },
        ],
      },
      {
        stageNumber: 2,
        stageName: 'The Cas9 Molecular Scissors',
        clueObservation: 'The Cas9 enzyme forms a complex with CRISPR guide RNA (crRNA) and trans-activating crRNA (tracrRNA).',
        decisionPrompt: 'What does the Cas9 enzyme do when the guide RNA finds an exact match in invading DNA?',
        choices: [
          { id: 'c1', label: 'It makes a precise double-stranded cut across both strands of the target DNA', subtext: 'Dual endonuclease domains (RuvC and HNH) slice the DNA at the exact targeted coordinate.', consequence: 'The viral DNA is severed and deactivated with surgical molecular precision!', isOptimal: true },
          { id: 'c2', label: 'It coats the DNA in sugar', subtext: 'Glycosylation.', consequence: 'Cas9 is a nuclease (scissors), not a glycosyltransferase.', isOptimal: false },
          { id: 'c3', label: 'It turns the DNA into protein', subtext: 'Translation.', consequence: 'Ribosomes translate mRNA into protein, Cas9 does not.', isOptimal: false },
        ],
      },
      {
        stageNumber: 3,
        stageName: 'Engineering the Single-Guide RNA (sgRNA)',
        clueObservation: 'Doudna and Charpentier realize they can fuse the two separate RNA components into a single synthetic guide RNA (sgRNA) programmed with any 20-letter sequence.',
        decisionPrompt: 'What did this engineering breakthrough achieve?',
        choices: [
          { id: 'c1', label: 'A programmable molecular word processor to edit any gene in any living cell', subtext: 'Any genetic sequence in humans, plants, or animals can now be located, cut, and corrected.', consequence: 'Awarded the 2020 Nobel Prize in Chemistry; enables cures for sickle cell disease and genetic blindness!', isOptimal: true },
          { id: 'c2', label: 'A faster way to brew yogurt only', subtext: 'Industrial food optimization.', consequence: 'CRISPR transformed the entire biosphere, curing human genetic disease.', isOptimal: false },
          { id: 'c3', label: 'A method to clone whole mammoths overnight', subtext: 'Instant cloning.', consequence: 'CRISPR edits DNA sequences; it does not eliminate embryological gestation requirements.', isOptimal: false },
        ],
      },
    ],
    completionDebrief: 'Jennifer Doudna and Emmanuelle Charpentier made history with the 2020 Nobel Prize in Chemistry, democratizing precise genome engineering.',
    scientificDiscovery: 'CRISPR-Cas9 uses a simple 20-nucleotide guide RNA sequence to locate and cleave DNA adjacent to a 5’-NGG Protospacer Adjacent Motif (PAM).',
  },

  // 15. The Strange Liquid Helium Superfluid
  {
    id: 'disc-15',
    sequenceNumber: 15,
    title: 'The Zero-Viscosity Superfluid Fountain',
    theme: 'Bose-Einstein Condensation & Quantum Fluids',
    initialBrief: 'In 1937, Pyotr Kapitsa in Moscow and John Allen in Cambridge cool liquid Helium-4 below the Lambda point (2.17 Kelvin), discovering a phase transition into "Helium II".',
    stages: [
      {
        stageNumber: 1,
        stageName: 'The Vanishing Viscosity Measurement',
        clueObservation: 'When forced through an ultra-tight capillary gap of just 0.5 micrometers, normal liquids stall. At 2.17 K, Helium-4 flows through with completely zero detectable viscosity.',
        decisionPrompt: 'What is the term for a fluid that flows with zero internal friction and zero viscosity?',
        choices: [
          { id: 'c1', label: 'Superfluid', subtext: 'A macroscopic quantum fluid that flows indefinitely without losing kinetic energy.', consequence: 'Kapitsa coins the term "Superfluidity", analogous to superconductivity!', isOptimal: true },
          { id: 'c2', label: 'Supercritical Steam', subtext: 'High-temperature fluid.', consequence: 'Helium II exists near absolute zero (-271°C), not high temperature.', isOptimal: false },
          { id: 'c3', label: 'Plasma Gas', subtext: 'Ionized gas.', consequence: 'Helium-4 atoms remain completely neutral with bound electrons.', isOptimal: false },
        ],
      },
      {
        stageNumber: 2,
        stageName: 'The Creeping Rollin Film',
        clueObservation: 'An open glass beaker containing liquid Helium II is suspended above the liquid bath. Unexpectedly, drops of liquid helium begin forming on the outer bottom of the beaker and dripping back down.',
        decisionPrompt: 'How is the liquid escaping the beaker?',
        choices: [
          { id: 'c1', label: 'A 30-nanometer Rollin film crawls up the inner wall, over the lip, and down the outside', subtext: 'Van der Waals forces pull a quantum film up and over the rim because zero viscosity removes friction resistance.', consequence: 'The fluid self-siphons out of any open container to equalize gravitational potential!', isOptimal: true },
          { id: 'c2', label: 'The glass has invisible cracks', subtext: 'Porous glass leakage.', consequence: 'The same beaker holds room-temperature water with zero leaks for years.', isOptimal: false },
          { id: 'c3', label: 'The liquid evaporates and condenses on the bottom', subtext: 'Vapor distillation.', consequence: 'Direct high-speed photography proves an active creeping liquid film climbing the walls.', isOptimal: false },
        ],
      },
      {
        stageNumber: 3,
        stageName: 'The Thermomechanical Fountain Effect',
        clueObservation: 'When an internal heating wire is gently pulsed inside a U-tube packed with fine emery powder and submerged in superfluid helium, what occurs?',
        decisionPrompt: 'What dramatic visual effect does heating produce?',
        choices: [
          { id: 'c1', label: 'A continuous liquid helium fountain shoots 30 cm into the air from the tube tip', subtext: 'The fountain effect: heat draws superfluid through the powder to dilute entropy, building osmotic pressure.', consequence: 'Demonstrates macroscopic quantum thermodynamics in action!', isOptimal: true },
          { id: 'c2', label: 'The liquid freezes instantly into solid diamond', subtext: 'Thermal crystallization.', consequence: 'Liquid Helium-4 cannot freeze under normal pressure; it requires 25 atmospheres of pressure even at absolute zero.', isOptimal: false },
          { id: 'c3', label: 'The tube implodes with a loud bang', subtext: 'Vacuum collapse.', consequence: 'The fountain produces positive upward pressure, not a collapse.', isOptimal: false },
        ],
      },
    ],
    completionDebrief: 'Pyotr Kapitsa won the 1978 Nobel Prize in Physics for his fundamental inventions and discoveries in the area of low-temperature physics.',
    scientificDiscovery: 'Helium-4 atoms are bosons (integer spin 0). Below 2.17 K, a significant fraction undergo Bose-Einstein condensation into the zero-momentum quantum ground state.',
  },
];

export function getSharedDiscoverySequence(sequenceNumber: number): SharedDiscoverySequence {
  const index = (sequenceNumber - 1) % SHARED_DISCOVERY_SEQUENCES.length;
  return SHARED_DISCOVERY_SEQUENCES[index];
}
