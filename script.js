const inputArea = document.getElementById('instruction-input');
const runBtn = document.getElementById('run-btn');
const bobDisplay = document.getElementById('bob-display');
const bobCharacter = document.getElementById('bob-character');
const bobDialogue = document.getElementById('bob-dialogue');

const tutorReport = document.getElementById('tutor-report');
const reportOutcomeHeader = document.getElementById('report-outcome-header');
const reportOutcome = document.getElementById('report-outcome');
const reportConceptTitle = document.getElementById('report-concept-title');
const reportConcept = document.getElementById('report-concept');
const reportApproach = document.getElementById('report-approach');
const reportExample = document.getElementById('report-example');
const retryBtn = document.getElementById('retry-btn');
const outcomeSection = document.getElementById('outcome-section');
const successConceptsSection = document.getElementById('success-concepts-section');
const successConceptsList = document.getElementById('success-concepts-list');

const onboardingScreen = document.getElementById('onboarding-screen');
const startBtn = document.getElementById('start-btn');
const infoBtn = document.getElementById('info-btn');
const categorySelect = document.getElementById('category-select');
const challengeTitle = document.getElementById('challenge-title');
const challengeDesc = document.getElementById('challenge-desc');

const challenges = {
    'everyday': {
        title: 'Make a PB&J Sandwich',
        desc: 'B.O.B. has a jar of peanut butter, a jar of jelly, a loaf of bread, and a butter knife on the table. Tell him exactly how to make a sandwich.'
    },
    'planning': {
        title: 'Pack a School Bag',
        desc: 'B.O.B. needs to pack his math book, pencil case, and lunchbox into his backpack before school.'
    },
    'organization': {
        title: 'Sort the Bookshelf',
        desc: 'B.O.B. has 5 books scattered on the floor. Tell him how to organize them on the shelf from shortest to tallest.'
    },
    'directions': {
        title: 'Navigate the Maze',
        desc: 'B.O.B. is facing North. Tell him how to reach the glowing green exit without walking into the walls.'
    },
    'problemsolving': {
        title: 'Fix the Leaky Pipe',
        desc: 'Water is spraying everywhere! B.O.B. has a wrench and some tape. Tell him how to stop the leak.'
    }
};

startBtn.addEventListener('click', () => {
    onboardingScreen.classList.add('hidden');
    startBtn.innerText = 'Return to Lab';
});

infoBtn.addEventListener('click', () => {
    onboardingScreen.classList.remove('hidden');
});

categorySelect.addEventListener('change', (e) => {
    const selected = challenges[e.target.value];
    challengeTitle.innerText = `Challenge: ${selected.title}`;
    challengeDesc.innerText = selected.desc;
    inputArea.value = '';
    resetBob();
});

function resetBob() {
    bobCharacter.className = 'bob-character';
    bobDialogue.innerText = '"Greetings! I am ready to follow your exact commands."';
    tutorReport.classList.add('hidden');
    bobDisplay.style.display = 'flex';
}

function setBobState(stateName, dialogue) {
    bobCharacter.className = `bob-character ${stateName}`;
    if (dialogue) {
        bobDialogue.innerText = `"${dialogue}"`;
    }
}

function showTutorReport(status, outcomeMsg, conceptTitle, conceptMsg, approachMsg, exampleMsg, successfulConcepts) {
    reportOutcome.innerText = outcomeMsg;
    reportConceptTitle.innerText = conceptTitle;
    reportConcept.innerText = conceptMsg;
    reportApproach.innerText = approachMsg;
    reportExample.innerText = exampleMsg;
    
    outcomeSection.className = 'report-section';
    if (status === 'major_error') {
        outcomeSection.classList.add('error');
        reportOutcomeHeader.innerText = "❌ What Went Wrong?";
        retryBtn.innerText = "🔄 Try Again";
    } else if (status === 'minor_improvement') {
        outcomeSection.classList.add('warning');
        reportOutcomeHeader.innerText = "🟡 Almost Perfect!";
        retryBtn.innerText = "🔄 Refine & Try Again";
    } else {
        outcomeSection.classList.add('success-sec');
        reportOutcomeHeader.innerText = "✅ Success!";
        retryBtn.innerText = "⭐ Next Challenge";
    }

    successConceptsList.innerHTML = '';
    if (successfulConcepts && successfulConcepts.length > 0) {
        successfulConcepts.forEach(concept => {
            const div = document.createElement('div');
            div.className = 'concept-item';
            div.innerHTML = `
                <div class="concept-item-title">${concept.icon} ${concept.title}</div>
                <div class="concept-item-msg">${concept.message}</div>
            `;
            successConceptsList.appendChild(div);
        });
        successConceptsSection.classList.remove('hidden');
    } else {
        successConceptsSection.classList.add('hidden');
    }

    setTimeout(() => {
        tutorReport.classList.remove('hidden');
    }, 1000);
}

async function callGeminiAPI(text, currentChallenge) {
    try {
        const response = await fetch('/api/evaluate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                currentChallenge: currentChallenge
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        return {
            status: "major_error",
            outcome_narrative: "Network error calling the backend.",
            conceptTitle: "Server Error",
            conceptMsg: "Could not reach the FastAPI backend.",
            approachMsg: "Ensure the backend server is running.",
            exampleMsg: error.message
        };
    }
}

async function analyzeInstructions(text) {
    const currentChallenge = categorySelect.value;
    
    if (text.trim().length === 0) {
        setBobState('error', 'I stood perfectly still because you gave me zero instructions.');
        showTutorReport(
            "major_error",
            "B.O.B. didn't do anything.",
            "Completeness",
            "A computer needs at least one command to execute a program. Without instructions, nothing happens.",
            "Algorithmic thinkers don't assume the computer will 'just figure it out'. They provide explicit starting steps.",
            "1. Pick up the bread..."
        );
        return;
    }

    setBobState('thinking', 'Processing instructions literally with Gemini AI...');
    runBtn.disabled = true;
    inputArea.disabled = true;
    tutorReport.classList.add('hidden');
    
    const apiResult = await callGeminiAPI(text, currentChallenge);
    
    if (apiResult.status === 'success') {
        setBobState('success', 'Task Completed perfectly! I am a flawless machine.');
    } else if (apiResult.status === 'minor_improvement') {
        setBobState('success', 'Task Completed! But I made a bit of a mess...');
    } else {
        setBobState('error', 'ERROR! Instructions unclear. I have made a terrible mistake.');
    }

    showTutorReport(
        apiResult.status,
        apiResult.outcome_narrative,
        apiResult.conceptTitle,
        apiResult.conceptMsg,
        apiResult.approachMsg,
        apiResult.exampleMsg,
        apiResult.successful_concepts || []
    );
}

runBtn.addEventListener('click', () => {
    analyzeInstructions(inputArea.value);
});

retryBtn.addEventListener('click', () => {
    runBtn.disabled = false;
    inputArea.disabled = false;
    resetBob();
});

resetBob();
