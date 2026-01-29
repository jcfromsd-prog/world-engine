import React, { useState } from 'react';

interface WalletModalProps {
    balance: string;
    onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ balance, onClose }) => {
    const [withdrawing, setWithdrawing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleWithdraw = () => {
        setWithdrawing(true);
        setTimeout(() => {
            setWithdrawing(false);
            setSuccess(true);
        }, 2000);
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass" style={{ width: '500px', padding: '40px', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>

                <h2 style={{ marginBottom: '32px', textAlign: 'center' }}>My Protocol Wallet</h2>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Available Balance</div>
                    <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--accent-neon)', textShadow: '0 0 20px rgba(0,255,202,0.3)' }}>{balance}</div>
                </div>

                {!success ? (
                    <>
                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ marginBottom: '16px', fontWeight: 600 }}>Select Payout Method</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="glass" style={{ padding: '20px', cursor: 'pointer', borderColor: 'var(--accent-neon)', background: 'rgba(0,255,202,0.05)' }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🏦</div>
                                    <div style={{ fontWeight: 600 }}>Bank Transfer</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>US / UK / EU / IN</div>
                                </div>
                                <div className="glass" style={{ padding: '20px', cursor: 'pointer' }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⛓️</div>
                                    <div style={{ fontWeight: 600 }}>Crypto (USDC)</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Polygon / Solana</div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleWithdraw}
                            disabled={withdrawing}
                            className="btn-primary"
                            style={{ width: '100%', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            {withdrawing ? 'Processing Payout...' : 'Initiate Withdrawal'}
                        </button>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✅</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Funds Sent!</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                            $14,515.00 has been initiated to your Bank Account (ending 4402).
                            <br />ETA: Instant.
                        </p>
                        <button onClick={onClose} className="glass" style={{ padding: '12px 32px' }}>Close Wallet</button>
                    </div>
                )}

                <div style={{ marginTop: '32px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Recent Income</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                        <span>Cleaned Climate Data Set #402</span>
                        <span style={{ color: 'var(--accent-neon)' }}>+$15.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                        <span>Royalty: "Python API Hook" (12 uses)</span>
                        <span style={{ color: 'var(--accent-neon)' }}>+$4.80</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WalletModal;
