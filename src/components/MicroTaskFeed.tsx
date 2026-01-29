import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Micro-Tasks
const MICRO_TASKS = [
    {
        id: 'mt-1',
        type: 'verify',
        title: 'Verify Deforestation',
        image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=500&auto=format&fit=crop&q=60',
        question: 'Does this satellite image show signs of illegal logging?',
        reward: '$2.00',
        rep: '+5 Rep'
    },
    {
        id: 'mt-2',
        type: 'sentiment',
        title: 'Sentiment Analysis',
        text: 'The new water pump is working great, but the handle is a bit stiff for the elders.',
        question: 'Rate the sentiment of this user feedback:',
        reward: '$0.50',
        rep: '+2 Rep'
    },
    {
        id: 'mt-3',
        type: 'translate',
        title: 'Quick Translation',
        text: 'Clean water is a human right.',
        question: 'Translate this phrase into Spanish:',
        reward: '$1.00',
        rep: '+3 Rep'
    }
];

const MicroTaskFeed: React.FC = () => {
    const [tasks] = useState(MICRO_TASKS);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleSwipe = () => {
        // Simulate completing the task
        setTimeout(() => {
            if (currentIndex < tasks.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                alert("All micro-tasks completed! You earned $3.50");
                // Reset for demo
                setCurrentIndex(0);
            }
        }, 300);
    };

    const currentTask = tasks[currentIndex];

    return (
        <div className="max-w-md mx-auto py-12">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">⚡ Quick Wins</h2>
                <p className="text-slate-400">Complete 5-minute tasks to earn crypto & reputation.</p>
            </div>

            <div className="relative h-[500px] w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentTask.id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1.1, opacity: 0, x: 100 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                    >
                        {/* Task Content */}
                        <div className="flex-1 p-6 flex flex-col items-center justify-center text-center relative">
                            <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/50">
                                {currentTask.reward}
                            </div>

                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-6 text-3xl">
                                {currentTask.type === 'verify' ? '🛰️' : currentTask.type === 'sentiment' ? '🧠' : '🗣️'}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4">{currentTask.title}</h3>

                            {currentTask.image && (
                                <img src={currentTask.image} alt="Task" className="w-full h-48 object-cover rounded-xl mb-4 border border-slate-700" />
                            )}

                            {currentTask.text && (
                                <div className="bg-slate-800 p-4 rounded-xl text-slate-300 italic mb-4 w-full text-sm">
                                    "{currentTask.text}"
                                </div>
                            )}

                            <p className="text-cyan-400 font-bold mb-6">{currentTask.question}</p>
                        </div>

                        {/* Actions */}
                        <div className="p-6 bg-slate-950 border-t border-slate-800 grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleSwipe()}
                                className="py-4 rounded-xl bg-slate-800 text-red-400 font-bold hover:bg-slate-700 transition-colors"
                            >
                                SKIP
                            </button>
                            <button
                                onClick={() => handleSwipe()}
                                className="py-4 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                            >
                                SUBMIT
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="text-center mt-8 text-xs text-slate-500 font-mono">
                {currentIndex + 1} of {tasks.length} Available Tasks
            </div>
        </div>
    );
};

export default MicroTaskFeed;
