export * from './equilibriumScenarios';
export * from './elementBondMatrix';
export * from './dilemmas40';
export * from './predictionChallenges';
export * from './collaborativeChallenges';
export * from './signalPatterns';
export * from './chemistryQuiz50';
export * from './sharedDiscoveryScenarios';

// Deterministic seed generator for synchronized multiplayer experiment ordering
export function createSeededRandom(seedStr: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return function () {
    h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
