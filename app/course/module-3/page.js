"use client";
import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useFBX, useAnimations } from '@react-three/drei';

// ==========================================
// 3D GAME COMPONENTS & LOGIC
// ==========================================

// Pre-define the coordinates for each algorithmic action
const LOCATIONS = {
    start: { x: 0, z: 0 },
    book_venue: { x: 2, z: 0 },
    hire_vols: { x: 4, z: 2 },
    order_food: { x: 0, z: 2 },
    marketing: { x: 2, z: 2 },
    open_gates: { x: 2, z: 4 }
};

const ALGO_BLOCKS = [
    { id: 'book_venue', label: 'Book Venue', icon: '🏟️' },
    { id: 'hire_vols', label: 'Hire Volunteers', icon: '🙋' },
    { id: 'order_food', label: 'Order Food', icon: '🍔' },
    { id: 'marketing', label: 'Launch Marketing', icon: '📢' },
    { id: 'open_gates', label: 'Open Gates', icon: '🎟️' }
];

// The AAA Character loaded from the user's Mixamo FBX files!
function AnimatedCharacter({ targetX, targetZ, animState }) {
    const group = useRef();
    
    // Load all the user's FBX files!
    const idleFbx = useFBX('/Idle.fbx');
    const walkFbx = useFBX('/Walking.fbx');
    const victoryFbx = useFBX('/Victory.fbx');
    const defeatFbx = useFBX('/Defeat.fbx');
    const typeFbx = useFBX('/Typing.fbx');

    // Extract and rename animations so they don't all say "mixamo.com"
    const animations = useMemo(() => {
        const anims = [];
        if (idleFbx.animations.length) { const a = idleFbx.animations[0].clone(); a.name = "IDLE"; anims.push(a); }
        if (walkFbx.animations.length) { const a = walkFbx.animations[0].clone(); a.name = "WALK"; anims.push(a); }
        if (victoryFbx.animations.length) { const a = victoryFbx.animations[0].clone(); a.name = "VICTORY"; anims.push(a); }
        if (defeatFbx.animations.length) { const a = defeatFbx.animations[0].clone(); a.name = "DEFEAT"; anims.push(a); }
        if (typeFbx.animations.length) { const a = typeFbx.animations[0].clone(); a.name = "INTERACT"; anims.push(a); }
        return anims;
    }, [idleFbx, walkFbx, victoryFbx, defeatFbx, typeFbx]);

    const { actions } = useAnimations(animations, group);

    // Animation Controller
    useEffect(() => {
        if (actions && actions[animState]) {
            actions[animState].reset().fadeIn(0.2).play();
            return () => actions[animState]?.fadeOut(0.2);
        }
    }, [animState, actions]);

    // Physics & Movement Controller
    useFrame((state, delta) => {
        if(group.current) {
            const currentX = group.current.position.x;
            const currentZ = group.current.position.z;
            
            // Calculate distance to target
            const dx = targetX - currentX;
            const dz = targetZ - currentZ;
            const distance = Math.sqrt(dx*dx + dz*dz);
            
            // Smoothly move towards target if walking
            if (animState === 'WALK' && distance > 0.05) {
                group.current.position.x += (dx / distance) * delta * 2; // speed
                group.current.position.z += (dz / distance) * delta * 2;
                
                // Rotate to face walking direction
                const targetRot = Math.atan2(dx, dz);
                const targetQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), targetRot);
                group.current.quaternion.slerp(targetQuat, delta * 10);
            } else if (animState === 'DEFEAT') {
                // Turn to face the camera in shame
                const targetQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), 0);
                group.current.quaternion.slerp(targetQuat, delta * 5);
            } else if (animState === 'VICTORY') {
                // Turn towards the "Gates"
                const targetQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI);
                group.current.quaternion.slerp(targetQuat, delta * 5);
            }
        }
    });

    return (
        <group ref={group} position={[LOCATIONS.start.x, 0, LOCATIONS.start.z]} scale={0.015} castShadow>
            {/* We render the mesh from the Idle FBX, but apply animations from the others! */}
            <primitive object={idleFbx} />
        </group>
    );
}

