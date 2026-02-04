import React, { useState } from 'react';

interface WalletModalProps {
    balance: string;
    onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ balance, onClose }) => {
    // const [withdrawing, setWithdrawing] = useState(false);
    const [success, setSuccess] = useState(false);

    // const handleWithdraw = () => { ... } removed

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
                            <div style={{ marginBottom: '16px', fontWeight: 600 }}>Configuration</div>
                            <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl">
                                <p className="text-sm text-slate-400 mb-2">
                                    To receive payouts, you must complete the KYC/AML onboarding via our secure form.
                                </p>
                                <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-900/10 p-2 rounded border border-blue-900/30">
                                    ℹ️ Manual Verification Required (24-48h)
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                window.open('https://forms.google.com/placeholder_payout_onboarding', '_blank');
                                setSuccess(true); // Close/Show success state
                            }}
                            className="btn-primary"
                            style={{ width: '100%', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            Connect Bank Account
                        </button>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📝</div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Onboarding Started</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                            Please complete the form in the new tab.
                            <br />Our admin team will verify your details shortly.
                        </p>
                        <button onClick={onClose} className="glass" style={{ padding: '12px 32px' }}>Close Wallet</button>
                    </div>
                )}

                <div style={{ marginTop: '32px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Recent Income</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0', opacity: 0.5 }}>
                        No recent activity.
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WalletModal;
