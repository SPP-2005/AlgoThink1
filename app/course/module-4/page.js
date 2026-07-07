'use client';
import Link from 'next/link';
import { useState, useRef, useCallback, useEffect } from 'react';

// ─── Helpers ────────────────────────────────────────────────────────────────
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function generateSortedArray(n) {
    return Array.from({ length: n }, (_, i) => i + 1);
}

// ─── Color Palette ──────────────────────────────────────────────────────────
const COLORS = {
    amber: '#d97706',
    amberLight: '#fcd34d',
    amberBg: 'rgba(217, 119, 6, 0.15)',
    green: '#10b981',
    greenLight: '#34d399',
    greenBg: 'rgba(16, 185, 129, 0.15)',
    red: '#e11d48',
    redLight: '#fca5a5',
    redBg: 'rgba(225, 29, 72, 0.15)',
    blue: '#3b82f6',
    blueLight: '#60a5fa',
    blueBg: 'rgba(59, 130, 246, 0.15)',
    purple: '#8b5cf6',
    purpleLight: '#c4b5fd',
    purpleBg: 'rgba(139, 92, 246, 0.15)',
    surface: 'rgba(255,255,255,0.05)',
    border: '#333b4d',
    muted: '#cbd5e1',
};

// ─── Interactive: Linear Search vs Binary Search ────────────────────────────
function SearchRace() {
    const SIZE = 32;
    const sorted = generateSortedArray(SIZE);
    const [target, setTarget] = useState(null);
    const [linearIdx, setLinearIdx] = useState(-1);
    const [binaryLow, setBinaryLow] = useState(0);
    const [binaryHigh, setBinaryHigh] = useState(SIZE - 1);
    const [binaryMid, setBinaryMid] = useState(-1);
    const [linearSteps, setLinearSteps] = useState(0);
    const [binarySteps, setBinarySteps] = useState(0);
    const [linearFound, setLinearFound] = useState(false);
    const [binaryFound, setBinaryFound] = useState(false);
    const [running, setRunning] = useState(false);
    const [finished, setFinished] = useState(false);
    const timerRef = useRef(null);

    const reset = useCallback(() => {
        clearInterval(timerRef.current);
        setTarget(null);
        setLinearIdx(-1);
        setBinaryLow(0);
        setBinaryHigh(SIZE - 1);
        setBinaryMid(-1);
        setLinearSteps(0);
        setBinarySteps(0);
        setLinearFound(false);
        setBinaryFound(false);
        setRunning(false);
        setFinished(false);
    }, []);

    const startRace = useCallback(() => {
        reset();
        const t = Math.floor(Math.random() * SIZE) + 1;
        setTarget(t);

        let lIdx = 0;
        let bLow = 0;
        let bHigh = SIZE - 1;
        let lSteps = 0;
        let bSteps = 0;
        let lDone = false;
        let bDone = false;

        setRunning(true);
        setFinished(false);

        timerRef.current = setInterval(() => {
            // Linear search step
            if (!lDone) {
                lSteps++;
                setLinearIdx(lIdx);
                setLinearSteps(lSteps);
                if (sorted[lIdx] === t) {
                    lDone = true;
                    setLinearFound(true);
                } else {
                    lIdx++;
                }
            }

            // Binary search step
            if (!bDone) {
                bSteps++;
                const mid = Math.floor((bLow + bHigh) / 2);
                setBinaryMid(mid);
                setBinaryLow(bLow);
                setBinaryHigh(bHigh);
                setBinarySteps(bSteps);
                if (sorted[mid] === t) {
                    bDone = true;
                    setBinaryFound(true);
                } else if (sorted[mid] < t) {
                    bLow = mid + 1;
                } else {
                    bHigh = mid - 1;
                }
            }

            if (lDone && bDone) {
                clearInterval(timerRef.current);
                setRunning(false);
                setFinished(true);
            }
        }, 180);
    }, [reset, sorted]);

    useEffect(() => () => clearInterval(timerRef.current), []);

    const renderBar = (value, idx, highlight, found, isEliminated) => {
        let bg = 'rgba(255,255,255,0.12)';
        if (isEliminated) bg = 'rgba(255,255,255,0.03)';
        if (highlight) bg = found ? COLORS.green : COLORS.amber;
        return (
            <div key={idx} style={{
                width: `${100 / SIZE}%`,
                height: `${(value / SIZE) * 100}%`,
                background: bg,
                borderRadius: '3px 3px 0 0',
                transition: 'all 0.15s ease',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
            }}>
                {highlight && <div style={{
                    position: 'absolute', top: '-20px', fontSize: '10px',
                    color: found ? COLORS.greenLight : COLORS.amberLight,
                    fontWeight: 'bold',
                }}>{value}</div>}
            </div>
        );
    };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button onClick={startRace} disabled={running}
                    className="btn btn-primary" style={{ width: 'auto', background: COLORS.amber, padding: '10px 24px', opacity: running ? 0.5 : 1 }}>
                    {finished ? '🔄 Race Again' : '🏁 Start Race!'}
                </button>
                {target && <span style={{ color: COLORS.amberLight, fontSize: '16px', fontWeight: 'bold' }}>
                    Finding number: {target}
                </span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Linear Search */}
                <div style={{ background: COLORS.redBg, borderRadius: '12px', padding: '20px', border: `1px solid rgba(225,29,72,0.3)` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ color: COLORS.redLight, fontSize: '16px', margin: 0 }}>🐢 Linear Search</h4>
                        <span style={{ color: COLORS.red, fontSize: '22px', fontWeight: '900' }}>{linearSteps} steps</span>
                    </div>
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '120px' }}>
                        {sorted.map((v, i) => renderBar(v, i, i === linearIdx, linearFound && i === linearIdx, false))}
                    </div>
                    {linearFound && <div style={{ marginTop: '12px', background: 'linear-gradient(135deg, rgba(225,29,72,0.25), rgba(225,29,72,0.08))', padding: '14px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(225,29,72,0.5)' }}>
                        <p style={{ color: '#fff', fontSize: '18px', fontWeight: '800', margin: 0 }}>🐢 {linearSteps} steps</p>
                        <p style={{ color: COLORS.redLight, fontSize: '13px', margin: '4px 0 0 0' }}>Checked every item one by one</p>
                    </div>}
                </div>

                {/* Binary Search */}
                <div style={{ background: COLORS.greenBg, borderRadius: '12px', padding: '20px', border: `1px solid rgba(16,185,129,0.3)` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h4 style={{ color: COLORS.greenLight, fontSize: '16px', margin: 0 }}>🐇 Binary Search</h4>
                        <span style={{ color: COLORS.green, fontSize: '22px', fontWeight: '900' }}>{binarySteps} steps</span>
                    </div>
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '120px' }}>
                        {sorted.map((v, i) => {
                            const isEliminated = i < binaryLow || i > binaryHigh;
                            const isMiddle = i === binaryMid;
                            return renderBar(v, i, isMiddle, binaryFound && isMiddle, isEliminated && !binaryFound);
                        })}
                    </div>
                    {binaryFound && <div style={{ marginTop: '12px', background: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(16,185,129,0.08))', padding: '14px', borderRadius: '10px', textAlign: 'center', border: '1px solid rgba(16,185,129,0.5)' }}>
                        <p style={{ color: '#fff', fontSize: '18px', fontWeight: '800', margin: 0 }}>🐇 {binarySteps} steps</p>
                        <p style={{ color: COLORS.greenLight, fontSize: '13px', margin: '4px 0 0 0' }}>Halved the data each time!</p>
                    </div>}
                </div>
            </div>

            {finished && (
                <div style={{ marginTop: '20px', background: 'linear-gradient(135deg, rgba(217,119,6,0.2), rgba(16,185,129,0.15))', padding: '24px', borderRadius: '16px', textAlign: 'center', border: '2px solid rgba(217,119,6,0.5)', boxShadow: '0 0 30px rgba(217,119,6,0.15)' }}>
                    <p style={{ fontSize: '28px', margin: '0 0 8px 0' }}>
                        {linearSteps > binarySteps ? '🏆' : (linearSteps < binarySteps ? '🐢🏆' : '🤝')}
                    </p>
                    <p style={{ color: '#fff', fontSize: '20px', fontWeight: '900', margin: '0 0 8px 0' }}>
                        {linearSteps > binarySteps ? (
                            <>Binary Search won by <span style={{ color: COLORS.greenLight }}>{linearSteps - binarySteps} fewer steps</span>!</>
                        ) : linearSteps < binarySteps ? (
                            <>Linear Search won by <span style={{ color: COLORS.redLight }}>{binarySteps - linearSteps} fewer steps</span>! (Lucky find!)</>
                        ) : (
                            <>It's a tie! Both took <span style={{ color: COLORS.amberLight }}>{linearSteps} steps</span>.</>
                        )}
                    </p>
                    <p style={{ color: COLORS.amberLight, fontSize: '15px', margin: 0 }}>
                        🐢 Linear: {linearSteps} steps  vs  🐇 Binary: {binarySteps} steps
                        {linearSteps > binarySteps * 2 && <span> — Imagine a million items! 🤯</span>}
                    </p>
                </div>
            )}
        </div>
    );
}

