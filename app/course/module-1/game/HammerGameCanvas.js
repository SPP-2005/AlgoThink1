"use client";
import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';

const HammerGameCanvas = forwardRef(function HammerGameCanvas({ onStatusChange, onMessage }, ref) {
    const containerRef = useRef(null);
    const gameApiRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Keep latest callback refs to avoid stale closures
    const onStatusRef = useRef(onStatusChange);
    const onMessageRef = useRef(onMessage);
    useEffect(() => { onStatusRef.current = onStatusChange; }, [onStatusChange]);
    useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);

    useEffect(() => {
        let destroyed = false;

        async function initGame() {
            try {
                // Dynamically import Phaser (client-side only)
                const PhaserModule = await import('phaser');
                const Phaser = PhaserModule.default || PhaserModule;

                if (destroyed) return;

                // Dynamically import our game factory
                const { createHammerGame } = await import('./PhaserHammerGame');

                if (destroyed || !containerRef.current) return;

                // Create the game
                gameApiRef.current = createHammerGame(Phaser, containerRef.current, {
                    onStatusChange: (s) => onStatusRef.current?.(s),
                    onMessage: (m) => onMessageRef.current?.(m),
                });

                setLoading(false);
            } catch (err) {
                console.error('Failed to initialize Phaser Hammer game:', err);
                setError(err.message);
                setLoading(false);
            }
        }

        initGame();

        return () => {
            destroyed = true;
            if (gameApiRef.current) {
                gameApiRef.current.destroy();
                gameApiRef.current = null;
            }
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Expose API to parent via ref
    useImperativeHandle(ref, () => ({
        executeAlgorithm(steps) {
            if (gameApiRef.current) {
                gameApiRef.current.executeAlgorithm(steps);
            }
        },
        reset() {
            if (gameApiRef.current) {
                gameApiRef.current.reset();
            }
        }
    }));

    return (
        <div style={{ position: 'relative', width: '100%', marginBottom: '20px' }}>
            {/* Loading overlay */}
            {loading && !error && (
                <div style={{
                    width: '100%', height: '300px',
                    background: '#0f172a', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid #334155',
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '40px', height: '40px', border: '3px solid #334155',
                            borderTop: '3px solid #60a5fa', borderRadius: '50%',
                            animation: 'spin 1s linear infinite', margin: '0 auto 12px',
                        }} />
                        <div style={{ color: '#60a5fa', fontSize: '14px', fontFamily: 'Arial, sans-serif' }}>
                            Loading Hammer Engine...
                        </div>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div style={{
                    width: '100%', height: '300px',
                    background: '#0f172a', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid #ef4444',
                }}>
                    <div style={{ color: '#fca5a5', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
                        Failed to load hammer engine: {error}
                    </div>
                </div>
            )}

            {/* Phaser canvas container */}
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    aspectRatio: '3 / 1',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '2px solid #334155',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                    display: loading || error ? 'none' : 'block',
                }}
            />
        </div>
    );
});

export default HammerGameCanvas;
