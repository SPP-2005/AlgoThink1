import React, { useEffect, useState } from 'react';
import CartoonCharacter from './CartoonCharacter';

export default function SchoolAdventure({
    simStatus, // 'idle', 'running', 'success', 'crashed'
    simErrorType,
    kidPosition, // numerical percentage 0-100
    bag,
    socks,
    shoes,
    awake,
    brushed,
    eaten
}) {
    // We determine the character's internal status for animation based on movement and sim status.
    const [prevPos, setPrevPos] = useState(kidPosition);
    const [isWalking, setIsWalking] = useState(false);

    useEffect(() => {
        if (kidPosition !== prevPos) {
            setIsWalking(true);
            const timer = setTimeout(() => setIsWalking(false), 800); // Walk duration
            setPrevPos(kidPosition);
            return () => clearTimeout(timer);
        }
    }, [kidPosition, prevPos]);

    let charStatus = 'idle';
    if (isWalking) charStatus = 'walking';
    else if (simStatus === 'crashed') {
        if (simErrorType === 'missing_step') charStatus = 'confused';
        else charStatus = 'failure';
    }
    else if (simStatus === 'success') charStatus = 'success';

    return (
        <div style={{
            height: '340px',
            background: 'linear-gradient(to bottom, #1e293b, #0f172a)',
            borderRadius: '12px',
            border: '4px solid #334155',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            display: 'flex',
            width: '100%'
        }}>
            {/* The Environment Layout */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', borderBottom: '6px solid #475569' }}>
                
                {/* BEDROOM */}
                <div style={{ flex: '0 0 35%', background: '#4c1d95', position: 'relative', borderRight: '4px solid #334155' }}>
                    <div style={{ position: 'absolute', bottom: '6px', left: '5%', fontSize: '40px' }}>🛏️</div>
                    <div style={{ position: 'absolute', bottom: '6px', left: '25%', fontSize: '25px', opacity: socks ? 0 : 1 }}>🧦</div>
                    <div style={{ position: 'absolute', bottom: '6px', right: '10%', fontSize: '40px' }}>🪑📚</div>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}>BEDROOM</div>
                </div>

                {/* BATHROOM */}
                <div style={{ flex: '0 0 15%', background: '#0891b2', position: 'relative', borderRight: '4px solid #334155' }}>
                    <div style={{ position: 'absolute', bottom: '6px', left: '30%', fontSize: '40px' }}>🚰</div>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}>BATH</div>
                </div>

                {/* KITCHEN */}
                <div style={{ flex: '0 0 20%', background: '#b45309', position: 'relative', borderRight: '4px solid #334155' }}>
                    <div style={{ position: 'absolute', bottom: '6px', left: '30%', fontSize: '45px' }}>🥞🍽️</div>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}>KITCHEN</div>
                </div>

                {/* HALLWAY (Shoe rack + Door) */}
                <div style={{ flex: '0 0 15%', background: '#1e293b', position: 'relative', borderRight: '4px solid #334155' }}>
                    <div style={{ position: 'absolute', bottom: '6px', left: '20%', fontSize: '30px' }}>👟👢</div>
                    <div style={{ position: 'absolute', bottom: '6px', right: '5%', fontSize: '60px' }}>🚪</div>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}>EXIT</div>
                </div>

                {/* OUTSIDE / SCHOOL */}
                <div style={{ flex: '0 0 15%', background: 'linear-gradient(to bottom, #38bdf8, #bae6fd)', position: 'relative' }}>
                    <div style={{ position: 'absolute', bottom: '6px', right: '10%', fontSize: '60px' }}>🏫</div>
                    <div style={{ position: 'absolute', bottom: '6px', left: '0', width: '100%', height: '10px', background: '#22c55e' }}></div>
                    <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'rgba(0,0,0,0.3)', fontWeight: 'bold' }}>SCHOOL</div>
                </div>
            </div>

            {/* The Character */}
            <div style={{
                position: 'absolute',
                bottom: '12px',
                left: `${kidPosition}%`,
                transform: 'translateX(-50%)',
                transition: 'left 0.8s linear',
                zIndex: 10
            }}>
                <CartoonCharacter
                    status={charStatus}
                    bag={bag}
                    socks={socks}
                    shoes={shoes}
                    awake={awake}
                    brushed={brushed}
                    eaten={eaten}
                />
            </div>

            {/* Error Overlay */}
            {simErrorType && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                    <div style={{ fontSize: '70px', marginBottom: '10px' }}>
                        {simErrorType === 'asleep' && '😴'}
                        {simErrorType === 'socks_over_shoes' && '👟🧦'}
                        {simErrorType === 'no_socks' && '🔥🦶'}
                        {simErrorType === 'barefoot' && '🦶🚫'}
                        {simErrorType === 'no_bag' && '🎒❓'}
                        {simErrorType === 'no_hygiene' && '🤢🦷'}
                        {simErrorType === 'missing_step' && '🤔'}
                    </div>
                    <div style={{ background: '#ef4444', color: 'white', padding: '16px 24px', borderRadius: '12px', border: '3px solid white', textAlign: 'center', maxWidth: '85%', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                        <h3 style={{ fontSize: '24px', fontWeight: '900', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                            {simErrorType === 'asleep' && 'WAKE UP FIRST!'}
                            {simErrorType === 'socks_over_shoes' && 'SOCKS GO INSIDE SHOES!'}
                            {simErrorType === 'no_socks' && 'OUCH! BLISTERS!'}
                            {simErrorType === 'barefoot' && 'YOU ARE BAREFOOT!'}
                            {simErrorType === 'no_bag' && 'FORGOT YOUR BAG!'}
                            {simErrorType === 'no_hygiene' && 'GROSS! YOU STINK!'}
                            {simErrorType === 'missing_step' && 'YOU MISSED SOMETHING!'}
                        </h3>
                        <p style={{ fontSize: '16px', margin: 0, fontWeight: 'normal', opacity: 0.9 }}>
                            {simErrorType === 'asleep' && "You can't execute algorithms in your sleep. Add the 'Wake up' step first!"}
                            {simErrorType === 'socks_over_shoes' && "You tried putting socks on top of your shoes! That doesn't make any sense."}
                            {simErrorType === 'no_socks' && "You put your shoes on without socks! That's going to cause painful blisters."}
                            {simErrorType === 'barefoot' && "You tried walking outside without shoes! You need to protect your feet."}
                            {simErrorType === 'no_bag' && "You can't go to school without your bag. You forgot a crucial step!"}
                            {simErrorType === 'no_hygiene' && "You skipped eating or brushing your teeth! Always maintain good hygiene."}
                            {simErrorType === 'missing_step' && "Your sequence finished, but you didn't successfully prepare for school."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
