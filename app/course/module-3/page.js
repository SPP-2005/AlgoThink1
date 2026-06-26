"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// ── Festival Planner Data ──────────────────────────────────────────────
const RESOURCES = [
    { id: 'venue',  label: 'Venue Booking',     icon: '🏟️', essential: true,  desc: 'Reserve a location for the event.' },
    { id: 'food',   label: 'Food Vendors',      icon: '🍔', essential: true,  desc: 'Arrange food stalls and catering.' },
    { id: 'vols',   label: 'Volunteers',         icon: '🙋', essential: true,  desc: 'Recruit helpers for crowd control.' },
    { id: 'safety', label: 'Security & Safety',  icon: '🛡️', essential: true,  desc: 'Hire safety officers and first aid.' },
    { id: 'market', label: 'Marketing',          icon: '📢', essential: true,  desc: 'Advertise the event to the public.' },
    { id: 'laser',  label: 'Laser Show',         icon: '✨', essential: false, desc: 'Optional entertainment upgrade.' },
    { id: 'celeb',  label: 'Celebrity Guest',    icon: '⭐', essential: false, desc: 'Optional — expensive and risky.' },
];

const ALGO_STEPS = [
    { id: 'book_venue',  label: 'Book Venue',        icon: '🏟️', emoji: '⛺' },
    { id: 'hire_vols',   label: 'Hire Volunteers',    icon: '🙋', emoji: '🤝' },
    { id: 'order_food',  label: 'Order Food',         icon: '🍔', emoji: '🚚' },
    { id: 'marketing',   label: 'Launch Marketing',   icon: '📢', emoji: '📣' },
    { id: 'open_gates',  label: 'Open Gates',         icon: '🎟️', emoji: '🎪' },
];

const SCENE_DATA = {
    idle:       { bg: '#1e293b', title: 'Ready to Execute',         emoji: '🎯', color: '#818cf8', subtitle: 'Press "Run Simulation" to watch your algorithm execute step by step.' },
    book_venue: { bg: '#312e81', title: 'Booking the Venue...',     emoji: '⛺', color: '#a5b4fc', subtitle: 'Reserving the festival grounds. Contracts signed!' },
    hire_vols:  { bg: '#1e3a5f', title: 'Hiring Volunteers...',     emoji: '🤝', color: '#93c5fd', subtitle: 'Recruiting helpers, assigning roles, distributing walkie-talkies.' },
    order_food: { bg: '#3b1f0b', title: 'Ordering Food Trucks...',  emoji: '🚚', color: '#fdba74', subtitle: 'Pizza, burgers, ice cream — the trucks are rolling in!' },
    marketing:  { bg: '#3b0764', title: 'Launching Marketing...',   emoji: '📣', color: '#d8b4fe', subtitle: 'Social media, posters, radio ads — spreading the word!' },
    open_gates: { bg: '#064e3b', title: 'Opening the Gates!',      emoji: '🎪', color: '#6ee7b7', subtitle: 'The crowd rushes in! Music plays, lights flash!' },
    success:    { bg: '#14532d', title: 'Festival is a SUCCESS!',   emoji: '🏆', color: '#4ade80', subtitle: 'Your algorithm executed flawlessly. You are a master planner!' },
    failed:     { bg: '#7f1d1d', title: 'SYSTEM CRASH!',            emoji: '💥', color: '#fca5a5', subtitle: '' },
};

