import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface TerminalFeedbackProps {
    onComplete: (success: boolean) => void;
}

const TerminalFeedback: React.FC<TerminalFeedbackProps> = ({ onComplete }) => {
    const [lines, setLines] = useState<string[]>(["> Initializing Agent Sandbox..."]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Simulated "Grandma" Execution Steps
    const steps = [
        { text: "> parsed_instructions = load_text(user_input)", delay: 800 },
        { text: "> docker run -d --name sandbox-01 ubuntu:latest", delay: 1500 },
        { text: "> git clone [DETECTED_REPO] .", delay: 2400 },
        { text: "> npm install ...", delay: 3500 },
        { text: "  - installed 420 packages in 1.2s", delay: 4200 },
        { text: "> npm run dev", delay: 5000 },
        { text: "  - Local server active on port 5173", delay: 5800 },
        { text: "> Verifying 'Grandma Test' requirements...", delay: 6500 },
        { text: "> SUCCESS: App is running and responding.", delay: 7200, color: "text-emerald-400" },
    ];

    useEffect(() => {
        let timeouts: ReturnType<typeof setTimeout>[] = [];

        steps.forEach((step, index) => {
            const timeout = setTimeout(() => {
                setLines(prev => [...prev, step.text]);
                if (index === steps.length - 1) {
                    setTimeout(() => onComplete(true), 1000);
                }
            }, step.delay);
            timeouts.push(timeout);
        });

        // Scroll to bottom on new line
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }

        return () => timeouts.forEach(clearTimeout);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines]);

    return (
        <div className="bg-black border border-slate-700 rounded-lg p-4 font-mono text-xs h-48 overflow-y-auto custom-scrollbar shadow-inner" ref={scrollRef}>
            {lines.map((line, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`mb-1 ${line.includes("SUCCESS") ? "text-emerald-400 font-bold" : "text-slate-300"}`}
                >
                    {line}
                </motion.div>
            ))}
            <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-4 bg-cyan-500 ml-1 align-middle"
            />
        </div>
    );
};

export default TerminalFeedback;
