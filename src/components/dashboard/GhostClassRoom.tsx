/* ==========================================================================
   GHOST CLASSROOM VISUALIZER
   The "Swarm" of agents that live at the bottom of the screen.
   Connected to the AuditEngine (The "Brain").
   ========================================================================== */
import React, { useState, useEffect } from 'react';
import { auditEngine, AUDIT_PROFILES } from '../../services/AuditEngine';
import type { AuditResult } from '../../services/AuditEngine';

interface AgentStatus {
    id: string;
    status: 'IDLE' | 'ACTIVE' | 'ERROR';
    lastMessage: string;
}

export const GhostClassRoom: React.FC = () => {
    const [agents, setAgents] = useState<Record<string, AgentStatus>>({
        MAYA: { id: 'MAYA', status: 'IDLE', lastMessage: 'Standing By' },
        LEO: { id: 'LEO', status: 'IDLE', lastMessage: 'Standing By' },
        ALEX: { id: 'ALEX', status: 'IDLE', lastMessage: 'Standing By' }
    });

    // 🎧 LISTEN TO THE BRAIN
    useEffect(() => {
        const unsubscribe = auditEngine.subscribe((results: AuditResult[]) => {

            // USE FUNCTIONAL UPDATE TO AVOID STALE STATE
            setAgents(currentAgents => {
                const nextAgents = { ...currentAgents };

                results.forEach(res => {
                    const id = res.profile;
                    if (!nextAgents[id]) return;

                    if (res.status === 'FAIL') {
                        nextAgents[id] = {
                            ...nextAgents[id],
                            status: 'ERROR',
                            lastMessage: `⚠️ ${res.category} FAIL: ${res.message}`
                        };
                    } else if (res.status === 'PASS' && nextAgents[id].status !== 'ERROR') {
                        // Only show PASS if not already in ERROR state for this batch
                        nextAgents[id] = {
                            ...nextAgents[id],
                            status: 'ACTIVE',
                            lastMessage: `✅ ${res.category} VERIFIED`
                        };
                    }
                });
                return nextAgents;
            });

            // Auto-reset to IDLE after 5 seconds of peace
            setTimeout(() => {
                setAgents(prev => {
                    const reset = { ...prev };
                    Object.keys(reset).forEach(k => {
                        if (reset[k].status === 'ACTIVE') {
                            reset[k] = { ...reset[k], status: 'IDLE', lastMessage: 'Online & Monitoring' };
                        }
                    });
                    return reset;
                });
            }, 5000);
        });

        return () => unsubscribe();
    }, []); // No dependencies needed now

    const getAgentEmoji = (id: string) => {
        if (id === 'MAYA') return '🔬';
        if (id === 'LEO') return '🌱';
        return '🎓'; // Alex
    };

    return (
        <div className="fixed bottom-0 left-0 w-full z-[150] pointer-events-none pb-24 px-6 flex justify-center items-end opacity-90 hover:opacity-100 transition-opacity">
            <div className="flex gap-4 items-end">
                {Object.values(AUDIT_PROFILES).map((profile) => {
                    const agent = agents[profile.id];
                    const isIdle = agent.status === 'IDLE';
                    const isError = agent.status === 'ERROR';

                    return (
                        <div
                            key={profile.id}
                            className={`
                                relative group pointer-events-auto transition-all duration-500 ease-out transform
                                ${isIdle ? 'scale-100 opacity-60 hover:opacity-100 hover:scale-110' : ''}
                                ${!isIdle ? 'scale-110 opacity-100' : ''}
                            `}
                        >
                            {/* SPEECH BUBBLE (Only if Active/Error or Hover) */}
                            <div className={`
                                absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-mono font-bold border shadow-xl
                                transition-all duration-300
                                ${isError ? 'bg-red-900/90 border-red-500 text-white opacity-100 translate-y-0' : ''}
                                ${agent.status === 'ACTIVE' ? 'bg-green-900/90 border-green-500 text-white opacity-100 translate-y-0' : ''}
                                ${isIdle ? 'bg-black/80 border-white/20 text-zinc-400 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0' : ''}
                            `}>
                                {agent.lastMessage}
                            </div>

                            {/* AVATAR BOX */}
                            <div className={`
                                w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-md
                                transition-colors duration-300
                                ${isIdle ? 'bg-black/40 border-white/10 text-white grayscale hover:grayscale-0' : ''}
                                ${agent.status === 'ACTIVE' ? 'bg-green-500/20 border-green-400 text-white shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-pulse-slow' : ''}
                                ${isError ? 'bg-red-500/20 border-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-shake' : ''}
                            `}>
                                {getAgentEmoji(profile.id)}
                            </div>

                            {/* STATUS DOT */}
                            <div className={`
                                absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black
                                ${isIdle ? 'bg-zinc-600' : ''}
                                ${agent.status === 'ACTIVE' ? 'bg-green-400 animate-ping-slow' : ''}
                                ${isError ? 'bg-red-500' : ''}
                            `} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
