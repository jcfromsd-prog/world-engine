import React from 'react';

interface UserProfile {
    cause: string;
    class: string;
    squad: string;
}

interface SoulboundCardProps {
    profile: UserProfile;
    reputation?: string;
    velocity?: string;
}

const SoulboundCard: React.FC<SoulboundCardProps> = ({
    profile,
    reputation = "4,250",
    velocity = "1.4x"
}) => {
    return (
        <div className="soulbound-card">
            <div className="connection-pulse"></div>

            <div className="soulbound-avatar">
                {/* Placeholder avatar or dynamic if available */}
                <div style={{ width: '100%', height: '100%', background: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                    🤖
                </div>
            </div>

            <h3 className="text-center" style={{ color: 'white', fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' }}>
                {profile.class}_42
            </h3>
            <p className="text-center" style={{ color: 'var(--engine-cyan)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                SOLVER MODE ACTIVE
            </p>

            <div className="stat-grid">
                <div>
                    <div className="stat-label">Reputation</div>
                    <div className="stat-value">{reputation}</div>
                </div>
                <div>
                    <div className="stat-label">Velocity</div>
                    <div className="stat-value">{velocity}</div>
                </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                <div className="stat-label" style={{ marginBottom: '4px' }}>Current Squad</div>
                <div style={{ color: 'white', fontWeight: 700 }}>{profile.squad}</div>
            </div>
        </div>
    );
};

export default SoulboundCard;
