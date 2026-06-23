import Link from 'next/link';

export default function Module3() {
    return (
        <main className="container">
            <header>
                <div className="logo-text">AlgoThink <span>Module 3</span></div>
                <Link href="/" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>🔙 Dashboard</Link>
            </header>
            
            <div className="panel">
                <h1 style={{ fontSize: '36px', color: '#7dd3fc', marginBottom: '20px', fontWeight: '900' }}>Algorithmic Thinking in Project Building</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '40px' }}>
                    Knowing the 7 Pillars is useless if you don't know how to apply them. In this module, we will walk through the entire lifecycle of building a medium-sized software project—a <strong>Live Weather Application</strong>. We will see exactly how algorithmic thinking guides us from a blank screen to a finished product through versions, prototypes, and feedback.
                </p>

                {/* Step 1 */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>Step 1: The Blueprint (Assumption Checking)</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Before writing a single line of code, an algorithmic thinker stops and asks questions. Our goal is: "Build a Weather App." 
                    </p>
                    <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #f59e0b', marginBottom: '16px' }}>
                        <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '8px' }}>Checking Assumptions:</strong>
                        <ul style={{ color: '#e2e8f0', paddingLeft: '20px', lineHeight: '1.6' }}>
                            <li><em>Assumption:</em> The computer knows the weather.</li>
                            <li><em>Reality:</em> It doesn't. We must explicitly connect to a 3rd-party Weather API to get data.</li>
                            <li><em>Assumption:</em> The computer knows where the user lives.</li>
                            <li><em>Reality:</em> We must ask the user for permission to use their GPS location or give them a search bar.</li>
                        </ul>
                    </div>
                </div>

                {/* Step 2 */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>Step 2: The Prototype (Decomposition)</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        "Build a Weather App" is too massive of a problem to tackle at once. We must use <strong>Decomposition</strong> to break it down into a Minimum Viable Product (MVP). We divide the massive project into three tiny, manageable tasks:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                            <h4 style={{ color: '#38bdf8', marginBottom: '8px', fontSize: '18px' }}>Task A: UI</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Build a simple black box with white text to display the numbers.</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                            <h4 style={{ color: '#38bdf8', marginBottom: '8px', fontSize: '18px' }}>Task B: Location</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Write a script that asks the user to input their city name.</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                            <h4 style={{ color: '#38bdf8', marginBottom: '8px', fontSize: '18px' }}>Task C: Fetch Data</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Send that city name to the Weather API and print the temperature.</p>
                        </div>
                    </div>
                </div>

                {/* Step 3 */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>Step 3: Version 1.0 (Sequencing & Logic)</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Now we assemble the pieces. <strong>Sequencing</strong> is critical here. If we try to fetch the weather data BEFORE we ask the user for their city, the app will crash instantly!
                    </p>
                    <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #8b5cf6', marginBottom: '16px' }}>
                        <strong style={{ color: '#c084fc', display: 'block', marginBottom: '8px', fontSize: '18px' }}>The Core Logic (Decision Making):</strong>
                        <code style={{ color: '#e2e8f0', display: 'block', whiteSpace: 'pre', fontFamily: 'monospace', fontSize: '15px', lineHeight: '1.6' }}>
                            1. Load User Interface<br/>
                            2. Prompt user for City Name<br/>
                            3. IF User enters nothing THEN<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;Show Error: "City required"<br/>
                            &nbsp;&nbsp;ELSE<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;Fetch data from Weather API<br/>
                            4. Display Temperature<br/>
                        </code>
                    </div>
                </div>

                {/* Step 4 */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>Step 4: Feedback & Debugging (Iteration)</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        We launch Version 1.0! Immediately, users report a bug: If they type a fake city like "Atlantis", the app completely freezes. 
                    </p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        This is where <strong>Iteration</strong> comes in. Algorithmic thinkers don't panic. They simply iterate on the logic by adding more <strong>Precision</strong> to their Decision Making: "If the API returns a '404 Not Found' error, show the user a friendly message saying 'City not found', instead of crashing."
                    </p>
                </div>

                {/* Step 5 */}
                <div style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>Step 5: Version 2.0 (Repetition / Loops)</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Users love the app, but now they want a 7-day forecast instead of just today. 
                    </p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        A bad programmer would write the display code 7 separate times. An algorithmic thinker uses <strong>Repetition (Loops)</strong>. We simply tell the computer: "For every day in the 7-day API response, create a new weather card." By writing the code once and looping it, the project becomes infinitely scalable!
                    </p>
                </div>

                <div style={{ background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(16, 185, 129, 0.1))', padding: '30px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>Graduation Time!</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.7', marginBottom: '24px', maxWidth: '700px', margin: '0 auto 24px auto' }}>
                        You have completed all theoretical modules. You now understand how a machine thinks, how logic governs reality, and how to structure a massive software project from scratch. It is time to prove it. 
                    </p>
                    <Link href="/lab" className="btn btn-primary" style={{ width: 'auto', background: '#10b981', color: '#000', padding: '16px 40px', fontSize: '18px', borderRadius: '30px' }}>Take the Final Exam: Enter The Lab 🚀</Link>
                </div>
            </div>
        </main>
    );
}
