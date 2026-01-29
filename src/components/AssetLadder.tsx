import React from 'react';
import { useEngine } from '../lib/engine';

const tiers = [
    {
        title: "1. The Operator",
        subtitle: "High-Margin Active Income",
        description: "Use tools like Gemini to solve bounties 10x faster. Arbitrage your compute to earn $100+ per hour.",
        icon: "⚡"
    },
    {
        title: "2. The Architect",
        subtitle: "Asset Royalties (Passive)",
        description: "Don't just solve problems. Sell the solution. License your scripts to other solvers for a cut of their bounties.",
        icon: "🧠"
    },
    {
        title: "3. The Tycoon",
        subtitle: "Squad Ownership",
        description: "Build a Flash Agency. Your Squad solves problems while you manage the treasury and optimization logic.",
        icon: "🏰"
    }
];

const AssetLadder: React.FC = () => {
    const { ownedAssets, buyAsset } = useEngine();

    const isOwned = (id: string) => ownedAssets.includes(id);

    return (
        <section className="section-container" style={{ background: 'rgba(255,255,255,0.02)', padding: '100px 24px' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h2 style={{ fontSize: '3rem', marginBottom: '16px' }}>The Asset Ladder</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>From gig worker to engine owner.</p>
            </div>

            <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '80px' }}>
                {tiers.map((tier, index) => (
                    <div key={index} className="glass" style={{ flex: 1, minWidth: '300px', maxWidth: '380px', padding: '48px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '24px' }}>{tier.icon}</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{tier.title}</h3>
                        <div style={{ background: 'var(--impact-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '24px' }}>
                            {tier.subtitle}
                        </div>
                        <p style={{ color: 'var(--text-muted)' }}>{tier.description}</p>
                    </div>
                ))}
            </div>

            {/* Steam Workshop-style Market */}
            <div style={{ maxWidth: '1000px', margin: '0 auto', borderTop: '1px solid var(--glass-border)', paddingTop: '60px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '2rem' }}>Asset Workshop</h3>
                    <button className="glass" style={{ padding: '12px 24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>🔍</span> Browse All Assets
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '24px', cursor: 'pointer' }}>
                        <div style={{ width: '80px', height: '80px', background: '#222', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🐍</div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '4px' }}>Python Data Scraper v4</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>by Architect_X</div>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem' }}>
                                <span style={{ color: 'var(--accent-neon)' }}>★ 4.9 Stars</span>
                                <span>2.4k Subscribers</span>
                            </div>
                        </div>
                        <button
                            className={isOwned('scraper-v4') ? "btn-base border border-emerald-500 text-emerald-400" : "btn-primary"}
                            style={{ marginLeft: 'auto', fontSize: '0.8rem', padding: '8px 16px' }}
                            onClick={() => !isOwned('scraper-v4') && buyAsset('scraper-v4')}
                        >
                            {isOwned('scraper-v4') ? "⬇ Download" : "Subscribe"}
                        </button>
                    </div>

                    <div className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '24px', cursor: 'pointer' }}>
                        <div style={{ width: '80px', height: '80px', background: '#222', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🎨</div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '4px' }}>Figma-to-React Converter</div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>by DesignGod</div>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem' }}>
                                <span style={{ color: 'var(--accent-neon)' }}>★ 5.0 Stars</span>
                                <span>890 Subscribers</span>
                            </div>
                        </div>
                        <button
                            className={isOwned('figma-react') ? "btn-base border border-emerald-500 text-emerald-400" : "btn-primary"}
                            style={{ marginLeft: 'auto', fontSize: '0.8rem', padding: '8px 16px' }}
                            onClick={() => !isOwned('figma-react') && buyAsset('figma-react')}
                        >
                            {isOwned('figma-react') ? "⬇ Download" : "Subscribe"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AssetLadder;
