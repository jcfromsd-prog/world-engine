
// ============================================================================
// WORLD ENGINE: CORE LOGIC
// ============================================================================
// The "Orchestrator" service that ties the Learner Model to the Knowledge Graph
// and makes pedagogical decisions.
// Based on: docs/ARCHITECTURE_2026.md (Section IV. B. Decision Engine)
// ============================================================================

import type { LearnerProfile } from './LearnerModel';
import { LearnerModel } from './LearnerModel';
import type { KnowledgeNode } from './KnowledgeGraph';
import { KnowledgeGraph, SEED_GRAPH } from './KnowledgeGraph';

export class WorldEngine {
    private learner: LearnerModel;
    private graph: KnowledgeGraph;

    constructor(initialProfile: LearnerProfile, graph: KnowledgeGraph = SEED_GRAPH) {
        this.learner = new LearnerModel(initialProfile);
        this.graph = graph;
    }

    /**
     * DECISION ENGINE: SELECTION LOGIC
     * 1. Check what is UNLOCKED (Prereqs met).
     * 2. Filter by Grade Appropriateness (ZPD).
     * 3. Prioritize by Cognitive State (Focus/Energy).
     * 4. Select the best candidates.
     */
    public getNextTaskOptions(limit: number = 3): KnowledgeNode[] {
        const masteredIds = new Set(this.learner.getProfile().masteryMap.keys());

        // 1. Get raw unlocked nodes
        const unlocked = this.graph.getUnlockedNodes(masteredIds);

        // 2. Filter by Grade Level Range (ZPD: Learner Grade +/- 1)
        // We allow some flexibility for remediation or acceleration.
        const currentGrade = this.learner.getProfile().currentGrade;
        const validCandidates = unlocked.filter(node =>
            Math.abs(node.gradeLevel - currentGrade) <= 1
        );

        // 3. Selection Strategy (Simple Heuristic for now)
        // - Ensure domain variety if possible
        // - Prioritize lower grade level gaps first (Remediation priority)

        validCandidates.sort((a, b) => {
            // Priority 1: Lower Grade Level = Higher Priority (Fill gaps)
            if (a.gradeLevel !== b.gradeLevel) return a.gradeLevel - b.gradeLevel;

            // Priority 2: Random shuffle for variety within grade
            return Math.random() - 0.5;
        });

        return validCandidates.slice(0, limit);
    }

    /**
     * SUBMISSION LOGIC
     * Updates the learner model based on performance.
     */
    public submitTask(nodeId: string, success: boolean, timeSpent: number): void {
        this.learner.updateMastery(nodeId, success, timeSpent);

        // Apply decay to OLD memories occasionally
        // (In a real app, this might run on a cron job or startup, not every task)
        this.learner.applyDecay();
    }

    public getProfile(): LearnerProfile {
        return this.learner.getProfile();
    }

    /**
     * Diagnostic: Check if learner is ready for next grade
     */
    public checkGradeAdvancement(): boolean {
        // Implementation TBD: Check if > 80% of current grade nodes are mastered
        return false;
    }

    /**
     * DEV ONLY: Reset all progress with optional Grade Reseed
     * @param targetGrade Classifies the learner to a specific grade level.
     */
    public resetProgress(targetGrade?: number): void {
        this.learner.getProfile().masteryMap.clear();
        this.learner.getProfile().completedMissions = [];
        this.learner.getProfile().genesisPoints = 0;

        if (targetGrade) {
            // Safe Cast: We trust the Dev Console input to be 1-12
            this.learner.getProfile().currentGrade = targetGrade as any;

            // OPTION B: Recursively Unlock Subtrees (Runway)
            const entryNodes = this.graph.getNodesByGrade(targetGrade as any).filter(n => n.prerequisites.length === 0);

            entryNodes.forEach(root => {
                this.unlockSubtree(root.id, 2); // Depth 2 by default
            });
        }
    }

    /**
     * PRIVATE: Recursively unlock a subtree to provide a "runway" for the agent.
     * Uses BFS to traverse deeper into the graph.
     */
    private unlockSubtree(rootId: string, maxDepth: number): void {
        const queue: { id: string, depth: number }[] = [{ id: rootId, depth: 0 }];
        const visited = new Set<string>();

        while (queue.length > 0) {
            const current = queue.shift()!;
            if (visited.has(current.id)) continue;
            visited.add(current.id);

            // "Master" this node so its children unlock
            // We set it as "System Mastered" to distinguish from real user work
            this.learner.updateMastery(current.id, true, 0);

            if (current.depth < maxDepth) {
                const children = this.graph.getConnectedNodes(current.id);
                children.forEach(childId => {
                    queue.push({ id: childId, depth: current.depth + 1 });
                });
            }
        }
    }
}
