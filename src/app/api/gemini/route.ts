import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, compoundName, score, reactorStats, dilemmaMatch, userAName, userBName } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // Graceful offline fallback if GEMINI_API_KEY is not configured
    if (!apiKey) {
      if (action === 'lore') {
        return NextResponse.json({
          description: `Synthesized under a controlled ${reactorStats?.timeTaken?.toFixed(1) || 28}s chamber reaction. Displays an extraordinary ${score?.overall || 87}% chemical affinity matrix, releasing continuous bioluminescence when both polarities act in harmonious concert.`,
        });
      }

      return NextResponse.json({
        sparks: [
          {
            badge: 'Reactor Crisis',
            icebreaker: `${userBName || 'User B'} navigated the pressure gauges like a pro!`,
            followUp: `Were you actually confident under that 45-second timer, or pure adrenaline?`,
          },
          {
            badge: 'Cognitive Mirror',
            icebreaker: dilemmaMatch
              ? `You both picked the exact same scenario without saying a single word.`
              : `Different impulses on the ₹5,000 day scenario create high dynamic depth.`,
            followUp: `If you two took that trip together this weekend, who plans the itinerary?`,
          },
        ],
      });
    }

    // Call Gemini API
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    let prompt = '';
    if (action === 'lore') {
      prompt = `You are the lead futuristic laboratory AI for "AFFECIO — CHEMISTRY LAB", an interactive dating experience.
Two users, ${userAName} and ${userBName}, just completed a collaborative reactor experiment.
Compound Name: "${compoundName}"
Overall Chemistry Score: ${score?.overall}% (Teamwork: ${score?.teamwork}, Sync: ${score?.synchronization}, Adaptability: ${score?.adaptability}, Balance: ${score?.balance}).
Reactor Time: ${reactorStats?.timeTaken} seconds, with ${reactorStats?.overshoots} overshoots.
Generate a 2-sentence poetic, cinematic, sci-fi laboratory synthesis description for their chemistry card. Keep it romantic yet scientific and evocative. Avoid cheesy clichés. Return ONLY the 2 sentences of description.`;
    } else {
      prompt = `You are the AI catalyst for "AFFECIO — CHEMISTRY LAB".
Two users, ${userAName} (Observer) and ${userBName} (Operator), just finished a high-stakes collaborative reactor test.
Telemetry:
- Reactor Time: ${reactorStats?.timeTaken}s
- Reactor Overshoots: ${reactorStats?.overshoots}
- Dilemma Decision Match: ${dilemmaMatch ? 'Identical choice' : 'Opposite choices'}
- Chemistry Score: ${score?.overall}%
Generate 2 playful, witty conversation starter pairs based ON THEIR ACTUAL ACTIONS above.
Format strictly as JSON:
[
  {
    "badge": "Short 2-3 word badge",
    "icebreaker": "Playful observation about what happened in the lab",
    "followUp": "A genuine, flirty or curious question to start real dialogue"
  }
]`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    if (action === 'lore') {
      return NextResponse.json({ description: candidateText });
    }

    // Parse JSON for sparks
    try {
      const cleaned = candidateText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json({ sparks: parsed });
    } catch {
      return NextResponse.json({
        sparks: [
          {
            badge: 'Reactor Pulse',
            icebreaker: `You two calibrated the core in ${reactorStats?.timeTaken?.toFixed(1) || 28} seconds!`,
            followUp: `Are you normally this calm under pressure, or did you just click?`,
          },
        ],
      });
    }
  } catch (err) {
    console.warn('Gemini route error, returning fallback:', err);
    return NextResponse.json({
      description: 'Synthesized under rapid thermal equilibrium. Displays exceptional harmonic resonance.',
      sparks: [
        {
          badge: 'Reaction Success',
          icebreaker: 'You stabilized the chamber with zero containment breaches!',
          followUp: 'Did you think we were going to make that 45-second clock?',
        },
      ],
    });
  }
}
