'use client';
import Link from 'next/link';
import { useState } from 'react';

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

    const handleReset = () => {
        setActivityState([]);
        setActivityMessage("");
        setSimStep(-1);
        setSimStatus('idle');
        setKidPosition(15);
        setSimErrorType(null);
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

    const runSimulation = async () => {
        if (activityState.length === 0) {
            setActivityMessage("Please add some steps to your sequence first!");
            return;
        }

        setSimStatus('running');
        setActivityMessage("Running simulation...");
        setKidPosition(15);
        setSimErrorType(null);

        let state = { awake: false, eaten: false, brushed: false, socks: false, shoes: false, bag: false };

        for (let i = 0; i < activityState.length; i++) {
            setSimStep(i);
            const action = activityState[i];

            // Wait 1 second between steps for visual effect
            await new Promise(r => setTimeout(r, 1000));

            if (action !== 'Wake up' && !state.awake) {
                setSimStatus('error');
                setSimErrorType('asleep');
                setActivityMessage(`❌ Error at Step ${i + 1}: You tried to ${action.toLowerCase()} while asleep! Algorithm crashed.`);
                return;
            }

            if (action === 'Wake up') {
                state.awake = true;
            }
            else if (action === 'Brush teeth') {
                state.brushed = true;
            }
            else if (action === 'Eat breakfast') {
                if (!state.brushed) {
                    setActivityMessage("⚠️ Warning: Eating before brushing? Enjoy your morning breath breakfast!");
                }
                state.eaten = true;
            }
            else if (action === 'Wear socks') {
                if (state.shoes) {
                    setSimStatus('error');
                    setSimErrorType('socks_over_shoes');
                    setActivityMessage(`❌ Error at Step ${i + 1}: You can't put socks on OVER your shoes!`);
                    return;
                }
                state.socks = true;
            }
            else if (action === 'Wear shoes') {
                if (!state.socks) {
                    setSimStatus('error');
                    setSimErrorType('no_socks');
                    setActivityMessage(`❌ Error at Step ${i + 1}: You forgot socks! Blisters detected.`);
                    return;
                }
                state.shoes = true;
            }
            else if (action === 'Pack bag') {
                state.bag = true;
            }
            else if (action === 'Leave home') {
                if (!state.shoes) {
                    setSimStatus('error');
                    setSimErrorType('barefoot');
                    setActivityMessage(`❌ Error at Step ${i + 1}: You tried to walk outside barefoot!`);
                    return;
                }
                if (!state.bag) {
                    setSimStatus('error');
                    setSimErrorType('no_bag');
                    setActivityMessage(`❌ Error at Step ${i + 1}: You left without your school bag!`);
                    return;
                }
                if (!state.eaten || !state.brushed) {
                    setSimStatus('error');
                    setSimErrorType('no_hygiene');
                    setActivityMessage(`❌ Error at Step ${i + 1}: You left without eating or brushing teeth! Poor hygiene detected.`);
                    return;
                }

                // Move kid to school
                setKidPosition(80);
                await new Promise(r => setTimeout(r, 1200));
            }
        }

        // Final validation
        if (state.shoes && state.socks && state.bag && state.eaten && state.brushed && activityState.includes('Leave home')) {
            const perfectSequence = ['Wake up', 'Brush teeth', 'Eat breakfast', 'Pack bag', 'Wear socks', 'Wear shoes', 'Leave home'];
            const isPerfect = activityState.every((val, index) => val === perfectSequence[index]);

            if (isPerfect) {
                setSimStatus('success');
                setActivityMessage("✅ Perfect Execution! The optimal sequence was flawless.");
            } else {
                setSimStatus('warning');
                setActivityMessage("⚠️ Task Completed, but Sub-optimal! You got to school, but your sequence of actions wasn't the most logical order.");
            }
        } else {
            if (simStatus !== 'error') {
                setSimStatus('error');
                setSimErrorType('missing_step');
                setActivityMessage("❌ Simulation ended, but you missed a crucial step! Debug your sequence.");
            }
        }
    };

    const renderKid = () => {
        let socks = false;
        let shoes = false;
        let bag = false;
        let awake = false;
        let brushed = false;
        let eaten = false;

        for (let i = 0; i <= simStep; i++) {
            if (activityState[i] === 'Wear socks') socks = true;
            if (activityState[i] === 'Wear shoes') shoes = true;
            if (activityState[i] === 'Pack bag') bag = true;
            if (activityState[i] === 'Wake up') awake = true;
            if (activityState[i] === 'Brush teeth') brushed = true;
            if (activityState[i] === 'Eat breakfast') eaten = true;
        }

        const isWalking = simStatus === 'running' && kidPosition > 15 && kidPosition < 80;

        return (
            <div style={{
                position: 'relative',
                width: '60px',
                height: '100px',
                animation: isWalking ? 'bob 0.4s infinite alternate' : 'none'
            }}>
                <svg width="100%" height="100%" viewBox="0 0 60 100">
                    {/* Shadow */}
                    <ellipse cx="30" cy="95" rx="15" ry="3" fill="rgba(0,0,0,0.2)" />
                    
                    {/* Backpack (Conditional - drawn behind body) */}
                    {bag && (
                        <g>
                            <rect x="5" y="32" width="18" height="30" rx="6" fill="#334155" />
                            <rect x="2" y="38" width="8" height="18" rx="3" fill="#475569" />
                        </g>
                    )}

                    {/* Legs (Dark Jeans) */}
                    <path d="M 22 55 L 20 85 L 26 85 L 28 55 Z" fill="#0f172a" />
                    <path d="M 32 55 L 34 85 L 28 85 L 26 55 Z" fill="#1e293b" />

                    {/* Socks (Conditional) */}
                    {socks && (
                        <g>
                            <rect x="20" y="75" width="6" height="12" fill="#ffffff" />
                            <rect x="28" y="75" width="6" height="12" fill="#e2e8f0" />
                            {/* Sock Stripes */}
                            <line x1="20" y1="78" x2="26" y2="78" stroke="#ef4444" strokeWidth="2" />
                            <line x1="28" y1="78" x2="34" y2="78" stroke="#3b82f6" strokeWidth="2" />
                        </g>
                    )}

                    {/* Shoes (Conditional - High-top Sneakers) */}
                    {shoes && (
                        <g>
                            {/* Back shoe */}
                            <path d="M 18 82 Q 18 95 28 95 L 28 85 L 22 82 Z" fill="#ef4444" />
                            <path d="M 18 92 L 28 92 L 28 95 L 18 95 Z" fill="#ffffff" />
                            {/* Front shoe */}
                            <path d="M 26 82 Q 26 95 38 95 L 38 85 L 30 82 Z" fill="#b91c1c" />
                            <path d="M 26 92 L 38 92 L 38 95 L 26 95 Z" fill="#f8fafc" />
                        </g>
                    )}

                    {/* Body (Cool Hoodie) */}
                    <path d="M 16 35 C 16 25, 40 25, 40 35 L 42 60 C 42 63, 16 63, 18 60 Z" fill="#6366f1" />
                    {/* Hoodie Pocket */}
                    <path d="M 24 50 L 36 50 L 38 58 L 22 58 Z" fill="#4f46e5" />
                    {/* Hoodie Strings */}
                    <line x1="26" y1="35" x2="26" y2="45" stroke="#c7d2fe" strokeWidth="1.5" />
                    <line x1="32" y1="35" x2="32" y2="42" stroke="#c7d2fe" strokeWidth="1.5" />

                    {/* Head / Neck */}
                    <rect x="25" y="22" width="8" height="6" fill="#fcd34d" />
                    <circle cx="30" cy="18" r="11" fill="#fcd34d" />
                    
                    {/* Hair (Messy Teen Hair) */}
                    <path d="M 18 18 C 18 5, 42 5, 42 18 C 42 12, 35 8, 30 8 C 25 8, 18 12, 18 18 Z" fill="#111827" />
                    <path d="M 18 15 Q 15 12 22 10 Q 25 5 30 8 Q 38 5 40 12 Q 44 15 42 20 Q 40 18 38 22" fill="#111827" />
                    
                    {/* Headphones */}
                    <path d="M 19 18 A 12 12 0 0 1 41 18" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    <rect x="17" y="15" width="4" height="8" rx="2" fill="#0f172a" />
                    <rect x="39" y="15" width="4" height="8" rx="2" fill="#0f172a" />

                    {/* Face */}
                    {awake ? (
                        <g>
                            {/* Sunglasses/Cool eyes */}
                            <rect x="31" y="14" width="7" height="3" rx="1" fill="#1e293b" />
                            <path d="M 33 21 Q 35 23 37 21" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                        </g>
                    ) : (
                        <g>
                            <path d="M 31 16 Q 34 14 37 16" fill="none" stroke="#1e293b" strokeWidth="1.5" />
                            <text x="42" y="10" fontSize="12" fill="#1e293b" style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}>Z</text>
                            <text x="50" y="5" fontSize="8" fill="#1e293b" style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}>z</text>
                        </g>
                    )}

                    {/* Minty Sparkle (Brushed Teeth) */}
                    {brushed && (
                        <path d="M 36 21 Q 40 21 40 17 Q 40 21 44 21 Q 40 21 40 25 Q 40 21 36 21" fill="#67e8f9" />
                    )}

                    {/* Breakfast (Holding a Coffee Cup / Energy Drink) */}
                    {eaten && (
                        <g transform="translate(4, -2)">
                            <rect x="35" y="42" width="8" height="12" fill="#e2e8f0" rx="1" />
                            <rect x="34" y="40" width="10" height="3" fill="#0f172a" rx="1" />
                            {/* Logo on cup */}
                            <circle cx="39" cy="48" r="2" fill="#10b981" />
                        </g>
                    )}
                </svg>
            </div>
        );
    };

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

                    {/* Visual 2D Canvas */}
                    <div style={{ height: '340px', background: 'linear-gradient(to bottom, #38bdf8, #bae6fd)', borderRadius: '12px', border: '4px solid #0f172a', position: 'relative', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                        <style>{`
                            @keyframes bob { 0% { transform: translateY(0px); } 100% { transform: translateY(-8px); } }
                            @keyframes cloudMove { 0% { transform: translateX(-100px); } 100% { transform: translateX(800px); } }
                        `}</style>

                        {/* Sun */}
                        <div style={{ position: 'absolute', top: '20px', right: '40px', width: '50px', height: '50px', background: '#fef08a', borderRadius: '50%', boxShadow: '0 0 30px #fef08a' }}></div>

                        {/* Clouds */}
                        <div style={{ position: 'absolute', top: '30px', left: '0', opacity: 0.9, animation: 'cloudMove 25s linear infinite' }}>
                            <svg width="100" height="50" viewBox="0 0 80 40" fill="#ffffff">
                                <circle cx="20" cy="20" r="15" />
                                <circle cx="40" cy="15" r="20" />
                                <circle cx="60" cy="25" r="15" />
                            </svg>
                        </div>
                        <div style={{ position: 'absolute', top: '60px', left: '-200px', opacity: 0.7, animation: 'cloudMove 30s linear infinite 10s' }}>
                            <svg width="120" height="60" viewBox="0 0 80 40" fill="#ffffff">
                                <circle cx="20" cy="20" r="15" />
                                <circle cx="40" cy="15" r="20" />
                                <circle cx="60" cy="25" r="15" />
                            </svg>
                        </div>

                        {/* Floor */}
                        <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '60px', background: '#22c55e', borderTop: '6px solid #166534' }}></div>

                        {/* House (Left) */}
                        <div style={{ position: 'absolute', bottom: '60px', left: '5%', zIndex: 5, width: '120px' }}>
                            <svg width="100%" height="100%" viewBox="0 0 100 120" style={{ overflow: 'visible' }}>
                                <rect x="10" y="50" width="80" height="70" fill="#cbd5e1" stroke="#334155" strokeWidth="2" />
                                <polygon points="-5,50 50,5 105,50" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
                                <rect x="40" y="80" width="20" height="40" fill="#64748b" stroke="#334155" strokeWidth="2" />
                                <rect x="20" y="60" width="15" height="15" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
                                <rect x="65" y="60" width="15" height="15" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
                            </svg>
                            <div style={{ textAlign: 'center', fontWeight: '900', color: '#166534', marginTop: '5px', fontSize: '14px', textShadow: '1px 1px 0px #fff' }}>HOME</div>
                        </div>

                        {/* School (Right) */}
                        <div style={{ position: 'absolute', bottom: '60px', right: '5%', zIndex: 5, width: '160px' }}>
                            <svg width="100%" height="100%" viewBox="0 0 120 140" style={{ overflow: 'visible' }}>
                                <rect x="10" y="60" width="100" height="80" fill="#fcd34d" stroke="#b45309" strokeWidth="2" />
                                <rect x="20" y="60" width="15" height="80" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
                                <rect x="52" y="60" width="15" height="80" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
                                <rect x="85" y="60" width="15" height="80" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
                                <polygon points="-5,60 60,5 125,60" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
                                <circle cx="60" cy="35" r="14" fill="white" stroke="#0f172a" strokeWidth="2" />
                                <line x1="60" y1="35" x2="60" y2="25" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                <line x1="60" y1="35" x2="68" y2="35" stroke="black" strokeWidth="2" strokeLinecap="round" />
                                <rect x="45" y="100" width="30" height="40" fill="#b45309" stroke="#78350f" strokeWidth="2" />
                            </svg>
                            <div style={{ textAlign: 'center', fontWeight: '900', color: '#166534', marginTop: '5px', fontSize: '14px', textShadow: '1px 1px 0px #fff' }}>SCHOOL</div>
                        </div>

                        {/* Kid Avatar */}
                        <div style={{ position: 'absolute', bottom: '60px', left: `${kidPosition}%`, transform: 'translateX(-50%)', transition: 'left 1.2s ease-in-out', zIndex: 10 }}>
                            {renderKid()}
                        </div>

                        {/* Visual Error Overlay for School Prep */}
                        {simErrorType && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                                <div style={{ fontSize: '70px', marginBottom: '10px' }}>
                                    {simErrorType === 'asleep' && '😴'}
                                    {simErrorType === 'socks_over_shoes' && '👟🧦'}
                                    {simErrorType === 'no_socks' && '🔥🦶'}
                                    {simErrorType === 'barefoot' && '🦶🚫'}
                                    {simErrorType === 'no_bag' && '🎒❓'}
                                    {simErrorType === 'no_hygiene' && '🤢🦷'}
                                    {simErrorType === 'missing_step' && '🤔'}
                                </div>
                                <div style={{ background: '#ef4444', color: 'white', padding: '16px 24px', borderRadius: '12px', border: '3px solid white', textAlign: 'center', maxWidth: '85%', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                                    <h3 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                                        {simErrorType === 'asleep' && 'WAKE UP FIRST!'}
                                        {simErrorType === 'socks_over_shoes' && 'SOCKS GO INSIDE SHOES!'}
                                        {simErrorType === 'no_socks' && 'OUCH! BLISTERS!'}
                                        {simErrorType === 'barefoot' && 'YOU ARE BAREFOOT!'}
                                        {simErrorType === 'no_bag' && 'FORGOT YOUR BAG!'}
                                        {simErrorType === 'no_hygiene' && 'GROSS! YOU STINK!'}
                                        {simErrorType === 'missing_step' && 'YOU MISSED SOMETHING!'}
                                    </h3>
                                    <p style={{ fontSize: '16px', margin: 0, fontWeight: 'normal', opacity: 0.9 }}>
                                        {simErrorType === 'asleep' && "You can't execute algorithms in your sleep. Add the 'Wake up' step first!"}
                                        {simErrorType === 'socks_over_shoes' && "You tried putting socks on top of your shoes! That doesn't make any sense."}
                                        {simErrorType === 'no_socks' && "You put your shoes on without socks! That's going to cause painful blisters."}
                                        {simErrorType === 'barefoot' && "You tried walking outside without shoes! You need to protect your feet."}
                                        {simErrorType === 'no_bag' && "You can't go to school without your bag. You forgot a crucial step!"}
                                        {simErrorType === 'no_hygiene' && "You skipped eating or brushing your teeth! Always maintain good hygiene."}
                                        {simErrorType === 'missing_step' && "Your sequence finished, but you didn't successfully prepare for school."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

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
