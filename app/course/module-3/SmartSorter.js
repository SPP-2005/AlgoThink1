'use client';
import React from 'react';

export default function SmartSorter({ onBack }) {
    return (
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
            <header style={{ marginBottom: '30px' }}>
                <div className="logo-text">AlgoThink <span>Module 3: Smart Sorter</span></div>
                <button onClick={onBack} className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>🔙 Activities</button>
            </header>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>📦</div>
                <h2 style={{ fontSize: '32px', marginBottom: '16px', color: '#f472b6' }}>Smart Conveyor Sorter</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px', marginBottom: '30px' }}>
                    This activity is currently under construction. Check back soon for more algorithmic pattern recognition logic!
                </p>
                <button onClick={onBack} className="btn btn-primary" style={{ padding: '12px 30px', background: '#3b82f6' }}>Return to Module 3 Dashboard</button>
            </div>
        </main>
    );
}
