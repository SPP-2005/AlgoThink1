'use client';
import Link from 'next/link';
import { useState, useRef, useCallback } from 'react';

const C = {
    green: '#10b981', greenLight: '#34d399', greenBg: 'rgba(16,185,129,0.15)',
    blue: '#3b82f6', blueLight: '#60a5fa', blueBg: 'rgba(59,130,246,0.15)',
    purple: '#8b5cf6', purpleLight: '#c4b5fd', purpleBg: 'rgba(139,92,246,0.15)',
    amber: '#d97706', amberLight: '#fcd34d', amberBg: 'rgba(217,119,6,0.15)',
    red: '#e11d48', redLight: '#fca5a5', redBg: 'rgba(225,29,72,0.15)',
    cyan: '#06b6d4', cyanLight: '#67e8f9', cyanBg: 'rgba(6,182,212,0.15)',
    surface: 'rgba(255,255,255,0.05)', border: '#333b4d', muted: '#cbd5e1',
};

// ─── Interactive: Big O Growth Comparison ───────────────────────────────────
function BigOGrowthDemo() {
    const [inputSize, setInputSize] = useState(10);

    const algos = [
        { name: 'O(1)', label: 'Constant', calc: () => 1, color: C.green, example: 'Get array[5]' },
        { name: 'O(log n)', label: 'Logarithmic', calc: (n) => Math.log2(n), color: C.blue, example: 'Binary Search' },
        { name: 'O(n)', label: 'Linear', calc: (n) => n, color: C.amber, example: 'Linear Search' },
        { name: 'O(n log n)', label: 'Linearithmic', calc: (n) => n * Math.log2(n), color: C.purple, example: 'Merge Sort' },
        { name: 'O(n²)', label: 'Quadratic', calc: (n) => n * n, color: C.red, example: 'Bubble Sort' },
    ];

    const maxOps = Math.max(...algos.map(a => a.calc(inputSize)));

    return (
        <div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                <label style={{ color: C.muted, fontSize: '15px' }}>Input Size (n):</label>
                <input type="range" min="2" max="50" value={inputSize} onChange={e => setInputSize(Number(e.target.value))}
                    style={{ flex: 1, minWidth: '120px', accentColor: C.purple }} />
                <span style={{ color: C.purpleLight, fontWeight: '900', fontSize: '24px', minWidth: '40px' }}>{inputSize}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {algos.map((a, i) => {
                    const ops = a.calc(inputSize);
                    const barWidth = maxOps > 0 ? (ops / maxOps) * 100 : 0;
                    return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ minWidth: '100px', textAlign: 'right' }}>
                                <span style={{ color: a.color, fontWeight: '700', fontSize: '14px' }}>{a.name}</span>
                            </div>
                            <div style={{ flex: 1, background: C.surface, borderRadius: '6px', height: '32px', overflow: 'hidden', position: 'relative' }}>
                                <div style={{
                                    height: '100%', width: `${Math.max(barWidth, 2)}%`,
                                    background: `linear-gradient(90deg, ${a.color}, ${a.color}88)`,
                                    borderRadius: '6px', transition: 'width 0.5s ease',
                                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px',
                                }}>
                                    <span style={{ color: '#fff', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                                        {ops < 1 ? '1' : Math.round(ops).toLocaleString()} ops
                                    </span>
                                </div>
                            </div>
                            <div style={{ minWidth: '120px', fontSize: '12px', color: C.muted }}>{a.example}</div>
                        </div>
                    );
                })}
            </div>

            <div style={{ padding: '14px 16px', borderRadius: '8px', background: C.purpleBg, border: '1px solid rgba(139,92,246,0.3)' }}>
                <p style={{ margin: 0, color: C.purpleLight, fontSize: '14px', lineHeight: '1.6' }}>
                    With <strong>n={inputSize}</strong>: O(1) does just <strong>1</strong> operation, while O(n²) does <strong>{(inputSize * inputSize).toLocaleString()}</strong>!
                    {inputSize >= 20 && <span> Imagine with millions of items — O(n²) would take <strong>forever</strong>. 🐌</span>}
                </p>
            </div>
        </div>
    );
}

