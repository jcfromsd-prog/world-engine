import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EVERGREEN_BOUNTIES } from '../data/gameData';
import { useGauntlet } from '../hooks/useGauntlet';
import { getBounties } from '../lib/supabase';
import LiveInsights from './LiveInsights';
import GitHubBounties from './GitHubBounties';
import OneClickNDA from './OneClickNDA';

const defaultQuests = [
    {
        id: 'mock-1',
        title: "Clean this Climate Data Set",
        reward: "$15 + 10 Rep",
        cause: "Clean Energy",
        time: "10 mins",
        difficulty: "Easy"
    },
    ...EVERGREEN_BOUNTIES.map(b => ({
        id: `mock-${b.id}`,
        title: b.title,
        reward: b.reward + " Bounty",
        cause: b.tags[0],
        time: b.time,
        difficulty: b.difficulty
    }))
];

interface GlobalFeedProps {
    onOpenLogin?: () => void;
}

const GlobalFeed: React.FC<GlobalFeedProps> = ({ onOpenLogin }) => {
    const navigate = useNavigate();
    const { participantCount, hasJoined, isLoading, error, user, byteIn, maxParticipants } = useGauntlet();
    const [allBounties, setAllBounties] = useState<any[]>(defaultQuests);
    const [filteredBounties, setFilteredBounties] = useState<any[]>(defaultQuests);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All Causes');
    const [easyStartMode, setEasyStartMode] = useState(false);

    // Fetch real bounties
    useEffect(() => {
        getBounties().then(data => {
            if (data && data.length > 0) {
                const realBounties = data.map(b => ({
                    id: b.id,
                    title: b.title,
                    reward: b.reward + " Bounty",
                    cause: b.category || "General",
                    time: b.time_estimate || "Unknown",
                    difficulty: b.difficulty
                }));
                const merged = [...realBounties, ...defaultQuests];
                setAllBounties(merged);
            }
        });
    }, []);

    // Filter Logic
    useEffect(() => {
        let result = allBounties;

        // 1. Search Query
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(b =>
                b.title.toLowerCase().includes(q) ||
                b.cause.toLowerCase().includes(q)
            );
        }

        // 2. Category Filter
        if (selectedCategory !== 'All Causes') {
            result = result.filter(b => b.cause === selectedCategory);
        }

        // 3. Easy Start Mode
        if (easyStartMode) {
            result = result.filter(b =>
                b.difficulty === 'Easy' // || b.tags.includes('Beginner')
            );
        }

        setFilteredBounties(result);
    }, [searchQuery, selectedCategory, easyStartMode, allBounties]);


    const handleByteIn = async () => {
        if (!user) {
            if (onOpenLogin) {
                onOpenLogin();
            } else {
                alert('Please log in to join the Gauntlet!');
            }
            return;
        }
        const success = await byteIn();
        if (success) {
            alert('🎉 You have joined the Gauntlet! Good luck, Solver.');
        } else if (error) {
            alert(error);
        }
    };

    const [showNDA, setShowNDA] = useState(false);
    const [selectedBounty, setSelectedBounty] = useState<any>(null);

    const handleSolve = (quest: any) => {
        const isProtected = quest.difficulty === 'Hard' || quest.reward.includes('$5,000') || quest.reward.includes('$1,000');

        if (isProtected) {
            setSelectedBounty(quest);
            setShowNDA(true);
        } else {
            navigate(`/workspace/${quest.id}`);
        }
    };

    return (
        <section className="section-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <OneClickNDA
                isOpen={showNDA}
                onClose={() => setShowNDA(false)}
                onAccept={() => {
                    setShowNDA(false);
                    if (selectedBounty) navigate(`/workspace/${selectedBounty.id}`);
                }}
                bountyTitle={selectedBounty?.title || 'Protected Bounty'}
                securityLevel="critical"
            />

            <div style={{ width: '100%', maxWidth: '1200px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Global Feed</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Opportunities being solved in real-time.</p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <div className="relative group min-w-[300px]">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
                            <input
                                type="text"
                                placeholder="Search bounties (e.g., Python, Climate)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-full py-2 pl-12 pr-4 text-white focus:border-cyan-500 outline-none transition-all"
                            />
                        </div>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-cyan-500"
                        >
                            <option>All Causes</option>
                            <option>Clean Energy</option>
                            <option>Education</option>
                            <option>Tech</option>
                            <option>AI/ML</option>
                            <option>DeFi</option>
                        </select>

                        <button
                            onClick={() => setEasyStartMode(!easyStartMode)}
                            className={`px-4 py-2 rounded-lg font-bold transition-all border ${easyStartMode
                                    ? 'bg-green-500/20 border-green-500 text-green-400'
                                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-green-500/50'
                                }`}
                        >
                            🌱 Easy Start
                        </button>
                    </div>
                </div>

                <div className="thunderdome-banner" style={{ marginBottom: '40px' }}>
                    <div className="glass" style={{ border: '2px solid #ff0055', background: 'linear-gradient(90deg, rgba(255,0,85,0.1) 0%, rgba(0,0,0,0) 100%)', padding: '32px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '200px', background: 'linear-gradient(90deg, transparent, rgba(255,0,85,0.2))', transform: 'skewX(-20deg)' }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <span style={{ background: '#ff0055', color: 'white', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>LIVE EVENT</span>
                                    <span style={{ color: '#ff0055', letterSpacing: '0.1em', fontWeight: 800, fontSize: '0.9rem' }}>THE GAUNTLET</span>
                                </div>
                                <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>The Gauntlet: Zero-Day Defense</h2>
                                <div style={{ display: 'flex', gap: '24px', color: 'var(--text-muted)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>👥 <strong>{participantCount}/{maxParticipants}</strong> Joined</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-neon)' }}>💰 <strong>$5,000</strong> Winner Takes All</span>
                                </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '0.8rem', color: '#ff0055', fontWeight: 800, marginBottom: '4px' }}>STARTS IN</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'monospace' }}>04:59</div>
                                <div style={{ position: 'relative', marginTop: '12px' }} className="thunderdome-btn-container">
                                    <button
                                        className="btn-primary"
                                        style={{
                                            background: hasJoined ? '#22c55e' : '#ff0055',
                                            width: '100%',
                                            opacity: isLoading ? 0.7 : 1,
                                            cursor: isLoading ? 'wait' : 'pointer'
                                        }}
                                        onClick={handleByteIn}
                                        disabled={hasJoined || isLoading || participantCount >= maxParticipants}
                                    >
                                        {isLoading ? 'Joining...' : hasJoined ? '✓ Joined' : participantCount >= maxParticipants ? 'FULL' : 'Byte In'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area: Feed + Live Insights */}
                <div style={{ display: 'flex', gap: '32px', flexDirection: 'row', alignItems: 'flex-start' }}>

                    {/* Left: Bounty Feed */}
                    <div style={{ flex: 2 }}>
                        {filteredBounties.length === 0 ? (
                            <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
                                <span className="text-4xl text-slate-600 block mb-4">🔍</span>
                                <p className="text-slate-400">No bounties found for filters.</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('All Causes');
                                        setEasyStartMode(false);
                                    }}
                                    className="text-cyan-400 mt-2 hover:underline"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="feed-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                                {filteredBounties.map(quest => (
                                    <div key={quest.id} className="glass" style={{ padding: '24px', transition: 'transform 0.3s', cursor: 'pointer' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                            <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: 'rgba(0, 255, 202, 0.1)', color: 'var(--accent-neon)' }}>
                                                {quest.cause}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{quest.time}</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', minHeight: '3rem' }}>{quest.title}</h3>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent-neon)' }}>{quest.reward}</div>
                                            <button
                                                onClick={() => handleSolve(quest)}
                                                className="glass" style={{ padding: '8px 16px', fontSize: '0.8rem', fontWeight: 600 }}
                                            >
                                                {(quest.difficulty === 'Hard' || quest.reward.includes('$5,000')) ? '🛡️ Solve' : 'Solve'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Live Insights + GitHub Bounties Panel */}
                    <div style={{ flex: 1, minWidth: '380px', position: 'sticky', top: '100px' }} className="space-y-6">
                        <LiveInsights maxReadings={5} />
                        <GitHubBounties limit={8} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GlobalFeed;
