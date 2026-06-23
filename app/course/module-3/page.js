import Link from 'next/link';

export default function Module3() {
    return (
        <main className="container">
            <header>
                <div className="logo-text">AlgoThink <span>Module 3</span></div>
                <Link href="/" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>🔙 Dashboard</Link>
            </header>
            
            <div className="panel">
                <h1 style={{ fontSize: '36px', color: '#7dd3fc', marginBottom: '20px', fontWeight: '900' }}>Translation to Programming</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '40px' }}>
                    You have mastered human logic. Now, it is time to see how these exact same pillars map directly onto actual computer code in languages like Python, JavaScript, and C++.
                </p>

                <div className="grid-layout" style={{ gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                    {/* Concept 1 */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <h2 style={{ fontSize: '20px', color: '#38bdf8', marginBottom: '12px' }}>Decomposition = Functions</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px', fontSize: '15px' }}>
                            In coding, when a task is too big, we decompose it by creating "Functions". A function is a mini-program that does one specific job.
                        </p>
                        <code style={{ display: 'block', background: '#0f172a', padding: '12px', borderRadius: '8px', color: '#a5b4fc', fontSize: '13px', fontFamily: 'monospace' }}>
                            function buildHouse() {'{\n'}
                            &nbsp;&nbsp;pourConcrete();{'\n'}
                            &nbsp;&nbsp;buildWalls();{'\n'}
                            &nbsp;&nbsp;addRoof();{'\n'}
                            {'}'}
                        </code>
                    </div>

                    {/* Concept 2 */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <h2 style={{ fontSize: '20px', color: '#38bdf8', marginBottom: '12px' }}>Assumption = Variables</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px', fontSize: '15px' }}>
                            Since computers assume nothing, we must explicitly tell them facts using "Variables" (boxes that store data).
                        </p>
                        <code style={{ display: 'block', background: '#0f172a', padding: '12px', borderRadius: '8px', color: '#a5b4fc', fontSize: '13px', fontFamily: 'monospace' }}>
                            let isJarOpen = false;{'\n'}
                            let peanutButterAmount = 100;{'\n'}
                            let breadSlices = 2;
                        </code>
                    </div>

                    {/* Concept 3 */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <h2 style={{ fontSize: '20px', color: '#38bdf8', marginBottom: '12px' }}>Decision Making = If/Else</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px', fontSize: '15px' }}>
                            This maps exactly 1-to-1. We use "If" statements to force the computer down different logic paths based on live data.
                        </p>
                        <code style={{ display: 'block', background: '#0f172a', padding: '12px', borderRadius: '8px', color: '#a5b4fc', fontSize: '13px', fontFamily: 'monospace' }}>
                            if (batteryLevel &lt; 10) {'{\n'}
                            &nbsp;&nbsp;plugInCharger();{'\n'}
                            {'}'} else {'{\n'}
                            &nbsp;&nbsp;keepWorking();{'\n'}
                            {'}'}
                        </code>
                    </div>

                    {/* Concept 4 */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <h2 style={{ fontSize: '20px', color: '#38bdf8', marginBottom: '12px' }}>Repetition = Loops</h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px', fontSize: '15px' }}>
                            Programmers hate writing the same code twice. We use "For" and "While" loops to automate repetitive tasks infinitely.
                        </p>
                        <code style={{ display: 'block', background: '#0f172a', padding: '12px', borderRadius: '8px', color: '#a5b4fc', fontSize: '13px', fontFamily: 'monospace' }}>
                            while (bowl.isNotFull) {'{\n'}
                            &nbsp;&nbsp;pourCereal();{'\n'}
                            {'}'}
                        </code>
                    </div>
                </div>

                <div style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(16, 185, 129, 0.1))', padding: '30px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>Graduation Time!</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.7', marginBottom: '24px', maxWidth: '700px', margin: '0 auto 24px auto' }}>
                        You have completed all theoretical modules. You now understand how a machine thinks, how logic governs our reality, and how to translate that logic into code. It is time to prove it. 
                    </p>
                    <Link href="/lab" className="btn btn-primary" style={{ width: 'auto', background: '#10b981', color: '#000', padding: '16px 40px', fontSize: '18px', borderRadius: '30px' }}>Take the Final Exam: Enter The Lab 🚀</Link>
                </div>
            </div>
        </main>
    );
}
