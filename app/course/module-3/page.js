import Link from 'next/link';

export default function Module3() {
    return (
        <main className="container">
            <header>
                <div className="logo-text">AlgoThink <span>Module 3</span></div>
                <Link href="/dashboard" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>⬅️ Dashboard</Link>
            </header>
            
            <div className="panel">
                <h1 style={{ fontSize: '36px', color: '#5eead4', marginBottom: '20px', fontWeight: '900' }}>Algorithmic Thinking in Project Building</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '30px' }}>
                    Building a real-world software project is not just about writing code; it is about managing extreme complexity. In this module, we will walk through the <strong>full 8-Step Software Development Life Cycle (SDLC)</strong> of building a Live Weather Application. We will see exactly how Algorithmic Thinking guides every single phase from a blank screen to a globally deployed product.
                </p>

                {/* Meta Concept */}
                <div style={{ background: 'rgba(20, 184, 166, 0.15)', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #14b8a6', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '24px', color: '#ffffff', marginBottom: '12px' }}>🧠 The Ultimate Meta-Algorithm</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '16px' }}>
                        Before we begin, notice something incredible about the 8 steps below: <strong>The process of building a project is, itself, an algorithm.</strong> 
                        <br/><br/>
                        By following these exact 8 chronological steps (Ideation ➔ Architecture ➔ MVP ➔ Testing ➔ Deployment), you are practicing the <strong>Sequencing</strong> pillar of Algorithmic Thinking on a macro scale. If you try to jump to Step 4 (Building) before completing Step 1 (Requirements), your massive project algorithm will crash!
                    </p>
                    <div style={{ marginTop: '20px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(20, 184, 166, 0.3)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
                        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200" alt="Holographic App Blueprint" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px', objectFit: 'cover' }} />
                    </div>
                </div>

                {/* Step 1 */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>Step 1: Ideation & Requirements (Assumption Checking)</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Before writing a single line of code, an algorithmic thinker stops and gathers requirements. Our goal is: "Build a Weather App." 
                    </p>
                    <div style={{ background: 'rgba(180, 83, 9, 0.15)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #b45309', marginBottom: '16px' }}>
                        <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '8px' }}>Checking Assumptions:</strong>
                        <ul style={{ color: '#e2e8f0', paddingLeft: '20px', lineHeight: '1.6' }}>
                            <li><em>Assumption:</em> The computer already knows the weather.</li>
                            <li><em>Reality:</em> It doesn't. We must explicitly connect to a 3rd-party Weather API to fetch data.</li>
                            <li><em>Assumption:</em> The user knows their exact ZIP code.</li>
                            <li><em>Reality:</em> We should allow them to search by City Name or GPS location to prevent errors.</li>
                        </ul>
                    </div>
                </div>

                {/* Step 2 */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>Step 2: System Architecture (High-Level Decomposition)</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        "Build a Weather App" is far too massive for one brain to hold. We must use <strong>Decomposition</strong> to break the entire system down into distinct architectural chunks. We divide the project into three main engines:
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                            <h4 style={{ color: '#14b8a6', marginBottom: '8px', fontSize: '18px' }}>1. Frontend (UI)</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>The visual layer. The buttons, text fields, and sunny/rainy icons the user actually sees.</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                            <h4 style={{ color: '#14b8a6', marginBottom: '8px', fontSize: '18px' }}>2. Backend (Logic)</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>The brain. It securely takes the user's city input and talks to the external API.</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                            <h4 style={{ color: '#14b8a6', marginBottom: '8px', fontSize: '18px' }}>3. Database (Storage)</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>The memory. Saving the user's "Favorite Cities" so they don't have to retype it tomorrow.</p>
                        </div>
                    </div>
                </div>

                {/* Step 3 */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>Step 3: Wireframing (Precision)</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Now we draw the app visually. We must use extreme <strong>Precision</strong> here. You cannot tell a computer to "make the button look nice." You must define the exact pixel width, the exact hex color code (#14b8a6), and the exact font size (24px). Precision in the blueprint prevents chaos in the code.
                    </p>
                </div>

                {/* Step 4 */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>Step 4: Building the MVP (Sequencing)</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        We build the Minimum Viable Product (MVP). <strong>Sequencing</strong> is critical here. If we fetch the weather data BEFORE we ask the user for their city, the app will crash instantly!
                    </p>
                    <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #6366f1', marginBottom: '16px' }}>
                        <strong style={{ color: '#818cf8', display: 'block', marginBottom: '8px', fontSize: '18px' }}>The Core Execution Sequence:</strong>
                        <code style={{ color: '#e2e8f0', display: 'block', whiteSpace: 'pre', fontFamily: 'monospace', fontSize: '15px', lineHeight: '1.6' }}>
                            1. Initialize App & Load UI<br/>
                            2. Prompt user for City Name<br/>
                            3. Wait for User Submit Button Click<br/>
                            4. Send City to Weather API<br/>
                            5. Display Returned Temperature<br/>
                        </code>
                    </div>
                </div>

                {/* Step 5 */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>Step 5: Testing & QA (Decision Logic)</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Before we release it, we try to break it. What if the user types "Atlantis"? What if they type numbers instead of letters? What if their internet is off?
                    </p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        We use <strong>Decision Making (If/Else logic)</strong> to handle these edge cases securely without the app blowing up:
                    </p>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #10b981', marginBottom: '16px' }}>
                        <code style={{ color: '#e2e8f0', display: 'block', whiteSpace: 'pre', fontFamily: 'monospace', fontSize: '15px', lineHeight: '1.6' }}>
                            IF input is empty THEN<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;Show Error: "Please enter a city"<br/>
                            ELSE IF API returns '404 Not Found' THEN<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;Show Error: "City does not exist"<br/>
                            ELSE<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;Display Weather Data<br/>
                        </code>
                    </div>
                </div>

                {/* Step 6 */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>Step 6: User Feedback & Debugging (Iteration)</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        We launch Version 1.0! Immediately, a user reports a bug: The temperature shows "298" on a cold day, because the API sends data in Kelvin instead of Fahrenheit!
                    </p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        This is where <strong>Iteration</strong> comes in. Algorithmic thinkers don't panic. They simply iterate on the logic by locating the specific sequence step that failed, adding a mathematical conversion formula (`(K - 273.15) * 9/5 + 32`), and pushing out an update.
                    </p>
                </div>

                {/* Step 7 */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>Step 7: Scaling to Version 2.0 (Repetition / Loops)</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Users love the app, but now they want a full 7-day forecast instead of just today's weather. 
                    </p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        A bad programmer would write the display code 7 separate times. An algorithmic thinker uses <strong>Repetition (Loops)</strong>. We simply tell the computer: "For every day in the 7-day API response, generate a new weather card automatically." By writing the code once and looping it, the project becomes infinitely scalable!
                    </p>
                </div>
                
                {/* Step 8 */}
                <div style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>Step 8: Deployment & Maintenance (Continuous Iteration)</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        The app is finally deployed to millions of users globally. Over time, servers might crash under heavy load, or the weather API might update its formatting. Algorithmic thinking never stops; it is a continuous, never-ending loop of monitoring, finding bugs, decomposing the bug, fixing the logic, and deploying a new version.
                    </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <Link href="/course/module-2" className="btn" style={{ width: 'auto', background: 'transparent', border: '1px solid var(--border)', color: 'white' }}>⬅️ Module 2</Link>
                    <Link href="/course/module-4" className="btn btn-primary" style={{ width: 'auto', background: '#14b8a6', padding: '12px 30px' }}>Proceed to Module 4 ➡️</Link>
                </div>
            </div>
        </main>
    );
}
