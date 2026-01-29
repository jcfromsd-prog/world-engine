import React, { useState } from 'react';

interface WelcomeModalProps {
    onInitialize: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onInitialize }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleInitialize = () => {
        setIsVisible(false);
        onInitialize();
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(5, 5, 5, 0.95)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div className="glass" style={{
                maxWidth: '600px',
                width: '90%',
                padding: '40px',
                borderRadius: '32px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 0 50px rgba(0, 255, 202, 0.2)',
                border: '1px solid var(--accent-neon)'
            }}>
                <div style={{
                    width: '150px',
                    height: '150px',
                    margin: '0 auto 24px',
                    borderRadius: '50%',
                    border: '3px solid var(--accent-neon)',
                    boxShadow: '0 0 30px rgba(0, 255, 202, 0.4)',
                    overflow: 'hidden'
                }}>
                    <img
                        src="/guardian_avatar.png"
                        alt="Engine Sage"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                <h2 style={{
                    fontSize: '2rem',
                    marginBottom: '16px',
                    background: 'linear-gradient(135deg, #fff 0%, #aaa 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    Engine Sage
                </h2>

                <p style={{
                    fontSize: '1.2rem',
                    color: '#e0e0e0',
                    lineHeight: 1.6,
                    marginBottom: '40px',
                    fontStyle: 'italic'
                }}>
                    "Hi, let's get started.<br /><br />I'm the Engine Sage.<br />Here, we don't just work, we SOLVE. We don't just earn, we BUILD."
                </p>

                <button
                    onClick={handleInitialize}
                    style={{
                        padding: '16px 40px',
                        fontSize: '1rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        background: 'var(--accent-neon)',
                        color: 'black',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        boxShadow: '0 0 20px rgba(0, 255, 202, 0.4)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 202, 0.6)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 202, 0.4)';
                    }}
                >
                    Let's Get Started
                </button>
            </div>
        </div>
    );
};

export default WelcomeModal;
