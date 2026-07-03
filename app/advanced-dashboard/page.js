'use client';
import Link from 'next/link';

export default function AdvancedDashboard() {
    return (
        <main className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="logo-text" style={{ color: '#10b981' }}>AlgoThink <span style={{ color: 'white' }}>Advanced</span></div>
                <Link href="/" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>🔙 Change Track</Link>
            </header>

            <div className="panel" style={{ borderTop: '4px solid #10b981' }}>
                <div>
                    <h2 className="panel-title" style={{ fontSize: '32px', marginBottom: '12px' }}>Advanced Curriculum (Grades 9-12)</h2>
                    <p className="panel-subtitle" style={{ fontSize: '16px' }}>Master algorithmic complexity, data handling, and professional problem-solving techniques.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '30px' }}>
                    {/* Module 1: Advanced Algorithms */}
                    <div className="challenge-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px', background: 'rgba(16, 185, 129, 0.1)', borderLeftColor: '#10b981', padding: '30px' }}>
                        <div>
                            <h3 style={{ color: '#34d399', fontSize: '22px', marginBottom: '8px' }}>Module 1: Advanced Algorithmic Patterns</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>Skip the basics. Dive straight into Two Pointers, Sliding Window, and Backtracking algorithms used in competitive programming.</p>
                        </div>
                        <Link href="/course/adv-module-1" className="btn btn-primary" style={{ width: 'auto', background: '#10b981', padding: '12px 30px', color: 'black', fontWeight: 'bold' }}>Start Module 1</Link>
                    </div>

                    {/* Module 2: System Design */}
                    <div className="challenge-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px', background: 'rgba(56, 189, 248, 0.1)', borderLeftColor: '#38bdf8', padding: '30px' }}>
                        <div>
                            <h3 style={{ color: '#7dd3fc', fontSize: '22px', marginBottom: '8px' }}>Module 2: Real-World System Architecture</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>Decompose large-scale applications. Understand how tech giants architect their backends, APIs, and databases using logical flows.</p>
                        </div>
                        <Link href="/course/adv-module-2" className="btn btn-primary" style={{ width: 'auto', background: '#38bdf8', padding: '12px 30px', color: 'black', fontWeight: 'bold' }}>Start Module 2</Link>
                    </div>

                    {/* Module 3: Time & Space Complexity */}
                    <div className="challenge-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px', background: 'rgba(167, 139, 250, 0.1)', borderLeftColor: '#a78bfa', padding: '30px' }}>
                        <div>
                            <h3 style={{ color: '#c4b5fd', fontSize: '22px', marginBottom: '8px' }}>Module 3: Big O Notation & Optimization</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>Write code that runs fast. Learn to calculate Time (O) and Space complexity and optimize brute-force logic into elegant solutions.</p>
                        </div>
                        <Link href="/course/adv-module-3" className="btn btn-primary" style={{ width: 'auto', background: '#a78bfa', padding: '12px 30px', color: 'black', fontWeight: 'bold' }}>Start Module 3</Link>
                    </div>

                    {/* Module 4: Live Debugging */}
                    <div className="challenge-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px', background: 'rgba(251, 146, 60, 0.1)', borderLeftColor: '#fb923c', padding: '30px' }}>
                        <div>
                            <h3 style={{ color: '#fdba74', fontSize: '22px', marginBottom: '8px' }}>Module 4: The Debugging Crucible</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.6' }}>Given 5 complex algorithms with hidden logical flaws, can you use assumption checking and tracing to find and fix them?</p>
                        </div>
                        <Link href="/course/adv-module-4" className="btn btn-primary" style={{ width: 'auto', background: '#fb923c', padding: '12px 30px', color: 'black', fontWeight: 'bold' }}>Start Module 4</Link>
                    </div>

                </div>
            </div>
        </main>
    );
}
