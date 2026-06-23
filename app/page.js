'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Splash() {
    const router = useRouter();
    const [animateOut, setAnimateOut] = useState(false);

    useEffect(() => {
        // Pop-in animation triggers instantly on mount via CSS
        // Trigger fade out at 2.2 seconds
        const t1 = setTimeout(() => {
            setAnimateOut(true);
        }, 2200);

        // Redirect at 2.8 seconds
        const t2 = setTimeout(() => {
            router.push('/dashboard');
        }, 2800);

        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [router]);

    return (
        <main className={`splash-container-new ${animateOut ? 'fade-out' : ''}`}>
            <div className="logo-pop-container">
                <div className="logo-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                        <polyline points="2 17 12 22 22 17"></polyline>
                        <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                </div>
                <div className="logo-text-new">
                    Algo<span>Think</span>
                </div>
            </div>
        </main>
    );
}
