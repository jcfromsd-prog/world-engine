import React, { useState } from 'react';
import { Sparkles, ArrowRight, Target, Brain, Wallet } from 'lucide-react';

interface TaskSuggestion {
    id: number;
    title: string;
    type: string;
    xp: number;
    payout: number;
    time: string;
    tags: string[];
}

interface MorningAlignmentProps {
    userName?: string;
    userGoal?: string;
    userLevel?: number;
}

const MorningAlignment: React.FC<MorningAlignmentProps> = ({
    userName = "James",
    userGoal = "Master Python & AI Agents",
    userLevel = 4
}) => {
    // Mock "Sage" suggestions (in real app, this comes from your API/Supabase)
    const [tasks] = useState<TaskSuggestion[]>([
        {
            id: 1,
            title: "Optimize Python Scraper Script",
            type: "Micro-Bounty",
            xp: 150,
            payout: 45.00,
            time: "25 min",
            tags: ["Code", "Python"]
        },
        {
            id: 2,
            title: "Review AI Agent Logic Flow",
            type: "Peer Review",
            xp: 75,
            payout: 12.50,
            time: "10 min",
            tags: ["Logic", "AI"]
        }
    ]);

    return (
        <div className="w-full max-w-4xl mx-auto mb-8">
            {/* Sage's Container - Glassmorphism Effect */}
            <div className="relative overflow-hidden rounded-2xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-md shadow-2xl">

                {/* Decorative Nebula Glow (Background) */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-600/20 rounded-full blur-3xl pointer-events-none"></div>

                {/* Content Wrapper */}
                <div className="relative p-6 md:p-8">

                    {/* Header: The Sage Greeting */}
                    <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">
                                Morning, {userName}.
                            </h2>
                            <p className="text-slate-300 mt-1 max-w-xl leading-relaxed">
                                You said you wanted to <span className="text-teal-400 font-semibold">{userGoal}</span>.
                                I've located <span className="text-white font-bold">{tasks.length} opportunities</span> that align with that mission today.
                            </p>
                        </div>
                    </div>

                    {/* Action Grid: The "Just-in-Time" Tasks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="group relative bg-slate-800/40 hover:bg-slate-800/60 border border-slate-700/50 hover:border-teal-500/50 rounded-xl p-4 transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-mono text-teal-400 bg-teal-900/30 px-2 py-1 rounded border border-teal-800/50">
                                        {task.type}
                                    </span>
                                    <span className="flex items-center text-xs text-slate-400">
                                        <Target className="w-3 h-3 mr-1" /> {task.time}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-white group-hover:text-teal-300 transition-colors mb-3">
                                    {task.title}
                                </h3>

                                <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-700/50">
                                    <div className="flex gap-4">
                                        <div className="flex items-center text-indigo-300 text-sm font-medium">
                                            <Sparkles className="w-4 h-4 mr-1.5" />
                                            +{task.xp} XP
                                        </div>
                                        <div className="flex items-center text-emerald-300 text-sm font-medium">
                                            <Wallet className="w-4 h-4 mr-1.5" />
                                            ${task.payout.toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-700 group-hover:bg-teal-600 flex items-center justify-center transition-all">
                                        <ArrowRight className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer: The Growth Motivation */}
                    <div className="mt-6 flex items-center justify-between text-sm text-slate-500 border-t border-slate-700/30 pt-4">
                        <span>Current Rank: <span className="text-slate-300">Level {userLevel} Architect</span></span>
                        <button className="text-indigo-400 hover:text-indigo-300 transition-colors">
                            Tell Sage my goals have changed &rarr;
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MorningAlignment;
