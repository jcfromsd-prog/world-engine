
import type { Squad, SquadMember } from '../../engine/types';

export interface VirtualSquadmate extends SquadMember {
    roleProfile: string;
    isAI: boolean;
}

const AI_SQUAD_TEMPLATES: VirtualSquadmate[] = [
    {
        userId: 'ai_strategist_001',
        displayName: 'The Strategist',
        archetype: 'Logic Weaver',
        role: 'strategist',
        roleProfile: 'Asks clarifying questions. Verifies logic constraints before execution.',
        isAI: true,
        contribution: 0,
        skills: {
            skills: {
                logic: { category: 'logic', level: 80, mastery: 0.8, tier: 'expert', lastPracticed: 0, streak: 0 },
                creativity: { category: 'creativity', level: 30, mastery: 0.3, tier: 'apprentice', lastPracticed: 0, streak: 0 },
                engineering: { category: 'engineering', level: 50, mastery: 0.5, tier: 'journeyman', lastPracticed: 0, streak: 0 },
                leadership: { category: 'leadership', level: 90, mastery: 0.9, tier: 'master', lastPracticed: 0, streak: 0 },
                nature: { category: 'nature', level: 20, mastery: 0.2, tier: 'novice', lastPracticed: 0, streak: 0 },
                social: { category: 'social', level: 70, mastery: 0.7, tier: 'expert', lastPracticed: 0, streak: 0 }
            },
            dominantSkill: 'leadership',
            weakestSkill: 'nature'
        }
    },
    {
        userId: 'ai_builder_001',
        displayName: 'The Builder',
        archetype: 'Data Striker',
        role: 'dps',
        roleProfile: 'Reviews outputs. Focuses on structural integrity and standards alignment.',
        isAI: true,
        contribution: 0,
        skills: {
            skills: {
                logic: { category: 'logic', level: 60, mastery: 0.6, tier: 'journeyman', lastPracticed: 0, streak: 0 },
                creativity: { category: 'creativity', level: 70, mastery: 0.7, tier: 'expert', lastPracticed: 0, streak: 0 },
                engineering: { category: 'engineering', level: 90, mastery: 0.9, tier: 'master', lastPracticed: 0, streak: 0 },
                leadership: { category: 'leadership', level: 40, mastery: 0.4, tier: 'apprentice', lastPracticed: 0, streak: 0 },
                nature: { category: 'nature', level: 40, mastery: 0.4, tier: 'apprentice', lastPracticed: 0, streak: 0 },
                social: { category: 'social', level: 50, mastery: 0.5, tier: 'journeyman', lastPracticed: 0, streak: 0 }
            },
            dominantSkill: 'engineering',
            weakestSkill: 'nature'
        }
    }
];

export class SquadOrchestrator {
    private storageKey = 'mbp_persistent_squad';

    /**
     * ORACLE-3 RUBRIC SYSTEM
     * Enforcing Law 3: Competence Through Evidence
     */
    private static RUBRIC_REGISTRY: Record<string, { criteria: string, validate: (input: string) => boolean }> = {
        'CCSS.MATH.4.NBT.A.1': {
            criteria: 'Demonstrate that a digit in one place represents ten times its right-side neighbor.',
            validate: (input) => {
                const lower = input.toLowerCase();
                return (lower.includes('10 times') || lower.includes('ten times') || lower.includes('x10')) &&
                    (lower.includes('place') || lower.includes('value'));
            }
        },
        'CCSS.ELA-LITERACY.RL.4.1': {
            criteria: 'Cite specific textual evidence to support inferences.',
            validate: (input) => {
                const lower = input.toLowerCase();
                return (lower.includes('quoting') || lower.includes('evidence') || lower.includes('text says')) &&
                    input.length > 100; // Require some depth
            }
        },
        'ETHNIC_STUDIES.CA.9-12.1': {
            criteria: 'Analyze how diverse histories contribute to collective identity.',
            validate: (input) => {
                const lower = input.toLowerCase();
                return lower.includes('perspective') || lower.includes('history') || lower.includes('marginalized');
            }
        },
        'DEFAULT': {
            criteria: 'Demonstrate structural integrity and information density.',
            validate: (input) => input.length > 150
        }
    };

    public static evaluateSubmission(standardId: string, content: string): { passed: boolean; score: number; feedback: string } {
        const rubric = this.RUBRIC_REGISTRY[standardId] || this.RUBRIC_REGISTRY['DEFAULT'];
        const passed = rubric.validate(content);

        if (passed) {
            return {
                passed: true,
                score: 100,
                feedback: `Verification successful. Standards alignment confirmed for ${standardId}. Proceeding to Delta calculation.`
            };
        } else {
            return {
                passed: false,
                score: 40,
                feedback: `Your answer gives us useful data. The expected approach for ${standardId} is: ${rubric.criteria}. Let's try the next step.`
            };
        }
    }

    public async orchestrateSquad(userId: string): Promise<Squad> {
        if (typeof window === 'undefined') return {} as Squad;

        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            const squad = JSON.parse(saved);
            if (squad.members.some((m: any) => m.userId === userId)) {
                return squad;
            }
        }

        const squadId = `squad_${crypto.randomUUID()}`;
        const userAsMember: SquadMember = {
            userId,
            displayName: 'Lead Solver',
            archetype: 'Architect',
            role: 'strategist',
            contribution: 0,
            skills: {
                skills: {} as any,
                dominantSkill: 'logic',
                weakestSkill: 'nature'
            }
        };

        const newSquad: Squad = {
            id: squadId,
            name: `${userAsMember.displayName}'s Tactical Squad`,
            members: [userAsMember, ...AI_SQUAD_TEMPLATES],
            combinedPower: 250,
            formedAt: Date.now(),
            missionsCompleted: 0,
            totalEarnings: 0,
            isActive: true
        };

        localStorage.setItem(this.storageKey, JSON.stringify(newSquad));
        return newSquad;
    }

    public getSquad(): Squad | null {
        if (typeof window === 'undefined') return null;
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : null;
    }
}
