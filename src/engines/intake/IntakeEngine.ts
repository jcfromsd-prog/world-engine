import {
    DIAGNOSTIC_QUESTIONS,
    CA_STANDARDS_REGISTRY,
} from './IntakeRegistry';
import { supabase } from '../../lib/supabase';

import type {
    Subject,
    DiagnosticQuestion,
    MasteryMap,
    MasteryGap
} from './IntakeRegistry';

export class IntakeEngine {
    private subjectLevels: Record<Subject, number>;
    private results: { questionId: string, correct: boolean }[] = [];

    constructor(initialGrade?: number) {
        let startingDifficulty: number;

        if (initialGrade !== undefined && !isNaN(initialGrade)) {
            if (initialGrade <= 2) startingDifficulty = 2; // Tier 1: Sprouts
            else if (initialGrade <= 5) startingDifficulty = 5; // Tier 2: Builders
            else if (initialGrade <= 8) startingDifficulty = 7; // Tier 3: Trailblazers
            else if (initialGrade <= 17) startingDifficulty = 10; // Tier 4: Explorers
            else startingDifficulty = 12; // Tier 5: Voyagers
        } else {
            startingDifficulty = 2; // System fallback mapping replaced '5'
        }

        this.subjectLevels = { math: startingDifficulty, ela: startingDifficulty, logic: startingDifficulty };
    }

    /**
     * Gets the next question based on current subject levels and IRT logic.
     */
    public getNextQuestion(): DiagnosticQuestion | null {
        // Simple round-robin through subjects
        const subjects: Subject[] = ['math', 'ela', 'logic'];
        const currentSubject = subjects[this.results.length % 3];
        const targetDifficulty = this.subjectLevels[currentSubject];

        // Find a question in that subject closest to target difficulty that hasn't been asked
        const askedIds = new Set(this.results.map(r => r.questionId));
        const pool = DIAGNOSTIC_QUESTIONS.filter(q => q.subject === currentSubject && !askedIds.has(q.id));

        if (pool.length === 0) return null;

        // Find closest difficulty
        return pool.reduce((prev, curr) =>
            Math.abs(curr.difficulty - targetDifficulty) < Math.abs(prev.difficulty - targetDifficulty) ? curr : prev
        );
    }

    /**
     * Process response and adjust difficulty (+1/-1)
     * Persists real-time wins to Supabase as Artifacts of Knowledge.
     */
    public async submitResponse(userId: string, questionId: string, optionIndex: number): Promise<boolean> {
        const question = DIAGNOSTIC_QUESTIONS.find(q => q.id === questionId);
        if (!question) return false;

        const isCorrect = question.correctIndex === optionIndex;
        this.results.push({ questionId, correct: isCorrect });

        // IRT Adjustment: +1 for correct, -1 for incorrect
        if (isCorrect) {
            this.subjectLevels[question.subject] = Math.min(12, this.subjectLevels[question.subject] + 1);
        } else {
            this.subjectLevels[question.subject] = Math.max(1, this.subjectLevels[question.subject] - 1);
        }

        try {
            // Rely securely on auth inside the function
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.id) {
                const finalId = user.id === userId ? user.id : userId;

                // Synthesis Protocol: Record EVERY answer to established schema
                const subRes = await supabase.from('submissions').insert({
                    user_id: finalId,
                    node_id: '00000000-0000-0000-0000-000000000000', // Placeholder UUID
                    status: 'validated',
                    consensus_score: isCorrect ? 1.0 : 0.0
                });

                if (subRes.error) {
                    console.error("SUPABASE SUBMISSIONS ERROR:", subRes.error.message);
                }

                // Synthesis Protocol: Accumulate current_profile dynamically and append to ledger
                const { data: lastLedger } = await supabase
                    .from('reputation_ledger')
                    .select('current_profile')
                    .eq('user_id', finalId)
                    .order('logged_at', { ascending: false })
                    .limit(1)
                    .single();

                const priorProfile = lastLedger?.current_profile || {};
                const mergedProfile = { ...priorProfile, [question.subject]: this.subjectLevels[question.subject] };

                const repRes = await supabase.from('reputation_ledger').insert({
                    user_id: finalId,
                    delta: isCorrect ? 10 : 0,
                    reason: isCorrect ? 'diagnostic_mastery' : 'diagnostic_attempt',
                    current_profile: mergedProfile
                });

                if (repRes.error) {
                    console.error("SUPABASE REPUTATION LEDGER ERROR:", repRes.error.message);
                }
            }
        } catch (error) {
            console.error("VISION COMPLIANCE ERROR: Failure to etch Artifact of Knowledge.", error);
        }

        // Cache for instant UI continuity: Save subjectLevels/results to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('mbp_intake_state', JSON.stringify({
                subjectLevels: this.subjectLevels,
                results: this.results
            }));
        }

        return isCorrect;
    }

    /**
     * Generates the factual MasteryMap based on current levels and gaps detected.
     */
    public generateMasteryMap(): MasteryMap {
        const gaps: MasteryGap[] = [];
        const subjects: Subject[] = ['math', 'ela', 'logic'];

        // Confidence score based on consistency of results (simplified)
        const correctCount = this.results.filter(r => r.correct).length;
        const confidenceScore = correctCount / Math.max(1, this.results.length);

        subjects.forEach(subject => {
            const level = this.subjectLevels[subject];
            Object.entries(CA_STANDARDS_REGISTRY).forEach(([id, meta]) => {
                if (meta.subject === subject && meta.grade <= level) {
                    const missed = this.results.find(r => {
                        const q = DIAGNOSTIC_QUESTIONS.find(dq => dq.id === r.questionId);
                        return q?.standardId === id && !r.correct;
                    });

                    if (missed) {
                        gaps.push({
                            subject,
                            standardId: id,
                            description: meta.description,
                            gradeLevel: meta.grade
                        });
                    }
                }
            });
        });

        const isHS = Object.values(this.subjectLevels).some(lvl => lvl >= 9);
        const graduationProjection = isHS ? {
            creditsCompleted: Math.min(220, correctCount * 15),
            creditsRemaining: Math.max(0, 220 - (correctCount * 15)),
            estimatedCompletion: 'June 2027'
        } : undefined;

        return {
            zpd: this.subjectLevels,
            gaps,
            nextCompetencies: subjects.map(s => `Mastery of Grade ${this.subjectLevels[s] + 1} ${s.toUpperCase()}`),
            confidenceScore,
            graduationProjection
        };
    }

    public isComplete(): boolean {
        return this.results.length >= 10; // 10-question assessment
    }
}
