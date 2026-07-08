'use client';
import Link from 'next/link';

export default function AdvancedDashboard() {
    return (
        <main className="container">
            <header>
                <div className="logo-text">Algo<span className="logo-highlight">Think</span> <span className="logo-suffix">Advanced</span></div>
                <Link href="/" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>🔙 Change Track</Link>
            </header>

            <div className="panel">
                <div>
                    <h2 className="panel-title">Advanced Curriculum (Grades 9-12)</h2>
                    <p className="panel-subtitle">Explore the world of Data Structures, Algorithms, and how they power everything around you.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Module 1: Data Structures */}
                    <div className="challenge-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px', background: 'rgba(16, 185, 129, 0.15)', borderLeftColor: '#10b981', padding: '30px' }}>
                        <div>
                            <h3 style={{ color: '#34d399', fontSize: '22px', marginBottom: '8px' }}>Module 1: What Are Data Structures?</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Learn how computers organize data using Arrays, Stacks, Queues, and Linked Lists — with real-life analogies you already understand.</p>
                        </div>
                        <Link href="/course/adv-module-1" className="btn btn-primary" style={{ width: 'auto', background: '#10b981', padding: '12px 30px' }}>Start Module 1</Link>
                    </div>

                    {/* Module 2: Algorithms That Power Your World */}
                    <div className="challenge-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px', background: 'rgba(56, 189, 248, 0.15)', borderLeftColor: '#38bdf8', padding: '30px' }}>
                        <div>
                            <h3 style={{ color: '#7dd3fc', fontSize: '22px', marginBottom: '8px' }}>Module 2: Algorithms That Power Your World</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>See how Google Search, GPS Navigation, Social Media Feeds, and Spotify Recommendations actually work behind the scenes.</p>
                        </div>
                        <Link href="/course/adv-module-2" className="btn btn-primary" style={{ width: 'auto', background: '#38bdf8', padding: '12px 30px' }}>Start Module 2</Link>
                    </div>

                    {/* Module 3: How Fast Is Your Code? */}
                    <div className="challenge-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px', background: 'rgba(167, 139, 250, 0.15)', borderLeftColor: '#a78bfa', padding: '30px' }}>
                        <div>
                            <h3 style={{ color: '#c4b5fd', fontSize: '22px', marginBottom: '8px' }}>Module 3: How Fast Is Your Code?</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Understand why some programs finish in milliseconds and others take hours. Learn Big O notation through interactive speed experiments.</p>
                        </div>
                        <Link href="/course/adv-module-3" className="btn btn-primary" style={{ width: 'auto', background: '#a78bfa', padding: '12px 30px' }}>Start Module 3</Link>
                    </div>

                    {/* Module 4: Build Something Real */}
                    <div className="challenge-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px', background: 'rgba(251, 146, 60, 0.15)', borderLeftColor: '#fb923c', padding: '30px' }}>
                        <div>
                            <h3 style={{ color: '#fdba74', fontSize: '22px', marginBottom: '8px' }}>Module 4: Build Something Real</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Apply everything you've learned. Walk through real mini-projects — a To-Do app, an autocomplete search, and a pathfinder — powered by algorithms.</p>
                        </div>
                        <Link href="/course/adv-module-4" className="btn btn-primary" style={{ width: 'auto', background: '#fb923c', padding: '12px 30px' }}>Start Module 4</Link>
                    </div>

                </div>
            </div>
        </main>
    );
}
