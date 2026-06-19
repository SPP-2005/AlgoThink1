'use client';

import { useState } from 'react';

const challenges = {
  everyday: {
    title: 'Make a PB&J Sandwich',
    desc: 'B.O.B. has a jar of peanut butter, a jar of jelly, a loaf of bread, and a butter knife on the table. Tell him exactly how to make a sandwich.',
  },
  planning: {
    title: 'Pack a School Bag',
    desc: 'B.O.B. needs to pack his math book, pencil case, and lunchbox into his backpack before school.',
  },
  organization: {
    title: 'Sort the Bookshelf',
    desc: 'B.O.B. has 5 books scattered on the floor. Tell him how to organize them on the shelf from shortest to tallest.',
  },
  directions: {
    title: 'Navigate the Maze',
    desc: 'B.O.B. is facing North. Tell him how to reach the glowing green exit without walking into the walls.',
  },
  problemsolving: {
    title: 'Fix the Leaky Pipe',
    desc: 'Water is spraying everywhere! B.O.B. has a wrench and some tape. Tell him how to stop the leak.',
  },
};

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [startBtnText, setStartBtnText] = useState('Start Training B.O.B.');
  const [category, setCategory] = useState('everyday');
  const [bobStateClass, setBobStateClass] = useState('');
  const [bobDialogue, setBobDialogue] = useState('Greetings! I am ready to follow your exact commands.');
  const [showReport, setShowReport] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [reportStatus, setReportStatus] = useState('major_error');
  const [reportOutcome, setReportOutcome] = useState('');
  const [reportConceptTitle, setReportConceptTitle] = useState('');
  const [reportConcept, setReportConcept] = useState('');
  const [reportApproach, setReportApproach] = useState('');
  const [reportExample, setReportExample] = useState('');
  const [successConcepts, setSuccessConcepts] = useState([]);

  const challenge = challenges[category];

  function resetBob() {
    setBobStateClass('');
    setBobDialogue('Greetings! I am ready to follow your exact commands.');
    setShowReport(false);
  }

  function handleCategoryChange(e) {
    setCategory(e.target.value);
    setInputText('');
    resetBob();
  }

  function handleStartClick() {
    setShowOnboarding(false);
    setStartBtnText('Return to Lab');
  }

  async function handleSubmit() {
    if (inputText.trim().length === 0) {
      setBobStateClass('error');
      setBobDialogue('I stood perfectly still because you gave me zero instructions.');
      setReportStatus('major_error');
      setReportOutcome("B.O.B. didn't do anything.");
      setReportConceptTitle('Completeness');
      setReportConcept("A computer needs at least one command to execute a program. Without instructions, nothing happens.");
      setReportApproach("Algorithmic thinkers don't assume the computer will 'just figure it out'. They provide explicit starting steps.");
      setReportExample('1. Pick up the bread...');
      setSuccessConcepts([]);
      setTimeout(() => setShowReport(true), 1000);
      return;
    }

    setBobStateClass('thinking');
    setBobDialogue('Processing instructions literally with Gemini AI...');
    setIsProcessing(true);
    setShowReport(false);

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, currentChallenge: category }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const apiResult = await response.json();

      if (apiResult.status === 'success') {
        setBobStateClass('success');
        setBobDialogue('Task Completed perfectly! I am a flawless machine.');
      } else if (apiResult.status === 'minor_improvement') {
        setBobStateClass('success');
        setBobDialogue('Task Completed! But I made a bit of a mess...');
      } else {
        setBobStateClass('error');
        setBobDialogue('ERROR! Instructions unclear. I have made a terrible mistake.');
      }

      setReportStatus(apiResult.status);
      setReportOutcome(apiResult.outcome_narrative);
      setReportConceptTitle(apiResult.conceptTitle);
      setReportConcept(apiResult.conceptMsg);
      setReportApproach(apiResult.approachMsg);
      setReportExample(apiResult.exampleMsg);
      setSuccessConcepts(apiResult.successful_concepts || []);
      setTimeout(() => setShowReport(true), 1000);
    } catch (error) {
      setBobStateClass('error');
      setBobDialogue('ERROR! Something went wrong.');
      setReportStatus('major_error');
      setReportOutcome('Network error calling the backend.');
      setReportConceptTitle('Server Error');
      setReportConcept('Could not reach the backend.');
      setReportApproach('Ensure the server is running.');
      setReportExample(error.message);
      setSuccessConcepts([]);
      setTimeout(() => setShowReport(true), 1000);
    }

    setIsProcessing(false);
  }

  function handleRetry() {
    setIsProcessing(false);
    resetBob();
  }

  let outcomeClass = 'report-section';
  let outcomeHeader = '❌ What Went Wrong?';
  let retryText = '🔄 Try Again';
  if (reportStatus === 'minor_improvement') {
    outcomeClass += ' warning';
    outcomeHeader = '🟡 Almost Perfect!';
    retryText = '🔄 Refine & Try Again';
  } else if (reportStatus === 'success') {
    outcomeClass += ' success-sec';
    outcomeHeader = '✅ Success!';
    retryText = '⭐ Next Challenge';
  } else {
    outcomeClass += ' error';
  }

  return (
    <>
      <div className={`onboarding-overlay${showOnboarding ? '' : ' hidden'}`}>
        <div className="onboarding-content">
          <div className="onboarding-header">
            <h1>Welcome to The Literal Lab! 🧪</h1>
            <p>Your mission: Teach B.O.B. how to survive the human world.</p>
          </div>

          <div className="onboarding-grid">
            <div className="onboarding-card" style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '22px' }}>🤖 Meet B.O.B.</h3>
              <p style={{ marginBottom: '30px' }}>
                B.O.B. is a Basic Operational Bot. He is eager to please but takes everything{' '}
                <strong>completely literally</strong>. If you say &quot;make a sandwich,&quot; he might put two slices of bread on his own head.
              </p>
              <div className="bob-character" style={{ position: 'relative', marginTop: '10px', animation: 'bounce 2s infinite' }}>
                <div className="bob-face">
                  <div className="eye left-eye"></div>
                  <div className="eye right-eye"></div>
                  <div className="mouth" style={{ opacity: 1, height: '8px', borderRadius: '0 0 10px 10px', background: 'var(--bob-eye-success)' }}></div>
                </div>
              </div>
            </div>

            <div className="onboarding-card" style={{ overflowY: 'auto', maxHeight: '460px', paddingRight: '15px' }}>
              <h3>🤔 What is Algorithmic Thinking?</h3>
              <p style={{ marginBottom: '10px' }}>
                It isn&apos;t just for coding—it&apos;s the superpower of solving problems logically. It means defining steps so clearly that there is absolutely zero room for confusion or errors.
              </p>
              
              <h4 style={{ margin: '15px 0 5px 0', color: 'var(--primary)', fontSize: '15px' }}>Why It Matters</h4>
              <p style={{ marginBottom: '15px' }}>
                Computers (like B.O.B.) have <strong>no common sense</strong>. If you skip a step, they crash. Learning to think algorithmically helps you communicate with total clarity, break down overwhelming tasks, and spot missing logic in everyday life.
              </p>

              <h4 style={{ margin: '15px 0 10px 0', color: 'var(--primary)', fontSize: '15px' }}>Good vs. Bad Instructions</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                  <strong>🥪 Making a Sandwich</strong>
                  <div style={{ fontSize: '13px', marginTop: '6px' }}>
                    <span style={{color: 'var(--error)'}}>❌ Bad:</span> &quot;Put peanut butter on the bread.&quot; <br/>
                    <em style={{color: 'var(--text-muted)'}}>(B.O.B. places the entire sealed glass jar on the loaf)</em>
                  </div>
                  <div style={{ fontSize: '13px', marginTop: '6px' }}>
                    <span style={{color: 'var(--success)'}}>✅ Good:</span> &quot;Open the jar, dip the knife in, extract peanut butter, and spread it on one face of the slice.&quot;
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                  <strong>🎒 Packing a School Bag</strong>
                  <div style={{ fontSize: '13px', marginTop: '6px' }}>
                    <span style={{color: 'var(--error)'}}>❌ Bad:</span> &quot;Pack your books.&quot; <br/>
                    <em style={{color: 'var(--text-muted)'}}>(B.O.B. forcefully shoves them into the closed backpack)</em>
                  </div>
                  <div style={{ fontSize: '13px', marginTop: '6px' }}>
                    <span style={{color: 'var(--success)'}}>✅ Good:</span> &quot;Unzip the main compartment, slide the math book in vertically, and zip it closed.&quot;
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                  <strong>🗺️ Giving Directions</strong>
                  <div style={{ fontSize: '13px', marginTop: '6px' }}>
                    <span style={{color: 'var(--error)'}}>❌ Bad:</span> &quot;Go to the kitchen.&quot; <br/>
                    <em style={{color: 'var(--text-muted)'}}>(B.O.B. walks in a straight line and crashes into a wall)</em>
                  </div>
                  <div style={{ fontSize: '13px', marginTop: '6px' }}>
                    <span style={{color: 'var(--success)'}}>✅ Good:</span> &quot;Turn 90 degrees right, walk 5 steps forward, grab the handle, and pull the door open.&quot;
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px' }}>
                  <strong>📅 Planning a Day</strong>
                  <div style={{ fontSize: '13px', marginTop: '6px' }}>
                    <span style={{color: 'var(--error)'}}>❌ Bad:</span> &quot;Do your homework.&quot; <br/>
                    <em style={{color: 'var(--text-muted)'}}>(B.O.B. stares blankly because he doesn&apos;t know where it is)</em>
                  </div>
                  <div style={{ fontSize: '13px', marginTop: '6px' }}>
                    <span style={{color: 'var(--success)'}}>✅ Good:</span> &quot;Sit at the desk, open the laptop, log into the portal, and complete the math assignment.&quot;
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--info)' }}>
            <h3 style={{ marginBottom: '15px', color: 'var(--text-main)' }}>🎮 How the Lab Works</h3>
            <ul className="concepts-list" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <li><strong>1. Pick a Challenge:</strong> Select a scenario (like PB&amp;J or a Maze) from the top dropdown.</li>
              <li><strong>2. Write Commands:</strong> Type out your exact, step-by-step instructions.</li>
              <li><strong>3. Execute:</strong> Watch B.O.B. follow your words blindly and see what happens.</li>
              <li><strong>4. Refine:</strong> Read the AI Tutor Report, fix your logic gaps, and try again!</li>
            </ul>
          </div>

          <div className="onboarding-banner">
            <h3>🧠 How Algorithmic Thinkers Think</h3>
            <div className="steps-row">
              <div className="step-badge">1. Understand the Goal</div>
              <div className="step-badge">2. Identify Needs</div>
              <div className="step-badge">3. Break into Steps</div>
              <div className="step-badge">4. Sequence Logically</div>
              <div className="step-badge">5. Check Assumptions</div>
              <div className="step-badge">6. Test &amp; Improve</div>
            </div>
          </div>

          <button className="btn btn-primary btn-large" onClick={handleStartClick}>
            {startBtnText}
          </button>
        </div>
      </div>

      <div id="app">
        <header>
          <div className="logo">
            <h1>🤖 AlgoThink <span>The Literal Lab</span></h1>
          </div>
          <div className="header-controls">
            <button
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '14px', borderRadius: 'var(--radius-md)' }}
              onClick={() => setShowOnboarding(true)}
            >
              ℹ️ Guide
            </button>
            <select className="dropdown" value={category} onChange={handleCategoryChange}>
              <option value="everyday">Everyday Tasks</option>
              <option value="planning">Planning</option>
              <option value="organization">Organization</option>
              <option value="directions">Directions</option>
              <option value="problemsolving">Problem Solving</option>
            </select>
            <div className="progress-bar">
              <span className="badge">Level 1: Novice Thinker</span>
            </div>
          </div>
        </header>

        <main className="game-container">
          <section className="panel instructions-panel">
            <div className="panel-header">
              <h2>📝 Your Instructions</h2>
              <p className="subtitle">Write step-by-step instructions. Assume B.O.B. knows NOTHING.</p>
            </div>

            <div className="challenge-info">
              <h3>Challenge: {challenge.title}</h3>
              <p>{challenge.desc}</p>
            </div>

            <div className="builder-area">
              <textarea
                placeholder={'1. Pick up the loaf of bread...\n2. Open the bread...\n3. Take out two slices...'}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            <div className="panel-footer">
              <button className="btn btn-primary" onClick={handleSubmit} disabled={isProcessing}>
                ▶️ Submit to B.O.B.
              </button>
            </div>
          </section>

          <section className="panel bob-panel">
            <div className="panel-header">
              <h2>🤖 B.O.B.</h2>
              <p className="subtitle">Execution &amp; Analysis</p>
            </div>

            <div className="bob-display">
              <div className={`bob-character ${bobStateClass}`}>
                <div className="bob-face">
                  <div className="eye left-eye"></div>
                  <div className="eye right-eye"></div>
                  <div className="mouth"></div>
                </div>
              </div>
              <div className="bob-dialogue-box">
                <p>&quot;{bobDialogue}&quot;</p>
              </div>
            </div>

            {showReport && (
              <div className="tutor-report" style={{ animation: 'slideUp 0.4s ease' }}>
                <h3 className="report-title">📋 Execution Report</h3>

                <div className={outcomeClass}>
                  <h4>{outcomeHeader}</h4>
                  <p>{reportOutcome}</p>
                </div>

                <div className="report-section concept">
                  <h4>🧠 Algorithmic Thinking Connection (<span>{reportConceptTitle}</span>)</h4>
                  <p>{reportConcept}</p>
                </div>

                <div className="report-section approach">
                  <h4>🛠️ How an Algorithmic Thinker Approaches This</h4>
                  <p>{reportApproach}</p>
                </div>

                <div className="report-section example">
                  <h4>💡 Better Example</h4>
                  <p>{reportExample}</p>
                </div>

                {successConcepts.length > 0 && (
                  <div className="report-section success-concepts">
                    <h4>🎉 Concepts You Used Successfully</h4>
                    <div>
                      {successConcepts.map((concept, i) => (
                        <div key={i} className="concept-item">
                          <div className="concept-item-title">{concept.icon} {concept.title}</div>
                          <div className="concept-item-msg">{concept.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button className="btn btn-secondary mt-15" onClick={handleRetry}>
                  {retryText}
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
