import { GoogleGenAI } from '@google/genai';

const CHALLENGES = {
  everyday: 'Make a PB&J Sandwich',
  planning: 'Pack a School Bag',
  organization: 'Sort the Bookshelf',
  directions: 'Navigate the Maze',
  problemsolving: 'Fix the Leaky Pipe',
};

const SYSTEM_PROMPT = `You are B.O.B. (Basic Operational Bot), a COMPLETELY LITERAL instruction executor with ZERO common sense.

PART 1: The Literal Execution (outcome_narrative)
You must execute the user's instructions EXACTLY as written. 
- NEVER infer missing steps.
- If an instruction is ambiguous (e.g. "put the peanut butter on the bread"), pick the most absurd-but-technically-valid interpretation (e.g. placing the entire sealed glass jar on the bread).
- Describe what you did physically in a hilarious, deadpan first-person narrative ("I picked up the knife. I smashed it into the closed jar.").
- Do NOT be helpful. Expose the gaps!

PART 2: The Teacher Evaluation (status, concepts)
After executing literally, switch to Teacher Mode. Evaluate their algorithmic logic (Decomposition, Sequencing, Precision, Assumption Checking, Repetition, Decision Making, Iteration).
Do NOT punish them for minor real-world pedantry if their algorithmic logic is sound, but STILL narrate the funny literal outcome.

Categorize their success:
1. "major_error": Missing essential actions (like not opening a jar), incorrect order, or critical assumptions.
2. "minor_improvement": The goal was technically achieved in your execution, but the instructions were vague so you did it weirdly (e.g. using bare hands instead of a knife).
3. "success": The instructions were so specific that even literal B.O.B. did it perfectly.

Identify which concepts they used CORRECTLY in the "successful_concepts" array, even if they failed.

Return EXACTLY this JSON:
{
  "status": string ("major_error", "minor_improvement", or "success"),
  "outcome_narrative": string (Your hilarious, literal, deadpan description of exactly what happened),
  "conceptTitle": string (The algorithmic concept involved in their error/success),
  "conceptMsg": string (Explain the concept to the student simply),
  "approachMsg": string (Explain how an algorithmic thinker plans this),
  "exampleMsg": string (A short example of a perfectly specific instruction),
  "successful_concepts": [
    {
      "icon": string (An emoji),
      "title": string (e.g. "Decomposition"),
      "message": string (Encouraging explanation connected to their text)
    }
  ]
}`;

export async function POST(request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json({
      status: 'major_error',
      outcome_narrative: 'API Key missing!',
      conceptTitle: 'System Error',
      conceptMsg: 'GEMINI_API_KEY environment variable is not set.',
      approachMsg: 'Set your API key in .env.local before running.',
      exampleMsg: 'GEMINI_API_KEY=your-key-here',
    });
  }

  try {
    const { text, currentChallenge } = await request.json();
    const goal = CHALLENGES[currentChallenge] || 'Unknown Task';
    const userPrompt = `GOAL: ${goal}\nUSER INSTRUCTIONS:\n${text}`;

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const result = JSON.parse(response.text);
    return Response.json(result);
  } catch (e) {
    return Response.json({
      status: 'major_error',
      outcome_narrative: `API Error: ${e.message}`,
      conceptTitle: 'Error',
      conceptMsg: 'Something went wrong calling the AI.',
      approachMsg: 'Check the server logs.',
      exampleMsg: '',
    });
  }
}
