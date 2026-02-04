import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveGovernanceTicker: React.FC = () => {
    // Simulated live allocations set by James Morris
    const allocations = [
        { area: "SOLVER POOL", percent: 45, trend: "stable", color: "text-emerald-400" },
        { area: "PRODUCT DEV", percent: 15, trend: "up", color: "text-blue-400" },
        { area: "LEGAL DEFENSE", percent: 10, trend: "stable", color: "text-red-400" },
        { area: "MARKETING", percent: 10, trend: "down", color: "text-purple-400" },
        { area: "PLATFORM RESERVE", percent: 20, trend: "stable", color: "text-yellow-400" },
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    // Rotate through allocations
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % allocations.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [allocations.length]);

    return (
        <div className="w-full bg-black border-y border-gray-800 py-2 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* Visual Label */}
                <div className="flex items-center gap-2 z-10 bg-black pr-4">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                        LIVE GOVERNANCE
                    </span>
                </div>

                {/* Ticker Content */}
                <div className="flex-1 relative h-6 overflow-hidden">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={activeIndex}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 flex items-center gap-4"
                        >
                            <span className={`text-sm font-bold font-mono ${allocations[activeIndex].color}`}>
                                {allocations[activeIndex].area}
                            </span>
                            <span className="text-white font-mono font-bold">
                                {allocations[activeIndex].percent}%
                            </span>
                            <span className="text-[10px] text-gray-600 uppercase">
                                ALLOCATION
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="hidden md:flex items-center gap-4 text-[10px] text-gray-600 uppercase tracking-widest">
                    <span>Admin: James Morris</span>
                    <span>Epoch: 42.1</span>
                </div>
            </div>
        </div>
    );
};

export default LiveGovernanceTicker;
