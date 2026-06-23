import Link from 'next/link';

export default function Dashboard() {
    return (
        <main className="container">
            <header>
                <div className="logo-text">AlgoThink <span>Academy</span></div>
            </header>
            
            <div className="panel" style={{ marginBottom: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '40px', fontWeight: '900', color: '#ffffff', marginBottom: '16px' }}>Mastering Algorithmic Thinking</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                        Welcome to the full academy. Here, you will learn the fundamental skills required to command machines. Work through the three deep-dive modules below before attempting your final exam in The Literal Lab.
                    </p>
                </div>

                <div className="grid-layout" style={{ gridTemplateColumns: '1fr', gap: '20px' }}>
                    
                    {/* Module 1 */}
                    <div className="challenge-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px', background: 'rgba(59, 130, 246, 0.15)', borderLeftColor: '#3b82f6', padding: '30px' }}>
                        <div>
                            <h3 style={{ color: '#60a5fa', fontSize: '22px', marginBottom: '8px' }}>Module 1: The 7 Pillars of Logic</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>A comprehensive deep dive into Decomposition, Sequencing, and the unbreakable laws of machine logic.</p>
                        </div>
                        <Link href="/course/module-1" className="btn btn-primary" style={{ width: 'auto', background: '#3b82f6', padding: '12px 30px' }}>Start Module 1</Link>
                    </div>

                    {/* Module 2 */}
                    <div className="challenge-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px', background: 'rgba(99, 102, 241, 0.15)', borderLeftColor: '#6366f1', padding: '30px' }}>
                        <div>
                            <h3 style={{ color: '#818cf8', fontSize: '22px', marginBottom: '8px' }}>Module 2: Algorithms in Everyday Life</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Discover how you subconsciously use algorithmic thinking to make coffee, do laundry, and survive the real world.</p>
                        </div>
                        <Link href="/course/module-2" className="btn btn-primary" style={{ width: 'auto', background: '#6366f1', padding: '12px 30px' }}>Start Module 2</Link>
                    </div>

                    {/* Module 3 */}
                    <div className="challenge-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px', background: 'rgba(20, 184, 166, 0.15)', borderLeftColor: '#14b8a6', padding: '30px' }}>
                        <div>
                            <h3 style={{ color: '#5eead4', fontSize: '22px', marginBottom: '8px' }}>Module 3: Building a Full Project</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Walk through the end-to-end lifecycle of building a Weather Appâ€”from prototyping and versioning to debugging user feedback.</p>
                        </div>
                        <Link href="/course/module-3" className="btn btn-primary" style={{ width: 'auto', background: '#14b8a6', padding: '12px 30px' }}>Start Module 3</Link>
                    </div>

                    {/* Module 4 */}
                    <div className="challenge-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px', background: 'rgba(217, 119, 6, 0.15)', borderLeftColor: '#d97706', padding: '30px' }}>
                        <div>
                            <h3 style={{ color: '#fcd34d', fontSize: '22px', marginBottom: '8px' }}>Module 4: Classic CS Algorithms</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Learn how algorithms like Binary Search and Bubble Sort allow computers to process massive amounts of raw data efficiently.</p>
                        </div>
                        <Link href="/course/module-4" className="btn btn-primary" style={{ width: 'auto', background: '#d97706', padding: '12px 30px' }}>Start Module 4</Link>
                    </div>

                    {/* The Lab / Module 5 */}
                    <div className="challenge-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px', background: 'rgba(16, 185, 129, 0.1)', borderLeftColor: '#10b981', padding: '30px', marginTop: '20px' }}>
                        <div>
                            <h3 style={{ color: '#34d399', fontSize: '24px', marginBottom: '8px' }}>Module 5: Testing Your Understanding</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Put your algorithmic thinking to the ultimate test. Give instructions to B.O.B. in the interactive lab and see if your logic actually works.</p>
                        </div>
                        <Link href="/lab" className="btn btn-primary" style={{ width: 'auto', background: '#10b981', color: '#000', padding: '16px 40px', fontSize: '18px' }}>Enter The Lab</Link>
                    </div>

                </div>
            </div>
        </main>
    );
}



