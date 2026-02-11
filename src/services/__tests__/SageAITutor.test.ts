import { describe, it, expect } from 'vitest';
import { SageAITutor } from '../SageAITutor';
import { BloomLevel } from '../../types/EngineTypes';

describe('SageAITutor AEP Integration', () => {
    it('triggers remediation when accuracy is low and hints are high', () => {
        // Mock AEP engine is integrated inside SageAITutor via direct import
        // Since we can't easily mock the internal import without dependency injection or module mocking,
        // we'll test the behavior if the logic is implemented as expected.

        // However, SageAITutor imports ProgressionEngine.
        // We need to see if the evaluation result reflects REMEDIATE action.
        // Correct < 0.6, Hints > 3

        const result = SageAITutor.evaluateResponse(
            "bad answer",
            ["concept1", "concept2"],
            "REMEMBER",
            2,
            4,
            undefined,
            "test_user"
        );

        // Expectation: score computed is low. Hints > 3.
        // Should trigger REMEDIATE logic: shouldAdvance = false, feedback starts with (AI Tutor)

        expect(result.shouldAdvance).toBe(false);
        expect(result.feedback).toContain("(AI Tutor)");
        expect(result.recommendedReview).toBeDefined();
    });

    it('allows progression when score is high', () => {
        const result = SageAITutor.evaluateResponse(
            "concept1 concept2",
            ["concept1", "concept2"],
            "REMEMBER",
            2,
            0,
            undefined,
            "test_user"
        );

        expect(result.shouldAdvance).toBe(true);
        expect(result.feedback).not.toContain("(AI Tutor)");
    });
});
