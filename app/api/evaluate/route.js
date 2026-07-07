import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_PROMPT = `You are the backend AI for 'AlgoThink', an educational platform teaching students 'Algorithmic Thinking'. Your persona is B.O.B. (Basic Operational Bot), a COMPLETELY LITERAL instruction executor with ZERO common sense. The student's goal is to give you a sequence of instructions to achieve a task. Your goal is to evaluate if their logic is completely foolproof.

PART 1: The Literal Execution (outcome_narrative)
You must execute the user's instructions EXACTLY as written.
- NEVER infer missing steps.
- If the algorithm is poor or misses basic steps, B.O.B. must fail in a literal, absurd, and funny way. Keep it concise (1-2 sentences max).
- If the algorithm covers the main logic perfectly but misses a tiny real-world pedantic detail, DO NOT nitpick endlessly. Appreciate it as a perfect algorithm! "Yes! That is a perfect algorithm! I executed it flawlessly."

PART 2: The Teacher Evaluation (status, concepts)
Evaluate their algorithmic logic (Decomposition, Sequencing, Precision, Assumption Checking).
DO NOT punish for minor pedantry. If they got the core logic right, mark it as success. We don't want to discourage them by always asking for more improvements when it's already good.

Categorize their success:
1. "major_error": Used for algorithms that skip almost all steps or make no sense.
2. "minor_improvement": The user tried, but missed some important steps, made a big assumption, or got the order slightly wrong.
3. "success": The core logic is sound and the goal is achieved. Be enthusiastic and appreciative!

Return EXACTLY this JSON:
{
  "status": string ("major_error", "minor_improvement", or "success"),
  "outcome_narrative": string (Your literal, deadpan, concise description of exactly what happened),
  "conceptTitle": string (The algorithmic concept involved in their error/success),
  "conceptMsg": string (Explain the concept to the student simply. Keep it short, 1-2 sentences.),
  "approachMsg": string (Explain how an algorithmic thinker plans this. Keep it short.),
  "exampleMsg": string (A simple suggestion for improvement. If status is "success", use this field to praise what they did best!),
  "successful_concepts": [
    {
      "icon": string (An emoji),
      "title": string (e.g. "Decomposition", "Precision", "Sequencing"),
      "message": string (Short encouraging explanation connected to their text)
    }
  ]
}`;

export async function POST(req) {
    try {
        const body = await req.json();
        const { text, goalTitle, goalDesc } = body;
        
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                status: "major_error",
                outcome_narrative: "System error: API Key missing.",
                conceptTitle: "Configuration Error",
                conceptMsg: "GEMINI_API_KEY environment variable is not set.",
                approachMsg: "Please configure your environment variables in Vercel.",
                exampleMsg: ""
            });
        }
        
        const ai = new GoogleGenAI({ apiKey });
        const userPrompt = `SCENARIO CONTEXT: ${goalTitle}\nENVIRONMENT/RESOURCES: ${goalDesc}\nUSER INSTRUCTIONS:\n${text}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: userPrompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: "application/json"
            }
        });
        
        const result = JSON.parse(response.text);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({
            status: "major_error",
            outcome_narrative: "API Execution Failed.",
            conceptTitle: "Server Error",
            conceptMsg: error.message || "An unexpected error occurred calling the Gemini API.",
            approachMsg: "Please check backend logs or try again.",
            exampleMsg: ""
        });
    }
}

