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
        const currentAction = simStatus === 'running' && simStep < sequence.length 
            ? sequence[simStep].id 
            : (simStatus === 'success' ? 'success' : (simStatus === 'failed' ? 'failed' : 'start'));

        const getSceneImage = () => {
            switch(currentAction) {
                case 'book_venue': return '/assets/storybook/prop_tent.png';
                case 'order_food': return '/assets/storybook/prop_truck.png';
                case 'hire_vols': return '/assets/storybook/prop_vols.png';
                case 'open_gates': return '/assets/storybook/prop_crowd.png';
                case 'marketing': return '/assets/storybook/char_student.png';
                case 'start': return '/assets/storybook/bg_park.png';
                case 'success': return '/assets/storybook/char_student.png';
                case 'failed': return '/assets/storybook/char_student.png';
                default: return '/assets/storybook/char_student.png';
            }
        };

        const getSceneTitle = () => {
            switch(currentAction) {
                case 'book_venue': return 'Booking the Main Venue...';
                case 'order_food': return 'Ordering Food Trucks...';
                case 'hire_vols': return 'Hiring Volunteers...';
                case 'open_gates': return 'Opening the Gates...';
                case 'marketing': return 'Launching Marketing Campaign...';
                case 'start': return 'Initializing Festival Protocol...';
                case 'success': return 'Festival is a Massive Success!';
                case 'failed': return 'System Crash Detected!';
                default: return 'Processing...';
            }
        };

        return (
        <div style={{ width: '100%', height: '75vh', background: '#0f172a', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', animation: 'fadeIn 0.5s ease' }}>
            
            {/* Top Header Bar */}
            <div style={{ height: '80px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', background: 'rgba(0,0,0,0.2)', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '15px', height: '15px', borderRadius: '50%', background: simStatus === 'running' ? '#ef4444' : (simStatus === 'success' ? '#10b981' : '#f59e0b'), animation: simStatus === 'running' ? 'pulse 1s infinite' : 'none' }}></div>
                    <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>
                        {simStatus === 'running' ? `Recording Step ${Math.min(simStep + 1, sequence.length)} of ${sequence.length}` : (simStatus === 'success' ? 'Simulation Complete' : 'Simulation Failed')}
                    </span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '18px', fontWeight: '500' }}>
                    Algorithm Visualizer v2.0
                </div>
            </div>

            {/* Main Content Area: Split 50/50 */}
            <div style={{ flex: 1, display: 'flex', padding: '40px', gap: '40px', background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)', minHeight: 0 }}>
                
                {/* Left Side: The Visual Scene Frame */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px', aspectRatio: '1/1', background: 'white', borderRadius: '32px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', transition: 'all 0.3s ease', transform: simStatus === 'failed' ? 'rotate(-2deg)' : 'rotate(0)' }}>
                        <img 
                            key={currentAction} 
                            src={getSceneImage()} 
                            alt="Scene" 
                            style={{ width: '100%', height: '100%', objectFit: 'contain', animation: 'fadeIn 0.5s ease', filter: simStatus === 'failed' ? 'grayscale(100%) sepia(50%) hue-rotate(-50deg) saturate(300%)' : 'none' }} 
                        />
                        {/* Status Icon Overlay */}
                        {simStatus === 'success' && <div style={{ position: 'absolute', top: '-30px', right: '-30px', fontSize: '80px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))', animation: 'popBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>🏆</div>}
                        {simStatus === 'failed' && <div style={{ position: 'absolute', top: '-30px', right: '-30px', fontSize: '80px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))', animation: 'popBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>❌</div>}
                    </div>
                    <h2 style={{ color: 'white', fontSize: '32px', fontWeight: '800', marginTop: '40px', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {getSceneTitle()}
                    </h2>
                </div>

                {/* Right Side: Structured Execution Log */}
                <div style={{ width: '450px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '32px', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>
                    
                    {/* Log Header */}
                    <div style={{ padding: '24px 30px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                        <h3 style={{ margin: 0, color: '#818cf8', fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Execution Log</h3>
                    </div>

                    {/* Log Entries */}
                    <div style={{ flex: 1, padding: '30px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {simLog.map((log, index) => (
                            <div key={index} style={{ padding: '16px 20px', background: log.isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', borderLeft: `4px solid ${log.isError ? '#ef4444' : '#10b981'}`, borderRadius: '0 12px 12px 0', color: 'white', fontSize: '18px', animation: 'slideInRight 0.3s ease' }}>
                                <div style={{ fontWeight: 'bold', color: log.isError ? '#fca5a5' : '#6ee7b7', marginBottom: '4px' }}>{log.isError ? 'ERROR' : 'SUCCESS'}</div>
                                <div>{log.text}</div>
                            </div>
                        ))}
                        {simStatus === 'running' && (
                            <div style={{ padding: '16px 20px', background: 'rgba(99, 102, 241, 0.1)', borderLeft: '4px solid #6366f1', borderRadius: '0 12px 12px 0', color: 'white', fontSize: '18px', animation: 'pulse 1.5s infinite' }}>
                                <div style={{ fontWeight: 'bold', color: '#818cf8', marginBottom: '4px' }}>EXECUTING</div>
                                <div>{sequence[simStep]?.label}...</div>
                            </div>
                        )}
                        {simLog.length === 0 && simStatus !== 'running' && (
                            <div style={{ color: '#94a3b8', fontSize: '16px', textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>Waiting for execution to begin...</div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div style={{ padding: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center' }}>
                        {simStatus === 'running' && (
                            <div style={{ color: '#94a3b8', fontSize: '18px', fontStyle: 'italic' }}>Please wait for execution...</div>
                        )}
                        {simStatus === 'failed' && (
                            <button onClick={() => setGameState('DEBUG')} style={{ width: '100%', padding: '20px', background: '#ef4444', color: 'white', fontSize: '22px', fontWeight: 'bold', borderRadius: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.3)' }}>
                                FIX ALGORITHM 🛠️
                            </button>
                        )}
                        {simStatus === 'success' && (
                            <button onClick={() => setGameState('ANALYZER')} style={{ width: '100%', padding: '20px', background: '#10b981', color: 'white', fontSize: '22px', fontWeight: 'bold', borderRadius: '16px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)' }}>
                                VIEW RESULTS 📊
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
        );
    };(simStep + 1, sequence.length)} OF {sequence.length}
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
