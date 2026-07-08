'use client';
import Link from 'next/link';
import { useState, useRef, useCallback, useEffect } from 'react';

const C = {
    green: '#10b981', greenLight: '#34d399', greenBg: 'rgba(16,185,129,0.15)',
    blue: '#3b82f6', blueLight: '#60a5fa', blueBg: 'rgba(59,130,246,0.15)',
    purple: '#8b5cf6', purpleLight: '#c4b5fd', purpleBg: 'rgba(139,92,246,0.15)',
    amber: '#d97706', amberLight: '#fcd34d', amberBg: 'rgba(217,119,6,0.15)',
    red: '#e11d48', redLight: '#fca5a5', redBg: 'rgba(225,29,72,0.15)',
    cyan: '#06b6d4', cyanLight: '#67e8f9', cyanBg: 'rgba(6,182,212,0.15)',
    surface: 'rgba(255,255,255,0.05)', border: '#333b4d', muted: '#cbd5e1',
};

// ─── Interactive: PageRank Simulation ───────────────────────────────────────
function PageRankDemo() {
    const pages = [
        { id: 'A', label: '🌐 Wikipedia', links: ['B', 'C'] },
        { id: 'B', label: '📰 News Site', links: ['C'] },
        { id: 'C', label: '🎓 Your Blog', links: [] },
        { id: 'D', label: '📱 Social App', links: ['A', 'C'] },
    ];
    const [ranks, setRanks] = useState({ A: 0.25, B: 0.25, C: 0.25, D: 0.25 });
    const [iteration, setIteration] = useState(0);
    const [message, setMessage] = useState('Every page starts with equal rank. Click "Run Iteration" to see how links transfer authority!');

    const runIteration = () => {
        const d = 0.85;
        const n = pages.length;
        const newRanks = {};
        pages.forEach(p => { newRanks[p.id] = (1 - d) / n; });
        pages.forEach(p => {
            if (p.links.length > 0) {
                const share = ranks[p.id] / p.links.length;
                p.links.forEach(target => { newRanks[target] += d * share; });
            } else {
                pages.forEach(q => { newRanks[q.id] += d * ranks[p.id] / n; });
            }
        });
        setRanks(newRanks);
        setIteration(prev => prev + 1);

        const best = Object.entries(newRanks).sort((a, b) => b[1] - a[1])[0];
        const bestPage = pages.find(p => p.id === best[0]);
        setMessage(`After iteration ${iteration + 1}: "${bestPage.label}" has the highest rank (${(best[1] * 100).toFixed(1)}%) because more pages link to it!`);
    };

    const reset = () => {
        setRanks({ A: 0.25, B: 0.25, C: 0.25, D: 0.25 });
        setIteration(0);
        setMessage('Every page starts with equal rank. Click "Run Iteration" to see how links transfer authority!');
    };

    const maxRank = Math.max(...Object.values(ranks));

    return (
        <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button onClick={runIteration} className="btn btn-primary" style={{ width: 'auto', background: C.cyan, padding: '10px 24px' }}>
                    🔄 Run Iteration {iteration + 1}
                </button>
                <button onClick={reset} className="btn btn-primary" style={{ width: 'auto', background: C.surface, padding: '10px 20px', border: `1px solid ${C.border}` }}>Reset</button>
                <span style={{ color: C.muted, fontSize: '14px' }}>Iterations: <strong style={{ color: C.cyanLight }}>{iteration}</strong></span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {pages.map(p => (
                    <div key={p.id} style={{
                        background: ranks[p.id] === maxRank && iteration > 0 ? C.cyanBg : C.surface,
                        padding: '20px', borderRadius: '12px', textAlign: 'center',
                        border: `1px solid ${ranks[p.id] === maxRank && iteration > 0 ? 'rgba(6,182,212,0.5)' : C.border}`,
                        transition: 'all 0.3s ease',
                    }}>
                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>{p.label.split(' ')[0]}</div>
                        <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>{p.label.slice(2)}</h4>
                        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', height: '8px', overflow: 'hidden', marginBottom: '8px' }}>
                            <div style={{ height: '100%', width: `${ranks[p.id] * 100 * 2}%`, background: C.cyan, borderRadius: '8px', transition: 'width 0.5s ease' }} />
                        </div>
                        <span style={{ color: C.cyanLight, fontWeight: '800', fontSize: '18px' }}>{(ranks[p.id] * 100).toFixed(1)}%</span>
                        <p style={{ color: C.muted, fontSize: '11px', marginTop: '6px' }}>Links to: {p.links.length > 0 ? p.links.join(', ') : 'nobody'}</p>
                    </div>
                ))}
            </div>

            <div style={{ padding: '14px 16px', borderRadius: '8px', background: C.cyanBg, border: '1px solid rgba(6,182,212,0.3)' }}>
                <p style={{ margin: 0, color: C.cyanLight, fontSize: '14px', lineHeight: '1.6' }}>{message}</p>
            </div>
        </div>
    );
}

