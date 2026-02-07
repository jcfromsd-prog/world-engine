import { describe, it, expect } from 'vitest';
import { RecommendationEngine, GradeBand } from '../RecommendationEngine';
import type { UserProfile } from '../../types/EngineTypes';

describe('RecommendationEngine', () => {
    it('calculates probability correctly based on IRT', () => {
        // Equal skill and difficulty should result in 50% probability
        const prob = RecommendationEngine.calculateProbability(0, 0);
        expect(prob).toBe(0.5);

        // High skill, low difficulty -> High probability
        const easy = RecommendationEngine.calculateProbability(2, 0);
        expect(easy).toBeGreaterThan(0.5);
    });

    it('updates skill theta correctly', () => {
        const initialTheta = 0;
        const difficulty = 0;

        // Success should increase theta
        const increased = RecommendationEngine.updateSkillTheta(initialTheta, difficulty, true);
        expect(increased).toBeGreaterThan(initialTheta);

        // Failure should decrease theta
        const decreased = RecommendationEngine.updateSkillTheta(initialTheta, difficulty, false);
        expect(decreased).toBeLessThan(initialTheta);
    });

    it('recommends content appropriate for grade level', () => {
        const user: UserProfile = {
            id: 'u1',
            name: 'Test Solver',
            skillTheta: 0,
            gradeLevel: GradeBand.SECOND,
            interests: ['coding'],
            archetype: 'Builder',
            passion: 'Technology',
            competencies: {}
        };

        // Note: recommendNext uses CONTENT_DB from ../data/Curriculum
        // This is an integration test check
        const recommendation = RecommendationEngine.recommendNext(user);

        if (recommendation) {
            expect(recommendation.node.minGrade).toBeLessThanOrEqual(user.gradeLevel);
            expect(recommendation.node.maxGrade).toBeLessThanOrEqual(user.gradeLevel + 2); // default stretch
        }
    });
});

