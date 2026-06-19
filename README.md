# AlgoThink: The Literal Lab 🧪🤖

Welcome to **AlgoThink**, an interactive educational web application designed to teach the core concepts of Algorithmic Thinking without writing a single line of code. 

Instead of dealing with syntax errors, students take on the ultimate logic challenge: writing step-by-step, plain-English instructions for **B.O.B.** (Basic Operational Bot), an AI robot who takes everything *completely literally*.

## ✨ Features
* **Hilarious Literal Execution:** Powered by Google's Gemini API, B.O.B. interprets your instructions exactly as written. Forget to tell him to open the jar? He'll smash the knife right into the glass.
* **Smart AI Tutor:** After B.O.B. executes the instructions, an AI Tutor steps in to provide educational feedback. It analyzes your logic and tells you what went wrong and how to fix it.
* **Core Concept Recognition:** The system actively looks for and celebrates proper algorithmic thinking concepts like **Decomposition**, **Sequencing**, **Precision**, and **Assumption Checking**.
* **Beautiful UI:** A sleek, dark-mode, responsive web interface built with vanilla HTML/CSS/JS and smooth micro-animations.

## 🛠️ Tech Stack
* **Frontend:** Vanilla HTML5, CSS3, JavaScript
* **Backend:** Python, FastAPI (to serve static files and provide the secure API endpoint)
* **AI Engine:** Google Gemini `gemini-2.5-flash` model (`google-genai` SDK)

## 🚀 Local Setup & Installation

To run this application locally, you will need Python installed on your machine and a valid Gemini API key.

### 1. Install Dependencies
Open your terminal in the project directory and install the required Python packages:
```bash
pip install -r requirements.txt
```

### 2. Set Up Your API Key
Create a file named `.env` in the root of the project directory and add your Google Gemini API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Run the Server
Start the local FastAPI server using `uvicorn`:
```bash
python -m uvicorn main:app --reload
```
*(If the command above is not recognized, try `py -m uvicorn main:app --reload`)*

### 4. Open the App
Open your web browser and navigate to:
```
http://localhost:8000
```

## 🌍 Deployment
AlgoThink is pre-configured with a `vercel.json` file for seamless deployment to **Vercel** (which natively supports FastAPI serverless functions).

1. Push this repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **Add New > Project**.
3. Import your AlgoThink GitHub repository.
4. Open the **Environment Variables** section before deploying.
5. Add `GEMINI_API_KEY` as the Name, and your actual API key as the Value.
6. Click **Deploy**. Vercel will automatically host the frontend globally and spin up the Python backend serverlessly!
