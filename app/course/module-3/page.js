"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const MISSIONS = [
    { id: 1, title: 'School Festival Manager', difficulty: 'Beginner', time: '10 mins', concepts: ['Decomposition', 'Sequencing'], image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200', locked: false, desc: 'Organize the ultimate school festival. You must plan the resources, sequence the setup, and execute the event flawlessly.' },
    { id: 2, title: 'Smart City Planner', difficulty: 'Intermediate', time: '15 mins', concepts: ['Iteration', 'Decision Making'], image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1200', locked: true, desc: 'Optimize traffic flow and city resources in real-time to prevent gridlock.' },
    { id: 3, title: 'Robot Chef Academy', difficulty: 'Advanced', time: '20 mins', concepts: ['Precision', 'Loops'], image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200', locked: true, desc: 'Program a robotic kitchen line to cook 500 meals without a single precision error.' },
    { id: 4, title: 'Space Colony Survival', difficulty: 'Expert', time: '30 mins', concepts: ['All Pillars'], image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200', locked: true, desc: 'Manage oxygen, power, and food systems. One logical error means total colony failure.' },
    { id: 5, title: 'Theme Park Designer', difficulty: 'Master', time: '45 mins', concepts: ['Systems Thinking'], image: 'https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9?q=80&w=1200', locked: true, desc: 'Design coaster loops, manage crowds, and balance throughput efficiency.' }
];

const PLANNING_ITEMS = [
    { id: 'venue', label: 'Venue Booking', essential: true, icon: '🏟️' },
    { id: 'food', label: 'Food Vendors', essential: true, icon: '🍔' },
    { id: 'vols', label: 'Volunteers', essential: true, icon: '🙋' },
    { id: 'safety', label: 'Security & Safety', essential: true, icon: '🛡️' },
    { id: 'market', label: 'Marketing', essential: true, icon: '📢' },
    { id: 'laser', label: 'Laser Show', essential: false, icon: '✨' },
    { id: 'celeb', label: 'Celebrity Guest', essential: false, icon: '⭐' }
];

const ALGO_BLOCKS = [
    { id: 'book_venue', label: 'Book Venue', icon: '🏟️' },
    { id: 'hire_vols', label: 'Hire Volunteers', icon: '🙋' },
    { id: 'order_food', label: 'Order Food', icon: '🍔' },
    { id: 'marketing', label: 'Launch Marketing', icon: '📢' },
    { id: 'open_gates', label: 'Open Gates', icon: '🎟️' }
];

export default function Module3() {
    const [gameState, setGameState] = useState('HUB'); // HUB, INTRO, PLANNING, BUILDER, SIMULATION, DEBUG, ANALYZER
    const [selectedMission, setSelectedMission] = useState(null);
    
    // Mission State
    const [plan, setPlan] = useState([]);
    const [sequence, setSequence] = useState([]);
    
    // Sim State
    const [simStep, setSimStep] = useState(0);
    const [simLog, setSimLog] = useState([]);
    const [simStatus, setSimStatus] = useState('idle'); // idle, running, failed, success
    const [failReason, setFailReason] = useState(null);

    const startMission = (mission) => {
        setSelectedMission(mission);
        setPlan([]);
        setSequence([]);
        setGameState('INTRO');
    };

    const togglePlanItem = (item) => {
        if (plan.find(p => p.id === item.id)) {
            setPlan(plan.filter(p => p.id !== item.id));
        } else {
            setPlan([...plan, item]);
        }
    };

    const toggleSequenceItem = (block) => {
        if (sequence.find(s => s.id === block.id)) {
            setSequence(sequence.filter(s => s.id !== block.id));
        } else {
            setSequence([...sequence, block]);
        }
    };

    // --- Simulation Logic ---
    useEffect(() => {
        if (gameState === 'SIMULATION' && simStatus === 'running') {
            if (simStep < sequence.length) {
                const timer = setTimeout(() => {
                    const currentAction = sequence[simStep].id;
                    let error = null;
                    
                    // LOGIC CHECKS
                    if (currentAction !== 'book_venue' && !sequence.slice(0, simStep).find(s => s.id === 'book_venue')) {
                        error = { title: "Missing Sequencing", desc: `You tried to execute '${sequence[simStep].label}' without a venue! You must book a venue before taking other actions.` };
                    }
                    else if (currentAction === 'open_gates' && simStep < 4) {
                        error = { title: "Premature Execution", desc: `You opened the gates before everything was ready! Total chaos ensued as the crowd rushed in with no food or volunteers.` };
                    }
                    else if (currentAction === 'marketing' && !sequence.slice(0, simStep).find(s => s.id === 'book_venue')) {
                        error = { title: "Missing Decision Logic", desc: `You launched marketing but couldn't tell anyone WHERE the event is because you haven't booked a venue yet!` };
                    }
                    
                    if (error) {
                        setFailReason(error);
                        setSimStatus('failed');
                        setSimLog(prev => [...prev, { status: 'error', text: `❌ CRITICAL ERROR: ${sequence[simStep].label} failed.`}]);
                    } else {
                        setSimLog(prev => [...prev, { status: 'success', text: `✅ SUCCESS: ${sequence[simStep].label} completed seamlessly.`}]);
                        setSimStep(s => s + 1);
                    }
                }, 1500);
                return () => clearTimeout(timer);
            } else {
                // Final check for Decomposition
                const missingEssentials = PLANNING_ITEMS.filter(item => item.essential && !plan.find(p => p.id === item.id));
                const hasNonEssentials = plan.filter(p => !p.essential).length > 0;
                
                const timer = setTimeout(() => {
                    if (missingEssentials.length > 0) {
                         setFailReason({ title: "Poor Decomposition", desc: `The event ran, but ultimately failed because your initial plan was missing core components: ${missingEssentials.map(e => e.label).join(', ')}.` });
                         setSimStatus('failed');
                    } else if (hasNonEssentials) {
                         setFailReason({ title: "Resource Inefficiency", desc: `You succeeded, but you wasted budget on non-essential items like Laser Shows or Celebrities. Algorithmic thinking requires prioritizing essential components first.` });
                         setSimStatus('failed');
                    } else {
                         setSimStatus('success');
                    }
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [gameState, simStatus, simStep, sequence, plan]);

    // --- Renderers ---
    const renderHub = () => (
        <div style={{ padding: '40px', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: 'bold', background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>MISSION HUB</h1>
                <p style={{ color: '#94a3b8', fontSize: '18px' }}>Select a scenario to test your algorithmic thinking in the field.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
                {MISSIONS.map(mission => (
                    <div 
                        key={mission.id}
                        onClick={() => !mission.locked && startMission(mission)}
                        style={{ 
                            background: 'rgba(255,255,255,0.03)', 
                            borderRadius: '20px', 
                            overflow: 'hidden', 
                            border: `1px solid ${mission.locked ? 'rgba(255,255,255,0.05)' : 'rgba(99, 102, 241, 0.4)'}`,
                            cursor: mission.locked ? 'not-allowed' : 'pointer',
                            opacity: mission.locked ? 0.6 : 1,
                            transition: 'all 0.3s',
                            boxShadow: mission.locked ? 'none' : '0 10px 30px rgba(0,0,0,0.5)',
                            transform: 'translateY(0)'
                        }}
                        onMouseEnter={(e) => { if(!mission.locked) { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.borderColor = '#8b5cf6'; } }}
                        onMouseLeave={(e) => { if(!mission.locked) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'; } }}
                    >
                        <div style={{ height: '160px', position: 'relative' }}>
                            <img src={mission.image} alt={mission.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            {mission.locked && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>🔒</div>}
                        </div>
                        <div style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span style={{ background: mission.locked ? '#334155' : '#6366f1', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>{mission.difficulty}</span>
                                <span style={{ color: '#94a3b8', fontSize: '14px' }}>⏱️ {mission.time}</span>
                            </div>
                            <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '10px' }}>{mission.title}</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {mission.concepts.map(c => <span key={c} style={{ fontSize: '12px', color: '#94a3b8', border: '1px solid #334155', padding: '4px 8px', borderRadius: '4px' }}>{c}</span>)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderIntro = () => (
        <div style={{ padding: '80px 40px', textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <h2 style={{ color: '#6366f1', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '10px' }}>MISSION 01</h2>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '24px' }}>{selectedMission.title}</h1>
            <p style={{ fontSize: '20px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.6' }}>{selectedMission.desc}</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button onClick={() => setGameState('HUB')} style={{ padding: '16px 32px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '12px', cursor: 'pointer', fontSize: '16px' }}>Cancel Mission</button>
                <button onClick={() => setGameState('PLANNING')} style={{ padding: '16px 40px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)' }}>Initiate Planning Phase 🚀</button>
            </div>
        </div>
    );

    const renderPlanning = () => (
        <div style={{ padding: '40px', animation: 'fadeIn 0.5s ease', display: 'flex', flexDirection: 'column', minHeight: '60vh' }}>
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>Phase 1: Decomposition</h2>
                <p style={{ color: '#94a3b8' }}>Analyze the mission and select ONLY the essential components required for success. Avoid unnecessary bloat.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '40px', flex: 1 }}>
                <div style={{ flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ marginBottom: '20px', color: '#94a3b8' }}>Available Resources</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {PLANNING_ITEMS.map(item => {
                            const isSelected = plan.find(p => p.id === item.id);
                            return (
                                <div 
                                    key={item.id}
                                    onClick={() => togglePlanItem(item)}
                                    style={{ 
                                        padding: '12px 20px', 
                                        background: isSelected ? '#3b82f6' : '#1e293b',
                                        border: `1px solid ${isSelected ? '#60a5fa' : '#334155'}`,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        opacity: isSelected ? 0.5 : 1
                                    }}
                                >
                                    <span>{item.icon}</span> {item.label}
                                </div>
                            )
                        })}
                    </div>
                </div>
                
                <div style={{ flex: 1, background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', padding: '24px', border: '1px dashed #3b82f6' }}>
                    <h3 style={{ marginBottom: '20px', color: '#60a5fa' }}>Your Core Plan ({plan.length} selected)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {plan.length === 0 && <div style={{ color: '#94a3b8', fontStyle: 'italic', padding: '20px', textAlign: 'center' }}>Click resources to add them to your plan.</div>}
                        {plan.map(item => (
                            <div key={item.id} onClick={() => togglePlanItem(item)} style={{ padding: '16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                <span>{item.icon}</span> <strong>{item.label}</strong>
                                <span style={{ marginLeft: 'auto', color: '#ef4444' }}>✕</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                    onClick={() => setGameState('BUILDER')} 
                    disabled={plan.length === 0}
                    style={{ padding: '16px 40px', background: plan.length > 0 ? '#10b981' : '#334155', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: plan.length > 0 ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
                >
                    Proceed to Sequencing ➡️
                </button>
            </div>
        </div>
    );

    const renderBuilder = () => (
        <div style={{ padding: '40px', animation: 'fadeIn 0.5s ease', display: 'flex', flexDirection: 'column', minHeight: '60vh' }}>
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>Phase 2: Sequencing</h2>
                <p style={{ color: '#94a3b8' }}>Construct the execution pipeline. The order of operations is critical. Click blocks to add them to your pipeline.</p>
            </div>
            
            <div style={{ display: 'flex', gap: '40px', flex: 1 }}>
                <div style={{ flex: '1', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <h3 style={{ marginBottom: '20px', color: '#94a3b8' }}>Action Blocks</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {ALGO_BLOCKS.map(block => {
                            const isUsed = sequence.find(s => s.id === block.id);
                            return (
                                <div 
                                    key={block.id}
                                    onClick={() => toggleSequenceItem(block)}
                                    style={{ 
                                        padding: '16px', 
                                        background: isUsed ? '#334155' : '#1e293b',
                                        border: `1px solid ${isUsed ? '#0f172a' : '#475569'}`,
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        opacity: isUsed ? 0.3 : 1
                                    }}
                                >
                                    <span style={{ fontSize: '20px' }}>{block.icon}</span>
                                    <span style={{ fontWeight: 'bold' }}>{block.label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                
                <div style={{ flex: '2', background: '#0f172a', borderRadius: '16px', padding: '24px', border: '1px solid #334155', position: 'relative' }}>
                    <h3 style={{ marginBottom: '30px', color: '#e2e8f0', textAlign: 'center' }}>Execution Pipeline</h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>START</div>
                        
                        {sequence.map((block, i) => (
                            <React.Fragment key={block.id}>
                                <div style={{ color: '#10b981', fontSize: '24px' }}>→</div>
                                <div onClick={() => toggleSequenceItem(block)} style={{ padding: '16px 20px', background: '#059669', borderRadius: '8px', border: '1px solid #34d399', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)' }}>
                                    <span>{block.icon}</span> <strong>{block.label}</strong>
                                </div>
                            </React.Fragment>
                        ))}
                        
                        {sequence.length < ALGO_BLOCKS.length && (
                            <React.Fragment>
                                <div style={{ color: '#475569', fontSize: '24px' }}>→</div>
                                <div style={{ padding: '16px 40px', background: 'transparent', border: '2px dashed #475569', borderRadius: '8px', color: '#94a3b8' }}>Empty Slot</div>
                            </React.Fragment>
                        )}
                        
                        <div style={{ color: '#475569', fontSize: '24px' }}>→</div>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>END</div>
                    </div>
                </div>
            </div>
            
            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                    onClick={() => { setGameState('SIMULATION'); setSimStatus('running'); setSimStep(0); setSimLog([]); setFailReason(null); }} 
                    disabled={sequence.length !== ALGO_BLOCKS.length}
                    style={{ padding: '16px 40px', background: sequence.length === ALGO_BLOCKS.length ? '#f59e0b' : '#334155', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: sequence.length === ALGO_BLOCKS.length ? 'pointer' : 'not-allowed', transition: 'all 0.2s', boxShadow: sequence.length === ALGO_BLOCKS.length ? '0 4px 20px rgba(245, 158, 11, 0.4)' : 'none' }}
                >
                    ▶️ Run Simulation
                </button>
            </div>
        </div>
    );

    const renderSimulation = () => {
        const successfulSteps = sequence.slice(0, simStep).map(s => s.id);
        const hasVenue = successfulSteps.includes('book_venue');
        const hasVols = successfulSteps.includes('hire_vols');
        const hasFood = successfulSteps.includes('order_food');
        const hasMarketing = successfulSteps.includes('marketing');
        const hasGates = successfulSteps.includes('open_gates');

        return (
        <div style={{ width: '100%', height: '70vh', position: 'relative', overflow: 'hidden', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', animation: 'fadeIn 0.5s ease', background: '#87CEEB', border: '1px solid rgba(255,255,255,0.1)' }}>
            <style>{`
                @keyframes cloudMove { 0% { transform: translateX(-100px); } 100% { transform: translateX(1200px); } }
                @keyframes walkIn { 0% { transform: translateX(-200px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
                @keyframes walkInRight { 0% { transform: translateX(300px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
                @keyframes dropIn { 0% { transform: translateY(-300px) scale(0.5); opacity: 0; } 60% { transform: translateY(20px) scale(1.1); opacity: 1; } 100% { transform: translateY(0) scale(1); opacity: 1; } }
                @keyframes popUp { 0% { transform: scale(0); opacity: 0; } 80% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
                @keyframes shakeScreen { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); } 20%, 40%, 60%, 80% { transform: translateX(10px); } }
                @keyframes floatSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                .game-prop { position: absolute; bottom: 30%; font-size: 100px; filter: drop-shadow(0 15px 15px rgba(0,0,0,0.4)); z-index: 10; }
            `}</style>
            
            {/* Background SVG Layer */}
            <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                <defs>
                    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#bae6fd" />
                    </linearGradient>
                    <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor="#166534" />
                    </linearGradient>
                </defs>
                <rect x="0" y="0" width="100%" height="65%" fill="url(#sky)" />
                <rect x="0" y="65%" width="100%" height="35%" fill="url(#grass)" />
                
                {/* Sun */}
                <circle cx="85%" cy="20%" r="6%" fill="#fef08a" style={{ filter: 'drop-shadow(0 0 30px #fef08a)' }} />
                
                {/* Mountains / Hills */}
                <path d="M 0 65% Q 20% 40% 50% 65% T 100% 65% L 100% 100% L 0 100% Z" fill="#22c55e" opacity="0.6" />
                <path d="M -10% 65% Q 30% 30% 60% 65% T 110% 65% L 110% 100% L -10% 100% Z" fill="#15803d" opacity="0.4" />
                
                {/* Clouds */}
                <g fill="rgba(255,255,255,0.9)" style={{ animation: 'cloudMove 40s linear infinite' }}>
                    <circle cx="10%" cy="30%" r="4%" />
                    <circle cx="15%" cy="25%" r="5%" />
                    <circle cx="20%" cy="30%" r="4%" />
                </g>
                <g fill="rgba(255,255,255,0.7)" style={{ animation: 'cloudMove 60s linear infinite reverse', transformOrigin: 'center' }}>
                    <circle cx="70%" cy="20%" r="3%" />
                    <circle cx="75%" cy="15%" r="4%" />
                    <circle cx="80%" cy="20%" r="3%" />
                </g>
            </svg>
            
            {/* Screen Shake Wrapper for errors */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 5, animation: simStatus === 'failed' ? 'shakeScreen 0.5s ease' : 'none' }}>
                
                {/* Student Character */}
                <div style={{ position: 'absolute', left: '10%', bottom: '25%', width: '150px', zIndex: 20, animation: 'walkIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards', filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.5))' }}>
                    <div style={{ animation: 'floatSlow 3s ease-in-out infinite' }}>
                        <svg viewBox="0 0 200 300" width="100%" height="100%">
                            {/* shadow */}
                            <ellipse cx="100" cy="290" rx="50" ry="10" fill="rgba(0,0,0,0.3)" />
                            {/* legs */}
                            <rect x="70" y="200" width="20" height="80" rx="10" fill="#1e293b" />
                            <rect x="110" y="200" width="20" height="80" rx="10" fill="#1e293b" />
                            {/* shoes */}
                            <path d="M 50 280 L 90 280 L 90 260 Q 50 260 50 280 Z" fill="#475569" />
                            <path d="M 90 280 L 130 280 L 130 260 Q 90 260 90 280 Z" fill="#475569" />
                            {/* body */}
                            <rect x="50" y="100" width="100" height="120" rx="30" fill="#3b82f6" />
                            {/* backpack */}
                            <rect x="20" y="110" width="40" height="90" rx="15" fill="#ef4444" />
                            {/* neck */}
                            <rect x="90" y="80" width="20" height="30" fill="#fcd34d" />
                            {/* head */}
                            <circle cx="100" cy="60" r="45" fill="#fcd34d" />
                            {/* hair */}
                            <path d="M 55 60 Q 100 0 145 60 Q 100 20 55 60 Z" fill="#1e293b" />
                            <path d="M 50 50 Q 70 20 100 20 Q 130 20 150 50 Q 100 -20 50 50 Z" fill="#1e293b" />
                            {/* face */}
                            <circle cx="85" cy="55" r="5" fill="#0f172a" />
                            <circle cx="115" cy="55" r="5" fill="#0f172a" />
                            <path d="M 90 70 Q 100 80 110 70" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
                            {/* glasses */}
                            <rect x="70" y="45" width="25" height="15" rx="4" fill="none" stroke="#334155" strokeWidth="3" />
                            <rect x="105" y="45" width="25" height="15" rx="4" fill="none" stroke="#334155" strokeWidth="3" />
                            <line x1="95" y1="52" x2="105" y2="52" stroke="#334155" strokeWidth="3" />
                            {/* arms */}
                            <rect x="130" y="120" width="25" height="80" rx="12" fill="#2563eb" transform="rotate(-15 130 120)" />
                        </svg>
                    </div>
                </div>

                {/* Animated Game Props */}
                {hasVenue && (
                    <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '30%', width: '400px', zIndex: 8, animation: 'dropIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                        <svg viewBox="0 0 200 150" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.5))' }}>
                            <rect x="30" y="60" width="140" height="80" fill="#f8fafc" />
                            <rect x="50" y="60" width="20" height="80" fill="#ef4444" />
                            <rect x="90" y="60" width="20" height="80" fill="#ef4444" />
                            <rect x="130" y="60" width="20" height="80" fill="#ef4444" />
                            <path d="M 10 60 L 100 10 L 190 60 Z" fill="#ef4444" />
                            <path d="M 40 60 L 100 10 L 160 60 Z" fill="#f8fafc" />
                            <line x1="100" y1="10" x2="100" y2="-20" stroke="#94a3b8" strokeWidth="4" />
                            <polygon points="100,-20 130,-10 100,0" fill="#eab308" />
                            <path d="M 80 140 L 80 90 Q 100 80 120 90 L 120 140 Z" fill="#0f172a" />
                        </svg>
                    </div>
                )}
                
                {hasFood && <div className="game-prop" style={{ right: '25%', animation: 'walkInRight 1s ease-out' }}>🚚🍔</div>}
                {hasVols && <div className="game-prop" style={{ left: '25%', animation: 'popUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>🙋‍♂️🙋‍♀️</div>}
                {hasMarketing && <div className="game-prop" style={{ top: '15%', left: '50%', transform: 'translateX(-50%)', bottom: 'auto', fontSize: '120px', animation: 'popUp 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>✨📢✨</div>}
                {hasGates && <div className="game-prop" style={{ right: '5%', bottom: '25%', animation: 'walkInRight 1.5s ease-out', fontSize: '130px' }}>🏃‍♂️🏃‍♀️🚶‍♂️</div>}

                {/* Overlays for Success/Fail states */}
                {simStatus === 'failed' && <div style={{ position: 'absolute', inset: 0, background: 'rgba(239, 68, 68, 0.4)', zIndex: 15 }}></div>}
                {simStatus === 'success' && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(16, 185, 129, 0.2)', zIndex: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ fontSize: '150px', animation: 'popUp 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)', filter: 'drop-shadow(0 0 50px rgba(253, 224, 71, 0.8))' }}>🏆</div>
                    </div>
                )}
            </div>

            {/* Visual Novel UI Dialogue Box */}
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '900px', background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(20px)', border: '2px solid rgba(255,255,255,0.1)', borderTop: '2px solid #6366f1', borderRadius: '20px', padding: '24px', zIndex: 30, boxShadow: '0 20px 50px rgba(0,0,0,0.6)', display: 'flex', gap: '24px', alignItems: 'center', animation: 'fadeInUp 0.5s ease 0.5s both' }}>
                
                {/* Character Portrait */}
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#6366f1', border: '4px solid white', overflow: 'hidden', flexShrink: 0, boxShadow: '0 10px 20px rgba(0,0,0,0.4)' }}>
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="80" r="40" fill="#3b82f6" />
                        <circle cx="50" cy="40" r="25" fill="#fcd34d" />
                        <path d="M 35 40 Q 50 20 65 40 Q 50 25 35 40 Z" fill="#1e293b" />
                        <circle cx="42" cy="35" r="3" fill="#0f172a" />
                        <circle cx="58" cy="35" r="3" fill="#0f172a" />
                        <path d={simStatus === 'failed' ? "M 40 48 Q 50 40 60 48" : "M 42 45 Q 50 52 58 45"} fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
                        <rect x="35" y="30" width="12" height="8" rx="2" fill="none" stroke="#334155" strokeWidth="2" />
                        <rect x="53" y="30" width="12" height="8" rx="2" fill="none" stroke="#334155" strokeWidth="2" />
                        <line x1="47" y1="34" x2="53" y2="34" stroke="#334155" strokeWidth="2" />
                    </svg>
                </div>
                
                {/* Text Content */}
                <div style={{ flex: 1 }}>
                    <div style={{ color: simStatus === 'failed' ? '#ef4444' : simStatus === 'success' ? '#10b981' : '#60a5fa', fontWeight: '900', fontSize: '18px', letterSpacing: '1px', marginBottom: '8px', textTransform: 'uppercase' }}>
                        {simStatus === 'failed' ? 'SYSTEM CRASH' : simStatus === 'success' ? 'MISSION ACCOMPLISHED' : 'ALGORITHM EXECUTING...'}
                    </div>
                    
                    {simStatus === 'running' && simStep < sequence.length ? (
                        <>
                            {simLog.length > 0 && <div style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '8px' }}>Previous: {simLog[simLog.length - 1].text}</div>}
                            <div style={{ color: 'white', fontSize: '20px', lineHeight: '1.5', fontWeight: 'bold' }}>
                                <span className="spinner" style={{ marginRight: '10px' }}>⚙️</span>
                                <span style={{ animation: 'pulse 1.5s infinite' }}>Executing Action: {sequence[simStep].label}...</span>
                            </div>
                        </>
                    ) : (
                        <div style={{ color: 'white', fontSize: '20px', lineHeight: '1.5', fontWeight: '500' }}>
                            {simLog.length > 0 ? simLog[simLog.length - 1].text : "Simulation Finished."}
                        </div>
                    )}
                </div>
                
                {/* Action Buttons based on status */}
                {simStatus === 'failed' && (
                    <button onClick={() => setGameState('DEBUG')} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', width: 'auto', padding: '16px 32px', fontSize: '18px', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.4)' }}>Fix Algorithm 🛠️</button>
                )}
                {simStatus === 'success' && (
                    <button onClick={() => setGameState('ANALYZER')} className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', width: 'auto', padding: '16px 32px', fontSize: '18px', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.4)' }}>View Results 📊</button>
                )}
            </div>
            
            {/* Top right progress bar */}
            {simStatus === 'running' && (
                <div style={{ position: 'absolute', top: '30px', right: '30px', background: 'rgba(15, 23, 42, 0.8)', padding: '12px 24px', borderRadius: '30px', color: 'white', fontWeight: 'bold', zIndex: 30, display: 'flex', alignItems: 'center', gap: '12px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <span className="spinner">⚙️</span> Step {Math.min(simStep + 1, sequence.length)} / {sequence.length}
                </div>
            )}
        </div>
        );
    }

    const renderDebug = () => (
        <div style={{ padding: '60px 40px', animation: 'fadeIn 0.5s ease', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 20px', border: '2px solid #ef4444' }}>⚠️</div>
                <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#ef4444', marginBottom: '10px' }}>Debug Analysis</h2>
                <p style={{ color: '#94a3b8', fontSize: '18px' }}>Your algorithm encountered a critical logic exception.</p>
            </div>
            
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '30px', marginBottom: '40px' }}>
                <h3 style={{ color: '#fca5a5', fontSize: '24px', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>Exception: {failReason?.title}</h3>
                <p style={{ fontSize: '18px', lineHeight: '1.6' }}>{failReason?.desc}</p>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button onClick={() => setGameState('PLANNING')} style={{ padding: '16px 32px', background: 'transparent', border: '1px solid #334155', color: 'white', borderRadius: '12px', cursor: 'pointer', fontSize: '16px' }}>⬅️ Back to Planning</button>
                <button onClick={() => setGameState('BUILDER')} style={{ padding: '16px 40px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)' }}>Refactor Algorithm ⚙️</button>
            </div>
        </div>
    );

    const renderAnalyzer = () => (
        <div style={{ padding: '60px 40px', animation: 'fadeIn 0.5s ease', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏆</div>
                <h2 style={{ fontSize: '42px', fontWeight: 'bold', background: 'linear-gradient(90deg, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>Algorithmic Assessment</h2>
                <p style={{ color: '#94a3b8', fontSize: '18px' }}>You successfully orchestrated the system without critical failures.</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '50px' }}>
                <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <strong style={{ fontSize: '18px', color: '#60a5fa' }}>Decomposition</strong>
                        <strong style={{ color: '#10b981' }}>100%</strong>
                    </div>
                    <div style={{ height: '8px', background: '#0f172a', borderRadius: '4px', overflow: 'hidden', marginBottom: '15px' }}>
                        <div style={{ height: '100%', background: '#60a5fa', width: '100%' }}></div>
                    </div>
                    <p style={{ fontSize: '14px', color: '#94a3b8' }}>Perfectly isolated essential components without bloat.</p>
                </div>
                
                <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <strong style={{ fontSize: '18px', color: '#f472b6' }}>Sequencing</strong>
                        <strong style={{ color: '#10b981' }}>100%</strong>
                    </div>
                    <div style={{ height: '8px', background: '#0f172a', borderRadius: '4px', overflow: 'hidden', marginBottom: '15px' }}>
                        <div style={{ height: '100%', background: '#f472b6', width: '100%' }}></div>
                    </div>
                    <p style={{ fontSize: '14px', color: '#94a3b8' }}>Flawless logical ordering of dependent events.</p>
                </div>
                
                <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <strong style={{ fontSize: '18px', color: '#fbbf24' }}>Resource Efficiency</strong>
                        <strong style={{ color: plan.length === 5 ? '#10b981' : '#fbbf24' }}>{plan.length === 5 ? '100%' : '75%'}</strong>
                    </div>
                    <div style={{ height: '8px', background: '#0f172a', borderRadius: '4px', overflow: 'hidden', marginBottom: '15px' }}>
                        <div style={{ height: '100%', background: '#fbbf24', width: plan.length === 5 ? '100%' : '75%' }}></div>
                    </div>
                    <p style={{ fontSize: '14px', color: '#94a3b8' }}>{plan.length === 5 ? 'Zero wasted resources.' : 'Minor budget drain on non-essentials.'}</p>
                </div>
                
                <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏅</div>
                        <strong style={{ color: '#e2e8f0' }}>Master Planner Badge Unlocked</strong>
                    </div>
                </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
                <button onClick={() => setGameState('HUB')} style={{ padding: '16px 40px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)' }}>Return to Mission Hub</button>
            </div>
        </div>
    );

    return (
        <main className="container">
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideInRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
                .spinner { display: inline-block; animation: spin 2s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}} />
            
            <header>
                <div className="logo-text">AlgoThink <span>Module 3</span></div>
                <Link href="/dashboard" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>⬅️ Dashboard</Link>
            </header>

            <div className="panel" style={{ minHeight: '70vh', padding: 0, overflow: 'hidden', position: 'relative' }}>
                {gameState === 'HUB' && renderHub()}
                {gameState === 'INTRO' && renderIntro()}
                {gameState === 'PLANNING' && renderPlanning()}
                {gameState === 'BUILDER' && renderBuilder()}
                {gameState === 'SIMULATION' && renderSimulation()}
                {gameState === 'DEBUG' && renderDebug()}
                {gameState === 'ANALYZER' && renderAnalyzer()}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <Link href="/course/module-2" className="btn btn-secondary" style={{ width: 'auto', background: 'rgba(255,255,255,0.05)', color: 'white', padding: '12px 30px', border: '1px solid var(--border)' }}>
                    ⬅️ Previous: Module 2
                </Link>
                <Link href="/course/module-4" className="btn btn-primary" style={{ width: 'auto', background: '#3b82f6', padding: '12px 30px' }}>
                    Proceed to Module 4 ➡️
                </Link>
            </div>
        </main>
    );
}
