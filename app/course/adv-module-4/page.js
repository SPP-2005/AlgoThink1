'use client';
import Link from 'next/link';
import { useState, useCallback } from 'react';

const C = {
    green: '#10b981', greenLight: '#34d399', greenBg: 'rgba(16,185,129,0.15)',
    blue: '#3b82f6', blueLight: '#60a5fa', blueBg: 'rgba(59,130,246,0.15)',
    purple: '#8b5cf6', purpleLight: '#c4b5fd', purpleBg: 'rgba(139,92,246,0.15)',
    amber: '#d97706', amberLight: '#fcd34d', amberBg: 'rgba(217,119,6,0.15)',
    red: '#e11d48', redLight: '#fca5a5', redBg: 'rgba(225,29,72,0.15)',
    orange: '#fb923c', orangeLight: '#fdba74', orangeBg: 'rgba(251,146,60,0.15)',
    surface: 'rgba(255,255,255,0.05)', border: '#333b4d', muted: '#cbd5e1',
};

// ─── Project 1: To-Do App with Stack ────────────────────────────────────────
function TodoProject() {
    const [todos, setTodos] = useState([
        { text: 'Learn Arrays', done: true },
        { text: 'Learn Stacks', done: true },
        { text: 'Build a To-Do App', done: false },
    ]);
    const [input, setInput] = useState('');
    const [undoStack, setUndoStack] = useState([]);
    const [message, setMessage] = useState('Try adding, completing, and undoing tasks. The Undo uses a Stack!');

    const addTodo = () => {
        if (!input.trim()) return;
        const newTodo = { text: input, done: false };
        setUndoStack(prev => [...prev, { action: 'add', index: todos.length }]);
        setTodos(prev => [...prev, newTodo]);
        setInput('');
        setMessage(`Added "${input}". Undo stack now has ${undoStack.length + 1} actions.`);
    };

    const toggleTodo = (idx) => {
        setUndoStack(prev => [...prev, { action: 'toggle', index: idx, prevState: todos[idx].done }]);
        setTodos(prev => prev.map((t, i) => i === idx ? { ...t, done: !t.done } : t));
        setMessage(`Toggled "${todos[idx].text}". You can undo this!`);
    };

    const undo = () => {
        if (undoStack.length === 0) { setMessage('Nothing to undo! Stack is empty.'); return; }
        const lastAction = undoStack[undoStack.length - 1];
        setUndoStack(prev => prev.slice(0, -1));
        if (lastAction.action === 'add') {
            setTodos(prev => prev.slice(0, -1));
            setMessage(`Undid "add" — removed the last task. Stack: ${undoStack.length - 1} actions left.`);
        } else if (lastAction.action === 'toggle') {
            setTodos(prev => prev.map((t, i) => i === lastAction.index ? { ...t, done: lastAction.prevState } : t));
            setMessage(`Undid "toggle" — restored previous state. Stack: ${undoStack.length - 1} actions left.`);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTodo()} placeholder="Add a new task..."
                    style={{ flex: 1, minWidth: '180px', padding: '10px 14px', borderRadius: '8px', border: `1px solid ${C.border}`, background: C.surface, color: '#fff', fontSize: '14px' }} />
                <button onClick={addTodo} className="btn btn-primary" style={{ width: 'auto', background: C.green, padding: '10px 20px' }}>➕ Add</button>
                <button onClick={undo} className="btn btn-primary" style={{ width: 'auto', background: C.amber, padding: '10px 20px' }}>
                    ↩️ Undo ({undoStack.length})
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {todos.map((todo, i) => (
                    <div key={i} onClick={() => toggleTodo(i)} style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
                        background: todo.done ? C.greenBg : C.surface,
                        border: `1px solid ${todo.done ? 'rgba(16,185,129,0.3)' : C.border}`,
                        transition: 'all 0.2s ease',
                    }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: todo.done ? C.green : 'rgba(255,255,255,0.1)', border: `2px solid ${todo.done ? C.green : C.border}`, fontSize: '14px', color: '#fff' }}>
                            {todo.done && '✓'}
                        </div>
                        <span style={{ color: todo.done ? C.greenLight : '#fff', fontSize: '15px', textDecoration: todo.done ? 'line-through' : 'none', opacity: todo.done ? 0.7 : 1 }}>{todo.text}</span>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: C.blueBg, padding: '16px', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.3)' }}>
                    <h4 style={{ color: C.blueLight, fontSize: '14px', marginBottom: '6px' }}>📊 Data Structure Used</h4>
                    <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}><strong>Array</strong> for the to-do list, <strong>Stack</strong> for the undo history (LIFO)</p>
                </div>
                <div style={{ background: C.purpleBg, padding: '16px', borderRadius: '10px', border: '1px solid rgba(139,92,246,0.3)' }}>
                    <h4 style={{ color: C.purpleLight, fontSize: '14px', marginBottom: '6px' }}>🧠 Algorithm Concept</h4>
                    <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}>Push actions to stack on change, pop from stack on undo — the core of Ctrl+Z!</p>
                </div>
            </div>

            <div style={{ marginTop: '12px', padding: '12px 16px', borderRadius: '8px', background: C.greenBg, border: '1px solid rgba(16,185,129,0.3)' }}>
                <p style={{ margin: 0, color: C.greenLight, fontSize: '14px' }}>{message}</p>
            </div>
        </div>
    );
}

