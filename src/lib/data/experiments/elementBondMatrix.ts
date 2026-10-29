export interface ChemicalElement {
  id: string;
  symbol: string;
  name: string;
  atomicNumber: number;
  atomicMass: number;
  valenceElectrons: number;
  electronegativity: number;
  category: 'Nonmetal' | 'Alkali Metal' | 'Halogen' | 'Noble Gas' | 'Transition Metal';
  stateAtSTP: 'Gas' | 'Liquid' | 'Solid';
  color: string;
  tagline: string;
  description: string;
}

export interface DetailedBondOutcome {
  key: string; // e.g. "H-O" or "Na-Cl" (sorted alphabetically by element id)
  elementAId: string;
  elementBId: string;
  compoundFormula: string;
  compoundName: string;
  bondType: 'Polar Covalent' | 'Nonpolar Covalent' | 'Ionic' | 'Metallic' | 'Inert / Non-Bonding' | 'Coordination Complex';
  polarityScore: number; // 0 (nonpolar) to 100 (highly ionic)
  valenceCompatibility: number; // 0 to 100%
  structure: string; // e.g. "Bent 104.5°", "Linear 180°", "Face-Centered Cubic"
  description: string;
  realWorldApplication: string;
  chemicalFunFact: string;
}

export const EXPANDED_ELEMENTS: ChemicalElement[] = [
  {
    id: 'el-h',
    symbol: 'H',
    name: 'Hydrogen',
    atomicNumber: 1,
    atomicMass: 1.008,
    valenceElectrons: 1,
    electronegativity: 2.2,
    category: 'Nonmetal',
    stateAtSTP: 'Gas',
    color: '#38BDF8',
    tagline: 'Cosmic Origin',
    description: 'The simplest, lightest, and most abundant chemical element in the universe, fueling stellar fusion.',
  },
  {
    id: 'el-c',
    symbol: 'C',
    name: 'Carbon',
    atomicNumber: 6,
    atomicMass: 12.011,
    valenceElectrons: 4,
    electronegativity: 2.55,
    category: 'Nonmetal',
    stateAtSTP: 'Solid',
    color: '#94A3B8',
    tagline: 'Backbone of Life',
    description: 'Tetravalent structural master able to form stable covalent chains, rings, and complex macromolecules.',
  },
  {
    id: 'el-n',
    symbol: 'N',
    name: 'Nitrogen',
    atomicNumber: 7,
    atomicMass: 14.007,
    valenceElectrons: 5,
    electronegativity: 3.04,
    category: 'Nonmetal',
    stateAtSTP: 'Gas',
    color: '#818CF8',
    tagline: 'Atmospheric Shield',
    description: 'Forms an exceptionally stable triple bond (N≡N), composing 78% of Earth’s atmosphere and amino acids.',
  },
  {
    id: 'el-o',
    symbol: 'O',
    name: 'Oxygen',
    atomicNumber: 8,
    atomicMass: 15.999,
    valenceElectrons: 6,
    electronegativity: 3.44,
    category: 'Nonmetal',
    stateAtSTP: 'Gas',
    color: '#EF4444',
    tagline: 'Vital Oxidizer',
    description: 'Highly electronegative reactive gas essential for aerobic respiration and global combustion cycles.',
  },
  {
    id: 'el-f',
    symbol: 'F',
    name: 'Fluorine',
    atomicNumber: 9,
    atomicMass: 18.998,
    valenceElectrons: 7,
    electronegativity: 3.98,
    category: 'Halogen',
    stateAtSTP: 'Gas',
    color: '#34D399',
    tagline: 'Electronegative Apex',
    description: 'The most chemically electronegative element, aggressively stripping electrons from nearly all substances.',
  },
  {
    id: 'el-li',
    symbol: 'Li',
    name: 'Lithium',
    atomicNumber: 3,
    atomicMass: 6.94,
    valenceElectrons: 1,
    electronegativity: 0.98,
    category: 'Alkali Metal',
    stateAtSTP: 'Solid',
    color: '#F472B6',
    tagline: 'Lightest Metal',
    description: 'Ultra-light electropositive alkali metal with high standard electrochemical potential for energy storage.',
  },
  {
    id: 'el-na',
    symbol: 'Na',
    name: 'Sodium',
    atomicNumber: 11,
    atomicMass: 22.99,
    valenceElectrons: 1,
    electronegativity: 0.93,
    category: 'Alkali Metal',
    stateAtSTP: 'Solid',
    color: '#FBBF24',
    tagline: 'Active Electrolyte',
    description: 'Soft, highly reactive alkali metal essential for cellular electrolyte gradients and osmotic equilibrium.',
  },
  {
    id: 'el-cl',
    symbol: 'Cl',
    name: 'Chlorine',
    atomicNumber: 17,
    atomicMass: 35.45,
    valenceElectrons: 7,
    electronegativity: 3.16,
    category: 'Halogen',
    stateAtSTP: 'Gas',
    color: '#A3E635',
    tagline: 'Halogen Purifier',
    description: 'Yellow-green reactive halogen that readily accepts an electron to achieve noble argon electron configuration.',
  },
  {
    id: 'el-he',
    symbol: 'He',
    name: 'Helium',
    atomicNumber: 2,
    atomicMass: 4.0026,
    valenceElectrons: 2,
    electronegativity: 0,
    category: 'Noble Gas',
    stateAtSTP: 'Gas',
    color: '#A78BFA',
    tagline: 'Inert Noble Duet',
    description: 'Completely closed 1s² shell, rendering it chemically inert with the lowest boiling point of any element.',
  },
  {
    id: 'el-ne',
    symbol: 'Ne',
    name: 'Neon',
    atomicNumber: 10,
    atomicMass: 20.18,
    valenceElectrons: 8,
    electronegativity: 0,
    category: 'Noble Gas',
    stateAtSTP: 'Gas',
    color: '#FB923C',
    tagline: 'Glow Resonance',
    description: 'Classic noble gas with a full octet; glows bright reddish-orange in high-voltage electric discharge.',
  },
  {
    id: 'el-fe',
    symbol: 'Fe',
    name: 'Iron',
    atomicNumber: 26,
    atomicMass: 55.845,
    valenceElectrons: 8,
    electronegativity: 1.83,
    category: 'Transition Metal',
    stateAtSTP: 'Solid',
    color: '#E2E8F0',
    tagline: 'Cosmic Core',
    description: 'The final element produced by stellar nucleosynthesis before supernova collapse; powers hemoglobin and steel.',
  },
  {
    id: 'el-au',
    symbol: 'Au',
    name: 'Gold',
    atomicNumber: 79,
    atomicMass: 196.97,
    valenceElectrons: 11,
    electronegativity: 2.54,
    category: 'Transition Metal',
    stateAtSTP: 'Solid',
    color: '#FACC15',
    tagline: 'Relativistic Noble Metal',
    description: 'Remarkably unreactive transition metal whose golden yellow luster is caused by special relativistic electron contraction.',
  },
];

