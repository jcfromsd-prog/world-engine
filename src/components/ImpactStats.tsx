import React from 'react';

interface ImpactStatsProps {
    earnings?: string;
    livesImpacted?: number;
}

const ImpactStats: React.FC<ImpactStatsProps> = ({
    earnings = "$1,250.00",
    livesImpacted = 402
}) => {
    return (
        <div className="flex items-center gap-6 bg-slate-900/50 px-6 py-3 rounded-full border border-slate-800 backdrop-blur-md">
            {/* The Classic "Profit" Line */}
            <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Earnings</span>
                <span className="text-emerald-400 font-mono text-xl font-bold">{earnings}</span>
            </div>

            {/* The Divider */}
            <div className="h-8 w-px bg-slate-700"></div>

            {/* The New "Purpose" Line */}
            <div className="flex flex-col items-start">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Global Impact</span>
                <span className="text-cyan-400 font-mono text-xl font-bold flex items-center gap-2">
                    ♥ {livesImpacted.toLocaleString()} <span className="text-xs font-normal text-slate-500">(Lives)</span>
                </span>
            </div>
        </div>
    );
};

export default ImpactStats;
