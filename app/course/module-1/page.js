import Link from 'next/link';

export default function Module1() {
    return (
        <main className="container">
            <header>
                <div className="logo-text">AlgoThink <span>Module 1</span></div>
                <Link href="/" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>🔙 Dashboard</Link>
            </header>
            
            <div className="panel">
                <h1 style={{ fontSize: '36px', color: '#f472b6', marginBottom: '20px', fontWeight: '900' }}>The 7 Pillars of Logic</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '30px' }}>
                    Welcome to the foundation of computer science. Before you write a single line of code, you must understand how to structure your thoughts. Computers process information using these 7 core pillars. Mastering these means you can solve any problem on earth.
                </p>

                {/* Definition Block */}
                <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #ec4899', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '24px', color: '#ffffff', marginBottom: '12px' }}>What is Algorithmic Thinking?</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '16px' }}>
                        <strong>Algorithmic Thinking</strong> is the superpower of breaking down a massive, complex problem into a clear, unambiguous, step-by-step sequence of instructions that a machine (or a person with absolutely zero common sense) can follow to achieve a specific goal without failure. It is not about writing code—it is about structuring human thought.
                    </p>
                </div>

                {/* 1. Decomposition */}
                <div style={{ marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '26px', color: '#ffffff', marginBottom: '16px' }}>🧩 1. Decomposition: Divide and Conquer</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Decomposition is the process of breaking down a massive, terrifying problem into small, manageable pieces. If you are asked to "Build a Social Media Network," your brain might panic. But if you decompose it into "Create a login screen," "Build a database for users," and "Design a news feed," the task becomes solvable.
                    </p>
                    <div style={{ background: 'rgba(236, 72, 153, 0.1)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #ec4899' }}>
                        <strong style={{ color: '#f472b6' }}>The Golden Rule:</strong> If a step feels too hard or overwhelming, you haven't decomposed it enough. Break it down again!
                    </div>
                </div>

                {/* 2. Sequencing */}
                <div style={{ marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '26px', color: '#ffffff', marginBottom: '16px' }}>⏱️ 2. Sequencing: The Art of Order</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Chronology is everything. In human conversation, order sometimes doesn't matter. In algorithms, performing step 3 before step 2 will cause a catastrophic failure. 
                    </p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '16px' }}>
                        Imagine baking a cake: if you put the batter in the oven before mixing in the flour, you will bake a disaster. A computer will do exactly that if you tell it to. Every single step must logically follow the previous one.
                    </p>
                </div>

                {/* 3. Precision */}
                <div style={{ marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '26px', color: '#ffffff', marginBottom: '16px' }}>🎯 3. Precision: Eradicating Ambiguity</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Computers do not speak English; they speak Math. If you tell a human "Walk forward a bit," they know what you mean. If you tell a robot "Walk forward a bit," it will freeze because "a bit" is not a calculable number.
                    </p>
                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #38bdf8' }}>
                        <strong style={{ color: '#7dd3fc' }}>The Fix:</strong> Replace vague adjectives with absolute values. "Walk forward 5 steps." "Stir for 30 seconds."
                    </div>
                </div>

                {/* 4. Assumption Checking */}
                <div style={{ marginBottom: '40px', paddingBottom: '30px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '26px', color: '#ffffff', marginBottom: '16px' }}>🕵️ 4. Assumption Checking</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        This is where 90% of beginners fail. Humans assume things constantly. We assume gravity exists, we assume doors can be opened, we assume jars have lids. Computers assume <strong>nothing</strong>.
                    </p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '16px' }}>
                        If you want a computer to spread peanut butter, you must first verify that it is holding a knife, that the jar is open, and that there is peanut butter inside the jar.
                    </p>
                </div>

                {/* 5, 6, 7 Combined for brevity */}
                <div style={{ marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '26px', color: '#ffffff', marginBottom: '16px' }}>🔄 Advanced Pillars: Repetition, Logic, and Iteration</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Once you master the basics, you unlock the real power of algorithms:
                    </p>
                    <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '16px', paddingLeft: '24px' }}>
                        <li style={{ marginBottom: '12px' }}><strong>Repetition (Loops):</strong> Never write the same instruction twice. Tell the computer to "Repeat Step 2 until the bowl is empty."</li>
                        <li style={{ marginBottom: '12px' }}><strong>Decision Making (Logic):</strong> Use If/Then rules. "If the light is red, Stop. Else, Go."</li>
                        <li style={{ marginBottom: '12px' }}><strong>Iteration (Debugging):</strong> Your first algorithm will almost always fail. Iteration is the scientific process of testing, finding the exact line that failed, fixing it, and trying again.</li>
                    </ul>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <Link href="/" className="btn" style={{ width: 'auto', background: 'transparent', border: '1px solid var(--border)', color: 'white' }}>Back to Dashboard</Link>
                    <Link href="/course/module-2" className="btn btn-primary" style={{ width: 'auto', background: '#ec4899', padding: '12px 30px' }}>Proceed to Module 2 ➡️</Link>
                </div>
            </div>
        </main>
    );
}