// ─── Project 2: Autocomplete Search ─────────────────────────────────────────
function AutocompleteProject() {
    const dictionary = [
        'algorithm', 'array', 'binary', 'bubble', 'cache', 'compiler', 'data', 'database',
        'debug', 'decomposition', 'encryption', 'fibonacci', 'function', 'graph', 'hash',
        'heap', 'index', 'iteration', 'javascript', 'kernel', 'linked list', 'loop',
        'merge sort', 'network', 'object', 'pattern', 'queue', 'recursion', 'search',
        'sort', 'stack', 'string', 'tree', 'variable', 'web', 'xor', 'yield', 'zero',
    ];
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [ops, setOps] = useState(0);
    const [method, setMethod] = useState('linear');

    const search = useCallback((q, m) => {
        if (!q.trim()) { setResults([]); setOps(0); return; }
        let operations = 0;
        let matches = [];

        if (m === 'linear') {
            for (const word of dictionary) {
                operations++;
                if (word.startsWith(q.toLowerCase())) matches.push(word);
            }
        } else {
            // Binary search for prefix
            let lo = 0, hi = dictionary.length - 1;
            let startIdx = -1;
            while (lo <= hi) {
                operations++;
                const mid = Math.floor((lo + hi) / 2);
                if (dictionary[mid].startsWith(q.toLowerCase())) {
                    startIdx = mid;
                    hi = mid - 1;
                } else if (dictionary[mid] < q.toLowerCase()) {
                    lo = mid + 1;
                } else {
                    hi = mid - 1;
                }
            }
            if (startIdx !== -1) {
                for (let i = startIdx; i < dictionary.length && dictionary[i].startsWith(q.toLowerCase()); i++) {
                    operations++;
                    matches.push(dictionary[i]);
                }
            }
        }

        setResults(matches);
        setOps(operations);
    }, []);

    const handleChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        search(val, method);
    };

    const handleMethodChange = (m) => {
        setMethod(m);
        search(query, m);
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={() => handleMethodChange('linear')} className="btn btn-primary"
                    style={{ width: 'auto', background: method === 'linear' ? C.red : C.surface, padding: '8px 16px', border: `1px solid ${method === 'linear' ? C.red : C.border}`, fontSize: '13px' }}>
                    🐢 Linear Search
                </button>
                <button onClick={() => handleMethodChange('binary')} className="btn btn-primary"
                    style={{ width: 'auto', background: method === 'binary' ? C.green : C.surface, padding: '8px 16px', border: `1px solid ${method === 'binary' ? C.green : C.border}`, fontSize: '13px' }}>
                    🐇 Binary Search
                </button>
                <span style={{ color: C.muted, fontSize: '13px' }}>Operations: <strong style={{ color: method === 'linear' ? C.redLight : C.greenLight }}>{ops}</strong></span>
            </div>

            <input value={query} onChange={handleChange} placeholder="Start typing to search (e.g. 'al', 'bin', 'st')..."
                style={{ width: '100%', padding: '14px 18px', borderRadius: '10px', border: `1px solid ${C.border}`, background: C.surface, color: '#fff', fontSize: '16px', marginBottom: '16px', boxSizing: 'border-box' }} />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '40px' }}>
                {results.length === 0 && query && <span style={{ color: C.muted, fontSize: '14px' }}>No matches found.</span>}
                {results.map((word, i) => (
                    <span key={i} style={{
                        padding: '8px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: '600',
                        background: C.blueBg, border: `1px solid rgba(59,130,246,0.3)`, color: C.blueLight,
                    }}>
                        {word}
                    </span>
                ))}
            </div>

            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: C.blueBg, padding: '16px', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.3)' }}>
                    <h4 style={{ color: C.blueLight, fontSize: '14px', marginBottom: '6px' }}>📊 Data Structure Used</h4>
                    <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}><strong>Sorted Array</strong> — enables binary search for prefix matching</p>
                </div>
                <div style={{ background: C.purpleBg, padding: '16px', borderRadius: '10px', border: '1px solid rgba(139,92,246,0.3)' }}>
                    <h4 style={{ color: C.purpleLight, fontSize: '14px', marginBottom: '6px' }}>🧠 Algorithm Concept</h4>
                    <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}>Binary search finds the first prefix match in O(log n), then scans forward. Google's autocomplete works similarly!</p>
                </div>
            </div>
        </div>
    );
}

