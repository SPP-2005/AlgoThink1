'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Splash() {
    const router = useRouter();
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        // Phase 1: Logo fades in and loading bar starts
        const t1 = setTimeout(() => setPhase(1), 500);
        // Phase 2: Logo glows indicating completion
        const t2 = setTimeout(() => setPhase(2), 3500);
        // Phase 3: Transition to dashboard
        const t3 = setTimeout(() => {
            router.push('/dashboard');
        }, 4500);

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [router]);

    return (
        <main className={`splash-container phase-${phase}`}>
            <div className="splash-logo">
                <span className="bracket">[</span>
                <span className="text">AlgoThink</span>
                <span className="bracket">]</span>
            </div>
            <div className="loading-bar-container">
                <div className="loading-bar"></div>
            </div>
            <p className="system-msg">
                {phase === 0 ? '' : phase === 1 ? 'Initializing Logic Core...' : 'Booting Academy Interface...'}
            </p>
        </main>
    );
}
