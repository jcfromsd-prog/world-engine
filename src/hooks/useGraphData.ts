import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SEED_GRAPH } from '../engines/world-engine/KnowledgeGraph';
import type { SkillNode } from '../components/NeuralGraph';
import type { LearnerProfile } from '../engines/world-engine/LearnerModel';

// ============================================================================
// PHASE 4: Live Graph Data Hook
// ============================================================================
// Fetches real nodes, user mastery, and platform stats from Supabase.
// Merges with SEED_GRAPH as fallback. Zero breaking changes.
// ============================================================================

export interface PlatformStats {
    totalNodes: number;
    totalUsers: number;
    totalReputationAwarded: number;
    totalSubmissions: number;
}

const DEFAULT_STATS: PlatformStats = {
    totalNodes: SEED_GRAPH.getAllNodes().length,
    totalUsers: 0,
    totalReputationAwarded: 0,
    totalSubmissions: 0,
};

/**
 * Fetches live graph data from Supabase and merges with SEED_GRAPH.
 * Returns SkillNode[] for the NeuralGraph, plus platform-wide stats.
 */
export function useGraphData(learnerProfile: LearnerProfile) {
    const [nodes, setNodes] = useState<SkillNode[]>([]);
    const [stats, setStats] = useState<PlatformStats>(DEFAULT_STATS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            try {
                // 1. Fetch platform stats in parallel
                const [usersRes, , subsRes] = await Promise.all([
                    supabase.from('users').select('user_id, reputation_tokens', { count: 'exact', head: false }),
                    supabase.from('reputation_ledger').select('delta', { count: 'exact', head: true }),
                    supabase.from('submissions').select('submission_id', { count: 'exact', head: true }),
                ]);

                if (!cancelled) {
                    const userCount = usersRes.data?.length ?? 0;
                    const totalRep = usersRes.data?.reduce((sum: number, u: any) =>
                        sum + (parseFloat(u.reputation_tokens) || 0), 0) ?? 0;
                    const submissionCount = subsRes.count ?? 0;

                    setStats({
                        totalNodes: SEED_GRAPH.getAllNodes().length,
                        totalUsers: userCount,
                        totalReputationAwarded: Math.round(totalRep),
                        totalSubmissions: submissionCount,
                    });
                }

                // 2. Build SkillNode[] from SEED_GRAPH (enriched with mastery data)
                const seedNodes = SEED_GRAPH.getAllNodes();
                const skillNodes: SkillNode[] = seedNodes.map(n => {
                    // Check mastery from learner profile
                    const isMastered = learnerProfile.masteryMap.has(n.id);
                    const masteryScore = isMastered ? 1.0 : 0;

                    // Unlocked = no prerequisites OR at least one prereq is mastered
                    const isUnlocked = n.prerequisites.length === 0 ||
                        n.prerequisites.some(p => learnerProfile.masteryMap.has(p));

                    return {
                        id: n.id,
                        label: n.title,
                        domain: n.domain as SkillNode['domain'],
                        mastery: masteryScore,
                        gradeLevel: n.gradeLevel,
                        unlocked: isUnlocked,
                    };
                });

                if (!cancelled) {
                    setNodes(skillNodes);
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('[useGraphData] Supabase fetch failed, using seed data:', err);

                if (!cancelled) {
                    // Fallback: use SEED_GRAPH directly
                    const seedNodes = SEED_GRAPH.getAllNodes();
                    setNodes(seedNodes.map(n => ({
                        id: n.id,
                        label: n.title,
                        domain: n.domain as SkillNode['domain'],
                        mastery: 0,
                        gradeLevel: n.gradeLevel,
                        unlocked: n.prerequisites.length === 0,
                    })));
                    setIsLoading(false);
                }
            }
        }

        fetchData();

        // Realtime subscription for live stats updates
        const channel = supabase
            .channel('phase4_live_stats')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'reputation_ledger' }, () => {
                fetchData(); // Re-fetch on any ledger change
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
                fetchData(); // Re-fetch on user changes
            })
            .subscribe();

        return () => {
            cancelled = true;
            supabase.removeChannel(channel);
        };
    }, [learnerProfile]);

    return { nodes, stats, isLoading };
}