// ─── Project 3: Pathfinder Grid ─────────────────────────────────────────────
function PathfinderProject() {
    const ROWS = 10, COLS = 14;
    const [grid, setGrid] = useState(() => {
        const g = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        g[0][0] = 2; // start
        g[ROWS - 1][COLS - 1] = 3; // end
        // Some walls
        [[2,3],[2,4],[2,5],[3,5],[4,5],[5,3],[5,4],[5,5],[7,1],[7,2],[7,3],[7,7],[7,8],[7,9],[3,8],[4,8],[5,8]].forEach(([r,c]) => {
            if (r < ROWS && c < COLS) g[r][c] = 1;
        });
        return g;
    });
    const [visited, setVisited] = useState(new Set());
    const [path, setPath] = useState(new Set());
    const [running, setRunning] = useState(false);
    const [done, setDone] = useState(false);
    const [drawMode, setDrawMode] = useState('wall');
    const [message, setMessage] = useState('Draw walls by clicking cells, then hit "Find Path"! BFS explores layer by layer.');

    const toggleCell = (r, c) => {
        if (running || (r === 0 && c === 0) || (r === ROWS - 1 && c === COLS - 1)) return;
        setGrid(prev => {
            const g = prev.map(row => [...row]);
            g[r][c] = g[r][c] === 1 ? 0 : 1;
            return g;
        });
    };

    const findPath = useCallback(() => {
        setRunning(true);
        setDone(false);
        setVisited(new Set());
        setPath(new Set());

        const queue = [[0, 0]];
        const vis = new Set(['0,0']);
        const parent = {};
        const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
        const steps = [{ type: 'visit', cells: new Set(['0,0']) }];

        let found = false;
        while (queue.length > 0) {
            const levelSize = queue.length;
            const newVis = new Set();
            for (let i = 0; i < levelSize; i++) {
                const [r, c] = queue.shift();
                for (const [dr, dc] of dirs) {
                    const nr = r + dr, nc = c + dc;
                    const key = `${nr},${nc}`;
                    if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && !vis.has(key) && grid[nr][nc] !== 1) {
                        vis.add(key);
                        newVis.add(key);
                        parent[key] = `${r},${c}`;
                        queue.push([nr, nc]);
                        if (nr === ROWS - 1 && nc === COLS - 1) found = true;
                    }
                }
            }
            if (newVis.size > 0) steps.push({ type: 'visit', cells: new Set(vis) });
            if (found) break;
        }

        // Build path
        const pathCells = new Set();
        if (found) {
            let cur = `${ROWS - 1},${COLS - 1}`;
            while (cur) { pathCells.add(cur); cur = parent[cur]; }
        }

        let stepIdx = 0;
        const timer = setInterval(() => {
            if (stepIdx >= steps.length) {
                clearInterval(timer);
                if (found) {
                    setPath(pathCells);
                    setMessage(`🎯 Path found! BFS explored ${vis.size} cells to find the shortest route of ${pathCells.size} steps.`);
                } else {
                    setMessage(`❌ No path exists! BFS explored ${vis.size} cells but couldn't reach the goal.`);
                }
                setDone(true);
                setRunning(false);
                return;
            }
            setVisited(steps[stepIdx].cells);
            stepIdx++;
        }, 150);
    }, [grid]);

    const resetGrid = () => {
        const g = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        g[0][0] = 2;
        g[ROWS - 1][COLS - 1] = 3;
        setGrid(g);
        setVisited(new Set());
        setPath(new Set());
        setDone(false);
        setRunning(false);
        setMessage('Draw walls by clicking cells, then hit "Find Path"!');
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <button onClick={findPath} disabled={running} className="btn btn-primary" style={{ width: 'auto', background: C.green, padding: '10px 24px', opacity: running ? 0.5 : 1 }}>
                    {done ? '🔄 Run Again' : '🗺️ Find Path (BFS)'}
                </button>
                <button onClick={resetGrid} disabled={running} className="btn btn-primary" style={{ width: 'auto', background: C.surface, padding: '10px 20px', border: `1px solid ${C.border}` }}>🗑️ Clear Grid</button>
            </div>

            <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: '2px', background: C.surface, padding: '8px', borderRadius: '12px', border: `1px solid ${C.border}`, width: '100%' }}>
                {grid.map((row, r) => row.map((cell, c) => {
                    const key = `${r},${c}`;
                    const isVisited = visited.has(key);
                    const isPath = path.has(key);
                    const isStart = r === 0 && c === 0;
                    const isEnd = r === ROWS - 1 && c === COLS - 1;
                    const isWall = cell === 1;

                    let bg = 'rgba(255,255,255,0.05)';
                    if (isWall) bg = '#374151';
                    if (isVisited && !isPath) bg = C.blueBg;
                    if (isPath) bg = C.greenBg;
                    if (isStart) bg = C.amberBg;
                    if (isEnd) bg = C.purpleBg;

                    let borderColor = 'transparent';
                    if (isPath) borderColor = C.green;
                    if (isStart) borderColor = C.amber;
                    if (isEnd) borderColor = C.purple;

                    return (
                        <div key={key} onClick={() => toggleCell(r, c)}
                            style={{
                                aspectRatio: '1', borderRadius: '4px', cursor: running ? 'not-allowed' : 'pointer',
                                background: bg, border: `2px solid ${borderColor}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '12px', transition: 'background 0.15s ease',
                            }}>
                            {isStart && '🟢'}
                            {isEnd && '🏁'}
                        </div>
                    );
                }))}
            </div>

            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: C.blueBg, padding: '16px', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.3)' }}>
                    <h4 style={{ color: C.blueLight, fontSize: '14px', marginBottom: '6px' }}>📊 Data Structure Used</h4>
                    <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}><strong>Queue</strong> (BFS uses a queue), <strong>2D Array</strong> (the grid), <strong>HashMap</strong> (parent tracking)</p>
                </div>
                <div style={{ background: C.purpleBg, padding: '16px', borderRadius: '10px', border: '1px solid rgba(139,92,246,0.3)' }}>
                    <h4 style={{ color: C.purpleLight, fontSize: '14px', marginBottom: '6px' }}>🧠 Algorithm Concept</h4>
                    <p style={{ color: C.muted, fontSize: '13px', margin: 0 }}>BFS explores all neighbors first, guaranteeing the <strong>shortest path</strong>. Used in GPS, game AI, and network routing!</p>
                </div>
            </div>

            <div style={{ marginTop: '12px', padding: '14px 16px', borderRadius: '8px', background: done ? (path.size > 0 ? C.greenBg : C.redBg) : C.blueBg, border: `1px solid ${done ? (path.size > 0 ? 'rgba(16,185,129,0.3)' : 'rgba(225,29,72,0.3)') : 'rgba(59,130,246,0.3)'}` }}>
                <p style={{ margin: 0, color: done ? (path.size > 0 ? C.greenLight : C.redLight) : C.blueLight, fontSize: '14px', lineHeight: '1.6' }}>{message}</p>
            </div>
        </div>
    );
}


// ─── Main Page ──────────────────────────────────────────────────────────────
export default function AdvModule4() {
    return (
        <main className="container">
            <header>
                <div className="logo-text">Algo<span className="logo-highlight">Think</span> <span className="logo-suffix">Adv. Module 4</span></div>
                <Link href="/advanced-dashboard" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>⬅️ Dashboard</Link>
            </header>

            <div className="panel">
                <h1 style={{ fontSize: '36px', color: C.orangeLight, marginBottom: '20px', fontWeight: '900' }}>Build Something Real</h1>
                <p style={{ color: C.muted, fontSize: '18px', lineHeight: '1.7', marginBottom: '30px' }}>
                    You've learned about data structures, real-world algorithms, and Big O. Now let's <strong>build actual projects</strong> that use all of these concepts together. Each project shows exactly which data structure and algorithm powers it.
                </p>

                {/* ── Project 1: To-Do App ────────────────────────────── */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ background: C.greenBg, padding: '24px', borderRadius: '12px', borderLeft: `4px solid ${C.green}`, marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '12px' }}>📝 Project 1: To-Do App with Undo</h2>
                        <p style={{ color: C.muted, lineHeight: '1.8', fontSize: '15px' }}>
                            A classic to-do list — but with a twist. Every action you take is recorded on a <strong>Stack</strong>. Press Undo to pop the last action off the stack and reverse it. This is exactly how <strong>Ctrl+Z</strong> works in every text editor!
                        </p>
                    </div>
                    <TodoProject />
                </div>

                {/* ── Project 2: Autocomplete ─────────────────────────── */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ background: C.blueBg, padding: '24px', borderRadius: '12px', borderLeft: `4px solid ${C.blue}`, marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '12px' }}>🔍 Project 2: Autocomplete Search</h2>
                        <p style={{ color: C.muted, lineHeight: '1.8', fontSize: '15px' }}>
                            Start typing and watch suggestions appear instantly. Toggle between <strong>Linear Search</strong> (checks every word) and <strong>Binary Search</strong> (jumps to the right spot). Watch the operation count to see why search engines use smarter algorithms!
                        </p>
                    </div>
                    <AutocompleteProject />
                </div>

                {/* ── Project 3: Pathfinder ───────────────────────────── */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ background: C.orangeBg, padding: '24px', borderRadius: '12px', borderLeft: `4px solid ${C.orange}`, marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '12px' }}>🗺️ Project 3: Grid Pathfinder</h2>
                        <p style={{ color: C.muted, lineHeight: '1.8', fontSize: '15px' }}>
                            Draw walls on the grid, then watch <strong>BFS (Breadth-First Search)</strong> explore layer by layer to find the shortest path from 🟢 to 🏁. This is how GPS navigation, game AI, and robot pathfinding work!
                        </p>
                    </div>
                    <PathfinderProject />
                </div>

                {/* ── Takeaway ────────────────────────────────────────── */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(251,146,60,0.15), rgba(139,92,246,0.15))',
                    padding: '30px', borderRadius: '16px', border: '1px solid rgba(251,146,60,0.3)',
                }}>
                    <h2 style={{ fontSize: '24px', color: '#ffffff', marginBottom: '20px', textAlign: 'center' }}>🧠 What You Built</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        {[
                            { icon: '📝', title: 'To-Do + Undo', desc: 'Stack-powered undo system — the basis of every editor.', color: C.greenLight },
                            { icon: '🔍', title: 'Autocomplete', desc: 'Binary search on sorted data — how search engines suggest.', color: C.blueLight },
                            { icon: '🗺️', title: 'Pathfinder', desc: 'BFS on a grid — the core of GPS and game AI.', color: C.orangeLight },
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
                    <Link href="/course/adv-module-3" className="btn btn-secondary" style={{ width: 'auto', background: 'rgba(255,255,255,0.05)', color: 'white', padding: '12px 30px', border: '1px solid var(--border)' }}>
                        ⬅️ Previous: Module 3
                    </Link>
                    <Link href="/advanced-dashboard" className="btn btn-primary" style={{ width: 'auto', background: '#3b82f6', padding: '12px 30px' }}>
                        Back to Dashboard ➡️
                    </Link>
                </div>
            </div>
        </main>
    );
}
