import { ElementItem, BondResult } from '../types/chemistry';

export const ELEMENTS: ElementItem[] = [
  {
    id: 'el-c',
    symbol: 'C',
    name: 'Carbon',
    category: 'stable',
    tag: 'The Connector',
    color: '#38bdf8',
    valence: 4,
  },
  {
    id: 'el-o',
    symbol: 'O',
    name: 'Oxygen',
    category: 'reactive',
    tag: 'The Catalyst',
    color: '#34c759',
    valence: 2,
  },
  {
    id: 'el-h',
    symbol: 'H',
    name: 'Hydrogen',
    category: 'reactive',
    tag: 'The Spark',
    color: '#2997ff',
    valence: 1,
  },
  {
    id: 'el-n',
    symbol: 'N',
    name: 'Nitrogen',
    category: 'stable',
    tag: 'The Foundation',
    color: '#a855f7',
    valence: 3,
  },
  {
    id: 'el-li',
    symbol: 'Li',
    name: 'Lithium',
    category: 'magnetic',
    tag: 'The Flame',
    color: '#ff9f0a',
    valence: 1,
  },
  {
    id: 'el-ne',
    symbol: 'Ne',
    name: 'Neon',
    category: 'catalytic',
    tag: 'The Luminary',
    color: '#ff375f',
    valence: 8,
  },
];

export function synthesizeBond(elementAId: string, elementBId: string): BondResult {
  const elA = ELEMENTS.find((e) => e.id === elementAId) || ELEMENTS[0];
  const elB = ELEMENTS.find((e) => e.id === elementBId) || ELEMENTS[1];

  const pairKey = [elA.symbol, elB.symbol].sort().join('-');

  if (elA.symbol === elB.symbol) {
    return {
      elementA: elA,
      elementB: elB,
      bondName: `Resonant ${elA.name} Homodimer`,
      bondType: 'Resonance',
      formula: `${elA.symbol}₂-Ψ`,
      compatibility: 94,
      description: `Both of you chose ${elA.name}. Synchronous instincts operating on identical natural frequencies.`,
    };
  }

  if (pairKey === 'C-O') {
    return {
      elementA: elA,
      elementB: elB,
      bondName: 'Carbonyl Resonance Bridge',
      bondType: 'Covalent',
      formula: 'C═O-Resonance',
      compatibility: 92,
      description: 'High energy transfer with rapid consensus. Carbon creates the structure; Oxygen accelerates the reaction.',
    };
  }

  if (pairKey === 'H-O') {
    return {
      elementA: elA,
      elementB: elB,
      bondName: 'Hydronium Affinity Grid',
      bondType: 'Hydrogen Polar',
      formula: 'H₂O-Harmonic',
      compatibility: 95,
      description: 'Effortless fluid harmony. High polarity creates natural attraction and adaptable equilibrium.',
    };
  }

  if (pairKey === 'C-N') {
    return {
      elementA: elA,
      elementB: elB,
      bondName: 'Cyanuric Molecular Lattice',
      bondType: 'Covalent',
      formula: 'C≡N-Shield',
      compatibility: 89,
      description: 'Remarkably resilient under thermal pressure. Forms deep, unshakeable structural integrity.',
    };
  }

  if (pairKey === 'Li-O') {
    return {
      elementA: elA,
      elementB: elB,
      bondName: 'Lithium Exothermic Matrix',
      bondType: 'Ionic',
      formula: 'Li₂O-Active',
      compatibility: 86,
      description: 'Electrostatically charged with high contrast. Distinct polarities that attract powerfully.',
    };
  }

  if (pairKey === 'C-H') {
    return {
      elementA: elA,
      elementB: elB,
      bondName: 'Hydrocarbon Resonance Strand',
      bondType: 'Covalent',
      formula: 'CH₄-Equilibrium',
      compatibility: 91,
      description: 'A smooth, versatile foundation capable of adapting and expanding in any direction.',
    };
  }

  // General hybrid bond
  return {
    elementA: elA,
    elementB: elB,
    bondName: `${elA.name}-${elB.name} Coordination Bond`,
    bondType: 'Covalent',
    formula: `${elA.symbol}${elB.symbol}-Dynamic`,
    compatibility: 88,
    description: `Complementary pairing combining ${elA.tag.toLowerCase()} with ${elB.tag.toLowerCase()}.`,
  };
}