// ─── Interactive: Bubble Sort Visualizer ────────────────────────────────────
function BubbleSortVisualizer() {
    const SIZE = 16;
    const [arr, setArr] = useState(() => shuffleArray(generateSortedArray(SIZE)));
    const [comparing, setComparing] = useState([-1, -1]);
    const [sorted, setSorted] = useState([]);
    const [running, setRunning] = useState(false);
    const [done, setDone] = useState(false);
    const [swaps, setSwaps] = useState(0);
    const [passes, setPasses] = useState(0);
    const timerRef = useRef(null);
    const stepsRef = useRef([]);

    const generateSteps = useCallback((input) => {
        const a = [...input];
        const steps = [];
        let totalSwaps = 0;
        let totalPasses = 0;
        for (let i = 0; i < a.length; i++) {
            totalPasses++;
            let swapped = false;
            for (let j = 0; j < a.length - 1 - i; j++) {
                steps.push({ type: 'compare', arr: [...a], i: j, j: j + 1, swaps: totalSwaps, passes: totalPasses });
                if (a[j] > a[j + 1]) {
                    [a[j], a[j + 1]] = [a[j + 1], a[j]];
                    totalSwaps++;
                    swapped = true;
                    steps.push({ type: 'swap', arr: [...a], i: j, j: j + 1, swaps: totalSwaps, passes: totalPasses });
                }
            }
            steps.push({ type: 'pass-done', arr: [...a], sorted: a.length - 1 - i, swaps: totalSwaps, passes: totalPasses });
            if (!swapped) break;
        }
        steps.push({ type: 'done', arr: [...a], swaps: totalSwaps, passes: totalPasses });
        return steps;
    }, []);

    const startSort = useCallback(() => {
        clearInterval(timerRef.current);
        const newArr = shuffleArray(generateSortedArray(SIZE));
        setArr(newArr);
        setComparing([-1, -1]);
        setSorted([]);
        setDone(false);
        setSwaps(0);
        setPasses(0);
        setRunning(true);

        const steps = generateSteps(newArr);
        stepsRef.current = steps;
        let stepIdx = 0;
        const sortedIndices = [];

        timerRef.current = setInterval(() => {
            if (stepIdx >= steps.length) {
                clearInterval(timerRef.current);
                setRunning(false);
                setDone(true);
                return;
            }
            const step = steps[stepIdx];
            setArr(step.arr);
            setSwaps(step.swaps);
            setPasses(step.passes);
            if (step.type === 'compare' || step.type === 'swap') {
                setComparing([step.i, step.j]);
            }
            if (step.type === 'pass-done') {
                sortedIndices.push(step.sorted);
                setSorted([...sortedIndices]);
                setComparing([-1, -1]);
            }
            if (step.type === 'done') {
                setComparing([-1, -1]);
                setSorted(Array.from({ length: SIZE }, (_, i) => i));
            }
            stepIdx++;
        }, 80);
    }, [generateSteps]);

    useEffect(() => () => clearInterval(timerRef.current), []);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button onClick={startSort} disabled={running}
                    className="btn btn-primary" style={{ width: 'auto', background: COLORS.purple, padding: '10px 24px', opacity: running ? 0.5 : 1 }}>
                    {done ? '🔄 Shuffle & Sort Again' : '▶️ Start Sorting'}
                </button>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <span style={{ color: COLORS.muted, fontSize: '14px' }}>Passes: <strong style={{ color: COLORS.purpleLight }}>{passes}</strong></span>
                    <span style={{ color: COLORS.muted, fontSize: '14px' }}>Swaps: <strong style={{ color: COLORS.amberLight }}>{swaps}</strong></span>
                </div>
            </div>

            <div style={{
                background: COLORS.purpleBg, borderRadius: '12px', padding: '24px',
                border: '1px solid rgba(139,92,246,0.3)',
            }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '180px' }}>
                    {arr.map((v, i) => {
                        const isComparing = comparing.includes(i);
                        const isSorted = sorted.includes(i);
                        let bg = 'rgba(139, 92, 246, 0.4)';
                        if (isComparing) bg = COLORS.amber;
                        if (isSorted) bg = COLORS.green;
                        if (isComparing && isSorted) bg = COLORS.amber;

                        return (
                            <div key={i} style={{
                                flex: 1,
                                height: `${(v / SIZE) * 100}%`,
                                background: bg,
                                borderRadius: '4px 4px 0 0',
                                transition: 'all 0.06s ease',
                                position: 'relative',
                            }}>
                                <span style={{
                                    position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)',
                                    fontSize: '11px', color: isComparing ? COLORS.amberLight : (isSorted ? COLORS.greenLight : 'rgba(255,255,255,0.4)'),
                                    fontWeight: isComparing ? 'bold' : 'normal',
                                }}>{v}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {done && (
                <div style={{ marginTop: '20px', background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(16,185,129,0.15))', padding: '24px', borderRadius: '16px', textAlign: 'center', border: '2px solid rgba(139,92,246,0.5)', boxShadow: '0 0 30px rgba(139,92,246,0.15)' }}>
                    <p style={{ fontSize: '28px', margin: '0 0 8px 0' }}>🫧✅</p>
                    <p style={{ color: '#fff', fontSize: '20px', fontWeight: '900', margin: '0 0 8px 0' }}>
                        Sorted in <span style={{ color: COLORS.purpleLight }}>{passes} passes</span> and <span style={{ color: COLORS.amberLight }}>{swaps} swaps</span>!
                    </p>
                    <p style={{ color: COLORS.muted, fontSize: '14px', margin: 0 }}>The biggest numbers "bubbled" to the right each pass 🫧</p>
                </div>
            )}
        </div>
    );
}

// ─── Interactive: Why Sorting Matters (Unsorted Binary Search Fails) ────────
function WhySortingMatters() {
    const SIZE = 16;
    const [mode, setMode] = useState(null); // 'sorted' | 'unsorted'
    const [arr, setArr] = useState(() => generateSortedArray(SIZE));
    const [target] = useState(7);
    const [highlight, setHighlight] = useState(-1);
    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(SIZE - 1);
    const [steps, setSteps] = useState(0);
    const [found, setFound] = useState(false);
    const [failed, setFailed] = useState(false);
    const [running, setRunning] = useState(false);
    const [message, setMessage] = useState('');
    const timerRef = useRef(null);

    const start = useCallback((useSorted) => {
        clearInterval(timerRef.current);
        const data = useSorted ? generateSortedArray(SIZE) : shuffleArray(generateSortedArray(SIZE));
        setArr(data);
        setMode(useSorted ? 'sorted' : 'unsorted');
        setHighlight(-1);
        setLow(0);
        setHigh(SIZE - 1);
        setSteps(0);
        setFound(false);
        setFailed(false);
        setRunning(true);
        setMessage('');

        let lo = 0, hi = SIZE - 1, s = 0;
        timerRef.current = setInterval(() => {
            if (lo > hi) {
                clearInterval(timerRef.current);
                setRunning(false);
                if (!useSorted) {
                    setFailed(true);
                    setMessage(`❌ Binary search FAILED on unsorted data! It looked in the wrong half and missed ${target}.`);
                } else {
                    setFailed(true);
                    setMessage(`Binary search completed.`);
                }
                return;
            }
            s++;
            const mid = Math.floor((lo + hi) / 2);
            setHighlight(mid);
            setLow(lo);
            setHigh(hi);
            setSteps(s);

            if (data[mid] === target) {
                clearInterval(timerRef.current);
                setRunning(false);
                setFound(true);
                setMessage(useSorted
                    ? `✅ Found ${target} in just ${s} steps! Binary search works perfectly on sorted data.`
                    : `✅ Lucky! Found ${target} by chance. But this is NOT guaranteed on unsorted data.`
                );
                return;
            } else if (data[mid] < target) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }, 400);
    }, [target]);

    useEffect(() => () => clearInterval(timerRef.current), []);

    return (
        <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button onClick={() => start(true)} disabled={running}
                    className="btn btn-primary" style={{ width: 'auto', background: COLORS.green, padding: '10px 24px', opacity: running ? 0.5 : 1 }}>
                    🔍 Search in Sorted Data
                </button>
                <button onClick={() => start(false)} disabled={running}
                    className="btn btn-primary" style={{ width: 'auto', background: COLORS.red, padding: '10px 24px', opacity: running ? 0.5 : 1 }}>
                    🔍 Search in Unsorted Data
                </button>
                <span style={{ color: COLORS.amberLight, fontSize: '14px', alignSelf: 'center' }}>
                    Target: <strong>{target}</strong>
                </span>
            </div>

            <div style={{
                background: mode === 'unsorted' ? COLORS.redBg : COLORS.greenBg,
                borderRadius: '12px', padding: '20px',
                border: `1px solid ${mode === 'unsorted' ? 'rgba(225,29,72,0.3)' : 'rgba(16,185,129,0.3)'}`,
            }}>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '140px' }}>
                    {arr.map((v, i) => {
                        const isEliminated = i < low || i > high;
                        const isHighlighted = i === highlight;
                        let bg = 'rgba(255,255,255,0.12)';
                        if (isEliminated && !found) bg = 'rgba(255,255,255,0.03)';
                        if (isHighlighted) bg = found ? COLORS.green : COLORS.amber;

                        return (
                            <div key={i} style={{
                                flex: 1,
                                height: `${(v / SIZE) * 100}%`,
                                background: bg,
                                borderRadius: '3px 3px 0 0',
                                transition: 'all 0.15s ease',
                                position: 'relative',
                            }}>
                                <span style={{
                                    position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)',
                                    fontSize: '11px', fontWeight: isHighlighted ? 'bold' : 'normal',
                                    color: isHighlighted ? (found ? COLORS.greenLight : COLORS.amberLight) : 'rgba(255,255,255,0.4)',
                                }}>{v}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {message && (
                <div style={{
                    marginTop: '20px', padding: '24px', borderRadius: '16px', textAlign: 'center',
                    background: found
                        ? 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(16,185,129,0.08))'
                        : 'linear-gradient(135deg, rgba(225,29,72,0.25), rgba(225,29,72,0.08))',
                    border: `2px solid ${found ? 'rgba(16,185,129,0.5)' : 'rgba(225,29,72,0.5)'}`,
                    boxShadow: `0 0 30px ${found ? 'rgba(16,185,129,0.15)' : 'rgba(225,29,72,0.15)'}`,
                }}>
                    <p style={{ fontSize: '28px', margin: '0 0 8px 0' }}>{found ? '🎯' : '💥'}</p>
                    <p style={{ color: '#fff', fontSize: '18px', fontWeight: '800', margin: 0 }}>{message}</p>
                </div>
            )}
        </div>
    );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function Module4() {
    return (
        <main className="container">
            <header>
                <div className="logo-text">Algo<span className="logo-highlight">Think</span> <span className="logo-suffix">Module 4</span></div>
                <Link href="/dashboard" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>⬅️ Dashboard</Link>
            </header>

            <div className="panel">
                <h1 style={{ fontSize: '36px', color: COLORS.amberLight, marginBottom: '20px', fontWeight: '900' }}>Classic CS Algorithms</h1>
                <p style={{ color: COLORS.muted, fontSize: '18px', lineHeight: '1.7', marginBottom: '40px' }}>
                    You've learned to think algorithmically. Now let's see how <strong>real computer scientists</strong> use algorithms to search and sort massive amounts of data — and why picking the right strategy changes everything.
                </p>

                {/* ── Section 1: The Big Question ─────────────────────────────── */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: `1px solid ${COLORS.border}` }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '16px' }}>🔎 The Search Problem</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div style={{ background: COLORS.redBg, padding: '24px', borderRadius: '12px', borderLeft: `4px solid ${COLORS.red}` }}>
                            <h3 style={{ color: COLORS.redLight, fontSize: '18px', marginBottom: '10px' }}>🐢 The Slow Way</h3>
                            <p style={{ color: COLORS.muted, fontSize: '15px', lineHeight: '1.6' }}>
                                Check every single item, one by one. Works, but painfully slow on large data.
                            </p>
                            <p style={{ color: COLORS.red, fontSize: '14px', marginTop: '10px', fontWeight: 'bold' }}>1,000 items = up to 1,000 checks</p>
                        </div>
                        <div style={{ background: COLORS.greenBg, padding: '24px', borderRadius: '12px', borderLeft: `4px solid ${COLORS.green}` }}>
                            <h3 style={{ color: COLORS.greenLight, fontSize: '18px', marginBottom: '10px' }}>🐇 The Smart Way</h3>
                            <p style={{ color: COLORS.muted, fontSize: '15px', lineHeight: '1.6' }}>
                                If the data is sorted, split it in half each time. Eliminates half the data every step!
                            </p>
                            <p style={{ color: COLORS.green, fontSize: '14px', marginTop: '10px', fontWeight: 'bold' }}>1,000,000 items = only ~20 checks 🤯</p>
                        </div>
                    </div>
                </div>

                {/* ── Section 2: Search Race ──────────────────────────────────── */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: `1px solid ${COLORS.border}` }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '8px' }}>🏁 Race: Linear vs Binary Search</h2>
                    <p style={{ color: COLORS.muted, fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                        Watch both algorithms search for the same number simultaneously. See who wins!
                    </p>
                    <SearchRace />
                </div>

                {/* ── Section 3: Bubble Sort ──────────────────────────────────── */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: `1px solid ${COLORS.border}` }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '8px' }}>🫧 Bubble Sort</h2>
                    <p style={{ color: COLORS.muted, fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                        Compare neighbors, swap if out of order. Biggest numbers "bubble" to the right each pass.
                    </p>
                    <BubbleSortVisualizer />
                </div>

                {/* ── Section 4: Why Sorting Matters ──────────────────────────── */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: `1px solid ${COLORS.border}` }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '8px' }}>⚠️ Why Sorting Matters</h2>
                    <p style={{ color: COLORS.muted, fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                        Binary search only works on <strong>sorted data</strong>. Watch what happens when you try it on shuffled data — it looks in the wrong half and misses the answer!
                    </p>
                    <WhySortingMatters />
                </div>

                {/* ── Takeaway ────────────────────────────────────────────────── */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(217,119,6,0.15), rgba(139,92,246,0.15))',
                    padding: '30px', borderRadius: '16px', border: '1px solid rgba(217,119,6,0.3)',
                }}>
                    <h2 style={{ fontSize: '24px', color: '#ffffff', marginBottom: '20px', textAlign: 'center' }}>🧠 Key Takeaways</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <div style={{ background: COLORS.surface, padding: '20px', borderRadius: '12px', textAlign: 'center', border: `1px solid ${COLORS.border}` }}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔍</div>
                            <h4 style={{ color: COLORS.amberLight, fontSize: '16px', marginBottom: '8px' }}>Linear Search</h4>
                            <p style={{ color: COLORS.muted, fontSize: '13px', lineHeight: '1.5' }}>Simple but slow. Checks every item one at a time.</p>
                        </div>
                        <div style={{ background: COLORS.surface, padding: '20px', borderRadius: '12px', textAlign: 'center', border: `1px solid ${COLORS.border}` }}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚡</div>
                            <h4 style={{ color: COLORS.greenLight, fontSize: '16px', marginBottom: '8px' }}>Binary Search</h4>
                            <p style={{ color: COLORS.muted, fontSize: '13px', lineHeight: '1.5' }}>Lightning fast! But data must be sorted first.</p>
                        </div>
                        <div style={{ background: COLORS.surface, padding: '20px', borderRadius: '12px', textAlign: 'center', border: `1px solid ${COLORS.border}` }}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🫧</div>
                            <h4 style={{ color: COLORS.purpleLight, fontSize: '16px', marginBottom: '8px' }}>Bubble Sort</h4>
                            <p style={{ color: COLORS.muted, fontSize: '13px', lineHeight: '1.5' }}>A beginner sorting method. Big items bubble up to the end!</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                    <Link href="/course/module-3" className="btn btn-secondary" style={{ width: 'auto', background: 'rgba(255,255,255,0.05)', color: 'white', padding: '12px 30px', border: '1px solid var(--border)' }}>
                        ⬅️ Previous: Module 3
                    </Link>
                    <Link href="/lab" className="btn btn-primary" style={{ width: 'auto', background: '#3b82f6', padding: '12px 30px' }}>
                        Proceed to The Lab ➡️
                    </Link>
                </div>
            </div>
        </main>
    );
}