export default function Module3() {
    const [phase, setPhase] = useState('LEARN');
    // Planning
    const [selectedResources, setSelectedResources] = useState([]);
    // Sequencing
    const [sequence, setSequence] = useState([]);
    // Simulation
    const [simStep, setSimStep] = useState(0);
    const [simLog, setSimLog] = useState([]);
    const [simStatus, setSimStatus] = useState('idle');
    const [failReason, setFailReason] = useState(null);

    // ── Helpers ─────────────────────────────────────────────────
    const toggleResource = (item) => {
        if (selectedResources.find(r => r.id === item.id)) {
            setSelectedResources(selectedResources.filter(r => r.id !== item.id));
        } else {
            setSelectedResources([...selectedResources, item]);
        }
    };

    const addToSequence = (block) => {
        if (!sequence.find(s => s.id === block.id)) {
            setSequence([...sequence, block]);
        }
    };

    const removeFromSequence = (id) => {
        setSequence(sequence.filter(s => s.id !== id));
    };

    const resetAll = () => {
        setSequence([]);
        setSimStep(0);
        setSimLog([]);
        setSimStatus('idle');
        setFailReason(null);
    };

    // ── Simulation Engine ───────────────────────────────────────
    useEffect(() => {
        if (phase === 'SIMULATE' && simStatus === 'running') {
            if (simStep < sequence.length) {
                const timer = setTimeout(() => {
                    const action = sequence[simStep];
                    let error = null;

                    // Validation rules
                    if (action.id !== 'book_venue' && !sequence.slice(0, simStep).find(s => s.id === 'book_venue')) {
                        error = { title: 'Missing Dependency', desc: `You tried "${action.label}" without booking a venue first! Where will this happen?` };
                    } else if (action.id === 'open_gates' && simStep < sequence.length - 1) {
                        error = { title: 'Premature Execution', desc: 'You opened the gates before everything was ready! Chaos!' };
                    } else if (action.id === 'marketing' && !sequence.slice(0, simStep).find(s => s.id === 'book_venue')) {
                        error = { title: 'Logic Error', desc: 'You launched marketing but have no venue to advertise!' };
                    }

                    if (error) {
                        setFailReason(error);
                        setSimStatus('failed');
                        setSimLog(prev => [...prev, { type: 'error', text: `❌ ${action.label} — FAILED` }]);
                    } else {
                        setSimLog(prev => [...prev, { type: 'success', text: `✅ ${action.label} — completed` }]);
                        setSimStep(s => s + 1);
                    }
                }, 1800);
                return () => clearTimeout(timer);
            } else {
                // All steps done — final resource check
                const timer = setTimeout(() => {
                    const missingEssentials = RESOURCES.filter(r => r.essential && !selectedResources.find(s => s.id === r.id));
                    if (missingEssentials.length > 0) {
                        setFailReason({ title: 'Poor Decomposition', desc: `Festival failed! Missing: ${missingEssentials.map(e => e.label).join(', ')}.` });
                        setSimStatus('failed');
                    } else {
                        setSimStatus('success');
                    }
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [phase, simStatus, simStep, sequence, selectedResources]);

    // ── Current scene key ───────────────────────────────────────
    const currentSceneKey = simStatus === 'running' && simStep < sequence.length
        ? sequence[simStep].id
        : (simStatus === 'success' ? 'success' : (simStatus === 'failed' ? 'failed' : 'idle'));
    const scene = SCENE_DATA[currentSceneKey] || SCENE_DATA.idle;

    // ═══════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════
    return (
        <main className="container">
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideInRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
                @keyframes popIn { 0% { transform: scale(0); } 70% { transform: scale(1.15); } 100% { transform: scale(1); } }
                @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                .mod3-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-lg);
                    padding: 24px;
                    transition: all 0.25s ease;
                    cursor: pointer;
                }
                .mod3-card:hover { border-color: #6366f1; transform: translateY(-4px); box-shadow: 0 10px 30px rgba(99,102,241,0.15); }
                .mod3-card.selected { border-color: #818cf8; background: rgba(99,102,241,0.08); }
                .mod3-card.essential { border-left: 4px solid #10b981; }
                .mod3-card.optional  { border-left: 4px solid #f59e0b; }
                .mod3-step-chip {
                    display: flex; align-items: center; gap: 12px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 14px 20px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 16px;
                }
                .mod3-step-chip:hover { border-color: #6366f1; background: rgba(99,102,241,0.08); }
                .mod3-step-chip.in-seq { border-color: #818cf8; background: rgba(99,102,241,0.12); }
                .mod3-log-entry {
                    padding: 14px 18px;
                    border-radius: 0 12px 12px 0;
                    font-size: 16px;
                    animation: slideInRight 0.3s ease;
                }
            `}} />

            <header>
                <div className="logo-text">AlgoThink <span>Module 3</span></div>
                <Link href="/dashboard" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>⬅️ Dashboard</Link>
            </header>

            {/* ─── Phase Tabs ─────────────────────────────── */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '30px', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                {[
                    { key: 'LEARN',     label: '📖 Learn',     num: '1' },
                    { key: 'PLAN',      label: '🧩 Plan',      num: '2' },
                    { key: 'SEQUENCE',  label: '🔀 Sequence',  num: '3' },
                    { key: 'SIMULATE',  label: '▶️ Simulate',  num: '4' },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setPhase(tab.key)}
                        style={{
                            flex: 1,
                            padding: '14px 20px',
                            background: phase === tab.key ? '#6366f1' : 'transparent',
                            color: phase === tab.key ? 'white' : 'var(--text-muted)',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: phase === tab.key ? 'bold' : 'normal',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}
                    >
                        <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: phase === tab.key ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold' }}>{tab.num}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* PHASE 1: LEARN                                 */}
            {/* ═══════════════════════════════════════════════ */}
            {phase === 'LEARN' && (
                <div className="panel" style={{ animation: 'fadeIn 0.4s ease' }}>
                    <h1 style={{ fontSize: '36px', color: '#818cf8', marginBottom: '20px', fontWeight: '900' }}>
                        Applying Algorithmic Thinking
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '30px' }}>
                        In Module 1, you learned the 7 Superpowers. In Module 2, you saw algorithms in everyday life.
                        Now it's time to <strong style={{ color: '#a5b4fc' }}>apply</strong> those superpowers to solve a real challenge: <strong style={{ color: '#fbbf24' }}>organising a school festival</strong> from scratch.
                    </p>

                    {/* The 3 Pillars */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                        {[
                            { icon: '🧩', title: 'Decomposition', desc: 'Break the big goal into smaller, manageable tasks. What resources do you actually need?', color: '#c084fc' },
                            { icon: '🔀', title: 'Sequencing', desc: 'Put the tasks in the right logical order. You can\'t open the gates before booking a venue!', color: '#60a5fa' },
                            { icon: '🧪', title: 'Testing & Debugging', desc: 'Run your plan. If it crashes, find the bug, fix it, and try again.', color: '#34d399' },
                        ].map(p => (
                            <div key={p.title} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '30px', borderTop: `4px solid ${p.color}` }}>
                                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{p.icon}</div>
                                <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '12px', color: p.color }}>{p.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>{p.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Scenario Brief */}
                    <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.05))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 'var(--radius-lg)', padding: '40px', display: 'flex', gap: '40px', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                🎯 Your Mission
                            </div>
                            <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '16px' }}>School Festival Manager</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '17px', lineHeight: '1.7', marginBottom: '24px' }}>
                                You are in charge of organising the school's biggest festival. You must identify the essential resources, put the tasks in the correct order, and run the simulation without crashing.
                            </p>
                            <button onClick={() => setPhase('PLAN')} style={{ padding: '16px 40px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.4)', transition: 'all 0.2s' }}>
                                Start Planning 🚀
                            </button>
                        </div>
                        <div style={{ fontSize: '120px', lineHeight: 1, animation: 'bob 3s ease-in-out infinite' }}>🎪</div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* PHASE 2: PLAN (Decomposition)                  */}
            {/* ═══════════════════════════════════════════════ */}
            {phase === 'PLAN' && (
                <div className="panel" style={{ animation: 'fadeIn 0.4s ease' }}>
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '28px' }}>🧩</span>
                            <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#c084fc' }}>Phase 1: Decomposition</h2>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.6' }}>
                            Break the problem down! Select the resources you think are <strong>essential</strong> for a successful festival.
                            Be careful — choosing non-essential extras wastes budget and causes failure!
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '30px' }}>
                        {RESOURCES.map(item => {
                            const isSelected = selectedResources.find(r => r.id === item.id);
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => toggleResource(item)}
                                    className={`mod3-card ${isSelected ? 'selected' : ''} ${item.essential ? 'essential' : 'optional'}`}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ fontSize: '36px', width: '50px', textAlign: 'center' }}>{item.icon}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                                <strong style={{ fontSize: '18px' }}>{item.label}</strong>
                                                <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '6px', background: item.essential ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: item.essential ? '#34d399' : '#fbbf24' }}>
                                                    {item.essential ? 'Core' : 'Optional'}
                                                </span>
                                            </div>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>{item.desc}</p>
                                        </div>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', border: `2px solid ${isSelected ? '#818cf8' : 'var(--border)'}`, background: isSelected ? '#6366f1' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', transition: 'all 0.2s', flexShrink: 0 }}>
                                            {isSelected ? '✓' : ''}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Selected: </span>
                            <strong style={{ color: '#818cf8', fontSize: '18px' }}>{selectedResources.length}</strong>
                            <span style={{ color: 'var(--text-muted)', fontSize: '15px' }}> / {RESOURCES.length} resources</span>
                        </div>
                        <button
                            onClick={() => { if (selectedResources.length > 0) setPhase('SEQUENCE'); }}
                            disabled={selectedResources.length === 0}
                            style={{ padding: '14px 36px', background: selectedResources.length > 0 ? '#6366f1' : '#334155', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: selectedResources.length > 0 ? 'pointer' : 'not-allowed', boxShadow: selectedResources.length > 0 ? '0 4px 20px rgba(99,102,241,0.4)' : 'none', transition: 'all 0.2s' }}
                        >
                            Next: Sequencing →
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* PHASE 3: SEQUENCE (Ordering)                   */}
            {/* ═══════════════════════════════════════════════ */}
            {phase === 'SEQUENCE' && (
                <div className="panel" style={{ animation: 'fadeIn 0.4s ease' }}>
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '28px' }}>🔀</span>
                            <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#60a5fa' }}>Phase 2: Sequencing</h2>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.6' }}>
                            Now arrange the algorithm blocks in the correct execution order. Click blocks on the left to add them to your sequence on the right.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '40px' }}>
                        {/* Available Blocks */}
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Available Blocks</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {ALGO_STEPS.map(block => {
                                    const inSeq = sequence.find(s => s.id === block.id);
                                    return (
                                        <div
                                            key={block.id}
                                            onClick={() => !inSeq && addToSequence(block)}
                                            className={`mod3-step-chip ${inSeq ? 'in-seq' : ''}`}
                                            style={{ opacity: inSeq ? 0.4 : 1, cursor: inSeq ? 'default' : 'pointer' }}
                                        >
                                            <span style={{ fontSize: '24px' }}>{block.icon}</span>
                                            <span style={{ fontWeight: '600' }}>{block.label}</span>
                                            {inSeq && <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#818cf8' }}>Added ✓</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sequence Builder */}
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Algorithm Sequence</h3>
                            <div style={{ minHeight: '300px', background: 'rgba(0,0,0,0.2)', border: '2px dashed var(--border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {sequence.length === 0 && (
                                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '80px', fontSize: '15px', fontStyle: 'italic' }}>
                                        Click blocks on the left to build your sequence...
                                    </div>
                                )}
                                {sequence.map((step, idx) => (
                                    <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '12px', padding: '14px 18px', animation: 'fadeInUp 0.3s ease' }}>
                                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', flexShrink: 0 }}>{idx + 1}</div>
                                        <span style={{ fontSize: '22px' }}>{step.icon}</span>
                                        <span style={{ fontWeight: '600', flex: 1 }}>{step.label}</span>
                                        <button onClick={() => removeFromSequence(step.id)} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', borderRadius: '8px', padding: '4px 10px', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button onClick={() => setPhase('PLAN')} style={{ padding: '14px 30px', background: 'transparent', border: '1px solid var(--border)', color: 'white', borderRadius: '12px', cursor: 'pointer', fontSize: '15px' }}>⬅️ Back to Planning</button>
                        <button
                            onClick={() => {
                                if (sequence.length === ALGO_STEPS.length) {
                                    setSimStep(0);
                                    setSimLog([]);
                                    setSimStatus('running');
                                    setFailReason(null);
                                    setPhase('SIMULATE');
                                }
                            }}
                            disabled={sequence.length !== ALGO_STEPS.length}
                            style={{ padding: '16px 40px', background: sequence.length === ALGO_STEPS.length ? '#f59e0b' : '#334155', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: sequence.length === ALGO_STEPS.length ? 'pointer' : 'not-allowed', boxShadow: sequence.length === ALGO_STEPS.length ? '0 4px 20px rgba(245,158,11,0.4)' : 'none', transition: 'all 0.2s' }}
                        >
                            ▶️ Run Simulation
                        </button>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* PHASE 4: SIMULATE                              */}
            {/* ═══════════════════════════════════════════════ */}
            {phase === 'SIMULATE' && (
                <div className="panel" style={{ padding: 0, overflow: 'hidden', animation: 'fadeIn 0.4s ease' }}>
                    <div style={{ display: 'flex', height: '75vh' }}>

                        {/* ─── Left: Visual Scene ──────────────── */}
                        <div style={{ flex: 1, background: scene.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', transition: 'background 0.6s ease', position: 'relative', overflow: 'hidden' }}>
                            {/* Animated background circles */}
                            <div style={{ position: 'absolute', top: '10%', left: '10%', width: '200px', height: '200px', borderRadius: '50%', background: `${scene.color}10`, animation: 'bob 6s ease-in-out infinite' }}></div>
                            <div style={{ position: 'absolute', bottom: '15%', right: '15%', width: '150px', height: '150px', borderRadius: '50%', background: `${scene.color}08`, animation: 'bob 4s ease-in-out infinite reverse' }}></div>

                            {/* Status badge */}
                            <div style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', padding: '10px 20px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: simStatus === 'running' ? '#ef4444' : (simStatus === 'success' ? '#10b981' : '#f59e0b'), animation: simStatus === 'running' ? 'pulse 1s infinite' : 'none' }}></div>
                                <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                    {simStatus === 'running' ? `Step ${Math.min(simStep + 1, sequence.length)} of ${sequence.length}` : (simStatus === 'success' ? 'Complete' : 'Failed')}
                                </span>
                            </div>

                            {/* Big animated emoji */}
                            <div key={currentSceneKey} style={{ fontSize: '140px', lineHeight: 1, animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', filter: `drop-shadow(0 20px 40px ${scene.color}40)`, marginBottom: '30px' }}>
                                {scene.emoji}
                            </div>

                            {/* Scene title */}
                            <h2 style={{ color: 'white', fontSize: '36px', fontWeight: '800', textAlign: 'center', marginBottom: '12px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                                {scene.title}
                            </h2>
                            <p style={{ color: scene.color, fontSize: '18px', textAlign: 'center', maxWidth: '500px', lineHeight: '1.6' }}>
                                {failReason ? failReason.desc : scene.subtitle}
                            </p>

                            {/* Progress dots */}
                            {simStatus === 'running' && (
                                <div style={{ position: 'absolute', bottom: '30px', display: 'flex', gap: '10px' }}>
                                    {sequence.map((_, i) => (
                                        <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: i < simStep ? '#10b981' : (i === simStep ? '#fbbf24' : 'rgba(255,255,255,0.2)'), transition: 'all 0.3s', transform: i === simStep ? 'scale(1.4)' : 'scale(1)' }}></div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ─── Right: Execution Log ────────────── */}
                        <div style={{ width: '420px', background: '#0f172a', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                            {/* Log Header */}
                            <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)' }}>
                                <h3 style={{ margin: 0, color: '#818cf8', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Execution Log</h3>
                            </div>

                            {/* Log Entries */}
                            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {simLog.map((log, i) => (
                                    <div key={i} className="mod3-log-entry" style={{
                                        background: log.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.08)',
                                        borderLeft: `4px solid ${log.type === 'error' ? '#ef4444' : '#10b981'}`,
                                        color: 'white'
                                    }}>
                                        {log.text}
                                    </div>
                                ))}
                                {simStatus === 'running' && simStep < sequence.length && (
                                    <div className="mod3-log-entry" style={{ background: 'rgba(99,102,241,0.1)', borderLeft: '4px solid #6366f1', color: '#a5b4fc', animation: 'pulse 1.5s infinite' }}>
                                        ⏳ Executing: {sequence[simStep].label}...
                                    </div>
                                )}
                                {simLog.length === 0 && simStatus !== 'running' && (
                                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px', fontStyle: 'italic', fontSize: '15px' }}>
                                        Waiting for execution...
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
                                {simStatus === 'running' && (
                                    <div style={{ color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic', fontSize: '15px' }}>
                                        Algorithm running...
                                    </div>
                                )}
                                {simStatus === 'failed' && (
                                    <button onClick={() => { resetAll(); setPhase('SEQUENCE'); }} style={{ width: '100%', padding: '18px', background: '#ef4444', color: 'white', fontSize: '18px', fontWeight: 'bold', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 20px rgba(239,68,68,0.3)', transition: 'all 0.2s' }}>
                                        🛠️ Fix Algorithm
                                    </button>
                                )}
                                {simStatus === 'success' && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏆</div>
                                            <strong style={{ color: '#6ee7b7', fontSize: '18px' }}>Master Planner Badge</strong>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '8px 0 0 0' }}>Decomposition ✓ · Sequencing ✓ · No Bugs ✓</p>
                                        </div>
                                        <button onClick={() => { resetAll(); setPhase('LEARN'); }} style={{ width: '100%', padding: '16px', background: '#10b981', color: 'white', fontSize: '16px', fontWeight: 'bold', borderRadius: '14px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 20px rgba(16,185,129,0.3)' }}>
                                            🔄 Play Again
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Navigation Footer ──────────────────── */}
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