// Helper to create a consistent compound lookup key
export function getBondKey(idA: string, idB: string): string {
  return [idA, idB].sort().join('::');
}

export const DETAILED_BOND_MATRIX: Record<string, DetailedBondOutcome> = {
  // H + O -> H2O Water
  [getBondKey('el-h', 'el-o')]: {
    key: getBondKey('el-h', 'el-o'),
    elementAId: 'el-h',
    elementBId: 'el-o',
    compoundFormula: 'H₂O',
    compoundName: 'Dihydrogen Monoxide (Water)',
    bondType: 'Polar Covalent',
    polarityScore: 78,
    valenceCompatibility: 98,
    structure: 'Bent Molecular Geometry (104.5°)',
    description: 'Hydrogen and oxygen establish strong polar covalent bonds with an asymmetric dipole moment, generating universal life-supporting solvent hydrogen bonding.',
    realWorldApplication: 'The universal solvent for biochemistry, cellular transport, and global climate moderation.',
    chemicalFunFact: 'Water expands when freezing into ice due to open hexagonal hydrogen-bonded crystal lattices, which is why ice floats.',
  },

  // C + O -> CO2 Carbon Dioxide
  [getBondKey('el-c', 'el-o')]: {
    key: getBondKey('el-c', 'el-o'),
    elementAId: 'el-c',
    elementBId: 'el-o',
    compoundFormula: 'CO₂',
    compoundName: 'Carbon Dioxide',
    bondType: 'Polar Covalent',
    polarityScore: 35,
    valenceCompatibility: 94,
    structure: 'Linear Symmetric (180°)',
    description: 'Two double covalent bonds (O=C=O). Individual C=O bonds are polar, but opposing dipoles cancel out symmetrically, yielding a nonpolar linear molecule.',
    realWorldApplication: 'Plant photosynthesis feedstock, carbonated beverage effervescence, and supercritical extraction.',
    chemicalFunFact: 'Under normal atmospheric pressure, solid CO₂ (dry ice) sublimates directly into gas at -78.5°C without melting into a liquid.',
  },

  // Na + Cl -> NaCl Table Salt
  [getBondKey('el-na', 'el-cl')]: {
    key: getBondKey('el-na', 'el-cl'),
    elementAId: 'el-na',
    elementBId: 'el-cl',
    compoundFormula: 'NaCl',
    compoundName: 'Sodium Chloride (Halite)',
    bondType: 'Ionic',
    polarityScore: 95,
    valenceCompatibility: 99,
    structure: 'Face-Centered Cubic Lattice',
    description: 'Sodium transfers its single valence electron entirely to chlorine, creating Na⁺ and Cl⁻ ions locked into an electrostatic 3D crystal lattice.',
    realWorldApplication: 'Essential biological electrolyte for neuron action potentials, cellular hydration, and food preservation.',
    chemicalFunFact: 'Separately, sodium metal explodes in water and chlorine is a toxic choking gas; bonded together, they form harmless everyday table salt.',
  },

  // H + C -> CH4 Methane
  [getBondKey('el-c', 'el-h')]: {
    key: getBondKey('el-c', 'el-h'),
    elementAId: 'el-c',
    elementBId: 'el-h',
    compoundFormula: 'CH₄',
    compoundName: 'Methane (Natural Gas)',
    bondType: 'Nonpolar Covalent',
    polarityScore: 12,
    valenceCompatibility: 96,
    structure: 'Tetrahedral (109.5°)',
    description: 'Four equivalent single covalent bonds where sp³ hybridized carbon shares electrons with four hydrogen atoms in perfect 3D tetrahedral symmetry.',
    realWorldApplication: 'Primary hydrocarbon fuel for clean-burning natural gas and clean cryogenic rocket propulsion.',
    chemicalFunFact: 'Methane lakes and rain cycles exist on Saturn’s giant moon Titan under surface temperatures of -179°C.',
  },

  // H + N -> NH3 Ammonia
  [getBondKey('el-h', 'el-n')]: {
    key: getBondKey('el-h', 'el-n'),
    elementAId: 'el-h',
    elementBId: 'el-n',
    compoundFormula: 'NH₃',
    compoundName: 'Ammonia',
    bondType: 'Polar Covalent',
    polarityScore: 65,
    valenceCompatibility: 95,
    structure: 'Trigonal Pyramidal (107.8°)',
    description: 'Nitrogen shares electrons with three hydrogen atoms while retaining one lone pair that pushes bonds into a distinct polar pyramid.',
    realWorldApplication: 'Fertilizer synthesis feeding half the planet and refrigeration fluid for industrial cold-storage facilities.',
    chemicalFunFact: 'Ammonia molecules rapidly undergo "umbrella inversion" (quantum tunneling) through their lone pair over 24 billion times per second.',
  },

  // Li + F -> LiF Lithium Fluoride
  [getBondKey('el-f', 'el-li')]: {
    key: getBondKey('el-f', 'el-li'),
    elementAId: 'el-f',
    elementBId: 'el-li',
    compoundFormula: 'LiF',
    compoundName: 'Lithium Fluoride',
    bondType: 'Ionic',
    polarityScore: 98,
    valenceCompatibility: 99,
    structure: 'Rock Salt Cubic Crystal',
    description: 'The maximum electronegativity disparity in diatomic chemistry (ΔEN = 3.0). Produces an extraordinarily tight, high-lattice-energy ionic bond.',
    realWorldApplication: 'UV optics transmission windows and molten salt coolant for Generation IV nuclear reactors.',
    chemicalFunFact: 'LiF has the highest UV light transmission window of any material, remaining clear down to vacuum UV at 105 nm.',
  },

  // Fe + C -> Fe3C Cementite (Steel Alloy)
  [getBondKey('el-c', 'el-fe')]: {
    key: getBondKey('el-c', 'el-fe'),
    elementAId: 'el-c',
    elementBId: 'el-fe',
    compoundFormula: 'Fe₃C',
    compoundName: 'Iron Carbide (Cementite / Steel)',
    bondType: 'Metallic',
    polarityScore: 20,
    valenceCompatibility: 88,
    structure: 'Orthorhombic Interstitial Solid',
    description: 'Interstitial carbon atoms wedge into the metallic iron lattice, preventing iron slip planes and dramatically increasing structural tensile strength.',
    realWorldApplication: 'High-strength structural steel for bridges, skyscrapers, aerospace airframes, and surgical instruments.',
    chemicalFunFact: 'Adding as little as 0.2% carbon to iron increases its tensile strength by more than 400% compared to pure elemental iron.',
  },

  // He + Ne -> Inert Mixture
  [getBondKey('el-he', 'el-ne')]: {
    key: getBondKey('el-he', 'el-ne'),
    elementAId: 'el-he',
    elementBId: 'el-ne',
    compoundFormula: 'He + Ne',
    compoundName: 'Helium-Neon Resonant Gas',
    bondType: 'Inert / Non-Bonding',
    polarityScore: 0,
    valenceCompatibility: 75,
    structure: 'Monatomic Dispersed Mixture',
    description: 'Both elements boast filled electron shells (1s² and 2s²2p⁶). No chemical electrons are shared, but collisions transfer energy efficiently via quantum resonance.',
    realWorldApplication: 'Helium-Neon (HeNe) optical lasers producing precise 632.8 nm red beam alignment in medical and surveying tools.',
    chemicalFunFact: 'He-Ne was the very first continuous-wave gas laser ever demonstrated, invented at Bell Labs in 1960.',
  },

  // H + Cl -> HCl Hydrochloric Acid
  [getBondKey('el-cl', 'el-h')]: {
    key: getBondKey('el-cl', 'el-h'),
    elementAId: 'el-cl',
    elementBId: 'el-h',
    compoundFormula: 'HCl',
    compoundName: 'Hydrogen Chloride (Gastric Acid)',
    bondType: 'Polar Covalent',
    polarityScore: 72,
    valenceCompatibility: 94,
    structure: 'Linear Polar (180°)',
    description: 'A strong polar covalent gas that dissociates 100% in water into H⁺ and Cl⁻ ions, forming gastric digestive acid.',
    realWorldApplication: 'Stomach protein digestion, steel pickling, and semiconductor silicon purification.',
    chemicalFunFact: 'The human stomach lining produces roughly 2 liters of hydrochloric acid daily, maintaining an acidic pH of 1.5 to 3.5.',
  },

  // N + O -> NO2 Nitrogen Dioxide
  [getBondKey('el-n', 'el-o')]: {
    key: getBondKey('el-n', 'el-o'),
    elementAId: 'el-n',
    elementBId: 'el-o',
    compoundFormula: 'NO₂',
    compoundName: 'Nitrogen Dioxide',
    bondType: 'Polar Covalent',
    polarityScore: 55,
    valenceCompatibility: 90,
    structure: 'Bent Paramagnetic Radical (134.3°)',
    description: 'Contains an unpaired free-radical electron, giving the gas a prominent reddish-brown color and dynamic equilibrium with dinitrogen tetroxide (N₂O₄).',
    realWorldApplication: 'Nitric acid manufacturing precursor and aerospace hypergolic oxidizer propellant.',
    chemicalFunFact: 'Cooling NO₂ gas causes two molecules to dimerize into colorless liquid N₂O₄; warming reverses it back to brown NO₂.',
  },

  // Fe + Au -> Metallic Alloy
  [getBondKey('el-au', 'el-fe')]: {
    key: getBondKey('el-au', 'el-fe'),
    elementAId: 'el-au',
    elementBId: 'el-fe',
    compoundFormula: 'Fe-Au',
    compoundName: 'Iron-Gold Bimetallic Nanoparticles',
    bondType: 'Metallic',
    polarityScore: 18,
    valenceCompatibility: 86,
    structure: 'Delocalized Electron Sea Alloy',
    description: 'Delocalized valence electrons freely wander through interlocking positive metal cation cores, imparting high magnetic and plasmonic optical response.',
    realWorldApplication: 'Targeted cancer photothermal therapy and ultra-sensitive biosensor diagnostic probes.',
    chemicalFunFact: 'Fe-Au nanoparticles can be steered by external magnetic fields into tumors and then heated with infrared laser light to destroy malignant cells.',
  },

  // Default fallback for any remaining combinations
  default: {
    key: 'default',
    elementAId: 'el-c',
    elementBId: 'el-h',
    compoundFormula: 'R-CH',
    compoundName: 'Resonant Organometallic Complex',
    bondType: 'Polar Covalent',
    polarityScore: 50,
    valenceCompatibility: 88,
    structure: 'Hybrid Molecular Complex',
    description: 'A stable shared valence electron arrangement demonstrating cooperative bonding balance.',
    realWorldApplication: 'Synthetic chemistry catalyst and materials engineering.',
    chemicalFunFact: 'Over 160 million unique chemical substances have been registered by the Chemical Abstracts Service to date.',
  },
};

