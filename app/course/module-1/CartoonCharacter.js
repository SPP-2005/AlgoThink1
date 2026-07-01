import React, { useEffect, useState } from 'react';

export default function CartoonCharacter({
    status, // 'idle', 'walking', 'confused', 'success', 'failure'
    bag,
    socks,
    shoes,
    awake,
    brushed,
    eaten
}) {
    // We use a slight delay for state changes to allow CSS transitions to smooth out
    const [renderedStatus, setRenderedStatus] = useState(status);
    
    useEffect(() => {
        setRenderedStatus(status);
    }, [status]);

    // Base styles for parts
    const transitionStyles = { transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' };
    
    // Derived states
    const isWalking = renderedStatus === 'walking';
    const isIdle = renderedStatus === 'idle';
    const isConfused = renderedStatus === 'confused';
    const isSuccess = renderedStatus === 'success';
    const isFailure = renderedStatus === 'failure';

    // Transformations based on state
    // Body bobbing
    let bodyY = 0;
    if (isFailure) bodyY = 10; // slumped
    if (isSuccess) bodyY = -15; // jumping

    // Head rotation
    let headRot = 0;
    if (isFailure) headRot = 25; // looking down
    if (isConfused) headRot = -15; // tilting head
    if (isSuccess) headRot = -10; // looking up slightly
    if (!awake) headRot = 30; // head slumped

    // Arm rotations
    let leftArmRot = 0;
    let rightArmRot = 0;
    if (isIdle) { leftArmRot = 5; rightArmRot = -5; }
    if (isFailure) { leftArmRot = -20; rightArmRot = -100; /* facepalm */ }
    if (isConfused) { leftArmRot = 10; rightArmRot = -120; /* scratching head */ }
    if (isSuccess) { leftArmRot = -150; rightArmRot = 150; /* arms up cheer */ }

    // Leg rotations
    let leftLegRot = 0;
    let rightLegRot = 0;
    let leftLegY = 0;
    let rightLegY = 0;
    if (isFailure) { leftLegRot = -10; rightLegRot = 10; }
    if (isSuccess) { leftLegRot = -20; rightLegRot = 20; leftLegY = -5; rightLegY = -5; }

    return (
        <div style={{
            position: 'relative',
            width: '120px',
            height: '160px',
            ...transitionStyles
        }}>
            <style>{`
                @keyframes breathe {
                    0% { transform: scaleY(1) translateY(0); }
                    100% { transform: scaleY(1.02) translateY(-1px); }
                }
                @keyframes walkCycle {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-5px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes swingLeftArm {
                    0% { transform: rotate(20deg); }
                    100% { transform: rotate(-30deg); }
                }
                @keyframes swingRightArm {
                    0% { transform: rotate(-30deg); }
                    100% { transform: rotate(20deg); }
                }
                @keyframes swingLeftLeg {
                    0% { transform: rotate(-30deg); }
                    100% { transform: rotate(30deg); }
                }
                @keyframes swingRightLeg {
                    0% { transform: rotate(30deg); }
                    100% { transform: rotate(-30deg); }
                }
                .anim-idle { animation: breathe 1.5s infinite alternate ease-in-out; }
                .anim-walk { animation: walkCycle 0.5s infinite linear; }
                .anim-walk-arm-l { animation: swingLeftArm 0.5s infinite alternate ease-in-out; }
                .anim-walk-arm-r { animation: swingRightArm 0.5s infinite alternate ease-in-out; }
                .anim-walk-leg-l { animation: swingLeftLeg 0.5s infinite alternate ease-in-out; }
                .anim-walk-leg-r { animation: swingRightLeg 0.5s infinite alternate ease-in-out; }
            `}</style>

            <svg viewBox="0 0 100 140" width="100%" height="100%" style={{ overflow: 'visible' }}>
                <g style={{ ...transitionStyles, transform: `translateY(${bodyY}px)` }} className={isWalking ? 'anim-walk' : isIdle ? 'anim-idle' : ''}>
                    
                    {/* BACKPACK */}
                    <g style={{ ...transitionStyles, opacity: bag ? 1 : 0, transform: 'translate(10px, 35px)' }}>
                        <rect x="0" y="0" width="30" height="40" rx="8" fill="#10b981" />
                        <rect x="-2" y="10" width="6" height="20" rx="3" fill="#059669" />
                        <rect x="26" y="10" width="6" height="20" rx="3" fill="#059669" />
                    </g>

                    {/* RIGHT ARM (Behind body) */}
                    <g style={{ ...transitionStyles, transformOrigin: '55px 45px', transform: `rotate(${isWalking ? 0 : rightArmRot}deg)` }} className={isWalking ? 'anim-walk-arm-r' : ''}>
                        {/* Sleeve */}
                        <path d="M 55 40 L 70 65 L 60 70 L 45 45 Z" fill="#2563eb" rx="5" />
                        {/* Skin */}
                        <path d="M 60 70 L 70 65 L 75 80 L 65 85 Z" fill="#fcd34d" />
                        {/* Hand */}
                        <circle cx="70" cy="85" r="7" fill="#fcd34d" />
                    </g>

                    {/* RIGHT LEG */}
                    <g style={{ ...transitionStyles, transformOrigin: '55px 80px', transform: `translate(0, ${rightLegY}px) rotate(${isWalking ? 0 : rightLegRot}deg)` }} className={isWalking ? 'anim-walk-leg-r' : ''}>
                        {/* Pants */}
                        <path d="M 50 80 L 60 80 L 65 110 L 50 110 Z" fill="#475569" />
                        {/* Socks */}
                        <g style={{ ...transitionStyles, opacity: socks ? 1 : 0 }}>
                            <rect x="52" y="110" width="11" height="8" fill="#ffffff" />
                        </g>
                        {/* Shoes / Feet */}
                        <g style={{ ...transitionStyles, transform: 'translate(0, 5px)' }}>
                            {shoes ? (
                                <path d="M 50 110 L 65 110 L 70 120 L 45 120 Z" fill="#ef4444" />
                            ) : (
                                <path d="M 52 110 L 63 110 L 67 118 L 50 118 Z" fill="#fcd34d" />
                            )}
                        </g>
                    </g>

                    {/* LEFT LEG */}
                    <g style={{ ...transitionStyles, transformOrigin: '40px 80px', transform: `translate(0, ${leftLegY}px) rotate(${isWalking ? 0 : leftLegRot}deg)` }} className={isWalking ? 'anim-walk-leg-l' : ''}>
                        {/* Pants */}
                        <path d="M 35 80 L 45 80 L 45 110 L 30 110 Z" fill="#334155" />
                        {/* Socks */}
                        <g style={{ ...transitionStyles, opacity: socks ? 1 : 0 }}>
                            <rect x="33" y="110" width="11" height="8" fill="#e2e8f0" />
                        </g>
                        {/* Shoes / Feet */}
                        <g style={{ ...transitionStyles, transform: 'translate(0, 5px)' }}>
                            {shoes ? (
                                <path d="M 30 110 L 45 110 L 50 120 L 25 120 Z" fill="#dc2626" />
                            ) : (
                                <path d="M 32 110 L 43 110 L 47 118 L 30 118 Z" fill="#fbbf24" />
                            )}
                        </g>
                    </g>

                    {/* BODY / TORSO */}
                    <rect x="30" y="40" width="35" height="45" rx="10" fill="#3b82f6" />
                    {/* Shirt Collar/Detail */}
                    <path d="M 40 40 L 55 40 L 47.5 50 Z" fill="#ffffff" />
                    <circle cx="47.5" cy="55" r="2" fill="#ffffff" />
                    <circle cx="47.5" cy="65" r="2" fill="#ffffff" />

                    {/* LEFT ARM */}
                    <g style={{ ...transitionStyles, transformOrigin: '40px 45px', transform: `rotate(${isWalking ? 0 : leftArmRot}deg)` }} className={isWalking ? 'anim-walk-arm-l' : ''}>
                        {/* Sleeve */}
                        <path d="M 40 40 L 25 65 L 35 70 L 50 45 Z" fill="#2563eb" rx="5" />
                        {/* Skin */}
                        <path d="M 25 65 L 35 70 L 30 85 L 20 80 Z" fill="#fcd34d" />
                        {/* Hand */}
                        <circle cx="25" cy="85" r="7" fill="#fcd34d" />
                        
                        {/* Apple in hand if eaten */}
                        <g style={{ ...transitionStyles, opacity: eaten ? 1 : 0, transform: 'translate(-5px, 75px)' }}>
                            <circle cx="25" cy="15" r="6" fill="#ef4444" />
                            <path d="M 25 9 Q 28 5 30 9" fill="none" stroke="#22c55e" strokeWidth="2" />
                        </g>
                    </g>

                    {/* HEAD */}
                    <g style={{ ...transitionStyles, transformOrigin: '47.5px 35px', transform: `rotate(${headRot}deg)` }}>
                        {/* Neck */}
                        <rect x="42" y="32" width="11" height="10" fill="#f59e0b" />
                        
                        {/* Face/Head Shape (Modern proportions - wide/large) */}
                        <rect x="25" y="0" width="45" height="38" rx="16" fill="#fcd34d" />
                        
                        {/* Hair */}
                        <path d="M 22 15 C 20 -5, 75 -5, 73 15 C 70 5, 25 5, 22 15 Z" fill="#431407" />
                        <path d="M 30 0 L 25 10 L 35 5 Z" fill="#431407" />
                        <path d="M 65 0 L 70 10 L 60 5 Z" fill="#431407" />

                        {/* Eyes */}
                        {awake ? (
                            <g>
                                <circle cx="36" cy="20" r="3.5" fill="#1e293b" />
                                <circle cx="59" cy="20" r="3.5" fill="#1e293b" />
                                {/* Eye highlights */}
                                <circle cx="37" cy="19" r="1" fill="#ffffff" />
                                <circle cx="60" cy="19" r="1" fill="#ffffff" />
                                {/* Eyebrows */}
                                <path d={isConfused ? "M 32 14 Q 36 12 40 14" : isFailure ? "M 32 16 Q 36 12 40 16" : "M 32 15 Q 36 14 40 15"} fill="none" stroke="#431407" strokeWidth="2" strokeLinecap="round" style={transitionStyles} />
                                <path d={isConfused ? "M 55 12 Q 59 10 63 12" : isFailure ? "M 55 16 Q 59 12 63 16" : "M 55 15 Q 59 14 63 15"} fill="none" stroke="#431407" strokeWidth="2" strokeLinecap="round" style={transitionStyles} />
                            </g>
                        ) : (
                            <g>
                                {/* Sleeping eyes */}
                                <path d="M 32 20 Q 36 23 40 20" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                                <path d="M 55 20 Q 59 23 63 20" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                                {/* Zzzs */}
                                <text x="75" y="10" fontSize="14" fill="#1e293b" fontWeight="bold">z</text>
                                <text x="85" y="0" fontSize="10" fill="#1e293b" fontWeight="bold">z</text>
                            </g>
                        )}

                        {/* Mouth */}
                        <g style={transitionStyles}>
                            {isFailure ? (
                                <path d="M 42 28 Q 47 25 53 28" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                            ) : isSuccess ? (
                                <path d="M 40 26 Q 47 32 55 26" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                            ) : isConfused ? (
                                <path d="M 44 28 L 51 28" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                            ) : (
                                <path d="M 42 27 Q 47 30 53 27" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                            )}
                        </g>

                        {/* Minty Sparkle (Brushed Teeth) */}
                        <g style={{ ...transitionStyles, opacity: brushed ? 1 : 0 }}>
                            <path d="M 50 25 Q 53 22 53 25 Q 56 25 53 28 Q 53 31 50 28 Q 47 28 50 25" fill="#67e8f9" />
                        </g>
                        
                        {/* Confused Question Mark */}
                        <g style={{ ...transitionStyles, opacity: isConfused ? 1 : 0, transform: 'translate(60px, -20px)' }}>
                            <text x="0" y="20" fontSize="30" fill="#ef4444" fontWeight="bold" className="anim-idle">?</text>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
}
