/* =============================================================================
   ELEVATION MOMENT: The Static Growth Record (v1.0)
   Strict Prohibition: No confetti, No DOM animations, No empty praise.
   Philosophy: Verifiable growth is its own reward.
   ============================================================================= */

import React, { useEffect, useState } from 'react';
import { onElevationMoment } from '../services/PayoutEngine';
import type { ElevationEvent } from '../services/PayoutEngine';
import { PurposeLedger } from '../services/PurposeLedger';
import type { LedgerEntry } from '../services/PurposeLedger';
import { CheckCircle2, Shield, Calendar, Hash, ArrowUpRight } from 'lucide-react';

export const ElevationMoment: React.FC = () => {
    const [lastElevation, setLastElevation] = useState<ElevationEvent | null>(null);
    const [ledgerEntry, setLedgerEntry] = useState<LedgerEntry | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const unsub = onElevationMoment((event) => {
            setLastElevation(event);
            setIsVisible(true);

            // Fetch the latest ledger entry for this mission
            // In a real app, we'd fetch by ID. Here we'll just look for the most recent.
            const entry = PurposeLedger.getEntries("").find(e => e.mission_id === event.missionId);
            if (entry) setLedgerEntry(entry);
        });

        return unsub;
    }, []);

    if (!isVisible || !lastElevation) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
            <div className="max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
                {/* Header: Identity Verification */}
                <div className="bg-slate-800 p-6 border-b border-slate-700 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-400" />
                            COMPETENCE VERIFIED
                        </h2>
                        <p className="text-sm text-slate-400 font-mono mt-1">
                            ID: {lastElevation.missionId} • {lastElevation.timestamp}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        [CLOSE RECORD]
                    </button>
                </div>

                {/* Body: The Facts of Growth */}
                <div className="p-8 space-y-8">
                    {/* Immutability Hash */}
                    {ledgerEntry && (
                        <div className="bg-black/40 p-4 rounded border border-slate-800 font-mono text-[10px] text-slate-500 break-all">
                            <div className="flex items-center gap-2 mb-2 text-slate-400 uppercase tracking-widest text-[9px]">
                                <Hash className="w-3 h-3" /> Ledger Hash (SHA-256)
                            </div>
                            {ledgerEntry.ledger_hash}
                        </div>
                    )}

                    {/* Competencies Added */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                            Verified Artifacts Added to Portfolio
                        </h3>
                        <div className="grid gap-3">
                            {lastElevation.verifiedCompetencies.map(comp => (
                                <div key={comp.competencyId} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-200">{comp.title}</div>
                                        <div className="text-xs text-slate-500 font-mono">{comp.standardRef}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Impact Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" /> Legend Progress
                            </div>
                            <div className="text-2xl font-bold text-slate-200">
                                {((lastElevation.verifiedCompetencies.length / 100) * 100).toFixed(1)}%
                            </div>
                        </div>
                        <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-800">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Verification Date
                            </div>
                            <div className="text-2xl font-bold text-slate-200">
                                {new Date(lastElevation.timestamp).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* Growth Mindset Footer */}
                    <div className="pt-4 border-t border-slate-800 text-center">
                        <p className="text-sm text-slate-400 leading-relaxed italic">
                            "This record is append-only. Your effort has been permanently inscribed
                            into your learner identity. Move to the next challenge."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
