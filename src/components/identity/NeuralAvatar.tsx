// =============================================================================
// NEURAL AVATAR: Precision Competence Map (T2.1)
// =============================================================================
// NOT a gamified badge wall. NOT a vague pulse.
// This is a verifiable, evidence-backed skill visualization.
//
// Each node = a skill domain with a Circular Progress Ring divided into
// 4 SDI segments (Observe → Model → Infer → Integrate).
//
// Hover/Click reveals:
//   1. Mastery Percentage (e.g., "84% Verified")
//   2. Evidence Links: specific Artifacts of Knowledge that contributed
//
// Heartbeat pulse = real-time data sync indicator (Supabase), NOT decoration.
// =============================================================================

import React, { useState, useMemo } from 'react';
import { Activity, ExternalLink, Shield, AlertTriangle } from 'lucide-react';
import type { SkillCategory, SkillGraph } from '../../engine/types';
import type { VerifiedCompetency } from '../../engines/world-engine/LearnerModel';
import { ARTIFACT_REGISTRY, type KnowledgeArtifact } from '../../data/ArtifactRegistry';

// =============================================================================
// TYPES
// =============================================================================

interface NeuralAvatarProps {
    skillGraph: SkillGraph;
    verifiedCompetencies: VerifiedCompetency[];
    calibrationScore: number;       // 0-100: system confidence in placement
    isSyncing?: boolean;            // True when actively syncing with Supabase
}

interface SDISegment {
    sdi: number;
    label: string;
    verb: string;
    mastery: number;    // 0.0 - 1.0 for this SDI level
    artifacts: KnowledgeArtifact[];
}

interface SkillNodeData {
    category: SkillCategory;
    icon: string;
    label: string;
    level: number;
    overallMastery: number;
    segments: SDISegment[];
    totalArtifacts: number;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SDI_LABELS: Record<number, { label: string; verb: string; color: string }> = {
    0: { label: 'Observe', verb: 'OBSERVE', color: '#22d3ee' },   // cyan
    1: { label: 'Model', verb: 'MODEL', color: '#a78bfa' },   // violet
    2: { label: 'Infer', verb: 'INFER', color: '#f59e0b' },   // amber
    3: { label: 'Integrate', verb: 'INTEGRATE', color: '#10b981' }, // emerald
};

const CATEGORY_META: Record<SkillCategory, { icon: string; label: string; color: string }> = {
    logic: { icon: '🧠', label: 'Logic', color: '#06b6d4' },
    creativity: { icon: '🎨', label: 'Creativity', color: '#d946ef' },
    engineering: { icon: '⚙️', label: 'Engineering', color: '#f59e0b' },
    leadership: { icon: '👑', label: 'Leadership', color: '#ef4444' },
    nature: { icon: '🌿', label: 'Nature', color: '#22c55e' },
    social: { icon: '🤝', label: 'Social', color: '#ec4899' },
};

// Map SkillCategory → SubjectDomain for artifact matching
const CATEGORY_TO_DOMAIN: Record<SkillCategory, string[]> = {
    logic: ['numeracy'],
    creativity: ['literacy'],
    engineering: ['career'],
    leadership: ['career', 'sel'],
    nature: ['science'],
    social: ['social', 'sel'],
};

// =============================================================================
// SDI RING SVG COMPONENT
// =============================================================================

const SDIRing: React.FC<{
    segments: SDISegment[];
    size: number;
    isSelected: boolean;
    color: string;
}> = ({ segments, size, isSelected, color }) => {
    const center = size / 2;
    const radius = (size / 2) - 8;
    const strokeWidth = 6;
    const gap = 4;               // degrees gap between segments
    const totalGap = gap * 4;    // total gap degrees
    const usable = 360 - totalGap;
    const segAngle = usable / 4; // degrees per segment

    const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
        const rad = ((angleDeg - 90) * Math.PI) / 180;
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };

    const describeArc = (startAngle: number, endAngle: number) => {
        const start = polarToCartesian(center, center, radius, endAngle);
        const end = polarToCartesian(center, center, radius, startAngle);
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;
        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
    };

