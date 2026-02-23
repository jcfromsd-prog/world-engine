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
    private subjectLevels: Record<Subject, number> = { math: 5, ela: 5, logic: 5 }; // Start at grade 5
    private results: { questionId: string, correct: boolean }[] = [];

    constructor(initialGrade: number = 5) {
        this.subjectLevels = { math: initialGrade, ela: initialGrade, logic: initialGrade };
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

            // ATOMIC EDIT: Real-time persistence using known exact schemas
            try {
                await supabase.from('submissions').insert({
                    user_id: userId,
                    content: {
                        question_id: question.id,
                        standard_id: question.standardId,
                        subject: question.subject
                    },
                    status: 'validated'
                });

                await supabase.from('reputation_ledger').insert({
                    user_id: userId,
                    delta: 10,
                    reason: 'validation_earned'
                });
            } catch (error) {
                console.error("VISION COMPLIANCE ERROR: Failure to etch Artifact of Knowledge.", error);
            }
        } else {
            this.subjectLevels[question.subject] = Math.max(1, this.subjectLevels[question.subject] - 1);
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
            // Identify gaps: Any standard below the target level that was missed, 
            // or standard exactly at the current level that hasn't been mastered.
            Object.entries(CA_STANDARDS_REGISTRY).forEach(([id, meta]) => {
                if (meta.subject === subject && meta.grade <= level) {
                    // In a real IRT, we'd check if they missed a lower level question
                    // For this engine, we'll flag standards at and slightly above their ZPD as "Next Competencies"
                    // and any missed questions as "Gaps"
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
