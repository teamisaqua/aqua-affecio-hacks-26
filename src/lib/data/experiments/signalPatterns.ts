export interface SignalPatternRound {
  id: string;
  roundNumber: number;
  title: string;
  moleculeName: string;
  gridSize: 3 | 4; // 3x3 or 4x4 grid
  descriptorPrompt: string; // What Descriptor sees as guidance
  targetGrid: string[]; // Length = gridSize * gridSize. Each cell is an element symbol or empty ''
  keyPoints: string[]; // Distinct geometric features to describe
}

export const SIGNAL_PATTERN_ROUNDS: SignalPatternRound[] = [
  // Round 1: Water Molecule (H2O - Bent Geometry) - 3x3
  {
    id: 'sig-1',
    roundNumber: 1,
    title: 'Water Molecule (Bent Geometry)',
    moleculeName: 'H₂O (Water)',
    gridSize: 3,
    descriptorPrompt: 'Describe the central Oxygen atom and the two angled Hydrogen atoms. Tell your partner exactly which row and column to place each element!',
    // Grid 3x3 layout:
    // [ 'H', '', 'H' ]
    // [ '',  'O', ''  ]
    // [ '',  '',  ''  ]
    targetGrid: [
      'H', '', 'H',
      '', 'O', '',
      '', '', '',
    ],
    keyPoints: [
      'Central cell (row 2, col 2) has an O (Oxygen)',
      'Top-left cell (row 1, col 1) has an H (Hydrogen)',
      'Top-right cell (row 1, col 3) has an H (Hydrogen)',
      'All other cells are empty',
    ],
  },

  // Round 2: Carbon Dioxide (CO2 - Linear Geometry) - 3x3
  {
    id: 'sig-2',
    roundNumber: 2,
    title: 'Carbon Dioxide (Linear 180°)',
    moleculeName: 'CO₂ (Carbon Dioxide)',
    gridSize: 3,
    descriptorPrompt: 'Describe the symmetric horizontal bar: Oxygen, Carbon, Oxygen along the center row.',
    // Grid 3x3 layout:
    // [ '',   '',   ''  ]
    // [ 'O', 'C',  'O' ]
    // [ '',   '',   ''  ]
    targetGrid: [
      '', '', '',
      'O', 'C', 'O',
      '', '', '',
    ],
    keyPoints: [
      'Entire middle row (row 2) has O, C, O from left to right',
      'Top and bottom rows are completely empty',
      'Symmetric linear 180° axis',
    ],
  },

  // Round 3: Methane (CH4 - Cross Projection) - 3x3
  {
    id: 'sig-3',
    roundNumber: 3,
    title: 'Methane (Cross 2D Projection)',
    moleculeName: 'CH₄ (Methane)',
    gridSize: 3,
    descriptorPrompt: 'Describe the cross: Carbon in the center, surrounded on all 4 cardinal directions (top, bottom, left, right) by Hydrogens.',
    // Grid 3x3 layout:
    // [ '',  'H', ''  ]
    // [ 'H', 'C', 'H' ]
    // [ '',  'H', ''  ]
    targetGrid: [
      '', 'H', '',
      'H', 'C', 'H',
      '', 'H', '',
    ],
    keyPoints: [
      'Center cell has a C (Carbon)',
      'Top-center, bottom-center, middle-left, and middle-right all have H (Hydrogen)',
      'The four corner cells are empty',
    ],
  },

  // Round 4: Ammonia (NH3 - Trigonal Pyramid) - 3x3
  {
    id: 'sig-4',
    roundNumber: 4,
    title: 'Ammonia (Trigonal Pyramid Base)',
    moleculeName: 'NH₃ (Ammonia)',
    gridSize: 3,
    descriptorPrompt: 'Describe Nitrogen in top-center, with three Hydrogens forming a tripod base below it.',
    // Grid 3x3 layout:
    // [ '',  'N', ''  ]
    // [ '',  '',  ''  ]
    // [ 'H', 'H', 'H' ]
    targetGrid: [
      '', 'N', '',
      '', '', '',
      'H', 'H', 'H',
    ],
    keyPoints: [
      'Top-center has an N (Nitrogen)',
      'Entire bottom row (row 3) has three H atoms',
      'Middle row is completely empty',
    ],
  },

  // Round 5: Table Salt Lattice (NaCl Alternating) - 4x4
  {
    id: 'sig-5',
    roundNumber: 5,
    title: 'Sodium Chloride Crystal Lattice',
    moleculeName: 'NaCl (Rock Salt 2D Slice)',
    gridSize: 4,
    descriptorPrompt: 'Describe the alternating 4x4 checkerboard: Na and Cl alternate like black and white chess squares!',
    // Grid 4x4 layout:
    // [ 'Na', 'Cl', 'Na', 'Cl' ]
    // [ 'Cl', 'Na', 'Cl', 'Na' ]
    // [ 'Na', 'Cl', 'Na', 'Cl' ]
    // [ 'Cl', 'Na', 'Cl', 'Na' ]
    targetGrid: [
      'Na', 'Cl', 'Na', 'Cl',
      'Cl', 'Na', 'Cl', 'Na',
      'Na', 'Cl', 'Na', 'Cl',
      'Cl', 'Na', 'Cl', 'Na',
    ],
    keyPoints: [
      'Row 1: Na, Cl, Na, Cl',
      'Row 2: Cl, Na, Cl, Na',
      'Row 3: Na, Cl, Na, Cl',
      'Row 4: Cl, Na, Cl, Na',
      'Every Na is bordered exclusively by Cl neighbors',
    ],
  },

  // Round 6: Benzene Aromatic Ring - 4x4
  {
    id: 'sig-6',
    roundNumber: 6,
    title: 'Benzene Hexagonal Carbon Ring',
    moleculeName: 'C₆H₆ (Aromatic Hexagon)',
    gridSize: 4,
    descriptorPrompt: 'Describe the 6 Carbon atoms forming a hexagon loop inside the 4x4 grid.',
    // Grid 4x4 layout:
    // [ '',  'C', 'C', ''  ]
    // [ 'C', '',  '',  'C' ]
    // [ 'C', '',  '',  'C' ]
    // [ '',  'C', 'C', ''  ]
    targetGrid: [
      '', 'C', 'C', '',
      'C', '', '', 'C',
      'C', '', '', 'C',
      '', 'C', 'C', '',
    ],
    keyPoints: [
      'Top row center: two C atoms (cols 2 and 3)',
      'Bottom row center: two C atoms (cols 2 and 3)',
      'Left edge: two C atoms in rows 2 and 3',
      'Right edge: two C atoms in rows 2 and 3',
      'The four center cells and the four corners are empty',
    ],
  },
];

export function getSignalPatternRound(roundNumber: number): SignalPatternRound {
  const index = (roundNumber - 1) % SIGNAL_PATTERN_ROUNDS.length;
  return SIGNAL_PATTERN_ROUNDS[index];
}
