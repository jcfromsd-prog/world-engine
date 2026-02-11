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

        // SYNAPTIC STRATEGY: 1 Leader (High Theta) + 2 Members (Complementary Roles)
        while (unmatched.length >= 3) {
            unmatched.sort((a, b) => b.skillTheta - a.skillTheta);
            const leader = unmatched.shift()!;

            // Find 2 best complementary members
            const selectedMembers: UserVector[] = [leader];

            for (let j = 0; j < 2; j++) {
                let bestScore = -1;
                let bestMatchIndex = -1;

                for (let i = 0; i < unmatched.length; i++) {
                    const candidate = unmatched[i];

                    // Diversity Check: Prefer different archetypes
                    const roleDiversity = candidate.archetype !== leader.archetype ? 1.2 : 0.8;
                    const interestScore = this.calculateTagSimilarity(leader, candidate);
                    const skillScore = this.calculateSkillComplement(leader, candidate);

                    const totalScore = ((interestScore * 0.5) + (skillScore * 0.5)) * roleDiversity;

                    if (totalScore > bestScore) {
                        bestScore = totalScore;
                        bestMatchIndex = i;
                    }
                }

                if (bestMatchIndex !== -1) {
                    selectedMembers.push(unmatched.splice(bestMatchIndex, 1)[0]);
                }
            }

            if (selectedMembers.length === 3) {
                squads.push({
                    id: `syn-${crypto.randomUUID().substring(0, 8)}`,
                    name: `Synaptic Squad: ${leader.archetype} Core`,
                    members: selectedMembers,
                    compatibilityScore: 0.85, // Simulation baseline
                    reason: `Role-balanced team formed around ${leader.archetype} leadership.`
                });
            } else {
                // If we couldn't find 3, return remaining to pool
                unmatched.push(...selectedMembers);
                break;
            }
        }
        return { squads, unmatched };
    }
};
