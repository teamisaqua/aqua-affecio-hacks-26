import { ChemistryScore, FictionalCompound } from '../types/chemistry';

interface CompoundInput {
  score: ChemistryScore;
  reactorTimeSeconds: number;
  overshoots: number;
}

export function generateFictionalCompound(input: CompoundInput): FictionalCompound {
  const { score, reactorTimeSeconds, overshoots } = input;

  // Determine prefix based on Teamwork & Adaptability
  let prefix = "LUMINA";
  let suffix = "KINETICS";
  let classification = "Exothermic Resonance Polymer";
  let formula = "Lk₇-Ψ₄";
  let colorGradient: [string, string] = ["#00f0ff", "#ff2a85"]; // Cyan to Pink

  if (score.synchronization >= 88 && score.teamwork >= 88) {
    prefix = "AETHERO";
    suffix = "SYNERGIA";
    classification = "Harmonic Super-Conductor Molecule";
    formula = "As₁₂-Ω₃";
    colorGradient = ["#00f0ff", "#9d4edd"]; // Cyan to Purple
  } else if (overshoots > 1 || reactorTimeSeconds > 28) {
    prefix = "PYRO";
    suffix = "VALENCE";
    classification = "High-Energy Thermal Stabilizer";
    formula = "Pv₉-Δ₆";
    colorGradient = ["#ff2a85", "#f59e0b"]; // Pink to Amber
  } else if (score.adaptability >= 85) {
    prefix = "SYNAPTO";
    suffix = "FLUX";
    classification = "Adaptive Liquid Crystal Catalyst";
    formula = "Sf₈-Θ₂";
    colorGradient = ["#10b981", "#00f0ff"]; // Emerald to Cyan
  } else {
    prefix = "CHRONO";
    suffix = "CATALYST";
    classification = "Equilibrium Crystallite";
    formula = "Cc₁₀-Σ₁";
    colorGradient = ["#9d4edd", "#ff2a85"]; // Purple to Pink
  }

  const name = `${prefix}-${suffix}`;
  const tagline = score.synchronization >= 85
    ? "High Resonance · Intuitive Coherence"
    : "Dynamic Polarity · Balanced Counter-Weights";

  const loreDescription =
    `Synthesized under a controlled ${reactorTimeSeconds.toFixed(1)}s chamber reaction. ` +
    `Displays an extraordinary ${score.overall}% chemical affinity matrix, ` +
    `releasing continuous luminescence when both polarities act in concert.`;

  // Deterministic orbital node positions for SVG molecular visualizer
  const nodeCount = 5 + (score.overall % 4);
  const nodes = [];
  const radius = 64;
  for (let i = 0; i < nodeCount; i++) {
    const angle = (i * 2 * Math.PI) / nodeCount;
    nodes.push({
      x: Math.round(100 + radius * Math.cos(angle)),
      y: Math.round(100 + radius * Math.sin(angle)),
      size: 8 + (i % 3) * 3,
      pulseDelay: i * 0.4,
    });
  }

  return {
    name,
    formula,
    classification,
    tagline,
    loreDescription,
    colorGradient,
    nodes,
  };
}
