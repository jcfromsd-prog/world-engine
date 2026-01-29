import React, { useState } from 'react';

const HireEnginePortal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1); // 1: Selection, 2: Checkout, 3: Processing/Success
    const [logs, setLogs] = useState<string[]>([]);
    const [isSuccess, setIsSuccess] = useState(false);

    const closeModal = () => {
        setIsOpen(false);
        setStep(1);
        setLogs([]);
        setIsSuccess(false);
    };

    const processTransaction = () => {
        setStep(3);
        const sequence = [
            { text: "Initiating Secure Handshake...", delay: 800 },
            { text: "Verifying Liquidity on Ledger...", delay: 1600 },
            { text: "Guardian Governance Audit: PASSED", delay: 2400 },
            { text: "Allocating Private Repository...", delay: 3200 },
            { text: "Minting Soulbound Engine Pass...", delay: 4000 },
            { text: "SUCCESS: Access Granted.", delay: 4800, success: true }
        ];


        sequence.forEach(({ text, delay, success }) => {
            setTimeout(() => {
                setLogs(prev => [...prev, text]);
                if (success) setIsSuccess(true);
            }, delay);
        });
    };

    return (
        <>
            {/* Trigger Button */}
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="nav-pill hire-btn"
            >
                Hire Engine
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed-overlay" style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 3000,
                    background: 'rgba(5, 5, 5, 0.95)',
                    backdropFilter: 'blur(15px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '900px',
                        background: 'rgba(20, 20, 25, 1)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 50px 100px rgba(0,0,0,0.8)',
                        display: 'flex',
                        flexDirection: 'row',
                        minHeight: '500px'
                    }}>

                        {/* LEFT: Security Confidence Panel */}
                        <div style={{
                            width: '35%',
                            background: 'rgba(0, 255, 202, 0.05)',
                            padding: '40px',
                            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '30px'
                        }}>
                            <h3 style={{ color: 'var(--accent-neon)', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                                Secure Onboarding
                            </h3>

                            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                                <div>
                                    <p style={{ color: 'white', fontSize: '0.8rem', fontWeight: 800, marginBottom: '4px' }}>Zero-Trust Sandbox</p>
                                    <p style={{ color: '#888', fontSize: '0.7rem', lineHeight: 1.5 }}>Your production data remains untouched. Solvers work in isolated forks.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.5rem' }}>⚖️</span>
                                <div>
                                    <p style={{ color: 'white', fontSize: '0.8rem', fontWeight: 800, marginBottom: '4px' }}>Instant IP Transfer</p>
                                    <p style={{ color: '#888', fontSize: '0.7rem', lineHeight: 1.5 }}>Ownership of all assets transfers automatically upon payment completion.</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '1.5rem' }}>🤖</span>
                                <div>
                                    <p style={{ color: 'white', fontSize: '0.8rem', fontWeight: 800, marginBottom: '4px' }}>Guardian Verified</p>
                                    <p style={{ color: '#888', fontSize: '0.7rem', lineHeight: 1.5 }}>Automated CI/CD and human QA verify every solution before delivery.</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Transaction Panel */}
                        <div style={{
                            width: '65%',
                            padding: '50px',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <button
                                onClick={closeModal}
                                style={{
                                    position: 'absolute',
                                    top: '24px',
                                    right: '24px',
                                    background: 'none',
                                    border: 'none',
                                    color: '#666',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer'
                                }}
                            >
                                ✕
                            </button>

                            {step === 1 && (
                                <div style={{ animation: 'fadeIn 0.5s' }}>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', textTransform: 'uppercase', letterSpacing: '-0.05em', fontStyle: 'italic', marginBottom: '8px' }}>
                                        Initialize Engine Pass
                                    </h2>
                                    <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '40px', fontStyle: 'italic', fontWeight: 300 }}>
                                        "Clear your backlog without growing your headcount."
                                    </p>

                                    <div style={{
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(0, 255, 202, 0.3)',
                                        padding: '30px',
                                        borderRadius: '16px',
                                        marginBottom: '32px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                            <span style={{ background: 'var(--accent-neon)', color: 'black', fontSize: '0.7rem', fontWeight: 900, padding: '4px 8px', borderRadius: '4px' }}>BEST VALUE</span>
                                            <span style={{ color: 'white', fontFamily: 'monospace', fontSize: '1.8rem', fontWeight: 700 }}>
                                                $499<span style={{ fontSize: '0.8rem', color: '#666' }}>/mo</span>
                                            </span>
                                        </div>
                                        <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.7rem', color: '#ccc', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                                            <li>✓ 0% Transaction Fees</li>
                                            <li>✓ Priority Queue</li>
                                            <li>✓ Private Repo Access</li>
                                            <li>✓ Dedicated Squad Lead</li>
                                        </ul>
                                    </div>

                                    <button
                                        onClick={() => setStep(2)}
                                        style={{
                                            width: '100%',
                                            padding: '16px',
                                            background: 'var(--accent-neon)',
                                            color: 'black',
                                            fontWeight: 900,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.15em',
                                            fontSize: '0.8rem',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        Proceed to Secure Payment
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div style={{ animation: 'fadeIn 0.5s' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white', textTransform: 'uppercase', letterSpacing: '-0.05em', marginBottom: '32px' }}>
                                        Secure Checkout
                                    </h2>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                        <div>
                                            <label style={{ fontSize: '0.65rem', color: '#666', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.1em', marginBottom: '8px', display: 'block' }}>Select Payment Method</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                <button style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', background: 'transparent', color: 'white', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>💳 Credit Card</button>
                                                <button style={{ padding: '12px', border: '1px solid rgba(0, 255, 202, 0.5)', borderRadius: '8px', background: 'rgba(0, 255, 202, 0.1)', color: 'var(--accent-neon)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer' }}>🔗 Wallet / Crypto</button>
                                            </div>
                                        </div>

                                        <div style={{ padding: '20px', background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid #333' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888', marginBottom: '8px' }}>
                                                <span>Engine Pass Subscription</span>
                                                <span>$499.00</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #333' }}>
                                                <span>One-Time Setup</span>
                                                <span style={{ color: '#00ffca' }}>FREE</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontWeight: 800 }}>
                                                <span>TOTAL DUE TODAY</span>
                                                <span style={{ fontFamily: 'monospace' }}>$499.00</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={processTransaction}
                                            style={{
                                                width: '100%',
                                                padding: '16px',
                                                background: 'white',
                                                color: 'black',
                                                fontWeight: 900,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.15em',
                                                fontSize: '0.8rem',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                marginTop: '8px',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = 'var(--accent-neon)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = 'white';
                                            }}
                                        >
                                            Authorize & Initialize
                                        </button>
                                        <p style={{ fontSize: '0.6rem', textAlign: 'center', color: '#666', textTransform: 'uppercase', marginTop: '16px' }}>
                                            By clicking authorize, you agree to the Network State Constitution and IP Governance protocols.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div style={{ animation: 'fadeIn 0.5s', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    {!isSuccess ? (
                                        <div style={{ fontFamily: 'monospace', color: 'var(--accent-neon)', fontSize: '0.9rem' }}>
                                            <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '24px', color: '#666' }}>
                                                GUARDIAN LEDGER LINK <span className="animate-pulse">●</span>
                                            </h3>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {logs.map((log, index) => (
                                                    <div key={index} style={{ opacity: 0, animation: 'fadeIn 0.3s forwards' }}>
                                                        <span style={{ color: '#666', marginRight: '8px' }}>{`>`}</span> {log}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center', animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                                            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🚀</div>
                                            <h2 style={{ fontSize: '2.5rem', width: '100%', fontWeight: 900, color: 'white', textTransform: 'uppercase', letterSpacing: '-0.05em', fontStyle: 'italic', marginBottom: '16px' }}>
                                                Welcome to the Future.
                                            </h2>
                                            <p style={{ color: '#888', marginBottom: '32px' }}>Your dedicated Squad will be assigned shortly.</p>
                                            <button
                                                onClick={closeModal}
                                                style={{
                                                    padding: '16px 48px',
                                                    background: 'var(--accent-neon)',
                                                    color: 'black',
                                                    fontWeight: 900,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.15em',
                                                    border: 'none',
                                                    borderRadius: '50px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Enter Workspace
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </>
    );
};

export default HireEnginePortal;
