"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const GameCanvas = dynamic(() => import('./game/GameCanvas'), { ssr: false });

export default function Module1() {
    const [activityState, setActivityState] = useState([]);
    const [activityMessage, setActivityMessage] = useState("");
    const [simStep, setSimStep] = useState(-1);
    const [simStatus, setSimStatus] = useState('idle'); // idle, running, success, error
    const [kidPosition, setKidPosition] = useState(15);
    const [simErrorType, setSimErrorType] = useState(null);

    // Hammer Simulation State
    const [hammerSeq, setHammerSeq] = useState([]);
    const [nailDepth, setNailDepth] = useState(0); 
    const [hammerStatus, setHammerStatus] = useState('idle');
    const [hammerMessage, setHammerMessage] = useState("");
    const [hammerSimStep, setHammerSimStep] = useState(-1);
    const [hammerVisible, setHammerVisible] = useState(false);
    const [isHitting, setIsHitting] = useState(false);
    const [hammerErrorType, setHammerErrorType] = useState(null);

    const availableItems = ['Brush teeth', 'Wear shoes', 'Wake up', 'Eat breakfast', 'Leave home', 'Wear socks', 'Pack bag'];
    const availableHammerItems = ['Pick up hammer', 'Hit nail', 'Loop: [Hit nail] until flush'];

    const handleAdd = (item) => {
        if (!activityState.includes(item) && simStatus !== 'running') {
            setActivityState([...activityState, item]);
        }
    };

    const gameRef = useRef(null);

    const handleReset = () => {
        setActivityState([]);
        setActivityMessage("");
        setSimStep(-1);
        setSimStatus('idle');
        setKidPosition(15);
        setSimErrorType(null);
        if (gameRef.current) gameRef.current.reset();
    };

    const handleHammerAdd = (item) => {
        if (hammerStatus !== 'running') {
            setHammerSeq([...hammerSeq, item]);
        }
    };

    const handleHammerReset = () => {
        setHammerSeq([]);
        setHammerMessage("");
        setHammerSimStep(-1);
        setHammerStatus('idle');
        setNailDepth(0);
        setHammerVisible(false);
        setIsHitting(false);
        setHammerErrorType(null);
    };

    const runHammerSim = async () => {
        if (hammerSeq.length === 0) return;
        setHammerStatus('running');
        setNailDepth(0);
        setHammerVisible(false);
        setHammerMessage("Running simulation...");
        setHammerErrorType(null);
        
        let depth = 0;
        let hasHammer = false;
        
        for (let i = 0; i < hammerSeq.length; i++) {
            setHammerSimStep(i);
            const action = hammerSeq[i];
            await new Promise(r => setTimeout(r, 600));
            
            if (action === 'Pick up hammer') {
                hasHammer = true;
                setHammerVisible(true);
            } else if (action === 'Hit nail') {
                if (!hasHammer) {
                    setHammerStatus('error');
                    setHammerErrorType('no_hammer');
                    setHammerMessage(`❌ Crash at Step ${i+1}: You tried to hit the nail with your bare hand! Ouch! (Iteration required)`);
                    return;
                }
                
                setIsHitting(true);
                await new Promise(r => setTimeout(r, 200));
                depth += 20;
                setNailDepth(depth);
                await new Promise(r => setTimeout(r, 200));
                setIsHitting(false);

                if (depth > 100) {
                    setHammerStatus('error');
                    setHammerErrorType('too_many_hits');
                    setHammerMessage(`❌ Crash at Step ${i+1}: You hit it too many times and damaged the wood! (Iteration required)`);
                    return;
                }
            } else if (action === 'Loop: [Hit nail] until flush') {
                if (!hasHammer) {
                    setHammerStatus('error');
                    setHammerErrorType('loop_no_hammer');
                    setHammerMessage(`❌ Crash at Step ${i+1}: You can't loop a hammer hit without a hammer!`);
                    return;
                }
                while (depth < 100) {
                    setIsHitting(true);
                    await new Promise(r => setTimeout(r, 200));
                    depth += 20;
                    setNailDepth(depth);
                    await new Promise(r => setTimeout(r, 200));
                    setIsHitting(false);
                }
            }
        }
        
        if (depth === 100) {
            if (hammerSeq.filter(x => x === 'Hit nail').length > 1) {
                setHammerStatus('warning');
                setHammerMessage("⚠️ Task Completed, but you repeated the 'Hit nail' step manually! Don't repeat yourself—use a Loop next time.");
            } else if (hammerSeq.includes('Loop: [Hit nail] until flush')) {
                setHammerStatus('success');
                setHammerMessage("✅ Perfect! You used a Loop to avoid repeating steps, and Iterated to find the perfect algorithm!");
            } else {
                 setHammerStatus('success');
                 setHammerMessage("✅ Done! But try using a loop next time.");
            }
        } else {
            setHammerStatus('error');
            setHammerErrorType('not_flush');
            setHammerMessage("❌ Simulation ended, but the nail isn't flush! Iteration is key—what went wrong? Try again!");
        }
    };

    const runSimulation = () => {
        if (activityState.length === 0) {
            setActivityMessage("Please add some steps to your sequence first!");
            return;
        }

        setSimStatus('running');
        setActivityMessage("Running simulation...");
        setSimErrorType(null);

        // Delegate entire execution to the Phaser game engine
        if (gameRef.current) {
            gameRef.current.executeAlgorithm(activityState);
        }
    };

    // Game status callbacks
    const handleGameStatus = (newStatus) => setSimStatus(newStatus);
    const handleGameMessage = (msg) => setActivityMessage(msg);

    return (
        <main className="container">
            <header>
                <div className="logo-text">AlgoThink <span>Module 1</span></div>
                <Link href="/dashboard" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>⬅️ Dashboard</Link>
            </header>

            <div className="panel">
                <h1 style={{ fontSize: '36px', color: '#60a5fa', marginBottom: '20px', fontWeight: '900' }}>The 7 Superpowers of Algorithmic Thinkers</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '30px' }}>
                    Welcome to the ultimate problem-solving toolkit. Algorithmic thinking isn't just for programming. It is a universal life skill used in <strong>Cooking, Planning, Sports, School work, Giving directions, Organizing things, and Programming</strong>. Mastering these pillars means you can break down and solve any challenge in front of you.
                </p>

                {/* Definition Block */}
                <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #3b82f6', marginBottom: '40px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '24px' }}>
                    <div style={{ flex: '1', minWidth: '280px' }}>
                        <h2 style={{ fontSize: '24px', color: '#ffffff', marginBottom: '12px' }}>What is Algorithmic Thinking?</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '0', fontSize: '16px' }}>
                            <strong>Algorithmic Thinking</strong> is the superpower of taking a massive goal and creating a clear, unambiguous, step-by-step sequence of instructions to achieve it.
                        </p>
                    </div>
                    <div style={{ flex: '0 0 300px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(59, 130, 246, 0.3)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', height: '160px' }}>
                        <img src="https://images.unsplash.com/photo-1596496050827-8299e0220de1?q=80&w=600" alt="Rubik's Cube - The Ultimate Algorithm" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
                    </div>
                </div>

                {/* Algorithms Are Everywhere */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '20px' }}>🌍 Algorithms Are Everywhere</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '20px', fontSize: '16px' }}>
                        You already use algorithms every single day. Look at how these common goals are achieved through simple steps:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: '18px', color: '#60a5fa', marginBottom: '10px' }}>🍞 Making a Sandwich</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}><strong>Goal:</strong> Satisfy hunger</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}><strong>Steps:</strong> Get bread → Spread PB&J → Combine</p>
                            <p style={{ color: '#34d399', fontSize: '14px' }}><strong>Result:</strong> Delicious sandwich</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: '18px', color: '#60a5fa', marginBottom: '10px' }}>🎒 Packing a School Bag</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}><strong>Goal:</strong> Prepare for school</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}><strong>Steps:</strong> Check schedule → Gather books → Pack</p>
                            <p style={{ color: '#34d399', fontSize: '14px' }}><strong>Result:</strong> Ready for classes</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: '18px', color: '#60a5fa', marginBottom: '10px' }}>📍 Giving Directions</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}><strong>Goal:</strong> Help friend find your house</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}><strong>Steps:</strong> Go straight 2 blocks → Turn left → Stop</p>
                            <p style={{ color: '#34d399', fontSize: '14px' }}><strong>Result:</strong> Friend arrives safely</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: '18px', color: '#60a5fa', marginBottom: '10px' }}>🎉 Planning a Party</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}><strong>Goal:</strong> Celebrate a birthday</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}><strong>Steps:</strong> Make guest list → Send invites → Buy cake</p>
                            <p style={{ color: '#34d399', fontSize: '14px' }}><strong>Result:</strong> Awesome party</p>
                        </div>
                    </div>
                </div>

                {/* Interactive Activity Game */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '24px', color: '#ffffff', marginBottom: '16px' }}>🎮 2D Simulation Game: Prepare for School</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '20px' }}>Program the algorithmic sequence to get the kid to school. Click "Run Simulation" to visually understand how an algorithm works</p>

                    {/* Phaser Game Canvas */}
                    <GameCanvas
                        ref={gameRef}
                        onStatusChange={handleGameStatus}
                        onMessage={handleGameMessage}
                    />

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                        {availableItems.map((item, idx) => {
                            const isAdded = activityState.includes(item);
                            return (
                                <button key={idx} onClick={() => handleAdd(item)} disabled={isAdded || simStatus === 'running'} style={{ background: isAdded ? '#334155' : 'var(--surface-light)', border: '1px solid var(--border)', color: isAdded ? '#64748b' : 'white', padding: '10px 16px', borderRadius: '8px', cursor: isAdded || simStatus === 'running' ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: isAdded ? 0.5 : 1 }}>
                                    + {item}
                                </button>
                            )
                        })}
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', minHeight: '80px', border: '1px dashed var(--border)', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {activityState.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Your algorithm sequence will appear here...</span>}
                        {activityState.map((item, idx) => (
                            <div key={idx} style={{ background: simStep === idx ? '#f59e0b' : '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)', transition: 'background 0.3s' }}>
                                {idx + 1}. {item}
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button onClick={runSimulation} disabled={simStatus === 'running'} className="btn btn-primary" style={{ padding: '8px 24px', background: simStatus === 'running' ? '#64748b' : '#3b82f6', cursor: simStatus === 'running' ? 'not-allowed' : 'pointer' }}>▶ Run Simulation</button>
                        <button onClick={handleReset} disabled={simStatus === 'running'} className="btn" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'white', padding: '8px 24px', borderRadius: '8px', cursor: simStatus === 'running' ? 'not-allowed' : 'pointer' }}>🔄 Reset</button>
                    </div>
                    {activityMessage && <div style={{ marginTop: '16px', fontSize: '16px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', borderLeft: `4px solid ${simStatus === 'error' ? '#f87171' : simStatus === 'success' ? '#34d399' : '#fbbf24'}`, color: simStatus === 'error' ? '#fca5a5' : simStatus === 'success' ? '#6ee7b7' : '#fcd34d', fontWeight: 'bold', width: '100%' }}>{activityMessage}</div>}
                </div>

                {/* 1. Decomposition */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '26px', color: '#ffffff', marginBottom: '16px' }}>🧩 1. Decomposition: Divide and Conquer</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Decomposition is breaking down a massive, overwhelming problem into small, manageable pieces.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                            <h4 style={{ color: '#f87171', marginBottom: '10px' }}>❌ Overwhelming Goal</h4>
                            <p style={{ color: 'var(--text-muted)' }}>"Organize the entire school festival."</p>
                        </div>
                        <div style={{ background: 'rgba(52,211,153,0.1)', padding: '20px', borderRadius: '12px' }}>
                            <h4 style={{ color: '#34d399', marginBottom: '10px' }}>✅ Decomposed Goal</h4>
                            <ul style={{ color: 'var(--text-muted)', paddingLeft: '20px' }}>
                                <li>Book a venue</li>
                                <li>Order food</li>
                                <li>Hire a DJ</li>
                            </ul>
                        </div>
                    </div>
                    <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                        <strong style={{ color: '#60a5fa' }}>The Golden Rule:</strong> If a step feels too hard, you haven't decomposed it enough. Break it down again!
                    </div>
                </div>

                {/* 2. Sequencing */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '26px', color: '#ffffff', marginBottom: '16px' }}>⏳ 2. Sequencing: The Art of Order</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Chronology is everything. Every single step must logically follow the previous one. If you put cake batter in the oven before adding flour, you get a disaster!
                    </p>
                </div>

                {/* 3. Precision */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '26px', color: '#ffffff', marginBottom: '16px' }}>🎯 3. Precision: Eradicating Ambiguity</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Vague instructions lead to unpredictable results. You must be absolutely clear.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                            <h4 style={{ color: '#f87171', marginBottom: '10px' }}>❌ Vague</h4>
                            <p style={{ color: 'var(--text-muted)' }}>"Walk forward a bit."</p>
                        </div>
                        <div style={{ background: 'rgba(52,211,153,0.1)', padding: '20px', borderRadius: '12px' }}>
                            <h4 style={{ color: '#34d399', marginBottom: '10px' }}>✅ Precise</h4>
                            <p style={{ color: 'var(--text-muted)' }}>"Walk forward exactly 5 steps."</p>
                        </div>
                    </div>
                </div>

                {/* 4. Assumption Checking */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '26px', color: '#ffffff', marginBottom: '16px' }}>🕵️ 4. Assumption Checking</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Humans assume things constantly (like gravity). In algorithms, you must assume <strong>nothing</strong>.
                    </p>
                    <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #f59e0b' }}>
                        <strong style={{ color: '#fbbf24' }}>Example:</strong> If you want to spread peanut butter, you must first verify that you are holding a knife, the jar is open, and there is actually peanut butter inside!
                    </div>
                </div>

                {/* 5. Repetition */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '26px', color: '#ffffff', marginBottom: '16px' }}>🔄 5. Repetition: The Power of Loops</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '24px', fontSize: '16px' }}>
                        Never write the exact same instruction twice. If you're washing 100 plates, you don't write "Wash Plate" 100 times. You tell the system: <strong>"Repeat until sink is empty: Wash Plate"</strong>.
                    </p>

                    {/* Hammer Game */}
                    <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: '20px', color: '#a78bfa', marginBottom: '8px' }}>🔨 Example of Loops</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '16px', lineHeight: '1.6' }}>
                                <strong>Goal:</strong> Drive the nail flush into the wood. Try it without loops first, then try it with a loop!
                            </p>

                            <div style={{ height: '300px', background: 'linear-gradient(to bottom, #1e293b, #0f172a)', borderRadius: '12px', border: '2px solid var(--border)', position: 'relative', overflow: 'hidden', marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <style>{`
                                    @keyframes hammerStrike {
                                        0% { transform: rotate(0deg); }
                                        50% { transform: rotate(-45deg); }
                                        100% { transform: rotate(0deg); }
                                    }
                                `}</style>
                                <svg width="240" height="180" viewBox="0 -20 200 180" style={{ overflow: 'visible' }}>
                                    {/* Wood */}
                                    <rect x="30" y="80" width="140" height="70" fill="#b45309" stroke="#78350f" strokeWidth="4" />
                                    
                                    {/* Nail */}
                                    <g style={{ transform: `translateY(${nailDepth * 0.4}px)`, transition: 'transform 0.2s' }}>
                                        <rect x="95" y="10" width="10" height="70" fill="#94a3b8" />
                                        <rect x="85" y="5" width="30" height="8" fill="#64748b" rx="2" />
                                    </g>

                                    {/* Hammer */}
                                    <g style={{ transformOrigin: '140px 10px', animation: isHitting ? 'hammerStrike 0.3s ease-in-out' : 'none', opacity: 1 }}>
                                        {/* Handle */}
                                        <rect x="135" y="10" width="12" height="60" fill="#fcd34d" rx="4" />
                                        {/* Head */}
                                        <rect x="100" y="0" width="50" height="25" fill="#475569" rx="4" />
                                    </g>
                                </svg>

                                {/* Visual Error Overlay for Hammer Game */}
                                {hammerErrorType && (
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                                        <div style={{ fontSize: '70px', marginBottom: '10px' }}>
                                            {(hammerErrorType === 'no_hammer' || hammerErrorType === 'loop_no_hammer') && '🖐️💥'}
                                            {hammerErrorType === 'too_many_hits' && '🪵💥'}
                                            {hammerErrorType === 'not_flush' && '🤨'}
                                        </div>
                                        <div style={{ background: '#ef4444', color: 'white', padding: '16px 24px', borderRadius: '12px', border: '3px solid white', textAlign: 'center', maxWidth: '85%', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                                            <h3 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                                                {(hammerErrorType === 'no_hammer' || hammerErrorType === 'loop_no_hammer') && 'OUCH! HIT FINGERS!'}
                                                {hammerErrorType === 'too_many_hits' && 'WOOD DESTROYED!'}
                                                {hammerErrorType === 'not_flush' && 'NAIL NOT FLUSH!'}
                                            </h3>
                                            <p style={{ fontSize: '16px', margin: 0, fontWeight: 'normal', opacity: 0.9 }}>
                                                {(hammerErrorType === 'no_hammer' || hammerErrorType === 'loop_no_hammer') && "You tried to drive a nail with your bare hand! Always pick up the right tool first."}
                                                {hammerErrorType === 'too_many_hits' && "You hammered too many times and damaged the wood! A loop helps prevent over-hitting."}
                                                {hammerErrorType === 'not_flush' && "The nail is still sticking out! You didn't repeat the action enough times."}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                {availableHammerItems.map((item, idx) => (
                                    <button key={idx} onClick={() => handleHammerAdd(item)} disabled={hammerStatus === 'running'} style={{ background: 'var(--surface-light)', border: '1px solid var(--border)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: hammerStatus === 'running' ? 'not-allowed' : 'pointer', transition: 'all 0.2s', fontSize: '14px' }}>
                                        + {item}
                                    </button>
                                ))}
                            </div>

                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', minHeight: '60px', border: '1px dashed var(--border)', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                                {hammerSeq.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Build your sequence...</span>}
                                {hammerSeq.map((item, idx) => (
                                    <div key={idx} style={{ background: hammerSimStep === idx ? '#f59e0b' : '#8b5cf6', color: 'white', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)', transition: 'background 0.3s' }}>
                                        {idx + 1}. {item}
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <button onClick={runHammerSim} disabled={hammerStatus === 'running'} className="btn btn-primary" style={{ padding: '8px 24px', fontSize: '14px', background: hammerStatus === 'running' ? '#64748b' : '#8b5cf6', cursor: hammerStatus === 'running' ? 'not-allowed' : 'pointer' }}>▶ Run Sequence</button>
                                <button onClick={handleHammerReset} disabled={hammerStatus === 'running'} className="btn" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'white', padding: '8px 24px', fontSize: '14px', borderRadius: '8px', cursor: hammerStatus === 'running' ? 'not-allowed' : 'pointer' }}>🔄 Reset</button>
                            </div>
                            {hammerMessage && <div style={{ marginTop: '16px', fontSize: '16px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', borderLeft: `4px solid ${hammerStatus === 'error' ? '#f87171' : hammerStatus === 'success' ? '#34d399' : '#fbbf24'}`, color: hammerStatus === 'error' ? '#fca5a5' : hammerStatus === 'success' ? '#6ee7b7' : '#fcd34d', fontWeight: 'bold', width: '100%' }}>{hammerMessage}</div>}
                        </div>
                </div>

                {/* 6. Decision Making */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '26px', color: '#ffffff', marginBottom: '16px' }}>⚖️ 6. Decision Making: Conditional Logic</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Algorithms need to adapt to their environment. By using <strong>If / Then / Else</strong> rules, you can create dynamic paths that handle anything life throws at them.
                    </p>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', display: 'inline-block', border: '1px solid var(--border)', fontFamily: 'monospace', fontSize: '15px' }}>
                        <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '8px' }}>IF (It is raining) {"{"}</div>
                        <div style={{ color: '#6ee7b7', paddingLeft: '20px', marginBottom: '8px' }}>Action: "Take an Umbrella"</div>
                        <div style={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '8px' }}>{"}"} ELSE {"{"}</div>
                        <div style={{ color: '#6ee7b7', paddingLeft: '20px', marginBottom: '8px' }}>Action: "Wear Sunglasses"</div>
                        <div style={{ color: '#fbbf24', fontWeight: 'bold' }}>{"}"}</div>
                    </div>
                </div>

                {/* 7. Iteration */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px' }}>
                    <h2 style={{ fontSize: '26px', color: '#ffffff', marginBottom: '16px' }}>🛠️ 7. Iteration: Test, Fail, Refine</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '20px', fontSize: '16px' }}>
                        Your first try will almost always fail. Iteration is the scientific process of testing your logic, finding the exact point of failure (debugging), fixing it, and trying again.
                    </p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <Link href="/course/module-2" className="btn btn-primary" style={{ width: 'auto', background: '#3b82f6', padding: '12px 30px' }}>Proceed to Module 2 ➡️</Link>
                </div>
            </div>
        </main>
    );
}
