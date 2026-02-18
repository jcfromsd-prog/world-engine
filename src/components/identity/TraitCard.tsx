// =============================================================================
// TRAIT EVIDENCE CARD (T2.2)
// =============================================================================
// NOT a label. NOT a badge. NOT a "You're Resilient! ⭐" sticker.
//
// This component shows the EVIDENCE STRING:
// "Trait: Resilience | Verified by: 14 Failed-then-Succeeded Missions | SDI: 3"
//
// Each trait is backed by a list of specific behavioral observations.
// The learner can point to exactly WHY the trait is growing.
// =============================================================================

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import type { TraitRecord } from '../../engines/world-engine/LearnerModel';

// =============================================================================
// TYPES
// =============================================================================

interface TraitCardProps {
    trait: TraitRecord;
    /** Optionally show SDI level if known */
    sdi?: number;
    /** Compact mode for tight layouts */
    compact?: boolean;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const TRAIT_ICONS: Record<string, string> = {
    resilience: '🔥',
    systems_thinking: '🔗',
    curiosity: '🔭',
    precision: '🎯',
    collaboration: '🤝',
    leadership: '🧭',
    creativity: '💡',
    empathy: '💜',
    persistence: '⛰️',
    adaptability: '🌊',
};

const STRENGTH_LABELS: { threshold: number; label: string; color: string }[] = [
    { threshold: 0.8, label: 'STRONG', color: '#22c55e' },  // green
    { threshold: 0.5, label: 'GROWING', color: '#f59e0b' },  // amber
    { threshold: 0.2, label: 'EMERGING', color: '#06b6d4' },  // cyan
    { threshold: 0, label: 'OBSERVED', color: '#71717a' },  // zinc
];

function getStrengthMeta(strength: number) {
    return STRENGTH_LABELS.find(s => strength >= s.threshold) || STRENGTH_LABELS[STRENGTH_LABELS.length - 1];
}

function formatTimeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const TraitCard: React.FC<TraitCardProps> = ({ trait, sdi, compact = false }) => {
    const [expanded, setExpanded] = useState(false);

    const icon = TRAIT_ICONS[trait.traitId] || '✦';
    const strengthMeta = getStrengthMeta(trait.strength);
    const evidenceCount = trait.evidence.length;

    // Build the Evidence String
    const evidenceSummary = evidenceCount === 1
        ? '1 observed behavior'
        : `${evidenceCount} observed behaviors`;

    if (compact) {
        return (
            <div className="flex items-center gap-3 px-3 py-2.5 bg-zinc-900/50 border border-zinc-800/40 rounded-xl hover:border-zinc-700/60 transition-colors group">
                <span className="text-base flex-shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-xs truncate">{trait.label}</span>
                        <span
                            className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full"
                            style={{ color: strengthMeta.color, background: `${strengthMeta.color}15`, border: `1px solid ${strengthMeta.color}30` }}
                        >
                            {strengthMeta.label}
                        </span>
                    </div>
                    <div className="text-[9px] text-zinc-600 truncate mt-0.5">
                        {evidenceCount} evidence{evidenceCount !== 1 ? 's' : ''} {sdi !== undefined && `· SDI ${sdi}`}
                    </div>
                </div>
                {/* Strength bar */}
                <div className="w-12 h-1.5 bg-zinc-900 rounded-full overflow-hidden flex-shrink-0">
                    <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${trait.strength * 100}%`, background: strengthMeta.color }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-zinc-950/80 border rounded-2xl overflow-hidden transition-all duration-300 ${expanded
                ? 'border-zinc-700/60 shadow-lg'
                : 'border-zinc-800/40 hover:border-zinc-700/40'
            }`}>
            {/* Main Row */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left group"
            >
                {/* Icon */}
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: `${strengthMeta.color}15`, border: `1px solid ${strengthMeta.color}25` }}
                >
                    {icon}
                </div>

                {/* Evidence String */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-black text-sm tracking-tight">
                            Trait: {trait.label}
                        </span>
                        <span className="text-zinc-600 text-xs">|</span>
                        <span className="text-zinc-400 text-xs">
                            Verified by: <span className="text-white font-bold">{evidenceSummary}</span>
                        </span>
                        {sdi !== undefined && (
                            <>
                                <span className="text-zinc-600 text-xs">|</span>
                                <span className="text-zinc-400 text-xs">
                                    SDI: <span className="text-cyan-400 font-bold">{sdi}</span>
                                </span>
                            </>
                        )}
                    </div>

                    {/* Strength Bar */}
                    <div className="flex items-center gap-3 mt-2">
                        <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${trait.strength * 100}%`, background: strengthMeta.color }}
                            />
                        </div>
                        <span
                            className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ color: strengthMeta.color, background: `${strengthMeta.color}12`, border: `1px solid ${strengthMeta.color}30` }}
                        >
                            {strengthMeta.label} — {Math.round(trait.strength * 100)}%
                        </span>
                    </div>
                </div>

                {/* Expand Toggle */}
                <div className="flex-shrink-0 text-zinc-600 group-hover:text-zinc-400 transition-colors">
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </button>

            {/* Expanded Evidence List */}
            {expanded && (
                <div className="border-t border-zinc-800/40 px-5 py-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center gap-1.5 mb-3">
                        <Eye size={12} className="text-cyan-500" />
                        <span className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">
                            Behavioral Evidence Log
                        </span>
                    </div>

                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {trait.evidence.map((ev, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-2.5 p-2.5 bg-zinc-900/50 rounded-lg border border-zinc-800/30"
                            >
                                <div
                                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                    style={{ background: strengthMeta.color }}
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="text-[11px] text-zinc-300 leading-relaxed">{ev}</div>
                                </div>
                                <span className="text-[9px] text-zinc-700 flex-shrink-0 font-mono">
                                    #{i + 1}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Timestamps */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/30">
                        <span className="text-[9px] text-zinc-700">
                            First observed: {formatTimeAgo(trait.firstObserved)}
                        </span>
                        <span className="text-[9px] text-zinc-700">
                            Last reinforced: {formatTimeAgo(trait.lastReinforced)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TraitCard;
