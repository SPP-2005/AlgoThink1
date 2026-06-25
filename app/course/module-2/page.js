"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Module2() {
    const [activeScenario, setActiveScenario] = useState(null);
    const [activeTab, setActiveTab] = useState('🎮 3D Simulation');
    const [currentStep, setCurrentStep] = useState(1);
    const [autoPlay, setAutoPlay] = useState(false);

    useEffect(() => {
        let interval;
        if (autoPlay) {
            interval = setInterval(() => {
                setCurrentStep(prev => (prev < 6 ? prev + 1 : 1));
            }, 2500);
        }
        return () => clearInterval(interval);
    }, [autoPlay]);

    const scenarios = [
        {
            id: 1,
            title: 'The "Perfect" Morning Coffee',
            desc: 'Brew the perfect cup by following the right steps, in the right order.',
            image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1200',
            tags: [{ label: 'Assumption', color: '#fbbf24' }, { label: 'Sequencing', color: '#60a5fa' }, { label: 'Precision', color: '#34d399' }],
            steps: [
                { id: 1, title: 'Check Water', desc: 'Is the machine filled with fresh water?', image: '/1.png' },
                { id: 2, title: 'Add Coffee Beans', desc: 'Measure the right amount of beans.', image: '/2.png' },
                { id: 3, title: 'Grind Beans', desc: 'Grind to the right coarseness.', image: '/3.png' },
                { id: 4, title: 'Tamp the Grounds', desc: 'Press evenly for the perfect shot.', image: '/4.png' },
                { id: 5, title: 'Brew', desc: 'Extract the espresso or coffee.', image: '/5.png' },
                { id: 6, title: 'Pour and Enjoy', desc: 'Your perfect coffee is ready!', image: '/6.png' }
            ],
            mistakes: [
                { icon: '⚠️', title: 'Missing Condition Checks', desc: 'Starting the machine without verifying water or beans exist. (NullReferenceException)' },
                { icon: '🔁', title: 'Incorrect Sequence', desc: 'Grinding beans after you pour the water. Order of execution matters!' },
                { icon: '🤷', title: 'Ambiguous Parameters', desc: 'Adding "some" coffee instead of a precise measurement, resulting in unpredictable output.' }
            ],
            funFact: { icon: '⚡', concept: 'Parallel Processing', title: 'Grind while you heat!', desc: 'You do not have to wait for the water to finish heating up before you start grinding the beans. Doing two things at the exact same time is called Parallel Processing, and it makes your algorithm way faster!' }
        },
        {
            id: 2,
            title: 'Doing the Laundry',
            desc: 'Use decomposition and decision making to clean your clothes the smart way.',
            image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=1200',
            tags: [{ label: 'Decomposition', color: '#c084fc' }, { label: 'Pattern Recognition', color: '#f472b6' }, { label: 'Sequencing', color: '#60a5fa' }],
            steps: [
                { id: 1, title: 'Gather Laundry', desc: 'Collect all clothes from hampers.', image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=1200' },
                { id: 2, title: 'Sort by Color', desc: 'Separate whites, darks, and colors.', image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=1200' },
                { id: 3, title: 'Check Labels', desc: 'Identify delicate or dry-clean only items.', image: 'https://images.unsplash.com/photo-1584844141695-8120fbba1e98?q=80&w=1200' },
                { id: 4, title: 'Load Machine', desc: 'Do not overload; leave room for agitation.', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=1200' },
                { id: 5, title: 'Select Cycle', desc: 'Choose temperature and spin speed.', image: 'https://images.unsplash.com/photo-1582735689255-7fc75bb42f1b?q=80&w=1200' },
                { id: 6, title: 'Dry and Fold', desc: 'Transfer to dryer or hang, then fold.', image: 'https://images.unsplash.com/photo-1581084364407-73d8ab5b4971?q=80&w=1200' }
            ],
            mistakes: [
                { icon: '💥', title: 'Bad Branching Logic', desc: 'Mixing a red shirt with whites because the sorting logic was flawed.' },
                { icon: '🗑️', title: 'Unhandled Edge Cases', desc: 'Leaving tissues in a pocket. The algorithm didn\'t account for outliers.' },
                { icon: '📦', title: 'Memory Overflow', desc: 'Overloading the machine beyond its capacity constraints, causing a crash (or bad wash).' }
            ],
            funFact: { icon: '🌊', concept: 'Pipelining', title: 'Wash while you dry!', desc: 'Imagine waiting for Load 1 to wash AND dry before starting Load 2. That is too slow! A true speedrunner puts Load 1 in the dryer and immediately puts Load 2 in the washer. This continuous flow is called Pipelining.' }
        },
        {
            id: 3,
            title: 'Navigating Traffic',
            desc: 'Navigate through traffic using iteration and real-time decisions.',
            image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200',
            tags: [{ label: 'Precision', color: '#34d399' }, { label: 'Iteration', color: '#fb923c' }, { label: 'Loops', color: '#60a5fa' }],
            steps: [
                { id: 1, title: 'Set Destination', desc: 'Input the exact address.', image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1200' },
                { id: 2, title: 'Calculate Route', desc: 'Find the optimal path.', image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200' },
                { id: 3, title: 'Start Driving', desc: 'Follow step-by-step directions.', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1200' },
                { id: 4, title: 'Monitor Traffic', desc: 'Check for delays or accidents.', image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200' },
                { id: 5, title: 'Reroute if Needed', desc: 'Iterate the path based on new data.', image: 'https://images.unsplash.com/photo-1558227092-b43ecf4853eb?q=80&w=1200' },
                { id: 6, title: 'Arrive safely', desc: 'Destination reached.', image: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=1200' }
            ],
            mistakes: [
                { icon: '♾️', title: 'Infinite Loops', desc: 'Circling the block forever because the algorithm lacks an exit condition.' },
                { icon: '🧟', title: 'Stale State Data', desc: 'Following a GPS route into a closed road because the traffic data wasn\'t updated.' },
                { icon: '🛑', title: 'Unhandled Exceptions', desc: 'Getting a flat tire without a spare. The algorithm crashed and had no error-recovery plan.' }
            ],
            funFact: { icon: '🧠', concept: 'Caching', title: 'Remember the main roads!', desc: 'Instead of recalculating your route at every single stop sign, your brain "caches" (remembers) the main highway route. You only recalculate if you hit an unexpected traffic jam!' }
        }
    ];

    const activeData = scenarios.find(s => s.id === activeScenario) || scenarios[0];

    const handleNextStep = () => {
        setCurrentStep(prev => (prev < 6 ? prev + 1 : 1));
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => (prev > 1 ? prev - 1 : 6));
    };

    return (
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
            <header>
                <div className="logo-text">AlgoThink <span>Module 2</span></div>
                <Link href="/dashboard" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>⬅️ Dashboard</Link>
            </header>

            {/* Hero Section */}
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes blink {
                    0%, 96%, 98% { opacity: 1; }
                    97% { opacity: 0; }
                }
            `}</style>
            <div style={{ display: 'flex', gap: '60px', marginTop: '40px', marginBottom: '60px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '56px', fontWeight: '900', marginBottom: '24px', lineHeight: '1.1' }}>
                        Algorithms in<br/>
                        <span style={{ color: '#818cf8' }}>Everyday Life</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.6', marginBottom: '24px' }}>
                        You might think you have never written an algorithm before, but your brain executes thousands of complex algorithms every single day without you even realizing it.
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.6' }}>
                        Explore real-life scenarios and see how the 7 Superpowers of Algorithmic Thinking help solve everyday problems.
                    </p>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px' }}>
                    <div className="bob-display" style={{ transform: 'scale(0.95)', marginTop: '20px', marginBottom: '20px' }}>
                        <div className="bob-character success">
                            <div className="bob-face">
                                <div className="eye left-eye"></div>
                                <div className="eye right-eye"></div>
                                <div className="mouth"></div>
                            </div>
                        </div>
                        <div className="bob-dialogue-box">
                            Algorithms are everywhere! Let's discover them together.
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                        <div style={{ background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(167, 139, 250, 0.3)' }}><span>🔮</span> 3 Scenarios</div>
                        <div style={{ background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(52, 211, 153, 0.3)' }}><span>💡</span> Fun Facts</div>
                    </div>
                </div>
            </div>

            {/* Scenarios Grid */}
            <div style={{ marginBottom: '60px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <span style={{ fontSize: '28px' }}>🚀</span>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Explore Real-Life Scenarios</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: '4px 0 0 0' }}>Click on any scenario to dive in and see the algorithm at work.</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    {scenarios.map(s => (
                        <div 
                            key={s.id} 
                            onClick={() => { 
                                setActiveScenario(s.id); 
                                setCurrentStep(1); 
                                setTimeout(() => {
                                    document.getElementById('detailed-view')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }, 100);
                            }}
                            style={{ 
                                background: 'rgba(255,255,255,0.02)', 
                                border: `2px solid ${activeScenario === s.id ? '#818cf8' : 'rgba(255,255,255,0.1)'}`, 
                                borderRadius: '20px', 
                                overflow: 'hidden', 
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                transform: activeScenario === s.id ? 'translateY(-6px)' : 'none',
                                boxShadow: activeScenario === s.id ? '0 15px 40px rgba(129, 140, 248, 0.15)' : 'none'
                            }}
                        >
                            <div style={{ position: 'relative', height: '180px' }}>
                                <img src={s.image} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '16px', left: '16px', width: '32px', height: '32px', background: activeScenario === s.id ? '#818cf8' : '#334155', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', color: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                                    {s.id}
                                </div>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>{s.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6', minHeight: '44px' }}>{s.desc}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {s.tags.map((tag, idx) => (
                                        <span key={idx} style={{ fontSize: '12px', padding: '6px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: tag.color, border: `1px solid ${tag.color}30` }}>{tag.label}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Scenario Detailed View */}
            <div 
                style={{ 
                    maxHeight: activeScenario ? '3000px' : '0px', 
                    opacity: activeScenario ? 1 : 0, 
                    overflow: 'hidden', 
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginTop: activeScenario ? '40px' : '0'
                }}
            >
                {activeScenario && (
                    <div id="detailed-view" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', background: '#334155', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                            {activeScenario === 1 ? '☕' : activeScenario === 2 ? '🧺' : '🚥'}
                        </div>
                        <div>
                            <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0 }}>Scenario {activeScenario}: {activeData.title}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: '4px 0 0 0' }}>Watch, interact, and understand the algorithm behind this scenario.</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px', marginBottom: '30px' }}>
                    {['🎮 3D Simulation', 'Fun Fact 💡', '🚨 Common Mistakes'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{ 
                                padding: '10px 30px', 
                                background: activeTab === tab ? '#6366f1' : 'transparent',
                                color: activeTab === tab ? 'white' : 'var(--text-muted)',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '15px',
                                fontWeight: activeTab === tab ? 'bold' : 'normal',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content - 3D Simulation */}
                {activeTab === '🎮 3D Simulation' && (
                    <>
                        <div style={{ display: 'flex', gap: '40px', marginBottom: '30px' }}>
                            {/* Left: Image Viewer */}
                            <div style={{ flex: '1.4', position: 'relative', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', minHeight: '450px', background: '#0f172a' }}>
                                {/* Render the image that corresponds to the active step */}
                                <img key={activeData.steps[currentStep-1].image} src={activeData.steps[currentStep-1].image} alt={activeData.steps[currentStep-1].title} style={{ width: '100%', height: '100%', objectFit: 'contain', animation: 'fadeIn 0.5s ease', padding: '20px' }} />
                                
                                <div style={{ position: 'absolute', top: '20px', left: '20px', background: '#6366f1', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                                    Step {currentStep} / 6
                                </div>

                                <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <button onClick={handlePrevStep} style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'transparent', border: '1px solid var(--text-muted)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', transition: 'all 0.2s' }}>←</button>
                                    <div style={{ flex: 1, margin: '0 24px' }}>
                                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '6px' }}>{activeData.steps[currentStep-1].title}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>{activeData.steps[currentStep-1].desc}</p>
                                    </div>
                                    <button onClick={handleNextStep} style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#6366f1', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)' }}>→</button>
                                </div>
                            </div>

                            {/* Right: Steps List */}
                            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {activeData.steps.map((step) => {
                                    const isCompleted = step.id < currentStep;
                                    const isActive = step.id === currentStep;
                                    const isLocked = step.id > currentStep;

                                    return (
                                        <div 
                                            key={step.id} 
                                            onClick={() => setCurrentStep(step.id)}
                                            style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: '20px', 
                                                padding: '20px', 
                                                borderRadius: '16px', 
                                                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                                border: isActive ? '1px solid #6366f1' : '1px solid transparent',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                opacity: isLocked ? 0.5 : 1
                                            }}
                                        >
                                            <div style={{ 
                                                width: '32px', height: '32px', borderRadius: '50%', 
                                                background: isCompleted ? '#22c55e' : isActive ? '#6366f1' : '#334155',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold'
                                            }}>
                                                {isCompleted ? '✓' : step.id}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '16px', fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#e0e7ff' : isCompleted ? '#f8fafc' : 'var(--text-muted)' }}>{step.title}</div>
                                                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{step.desc}</div>
                                            </div>
                                            {isLocked && <span style={{ fontSize: '18px', opacity: 0.5 }}>🔒</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', background: 'rgba(255,255,255,0.02)', padding: '20px 30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <button onClick={() => setAutoPlay(!autoPlay)} style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#334155', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '16px' }}>
                                {autoPlay ? '⏸' : '▶'}
                            </button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '15px', color: 'var(--text-muted)' }}>Auto Play</span>
                                <div onClick={() => setAutoPlay(!autoPlay)} style={{ width: '48px', height: '24px', background: autoPlay ? '#818cf8' : '#334155', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}>
                                    <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: autoPlay ? '26px' : '2px', transition: 'left 0.3s' }}></div>
                                </div>
                            </div>
                            <div style={{ flex: 1, height: '8px', background: '#334155', borderRadius: '4px', position: 'relative' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: '#818cf8', borderRadius: '4px', width: `${(currentStep / 6) * 100}%`, transition: 'width 0.3s' }}></div>
                            </div>
                            <div style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: 'bold' }}>{currentStep} / 6</div>
                        </div>

                    </>
                )}

                {/* Tab Content - Fun Fact */}
                {activeTab === 'Fun Fact 💡' && (
                    <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'center' }}>
                        <div style={{ background: 'linear-gradient(145deg, rgba(234, 179, 8, 0.1), rgba(234, 179, 8, 0.02))', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '24px', padding: '40px', maxWidth: '700px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '120px', opacity: 0.1 }}>{activeData.funFact.icon}</div>
                            
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(234, 179, 8, 0.2)', color: '#fde047', padding: '8px 16px', borderRadius: '30px', fontSize: '14px', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                <span>{activeData.funFact.icon}</span> Fun Fact: {activeData.funFact.concept}
                            </div>
                            
                            <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#fef08a', marginBottom: '16px' }}>{activeData.funFact.title}</h3>
                            <p style={{ color: '#fef9c3', fontSize: '18px', lineHeight: '1.7', margin: 0, opacity: 0.9 }}>
                                {activeData.funFact.desc}
                            </p>
                        </div>
                    </div>
                )}

                {/* Tab Content - Common Mistakes */}
                {activeTab === '🚨 Common Mistakes' && (
                    <div style={{ padding: '20px 0' }}>
                        <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '20px', padding: '30px', marginBottom: '40px' }}>
                            <h3 style={{ color: '#f87171', fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>What happens when the algorithm fails?</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px', margin: 0 }}>Every frustrating mistake you make in real life is usually just a bug in your mental algorithm. Recognizing these bugs helps you optimize your daily life.</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                            {activeData.mistakes.map((mistake, idx) => (
                                <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', transition: 'transform 0.2s', cursor: 'default' }} className="hover-lift">
                                    <div style={{ fontSize: '32px', marginBottom: '16px' }}>{mistake.icon}</div>
                                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#e2e8f0', marginBottom: '12px' }}>{mistake.title}</h4>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{mistake.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <Link href="/course/module-1" className="btn btn-secondary" style={{ width: 'auto', background: 'rgba(255,255,255,0.05)', color: 'white', padding: '12px 30px', border: '1px solid var(--border)' }}>
                ⬅️ Previous: Module 1
            </Link>
            <Link href="/course/module-3" className="btn btn-primary" style={{ width: 'auto', background: '#3b82f6', padding: '12px 30px' }}>
                Proceed to Module 3 ➡️
            </Link>
        </div>
        
        </main>
    );
}
