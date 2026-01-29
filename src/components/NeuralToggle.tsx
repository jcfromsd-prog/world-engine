import React, { useState, useEffect } from 'react';

const useGuardianLink = () => {
    const [isSageActive, setIsSageActive] = useState(() => {
        const saved = localStorage.getItem('sage_link_status');
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('sage_link_status', JSON.stringify(isSageActive));
        const event = new CustomEvent('sageStatusChange', { detail: isSageActive });
        window.dispatchEvent(event);
    }, [isSageActive]);

    const toggleLink = () => setIsSageActive((prev: boolean) => !prev);

    return { isSageActive, toggleLink };
};

const NeuralToggle: React.FC = () => {
    const { isSageActive, toggleLink } = useGuardianLink();

    const handleToggle = () => {
        const newState = !isSageActive;
        toggleLink();

        if (!newState) {
            // Sage Disengaging
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance("Understood. I will remain in the shadows of the Ledger until summoned.");
            utterance.rate = 1.1;
            utterance.pitch = 1.05;
            const voices = window.speechSynthesis.getVoices();
            const sageVoice = voices.find(v => v.name.includes('Natural')) || voices.find(v => v.name.includes('Google US English')) || voices[0];
            if (sageVoice) utterance.voice = sageVoice;
            window.speechSynthesis.speak(utterance);
        } else {
            // Sage Re-engaging (Optional)
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance("Neural link re-established.");
            utterance.rate = 1.1;
            utterance.pitch = 1.05;
            const voices = window.speechSynthesis.getVoices();
            const sageVoice = voices.find(v => v.name.includes('Natural')) || voices.find(v => v.name.includes('Google US English')) || voices[0];
            if (sageVoice) utterance.voice = sageVoice;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className="neural-link-container">
            <div
                className={`neural-switch ${isSageActive ? 'active' : ''}`}
                onClick={handleToggle}
            >
                <div className="neural-node"></div>
            </div>
            <div className="link-status-label">
                {isSageActive ? 'LINK ACTIVE' : 'SILENT MODE'}
            </div>
        </div>
    );
};

export default NeuralToggle;
