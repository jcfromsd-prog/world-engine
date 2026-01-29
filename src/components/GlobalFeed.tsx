import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EVERGREEN_BOUNTIES } from '../data/gameData';
import { useGauntlet } from '../hooks/useGauntlet';
import { getBounties } from '../lib/supabase';
import LiveInsights from './LiveInsights';
import GitHubBounties from './GitHubBounties';
import OneClickNDA from './OneClickNDA';
import BountyCard from './BountyCard';

const defaultQuests = [
    {
        id: 'mock-1',
        title: "Clean this Climate Data Set",
        reward: "$15 + 10 Rep",
        rewardValue: 15,
        cause: "Clean Energy",
        time: "10 mins",
        difficulty: "Easy",
        createdAt: new Date(Date.now() - 1000000).toISOString()
    },
    ...EVERGREEN_BOUNTIES.map((b, i) => ({
        id: `mock-${b.id}`,
        title: b.title,
        reward: b.reward + " Bounty",
        rewardValue: parseInt(b.reward.replace(/[^0-9]/g, '')) || 0,
        cause: b.tags[0],
        time: b.time,
        difficulty: b.difficulty,
        createdAt: new Date(Date.now() - (i * 10000000)).toISOString()
    }))
];

interface GlobalFeedProps {
    onOpenLogin?: () => void;
    searchQuery?: string;
    category?: string;
    difficulty?: 'all' | 'easy' | 'medium' | 'hard';
    sortBy?: 'newest' | 'highest-reward';
}

const GlobalFeed: React.FC<GlobalFeedProps> = ({
    onOpenLogin,
    searchQuery = '',
    category = 'All Causes',
    difficulty = 'all',
    sortBy = 'newest'
}) => {
    const navigate = useNavigate();
    const { participantCount, hasJoined, isLoading, error, user, byteIn, maxParticipants } = useGauntlet();
    const [allBounties, setAllBounties] = useState<any[]>(defaultQuests);
    const [filteredBounties, setFilteredBounties] = useState<any[]>(defaultQuests);

    // Fetch real bounties
    useEffect(() => {
        getBounties().then(data => {
            if (data && data.length > 0) {
                const realBounties = data.map(b => ({
                    id: b.id,
                    title: b.title,
                    reward: b.reward + " Bounty",
                    rewardValue: parseInt(b.reward.replace(/[^0-9]/g, '')) || 0,
                    cause: b.category || "General",
                    time: b.time_estimate || "Unknown",
                    difficulty: b.difficulty,
                    createdAt: b.created_at
                }));
                const merged = [...realBounties, ...defaultQuests];
                setAllBounties(merged);
            }
        });
    }, []);

    // Filter & Sort Logic
    useEffect(() => {
        let result = [...allBounties];

        // 1. Search Query
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(b =>
                b.title.toLowerCase().includes(q) ||
                b.cause.toLowerCase().includes(q)
            );
        }

        // 2. Category Filter
        if (category !== 'All Causes') {
            result = result.filter(b => b.cause === category);
        }

        // 3. Difficulty Filter
        if (difficulty !== 'all') {
            result = result.filter(b => b.difficulty.toLowerCase() === difficulty.toLowerCase());
        }

        // 4. Sorting
        if (sortBy === 'highest-reward') {
            result.sort((a, b) => b.rewardValue - a.rewardValue);
        } else {
            // Newest (Default)
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        setFilteredBounties(result);
    }, [searchQuery, category, difficulty, sortBy, allBounties]);


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
                            </div>
                        ) : (
                            <div className="feed-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                                {filteredBounties.map(quest => (
                                    <BountyCard
                                        key={quest.id}
                                        id={quest.id}
                                        title={quest.title}
                                        reward={quest.reward}
                                        cause={quest.cause}
                                        time={quest.time}
                                        difficulty={quest.difficulty}
                                        squadRoles={quest.squadRoles} // Pass squad roles if they exist
                                        onSolve={() => handleSolve(quest)}
                                    />
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
