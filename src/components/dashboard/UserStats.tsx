import React from "react";

interface UserStatsProps {
    totalReviewed: number;
    totalPoints: number;
    streakDays: number;
}

export const UserStats: React.FC<UserStatsProps> = ({
    totalReviewed,
    totalPoints,
    streakDays,
}) => (
    <div className="bg-zinc-900/60 border border-blue-500/30 rounded-xl p-5 backdrop-blur-sm">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            📊 Learning Analytics
        </h3>
        <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{totalReviewed}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Cards</div>
            </div>
            <div className="text-center border-x border-zinc-700">
                <div className="text-2xl font-bold text-green-400">{totalPoints}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Points</div>
            </div>
            <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{streakDays}🔥</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Streak</div>
            </div>
        </div>
    </div>
);
