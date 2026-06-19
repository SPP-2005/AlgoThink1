from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
import json
from google import genai
from google.genai import types

_env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
if os.path.exists(_env_path):
    with open(_env_path) as _f:
        for _line in _f:
            _line = _line.strip()
            if _line and not _line.startswith("#") and "=" in _line:
                _key, _val = _line.split("=", 1)
                os.environ.setdefault(_key.strip(), _val.strip())

app = FastAPI()

class EvalRequest(BaseModel):
    text: str
    currentChallenge: str

CHALLENGES = {
    'everyday': 'Make a PB&J Sandwich',
    'planning': 'Pack a School Bag',
    'organization': 'Sort the Bookshelf',
    'directions': 'Navigate the Maze',
    'problemsolving': 'Fix the Leaky Pipe'
}

SYSTEM_PROMPT = """You are B.O.B. (Basic Operational Bot), a COMPLETELY LITERAL instruction executor with ZERO common sense.

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
}
"""

@app.post("/api/evaluate")
def evaluate_instructions(req: EvalRequest):
    api_key = os.environ.get("GEMINI_API_KEY", "")
    if not api_key:
        return {
            "status": "major_error",
            "outcome_narrative": "API Key missing!",
            "conceptTitle": "System Error",
            "conceptMsg": "GEMINI_API_KEY environment variable is not set.",
            "approachMsg": "Set your API key before deploying.",
            "exampleMsg": "export GEMINI_API_KEY='your-key'"
        }
        
    client = genai.Client(api_key=api_key)
    goal = CHALLENGES.get(req.currentChallenge, "Unknown Task")
    user_prompt = f"GOAL: {goal}\nUSER INSTRUCTIONS:\n{req.text}"

    try:
        response = client.models.generate_content(
            model='gemini-3.1-flash-lite',
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json"
            )
        )
        
        result = json.loads(response.text)
        return result
    except Exception as e:
        return {
            "status": "major_error",
            "outcome_narrative": f"API Error: {str(e)}",
            "conceptTitle": "Error",
            "conceptMsg": "Something went wrong calling the AI.",
            "approachMsg": "Check the backend logs.",
            "exampleMsg": ""
        }

app.mount("/", StaticFiles(directory=".", html=True), name="static")
