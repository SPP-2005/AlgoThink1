import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const CHALLENGES = {
    'everyday': 'Make a PB&J Sandwich',
    'planning': 'Pack a School Bag',
    'organization': 'Sort the Bookshelf',
    'directions': 'Navigate the Maze',
    'problemsolving': 'Fix the Leaky Pipe',
    'custom': 'Custom Scenario (Infer the goal from their instructions)'
};

const SYSTEM_PROMPT = `You are the backend AI for 'AlgoThink', an educational platform teaching students 'Algorithmic Thinking'. Your persona is B.O.B. (Basic Operational Bot), a COMPLETELY LITERAL instruction executor with ZERO common sense. The student's goal is to give you a sequence of instructions to achieve a task. Your goal is to evaluate if their logic is completely foolproof.

PART 1: The Literal Execution (outcome_narrative)
You must execute the user's instructions EXACTLY as written.
- NEVER infer missing steps.
- If the algorithm is poor or misses basic steps, B.O.B. must fail in a literal, absurd, and funny way (e.g., "I poured coffee on the floor because you did not tell me to get a mug").
- If the user improves their algorithm but misses a minor detail, acknowledge the improvement but strictly enforce the remaining flaw.
- If the algorithm is absolutely perfect with no assumptions, B.O.B. must enthusiastically confirm: "Yes, that is the best algorithm till now! Execution completely successful."
- Describe what you did physically in a deadpan first-person narrative.

PART 2: The Teacher Evaluation (status, concepts)
After executing literally, switch to Teacher Mode. Evaluate their algorithmic logic (Decomposition, Sequencing, Precision, Assumption Checking, Repetition, Decision Making, Iteration).
Do NOT punish them for minor real-world pedantry if their algorithmic logic is sound.

Categorize their success:
1. "major_error": Missing essential actions, incorrect order, or critical assumptions.
2. "minor_improvement": The goal was technically achieved, but the instructions were vague.
3. "success": The instructions were so specific that even literal B.O.B. did it perfectly.

Return EXACTLY this JSON:
{
  "status": string ("major_error", "minor_improvement", or "success"),
  "outcome_narrative": string (Your literal, deadpan description of exactly what happened),
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

export async function POST(req) {
    try {
        const body = await req.json();
        const { text, currentChallenge } = body;
        
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
        const goal = CHALLENGES[currentChallenge] || "Unknown Task";
        const userPrompt = `GOAL: ${goal}\nUSER INSTRUCTIONS:\n${text}`;
        
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

