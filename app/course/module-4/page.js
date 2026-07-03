import Link from 'next/link';

export default function Module4() {
    return (
        <main className="container">
            <header>
                <div className="logo-text">Algo<span className="logo-highlight">Think</span> <span className="logo-suffix">Module 4</span></div>
                <Link href="/dashboard" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>⬅️ Dashboard</Link>
            </header>
            
            <div className="panel">
                <h1 style={{ fontSize: '36px', color: '#d97706', marginBottom: '20px', fontWeight: '900' }}>Classic Computer Science Algorithms</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '18px', lineHeight: '1.7', marginBottom: '40px' }}>
                    You now know how to apply logic to everyday life and full-scale projects. But what about raw data? In technical coding interviews and real-world database management, you must know how to search and sort massive amounts of information efficiently. Let's look at the classic algorithms every programmer must know.
                </p>

                {/* Section 1: The Dictionary Problem */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>1. The Dictionary Problem</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        Imagine you are handed a 1,000-page dictionary and told to find the word <strong>"Quantum"</strong>. How do you do it? Your approach to this problem defines how efficient your algorithm is.
                    </p>
                </div>

                {/* Section 2: Linear Search */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>2. Linear Search (The Brute Force Approach)</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        A computer with zero algorithmic logic uses <strong>Linear Search</strong>. It starts at page 1, checks if the word is "Quantum", and if not, goes to page 2. It repeats this process one by one.
                    </p>
                    <div style={{ background: 'rgba(225, 29, 72, 0.15)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #e11d48', marginBottom: '16px' }}>
                        <code style={{ color: '#e2e8f0', display: 'block', whiteSpace: 'pre', fontFamily: 'monospace', fontSize: '15px', lineHeight: '1.6' }}>
                            FOR every page in Dictionary:<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;IF word on page is "Quantum" THEN<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Return Page Number<br/>
                        </code>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                        <strong style={{ color: '#d97706' }}>The Verdict:</strong> Terrible! If the word is at the very end of the dictionary, it takes 1,000 steps. In computer science, this is known as <strong>O(N) Time Complexity</strong>.
                    </div>
                </div>

                {/* Section 3: Binary Search */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>3. Binary Search (Divide & Conquer)</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        An algorithmic thinker uses <strong>Binary Search</strong>. You open the dictionary exactly to the middle (Page 500). You see the words start with "M". Since "Q" comes after "M" in the alphabet, you know "Quantum" cannot possibly be in the first half of the book!
                    </p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        You literally rip the dictionary in half, throw away pages 1-500, and repeat the process on the remaining half. You keep halving the data until you find the word.
                    </p>
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #10b981', marginBottom: '16px' }}>
                        <code style={{ color: '#e2e8f0', display: 'block', whiteSpace: 'pre', fontFamily: 'monospace', fontSize: '15px', lineHeight: '1.6' }}>
                            WHILE book is not empty:<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;Open to the middle page<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;IF middle word == "Quantum" THEN<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Found it!<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;ELSE IF "Quantum" is alphabetically greater THEN<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Throw away the left half of the book<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;ELSE<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Throw away the right half of the book<br/>
                        </code>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px' }}>
                        <strong style={{ color: '#d97706' }}>The Verdict:</strong> Brilliant! Even with 1,000,000 pages, it takes a maximum of only 20 steps to find the word. This is <strong>O(log N) Time Complexity</strong>.
                    </div>
                </div>

                {/* Section 4: Bubble Sort */}
                <div style={{ marginBottom: '50px' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>4. Bubble Sort (Organizing Data)</h2>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        What if the dictionary isn't in alphabetical order? Binary Search won't work! We have to sort the data first. 
                    </p>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
                        <strong>Bubble Sort</strong> is a beginner sorting algorithm. You look at two adjacent items. If the left item is bigger than the right item, you swap them. You repeat this across the entire list until the biggest items "bubble" up to the end!
                    </p>
                </div>
                
                <div style={{ background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.15), rgba(16, 185, 129, 0.1))', padding: '30px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(251, 146, 60, 0.3)' }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>Testing Your Understanding</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '16px', lineHeight: '1.7', marginBottom: '24px', maxWidth: '700px', margin: '0 auto 24px auto' }}>
                        If you have 10 items, any logic works. If you have 10 billion items, bad logic will take 300 years to compute, while good logic (a good algorithm) will take 0.2 seconds.
                    </p>
                    <div style={{ marginTop: '20px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(217, 119, 6, 0.3)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
                        <img src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1200" alt="Neon Sorting Visualization" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px', objectFit: 'cover' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <Link href="/course/module-3" className="btn btn-secondary" style={{ width: 'auto', background: 'rgba(255,255,255,0.05)', color: 'white', padding: '12px 30px', border: '1px solid var(--border)' }}>⬅️ Previous: Module 3</Link>
                        <Link href="/lab" className="btn btn-primary" style={{ width: 'auto', background: '#b45309', color: '#ffffff', padding: '16px 40px', fontSize: '18px', borderRadius: '30px' }}>Test Your Understanding: Enter The Lab 🚀</Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

