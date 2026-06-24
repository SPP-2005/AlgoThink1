'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Module1() {
    const [activityState, setActivityState] = useState([]);
    const [activityMessage, setActivityMessage] = useState("");

    const availableItems = ['Wear shoes', 'Wear socks', 'Leave home', 'Pack school bag'];
    
    const handleAdd = (item) => {
        if (!activityState.includes(item)) {
            setActivityState([...activityState, item]);
        }
    };

    const handleReset = () => {
        setActivityState([]);
        setActivityMessage("");
    };

    const handleSubmit = () => {
        if (activityState.length === 4) {
            if (activityState[0] === 'Wear socks' && activityState[1] === 'Wear shoes' && activityState[2] === 'Pack school bag' && activityState[3] === 'Leave home') {
                setActivityMessage("✅ Correct! You just used Sequencing.");
            } else {
                setActivityMessage("❌ Not quite! Think about the logical order (e.g., socks before shoes).");
            }
        } else {
            setActivityMessage("Please arrange all 4 steps first.");
        }
    };

    return (
        <main className="container">
            <header>
                <div className="logo-text">AlgoThink <span>Module 1</span></div>
                <Link href="/dashboard" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>← Dashboard</Link>
            </header>
            
            <div className="panel">
                <h1 style={{ fontSize: '36px', color: '#60a5fa', marginBottom: '20px', fontWeight: '900' }}>The 7 Pillars of Logic</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '30px' }}>
                    Welcome to the ultimate problem-solving toolkit. Algorithmic thinking isn't just for programming. It is a universal life skill used in <strong>Cooking, Planning, Sports, School work, Giving directions, Organizing things, and Programming</strong>. Mastering these pillars means you can break down and solve any challenge in front of you.
                </p>

                {/* Definition Block */}
                <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #3b82f6', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '24px', color: '#ffffff', marginBottom: '12px' }}>What is Algorithmic Thinking?</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        <strong>Algorithmic Thinking</strong> is the superpower of taking a massive goal and creating a clear, unambiguous, step-by-step sequence of instructions to achieve it.
                    </p>
                    <div style={{ marginTop: '20px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(59, 130, 246, 0.3)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
                        <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200" alt="Logic Flowchart" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px', objectFit: 'cover' }} />
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

                {/* Interactive Activity */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '24px', color: '#ffffff', marginBottom: '16px' }}>⚡ Quick Activity: Prepare for School</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '16px', marginBottom: '20px' }}>Click the actions in the correct chronological order.</p>
                    
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                        {availableItems.filter(item => !activityState.includes(item)).map((item, idx) => (
                            <button key={idx} onClick={() => handleAdd(item)} className="btn" style={{ background: 'var(--surface-light)', border: '1px solid var(--border)', color: 'white', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                + {item}
                            </button>
                        ))}
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', minHeight: '80px', border: '1px dashed var(--border)', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {activityState.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Your sequence will appear here...</span>}
                        {activityState.map((item, idx) => (
                            <div key={idx} style={{ background: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
                                {idx + 1}. {item}
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button onClick={handleSubmit} className="btn btn-primary" style={{ padding: '8px 24px', background: '#3b82f6' }}>Check Sequence</button>
                        <button onClick={handleReset} className="btn" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'white', padding: '8px 24px', borderRadius: '8px', cursor: 'pointer' }}>Reset</button>
                        {activityMessage && <span style={{ marginLeft: '10px', color: activityMessage.includes('Correct') ? '#34d399' : '#f87171', fontWeight: 'bold' }}>{activityMessage}</span>}
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