    return (
        <svg width={size} height={size} className="transition-transform duration-300">
            {/* Background track */}
            {segments.map((_, i) => {
                const startAngle = i * (segAngle + gap);
                const endAngle = startAngle + segAngle;
                return (
                    <path
                        key={`bg-${i}`}
                        d={describeArc(startAngle, endAngle)}
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                    />
                );
            })}

            {/* Filled segments */}
            {segments.map((seg, i) => {
                const startAngle = i * (segAngle + gap);
                const filledAngle = startAngle + segAngle * Math.min(seg.mastery, 1);
                if (seg.mastery <= 0) return null;
                return (
                    <path
                        key={`fill-${i}`}
                        d={describeArc(startAngle, filledAngle)}
                        fill="none"
                        stroke={SDI_LABELS[seg.sdi]?.color || color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                        style={{
                            filter: isSelected ? `drop-shadow(0 0 6px ${SDI_LABELS[seg.sdi]?.color || color})` : 'none',
                        }}
                    />
                );
            })}
        </svg>
    );
};

// =============================================================================
// EVIDENCE PANEL (shown on hover/click)
// =============================================================================

const EvidencePanel: React.FC<{
    node: SkillNodeData;
    onClose: () => void;
}> = ({ node, onClose }) => {
    return (
        <div
            className="absolute z-50 w-80 bg-zinc-950/95 backdrop-blur-2xl border border-zinc-700/60 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{ left: '50%', transform: 'translateX(-50%)', top: 'calc(100% + 12px)' }}
        >
            {/* Header */}
            <div className="px-5 pt-5 pb-3 border-b border-zinc-800/60">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{node.icon}</span>
                        <div>
                            <h4 className="text-white font-black text-sm tracking-tight">{node.label}</h4>
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Level {node.level}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-600 hover:text-white transition-colors text-xs font-bold"
                    >✕</button>
                </div>

                {/* Mastery Percentage */}
                <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                                width: `${Math.round(node.overallMastery * 100)}%`,
                                background: `linear-gradient(90deg, ${CATEGORY_META[node.category].color}, ${CATEGORY_META[node.category].color}88)`,
                            }}
                        />
                    </div>
                    <span className="text-white font-black text-sm font-mono">
                        {Math.round(node.overallMastery * 100)}%
                        <span className="text-zinc-500 text-[10px] ml-1 font-normal">Verified</span>
                    </span>
                </div>
            </div>

