
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
import { KnowledgeGraph } from './KnowledgeGraph';
import { devTelemetry } from '../logic-link/ObservabilityLayer';

export class WorldEngine {
    private learner: LearnerModel;
    private graph: KnowledgeGraph;
    public activeTask: KnowledgeNode | null = null;
    private listeners: (() => void)[] = [];

    constructor(initialProfile: LearnerProfile, graph: KnowledgeGraph = new KnowledgeGraph()) {
        this.learner = new LearnerModel(initialProfile);
        this.graph = graph;
    }

    public subscribe(listener: () => void): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public triggerUpdate(): void {
        this.listeners.forEach(l => l());
    }

    public setActiveTask(task: KnowledgeNode | null): void {
        this.activeTask = task;
        if (task) {
            devTelemetry.trackEvent('GOAL', `User selected task: ${task.title}`, 'success', { id: task.id });
        }
        this.triggerUpdate();
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

        const selected = validCandidates.slice(0, limit);

        // [TELEMETRY] 🎯 GOAL PHASE
        if (selected.length > 0) {
            devTelemetry.trackEvent('GOAL', `Identified ${selected.length} valid tasks`, 'success', {
                topCandidate: selected[0].title,
                gradeLevel: currentGrade
            });
        } else {
            devTelemetry.trackEvent('GOAL', 'No tasks found (Curriculum Complete?)', 'neutral');
        }

        return selected;
    }

    /**
     * SUBMISSION LOGIC
     * Updates the learner model based on performance.
     */
    public submitTask(nodeId: string, success: boolean, timeSpent: number): void {
        // [TELEMETRY] ⚡ ACTION PHASE
        devTelemetry.trackEvent('ACTION', `User submitted task: ${nodeId}`, 'neutral', { timeSpent });

        this.learner.updateMastery(nodeId, success, timeSpent);

        // [TELEMETRY] 🛡️ CHECK PHASE
        const newMastery = this.learner.getProfile().masteryMap.get(nodeId);


        devTelemetry.trackEvent('CHECK',
            success ? `Validation Passed (Mastery: ${newMastery?.masteryScore.toFixed(2)})` : 'Task Failed',
            success ? 'success' : 'failure'
        );

        if (success) {
            // [TELEMETRY] 🎁 PAYOFF PHASE
            devTelemetry.trackEvent('PAYOFF', 'Awarded Genesis Points +200 GP', 'success');
        }

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
     * DEV ONLY: Reset all progress
     */
    public resetProgress(): void {
        this.learner.getProfile().masteryMap.clear();
        this.learner.getProfile().completedMissions = [];
        this.learner.getProfile().genesisPoints = 0;
    }
}
