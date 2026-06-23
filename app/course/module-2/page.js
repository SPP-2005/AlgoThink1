import Link from 'next/link';

export default function Module2() {
    return (
        <main className="container">
            <header>
                <div className="logo-text">AlgoThink <span>Module 2</span></div>
                <Link href="/dashboard" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>← Dashboard</Link>
            </header>
            
            <div className="panel">
                <h1 style={{ fontSize: '36px', color: '#818cf8', marginBottom: '20px', fontWeight: '900' }}>Algorithms in Everyday Life</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '40px' }}>
                    You might think you have never written an algorithm before, but your brain executes thousands of complex algorithms every single day without you even realizing it. By learning to recognize these patterns, you can optimize your daily routines, save time, and avoid frustrating mistakes. Let's look at how the 7 Pillars apply to surviving the real world.
                </p>

                {/* Scenario 1 */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>☕ Scenario 1: The "Perfect" Morning Coffee</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Think making coffee is simple? To a computer, it is a highly complex logistical operation. If you ever make a bad cup of coffee, it is usually because your internal algorithm had a bug. Let's break down the algorithm for brewing coffee:
                    </p>
                    <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '16px', paddingLeft: '24px', marginBottom: '20px' }}>
                        <li style={{ marginBottom: '12px' }}><strong>Assumption Checking (The Setup):</strong> Before you do anything, you must verify your environment. Does the coffee machine have water? Is it plugged in? Do you actually have coffee beans, or did you run out yesterday? Assuming these are true without checking leads to a "fatal error" when you press start.</li>
                        <li style={{ marginBottom: '12px' }}><strong>Sequencing (The Order):</strong> Chronology is vital. If you grind the beans AFTER you pour the boiling water into the empty filter, you just ruined your coffee. You must place the filter, then add the grounds, then pour the water.</li>
                        <li style={{ marginBottom: '12px' }}><strong>Precision (The Recipe):</strong> Saying "add some coffee" is too vague. An algorithmic thinker says "add exactly 18 grams of coffee to 300 milliliters of water." This guarantees a perfect cup every single time.</li>
                    </ul>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                        <strong style={{ color: '#818cf8' }}>Real-World Benefit:</strong> By applying algorithmic precision and sequencing to your morning routine, you eliminate the groggy mistakes that ruin your morning.
                    </div>
                </div>

                {/* Scenario 2 */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>🧺 Scenario 2: Doing the Laundry (Decision Making)</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Doing the laundry is essentially a masterclass in <strong>Decomposition</strong> (sorting) and <strong>Decision Making (Logic)</strong>. If you throw everything into the washer together on high heat, your white shirts turn pink and your wool sweaters shrink to fit a dog. 
                    </p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Your brain runs a massive "If/Then" logic tree every time you pick up a piece of clothing:
                    </p>
                    <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #6366f1', marginBottom: '20px' }}>
                        <code style={{ color: '#e2e8f0', display: 'block', whiteSpace: 'pre', fontFamily: 'monospace', fontSize: '15px', lineHeight: '1.6' }}>
                            IF shirt_color is "White" THEN<br/>
                            &nbsp;&nbsp;Put in the Bleach Pile<br/>
                            ELSE IF shirt_material is "Delicate Wool" THEN<br/>
                            &nbsp;&nbsp;Wash on Cold & Gentle Cycle<br/>
                            ELSE<br/>
                            &nbsp;&nbsp;Wash on Normal Warm Cycle<br/>
                        </code>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                        <strong style={{ color: '#818cf8' }}>Real-World Benefit:</strong> Algorithmic logic prevents catastrophic failures. By defining clear rules (If/Then) for your laundry, you protect your valuable clothes from destruction.
                    </div>
                </div>

                {/* Scenario 3 */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>🚥 Scenario 3: Navigating Traffic (Iteration & Loops)</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Driving or walking to a destination requires extreme <strong>Precision</strong> and real-time <strong>Iteration</strong>. 
                    </p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        When you use Google Maps, it gives you highly precise algorithmic instructions: "In 500 feet, turn right onto Main Street." It does not say "Turn right eventually." But what happens if Main Street is closed due to construction?
                    </p>
                    <ul style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.8', paddingLeft: '20px', marginBottom: '16px' }}>
                        <li style={{ marginBottom: '12px' }}><strong>Repetition:</strong> You loop the same actions: Check mirrors, accelerate, brake, repeat.</li>
                        <li style={{ marginBottom: '12px' }}><strong>Iteration (Debugging on the fly):</strong> Your original algorithm just failed. An algorithmic thinker immediately iterates—they assess the error, calculate a new route, and update their sequence of steps to bypass the construction.</li>
                        <li style={{ marginBottom: '12px' }}><strong>Repetition (Loops):</strong> When you are walking up the stairs to your apartment, your brain runs a loop: "Step up with right foot, step up with left foot. Repeat until you reach the 4th floor."</li>
                    </ul>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                        <strong style={{ color: '#818cf8' }}>Real-World Benefit:</strong> Understanding iteration means you don't panic when things go wrong. You simply view the obstacle as a "bug" in the system, adjust your algorithm, and keep moving forward efficiently.
                    </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <Link href="/course/module-1" className="btn" style={{ width: 'auto', background: 'transparent', border: '1px solid var(--border)', color: 'white' }}>← Module 1</Link>
                    <Link href="/course/module-3" className="btn btn-primary" style={{ width: 'auto', background: '#6366f1', padding: '12px 30px' }}>Proceed to Module 3 ➡️</Link>
                </div>
            </div>
        </main>
    );
}
