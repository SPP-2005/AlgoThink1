import Link from 'next/link';

export default function Course() {
    return (
        <main className="container">
            <header>
                <div className="logo-text">AlgoThink <span>Algorithmic Thinking Course</span></div>
                <Link href="/lab" className="btn btn-primary" style={{ textDecoration: 'none', padding: '10px 24px', width: 'auto' }}>
                    Enter The Lab ➡️
                </Link>
            </header>

            <div className="panel" style={{ marginBottom: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#ffffff', marginBottom: '16px' }}>Welcome to The Literal Lab!</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                        Your mission is to teach B.O.B., a Basic Operational Bot, how to survive the human world. B.O.B. is eager to please but takes everything <strong>completely literally</strong>. This course will take you from a complete beginner to a master of Algorithmic Thinking!
                    </p>
                </div>

                {/* Module 1 */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '40px', paddingBottom: '20px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', background: 'linear-gradient(to right, #60a5fa, #c084fc, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px', textAlign: 'center' }}>Module 1: The "Dumb" Computer</h2>
                    <div style={{ background: 'var(--surface-light)', padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #60a5fa', maxWidth: '900px', margin: '0 auto' }}>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                            We often think of computers as incredibly smart machines. In reality, <strong>computers have absolutely zero common sense.</strong> They cannot infer, they cannot guess, and they do not know what you "meant" to say.
                        </p>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                            If you tell a human to "Walk through the door," they will open the door first. If you tell a robot to "Walk through the door," it will slam its metal face straight into the closed wood because you didn't explicitly tell it to turn the doorknob.
                        </p>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                            <strong>The Core Concept:</strong> You are the brain. The computer is just the hands. It is your job to translate human intentions into perfect, unbreakable logic.
                        </p>
                    </div>
                </div>

                {/* Module 2 */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '40px', paddingBottom: '20px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', background: 'linear-gradient(to right, #c084fc, #ec4899, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px', textAlign: 'center' }}>Module 2: The 7 Pillars of Algorithmic Thinking</h2>
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '40px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                        To successfully control a computer, you must learn to think in <strong>Algorithms</strong> (step-by-step instructions). Master these seven pillars to succeed:
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        {/* 1. Decomposition */}
                        <div className="challenge-card" style={{ background: 'rgba(236, 72, 153, 0.1)', borderLeftColor: '#ec4899' }}>
                            <h3 style={{ color: '#f472b6', fontSize: '18px', marginBottom: '10px' }}>🧩 1. Decomposition</h3>
                            <p style={{ fontSize: '14px', marginBottom: '10px', color: '#e2e8f0', lineHeight: '1.5' }}><strong>Breaking down a massive problem into tiny, manageable chunks.</strong></p>
                            <p style={{ fontSize: '13px' }}><em>Example:</em> Instead of telling B.O.B to "Build a house", decompose it into "1. Pour concrete, 2. Build walls, 3. Add roof."</p>
                        </div>
                        
                        {/* 2. Sequencing */}
                        <div className="challenge-card" style={{ background: 'rgba(139, 92, 246, 0.1)', borderLeftColor: '#8b5cf6' }}>
                            <h3 style={{ color: '#c084fc', fontSize: '18px', marginBottom: '10px' }}>⏱️ 2. Sequencing</h3>
                            <p style={{ fontSize: '14px', marginBottom: '10px', color: '#e2e8f0', lineHeight: '1.5' }}><strong>The exact chronological order of your steps. Computers blindly follow your order.</strong></p>
                            <p style={{ fontSize: '13px' }}><em>Example:</em> Telling B.O.B to put on his shoes before his socks will result in a fatal error!</p>
                        </div>

                        {/* 3. Precision */}
                        <div className="challenge-card" style={{ background: 'rgba(56, 189, 248, 0.1)', borderLeftColor: '#38bdf8' }}>
                            <h3 style={{ color: '#7dd3fc', fontSize: '18px', marginBottom: '10px' }}>🎯 3. Precision</h3>
                            <p style={{ fontSize: '14px', marginBottom: '10px', color: '#e2e8f0', lineHeight: '1.5' }}><strong>Being hyper-specific. Never assume B.O.B. knows preconditions or "common sense."</strong></p>
                            <p style={{ fontSize: '13px' }}><em>Example:</em> "Walk forward" might cause B.O.B to walk off a cliff. "Walk forward exactly 5 steps" is safe.</p>
                        </div>

                        {/* 4. Assumption Checking */}
                        <div className="challenge-card" style={{ background: 'rgba(245, 158, 11, 0.1)', borderLeftColor: '#f59e0b' }}>
                            <h3 style={{ color: '#fbbf24', fontSize: '18px', marginBottom: '10px' }}>🕵️ 4. Assumption Checking</h3>
                            <p style={{ fontSize: '14px', marginBottom: '10px', color: '#e2e8f0', lineHeight: '1.5' }}><strong>Identifying and explicitly stating hidden requirements.</strong></p>
                            <p style={{ fontSize: '13px' }}><em>Example:</em> Assuming the peanut butter jar is already open is a critical mistake.</p>
                        </div>

                        {/* 5. Repetition */}
                        <div className="challenge-card" style={{ background: 'rgba(16, 185, 129, 0.1)', borderLeftColor: '#10b981' }}>
                            <h3 style={{ color: '#6ee7b7', fontSize: '18px', marginBottom: '10px' }}>🔄 5. Repetition (Loops)</h3>
                            <p style={{ fontSize: '14px', marginBottom: '10px', color: '#e2e8f0', lineHeight: '1.5' }}><strong>Executing an action multiple times efficiently without writing it out over and over.</strong></p>
                            <p style={{ fontSize: '13px' }}><em>Example:</em> "Stir the bowl 50 times" instead of writing "Stir" fifty individual times.</p>
                        </div>

                        {/* 6. Decision Making */}
                        <div className="challenge-card" style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeftColor: '#ef4444' }}>
                            <h3 style={{ color: '#fca5a5', fontSize: '18px', marginBottom: '10px' }}>🔀 6. Decision Making (Logic)</h3>
                            <p style={{ fontSize: '14px', marginBottom: '10px', color: '#e2e8f0', lineHeight: '1.5' }}><strong>Giving the computer rules to follow based on different scenarios.</strong></p>
                            <p style={{ fontSize: '13px' }}><em>Example:</em> "<strong>If</strong> it is raining, <strong>Then</strong> take an umbrella."</p>
                        </div>

                        {/* 7. Iteration */}
                        <div className="challenge-card" style={{ background: 'rgba(99, 102, 241, 0.1)', borderLeftColor: '#6366f1' }}>
                            <h3 style={{ color: '#a5b4fc', fontSize: '18px', marginBottom: '10px' }}>🛠️ 7. Iteration (Debugging)</h3>
                            <p style={{ fontSize: '14px', marginBottom: '10px', color: '#e2e8f0', lineHeight: '1.5' }}><strong>Testing your algorithm, finding mistakes (bugs), and refining it until it works perfectly.</strong></p>
                            <p style={{ fontSize: '13px' }}><em>Example:</em> B.O.B. smashed the bread? Rewrite the instruction to be gentler and try again!</p>
                        </div>
                    </div>
                </div>

                {/* Module 3 */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '40px', paddingBottom: '20px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', background: 'linear-gradient(to right, #ec4899, #f43f5e, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px', textAlign: 'center' }}>Module 3: The Lab Manual (How to play)</h2>
                    <div style={{ background: 'var(--surface-light)', padding: '24px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid #f43f5e', maxWidth: '900px', margin: '0 auto' }}>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                            In the next step, you will enter <strong>The Literal Lab</strong> and take control of B.O.B. Here is how to ensure your success:
                        </p>
                        <ul style={{ color: 'var(--text-muted)', lineHeight: '1.6', paddingLeft: '20px', marginBottom: '16px' }}>
                            <li style={{ marginBottom: '8px' }}><strong>Use Numbered Lists:</strong> Always write your instructions line-by-line (e.g., 1., 2., 3.). This enforces Sequencing.</li>
                            <li style={{ marginBottom: '8px' }}><strong>Assume Nothing:</strong> If a box is closed, tell him to open it. If he is holding something, tell him to put it down.</li>
                            <li style={{ marginBottom: '8px' }}><strong>Read the Telemetry:</strong> If B.O.B. fails, read his "Logical Analysis" report. It will tell you exactly which of the 7 pillars you violated so you can fix it (Iteration).</li>
                        </ul>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <Link href="/lab" className="btn btn-primary" style={{ textDecoration: 'none', padding: '16px 40px', fontSize: '18px', display: 'inline-block', borderRadius: '30px', width: 'auto' }}>
                        Ready? Enter The Literal Lab 🚀
                    </Link>
                </div>
            </div>
        </main>
    );
}
