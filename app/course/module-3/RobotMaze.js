'use client';
import React, { useState, useEffect } from 'react';

// Maze definition: 0=wall, 1=path, 2=start, 3=end
const MAZE = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 1, 1, 0, 1, 3, 0],
    [0, 0, 0, 1, 0, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

const AVAILABLE_ACTIONS = [
    { id: 'move_forward', label: 'Move Forward', icon: '⬆️' },
    { id: 'turn_right',   label: 'Turn Right',   icon: '➡️' },
    { id: 'turn_left',    label: 'Turn Left',    icon: '⬅️' },
    { id: 'loop_until',   label: 'Loop Until Wall', icon: '🔄' },
];

export default function RobotMaze({ onBack }) {
    const [sequence, setSequence] = useState([]);
    const [robotState, setRobotState] = useState({ x: 1, y: 1, dir: 'E' }); // E, S, W, N
    const [simStatus, setSimStatus] = useState('idle'); // idle, running, success, crashed
    const [message, setMessage] = useState("Program the robot to reach the green exit flag!");
    const [activeStep, setActiveStep] = useState(-1);

    const handleAdd = (action) => {
        if (simStatus !== 'running') {
            setSequence([...sequence, action]);
        }
    };

    const handleReset = () => {
        setSequence([]);
        setRobotState({ x: 1, y: 1, dir: 'E' });
        setSimStatus('idle');
        setMessage("Program the robot to reach the green exit flag!");
        setActiveStep(-1);
    };

    const runSimulation = async () => {
        if (sequence.length === 0) return;
        setSimStatus('running');
        setMessage("Executing sequence...");
        
        let currX = 1;
        let currY = 1;
        let currDir = 'E'; // 0=N, 1=E, 2=S, 3=W (using 'N', 'E', 'S', 'W' for logic)

        const getNextPos = (x, y, dir) => {
            if (dir === 'N') return { nx: x, ny: y - 1 };
            if (dir === 'E') return { nx: x + 1, ny: y };
            if (dir === 'S') return { nx: x, ny: y + 1 };
            if (dir === 'W') return { nx: x - 1, ny: y };
        };

        for (let i = 0; i < sequence.length; i++) {
            setActiveStep(i);
            const action = sequence[i];

            await new Promise(r => setTimeout(r, 600));

            if (action.id === 'move_forward') {
                const { nx, ny } = getNextPos(currX, currY, currDir);
                if (MAZE[ny][nx] === 0) {
                    setSimStatus('crashed');
                    setMessage(`💥 CRASH! The robot hit a wall at step ${i+1}.`);
                    return;
                }
                currX = nx; currY = ny;
            } else if (action.id === 'turn_right') {
                const dirs = ['N', 'E', 'S', 'W'];
                currDir = dirs[(dirs.indexOf(currDir) + 1) % 4];
            } else if (action.id === 'turn_left') {
                const dirs = ['N', 'E', 'S', 'W'];
                currDir = dirs[(dirs.indexOf(currDir) + 3) % 4];
            } else if (action.id === 'loop_until') {
                // Keep moving forward until wall
                while (true) {
                    const { nx, ny } = getNextPos(currX, currY, currDir);
                    if (MAZE[ny][nx] === 0) break; // Reached wall
                    currX = nx; currY = ny;
                    setRobotState({ x: currX, y: currY, dir: currDir });
                    await new Promise(r => setTimeout(r, 300));
                    if (MAZE[currY][currX] === 3) break; // Reached exit
                }
            }

            setRobotState({ x: currX, y: currY, dir: currDir });

            if (MAZE[currY][currX] === 3) {
                setSimStatus('success');
                setMessage("🎉 SUCCESS! The robot reached the exit!");
                return;
            }
        }

        if (MAZE[currY][currX] !== 3) {
            setSimStatus('crashed');
            setMessage("❌ Sequence finished, but robot didn't reach the exit.");
        }
    };

    const renderCell = (x, y, type) => {
        const isRobot = robotState.x === x && robotState.y === y;
        
        // Colors
        let bg = type === 0 ? '#1e293b' : '#334155'; // wall vs path
        let border = type === 0 ? '2px solid #0f172a' : '1px dashed #475569';
        
        if (type === 2) bg = '#3b82f6'; // Start
        if (type === 3) bg = '#10b981'; // End

        // Rotation for robot
        let rot = 0;
        if (robotState.dir === 'E') rot = 90;
        if (robotState.dir === 'S') rot = 180;
        if (robotState.dir === 'W') rot = -90;

        return (
            <div key={`${x}-${y}`} style={{ width: '100%', height: '100%', background: bg, border: border, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}>
                {type === 2 && !isRobot && <span style={{ fontSize: '24px', opacity: 0.5 }}>🏠</span>}
                {type === 3 && <span style={{ fontSize: '24px' }}>🏁</span>}
                {isRobot && (
                    <div style={{ position: 'absolute', width: '80%', height: '80%', zIndex: 10, transition: 'all 0.4s ease-in-out', transform: `rotate(${rot}deg)` }}>
                        <svg viewBox="0 0 100 100" width="100%" height="100%">
                            <rect x="20" y="20" width="60" height="60" fill="#fcd34d" rx="10" />
                            {/* Eyes */}
                            <circle cx="35" cy="40" r="8" fill="#1e293b" />
                            <circle cx="65" cy="40" r="8" fill="#1e293b" />
                            {/* Eye glow */}
                            <circle cx="35" cy="40" r="3" fill="#38bdf8" />
                            <circle cx="65" cy="40" r="3" fill="#38bdf8" />
                            {/* Antenna */}
                            <line x1="50" y1="20" x2="50" y2="5" stroke="#94a3b8" strokeWidth="4" />
                            <circle cx="50" cy="5" r="5" fill="#ef4444" />
                            {/* Direction indicator (Arrow pointing up relative to robot body) */}
                            <polygon points="50,15 40,30 60,30" fill="#ef4444" opacity="0.8" />
                        </svg>
                    </div>
                )}
            </div>
        );
    };

    return (
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
            <header style={{ marginBottom: '30px' }}>
                <div className="logo-text">AlgoThink <span>Module 3: Robot Maze</span></div>
                <button onClick={onBack} className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>🔙 Activities</button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '30px' }}>
                {/* Left Panel: Logic Blocks */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
                    <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#60a5fa' }}>Command Blocks</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>Click blocks to add them to your robot's program sequence.</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {AVAILABLE_ACTIONS.map(action => (
                            <button
                                key={action.id}
                                onClick={() => handleAdd(action)}
                                disabled={simStatus === 'running'}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    background: '#334155', border: '1px solid #475569', color: 'white',
                                    padding: '12px 16px', borderRadius: '8px', cursor: simStatus === 'running' ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s', fontSize: '16px'
                                }}
                                onMouseEnter={(e) => { if(simStatus !== 'running') e.currentTarget.style.background = '#475569'; }}
                                onMouseLeave={(e) => { if(simStatus !== 'running') e.currentTarget.style.background = '#334155'; }}
                            >
                                <span style={{ fontSize: '20px' }}>{action.icon}</span> {action.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#fcd34d' }}>Simulation Controls</h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={runSimulation} disabled={simStatus === 'running' || sequence.length === 0} className="btn btn-primary" style={{ flex: 1, padding: '10px', background: simStatus === 'running' ? '#64748b' : '#10b981' }}>▶ Run</button>
                            <button onClick={handleReset} disabled={simStatus === 'running'} className="btn" style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border)', color: 'white' }}>🔄 Reset</button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Code Sequence & Maze */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Sequence Display */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px dashed var(--border)', borderRadius: '12px', padding: '16px', minHeight: '80px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {sequence.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Your program sequence will appear here...</span>}
                        {sequence.map((action, idx) => (
                            <div key={idx} style={{ background: activeStep === idx ? '#f59e0b' : '#2563eb', color: 'white', padding: '8px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', boxShadow: activeStep === idx ? '0 0 15px rgba(245, 158, 11, 0.5)' : 'none', transition: 'all 0.2s' }}>
                                <span>{idx + 1}.</span> <span>{action.icon}</span> <span>{action.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Status Message */}
                    {message && (
                        <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', borderLeft: `4px solid ${simStatus === 'crashed' ? '#f87171' : simStatus === 'success' ? '#34d399' : '#3b82f6'}`, color: simStatus === 'crashed' ? '#fca5a5' : simStatus === 'success' ? '#6ee7b7' : 'white', fontWeight: 'bold' }}>
                            {message}
                        </div>
                    )}

                    {/* The Visual Maze */}
                    <div style={{ flex: 1, background: '#0f172a', borderRadius: '16px', border: '4px solid #1e293b', padding: '20px', position: 'relative', overflow: 'hidden' }}>
                        
                        {/* CSS Grid for Maze */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(7, 1fr)', gap: '4px', height: '100%', aspectRatio: '8/7', margin: '0 auto' }}>
                            {MAZE.map((row, y) => row.map((type, x) => renderCell(x, y, type)))}
                        </div>

                        {/* Error Overlay */}
                        {simStatus === 'crashed' && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'popIn 0.5s ease' }}>
                                <div style={{ fontSize: '80px', marginBottom: '10px' }}>🤖💥🧱</div>
                                <div style={{ background: '#ef4444', color: 'white', padding: '12px 24px', borderRadius: '12px', fontSize: '24px', fontWeight: '900', border: '4px solid white', textShadow: '2px 2px 0 #000' }}>
                                    CRITICAL FAILURE!
                                </div>
                            </div>
                        )}
                        {/* Success Overlay */}
                        {simStatus === 'success' && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(16, 185, 129, 0.8)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'popIn 0.5s ease' }}>
                                <div style={{ fontSize: '80px', marginBottom: '10px' }}>🤖🏁🏆</div>
                                <div style={{ background: '#059669', color: 'white', padding: '12px 24px', borderRadius: '12px', fontSize: '24px', fontWeight: '900', border: '4px solid white', textShadow: '2px 2px 0 #000' }}>
                                    MAZE COMPLETED!
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes popIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}} />
        </main>
    );
}
