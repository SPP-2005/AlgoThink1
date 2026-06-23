'use client';
import { useState } from 'react';
import Link from 'next/link';

const CHALLENGES = {
    'everyday': { title: 'Make a PB&J Sandwich', desc: 'B.O.B. has a jar of peanut butter, a jar of jelly, a loaf of bread, and a butter knife on the table. Tell him exactly how to make a sandwich.' },
    'planning': { title: 'Pack a School Bag', desc: 'B.O.B. needs to pack his math book, pencil case, and lunchbox into his backpack before school.' },
    'organization': { title: 'Sort the Bookshelf', desc: 'B.O.B. has 5 books scattered on the floor. Tell him how to organize them on the shelf from shortest to tallest.' },
    'directions': { title: 'Navigate the Maze', desc: 'B.O.B. is facing North. Tell him how to reach the glowing green exit without walking into the walls.' },
    'problemsolving': { title: 'Fix the Leaky Pipe', desc: 'Water is spraying everywhere! B.O.B. has a wrench and some tape. Tell him how to stop the leak.' }
};

export default function Lab() {
    const [challenge, setChallenge] = useState('everyday');
    const [instructions, setInstructions] = useState('');
    const [loading, setLoading] = useState(false);
    const [bobState, setBobState] = useState(''); 
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
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <select className="select-dropdown" value={challenge} onChange={handleChallengeChange}>
                        <option value="everyday">Everyday Tasks</option>
                        <option value="planning">Planning</option>
                        <option value="organization">Organization</option>
                        <option value="directions">Directions</option>
                        <option value="problemsolving">Problem Solving</option>
                    </select>
                    <Link href="/" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 'auto', padding: '10px 20px' }}>
                        🔙 Course
                    </Link>
                </div>
            </header>

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
