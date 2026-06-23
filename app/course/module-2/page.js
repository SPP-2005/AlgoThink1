import Link from 'next/link';

export default function Module2() {
    return (
        <main className="container">
            <header>
                <div className="logo-text">AlgoThink <span>Module 2</span></div>
                <Link href="/" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>🔙 Dashboard</Link>
            </header>
            
            <div className="panel">
                <h1 style={{ fontSize: '36px', color: '#c084fc', marginBottom: '20px', fontWeight: '900' }}>Algorithms in Everyday Life</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '40px' }}>
                    You might think you have never written an algorithm before, but your brain executes thousands of complex algorithms every single day without you even realizing it. Let's look at how the 7 Pillars apply to surviving the real world.
                </p>

                {/* Scenario 1 */}
                <div style={{ marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '26px', color: '#ffffff', marginBottom: '16px' }}>☕ Scenario 1: Making Morning Coffee</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Think making coffee is simple? To a computer, it is a highly complex logistical operation. Let's look at the algorithms involved:
                    </p>
                    <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '16px', paddingLeft: '24px' }}>
                        <li style={{ marginBottom: '12px' }}><strong>Assumption Checking:</strong> Does the coffee machine have water? Is it plugged in? Do I actually have coffee beans?</li>
                        <li style={{ marginBottom: '12px' }}><strong>Sequencing:</strong> If you grind the beans AFTER you pour the water into the filter, you just ruined your coffee.</li>
                        <li style={{ marginBottom: '12px' }}><strong>Repetition:</strong> "Scoop 1 tablespoon of beans into the grinder. Repeat 3 times."</li>
                    </ul>
                </div>

                {/* Scenario 2 */}
                <div style={{ marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '26px', color: '#ffffff', marginBottom: '16px' }}>🧺 Scenario 2: Doing the Laundry</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Doing the laundry is essentially a masterclass in <strong>Decision Making (Logic)</strong> and <strong>Decomposition</strong>.
                    </p>
                    <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #8b5cf6', marginBottom: '16px' }}>
                        <strong style={{ color: '#c084fc', display: 'block', marginBottom: '8px' }}>The "If/Then" Logic of Laundry:</strong>
                        <code style={{ color: '#e2e8f0', display: 'block', whiteSpace: 'pre', fontFamily: 'monospace' }}>
                            IF shirt_color == "White" THEN<br/>
                            &nbsp;&nbsp;Add to Bleach Pile<br/>
                            ELSE IF shirt_material == "Wool" THEN<br/>
                            &nbsp;&nbsp;Wash on Cold Delicate<br/>
                            ELSE<br/>
                            &nbsp;&nbsp;Wash on Normal Warm<br/>
                        </code>
                    </div>
                </div>

                {/* Scenario 3 */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '26px', color: '#ffffff', marginBottom: '16px' }}>🚦 Scenario 3: Navigating to School/Work</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Driving or walking to a destination requires extreme <strong>Precision</strong> and real-time <strong>Iteration</strong>. 
                    </p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '16px' }}>
                        If a road is blocked, your brain throws an error, iterates on the problem, and calculates a new route. When Google Maps tells you "In 500 feet, turn right", it is using precise measurements instead of saying "Turn right eventually."
                    </p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <Link href="/course/module-1" className="btn" style={{ width: 'auto', background: 'transparent', border: '1px solid var(--border)', color: 'white' }}>🔙 Module 1</Link>
                    <Link href="/course/module-3" className="btn btn-primary" style={{ width: 'auto', background: '#8b5cf6', padding: '12px 30px' }}>Proceed to Module 3 ➡️</Link>
                </div>
            </div>
        </main>
    );
}
