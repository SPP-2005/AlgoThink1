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
    // When simulating, render full-screen — skip the container constraint
    if (phase === 'SIMULATE') {
        return (
            <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 100, background: '#0f1117', display: 'flex', flexDirection: 'column' }}>
                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes walkCycle { 
                        0%,100% { transform: translateY(0) rotate(0deg); } 
                        25% { transform: translateY(-6px) rotate(3deg); } 
                        75% { transform: translateY(-6px) rotate(-3deg); } 
                    }
                    @keyframes cloudDrift { 0% { transform: translateX(-120px); } 100% { transform: translateX(calc(100vw + 120px)); } }
                    @keyframes propSlideIn { 0% { transform: translateX(80px) scale(0.8); opacity: 0; } 100% { transform: translateX(0) scale(1); opacity: 1; } }
                    @keyframes propBounceIn { 0% { transform: scale(0); } 60% { transform: scale(1.15); } 100% { transform: scale(1); } }
                    @keyframes bannerDrop { 0% { transform: translateY(-60px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
                    @keyframes crowdWave { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
                    @keyframes confetti { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(80px) rotate(720deg); opacity: 0; } }
                    @keyframes shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(5px); } }
                    @keyframes sceneTransition { 0% { opacity: 0; } 100% { opacity: 1; } }
                    @keyframes starTwinkle { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }
                    @keyframes speechBubble { 0% { transform: scale(0) translateY(10px); opacity: 0; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
                    @keyframes pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
                    @keyframes slideInRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
                    .mod3-log-entry {
                        padding: 14px 18px;
                        border-radius: 0 12px 12px 0;
                        font-size: 16px;
                        animation: slideInRight 0.3s ease;
                    }
                `}} />

                {/* ── Top bar ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 30px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.4)', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontSize: '22px' }}>🎪</div>
                        <span style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>Festival Simulation</span>
                    </div>
                    <button onClick={() => { resetAll(); setPhase('SEQUENCE'); }} style={{ padding: '8px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                        ⬅️ Back to Sequence
                    </button>
                </div>

                {/* ── Main content: Scene + Log ── */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden', animation: 'fadeIn 0.4s ease' }}>

                    {/* ─── Left: Animated 2D Scene Container ──────────── */}
                    <div style={{ 
                        flex: 1, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        background: '#000',
                        position: 'relative',
                        padding: '20px'
                    }}>
                        {/* ─── Video Frame (16:9 aspect ratio) ──────────── */}
                        <div style={{
                            width: '100%',
                            height: '100%',
                            maxHeight: '100%',
                            maxWidth: '100%',
                            objectFit: 'contain', /* To get the container itself to keep ratio in flex, we can use aspect-ratio + max dims */
                            aspectRatio: '16 / 9',
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '12px',
                            boxShadow: '0 0 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)',
                            animation: simStatus === 'failed' ? 'shake 0.5s ease' : 'none',
                            margin: 'auto'
                        }}>
                        {/* Sky gradient */}
                        <div style={{ 
                            position: 'absolute', inset: 0, 
                            background: currentSceneKey === 'open_gates' || currentSceneKey === 'success'
                                ? 'linear-gradient(180deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #1e1b4b 100%)'
                                : currentSceneKey === 'failed'
                                ? 'linear-gradient(180deg, #450a0a 0%, #7f1d1d 50%, #991b1b 100%)'
                                : 'linear-gradient(180deg, #38bdf8 0%, #7dd3fc 40%, #bae6fd 70%, #e0f2fe 100%)',
                            transition: 'all 1s ease'
                        }}></div>

                        {/* Sun / Moon */}
                        {(currentSceneKey === 'open_gates' || currentSceneKey === 'success') ? (
                            <div style={{ position: 'absolute', top: '40px', right: '80px', width: '80px', height: '80px', borderRadius: '50%', background: '#fef3c7', boxShadow: '0 0 60px rgba(254,243,199,0.6)', zIndex: 2 }}></div>
                        ) : currentSceneKey !== 'failed' ? (
                            <div style={{ position: 'absolute', top: '40px', right: '100px', width: '90px', height: '90px', borderRadius: '50%', background: '#fde047', boxShadow: '0 0 80px rgba(253,224,71,0.5)', zIndex: 2 }}></div>
                        ) : null}

                        {/* Stars (night scenes) */}
                        {(currentSceneKey === 'open_gates' || currentSceneKey === 'success') && (
                            <>
                                {[...Array(20)].map((_, i) => (
                                    <div key={`star-${i}`} style={{ position: 'absolute', top: `${5 + Math.random() * 40}%`, left: `${Math.random() * 100}%`, width: '3px', height: '3px', borderRadius: '50%', background: 'white', animation: `starTwinkle ${1 + Math.random() * 2}s ease-in-out infinite`, animationDelay: `${Math.random() * 2}s`, zIndex: 2 }}></div>
                                ))}
                            </>
                        )}

                        {/* Clouds */}
                        {currentSceneKey !== 'failed' && (
                            <>
                                <svg style={{ position: 'absolute', top: '10%', zIndex: 3, animation: 'cloudDrift 30s linear infinite', opacity: 0.7 }} width="160" height="65" viewBox="0 0 160 65">
                                    <ellipse cx="80" cy="45" rx="70" ry="20" fill="white" opacity="0.8"/>
                                    <ellipse cx="55" cy="32" rx="40" ry="24" fill="white" opacity="0.9"/>
                                    <ellipse cx="100" cy="28" rx="35" ry="22" fill="white"/>
                                </svg>
                                <svg style={{ position: 'absolute', top: '20%', zIndex: 3, animation: 'cloudDrift 40s linear infinite', animationDelay: '-15s', opacity: 0.5 }} width="120" height="50" viewBox="0 0 120 50">
                                    <ellipse cx="60" cy="35" rx="55" ry="15" fill="white" opacity="0.8"/>
                                    <ellipse cx="40" cy="25" rx="28" ry="18" fill="white"/>
                                    <ellipse cx="75" cy="22" rx="22" ry="16" fill="white"/>
                                </svg>
                            </>
                        )}

                        {/* Ground */}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%', background: currentSceneKey === 'failed' ? '#451a03' : 'linear-gradient(180deg, #16a34a, #15803d)', zIndex: 4, transition: 'all 0.8s' }}>
                            <svg style={{ position: 'absolute', top: '-10px', left: 0, width: '100%', height: '20px' }} viewBox="0 0 1000 20" preserveAspectRatio="none">
                                <path d="M0,20 Q10,0 20,20 Q30,5 40,20 Q50,0 60,20 Q70,8 80,20 Q90,2 100,20 Q110,6 120,20 Q130,0 140,20 Q150,4 160,20 Q170,0 180,20 Q190,7 200,20 Q210,0 220,20 Q230,3 240,20 Q250,0 260,20 Q270,5 280,20 Q290,0 300,20 Q310,8 320,20 Q330,0 340,20 Q350,4 360,20 Q370,0 380,20 Q390,6 400,20 Q410,0 420,20 Q430,3 440,20 Q450,0 460,20 Q470,7 480,20 Q490,0 500,20 Q510,5 520,20 Q530,0 540,20 Q550,8 560,20 Q570,0 580,20 Q590,4 600,20 Q610,0 620,20 Q630,6 640,20 Q650,0 660,20 Q670,3 680,20 Q690,0 700,20 Q710,7 720,20 Q730,0 740,20 Q750,5 760,20 Q770,0 780,20 Q790,8 800,20 Q810,0 820,20 Q830,4 840,20 Q850,0 860,20 Q870,6 880,20 Q890,0 900,20 Q910,3 920,20 Q930,0 940,20 Q950,7 960,20 Q970,0 980,20 Q990,5 1000,20" fill={currentSceneKey === 'failed' ? '#78350f' : '#22c55e'} />
                            </svg>
                            <div style={{ position: 'absolute', bottom: '35%', left: 0, right: 0, height: '8px', background: 'rgba(0,0,0,0.12)', borderRadius: '4px' }}></div>
                        </div>

                        {/* ── Trees (background decoration) ── */}
                        <svg style={{ position: 'absolute', bottom: '28%', left: '3%', zIndex: 5, opacity: 0.6 }} width="60" height="100" viewBox="0 0 60 100">
                            <rect x="25" y="60" width="10" height="40" fill="#78350f"/>
                            <polygon points="30,10 5,65 55,65" fill="#166534"/>
                            <polygon points="30,25 10,60 50,60" fill="#15803d"/>
                        </svg>
                        <svg style={{ position: 'absolute', bottom: '28%', right: '25%', zIndex: 5, opacity: 0.4 }} width="50" height="90" viewBox="0 0 50 90">
                            <rect x="20" y="55" width="10" height="35" fill="#78350f"/>
                            <polygon points="25,10 3,58 47,58" fill="#166534"/>
                        </svg>

                        {/* ── SVG CHARACTER: Student ────────── */}
                        <div style={{ 
                            position: 'absolute', bottom: '28%', left: '15%', zIndex: 10,
                            animation: simStatus === 'running' ? 'walkCycle 0.6s ease-in-out infinite' : 'none',
                            transition: 'left 1s ease'
                        }}>
                            <svg width="90" height="140" viewBox="0 0 70 110">
                                {/* Backpack */}
                                <rect x="8" y="42" width="16" height="28" rx="6" fill="#10b981"/>
                                <rect x="10" y="50" width="12" height="4" rx="2" fill="#059669"/>
                                {/* Head */}
                                <circle cx="35" cy="22" r="16" fill="#fcd34d"/>
                                {/* Hair */}
                                <path d="M 19 18 Q 20 5 35 6 Q 50 5 51 18" fill="#92400e" stroke="#78350f" strokeWidth="1"/>
                                {/* Eyes */}
                                <circle cx="29" cy="20" r="2.5" fill="#1e293b"/>
                                <circle cx="41" cy="20" r="2.5" fill="#1e293b"/>
                                <circle cx="30" cy="19" r="0.8" fill="white"/>
                                <circle cx="42" cy="19" r="0.8" fill="white"/>
                                {/* Mouth */}
                                {simStatus === 'failed' ? (
                                    <path d="M 28 28 Q 35 24 42 28" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
                                ) : simStatus === 'success' ? (
                                    <path d="M 27 26 Q 35 32 43 26" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
                                ) : (
                                    <path d="M 29 27 Q 35 30 41 27" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round"/>
                                )}
                                {/* Body */}
                                <rect x="22" y="38" width="26" height="35" rx="8" fill="#3b82f6"/>
                                <rect x="22" y="50" width="26" height="4" fill="#2563eb" rx="2"/>
                                {/* Arms */}
                                <rect x="12" y="42" width="10" height="6" rx="3" fill="#fcd34d"/>
                                <rect x="48" y="42" width="10" height="6" rx="3" fill="#fcd34d"/>
                                {/* Legs */}
                                <rect x="25" y="70" width="8" height="24" rx="4" fill="#1e293b"/>
                                <rect x="37" y="70" width="8" height="24" rx="4" fill="#1e293b"/>
                                {/* Shoes */}
                                <ellipse cx="29" cy="95" rx="7" ry="5" fill="#ef4444"/>
                                <ellipse cx="41" cy="95" rx="7" ry="5" fill="#ef4444"/>
                            </svg>
                        </div>

                        {/* ── SCENE PROPS ──────────────────── */}
                        <div key={currentSceneKey} style={{ animation: 'sceneTransition 0.6s ease' }}>

                            {/* Book Venue: Tent + clipboard */}
                            {currentSceneKey === 'book_venue' && (
                                <div style={{ position: 'absolute', right: '12%', bottom: '22%', zIndex: 8, animation: 'propSlideIn 0.8s ease' }}>
                                    <svg width="280" height="230" viewBox="0 0 220 180">
                                        <polygon points="110,10 10,100 210,100" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2"/>
                                        <polygon points="110,10 60,100 160,100" fill="#a78bfa" opacity="0.5"/>
                                        <rect x="40" y="100" width="140" height="70" fill="#6d28d9" stroke="#7c3aed" strokeWidth="2"/>
                                        <rect x="85" y="110" width="50" height="60" rx="4" fill="#1e1b4b"/>
                                        <line x1="110" y1="110" x2="110" y2="170" stroke="#4c1d95" strokeWidth="2"/>
                                        <line x1="110" y1="10" x2="110" y2="0" stroke="#4c1d95" strokeWidth="2"/>
                                        <polygon points="110,0 140,8 110,16" fill="#fbbf24"/>
                                    </svg>
                                    <svg style={{ position: 'absolute', left: '-60px', bottom: '40px', animation: 'propBounceIn 0.5s ease 0.4s both' }} width="60" height="75" viewBox="0 0 50 60">
                                        <rect x="5" y="8" width="40" height="50" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
                                        <rect x="15" y="2" width="20" height="10" rx="3" fill="#78350f"/>
                                        <line x1="12" y1="22" x2="38" y2="22" stroke="#92400e" strokeWidth="2" opacity="0.4"/>
                                        <line x1="12" y1="30" x2="38" y2="30" stroke="#92400e" strokeWidth="2" opacity="0.4"/>
                                        <line x1="12" y1="38" x2="28" y2="38" stroke="#92400e" strokeWidth="2" opacity="0.4"/>
                                        <path d="M 30 42 L 34 46 L 40 36" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"/>
                                    </svg>
                                </div>
                            )}

                            {/* Hire Volunteers: Group of people */}
                            {currentSceneKey === 'hire_vols' && (
                                <div style={{ position: 'absolute', right: '10%', bottom: '28%', zIndex: 8, display: 'flex', gap: '12px', animation: 'propBounceIn 0.6s ease' }}>
                                    {['#ef4444', '#3b82f6', '#10b981', '#f59e0b'].map((color, i) => (
                                        <svg key={i} width="55" height="90" viewBox="0 0 40 65" style={{ animation: `crowdWave 1.2s ease-in-out infinite`, animationDelay: `${i * 0.2}s` }}>
                                            <circle cx="20" cy="12" r="10" fill="#fcd34d"/>
                                            <circle cx="16" cy="10" r="1.5" fill="#1e293b"/>
                                            <circle cx="24" cy="10" r="1.5" fill="#1e293b"/>
                                            <path d="M 16 16 Q 20 19 24 16" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round"/>
                                            <rect x="10" y="22" width="20" height="25" rx="6" fill={color}/>
                                            <rect x="12" y="45" width="6" height="18" rx="3" fill="#1e293b"/>
                                            <rect x="22" y="45" width="6" height="18" rx="3" fill="#1e293b"/>
                                        </svg>
                                    ))}
                                    <svg style={{ position: 'absolute', top: '-25px', right: '-15px', animation: 'propBounceIn 0.5s ease 0.5s both' }} width="40" height="55" viewBox="0 0 30 40">
                                        <rect x="5" y="10" width="20" height="28" rx="3" fill="#475569"/>
                                        <rect x="8" y="14" width="14" height="8" rx="2" fill="#0f172a"/>
                                        <line x1="15" y1="10" x2="15" y2="2" stroke="#475569" strokeWidth="2"/>
                                        <circle cx="15" cy="2" r="2" fill="#22c55e"/>
                                    </svg>
                                </div>
                            )}

                            {/* Order Food: Food truck */}
                            {currentSceneKey === 'order_food' && (
                                <div style={{ position: 'absolute', right: '8%', bottom: '24%', zIndex: 8, animation: 'propSlideIn 0.8s ease' }}>
                                    <svg width="320" height="190" viewBox="0 0 240 140">
                                        <rect x="10" y="30" width="200" height="80" rx="10" fill="#f97316"/>
                                        <rect x="10" y="30" width="200" height="15" rx="8" fill="#ea580c"/>
                                        <rect x="60" y="50" width="100" height="40" rx="6" fill="#fef3c7"/>
                                        <rect x="65" y="55" width="90" height="30" rx="4" fill="#fffbeb"/>
                                        <path d="M 50 48 L 170 48 L 180 38 L 40 38 Z" fill="#dc2626"/>
                                        <path d="M 55 48 L 65 38" stroke="white" strokeWidth="2"/>
                                        <path d="M 85 48 L 95 38" stroke="white" strokeWidth="2"/>
                                        <path d="M 115 48 L 125 38" stroke="white" strokeWidth="2"/>
                                        <path d="M 145 48 L 155 38" stroke="white" strokeWidth="2"/>
                                        <circle cx="50" cy="115" r="15" fill="#1e293b"/>
                                        <circle cx="50" cy="115" r="6" fill="#64748b"/>
                                        <circle cx="170" cy="115" r="15" fill="#1e293b"/>
                                        <circle cx="170" cy="115" r="6" fill="#64748b"/>
                                        <text x="110" y="73" textAnchor="middle" fill="#92400e" fontSize="14" fontWeight="bold" fontFamily="sans-serif">FESTIVAL EATS</text>
                                        <circle cx="215" cy="55" r="14" fill="#fde047"/>
                                        <text x="215" y="60" textAnchor="middle" fontSize="16">🍔</text>
                                    </svg>
                                </div>
                            )}

                            {/* Marketing: Banner + megaphone */}
                            {currentSceneKey === 'marketing' && (
                                <div style={{ position: 'absolute', right: '12%', bottom: '30%', zIndex: 8 }}>
                                    <svg style={{ animation: 'bannerDrop 0.8s ease' }} width="260" height="160" viewBox="0 0 200 120">
                                        <rect x="10" y="20" width="180" height="80" rx="8" fill="#8b5cf6" stroke="#7c3aed" strokeWidth="2"/>
                                        <text x="100" y="55" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" fontFamily="sans-serif">🎉 SCHOOL</text>
                                        <text x="100" y="78" textAnchor="middle" fill="#e9d5ff" fontSize="20" fontWeight="900" fontFamily="sans-serif">FESTIVAL!</text>
                                        <line x1="15" y1="0" x2="15" y2="120" stroke="#78350f" strokeWidth="4"/>
                                        <line x1="185" y1="0" x2="185" y2="120" stroke="#78350f" strokeWidth="4"/>
                                    </svg>
                                    <svg style={{ position: 'absolute', left: '-70px', top: '30px', animation: 'propBounceIn 0.5s ease 0.5s both' }} width="75" height="65" viewBox="0 0 60 50">
                                        <polygon points="10,15 40,5 40,40 10,30" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
                                        <rect x="40" y="8" width="15" height="30" rx="4" fill="#f59e0b"/>
                                        <path d="M 55 18 Q 62 22 55 26" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.6"/>
                                        <path d="M 58 14 Q 68 22 58 30" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.4"/>
                                    </svg>
                                </div>
                            )}

                            {/* Open Gates: Crowd + gate */}
                            {currentSceneKey === 'open_gates' && (
                                <div style={{ position: 'absolute', right: '8%', bottom: '22%', zIndex: 8, animation: 'propSlideIn 1s ease' }}>
                                    <svg width="240" height="180" viewBox="0 0 180 130">
                                        <path d="M 10 130 L 10 30 Q 10 10 30 10 L 150 10 Q 170 10 170 30 L 170 130" fill="none" stroke="#fbbf24" strokeWidth="6"/>
                                        <text x="90" y="35" textAnchor="middle" fill="#fde047" fontSize="12" fontWeight="bold" fontFamily="sans-serif">🎟️ ENTRANCE</text>
                                        {[30, 60, 90, 120, 150].map((x, i) => (
                                            <circle key={i} cx={x} cy="12" r="5" fill={['#ef4444', '#fbbf24', '#10b981', '#3b82f6', '#ef4444'][i]} style={{ animation: `starTwinkle ${0.5 + i * 0.2}s ease infinite` }}/>
                                        ))}
                                    </svg>
                                    <div style={{ display: 'flex', gap: '6px', marginTop: '-25px', justifyContent: 'center' }}>
                                        {['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'].map((c, i) => (
                                            <svg key={i} width="30" height="50" viewBox="0 0 24 40" style={{ animation: `crowdWave 0.8s ease infinite`, animationDelay: `${i * 0.1}s` }}>
                                                <circle cx="12" cy="8" r="6" fill="#fcd34d"/>
                                                <rect x="5" y="14" width="14" height="16" rx="4" fill={c}/>
                                                <rect x="7" y="28" width="4" height="10" rx="2" fill="#1e293b"/>
                                                <rect x="13" y="28" width="4" height="10" rx="2" fill="#1e293b"/>
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SUCCESS: Confetti + trophy */}
                            {currentSceneKey === 'success' && (
                                <>
                                    <div style={{ position: 'absolute', top: '12%', left: '50%', transform: 'translateX(-50%)', zIndex: 12, textAlign: 'center', animation: 'propBounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                                        <div style={{ fontSize: '100px', filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.4))' }}>🏆</div>
                                        <div style={{ color: '#fde047', fontSize: '28px', fontWeight: '900', marginTop: '10px', textShadow: '0 2px 10px rgba(0,0,0,0.6)' }}>FESTIVAL SUCCESS!</div>
                                    </div>
                                    {[...Array(25)].map((_, i) => (
                                        <div key={`c-${i}`} style={{ position: 'absolute', top: `${5 + Math.random() * 35}%`, left: `${5 + Math.random() * 90}%`, width: '10px', height: '10px', borderRadius: i % 2 === 0 ? '50%' : '2px', background: ['#ef4444', '#fbbf24', '#3b82f6', '#10b981', '#a855f7', '#ec4899'][i % 6], animation: `confetti ${1.5 + Math.random() * 2}s ease-out infinite`, animationDelay: `${Math.random() * 1.5}s`, zIndex: 15 }}></div>
                                    ))}
                                </>
                            )}

                            {/* FAILED: Crash overlay */}
                            {currentSceneKey === 'failed' && (
                                <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', zIndex: 12, textAlign: 'center', animation: 'propBounceIn 0.5s ease' }}>
                                    <div style={{ fontSize: '100px' }}>💥</div>
                                    <div style={{ color: '#fca5a5', fontSize: '28px', fontWeight: '800', marginTop: '10px', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>ALGORITHM CRASHED</div>
                                </div>
                            )}
                        </div>

                        {/* Speech Bubble */}
                        {simStatus === 'running' && simStep < sequence.length && (
                            <div key={`bubble-${simStep}`} style={{ 
                                position: 'absolute', bottom: '35%', left: '28%', zIndex: 20,
                                background: 'white', borderRadius: '20px', padding: '16px 24px',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.2)', maxWidth: '320px',
                                animation: 'speechBubble 0.4s ease',
                                fontSize: '17px', color: '#1e293b', fontWeight: '600'
                            }}>
                                {scene.subtitle}
                                <div style={{ position: 'absolute', bottom: '-10px', left: '24px', width: '20px', height: '20px', background: 'white', transform: 'rotate(45deg)', borderRadius: '3px' }}></div>
                            </div>
                        )}

                        {/* Status badge */}
                        <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', padding: '10px 20px', borderRadius: '24px', zIndex: 20, border: '1px solid rgba(255,255,255,0.15)' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: simStatus === 'running' ? '#ef4444' : (simStatus === 'success' ? '#10b981' : '#f59e0b'), animation: simStatus === 'running' ? 'pulse 1s infinite' : 'none' }}></div>
                            <span style={{ color: 'white', fontSize: '15px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                {simStatus === 'running' ? `Step ${Math.min(simStep + 1, sequence.length)} / ${sequence.length}` : (simStatus === 'success' ? '✓ Complete' : '✕ Failed')}
                            </span>
                        </div>

                        {/* Scene title overlay */}
                        <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 20, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', padding: '10px 28px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.15)' }}>
                            <span style={{ color: scene.color, fontSize: '18px', fontWeight: 'bold' }}>{scene.title}</span>
                        </div>

                        {/* Progress dots */}
                        <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 20, background: 'rgba(0,0,0,0.4)', padding: '10px 20px', borderRadius: '20px' }}>
                            {sequence.map((s, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: i === simStep && simStatus === 'running' ? '28px' : '12px', height: '12px', borderRadius: '6px', background: i < simStep ? '#10b981' : (i === simStep && simStatus === 'running' ? '#fbbf24' : 'rgba(255,255,255,0.2)'), transition: 'all 0.4s ease' }}></div>
                                </div>
                            ))}
                        </div>
                        
                        </div>{/* End Video Frame */}
                    </div>{/* End Left Scene Container */}

                    {/* ─── Right: Execution Log ────────────── */}
                    <div style={{ width: '380px', background: '#0f172a', borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)' }}>
                            <h3 style={{ margin: 0, color: '#818cf8', fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Execution Log</h3>
                        </div>
                        <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {simLog.map((log, i) => (
                                <div key={i} className="mod3-log-entry" style={{
                                    background: log.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.08)',
                                    borderLeft: `4px solid ${log.type === 'error' ? '#ef4444' : '#10b981'}`,
                                    color: 'white', fontSize: '15px'
                                }}>
                                    {log.text}
                                </div>
                            ))}
                            {simStatus === 'running' && simStep < sequence.length && (
                                <div className="mod3-log-entry" style={{ background: 'rgba(99,102,241,0.1)', borderLeft: '4px solid #6366f1', color: '#a5b4fc', animation: 'pulse 1.5s infinite', fontSize: '15px' }}>
                                    ⏳ {sequence[simStep].label}...
                                </div>
                            )}
                            {simLog.length === 0 && simStatus !== 'running' && (
                                <div style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px', fontStyle: 'italic', fontSize: '14px' }}>
                                    Waiting for execution...
                                </div>
                            )}
                        </div>
                        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
                            {simStatus === 'running' && (
                                <div style={{ color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic', fontSize: '14px' }}>Algorithm running...</div>
                            )}
                            {simStatus === 'failed' && (
                                <div>
                                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
                                        <strong style={{ color: '#fca5a5', fontSize: '15px' }}>{failReason?.title}</strong>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '6px 0 0 0', lineHeight: '1.5' }}>{failReason?.desc}</p>
                                    </div>
                                    <button onClick={() => { resetAll(); setPhase('SEQUENCE'); }} style={{ width: '100%', padding: '16px', background: '#ef4444', color: 'white', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 16px rgba(239,68,68,0.3)' }}>
                                        🛠️ Fix Algorithm
                                    </button>
                                </div>
                            )}
                            {simStatus === 'success' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '28px', marginBottom: '6px' }}>🏆</div>
                                        <strong style={{ color: '#6ee7b7', fontSize: '16px' }}>Master Planner Badge</strong>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '6px 0 0 0' }}>Decomposition ✓ · Sequencing ✓ · No Bugs ✓</p>
                                    </div>
                                    <button onClick={() => { resetAll(); setPhase('LEARN'); }} style={{ width: '100%', padding: '14px', background: '#10b981', color: 'white', fontSize: '15px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 16px rgba(16,185,129,0.3)' }}>
                                        🔄 Play Again
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
