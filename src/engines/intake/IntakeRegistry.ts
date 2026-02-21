
export type Subject = 'math' | 'ela' | 'logic';

export interface DiagnosticQuestion {
    id: string;
    subject: Subject;
    difficulty: number; // 1 to 12 (mapped to grade levels)
    text: string;
    options: string[];
    correctIndex: number;
    visualAid?: string; // For Grade 1-3 Sprouts
    standardId: string; // e.g., CCSS.MATH.CONTENT.4.NBT.A.1
}

export interface MasteryGap {
    subject: Subject;
    standardId: string;
    description: string;
    gradeLevel: number;
}

export interface MasteryMap {
    zpd: Record<Subject, number>;
    gaps: MasteryGap[];
    nextCompetencies: string[];
    confidenceScore: number;
    graduationProjection?: {
        creditsCompleted: number;
        creditsRemaining: number;
        estimatedCompletion: string;
    };
}

export const CA_STANDARDS_REGISTRY: Record<string, { description: string, subject: Subject, grade: number }> = {
    // MATH
    'CCSS.MATH.1.OA.A.1': { description: 'Addition/Subtraction within 20.', subject: 'math', grade: 1 },
    'CCSS.MATH.1.NBT.A.1': { description: 'Number sense: Count to 120.', subject: 'math', grade: 1 },
    'CCSS.MATH.4.NBT.A.1': { description: 'Place value concepts for multi-digit whole numbers.', subject: 'math', grade: 4 },
    'CCSS.MATH.7.RP.A.1': { description: 'Unit rates with fractions.', subject: 'math', grade: 7 },
    'CCSS.MATH.HS.A-REI.B.3': { description: 'Solving linear equations and inequalities.', subject: 'math', grade: 11 },

    // ELA
    'CCSS.ELA.1.RF.1': { description: 'Phonemic awareness: initial sounds.', subject: 'ela', grade: 1 },
    'CCSS.ELA.1.RF.2': { description: 'Phonological awareness: blending.', subject: 'ela', grade: 1 },
    'CCSS.ELA.4.RI.1': { description: 'Refer to details in text.', subject: 'ela', grade: 4 },
    'CCSS.ELA.7.W.1': { description: 'Write arguments to support claims.', subject: 'ela', grade: 7 },
    'CCSS.ELA.HS.RL.9-10.1': { description: 'Cite strong textual evidence.', subject: 'ela', grade: 11 },

    // HS MANDATES
    'CA.HS.ETHNIC_STUDIES': { description: 'Critical analysis of diverse histories.', subject: 'logic', grade: 9 },
    'CA.HS.PERSONAL_FINANCE': { description: 'Financial literacy and credit management.', subject: 'logic', grade: 11 }
};

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
    // MATH
    { id: 'q_m1', subject: 'math', difficulty: 1, text: 'How many apples are there if you have 5 and get 3 more?', options: ['7', '8', '9'], correctIndex: 1, standardId: 'CCSS.MATH.1.OA.A.1' },
    { id: 'q_m2', subject: 'math', difficulty: 2, text: 'What is 10 + 10?', options: ['20', '100', '11'], correctIndex: 0, standardId: 'CCSS.MATH.1.OA.A.1' },
    { id: 'q_m4', subject: 'math', difficulty: 4, text: 'In the number 4,500, the 4 represents which value?', options: ['400', '4,000', '40'], correctIndex: 1, standardId: 'CCSS.MATH.4.NBT.A.1' },
    { id: 'q_m5', subject: 'math', difficulty: 5, text: 'What is 12 x 12?', options: ['122', '140', '144'], correctIndex: 2, standardId: 'CCSS.MATH.4.NBT.A.1' },
    { id: 'q_m7', subject: 'math', difficulty: 7, text: 'If a car travels 60 miles in 1.5 hours, what is its rate?', options: ['30 mph', '40 mph', '90 mph'], correctIndex: 1, standardId: 'CCSS.MATH.7.RP.A.1' },
    { id: 'q_m9', subject: 'math', difficulty: 9, text: 'Solve for x: 2x + 5 = 15', options: ['x=5', 'x=10', 'x=15'], correctIndex: 0, standardId: 'CCSS.MATH.HS.A-REI.B.3' },

    // ELA
    { id: 'q_e1', subject: 'ela', difficulty: 1, text: 'Which word starts with the same sound as "Cat"?', options: ['Dog', 'Cup', 'Bat'], correctIndex: 1, standardId: 'CCSS.ELA.1.RF.1' },
    { id: 'q_e2', subject: 'ela', difficulty: 2, text: 'Which of these is a noun?', options: ['Run', 'Apple', 'Quickly'], correctIndex: 1, standardId: 'CCSS.ELA.1.RF.1' },
    { id: 'q_e4', subject: 'ela', difficulty: 4, text: 'Which word is a synonym for "Fast"?', options: ['Quick', 'Slow', 'Large'], correctIndex: 0, standardId: 'CCSS.ELA.4.RI.1' },
    { id: 'q_e7', subject: 'ela', difficulty: 7, text: 'Identify the thesis statement in an essay.', options: ['The main point', 'The ending', 'A random detail'], correctIndex: 0, standardId: 'CCSS.ELA.7.W.1' },
    { id: 'q_e10', subject: 'ela', difficulty: 10, text: 'What is an allegory?', options: ['A story with a hidden meaning', 'A type of poem', 'A character name'], correctIndex: 0, standardId: 'CCSS.ELA.HS.RL.9-10.1' },

    // LOGIC / HS MANDATES
    { id: 'q_pf11', subject: 'logic', difficulty: 11, text: 'Benefit of a high credit score?', options: ['Higher rates', 'Lower rates', 'No impact'], correctIndex: 1, standardId: 'CA.HS.PERSONAL_FINANCE' },
    { id: 'q_es9', subject: 'logic', difficulty: 9, text: 'What is the focus of Ethnic Studies?', options: ['Diverse histories', 'Chemistry', 'Calculus'], correctIndex: 0, standardId: 'CA.HS.ETHNIC_STUDIES' },
    { id: 'q_l1', subject: 'logic', difficulty: 1, text: 'Finish the pattern: Red, Blue, Red, ...', options: ['Red', 'Blue', 'Green'], correctIndex: 1, standardId: 'logic.pattern' },
    { id: 'q_l4', subject: 'logic', difficulty: 4, text: 'If All A are B, and X is A, then...', options: ['X is B', 'X is not B', 'B is A'], correctIndex: 0, standardId: 'logic.syllogism' },
    { id: 'q_l7', subject: 'logic', difficulty: 7, text: 'Which is a logical fallacy?', options: ['Ad Hominem', 'Logic Gate', 'Equation'], correctIndex: 0, standardId: 'logic.fallacy' },
    { id: 'q_l10', subject: 'logic', difficulty: 10, text: 'Input A=1, B=0 into an AND gate. Output?', options: ['1', '0', 'Error'], correctIndex: 1, standardId: 'logic.gates' }
];
