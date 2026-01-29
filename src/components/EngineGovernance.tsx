import React, { useState } from 'react';

// Common SVG Icons or similar if needed, or emoji.
// Using project standard styles (Glassmorphism + Neon).

interface EngineGovernanceProps {
    isGuardianActive: boolean;
    onInitialize: () => void;
}

const EngineGovernance: React.FC<EngineGovernanceProps> = ({ isGuardianActive, onInitialize }) => {
    const [activeTab, setActiveTab] = useState<string | null>(null);

    // Business Onboarding & Payout Data
    const governanceData = {
        constitution: {
            title: "Network State Constitution",
            content: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <p style={{ color: 'var(--accent-neon)', fontWeight: 'bold', fontStyle: 'italic' }}>
                        "Survival, growth, and innovation are our highest priorities."
                    </p>
                    <div className="glass" style={{ padding: '16px', borderRadius: '8px', border: '1px solid #333', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        <h4 style={{ color: 'white', marginBottom: '8px', textDecoration: 'underline' }}>Economic Manifesto (Per $1.00)</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', color: '#ccc' }}>
                            <span>The Solver:</span> <span style={{ color: '#00ffca', textAlign: 'right' }}>$0.60</span>
                            <span>Team Leader:</span> <span style={{ color: 'white', textAlign: 'right' }}>$0.10</span>
                            <span>Squad Treasury:</span> <span style={{ color: 'white', textAlign: 'right' }}>$0.05</span>
                            <span>MyBestPurpose R&D:</span> <span style={{ color: 'white', textAlign: 'right' }}>$0.15</span>
                            <span>Founder Profit:</span> <span style={{ color: 'white', textAlign: 'right' }}>$0.10</span>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#666', fontStyle: 'italic' }}>
                        *All splits subject to change to prioritize platform life and growth.
                    </p>
                </div>
            )
        },
        ip: {
            title: "IP Governance & Business Safety",
            content: (
                <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px', color: '#e0e0e0' }}>
                    <p>
                        <strong>Safe for Business:</strong> We operate a <span style={{ color: 'var(--accent-neon)' }}>Zero-Trust Sandboxed Model</span>. Solvers never touch live production data.
                    </p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: '#aaa', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <li><strong>Automated CI/CD:</strong> Every line of code is verified before transfer.</li>
                        <li><strong>IP Transfer:</strong> Ownership moves to the business automatically upon 100% payment.</li>
                        <li><strong>Asset Ladder:</strong> Solvers can license tools for passive royalties.</li>
                    </ul>
                </div>
            )
        },
        privacy: {
            title: "Privacy (Zero-Trust Security)",
            content: (
                <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px', color: '#e0e0e0' }}>
                    <p>
                        <strong>Your Identity is Soulbound:</strong> Your reputation is immutable and non-forkable on the ledger.
                    </p>
                    <p style={{ color: '#aaa' }}>
                        Work is performed in isolated environments. Unauthorized data extraction is prevented by the Engine Guardian.
                    </p>
                </div>
            )
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>

            {/* 1. ENGINE GUARDIAN INITIALIZATION SECTION */}
            <div className="glass" style={{
                marginBottom: '48px',
                padding: '32px',
                borderRadius: '16px',
                border: '1px solid rgba(0, 255, 202, 0.3)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 900, color: '#888' }}>
                        Guardian Protocol
                    </h3>
                    <span style={{
                        fontSize: '0.7rem',
                        fontFamily: 'monospace',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: isGuardianActive ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                        color: isGuardianActive ? '#00ffca' : '#ff4d4d',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }} className={!isGuardianActive ? 'pulse-slow' : ''}>
                        ● {isGuardianActive ? 'ACTIVE' : 'STANDBY'}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* LEFT COLUMN: Avatar & Intro */}
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                        <div style={{ flexShrink: 0 }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: `2px solid ${isGuardianActive ? 'var(--accent-neon)' : '#333'}`,
                                boxShadow: isGuardianActive ? '0 0 30px rgba(0, 255, 202, 0.3)' : 'none',
                                transition: 'all 0.5s ease',
                                background: '#000'
                            }}>
                                <img
                                    src="/guardian_avatar.png"
                                    alt="Engine Guardian"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        filter: isGuardianActive ? 'none' : 'grayscale(100%) brightness(0.3) blur(2px)',
                                        transition: 'all 0.5s ease'
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div style={{ marginBottom: '16px' }}>
                                {isGuardianActive ? (
                                    <div className="flex flex-col space-y-2">
                                        <p className="text-gray-400 text-base leading-relaxed">
                                            We don't just Work, we <span className="italic font-bold text-white">SOLVE</span>.
                                            <br />
                                            We don't just Build, we <span className="italic font-bold text-white">EARN</span>.
                                        </p>
                                    </div>
                                ) : (
                                    <p style={{
                                        color: '#e0e0e0',
                                        fontSize: '1rem',
                                        fontWeight: 300,
                                        lineHeight: 1.6,
                                        fontStyle: 'italic'
                                    }}>
                                        System dormant. Initialize to decrypt.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Active Insights Widget */}
                    {isGuardianActive && (
                        <div className="bg-slate-900/50 rounded-xl border border-white/10 p-4 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-4xl">📊</span>
                            </div>

                            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                Live Insights
                            </h4>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Squad Status</span>
                                    <span className="text-white font-mono">1 Idle / 4 Active</span>
                                </div>
                                <div className="h-px bg-white/5" />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Gauntlet</span>
                                    <span className="text-yellow-400 font-mono font-bold animate-pulse">04:20 Remaining</span>
                                </div>
                                <div className="h-px bg-white/5" />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Est. Daily Yield</span>
                                    <span className="text-emerald-400 font-mono font-bold">$1,240.00</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
                                <button className="flex-1 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded transition">
                                    VIEW REPORT
                                </button>
                                <button className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs font-bold rounded transition">
                                    MANAGE SQUAD
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {!isGuardianActive && (
                    <div style={{ position: 'relative', display: 'inline-block', overflow: 'hidden' }} className="guardian-btn-wrapper">
                        <button
                            onClick={onInitialize}
                            style={{
                                padding: '16px 32px',
                                background: 'var(--accent-neon)',
                                color: 'black',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontSize: '0.8rem',
                                border: 'none',
                                cursor: 'pointer',
                                position: 'relative',
                                zIndex: 10
                            }}
                        >
                            Initialize Guardian
                        </button>
                    </div>
                )}
            </div>

            {/* 2. GOVERNANCE FOOTER LINKS */}
            <footer style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px',
                padding: '48px 0',
                borderTop: '1px solid rgba(255,255,255,0.1)',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '32px',
                    fontSize: '0.7rem',
                    letterSpacing: '0.2em',
                    color: '#666',
                    textTransform: 'uppercase',
                    fontWeight: 800
                }}>
                    <button onClick={() => setActiveTab('ip')} className="footer-hover">IP Governance</button>
                    <span>|</span>
                    <button onClick={() => setActiveTab('constitution')} className="footer-hover">Network State Constitution</button>
                    <span>|</span>
                    <button onClick={() => setActiveTab('privacy')} className="footer-hover">Privacy</button>
                </div>

                {/* FINAL BRANDING */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: 0.5
                }}>
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] text-cyan-500 uppercase">
                        Built by <span className="text-white bg-slate-800 px-2 py-0.5 rounded">Antigravity</span>
                    </div>
                    <div className="text-[9px] text-slate-600 font-mono tracking-widest">
                        EST. 2026 // MIT LICENSED // WORLD ENGINE CORE v1.0.42
                    </div>
                </div>
            </footer>

            <style>{`
                .footer-hover {
                    background: none;
                    border: none;
                    color: #666;
                    cursor: pointer;
                    transition: color 0.3s;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    font-weight: 800;
                    font-size: 0.7rem;
                }
                .footer-hover:hover {
                    color: var(--accent-neon);
                    text-decoration: underline;
                    text-underline-offset: 4px;
                }
                .pulse-slow {
                    animation: pulseOp 2s infinite;
                }
                @keyframes pulseOp {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }
            `}</style>

            {/* 3. MODAL OVERLAY */}
            {activeTab && (
                <div className="fixed-overlay" style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 2500,
                    background: 'rgba(5, 5, 5, 0.95)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div className="glass" style={{
                        background: 'rgba(20, 20, 22, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        padding: '40px',
                        borderRadius: '24px',
                        width: '100%',
                        maxWidth: '600px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        position: 'relative'
                    }}>
                        {!isGuardianActive ? (
                            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ fontSize: '3rem' }}>🔒</div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ff4d4d', textTransform: 'uppercase', letterSpacing: '-0.05em' }}>Access Denied</h2>
                                <p style={{ color: '#888', fontStyle: 'italic', fontSize: '0.9rem' }}>Initialize the Engine Guardian above to decrypt this protocol.</p>
                                <button
                                    onClick={() => setActiveTab(null)}
                                    style={{ marginTop: '24px', background: 'none', border: 'none', color: '#666', fontSize: '0.8rem', textTransform: 'uppercase', cursor: 'pointer' }}
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', textTransform: 'uppercase', letterSpacing: '-0.05em', fontStyle: 'italic' }}>
                                        {governanceData[activeTab as keyof typeof governanceData].title}
                                    </h2>
                                    <button
                                        onClick={() => setActiveTab(null)}
                                        style={{ background: 'none', border: 'none', color: '#666', fontSize: '1.5rem', cursor: 'pointer' }}
                                    >
                                        ✕
                                    </button>
                                </div>
                                {governanceData[activeTab as keyof typeof governanceData].content}
                                <button
                                    onClick={() => setActiveTab(null)}
                                    style={{
                                        marginTop: '40px',
                                        width: '100%',
                                        padding: '16px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.1em',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = 'white';
                                        e.currentTarget.style.color = 'black';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                >
                                    Acknowledge Protocol
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EngineGovernance;