// ─── Interactive: Shortest Path (Dijkstra's visual) ─────────────────────────
function ShortestPathDemo() {
    const cities = ['🏠 Home', '🏫 School', '🏪 Store', '🏥 Hospital', '🏟️ Park'];
    const edges = [
        { from: 0, to: 1, weight: 4 }, { from: 0, to: 2, weight: 2 },
        { from: 1, to: 3, weight: 5 }, { from: 2, to: 1, weight: 1 },
        { from: 2, to: 3, weight: 8 }, { from: 3, to: 4, weight: 3 },
        { from: 2, to: 4, weight: 10 },
    ];
    const [distances, setDistances] = useState([0, Infinity, Infinity, Infinity, Infinity]);
    const [visited, setVisited] = useState([]);
    const [current, setCurrent] = useState(-1);
    const [path, setPath] = useState([]);
    const [running, setRunning] = useState(false);
    const [done, setDone] = useState(false);
    const [message, setMessage] = useState('GPS finds the shortest path from Home to every location. Click Start!');

    const runDijkstra = useCallback(() => {
        setRunning(true);
        setDone(false);
        const dist = [0, Infinity, Infinity, Infinity, Infinity];
        const vis = [];
        const prev = [-1, -1, -1, -1, -1];

        const steps = [];
        for (let i = 0; i < cities.length; i++) {
            let u = -1;
            for (let j = 0; j < cities.length; j++) {
                if (!vis.includes(j) && (u === -1 || dist[j] < dist[u])) u = j;
            }
            vis.push(u);
            steps.push({ type: 'visit', node: u, dist: [...dist], visited: [...vis] });

            for (const e of edges) {
                if (e.from === u && !vis.includes(e.to)) {
                    if (dist[u] + e.weight < dist[e.to]) {
                        dist[e.to] = dist[u] + e.weight;
                        prev[e.to] = u;
                        steps.push({ type: 'update', node: e.to, dist: [...dist], visited: [...vis] });
                    }
                }
            }
        }

        // Build path from home to park
        const finalPath = [];
        let node = 4;
        while (node !== -1) { finalPath.unshift(node); node = prev[node]; }
        steps.push({ type: 'done', path: finalPath, dist: [...dist] });

        let idx = 0;
        const timer = setInterval(() => {
            if (idx >= steps.length) { clearInterval(timer); return; }
            const step = steps[idx];
            setDistances(step.dist);
            if (step.type === 'visit') {
                setCurrent(step.node);
                setVisited(step.visited);
                setMessage(`Visiting "${cities[step.node].slice(2)}" — checking its neighbors for shorter paths...`);
            } else if (step.type === 'update') {
                setMessage(`Found shorter path to "${cities[step.node].slice(2)}"! New distance: ${step.dist[step.node]} min`);
            } else if (step.type === 'done') {
                setPath(step.path);
                setDone(true);
                setRunning(false);
                setCurrent(-1);
                setMessage(`🎯 Shortest path to Park: ${step.path.map(i => cities[i].split(' ')[0]).join(' → ')} = ${step.dist[4]} min total!`);
            }
            idx++;
        }, 800);
    }, []);

    const reset = () => {
        setDistances([0, Infinity, Infinity, Infinity, Infinity]);
        setVisited([]); setCurrent(-1); setPath([]); setDone(false); setRunning(false);
        setMessage('GPS finds the shortest path from Home to every location. Click Start!');
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <button onClick={runDijkstra} disabled={running} className="btn btn-primary" style={{ width: 'auto', background: C.green, padding: '10px 24px', opacity: running ? 0.5 : 1 }}>
                    {done ? '🔄 Run Again' : '🗺️ Start GPS!'}
                </button>
                <button onClick={reset} disabled={running} className="btn btn-primary" style={{ width: 'auto', background: C.surface, padding: '10px 20px', border: `1px solid ${C.border}` }}>Reset</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '16px' }}>
                {cities.map((city, i) => (
                    <div key={i} style={{
                        padding: '16px 12px', borderRadius: '12px', textAlign: 'center',
                        background: path.includes(i) && done ? C.greenBg : (current === i ? C.amberBg : (visited.includes(i) ? C.blueBg : C.surface)),
                        border: `2px solid ${path.includes(i) && done ? C.green : (current === i ? C.amber : (visited.includes(i) ? 'rgba(59,130,246,0.3)' : C.border))}`,
                        transition: 'all 0.3s ease',
                        transform: current === i ? 'scale(1.05)' : 'scale(1)',
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '6px' }}>{city.split(' ')[0]}</div>
                        <h4 style={{ color: '#fff', fontSize: '12px', marginBottom: '6px' }}>{city.slice(2)}</h4>
                        <span style={{ color: distances[i] === Infinity ? C.muted : C.greenLight, fontWeight: '800', fontSize: '16px' }}>
                            {distances[i] === Infinity ? '∞' : `${distances[i]} min`}
                        </span>
                    </div>
                ))}
            </div>

            <div style={{ padding: '14px 16px', borderRadius: '8px', background: done ? C.greenBg : C.blueBg, border: `1px solid ${done ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.3)'}` }}>
                <p style={{ margin: 0, color: done ? C.greenLight : C.blueLight, fontSize: '14px', lineHeight: '1.6' }}>{message}</p>
            </div>
        </div>
    );
}

