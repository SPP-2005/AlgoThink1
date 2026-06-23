'use client';
import { useState } from 'react';

const CHALLENGES = {
    'everyday': { title: 'Make a PB&J Sandwich', desc: 'B.O.B. has a jar of peanut butter, a jar of jelly, a loaf of bread, and a butter knife on the table. Tell him exactly how to make a sandwich.' },
    'planning': { title: 'Pack a School Bag', desc: 'B.O.B. needs to pack his math book, pencil case, and lunchbox into his backpack before school.' },
    'organization': { title: 'Sort the Bookshelf', desc: 'B.O.B. has 5 books scattered on the floor. Tell him how to organize them on the shelf from shortest to tallest.' },
    'directions': { title: 'Navigate the Maze', desc: 'B.O.B. is facing North. Tell him how to reach the glowing green exit without walking into the walls.' },
    'problemsolving': { title: 'Fix the Leaky Pipe', desc: 'Water is spraying everywhere! B.O.B. has a wrench and some tape. Tell him how to stop the leak.' }
};

export default function Home() {
    const [challenge, setChallenge] = useState('everyday');
    const [instructions, setInstructions] = useState('');
    const [loading, setLoading] = useState(false);
    const [bobState, setBobState] = useState(''); // '', 'thinking', 'success', 'error'
    const [bobMsg, setBobMsg] = useState('Greetings. I am awaiting operational inputs.');
    const [report, setReport] = useState(null);

    const handleRun = async () => {
        if (!instructions.trim()) return;
        setLoading(true);
        setBobState('thinking');
        setBobMsg('Processing algorithmic sequence...');
        setReport(null);

        try {
            const res = await fetch('/api/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: instructions, currentChallenge: challenge })
            });
            const data = await res.json();
            
            if (data.status === 'success' || data.status === 'minor_improvement') {
                setBobState('success');
                setBobMsg('Execution sequence completed.');
            } else {
                setBobState('error');
                setBobMsg('Execution failed. Critical logical flaws detected.');
            }
            setReport(data);
        } catch (err) {
            setBobState('error');
            setBobMsg('System failure. Backend connection lost.');
        } finally {
            setLoading(false);
        }
    };

    const handleChallengeChange = (e) => {
        setChallenge(e.target.value);
        setInstructions('');
        setReport(null);
        setBobState('');
        setBobMsg('Greetings. I am awaiting operational inputs.');
    };

    return (
        <main className="container">
            <header>
                <div className="logo-text">AlgoThink <span>Enterprise Logic Platform</span></div>
                <select className="select-dropdown" value={challenge} onChange={handleChallengeChange}>
                    <option value="everyday">Everyday Tasks</option>
                    <option value="planning">Planning</option>
                    <option value="organization">Organization</option>
                    <option value="directions">Directions</option>
                    <option value="problemsolving">Problem Solving</option>
                </select>
            </header>

            <div className="panel" style={{ marginBottom: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', marginBottom: '12px' }}>Welcome to The Literal Lab!</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                        Your mission is to teach B.O.B., a Basic Operational Bot, how to survive the human world. B.O.B. is eager to please but takes everything <strong>completely literally</strong>. If you tell him to "make a sandwich," he might just put two slices of bread on his own head!
                    </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', background: 'linear-gradient(to right, #60a5fa, #c084fc, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px', textAlign: 'center' }}>Module 1: The 4 Pillars of Algorithmic Thinking</h2>
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '30px', maxWidth: '800px', margin: '0 auto 30px auto', lineHeight: '1.6' }}>
                        Before interacting with B.O.B., you must learn to think like a computer. Computers don't have common sense—they rely on <strong>Algorithms</strong> (step-by-step instructions). Master these four pillars to succeed:
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <div className="challenge-card" style={{ background: 'rgba(236, 72, 153, 0.1)', borderLeftColor: '#ec4899' }}>
                            <h3 style={{ color: '#f472b6', fontSize: '16px', marginBottom: '10px' }}>🧩 1. Decomposition</h3>
                            <p style={{ fontSize: '13px', marginBottom: '10px', color: '#e2e8f0', lineHeight: '1.5' }}><strong>Breaking down a massive problem into tiny, manageable chunks.</strong></p>
                            <p style={{ fontSize: '13px' }}><em>Example:</em> Instead of telling B.O.B to "Build a house", decompose it into "1. Pour concrete, 2. Build walls, 3. Add roof."</p>
                        </div>
                        
                        <div className="challenge-card" style={{ background: 'rgba(139, 92, 246, 0.1)', borderLeftColor: '#8b5cf6' }}>
                            <h3 style={{ color: '#c084fc', fontSize: '16px', marginBottom: '10px' }}>⏱️ 2. Sequencing</h3>
                            <p style={{ fontSize: '13px', marginBottom: '10px', color: '#e2e8f0', lineHeight: '1.5' }}><strong>The exact chronological order of your steps. Computers blindly follow your order.</strong></p>
                            <p style={{ fontSize: '13px' }}><em>Example:</em> Telling B.O.B to put on his shoes before his socks will result in a fatal error!</p>
                        </div>

                        <div className="challenge-card" style={{ background: 'rgba(56, 189, 248, 0.1)', borderLeftColor: '#38bdf8' }}>
                            <h3 style={{ color: '#7dd3fc', fontSize: '16px', marginBottom: '10px' }}>🎯 3. Precision</h3>
                            <p style={{ fontSize: '13px', marginBottom: '10px', color: '#e2e8f0', lineHeight: '1.5' }}><strong>Being hyper-specific. Never assume B.O.B. knows preconditions or "common sense."</strong></p>
                            <p style={{ fontSize: '13px' }}><em>Example:</em> "Walk forward" might cause B.O.B to walk off a cliff. "Walk forward exactly 5 steps" is safe.</p>
                        </div>

                        <div className="challenge-card" style={{ background: 'rgba(16, 185, 129, 0.1)', borderLeftColor: '#10b981' }}>
                            <h3 style={{ color: '#6ee7b7', fontSize: '16px', marginBottom: '10px' }}>🔀 4. Logic & Decisions</h3>
                            <p style={{ fontSize: '13px', marginBottom: '10px', color: '#e2e8f0', lineHeight: '1.5' }}><strong>Giving the computer rules to follow based on different scenarios.</strong></p>
                            <p style={{ fontSize: '13px' }}><em>Example:</em> "<strong>If</strong> it is raining, <strong>Then</strong> take an umbrella."</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid-layout">
                {/* Input Panel */}
                <section className="panel">
                    <div>
                        <h2 className="panel-title">Instruction Console</h2>
                        <p className="panel-subtitle">Provide explicit, sequential commands for the operational bot.</p>
                    </div>
                    
                    <div className="challenge-card">
                        <h3>Active Scenario: {CHALLENGES[challenge].title}</h3>
                        <p>{CHALLENGES[challenge].desc}</p>
                    </div>

                    <textarea 
                        value={instructions}
                        onChange={e => setInstructions(e.target.value)}
                        placeholder="1. Initialize sequence..."
                        disabled={loading}
                    />

                    <button className="btn btn-primary" onClick={handleRun} disabled={loading || !instructions.trim()}>
                        {loading ? 'Executing...' : 'Deploy Instructions'}
                    </button>
                </section>

                {/* B.O.B. Panel */}
                <section className="panel">
                    <div>
                        <h2 className="panel-title">Bot Telemetry</h2>
                        <p className="panel-subtitle">Live execution feed and logical analysis.</p>
                    </div>

                    <div className="bob-display">
                        <div className={`bob-character ${bobState}`}>
                            <div className="bob-face">
                                <div className="eye left-eye"></div>
                                <div className="eye right-eye"></div>
                                <div className="mouth"></div>
                            </div>
                        </div>
                        <div className="bob-dialogue-box">
                            <p id="bob-dialogue">{bobMsg}</p>
                        </div>
                    </div>

                    {report && (
                        <div className="report-container">
                            <div className={`report-section ${report.status === 'major_error' ? 'section-error' : report.status === 'minor_improvement' ? 'section-warning' : 'section-success'}`}>
                                <h4>Execution Outcome</h4>
                                <p>{report.outcome_narrative}</p>
                            </div>
                            
                            <div className="report-section">
                                <h4>Logical Analysis: {report.conceptTitle}</h4>
                                <p>{report.conceptMsg}</p>
                            </div>

                            <div className="report-section">
                                <h4>Optimization Approach</h4>
                                <p>{report.approachMsg}</p>
                            </div>

                            {report.successful_concepts && report.successful_concepts.length > 0 && (
                                <div className="report-section section-success">
                                    <h4>Validated Logic Structures</h4>
                                    {report.successful_concepts.map((c, i) => (
                                        <div key={i} style={{marginTop: '8px'}}>
                                            <strong style={{fontSize: '13px', color: 'var(--text-main)'}}>{c.title}</strong>
                                            <p style={{marginTop: '2px'}}>{c.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