            {/* SDI Breakdown */}
            <div className="px-5 py-3 border-b border-zinc-800/40">
                <div className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-2">SDI Depth Breakdown</div>
                <div className="grid grid-cols-4 gap-1.5">
                    {node.segments.map((seg) => (
                        <div key={seg.sdi} className="text-center">
                            <div
                                className="h-1.5 rounded-full mb-1 transition-all"
                                style={{
                                    background: seg.mastery > 0
                                        ? SDI_LABELS[seg.sdi]?.color
                                        : 'rgba(255,255,255,0.06)',
                                    opacity: Math.max(0.3, seg.mastery),
                                }}
                            />
                            <div className="text-[8px] font-bold" style={{ color: SDI_LABELS[seg.sdi]?.color }}>
                                {seg.verb}
                            </div>
                            <div className="text-[9px] text-zinc-500 font-mono">
                                {Math.round(seg.mastery * 100)}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Evidence Links (Artifacts) */}
            <div className="px-5 py-3 max-h-48 overflow-y-auto">
                <div className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                    <Shield size={10} className="text-cyan-500" />
                    Artifacts of Knowledge ({node.totalArtifacts})
                </div>
                {node.segments.flatMap(s => s.artifacts).length > 0 ? (
                    <div className="space-y-1.5">
                        {node.segments.flatMap(seg =>
                            seg.artifacts.map(artifact => (
                                <div
                                    key={artifact.id}
                                    className="flex items-start gap-2 p-2 rounded-lg bg-zinc-900/60 border border-zinc-800/40 hover:border-zinc-700 transition-colors group"
                                >
                                    <div
                                        className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                                        style={{ background: SDI_LABELS[seg.sdi]?.color }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[11px] text-white font-bold truncate group-hover:text-cyan-400 transition-colors">
                                            {artifact.title}
                                        </div>
                                        <div className="text-[9px] text-zinc-600 truncate">
                                            {artifact.phenomenon}
                                        </div>
                                    </div>
                                    <ExternalLink size={10} className="text-zinc-700 group-hover:text-cyan-500 mt-1 flex-shrink-0 transition-colors" />
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <div className="text-zinc-700 text-[10px] italic">No artifacts verified yet</div>
                        <div className="text-zinc-800 text-[9px] mt-1">Complete missions to earn evidence</div>
                    </div>
                )}
            </div>
        </div>
    );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const NeuralAvatar: React.FC<NeuralAvatarProps> = ({
    skillGraph,
    verifiedCompetencies,
    calibrationScore,
    isSyncing = false,
}) => {
    const [selectedNode, setSelectedNode] = useState<SkillCategory | null>(null);


    // Build skill node data with SDI mapping
    const skillNodes: SkillNodeData[] = useMemo(() => {
        return Object.entries(skillGraph.skills).map(([cat, skill]) => {
            const category = cat as SkillCategory;
            const meta = CATEGORY_META[category];
            const domains = CATEGORY_TO_DOMAIN[category];

            // Get matching artifacts for this category
            const matchingArtifacts = ARTIFACT_REGISTRY.filter(a =>
                domains.includes(a.domain)
            );

            // Get verified competencies for this domain
            const domainCompetencies = verifiedCompetencies.filter(vc =>
                domains.includes(vc.domain)
            );

            // Build SDI segments
            const segments: SDISegment[] = [0, 1, 2, 3].map(sdi => {
                const sdiArtifacts = matchingArtifacts.filter(a => a.sdi === sdi);
                const sdiCompetencies = domainCompetencies.filter(vc => vc.sdi === sdi);

                // Mastery for this SDI = average of matching verified competencies
                const sdiMastery = sdiCompetencies.length > 0
                    ? sdiCompetencies.reduce((sum, vc) => sum + vc.masteryScore, 0) / sdiCompetencies.length
                    : 0;

                return {
                    sdi,
                    label: SDI_LABELS[sdi].label,
                    verb: SDI_LABELS[sdi].verb,
                    mastery: Math.min(1, sdiMastery),
                    artifacts: sdiArtifacts,
                };
            });

            const totalArtifacts = segments.reduce((sum, s) => sum + s.artifacts.length, 0);

            return {
                category,
                icon: meta.icon,
                label: meta.label,
                level: skill.level,
                overallMastery: skill.mastery,
                segments,
                totalArtifacts,
            };
        });
    }, [skillGraph, verifiedCompetencies]);

    // ─── CALIBRATION GUARD ───
    const isCalibrated = calibrationScore >= 20;

    if (!isCalibrated) {
        return (
            <div className="bg-zinc-950/80 border border-amber-900/40 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                    <AlertTriangle size={28} className="text-amber-500" />
                </div>
                <h3 className="text-amber-400 font-black text-lg tracking-tight mb-2">Calibration Required</h3>
                <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto">
                    Complete your first assessment to initialize the Competence Map.
                    The system needs data before it can render your identity.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                    <Activity size={12} className="text-amber-600" />
                    Calibration: {calibrationScore}% — Insufficient data
                </div>
            </div>
        );
    }

    return (
        <div className="bg-zinc-950/80 border border-zinc-800/60 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-zinc-800/40 flex items-center justify-between">
                <div>
                    <h3 className="text-white font-black text-sm uppercase tracking-widest flex items-center gap-2">
                        <Shield size={14} className="text-cyan-500" />
                        Competence Map
                    </h3>
                    <div className="text-[10px] text-zinc-600 mt-0.5">
                        {verifiedCompetencies.length} verified competenc{verifiedCompetencies.length === 1 ? 'y' : 'ies'} across {Object.keys(skillGraph.skills).length} domains
                    </div>
                </div>

                {/* Sync pulse — heartbeat ONLY when syncing (pure CSS) */}
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isSyncing
                            ? 'bg-cyan-500 animate-pulse shadow-[0_0_8px_#22d3ee]'
                            : 'bg-zinc-700'
                        }`} />
                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                        {isSyncing ? 'Syncing' : 'Idle'}
                    </span>
                </div>
            </div>

            {/* Neural Grid */}
            <div className="p-5">
                <div className="grid grid-cols-3 gap-4">
                    {skillNodes.map((node) => {
                        const isSelected = selectedNode === node.category;
                        const meta = CATEGORY_META[node.category];

                        return (
                            <div
                                key={node.category}
                                className="relative flex flex-col items-center"
                            >
                                {/* Clickable Node */}
                                <button
                                    onClick={() => setSelectedNode(isSelected ? null : node.category)}
                                    className={`relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 rounded-2xl p-3 w-full ${isSelected
                                        ? 'bg-zinc-900/80 border border-zinc-700/60 scale-105'
                                        : 'bg-transparent hover:bg-zinc-900/40 border border-transparent hover:border-zinc-800/40'
                                        }`}
                                >
                                    {/* SDI Ring */}
                                    <div className="relative">
                                        <SDIRing
                                            segments={node.segments}
                                            size={80}
                                            isSelected={isSelected}
                                            color={meta.color}
                                        />
                                        {/* Center icon */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-xl">{node.icon}</span>
                                        </div>
                                    </div>

                                    {/* Label & Mastery */}
                                    <div className="mt-2 text-center">
                                        <div className="text-[11px] text-white font-bold tracking-tight">{node.label}</div>
                                        <div className="text-[10px] font-mono" style={{ color: meta.color }}>
                                            {Math.round(node.overallMastery * 100)}%
                                        </div>
                                    </div>

                                    {/* Artifact count indicator */}
                                    {node.totalArtifacts > 0 && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                                            <span className="text-[8px] text-cyan-400 font-black">{node.totalArtifacts}</span>
                                        </div>
                                    )}
                                </button>

                                {/* Evidence Panel (expanded) */}
                                {isSelected && (
                                    <EvidencePanel
                                        node={node}
                                        onClose={() => setSelectedNode(null)}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SDI Legend */}
            <div className="px-5 pb-4 pt-1 border-t border-zinc-800/30">
                <div className="flex items-center justify-between">
                    {Object.entries(SDI_LABELS).map(([sdi, meta]) => (
                        <div key={sdi} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ background: meta.color }} />
                            <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: meta.color }}>
                                SDI {sdi}: {meta.verb}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NeuralAvatar;
