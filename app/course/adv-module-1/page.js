'use client';
import Link from 'next/link';
import { useState } from 'react';

// ─── Color Palette (matching site theme) ────────────────────────────────────
const C = {
    green: '#10b981', greenLight: '#34d399', greenBg: 'rgba(16,185,129,0.15)',
    blue: '#3b82f6', blueLight: '#60a5fa', blueBg: 'rgba(59,130,246,0.15)',
    purple: '#8b5cf6', purpleLight: '#c4b5fd', purpleBg: 'rgba(139,92,246,0.15)',
    amber: '#d97706', amberLight: '#fcd34d', amberBg: 'rgba(217,119,6,0.15)',
    red: '#e11d48', redLight: '#fca5a5', redBg: 'rgba(225,29,72,0.15)',
    surface: 'rgba(255,255,255,0.05)', border: '#333b4d', muted: '#cbd5e1',
};

// ─── Interactive: Stack Visualizer ──────────────────────────────────────────
function StackDemo() {
    const [stack, setStack] = useState(['📕 Math Book']);
    const [inputVal, setInputVal] = useState('');
    const [message, setMessage] = useState('A stack of books — last one placed goes on top!');

    const push = () => {
        const item = inputVal.trim() || `📘 Book #${stack.length + 1}`;
        setStack(prev => [...prev, item]);
        setInputVal('');
        setMessage(`Pushed "${item}" on top!`);
    };

    const pop = () => {
        if (stack.length === 0) { setMessage('Stack is empty! Nothing to remove.'); return; }
        const removed = stack[stack.length - 1];
        setStack(prev => prev.slice(0, -1));
        setMessage(`Popped "${removed}" from the top. You can only remove the top item!`);
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <input value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="Item name (optional)" onKeyDown={e => e.key === 'Enter' && push()}
                    style={{ flex: 1, minWidth: '150px', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${C.border}`, background: C.surface, color: '#fff', fontSize: '14px' }} />
                <button onClick={push} className="btn btn-primary" style={{ width: 'auto', background: C.green, padding: '10px 20px' }}>⬆️ Push</button>
                <button onClick={pop} className="btn btn-primary" style={{ width: 'auto', background: C.red, padding: '10px 20px' }}>⬇️ Pop</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '6px', padding: '20px', background: C.surface, borderRadius: '12px', border: `1px solid ${C.border}`, minHeight: '120px' }}>
                {stack.length === 0 && <p style={{ color: C.muted, textAlign: 'center', fontSize: '14px' }}>Stack is empty</p>}
                {stack.map((item, i) => (
                    <div key={i} style={{
                        padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
                        background: i === stack.length - 1 ? C.greenBg : C.blueBg,
                        border: `1px solid ${i === stack.length - 1 ? 'rgba(16,185,129,0.4)' : 'rgba(59,130,246,0.2)'}`,
                        color: i === stack.length - 1 ? C.greenLight : C.blueLight,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <span>{item}</span>
                        {i === stack.length - 1 && <span style={{ fontSize: '11px', background: C.green, color: '#fff', padding: '2px 8px', borderRadius: '4px' }}>TOP</span>}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '8px', background: C.greenBg, border: '1px solid rgba(16,185,129,0.3)' }}>
                <p style={{ margin: 0, color: C.greenLight, fontSize: '14px' }}>{message}</p>
            </div>
        </div>
    );
}

// ─── Interactive: Queue Visualizer ──────────────────────────────────────────
function QueueDemo() {
    const [queue, setQueue] = useState(['🧑 Alice', '👨 Bob', '👩 Carol']);
    const [inputVal, setInputVal] = useState('');
    const [message, setMessage] = useState('A queue at a ticket counter — first in line gets served first!');

    const enqueue = () => {
        const item = inputVal.trim() || `🧑 Person #${queue.length + 1}`;
        setQueue(prev => [...prev, item]);
        setInputVal('');
        setMessage(`"${item}" joined the back of the line.`);
    };

    const dequeue = () => {
        if (queue.length === 0) { setMessage('Queue is empty! No one to serve.'); return; }
        const removed = queue[0];
        setQueue(prev => prev.slice(1));
        setMessage(`"${removed}" was served and left from the front!`);
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <input value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="Person name (optional)" onKeyDown={e => e.key === 'Enter' && enqueue()}
                    style={{ flex: 1, minWidth: '150px', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${C.border}`, background: C.surface, color: '#fff', fontSize: '14px' }} />
                <button onClick={enqueue} className="btn btn-primary" style={{ width: 'auto', background: C.blue, padding: '10px 20px' }}>➡️ Enqueue</button>
                <button onClick={dequeue} className="btn btn-primary" style={{ width: 'auto', background: C.amber, padding: '10px 20px' }}>⬅️ Dequeue</button>
            </div>

            <div style={{ display: 'flex', gap: '8px', padding: '20px', background: C.surface, borderRadius: '12px', border: `1px solid ${C.border}`, minHeight: '70px', alignItems: 'center', overflowX: 'auto' }}>
                {queue.length === 0 && <p style={{ color: C.muted, textAlign: 'center', fontSize: '14px', width: '100%' }}>Queue is empty</p>}
                {queue.map((item, i) => (
                    <div key={i} style={{
                        padding: '12px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap',
                        background: i === 0 ? C.amberBg : C.blueBg,
                        border: `1px solid ${i === 0 ? 'rgba(217,119,6,0.4)' : 'rgba(59,130,246,0.2)'}`,
                        color: i === 0 ? C.amberLight : C.blueLight, position: 'relative',
                    }}>
                        {item}
                        {i === 0 && <div style={{ fontSize: '10px', background: C.amber, color: '#fff', padding: '1px 6px', borderRadius: '4px', position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)' }}>FRONT</div>}
                        {i === queue.length - 1 && queue.length > 1 && <div style={{ fontSize: '10px', background: C.blue, color: '#fff', padding: '1px 6px', borderRadius: '4px', position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)' }}>BACK</div>}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '8px', background: C.blueBg, border: '1px solid rgba(59,130,246,0.3)' }}>
                <p style={{ margin: 0, color: C.blueLight, fontSize: '14px' }}>{message}</p>
            </div>
        </div>
    );
}

// ─── Interactive: Array vs Linked List ──────────────────────────────────────
function ArrayVsLinkedList() {
    const [mode, setMode] = useState('array');
    const [items, setItems] = useState(['A', 'B', 'C', 'D', 'E']);
    const [highlight, setHighlight] = useState(-1);
    const [message, setMessage] = useState('Click an operation to see the difference!');

    const accessMiddle = () => {
        const midIdx = Math.floor(items.length / 2);
        setHighlight(midIdx);
        if (mode === 'array') {
            setMessage(`✅ Array: Accessed "${items[midIdx]}" at index ${midIdx} instantly! Arrays use direct indexing — O(1).`);
        } else {
            setMessage(`🐢 Linked List: Had to walk through ${midIdx} nodes to reach "${items[midIdx]}". No indexing — O(n).`);
        }
        setTimeout(() => setHighlight(-1), 2000);
    };

    const insertAtStart = () => {
        const newItem = String.fromCharCode(65 + items.length);
        setItems(prev => [newItem, ...prev]);
        setHighlight(0);
        if (mode === 'array') {
            setMessage(`🐢 Array: Inserted "${newItem}" at the start, but had to shift ALL ${items.length} existing items right — O(n).`);
        } else {
            setMessage(`✅ Linked List: Inserted "${newItem}" at the start instantly. Just updated one pointer — O(1).`);
        }
        setTimeout(() => setHighlight(-1), 2000);
    };

    const reset = () => {
        setItems(['A', 'B', 'C', 'D', 'E']);
        setHighlight(-1);
        setMessage('Click an operation to see the difference!');
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={() => { setMode('array'); reset(); }} className="btn btn-primary"
                    style={{ width: 'auto', background: mode === 'array' ? C.purple : C.surface, padding: '10px 20px', border: `1px solid ${mode === 'array' ? C.purple : C.border}` }}>
                    📊 Array
                </button>
                <button onClick={() => { setMode('linked'); reset(); }} className="btn btn-primary"
                    style={{ width: 'auto', background: mode === 'linked' ? C.green : C.surface, padding: '10px 20px', border: `1px solid ${mode === 'linked' ? C.green : C.border}` }}>
                    🔗 Linked List
                </button>
                <div style={{ width: '1px', height: '24px', background: C.border }} />
                <button onClick={accessMiddle} className="btn btn-primary" style={{ width: 'auto', background: C.blue, padding: '10px 20px' }}>🎯 Access Middle</button>
                <button onClick={insertAtStart} className="btn btn-primary" style={{ width: 'auto', background: C.amber, padding: '10px 20px' }}>➕ Insert at Start</button>
                <button onClick={reset} className="btn btn-primary" style={{ width: 'auto', background: C.surface, padding: '10px 20px', border: `1px solid ${C.border}` }}>🔄 Reset</button>
            </div>

            <div style={{ display: 'flex', gap: mode === 'linked' ? '0px' : '8px', padding: '24px', background: C.surface, borderRadius: '12px', border: `1px solid ${C.border}`, minHeight: '80px', alignItems: 'center', overflowX: 'auto' }}>
                {items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                            width: mode === 'array' ? '52px' : '48px', height: '52px', borderRadius: mode === 'array' ? '8px' : '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '18px', fontWeight: '800',
                            background: i === highlight
                                ? (mode === 'array' ? C.purpleBg : C.greenBg)
                                : (mode === 'array' ? C.purpleBg : C.greenBg),
                            border: `2px solid ${i === highlight
                                ? (mode === 'array' ? C.purple : C.green)
                                : (mode === 'array' ? 'rgba(139,92,246,0.2)' : 'rgba(16,185,129,0.2)')}`,
                            color: mode === 'array' ? C.purpleLight : C.greenLight,
                            transition: 'all 0.3s ease',
                            transform: i === highlight ? 'scale(1.2)' : 'scale(1)',
                        }}>
                            {item}
                        </div>
                        {mode === 'linked' && i < items.length - 1 && (
                            <div style={{ color: C.greenLight, fontSize: '18px', margin: '0 4px' }}>→</div>
                        )}
                    </div>
                ))}
                {mode === 'linked' && <div style={{ color: C.muted, fontSize: '14px', marginLeft: '8px' }}>→ null</div>}
            </div>

            {mode === 'array' && (
                <div style={{ display: 'flex', gap: '8px', padding: '0 24px', marginTop: '4px' }}>
                    {items.map((_, i) => (
                        <div key={i} style={{ width: '52px', textAlign: 'center', fontSize: '11px', color: C.muted }}>[{i}]</div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '12px', padding: '14px 16px', borderRadius: '8px', background: mode === 'array' ? C.purpleBg : C.greenBg, border: `1px solid ${mode === 'array' ? 'rgba(139,92,246,0.3)' : 'rgba(16,185,129,0.3)'}` }}>
                <p style={{ margin: 0, color: mode === 'array' ? C.purpleLight : C.greenLight, fontSize: '14px', lineHeight: '1.6' }}>{message}</p>
            </div>
        </div>
    );
}


// ─── Main Page ──────────────────────────────────────────────────────────────
export default function AdvModule1() {
    return (
        <main className="container">
            <header>
                <div className="logo-text">Algo<span className="logo-highlight">Think</span> <span className="logo-suffix">Adv. Module 1</span></div>
                <Link href="/advanced-dashboard" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>⬅️ Dashboard</Link>
            </header>

            <div className="panel">
                <h1 style={{ fontSize: '36px', color: C.greenLight, marginBottom: '20px', fontWeight: '900' }}>What Are Data Structures?</h1>
                <p style={{ color: C.muted, fontSize: '18px', lineHeight: '1.7', marginBottom: '30px' }}>
                    A <strong>data structure</strong> is simply a way to <strong>organize and store data</strong> so you can use it efficiently. Think of it like choosing the right container for the job — you wouldn't store soup in a paper bag!
                </p>

                {/* ── Section 1: Arrays ─────────────────────────────────── */}
                <div style={{ background: C.purpleBg, padding: '24px', borderRadius: '12px', borderLeft: `4px solid ${C.purple}`, marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '12px' }}>📊 Arrays — The Numbered Shelf</h2>
                    <p style={{ color: C.muted, lineHeight: '1.8', fontSize: '15px', marginBottom: '16px' }}>
                        An <strong>array</strong> is like a row of numbered lockers. Each locker has an <strong>index</strong> (0, 1, 2...) so you can instantly grab any item by its number. Great for fast access, but inserting in the middle means shifting everything over.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ background: C.surface, padding: '16px', borderRadius: '10px', border: `1px solid ${C.border}` }}>
                            <h4 style={{ color: C.greenLight, fontSize: '14px', marginBottom: '8px' }}>✅ Best For</h4>
                            <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}>Quick lookups by position, storing ordered collections (scores, names, pixels)</p>
                        </div>
                        <div style={{ background: C.surface, padding: '16px', borderRadius: '10px', border: `1px solid ${C.border}` }}>
                            <h4 style={{ color: C.amberLight, fontSize: '14px', marginBottom: '8px' }}>🌍 Real Life</h4>
                            <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}>Spotify playlist, seats in a classroom, pixels on your screen</p>
                        </div>
                    </div>
                </div>

                {/* ── Section 2: Stacks ─────────────────────────────────── */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: `1px solid ${C.border}` }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '8px' }}>📚 Stacks — Last In, First Out (LIFO)</h2>
                    <p style={{ color: C.muted, fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                        Imagine a stack of plates. You can only add or remove from the <strong>top</strong>. The last plate you put on is the first one you take off. That's <strong>LIFO</strong>!
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ background: C.surface, padding: '16px', borderRadius: '10px', border: `1px solid ${C.border}` }}>
                            <h4 style={{ color: C.greenLight, fontSize: '14px', marginBottom: '8px' }}>✅ Best For</h4>
                            <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}>Undo/Redo, browser back button, function call tracking</p>
                        </div>
                        <div style={{ background: C.surface, padding: '16px', borderRadius: '10px', border: `1px solid ${C.border}` }}>
                            <h4 style={{ color: C.amberLight, fontSize: '14px', marginBottom: '8px' }}>🌍 Real Life</h4>
                            <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}>Stack of cafeteria trays, Ctrl+Z undo, browser history</p>
                        </div>
                    </div>
                    <StackDemo />
                </div>

                {/* ── Section 3: Queues ─────────────────────────────────── */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: `1px solid ${C.border}` }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '8px' }}>🎫 Queues — First In, First Out (FIFO)</h2>
                    <p style={{ color: C.muted, fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                        A queue is like a line at the movies. First person in line gets served first. New people join at the <strong>back</strong>, people leave from the <strong>front</strong>. That's <strong>FIFO</strong>!
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ background: C.surface, padding: '16px', borderRadius: '10px', border: `1px solid ${C.border}` }}>
                            <h4 style={{ color: C.greenLight, fontSize: '14px', marginBottom: '8px' }}>✅ Best For</h4>
                            <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}>Print jobs, message ordering, task scheduling</p>
                        </div>
                        <div style={{ background: C.surface, padding: '16px', borderRadius: '10px', border: `1px solid ${C.border}` }}>
                            <h4 style={{ color: C.amberLight, fontSize: '14px', marginBottom: '8px' }}>🌍 Real Life</h4>
                            <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}>Movie ticket line, printer queue, customer support chat</p>
                        </div>
                    </div>
                    <QueueDemo />
                </div>

                {/* ── Section 4: Array vs Linked List ──────────────────── */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: `1px solid ${C.border}` }}>
                    <h2 style={{ fontSize: '28px', color: '#ffffff', marginBottom: '8px' }}>🔗 Arrays vs Linked Lists</h2>
                    <p style={{ color: C.muted, fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                        Arrays store items in <strong>contiguous memory</strong> (side by side), while Linked Lists store items in <strong>separate nodes</strong> connected by pointers. Each has strengths — try both operations below!
                    </p>
                    <ArrayVsLinkedList />
                </div>

                {/* ── Takeaway ────────────────────────────────────────── */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(139,92,246,0.15))',
                    padding: '30px', borderRadius: '16px', border: '1px solid rgba(16,185,129,0.3)',
                }}>
                    <h2 style={{ fontSize: '24px', color: '#ffffff', marginBottom: '20px', textAlign: 'center' }}>🧠 Key Takeaways</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                        {[
                            { icon: '📊', title: 'Array', desc: 'Fast access by index. Fixed order.', color: C.purpleLight },
                            { icon: '📚', title: 'Stack', desc: 'LIFO. Last in, first out.', color: C.greenLight },
                            { icon: '🎫', title: 'Queue', desc: 'FIFO. First in, first out.', color: C.blueLight },
                            { icon: '🔗', title: 'Linked List', desc: 'Fast insert/delete. No indexing.', color: C.amberLight },
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
                    <Link href="/advanced-dashboard" className="btn btn-secondary" style={{ width: 'auto', background: 'rgba(255,255,255,0.05)', color: 'white', padding: '12px 30px', border: '1px solid var(--border)' }}>
                        ⬅️ Dashboard
                    </Link>
                    <Link href="/course/adv-module-2" className="btn btn-primary" style={{ width: 'auto', background: '#3b82f6', padding: '12px 30px' }}>
                        Proceed to Module 2 ➡️
                    </Link>
                </div>
            </div>
        </main>
    );
}
