import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Zap, TrendingUp, Sparkles } from 'lucide-react';

interface VaultWidgetProps {
    lockedGold: number;
    unlockedAssets: number;
    unlockCriteria?: string;
    genesisPointsRequired?: number;
    genesisPointsCompleted?: number;
    className?: string;
}

/**
 * The Sovereign Vault Widget
 * Implements the "Loss Aversion" psychology from the MASTER_VISION
 * 
 * - Locked Gold: Money waiting to be released (glowing, pulsing = motivating)
 * - Unlocked Assets: Liquid cash available for withdrawal
 */
const VaultWidget: React.FC<VaultWidgetProps> = ({
    lockedGold = 450.00,
    unlockedAssets = 0.00,
    unlockCriteria = "Complete 2 Genesis Points",
    genesisPointsRequired = 2,
    genesisPointsCompleted = 0,
    className = ""
}) => {
    const progressPercent = (genesisPointsCompleted / genesisPointsRequired) * 100;
    const isUnlockable = genesisPointsCompleted >= genesisPointsRequired;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-zinc-900/80 to-zinc-950/90 backdrop-blur-sm ${className}`}
        >
            {/* Ambient Glow for Locked Gold */}
            {lockedGold > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-amber-500/5 animate-pulse-subtle pointer-events-none" />
            )}

            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-amber-600/20 rounded-lg border border-yellow-500/30">
                            <Sparkles size={18} className="text-yellow-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Sovereign Vault</h3>
                            <p className="text-[10px] text-gray-500 font-mono">ASSET MANAGEMENT PROTOCOL</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[9px] text-green-400 font-bold uppercase tracking-widest">Secure</span>
                    </div>
                </div>

                {/* Dual Balance Display */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Locked Gold */}
                    <div className="relative p-4 rounded-xl bg-gradient-to-br from-yellow-900/20 to-amber-900/10 border border-yellow-500/20 group">
                        <div className="flex items-center gap-2 mb-2">
                            <Lock size={14} className="text-yellow-500" />
                            <span className="text-[10px] text-yellow-500/80 font-bold uppercase tracking-widest">Locked Gold</span>
                        </div>
                        <div className="text-2xl font-mono font-black text-yellow-400 group-hover:text-yellow-300 transition-colors">
                            ${lockedGold.toFixed(2)}
                        </div>
                        {/* Pulse Effect */}
                        <motion.div
                            className="absolute inset-0 rounded-xl border-2 border-yellow-500/30 pointer-events-none"
                            animate={{
                                boxShadow: ['0 0 0px rgba(234, 179, 8, 0)', '0 0 20px rgba(234, 179, 8, 0.3)', '0 0 0px rgba(234, 179, 8, 0)']
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>

                    {/* Unlocked Assets */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-900/20 to-emerald-900/10 border border-green-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Unlock size={14} className="text-green-500" />
                            <span className="text-[10px] text-green-500/80 font-bold uppercase tracking-widest">Available</span>
                        </div>
                        <div className="text-2xl font-mono font-black text-green-400">
                            ${unlockedAssets.toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Unlock Progress */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                            <Zap size={12} className="text-purple-400" />
                            Unlock Progress
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                            {genesisPointsCompleted}/{genesisPointsRequired} Genesis Points
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                    </div>

                    {/* Unlock Criteria */}
                    <div className="flex items-center justify-between pt-2">
                        <span className="text-[10px] text-gray-500 italic">
                            {isUnlockable ? "✨ Ready to claim!" : unlockCriteria}
                        </span>
                        {isUnlockable ? (
                            <button className="px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-lg shadow-yellow-500/20">
                                Claim Now
                            </button>
                        ) : (
                            <div className="flex items-center gap-1 text-[10px] text-gray-600">
                                <TrendingUp size={12} />
                                <span>Keep solving</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default VaultWidget;