// ─── Interactive: Speed Race ────────────────────────────────────────────────
function SpeedRaceDemo() {
    const [dataSize, setDataSize] = useState(1000);
    const [results, setResults] = useState(null);
    const [running, setRunning] = useState(false);

    const runRace = useCallback(() => {
        setRunning(true);
        setResults(null);

        setTimeout(() => {
            const data = Array.from({ length: dataSize }, (_, i) => i);
            const target = data[Math.floor(Math.random() * dataSize)];

            // Linear search
            const linearStart = performance.now();
            let linearOps = 0;
            for (let i = 0; i < data.length; i++) {
                linearOps++;
                if (data[i] === target) break;
            }
            const linearTime = performance.now() - linearStart;

            // Binary search
            const binaryStart = performance.now();
            let binaryOps = 0;
            let lo = 0, hi = data.length - 1;
            while (lo <= hi) {
                binaryOps++;
                const mid = Math.floor((lo + hi) / 2);
                if (data[mid] === target) break;
                if (data[mid] < target) lo = mid + 1;
                else hi = mid - 1;
            }
            const binaryTime = performance.now() - binaryStart;

            setResults({ linearOps, binaryOps, linearTime: linearTime.toFixed(3), binaryTime: binaryTime.toFixed(3), target, dataSize });
            setRunning(false);
        }, 100);
    }, [dataSize]);

    return (
        <div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                <label style={{ color: C.muted, fontSize: '15px' }}>Data Size:</label>
                {[100, 1000, 10000, 100000].map(size => (
                    <button key={size} onClick={() => setDataSize(size)}
                        className="btn btn-primary" style={{
                            width: 'auto', padding: '8px 16px',
                            background: dataSize === size ? C.blue : C.surface,
                            border: `1px solid ${dataSize === size ? C.blue : C.border}`,
                            fontSize: '13px',
                        }}>
                        {size.toLocaleString()}
                    </button>
                ))}
                <button onClick={runRace} disabled={running} className="btn btn-primary"
                    style={{ width: 'auto', background: C.green, padding: '10px 24px', opacity: running ? 0.5 : 1 }}>
                    ⚡ Run Race!
                </button>
            </div>

            {results && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ background: C.redBg, padding: '24px', borderRadius: '12px', border: '1px solid rgba(225,29,72,0.3)', textAlign: 'center' }}>
                        <h4 style={{ color: C.redLight, fontSize: '16px', marginBottom: '12px' }}>🐢 Linear Search — O(n)</h4>
                        <p style={{ fontSize: '36px', fontWeight: '900', color: '#fff', margin: '0 0 8px 0' }}>{results.linearOps.toLocaleString()}</p>
                        <p style={{ color: C.muted, fontSize: '14px', margin: 0 }}>operations • {results.linearTime}ms</p>
                    </div>
                    <div style={{ background: C.greenBg, padding: '24px', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.3)', textAlign: 'center' }}>
                        <h4 style={{ color: C.greenLight, fontSize: '16px', marginBottom: '12px' }}>🐇 Binary Search — O(log n)</h4>
                        <p style={{ fontSize: '36px', fontWeight: '900', color: '#fff', margin: '0 0 8px 0' }}>{results.binaryOps.toLocaleString()}</p>
                        <p style={{ color: C.muted, fontSize: '14px', margin: 0 }}>operations • {results.binaryTime}ms</p>
                    </div>

                    <div style={{ gridColumn: '1 / -1', background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.1))', padding: '20px', borderRadius: '12px', border: '2px solid rgba(16,185,129,0.4)', textAlign: 'center' }}>
                        <p style={{ fontSize: '24px', margin: '0 0 8px 0' }}>🏆</p>
                        <p style={{ color: '#fff', fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0' }}>
                            Binary Search used <span style={{ color: C.greenLight }}>{(results.linearOps / results.binaryOps).toFixed(0)}× fewer</span> operations on {results.dataSize.toLocaleString()} items!
                        </p>
                        <p style={{ color: C.muted, fontSize: '14px', margin: 0 }}>
                            That's the difference between O(n) and O(log n). At scale, this is the difference between milliseconds and hours.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Interactive: Sorting Algorithm Race ────────────────────────────────────
function SortingRaceDemo() {
    const [dataSize, setDataSize] = useState(500);
    const [results, setResults] = useState(null);
    const [running, setRunning] = useState(false);

    const runRace = useCallback(() => {
        setRunning(true);
        setResults(null);

        setTimeout(() => {
            const makeArr = () => Array.from({ length: dataSize }, () => Math.random());

            // Bubble Sort O(n²)
            const arr1 = makeArr();
            let bubbleOps = 0;
            const bStart = performance.now();
            for (let i = 0; i < arr1.length; i++) {
                for (let j = 0; j < arr1.length - i - 1; j++) {
                    bubbleOps++;
                    if (arr1[j] > arr1[j + 1]) [arr1[j], arr1[j + 1]] = [arr1[j + 1], arr1[j]];
                }
            }
            const bTime = performance.now() - bStart;

            // Merge Sort O(n log n)
            const arr2 = makeArr();
            let mergeOps = 0;
            const mergeSort = (a) => {
                if (a.length <= 1) return a;
                const mid = Math.floor(a.length / 2);
                const left = mergeSort(a.slice(0, mid));
                const right = mergeSort(a.slice(mid));
                const result = [];
                let i = 0, j = 0;
                while (i < left.length && j < right.length) {
                    mergeOps++;
                    result.push(left[i] < right[j] ? left[i++] : right[j++]);
                }
                return [...result, ...left.slice(i), ...right.slice(j)];
            };
            const mStart = performance.now();
            mergeSort(arr2);
            const mTime = performance.now() - mStart;

            setResults({
                bubbleOps, mergeOps,
                bubbleTime: bTime.toFixed(2), mergeTime: mTime.toFixed(2),
                dataSize,
            });
            setRunning(false);
        }, 100);
    }, [dataSize]);

    return (
        <div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                <label style={{ color: C.muted, fontSize: '15px' }}>Array Size:</label>
                {[100, 500, 2000, 5000].map(size => (
                    <button key={size} onClick={() => setDataSize(size)}
                        className="btn btn-primary" style={{
                            width: 'auto', padding: '8px 16px',
                            background: dataSize === size ? C.purple : C.surface,
                            border: `1px solid ${dataSize === size ? C.purple : C.border}`,
                            fontSize: '13px',
                        }}>
                        {size.toLocaleString()}
                    </button>
                ))}
                <button onClick={runRace} disabled={running} className="btn btn-primary"
                    style={{ width: 'auto', background: C.amber, padding: '10px 24px', opacity: running ? 0.5 : 1 }}>
                    🏁 Race!
                </button>
            </div>

            {results && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ background: C.redBg, padding: '24px', borderRadius: '12px', border: '1px solid rgba(225,29,72,0.3)', textAlign: 'center' }}>
                        <h4 style={{ color: C.redLight, fontSize: '16px', marginBottom: '12px' }}>🐌 Bubble Sort — O(n²)</h4>
                        <p style={{ fontSize: '28px', fontWeight: '900', color: '#fff', margin: '0 0 4px 0' }}>{results.bubbleOps.toLocaleString()} ops</p>
                        <p style={{ color: C.muted, fontSize: '14px', margin: 0 }}>{results.bubbleTime}ms</p>
                    </div>
                    <div style={{ background: C.greenBg, padding: '24px', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.3)', textAlign: 'center' }}>
                        <h4 style={{ color: C.greenLight, fontSize: '16px', marginBottom: '12px' }}>⚡ Merge Sort — O(n log n)</h4>
                        <p style={{ fontSize: '28px', fontWeight: '900', color: '#fff', margin: '0 0 4px 0' }}>{results.mergeOps.toLocaleString()} ops</p>
                        <p style={{ color: C.muted, fontSize: '14px', margin: 0 }}>{results.mergeTime}ms</p>
                    </div>
                    <div style={{ gridColumn: '1 / -1', padding: '16px', borderRadius: '10px', background: C.amberBg, border: '1px solid rgba(217,119,6,0.3)', textAlign: 'center' }}>
                        <p style={{ color: '#fff', fontSize: '16px', fontWeight: '800', margin: 0 }}>
                            Merge Sort was <span style={{ color: C.greenLight }}>{(results.bubbleOps / results.mergeOps).toFixed(1)}× faster</span> on {results.dataSize.toLocaleString()} items!
                            {results.dataSize >= 2000 && <span style={{ color: C.amberLight }}> At bigger scales, Bubble Sort becomes unusable. 🐌</span>}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}


// ─── Main Page ──────────────────────────────────────────────────────────────
export default function AdvModule3() {
    return (
        <main className="container">
            <header>
                <div className="logo-text">Algo<span className="logo-highlight">Think</span> <span className="logo-suffix">Adv. Module 3</span></div>
                <Link href="/advanced-dashboard" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>⬅️ Dashboard</Link>
            </header>

            <div className="panel">
                <h1 style={{ fontSize: '36px', color: C.purpleLight, marginBottom: '20px', fontWeight: '900' }}>How Fast Is Your Code?</h1>
                <p style={{ color: C.muted, fontSize: '18px', lineHeight: '1.7', marginBottom: '30px' }}>
                    Not all algorithms are created equal. Some finish in the blink of an eye, others take longer than your lunch break. <strong>Big O notation</strong> tells us how an algorithm's speed changes as the data grows.
                </p>

                {/* ── Section 1: Big O Explained ──────────────────────── */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ background: C.purpleBg, padding: '24px', borderRadius: '12px', borderLeft: `4px solid ${C.purple}`, marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '12px' }}>📏 Big O Notation — The Speed Label</h2>
                        <p style={{ color: C.muted, lineHeight: '1.8', fontSize: '15px' }}>
                            Think of Big O like a <strong>speed label on food packaging</strong>. Instead of calories, it tells you <strong>how many operations</strong> your algorithm needs as the data gets bigger. Drag the slider below and watch how different algorithms scale!
                        </p>
                    </div>
                    <BigOGrowthDemo />
                </div>

                {/* ── Section 2: Cheat Sheet ──────────────────────────── */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: `1px solid ${C.border}` }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '20px' }}>🗂️ Big O Cheat Sheet</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        {[
                            { big: 'O(1)', name: 'Constant', speed: '⚡ Instant', example: 'Access arr[0]', verdict: 'Best possible!', color: C.green },
                            { big: 'O(log n)', name: 'Logarithmic', speed: '🚀 Very Fast', example: 'Binary Search', verdict: 'Excellent', color: C.blue },
                            { big: 'O(n)', name: 'Linear', speed: '🏃 Fair', example: 'Loop through list', verdict: 'Acceptable', color: C.amber },
                            { big: 'O(n log n)', name: 'Linearithmic', speed: '🚶 Decent', example: 'Merge Sort', verdict: 'Good for sorting', color: C.purple },
                            { big: 'O(n²)', name: 'Quadratic', speed: '🐌 Slow', example: 'Nested loops', verdict: 'Avoid if possible', color: C.red },
                            { big: 'O(2ⁿ)', name: 'Exponential', speed: '💀 Terrible', example: 'Brute-force combos', verdict: 'Never at scale!', color: '#ef4444' },
                        ].map((item, i) => (
                            <div key={i} style={{ background: C.surface, padding: '20px', borderRadius: '12px', border: `1px solid ${C.border}`, borderLeft: `4px solid ${item.color}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ color: item.color, fontWeight: '900', fontSize: '18px' }}>{item.big}</span>
                                    <span style={{ fontSize: '13px', color: C.muted }}>{item.speed}</span>
                                </div>
                                <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '6px' }}>{item.name}</h4>
                                <p style={{ color: C.muted, fontSize: '12px', marginBottom: '4px' }}>Example: {item.example}</p>
                                <p style={{ color: item.color, fontSize: '12px', fontWeight: '600', margin: 0 }}>{item.verdict}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Section 3: Speed Race (Searching) ──────────────── */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: `1px solid ${C.border}` }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '8px' }}>🏎️ Speed Race: Search Algorithms</h2>
                    <p style={{ color: C.muted, fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                        Pick a data size and race Linear Search O(n) against Binary Search O(log n) on <strong>real data, in your browser</strong>. Watch the operation count explode for linear as the data grows!
                    </p>
                    <SpeedRaceDemo />
                </div>

                {/* ── Section 4: Sorting Race ────────────────────────── */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: `1px solid ${C.border}` }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '8px' }}>🏁 Sorting Showdown: Bubble vs Merge</h2>
                    <p style={{ color: C.muted, fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                        Bubble Sort O(n²) vs Merge Sort O(n log n). They both sort correctly — but one is <strong>dramatically</strong> faster. Crank up the array size and watch Bubble Sort sweat!
                    </p>
                    <SortingRaceDemo />
                </div>

                {/* ── Takeaway ────────────────────────────────────────── */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.15))',
                    padding: '30px', borderRadius: '16px', border: '1px solid rgba(139,92,246,0.3)',
                }}>
                    <h2 style={{ fontSize: '24px', color: '#ffffff', marginBottom: '20px', textAlign: 'center' }}>🧠 Key Takeaways</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        {[
                            { icon: '📏', title: 'Big O', desc: 'Measures how an algorithm scales. Lower is better.', color: C.purpleLight },
                            { icon: '🔍', title: 'Right Tool', desc: 'Binary Search beats Linear Search because O(log n) < O(n).', color: C.greenLight },
                            { icon: '⚖️', title: 'Tradeoffs', desc: 'Faster algorithms are often more complex to write — but worth it at scale.', color: C.amberLight },
                        ].map((t, i) => (
                            <div key={i} style={{ background: C.surface, padding: '20px', borderRadius: '12px', textAlign: 'center', border: `1px solid ${C.border}` }}>
                                <div style={{ fontSize: '32px', marginBottom: '10px' }}>{t.icon}</div>
                                <h4 style={{ color: t.color, fontSize: '16px', marginBottom: '8px' }}>{t.title}</h4>
                                <p style={{ color: C.muted, fontSize: '13px', lineHeight: '1.5' }}>{t.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                    <Link href="/course/adv-module-2" className="btn btn-secondary" style={{ width: 'auto', background: 'rgba(255,255,255,0.05)', color: 'white', padding: '12px 30px', border: '1px solid var(--border)' }}>
                        ⬅️ Previous: Module 2
                    </Link>
                    <Link href="/course/adv-module-4" className="btn btn-primary" style={{ width: 'auto', background: '#3b82f6', padding: '12px 30px' }}>
                        Proceed to Module 4 ➡️
                    </Link>
                </div>
            </div>
        </main>
    );
}
