import React, { useState, useEffect, useRef } from 'react';

interface Message {
    sender: 'sage' | 'user';
    text: string;
}

interface UserProfile {
    cause: string;
    class: string; // 'Operator', 'Architect', 'Tycoon'
    squad: string;
}

interface SageDiscoveryModalProps {
    onComplete: (profile: UserProfile) => void;
    onClose: () => void;
    onConnectWallet: () => void;
}

const SageDiscoveryModal: React.FC<SageDiscoveryModalProps> = ({ onComplete, onClose, onConnectWallet }) => {
    const [step, setStep] = useState(0);
    // 0: Intro, 1: Value Alignment, 2: Tactical Assessment, 3: Matching, 4: Complete

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [profile, setProfile] = useState<UserProfile>({ cause: '', class: '', squad: '' });
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Sage speaks and adds message
    const sageSpeak = (text: string, delay = 500) => {
        setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'sage', text }]);

            // Text-to-Speech logic
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.1;
            utterance.pitch = 1.05;
            const voices = window.speechSynthesis.getVoices();
            const sageVoice = voices.find(v => v.name.includes('Natural')) || voices.find(v => v.name.includes('Google US English')) || voices[0];
            if (sageVoice) utterance.voice = sageVoice;
            window.speechSynthesis.speak(utterance);

        }, delay);
    };

    // Initial Greeting
    useEffect(() => {
        sageSpeak("Greeting, Solver. Before we ignite the engine, tell me—if you could fix one global leak today, would it be in our Energy Grids, our Oceans, or our Education Systems?");
    }, []);

    const handleSend = () => {
        if (!input.trim()) return;

        // Add user message
        const userText = input;
        setMessages(prev => [...prev, { sender: 'user', text: userText }]);
        setInput('');

        // Process logic based on step
        setTimeout(() => {
            processResponse(userText);
        }, 1000);
    };

    const processResponse = (response: string) => {
        const lower = response.toLowerCase();

        if (step === 0) {
            // Value Alignment
            let cause = "Global Optimization";
            if (lower.includes("energy")) cause = "Clean Energy";
            if (lower.includes("ocean") || lower.includes("water")) cause = "Blue Economy";
            if (lower.includes("education") || lower.includes("school")) cause = "Future Education";

            setProfile(prev => ({ ...prev, cause }));
            setStep(1);
            sageSpeak(`Understood. ${cause} is a noble cause. Now, what is your primary 'weapon' for this mission? Do you speak the language of Code, the vision of Design, or the logic of Strategy?`);
        } else if (step === 1) {
            // Tactical Assessment
            let cls = "Operator";
            let squad = "Generalist Squad";

            if (lower.includes("code") || lower.includes("python") || lower.includes("dev")) {
                cls = "Architect";
                squad = "Velocity Architects";
            }
            if (lower.includes("design") || lower.includes("art")) {
                cls = "Visionary";
                squad = "Pixel Forge";
            }
            if (lower.includes("strategy") || lower.includes("logic")) {
                cls = "Tycoon";
                squad = "Apex Strategy";
            }

            setProfile(prev => ({ ...prev, class: cls, squad }));
            setStep(2);
            sageSpeak(`Analyzing... I've found a match. The ${squad} is at 9.8x Velocity. To join them and finalize your Soulbound signature, you must anchor your wallet now.`);
        }
    };

    const handleConnect = () => {
        onComplete(profile);
        onConnectWallet();
    };

    return (
        <div className="fixed-overlay" style={{
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
            background: 'rgba(5, 5, 5, 0.95)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="glass" style={{
                width: '100%',
                maxWidth: '600px',
                height: '80vh',
                borderRadius: '24px',
                border: '1px solid var(--accent-neon)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 0 50px rgba(0, 255, 202, 0.2)'
            }}>
                {/* Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--accent-neon)' }}>
                            <img src="/guardian_avatar.png" alt="Sage" style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div>
                            <div style={{ color: 'white', fontWeight: 900, fontSize: '0.9rem' }}>ENGINE SAGE</div>
                            <div style={{ color: 'var(--accent-neon)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Discovery Protocol Active</div>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
                </div>

                {/* Chat Area */}
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                            background: msg.sender === 'user' ? 'rgba(0, 255, 202, 0.1)' : 'rgba(255,255,255,0.05)',
                            border: msg.sender === 'user' ? '1px solid rgba(0, 255, 202, 0.3)' : '1px solid rgba(255,255,255,0.1)',
                            padding: '16px',
                            borderRadius: '16px',
                            borderBottomRightRadius: msg.sender === 'user' ? '0' : '16px',
                            borderBottomLeftRadius: msg.sender === 'sage' ? '0' : '16px',
                            color: 'white',
                            lineHeight: 1.5,
                            fontSize: '0.9rem'
                        }}>
                            {msg.text}
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {step === 2 ? (
                        <button onClick={handleConnect} style={{
                            width: '100%',
                            padding: '16px 32px',
                            background: 'var(--accent-neon)',
                            color: 'black',
                            border: 'none',
                            borderRadius: '50px',
                            fontWeight: 900,
                            letterSpacing: '0.1em',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            boxShadow: '0 0 20px var(--accent-neon)'
                        }}>
                            CONNECT WALLET TO LEDGER
                        </button>
                    ) : (
                        <>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Speak your answer..."
                                style={{
                                    flex: 1,
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    padding: '12px 20px',
                                    borderRadius: '50px',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                            <button
                                onClick={handleSend}
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: 'var(--accent-neon)',
                                    border: 'none',
                                    color: 'black',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem'
                                }}
                            >
                                ➤
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SageDiscoveryModal;
