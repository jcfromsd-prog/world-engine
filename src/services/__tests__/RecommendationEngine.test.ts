import { describe, it, expect } from 'vitest';
import { RecommendationEngine, GradeBand, BLOOM_LEVELS, type ContentNode } from '../RecommendationEngine';

describe('RecommendationEngine', () => {
    it('calculates probability correctly based on IRT', () => {
        // Equal skill and difficulty should result in 50% probability
        const prob = RecommendationEngine.calculateProbability(0, 0);
        expect(prob).toBe(0.5);

        // High skill, low difficulty -> High probability
        const easy = RecommendationEngine.calculateProbability(2, 0);
        expect(easy).toBeGreaterThan(0.5);
    });

    it('analyzes user signals correctly', () => {
        const history = [
            { itemId: '1', bloomLevel: BLOOM_LEVELS[0], success: true, timestamp: Date.now() }
        ];
        const analysis = RecommendationEngine.analyzeUserSignals(history);

        // Should suggest next bloom level or at least not regress
        expect(analysis.bloomIndex).toBeGreaterThanOrEqual(0);
        expect(analysis.theta).toBeGreaterThan(-3);
    });

    it('recommends content appropriate for grade level', () => {
        const user = {
            id: 'u1',
            skillTheta: 0,
            gradeLevel: GradeBand.SECOND
        };

        const curriculum: ContentNode[] = [
            { id: 'c1', title: 'Too Hard', difficulty: 0, bloomLevel: 'REMEMBER', minGradeLevel: 5, maxGradeLevel: 10 },
            { id: 'c2', title: 'Just Right', difficulty: 0, bloomLevel: 'REMEMBER', minGradeLevel: 1, maxGradeLevel: 3 }
        ];

        const recommendation = RecommendationEngine.recommendNextLegacy(user, [], curriculum);

        expect(recommendation.nextItem).toBeDefined();
        expect(recommendation.nextItem?.id).toBe('c2');
    });
});