// Procedural Festival Ground Environment
function FestivalGround() {
    return (
        <group>
            {/* Main Ground */}
            <mesh position={[2, -0.1, 2]} receiveShadow>
                <boxGeometry args={[10, 0.2, 10]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            
            {/* Grid Pathways */}
            {[0,1,2,3,4].map(x => (
                <mesh key={`px-${x}`} position={[x, -0.04, 2]} receiveShadow>
                    <boxGeometry args={[0.8, 0.02, 10]} />
                    <meshStandardMaterial color="#334155" />
                </mesh>
            ))}
            {[0,1,2,3,4].map(z => (
                <mesh key={`pz-${z}`} position={[2, -0.04, z]} receiveShadow>
                    <boxGeometry args={[10, 0.02, 0.8]} />
                    <meshStandardMaterial color="#334155" />
                </mesh>
            ))}

            {/* Venue Building (x:2, z:0) */}
            <group position={[2, 0, -1]}>
                <mesh position={[0, 1, 0]} castShadow receiveShadow>
                    <boxGeometry args={[2, 2, 1.5]} />
                    <meshStandardMaterial color="#3b82f6" />
                </mesh>
                <mesh position={[0, 2.5, 0]}>
                    <coneGeometry args={[1.5, 1, 4]} />
                    <meshStandardMaterial color="#1e3a8a" />
                </mesh>
            </group>

            {/* Food Stalls (x:0, z:2) */}
            <group position={[-1, 0, 2]}>
                <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="#f59e0b" />
                </mesh>
                <mesh position={[0, 1.2, 0]}>
                    <coneGeometry args={[0.8, 0.5, 4]} />
                    <meshStandardMaterial color="#b45309" />
                </mesh>
            </group>

            {/* Volunteers Tent (x:4, z:2) */}
            <group position={[5, 0, 2]}>
                <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="#10b981" />
                </mesh>
                <mesh position={[0, 1.2, 0]}>
                    <coneGeometry args={[0.8, 0.5, 4]} />
                    <meshStandardMaterial color="#047857" />
                </mesh>
            </group>

            {/* The Main Gates (x:2, z:4) */}
            <group position={[2, 0, 5]}>
                <mesh position={[-1, 1, 0]} castShadow>
                    <boxGeometry args={[0.5, 2, 0.5]} />
                    <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
                </mesh>
                <mesh position={[1, 1, 0]} castShadow>
                    <boxGeometry args={[0.5, 2, 0.5]} />
                    <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
                </mesh>
                <mesh position={[0, 2.2, 0]} castShadow>
                    <boxGeometry args={[2.5, 0.4, 0.5]} />
                    <meshStandardMaterial color="#e2e8f0" metalness={0.8} />
                </mesh>
                {/* Glowing gate field */}
                <mesh position={[0, 1, 0]}>
                    <boxGeometry args={[1.5, 2, 0.1]} />
                    <meshStandardMaterial color="#10b981" transparent opacity={0.3} emissive="#10b981" emissiveIntensity={2} />
                </mesh>
            </group>
        </group>
    );
}

// ==========================================
// MAIN UI COMPONENT
// ==========================================
export default function Module3() {
    const [algorithm, setAlgorithm] = useState([]);
    const [simState, setSimState] = useState('IDLE'); // IDLE, RUNNING, SUCCESS, FAILED
    const [failMessage, setFailMessage] = useState('');
    
    // Character State
    const [targetPos, setTargetPos] = useState(LOCATIONS.start);
    const [animState, setAnimState] = useState('IDLE'); // IDLE, WALK, INTERACT, VICTORY, DEFEAT

    const resetSim = () => {
        setTargetPos(LOCATIONS.start);
        setAnimState('IDLE');
        setSimState('IDLE');
        setFailMessage('');
    };

    const toggleSequenceItem = (block) => {
        if(simState !== 'IDLE') resetSim();
        if (algorithm.find(s => s.id === block.id)) {
            setAlgorithm(algorithm.filter(s => s.id !== block.id));
        } else {
            setAlgorithm([...algorithm, block]);
        }
    };

    // Execution Logic
    useEffect(() => {
        if (simState === 'RUNNING') {
            let step = 0;
            
            const executeNextBlock = () => {
                if (step >= algorithm.length) {
                    // Check completion
                    if (algorithm.length === ALGO_BLOCKS.length && !failMessage) {
                        setAnimState('VICTORY');
                        setSimState('SUCCESS');
                    } else {
                        setAnimState('DEFEAT');
                        setSimState('FAILED');
                        setFailMessage(`Algorithm halted. Sequence incomplete or logic error occurred.`);
                    }
                    return;
                }

                const currentAction = algorithm[step];
                let error = null;

                // --- ALGORITHMIC LOGIC CHECKS ---
                if (currentAction.id !== 'book_venue' && !algorithm.slice(0, step).find(s => s.id === 'book_venue')) {
                    error = `You tried to execute '${currentAction.label}' without a venue! You must book a venue first.`;
                }
                else if (currentAction.id === 'open_gates' && step < 4) {
                    error = `Premature Execution! You opened the gates before the festival was fully prepped.`;
                }
                else if (currentAction.id === 'marketing' && !algorithm.slice(0, step).find(s => s.id === 'book_venue')) {
                    error = `You launched marketing but couldn't tell anyone WHERE the event is!`;
                }

                if (error) {
                    setFailMessage(`CRITICAL ERROR: ${error}`);
                    setAnimState('DEFEAT');
                    setSimState('FAILED');
                    return;
                }

                // If valid, walk to location
                const destination = LOCATIONS[currentAction.id];
                setTargetPos(destination);
                setAnimState('WALK');

                // Wait for walking to finish (simulated by timeout), then play INTERACT
                setTimeout(() => {
                    if (simState !== 'IDLE') { // Ensure they didn't reset
                        setAnimState(currentAction.id === 'open_gates' ? 'VICTORY' : 'INTERACT');
                        
                        // Wait for interaction to finish, then go next
                        setTimeout(() => {
                            if (simState !== 'IDLE') {
                                step++;
                                executeNextBlock();
                            }
                        }, 2000);
                    }
                }, 2500); // 2.5s walk time
            };

            // Start loop
            executeNextBlock();
        }
    }, [simState]);

    return (
        <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', color: 'white' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>AlgoThink <span style={{ color: '#6366f1' }}>3D Mission</span></div>
                <Link href="/dashboard" style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none', borderRadius: '8px' }}>⬅️ Dashboard</Link>
            </header>

            <div style={{ display: 'flex', gap: '30px', height: '75vh' }}>
                
                {/* LEFT: ALGORITHM BUILDER UI */}
                <div style={{ width: '400px', background: '#0f172a', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Festival Logistics</h2>
                    <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '30px' }}>Arrange the action blocks in the correct logical sequence. Order matters.</p>
                    
                    <h3 style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Available Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
                        {ALGO_BLOCKS.map(block => {
                            const isUsed = algorithm.find(s => s.id === block.id);
                            return (
                                <button 
                                    key={block.id} 
                                    onClick={() => toggleSequenceItem(block)} 
                                    style={{ padding: '12px', background: isUsed ? '#334155' : '#1e293b', border: `1px solid ${isUsed ? '#0f172a' : '#475569'}`, borderRadius: '8px', color: 'white', cursor: 'pointer', textAlign: 'left', display: 'flex', gap: '10px', opacity: isUsed ? 0.4 : 1, transition: 'all 0.2s' }}
                                >
                                    <span style={{ fontSize: '20px' }}>{block.icon}</span> <strong style={{ alignSelf: 'center' }}>{block.label}</strong>
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ flex: 1, background: '#020617', borderRadius: '12px', border: '1px solid #1e293b', padding: '20px', overflowY: 'auto' }}>
                        <h3 style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Execution Pipeline</h3>
                        {algorithm.length === 0 && <p style={{ color: '#334155', textAlign: 'center', fontStyle: 'italic', marginTop: '40px' }}>Pipeline empty.</p>}
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {algorithm.map((cmd, idx) => (
                                <div key={cmd.id} onClick={() => toggleSequenceItem(cmd)} style={{ background: '#059669', padding: '12px 16px', borderRadius: '8px', border: '1px solid #34d399', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)' }}>
                                    <span>{idx + 1}.</span> <span>{cmd.icon}</span> <span style={{ fontWeight: 'bold' }}>{cmd.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                        <button onClick={() => {setAlgorithm([]); resetSim();}} style={{ flex: 1, padding: '16px', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Clear</button>
                        <button onClick={() => { resetSim(); setSimState('RUNNING'); }} disabled={algorithm.length === 0 || simState === 'RUNNING'} style={{ flex: 2, padding: '16px', background: algorithm.length > 0 && simState !== 'RUNNING' ? '#10b981' : '#334155', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: algorithm.length > 0 && simState !== 'RUNNING' ? 'pointer' : 'not-allowed', transition: 'all 0.2s', boxShadow: algorithm.length > 0 && simState !== 'RUNNING' ? '0 4px 15px rgba(16, 185, 129, 0.4)' : 'none' }}>
                            ▶️ EXECUTE
                        </button>
                    </div>
                </div>

                {/* RIGHT: 3D ENGINE */}
                <div style={{ flex: 1, position: 'relative', borderRadius: '24px', overflow: 'hidden', background: '#87CEEB', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)' }}>
                    
                    {/* Status Overlays */}
                    {simState === 'FAILED' && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(239, 68, 68, 0.2)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                            <h1 style={{ color: '#ef4444', fontSize: '64px', fontWeight: 'bold', textShadow: '0 4px 20px rgba(0,0,0,0.5)', marginBottom: '10px' }}>MISSION FAILED</h1>
                            <p style={{ fontSize: '20px', background: 'rgba(0,0,0,0.8)', padding: '15px 30px', borderRadius: '12px', border: '1px solid #ef4444', maxWidth: '600px', textAlign: 'center' }}>{failMessage}</p>
                            <button onClick={resetSim} style={{ marginTop: '30px', padding: '12px 30px', background: '#ef4444', border: 'none', color: 'white', borderRadius: '8px', fontSize: '18px', cursor: 'pointer', fontWeight: 'bold' }}>Debug & Retry</button>
                        </div>
                    )}

                    {simState === 'SUCCESS' && (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(16, 185, 129, 0.2)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                            <div style={{ fontSize: '80px', marginBottom: '20px' }}>🏆</div>
                            <h1 style={{ color: '#10b981', fontSize: '56px', fontWeight: 'bold', textShadow: '0 4px 20px rgba(0,0,0,0.5)', marginBottom: '10px' }}>FESTIVAL SUCCESS</h1>
                            <p style={{ fontSize: '20px', background: 'rgba(0,0,0,0.8)', padding: '15px 30px', borderRadius: '12px', border: '1px solid #10b981' }}>Your sequence was flawless.</p>
                            <Link href="/course/module-4" style={{ marginTop: '30px', padding: '16px 40px', background: '#10b981', border: 'none', color: 'white', borderRadius: '12px', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.5)' }}>Proceed to Module 4 ➡️</Link>
                        </div>
                    )}

                    <Suspense fallback={<div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#1e293b', fontSize: '24px', fontWeight: 'bold' }}>Loading 3D Models...</div>}>
                        <Canvas camera={{ position: [2, 6, 8], fov: 45 }} shadows>
                            <color attach="background" args={['#87CEEB']} /> {/* Sky Blue */}
                            <ambientLight intensity={0.7} />
                            <directionalLight castShadow position={[5, 10, 5]} intensity={1.5} shadow-mapSize={[2048, 2048]} />
                            <Environment preset="city" />
                            
                            <FestivalGround />
                            
                            {/* The Mixamo Character loaded directly from FBX files */}
                            <AnimatedCharacter 
                                targetX={targetPos.x} 
                                targetZ={targetPos.z} 
                                animState={animState}
                            />

                            <ContactShadows position={[2, -0.04, 2]} opacity={0.4} scale={20} blur={2} far={4} />
                            <OrbitControls makeDefault target={[2, 0, 2]} maxPolarAngle={Math.PI / 2.1} minDistance={4} maxDistance={20} />
                        </Canvas>
                    </Suspense>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Link href="/course/module-2" style={{ padding: '12px 30px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', textDecoration: 'none' }}>⬅️ Previous: Module 2</Link>
                <Link href="/course/module-4" style={{ background: '#3b82f6', color: 'white', padding: '12px 30px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>Proceed to Module 4 ➡️</Link>
            </div>
        </main>
    );
}
