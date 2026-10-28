import { DilemmaScenario } from '../types/chemistry';

export const CURATED_DILEMMAS: DilemmaScenario[] = [
  {
    id: 'dilemma-preferences',
    prompt: 'You have one free unexpected evening in a new city. What is your choice?',
    context: 'Dilemma 01 / 03 · Preferences & Instinct',
    options: [
      {
        id: 'opt-spontaneous',
        label: 'Spontaneous Exploration',
        subtext: 'Follow live music and lights down unfamiliar streets without an agenda.',
        archetype: 'spontaneous',
      },
      {
        id: 'opt-calculated',
        label: 'Curated Observation',
        subtext: 'Visit a world-class quiet observatory, library, or design gallery.',
        archetype: 'calculated',
      },
      {
        id: 'opt-adventurous',
        label: 'Night Altitude',
        subtext: 'High-speed e-bike ascent to the highest mountain overlook.',
        archetype: 'adventurous',
      },
      {
        id: 'opt-intimate',
        label: 'Hidden Kitchen',
        subtext: 'Seek out an intimate, covert local chef’s table for two.',
        archetype: 'intimate',
      },
    ],
  },
  {
    id: 'dilemma-communication',
    prompt: 'Under high project pressure, a critical error occurs. How do you respond?',
    context: 'Dilemma 02 / 03 · Communication & Composure',
    options: [
      {
        id: 'opt-humor',
        label: 'De-escalate & Pivot',
        subtext: 'Acknowledge the moment with humor and immediately steer to the next step.',
        archetype: 'spontaneous',
      },
      {
        id: 'opt-debug',
        label: 'Methodical Isolation',
        subtext: 'Pause inputs for 30 seconds to trace the exact root cause systematically.',
        archetype: 'calculated',
      },
      {
        id: 'opt-story',
        label: 'Audacious Workaround',
        subtext: 'Bypass the failing component entirely and ship an experimental alternative.',
        archetype: 'adventurous',
      },
      {
        id: 'opt-checkin',
        label: 'Mutual Check-in',
        subtext: 'Align with your partner first, verify morale, then divide and conquer.',
        archetype: 'intimate',
      },
    ],
  },
  {
    id: 'dilemma-trust',
    prompt: 'You receive 100 surplus catalyst energy units. How do you allocate them?',
    context: 'Dilemma 03 / 03 · Trust & Collaboration',
    options: [
      {
        id: 'opt-pool',
        label: 'Pooled Multiplier',
        subtext: 'Combine 100% into a joint fund to double mutual reaction yield.',
        archetype: 'adventurous',
      },
      {
        id: 'opt-even',
        label: 'Equal 50 / 50 Split',
        subtext: 'Divide evenly so both partners retain independent control.',
        archetype: 'calculated',
      },
      {
        id: 'opt-gift',
        label: 'Empower Partner',
        subtext: 'Transfer 80 units directly to your partner’s control subsystem.',
        archetype: 'intimate',
      },
      {
        id: 'opt-surge',
        label: 'Spontaneous Surge',
        subtext: 'Trigger an immediate flash burst to see how the system reacts.',
        archetype: 'spontaneous',
      },
    ],
  },
];
