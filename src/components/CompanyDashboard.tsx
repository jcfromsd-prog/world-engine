import React, { useState } from 'react';
import Card from './ui/Card';

const CompanyDashboard: React.FC = () => {
    const [step, setStep] = useState<'upload' | 'pricing' | 'matching'>('upload');
    const [bounty, setBounty] = useState(50);
    const [fileStats] = useState({ name: 'customer_leads_v2.csv', rows: 14050, issues: 402 });

    const handleUpload = () => {
        // Simulate file scan
        setTimeout(() => setStep('pricing'), 1000);
    };

    const handlePost = () => {
        setStep('matching');
    };

    return (
        <section className="dashboard-container section-container">
            <div className="dashboard-header">
                <div className="badge-demand">DEMAND SIDE</div>
                <h2 className="dashboard-title">Liquidity for Your Backlog</h2>
                <p className="dashboard-subtitle">Upload the messy data. Set your price. Watch it disappear.</p>
                <div className="mt-4 text-xs">
                    <a href="/ip-policy" target="_blank" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                        🔒 Zero-Trust IP Protection Active
                    </a>
                </div>
            </div>

            <div className="dashboard-content">
                {/* Step 1: Upload */}
                {step === 'upload' && (
                    <Card className="upload-zone" onClick={handleUpload}>
                        <div className="upload-icon">📂</div>
                        <h3 className="font-heading" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Drop "Dirty Data" Here</h3>
                        <p className="text-muted">CSV, JSON, Python Scripts, or Logs</p>
                        <button className="btn-primary" style={{ marginTop: '32px', background: 'var(--accent-blue)' }}>Simulate Upload</button>
                    </Card>
                )}

                {/* Step 2: Pricing */}
                {step === 'pricing' && (
                    <Card className="padding-40" style={{ padding: '40px' }}>
                        <div className="pricing-header">
                            <div>
                                <div className="text-muted" style={{ fontSize: '0.9rem' }}>Analyzing File...</div>
                                <div className="font-semibold" style={{ fontSize: '1.2rem' }}>{fileStats.name}</div>
                            </div>
                            <div className="text-right" style={{ textAlign: 'right' }}>
                                <div className="issues-count">{fileStats.issues} Critical Issues</div>
                                <div className="text-muted" style={{ fontSize: '0.9rem' }}>~14k Rows</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                            <label style={{ display: 'block', marginBottom: '16px', fontWeight: 600 }}>Set Your Bounty Price</label>
                            <input
                                type="range"
                                min="10"
                                max="500"
                                value={bounty}
                                onChange={(e) => setBounty(parseInt(e.target.value))}
                                className="bounty-slider"
                            />
                            <div className="flex-between">
                                <div className="bounty-display">${bounty}</div>
                                <div className="text-right text-muted" style={{ fontSize: '0.9rem', textAlign: 'right' }}>
                                    <div>Est. Solve Time: <strong className="text-white">{(6000 / bounty).toFixed(0)} mins</strong></div>
                                    <div>Platform Fee: ${(bounty * 0.15).toFixed(2)}</div>
                                </div>
                            </div>
                        </div>

                        <button onClick={handlePost} className="btn-primary w-full" style={{ background: 'var(--accent-blue)', fontSize: '1.1rem' }}>
                            Post to Global Feed
                        </button>
                    </Card>
                )}

                {/* Step 3: Matching */}
                {step === 'matching' && (
                    <Card className="text-center" style={{ padding: '60px' }}>
                        <div className="matching-icon">
                            <div className="radar-pulse"></div>
                        </div>
                        <h3 className="font-heading" style={{ fontSize: '2rem', marginBottom: '16px' }}>Broadcasting to 10,402 Solvers...</h3>
                        <p className="text-muted" style={{ marginBottom: '32px' }}>Your bounty is live. Average pickup time: 42 seconds.</p>

                        <div className="flex-center" style={{ gap: '16px' }}>
                            <Card className="solver-preview">
                                <div style={{ width: '10px', height: '10px', background: 'var(--accent-neon)', borderRadius: '50%' }}></div>
                                <span>Solver_9901 viewing...</span>
                            </Card>
                            <Card className="solver-preview">
                                <div style={{ width: '10px', height: '10px', background: '#ff0055', borderRadius: '50%' }}></div>
                                <span>Architect_X viewing...</span>
                            </Card>
                        </div>
                    </Card>
                )}

            </div>
        </section>
    );
};

export default CompanyDashboard;
