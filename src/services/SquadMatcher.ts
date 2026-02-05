export interface UserVector {
    id: string;
    archetype: string;
    skillTheta: number; // IRT Ability (-3.0 to +3.0)
    interestTags: string[]; // e.g., ["NATURE", "TECH"]
}

export interface Squad {
    id: string;
    name: string;
    members: UserVector[];
    compatibilityScore: number;
    reason: string;
}

export interface MatchResult {
    squads: Squad[];
    unmatched: UserVector[];
}

export const MOCK_USER_POOL: UserVector[] = [
    { id: "u1", archetype: "Forest Ranger", skillTheta: -1.5, interestTags: ["NATURE", "BIOLOGY"] },
    { id: "u2", archetype: "Eco Strategist", skillTheta: 2.0, interestTags: ["NATURE", "LEADERSHIP"] },
    { id: "u3", archetype: "Robotics Eng", skillTheta: 0.5, interestTags: ["TECH", "PHYSICS"] },
    { id: "u4", archetype: "Code Wizard", skillTheta: 2.5, interestTags: ["TECH", "AI"] },
    { id: "u5", archetype: "Design Alchemist", skillTheta: -0.5, interestTags: ["ART", "DESIGN"] }
];

export const SquadMatcher = {
    calculateTagSimilarity(userA: UserVector, userB: UserVector): number {
        const setA = new Set(userA.interestTags);
        const setB = new Set(userB.interestTags);
        let intersection = 0;
        setA.forEach(tag => { if (setB.has(tag)) intersection++; });
        const union = new Set([...userA.interestTags, ...userB.interestTags]).size;
        return union === 0 ? 0 : intersection / union;
    },

    calculateSkillComplement(userA: UserVector, userB: UserVector): number {
        const diff = Math.abs(userA.skillTheta - userB.skillTheta);
        if (diff > 1.0 && diff < 3.0) return 1.0;
        if (diff > 0.5) return 0.7;
        return 0.3;
    },

    findOptimalSquad(pool: UserVector[] = MOCK_USER_POOL): MatchResult {
        const squads: Squad[] = [];
        const unmatched = [...pool];

        while (unmatched.length >= 2) {
            const leader = unmatched.pop()!;
            let bestMatch: UserVector | null = null;
            let bestScore = -1;
            let bestMatchIndex = -1;

            for (let i = 0; i < unmatched.length; i++) {
                const candidate = unmatched[i];
                const interestScore = this.calculateTagSimilarity(leader, candidate);
                const skillScore = this.calculateSkillComplement(leader, candidate);
                const totalScore = (interestScore * 0.6) + (skillScore * 0.4);

                if (totalScore > bestScore) {
                    bestScore = totalScore;
                    bestMatch = candidate;
                    bestMatchIndex = i;
                }
            }

            if (bestMatch && bestScore > 0.3) {
                unmatched.splice(bestMatchIndex, 1);
                squads.push({
                    id: `sq_${Date.now()}_${squads.length}`,
                    name: `${leader.archetype} + ${bestMatch.archetype} Squad`,
                    members: [leader, bestMatch],
                    compatibilityScore: parseFloat(bestScore.toFixed(2)),
                    reason: `Matched on ${leader.interestTags[0]} with Skill Gap ${Math.abs(leader.skillTheta - bestMatch.skillTheta).toFixed(1)}`
                });
            } else {
                unmatched.unshift(leader);
                break;
            }
        }
        return { squads, unmatched };
    }
};
