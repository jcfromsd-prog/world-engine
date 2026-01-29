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
    const [bounties, setBounties] = useState<any[]>(defaultQuests); // Using any to mix types for now

    // Fetch real bounties
    useEffect(() => {
        getBounties().then(data => {
            if (data && data.length > 0) {
                // Map DB bounties to UI format
                const realBounties = data.map(b => ({
                    id: b.id,
                    title: b.title,
                    reward: b.reward + " Bounty",
                    cause: b.category || "General",
                    time: b.time_estimate || "Unknown",
                    difficulty: b.difficulty
                }));
                // Real bounties first, then fallback
                setBounties([...realBounties, ...defaultQuests]);
            }
        });
    }, []);

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
        // Mock logic: Bounties with 'Hard' difficulty or > $1000 reward (simulated) require NDA
        // In a real app, check quest.security_level
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Global Feed</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Opportunities being solved in real-time.</p>
                    </div>
                    <div className="filters" style={{ display: 'flex', gap: '12px' }}>
                        <select className="glass" style={{ padding: '8px 16px', color: 'white', border: '1px solid var(--glass-border)' }}>
                            <option>All Causes</option>
                            <option>Clean Energy</option>
                            <option>Education</option>
                            <option>Tech</option>
                        </select>
                        <select className="glass" style={{ padding: '8px 16px', color: 'white', border: '1px solid var(--glass-border)' }}>
                            <option>Any Time</option>
                            <option>10 min</option>
                            <option>1 hour</option>
                            <option>10 hours</option>
                        </select>
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
                                    <div className="tooltip" style={{
                                        position: 'absolute',
                                        bottom: '100%',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        marginBottom: '10px',
                                        padding: '8px 12px',
                                        background: 'rgba(0,0,0,0.9)',
                                        border: '1px solid #ff0055',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        color: 'white',
                                        whiteSpace: 'nowrap',
                                        opacity: 0,
                                        pointerEvents: 'none',
                                        transition: 'opacity 0.2s'
                                    }}>
                                        ⚠️ Req: Level 5 Architect
                                    </div>
                                </div>
                                <style>{`
                                    .thunderdome-btn-container:hover .tooltip {
                                        opacity: 1;
                                    }
                                `}</style>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area: Feed + Live Insights */}
                <div style={{ display: 'flex', gap: '32px', flexDirection: 'row', alignItems: 'flex-start' }}>

                    {/* Left: Bounty Feed */}
                    <div style={{ flex: 2 }}>
                        <div className="feed-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                            {bounties.map(quest => (
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
