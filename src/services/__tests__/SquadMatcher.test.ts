import { describe, it, expect } from 'vitest';
import { SquadMatcher, MOCK_USER_POOL } from '../SquadMatcher';

describe('SquadMatcher', () => {
    it('calculates tag similarity correctly', () => {
        const u1 = { ...MOCK_USER_POOL[0], interestTags: ['A', 'B'] };
        const u2 = { ...MOCK_USER_POOL[0], interestTags: ['B', 'C'] };
        const score = SquadMatcher.calculateTagSimilarity(u1, u2);
        // Intersection: 1 (B), Union: 3 (A, B, C) -> 1/3
        expect(score).toBeCloseTo(0.33, 2);
    });

    it('calculates skill complement correctly', () => {
        const u1 = { ...MOCK_USER_POOL[0], skillTheta: 0 };
        const u2 = { ...MOCK_USER_POOL[0], skillTheta: 2.0 };
        // Diff is 2.0, which is between 1.0 and 3.0 -> returns 1.0
        const score = SquadMatcher.calculateSkillComplement(u1, u2);
        expect(score).toBe(1.0);
    });

    it('finds optimal squads from pool', () => {
        const result = SquadMatcher.findOptimalSquad();
        expect(result.squads.length).toBeGreaterThan(0);
        expect(result.squads[0].members.length).toBe(2);
        expect(result.squads[0].compatibilityScore).toBeGreaterThan(0);
    });
});
