'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Module1() {
    const [activityState, setActivityState] = useState([]);
    const [activityMessage, setActivityMessage] = useState("");
    const [simStep, setSimStep] = useState(-1);
    const [simStatus, setSimStatus] = useState('idle'); // idle, running, success, error
    const [kidPosition, setKidPosition] = useState(50);

    const availableItems = ['Brush teeth', 'Wear shoes', 'Wake up', 'Eat breakfast', 'Leave home', 'Wear socks', 'Pack bag'];
    
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
    };

    const runSimulation = async () => {
        if (activityState.length === 0) {
            setActivityMessage("Please add some steps to your sequence first!");
            return;
        }

        setSimStatus('running');
        setActivityMessage("Running simulation...");
        setKidPosition(15);

        let state = { awake: false, eaten: false, brushed: false, socks: false, shoes: false, bag: false };

        for (let i = 0; i < activityState.length; i++) {
            setSimStep(i);
            const action = activityState[i];
            
            // Wait 1 second between steps for visual effect
            await new Promise(r => setTimeout(r, 1000));

            if (action !== 'Wake up' && !state.awake) {
                setSimStatus('error');
                setActivityMessage(`❌ Error at Step ${i+1}: You tried to ${action.toLowerCase()} while asleep! Algorithm crashed.`);
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
                    setActivityMessage(`❌ Error at Step ${i+1}: You can't put socks on OVER your shoes!`);
                    return;
                }
                state.socks = true;
            } 
            else if (action === 'Wear shoes') {
                if (!state.socks) {
                    setSimStatus('error');
                    setActivityMessage(`❌ Error at Step ${i+1}: You forgot socks! Blisters detected.`);
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
                    setActivityMessage(`❌ Error at Step ${i+1}: You tried to walk outside barefoot!`);
                    return;
                }
                if (!state.bag) {
                    setSimStatus('error');
                    setActivityMessage(`❌ Error at Step ${i+1}: You left without your school bag!`);
                    return;
                }
                if (!state.eaten || !state.brushed) {
                    setSimStatus('error');
                    setActivityMessage(`❌ Error at Step ${i+1}: You left without eating or brushing teeth! Poor hygiene detected.`);
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

        for(let i=0; i <= simStep; i++) {
            if(activityState[i] === 'Wear socks') socks = true;
            if(activityState[i] === 'Wear shoes') shoes = true;
            if(activityState[i] === 'Pack bag') bag = true;
            if(activityState[i] === 'Wake up') awake = true;
            if(activityState[i] === 'Brush teeth') brushed = true;
            if(activityState[i] === 'Eat breakfast') eaten = true;
        }

        const isWalking = simStatus === 'running' && kidPosition > 15 && kidPosition < 80;

        return (
            <div style={{ 
                position: 'relative', 
                width: '60px', 
                height: '100px',
                animation: isWalking ? 'bob 0.4s infinite alternate' : 'none' 
            }}>
                <svg width="100%" height="100%" viewBox="0 0 50 100">
                    {/* Backpack (Conditional - drawn behind body) */}
                    {bag && (
                        <rect x="2" y="38" width="15" height="25" rx="5" fill="#10b981" />
                    )}
                    {/* Head */}
                    <circle cx="25" cy="20" r="14" fill="#fcd34d" />
                    {/* Face */}
                    {awake ? (
                        <>
                            <circle cx="29" cy="18" r="2" fill="#1e293b" />
                            <path d="M 28 24 Q 30 26 32 24" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />
                        </>
                    ) : (
                        <>
                            <path d="M 27 18 Q 29 16 31 18" fill="none" stroke="#1e293b" strokeWidth="1.5" />
                            <text x="35" y="10" fontSize="10" fill="#1e293b" style={{fontFamily: 'sans-serif', fontWeight: 'bold'}}>z</text>
                            <text x="42" y="5" fontSize="8" fill="#1e293b" style={{fontFamily: 'sans-serif', fontWeight: 'bold'}}>z</text>
                        </>
                    )}

                    {/* Minty Sparkle (Brushed Teeth) */}
                    {brushed && (
                        <path d="M 32 24 Q 35 24 35 21 Q 35 24 38 24 Q 35 24 35 27 Q 35 24 32 24" fill="#67e8f9" />
                    )}
                    
                    {/* Body */}
                    <rect x="15" y="35" width="20" height="30" rx="6" fill="#3b82f6" />

                    {/* Breakfast (Apple in hand) */}
                    {eaten && (
                        <g>
                            <circle cx="36" cy="45" r="4" fill="#ef4444" />
                            <path d="M 36 41 Q 38 39 39 41" fill="none" stroke="#22c55e" strokeWidth="1.5" />
                        </g>
                    )}
                    
                    {/* Legs */}
                    <rect x="18" y="60" width="6" height="25" fill="#fcd34d" />
                    <rect x="26" y="60" width="6" height="25" fill="#fcd34d" />

                    {/* Socks (Conditional) */}
                    {socks && (
                        <>
                            <rect x="18" y="75" width="6" height="10" fill="#ffffff" />
                            <rect x="26" y="75" width="6" height="10" fill="#ffffff" />
                        </>
                    )}

                    {/* Shoes (Conditional) */}
                    {shoes && (
                        <>
                            <path d="M 16 85 Q 18 95 24 95 L 24 85 Z" fill="#ef4444" />
                            <path d="M 26 85 Q 26 95 34 95 L 34 85 Z" fill="#ef4444" />
                        </>
                    )}
                </svg>
            </div>
        );
    };

    return (
        <main className="container">
            <header>
                <div className="logo-text">AlgoThink <span>Module 1</span></div>
                <Link href="/dashboard" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>← Dashboard</Link>
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
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
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
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: '18px', color: '#60a5fa', marginBottom: '10px' }}>📚 Organizing a Bookshelf</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}><strong>Goal:</strong> Tidy room</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}><strong>Steps:</strong> Sort by height → Place tallest first</p>
                            <p style={{ color: '#34d399', fontSize: '14px' }}><strong>Result:</strong> Neat bookshelf</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: '18px', color: '#60a5fa', marginBottom: '10px' }}>🧹 Cleaning a Room</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}><strong>Goal:</strong> Spotless bedroom</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}><strong>Steps:</strong> Pick up clothes → Make bed → Vacuum</p>
                            <p style={{ color: '#34d399', fontSize: '14px' }}><strong>Result:</strong> Clean space</p>
                        </div>
                    </div>
                </div>

                {/* Interactive Activity Game */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '24px', color: '#ffffff', marginBottom: '16px' }}>🎮 2D Simulation: Prepare for School</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '20px' }}>Program the sequence to get the kid to school. Click 'Run Simulation' to execute your algorithm visually!</p>
                    
                    {/* Visual 2D Canvas */}
                    <div style={{ height: '260px', background: 'linear-gradient(to bottom, #38bdf8, #bae6fd)', borderRadius: '12px', border: '4px solid #0f172a', position: 'relative', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
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
                            <div style={{textAlign: 'center', fontWeight: '900', color: '#166534', marginTop: '5px', fontSize: '14px', textShadow: '1px 1px 0px #fff'}}>HOME</div>
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
                            <div style={{textAlign: 'center', fontWeight: '900', color: '#166534', marginTop: '5px', fontSize: '14px', textShadow: '1px 1px 0px #fff'}}>SCHOOL</div>
                        </div>

                        {/* Kid Avatar */}
                        <div style={{ position: 'absolute', bottom: '60px', left: `${kidPosition}%`, transform: 'translateX(-50%)', transition: 'left 1.2s ease-in-out', zIndex: 10 }}>
                            {renderKid()}
                        </div>
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

                    <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button onClick={runSimulation} disabled={simStatus === 'running'} className="btn btn-primary" style={{ padding: '8px 24px', background: simStatus === 'running' ? '#64748b' : '#3b82f6', cursor: simStatus === 'running' ? 'not-allowed' : 'pointer' }}>▶ Run Simulation</button>
                        <button onClick={handleReset} disabled={simStatus === 'running'} className="btn" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'white', padding: '8px 24px', borderRadius: '8px', cursor: simStatus === 'running' ? 'not-allowed' : 'pointer' }}>🔄 Reset</button>
                        {activityMessage && <span style={{ marginLeft: '10px', color: simStatus === 'error' ? '#f87171' : simStatus === 'success' ? '#34d399' : '#fbbf24', fontWeight: 'bold' }}>{activityMessage}</span>}
                    </div>
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

                {/* 5, 6, 7 Combined for brevity */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px' }}>
                    <h2 style={{ fontSize: '26px', color: '#ffffff', marginBottom: '16px' }}>🔄 Advanced Pillars: Repetition, Logic, and Iteration</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <h4 style={{ fontSize: '18px', color: '#a78bfa', marginBottom: '8px' }}>5. Repetition (Loops)</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Never write the same instruction twice. Tell the system to "Repeat Step 2 until the bowl is empty."</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <h4 style={{ fontSize: '18px', color: '#a78bfa', marginBottom: '8px' }}>6. Decision Making (Logic)</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Use If/Then rules to adapt to changes. "If it is raining, take an umbrella. Else, wear sunglasses."</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <h4 style={{ fontSize: '18px', color: '#a78bfa', marginBottom: '8px' }}>7. Iteration (Debugging)</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Your first try will almost always fail. Iteration is the process of testing, finding the flaw, fixing it, and trying again.</p>
                        </div>
                    </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <Link href="/course/module-2" className="btn btn-primary" style={{ width: 'auto', background: '#3b82f6', padding: '12px 30px' }}>Proceed to Module 2 ➡️</Link>
                </div>
            </div>
        </main>
    );
}
