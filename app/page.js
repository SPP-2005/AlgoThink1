'use client';
import Link from 'next/link';

export default function Home() {
    return (
        <main className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <div className="logo-pop-container" style={{ position: 'relative', margin: '0 auto 20px auto', display: 'flex', justifyContent: 'center' }}>
                    <div className="logo-icon" style={{ position: 'relative' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '80px', height: '80px' }}>
                            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                            <polyline points="2 17 12 22 22 17"></polyline>
                            <polyline points="2 12 12 17 22 12"></polyline>
                        </svg>
                    </div>
                </div>
                <h1 style={{ fontSize: '48px', fontWeight: '900', color: 'white', marginBottom: '16px' }}>
                    Welcome to Algo<span style={{ color: '#6366f1' }}>Think</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '20px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                    Before we begin, please select your learning track so we can tailor the experience to your current knowledge level.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '30px', maxWidth: '900px', width: '100%' }}>
                {/* 6-8 Track */}
                <Link href="/dashboard" style={{ flex: 1, textDecoration: 'none' }}>
                    <div style={{ 
                        background: 'rgba(59, 130, 246, 0.1)', 
                        border: '2px solid #3b82f6', 
                        borderRadius: '24px', 
                        padding: '40px', 
                        textAlign: 'center',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-10px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎮</div>
                        <h2 style={{ fontSize: '28px', color: '#60a5fa', marginBottom: '16px' }}>Beginner Track</h2>
                        <h3 style={{ fontSize: '18px', color: 'white', marginBottom: '24px', fontWeight: 'normal' }}>Grades 6-8</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.6', flex: 1 }}>
                            Fun, interactive simulations! Learn the basics of how computers think through games, puzzles, and everyday examples. No prior experience needed.
                        </p>
                        <div className="btn btn-primary" style={{ marginTop: '24px', background: '#3b82f6', display: 'block' }}>Choose Beginner</div>
                    </div>
                </Link>

                {/* 9-12 Track */}
                <Link href="/advanced-dashboard" style={{ flex: 1, textDecoration: 'none' }}>
                    <div style={{ 
                        background: 'rgba(16, 185, 129, 0.1)', 
                        border: '2px solid #10b981', 
                        borderRadius: '24px', 
                        padding: '40px', 
                        textAlign: 'center',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-10px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>💻</div>
                        <h2 style={{ fontSize: '28px', color: '#34d399', marginBottom: '16px' }}>Advanced Track</h2>
                        <h3 style={{ fontSize: '18px', color: 'white', marginBottom: '24px', fontWeight: 'normal' }}>Grades 9-12</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.6', flex: 1 }}>
                            Fast-paced, logic-driven problem solving. Dive straight into algorithm optimization, data handling, and real-world software architecture.
                        </p>
                        <div className="btn btn-primary" style={{ marginTop: '24px', background: '#10b981', display: 'block' }}>Choose Advanced</div>
                    </div>
                </Link>
            </div>
        </main>
    );
}