export function getDetailedBondOutcome(idA: string, idB: string): DetailedBondOutcome {
  const key = getBondKey(idA, idB);
  if (DETAILED_BOND_MATRIX[key]) {
    return DETAILED_BOND_MATRIX[key];
  }
  // If exact match not in map, synthesize plausible outcome
  const elA = EXPANDED_ELEMENTS.find((e) => e.id === idA) || EXPANDED_ELEMENTS[1];
  const elB = EXPANDED_ELEMENTS.find((e) => e.id === idB) || EXPANDED_ELEMENTS[3];

  const diff = Math.abs(elA.electronegativity - elB.electronegativity);
  const isIonic = diff > 1.7;
  const isNoble = elA.category === 'Noble Gas' || elB.category === 'Noble Gas';

  return {
    key,
    elementAId: idA,
    elementBId: idB,
    compoundFormula: `${elA.symbol}${elB.symbol}`,
    compoundName: `${elA.name} ${elB.name} Adduct`,
    bondType: isNoble ? 'Inert / Non-Bonding' : isIonic ? 'Ionic' : 'Polar Covalent',
    polarityScore: Math.round(Math.min(100, diff * 30)),
    valenceCompatibility: Math.max(70, 100 - Math.round(diff * 10)),
    structure: isIonic ? 'Crystalline Electrostatic Array' : 'Molecular Orbit',
    description: `${elA.name} and ${elB.name} interact with an electronegativity delta of ${diff.toFixed(2)}, forming a ${isIonic ? 'strong ionic lattice' : 'shared valence electron cloud'}.`,
    realWorldApplication: 'Laboratory chemical synthesis and modern materials science.',
    chemicalFunFact: 'Electronegativity values were first quantified by Linus Pauling in 1932 using bond energy thermochemical measurements.',
  };
}

export interface BondChallengeRound {
  round: number;
  title: string;
  subtext: string;
  suggestedGoal: string;
}

export const BOND_CHALLENGE_ROUNDS: BondChallengeRound[] = [
  {
    round: 1,
    title: 'Round 1: Diatomic Instinct',
    subtext: 'Pick your intuitive elemental preference without consulting partner.',
    suggestedGoal: 'Test spontaneous elemental resonance.',
  },
  {
    round: 2,
    title: 'Round 2: Valence Resonance',
    subtext: 'Aim for maximum octet stability: combine an electron donor with an electron acceptor.',
    suggestedGoal: 'Target high polarity or covalent equilibrium.',
  },
  {
    round: 3,
    title: 'Round 3: Advanced Synthesis',
    subtext: 'Attempt an exotic metallic alloy or universal solvent combination.',
    suggestedGoal: 'Achieve a synthesis compatibility above 90%.',
  },
];