// ─── Interactive: Recommendation Engine ─────────────────────────────────────
function RecommendationDemo() {
    const users = {
        'You': { '🎸 Rock': 5, '🎵 Pop': 3, '🎻 Classical': 1, '🎹 Jazz': 4, '🎤 R&B': 2 },
        'Alice': { '🎸 Rock': 4, '🎵 Pop': 5, '🎻 Classical': 1, '🎹 Jazz': 3, '🎤 R&B': 5 },
        'Bob': { '🎸 Rock': 5, '🎵 Pop': 2, '🎻 Classical': 4, '🎹 Jazz': 5, '🎤 R&B': 1 },
        'Carol': { '🎸 Rock': 1, '🎵 Pop': 5, '🎻 Classical': 5, '🎹 Jazz': 1, '🎤 R&B': 4 },
    };
    const genres = ['🎸 Rock', '🎵 Pop', '🎻 Classical', '🎹 Jazz', '🎤 R&B'];
    const [selected, setSelected] = useState(null);
    const [similarity, setSimilarity] = useState({});

    const findSimilar = () => {
        const you = users['You'];
        const results = {};
        ['Alice', 'Bob', 'Carol'].forEach(name => {
            const other = users[name];
            let dot = 0, magA = 0, magB = 0;
            genres.forEach(g => {
                dot += you[g] * other[g];
                magA += you[g] ** 2;
                magB += other[g] ** 2;
            });
            results[name] = dot / (Math.sqrt(magA) * Math.sqrt(magB));
        });
        setSimilarity(results);
        const best = Object.entries(results).sort((a, b) => b[1] - a[1])[0];
        setSelected(best[0]);
    };

    return (
        <div>
            <div style={{ marginBottom: '16px' }}>
                <button onClick={findSimilar} className="btn btn-primary" style={{ width: 'auto', background: C.purple, padding: '10px 24px' }}>
                    🎧 Find My Music Twin!
                </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', fontSize: '14px' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '12px 16px', textAlign: 'left', color: C.muted, borderBottom: `1px solid ${C.border}` }}>User</th>
                            {genres.map(g => (
                                <th key={g} style={{ padding: '12px 8px', textAlign: 'center', color: C.muted, borderBottom: `1px solid ${C.border}`, fontSize: '13px' }}>{g}</th>
                            ))}
                            {Object.keys(similarity).length > 0 && (
                                <th style={{ padding: '12px 8px', textAlign: 'center', color: C.purpleLight, borderBottom: `1px solid ${C.border}` }}>Match %</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(users).map(([name, prefs]) => (
                            <tr key={name} style={{ background: name === selected ? C.purpleBg : 'transparent' }}>
                                <td style={{ padding: '12px 16px', fontWeight: '700', color: name === 'You' ? C.amberLight : '#fff', borderBottom: `1px solid ${C.border}` }}>
                                    {name === 'You' ? '🙋 You' : `👤 ${name}`}
                                </td>
                                {genres.map(g => (
                                    <td key={g} style={{ padding: '12px 8px', textAlign: 'center', borderBottom: `1px solid ${C.border}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2px' }}>
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i < prefs[g] ? C.amber : 'rgba(255,255,255,0.1)' }} />
                                            ))}
                                        </div>
                                    </td>
                                ))}
                                {Object.keys(similarity).length > 0 && (
                                    <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: '800', borderBottom: `1px solid ${C.border}`, color: name === 'You' ? C.muted : (name === selected ? C.greenLight : C.muted) }}>
                                        {name === 'You' ? '—' : `${(similarity[name] * 100).toFixed(0)}%`}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selected && (
                <div style={{ marginTop: '16px', padding: '20px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(16,185,129,0.1))', border: '2px solid rgba(139,92,246,0.4)', textAlign: 'center' }}>
                    <p style={{ fontSize: '28px', margin: '0 0 8px 0' }}>🎯</p>
                    <p style={{ color: '#fff', fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0' }}>
                        Your music twin is <span style={{ color: C.purpleLight }}>{selected}</span>!
                    </p>
                    <p style={{ color: C.muted, fontSize: '14px', margin: 0 }}>
                        Spotify would now recommend songs that {selected} loves but you haven't heard yet. That's <strong>collaborative filtering</strong>!
                    </p>
                </div>
            )}
        </div>
    );
}


// ─── Main Page ──────────────────────────────────────────────────────────────
export default function AdvModule2() {
    return (
        <main className="container">
            <header>
                <div className="logo-text">Algo<span className="logo-highlight">Think</span> <span className="logo-suffix">Adv. Module 2</span></div>
                <Link href="/advanced-dashboard" className="btn btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border)' }}>⬅️ Dashboard</Link>
            </header>

            <div className="panel">
                <h1 style={{ fontSize: '36px', color: C.blueLight, marginBottom: '20px', fontWeight: '900' }}>Algorithms That Power Your World</h1>
                <p style={{ color: C.muted, fontSize: '18px', lineHeight: '1.7', marginBottom: '30px' }}>
                    Every time you search Google, get driving directions, or see a "Recommended for You" playlist — an algorithm is running behind the scenes. Let's peek behind the curtain.
                </p>

                {/* ── Section 1: Google Search / PageRank ──────────────── */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ background: C.cyanBg, padding: '24px', borderRadius: '12px', borderLeft: `4px solid ${C.cyan}`, marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '12px' }}>🔍 How Google Search Works: PageRank</h2>
                        <p style={{ color: C.muted, lineHeight: '1.8', fontSize: '15px' }}>
                            Google doesn't just match keywords — it ranks pages by <strong>authority</strong>. A page is "important" if many other important pages link to it. This is <strong>PageRank</strong>, invented by Google's founders. Watch how link authority flows between pages!
                        </p>
                    </div>
                    <PageRankDemo />
                </div>

                {/* ── Section 2: GPS / Shortest Path ──────────────────── */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ background: C.greenBg, padding: '24px', borderRadius: '12px', borderLeft: `4px solid ${C.green}`, marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '12px' }}>🗺️ How GPS Navigation Works: Dijkstra's Algorithm</h2>
                        <p style={{ color: C.muted, lineHeight: '1.8', fontSize: '15px' }}>
                            When Google Maps gives you the fastest route, it uses a <strong>shortest path algorithm</strong>. The city map is a <strong>graph</strong> — intersections are nodes, roads are edges with travel times. <strong>Dijkstra's algorithm</strong> finds the cheapest path to every destination!
                        </p>
                    </div>
                    <ShortestPathDemo />
                </div>

                {/* ── Section 3: Recommendation Engine ────────────────── */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ background: C.purpleBg, padding: '24px', borderRadius: '12px', borderLeft: `4px solid ${C.purple}`, marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '12px' }}>🎧 How Spotify Recommends Songs: Collaborative Filtering</h2>
                        <p style={{ color: C.muted, lineHeight: '1.8', fontSize: '15px' }}>
                            Spotify compares your listening habits to millions of other users. It finds your <strong>"music twin"</strong> — someone with very similar taste — then recommends songs they love that you haven't heard yet. The math behind this is called <strong>cosine similarity</strong>.
                        </p>
                    </div>
                    <RecommendationDemo />
                </div>

                {/* ── Section 4: Social Media Feed ────────────────────── */}
                <div style={{ marginBottom: '50px', paddingBottom: '40px', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ background: C.amberBg, padding: '24px', borderRadius: '12px', borderLeft: `4px solid ${C.amber}` }}>
                        <h2 style={{ fontSize: '24px', color: '#fff', marginBottom: '12px' }}>📱 How Social Media Feeds Work</h2>
                        <p style={{ color: C.muted, lineHeight: '1.8', fontSize: '15px', marginBottom: '20px' }}>
                            Instagram and TikTok don't show posts chronologically — they use a <strong>ranking algorithm</strong> that scores every post based on:
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                            {[
                                { icon: '❤️', title: 'Engagement', desc: 'Likes, comments, shares, saves — how much people interact', color: C.redLight },
                                { icon: '🕐', title: 'Recency', desc: 'Newer posts get a boost — freshness matters', color: C.blueLight },
                                { icon: '🤝', title: 'Relationship', desc: 'Posts from people you interact with most appear first', color: C.greenLight },
                            ].map((item, i) => (
                                <div key={i} style={{ background: C.surface, padding: '20px', borderRadius: '12px', border: `1px solid ${C.border}` }}>
                                    <div style={{ fontSize: '28px', marginBottom: '10px' }}>{item.icon}</div>
                                    <h4 style={{ color: item.color, fontSize: '15px', marginBottom: '8px' }}>{item.title}</h4>
                                    <p style={{ color: C.muted, fontSize: '13px', lineHeight: '1.5' }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                        <p style={{ color: C.muted, lineHeight: '1.8', fontSize: '15px', marginTop: '16px' }}>
                            Each post gets a <strong>weighted score</strong> = (Engagement × 0.4) + (Recency × 0.3) + (Relationship × 0.3). The feed is sorted by this score — that's why you see viral posts from strangers mixed with your best friend's stories!
                        </p>
                    </div>
                </div>

                {/* ── Takeaway ────────────────────────────────────────── */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(56,189,248,0.15), rgba(139,92,246,0.15))',
                    padding: '30px', borderRadius: '16px', border: '1px solid rgba(56,189,248,0.3)',
                }}>
                    <h2 style={{ fontSize: '24px', color: '#ffffff', marginBottom: '20px', textAlign: 'center' }}>🧠 Key Takeaways</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                        {[
                            { icon: '🔍', title: 'PageRank', desc: 'Links = votes. More quality links = higher rank.', color: C.cyanLight },
                            { icon: '🗺️', title: 'Dijkstra', desc: 'GPS uses graphs to find the shortest path.', color: C.greenLight },
                            { icon: '🎧', title: 'Filtering', desc: 'Find similar users, recommend what they like.', color: C.purpleLight },
                            { icon: '📱', title: 'Feed Ranking', desc: 'Weighted scores decide what you see first.', color: C.amberLight },
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
                    <Link href="/course/adv-module-1" className="btn btn-secondary" style={{ width: 'auto', background: 'rgba(255,255,255,0.05)', color: 'white', padding: '12px 30px', border: '1px solid var(--border)' }}>
                        ⬅️ Previous: Module 1
                    </Link>
                    <Link href="/course/adv-module-3" className="btn btn-primary" style={{ width: 'auto', background: '#3b82f6', padding: '12px 30px' }}>
                        Proceed to Module 3 ➡️
                    </Link>
                </div>
            </div>
        </main>
    );
}
