export type Subject = 'math' | 'ela' | 'logic';

// Phase 3: Intelligence Swarm - Age Tiers mapped to Supabase users.age_tier (1-5)
export type AgeTier = 1 | 2 | 3 | 4 | 5;

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
    ageTier?: AgeTier; // Injected during Engine completion
    graduationProjection?: {
        creditsCompleted: number;
        creditsRemaining: number;
        estimatedCompletion: string;
    };
}

// Utility function to convert raw average grade (1-12) to Swarm Age Tier (1-5)
export const calculateAgeTier = (averageGrade: number): AgeTier => {
    if (averageGrade <= 3) return 1;       // Tier 1: Sprouts (Grades 1-3)
    if (averageGrade <= 6) return 2;       // Tier 2: Explorers (Grades 4-6)
    if (averageGrade <= 8) return 3;       // Tier 3: Builders (Grades 7-8)
    if (averageGrade <= 10) return 4;      // Tier 4: Architects (Grades 9-10)
    return 5;                              // Tier 5: Voyagers (Grades 11-12+)
};

export const CA_STANDARDS_REGISTRY: Record<string, { description: string, subject: Subject, grade: number }> = {
    // MATH
    'CCSS.MATH.1.OA.A.1': { description: 'Addition/Subtraction within 20.', subject: 'math', grade: 1 },
    'CCSS.MATH.1.NBT.A.1': { description: 'Number sense: Count to 120.', subject: 'math', grade: 1 },
    'CCSS.MATH.2.NBT.B.5': { description: 'Fluently add and subtract within 100.', subject: 'math', grade: 2 },
    'CCSS.MATH.4.NBT.A.1': { description: 'Place value concepts for multi-digit whole numbers.', subject: 'math', grade: 4 },
    'CCSS.MATH.5.NF.A.1': { description: 'Add/Subtract fractions with unlike denominators.', subject: 'math', grade: 5 },
    'CCSS.MATH.5.MD.C.3': { description: 'Understand concepts of volume measurement.', subject: 'math', grade: 5 },
    'CCSS.MATH.7.RP.A.1': { description: 'Unit rates with fractions.', subject: 'math', grade: 7 },
    'CCSS.MATH.8.EE.C.7': { description: 'Solve linear equations in one variable.', subject: 'math', grade: 8 },
    'CCSS.MATH.8.G.B.7': { description: 'Apply Pythagorean Theorem to find side lengths.', subject: 'math', grade: 8 },
    'CCSS.MATH.HS.A-REI.B.3': { description: 'Solving linear equations and inequalities.', subject: 'math', grade: 11 },
    'SAT.MATH.ALGEBRA.1': { description: 'Solving systems of linear equations.', subject: 'math', grade: 10 },
    'AP.STATS.1': { description: 'Interpreting standard deviation and variance.', subject: 'math', grade: 12 },

    // ELA
    'CCSS.ELA.1.RF.1': { description: 'Phonemic awareness: initial sounds.', subject: 'ela', grade: 1 },
    'CCSS.ELA.1.L.1.e': { description: 'Use verbs to convey sense of past, present, future.', subject: 'ela', grade: 1 },
    'CCSS.ELA.3.L.4.a': { description: 'Use context as a clue to the meaning of a word.', subject: 'ela', grade: 3 },
    'CCSS.ELA.4.RI.1': { description: 'Refer to details in text.', subject: 'ela', grade: 4 },
    'CCSS.ELA.4.L.1.f': { description: 'Produce complete sentences, avoiding fragments.', subject: 'ela', grade: 4 },
    'CCSS.ELA.5.L.4.b': { description: 'Use common Greek and Latin affixes/roots.', subject: 'ela', grade: 5 },
    'CCSS.ELA.7.W.1': { description: 'Write arguments to support claims.', subject: 'ela', grade: 7 },
    'CCSS.ELA.8.L.1.b': { description: 'Form and use verbs in the active and passive voice.', subject: 'ela', grade: 8 },
    'CCSS.ELA.HS.RL.9-10.1': { description: 'Cite strong textual evidence.', subject: 'ela', grade: 11 },
    'SAT.READING.RHETORIC': { description: 'Analyze rhetorical devices and authorial intent.', subject: 'ela', grade: 10 },
    'SAT.WRITING.PARALLELISM': { description: 'Maintain parallel structure in complex sentences.', subject: 'ela', grade: 11 },
    'AP.ENGLISH.TONE': { description: 'Analyze complex tonal shifts in literary works.', subject: 'ela', grade: 12 },

    // STEM & ADVANCED LOGIC
    'LOGIC.SEQUENCE.1': { description: 'Analyze complex mathematical sequences.', subject: 'logic', grade: 2 },
    'LOGIC.DEDUCTION.1': { description: 'Execute multi-step deductive reasoning.', subject: 'logic', grade: 5 },
    'LOGIC.GATE.OR': { description: 'Evaluate boolean OR logic gates.', subject: 'logic', grade: 8 },
    'LOGIC.FALLACY.STRAWMAN': { description: 'Identify strawman logical fallacies in arguments.', subject: 'logic', grade: 9 },
    'LOGIC.SYSTEMS.TRANSITIVE': { description: 'Apply the transitive property to relational systems.', subject: 'logic', grade: 10 },
    'HS.GOV.C.2': { description: 'Analyze the US Constitution and rule of law.', subject: 'logic', grade: 9 },
    'HS.ECON.PF.1': { description: 'Calculate compound interest and analyze macro-economic impacts on credit.', subject: 'logic', grade: 11 }
};

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
    // --- MATH ---
    // Sprouts (1-3)
    { id: 'q_m_s1', subject: 'math', difficulty: 2, text: 'What is 45 + 32?', options: ['75', '77', '87'], correctIndex: 1, standardId: 'CCSS.MATH.2.NBT.B.5' },
    { id: 'q_m_s2', subject: 'math', difficulty: 3, text: 'A shape has 3 sides and 3 corners. What is it?', options: ['Square', 'Circle', 'Triangle'], correctIndex: 2, standardId: 'CCSS.MATH.1.G.A.1' },
    // Explorers (4-6)
    { id: 'q_m_e1', subject: 'math', difficulty: 5, text: 'Solve: 1/4 + 2/4', options: ['3/4', '3/8', '1/2'], correctIndex: 0, standardId: 'CCSS.MATH.5.NF.A.1' },
    { id: 'q_m_e2', subject: 'math', difficulty: 6, text: 'A box is 2cm wide, 3cm long, and 4cm high. What is its volume?', options: ['9 cm³', '24 cm³', '12 cm³'], correctIndex: 1, standardId: 'CCSS.MATH.5.MD.C.3' },
    // Builders (7-8)
    { id: 'q_m_b1', subject: 'math', difficulty: 7, text: 'Solve for x: 3x = 12', options: ['x=3', 'x=4', 'x=9'], correctIndex: 1, standardId: 'CCSS.MATH.8.EE.C.7' },
    { id: 'q_m_b2', subject: 'math', difficulty: 8, text: 'In a right triangle, if sides a=3 and b=4, what is the hypotenuse c?', options: ['5', '7', '12'], correctIndex: 0, standardId: 'CCSS.MATH.8.G.B.7' },
    // Architects (9-10)
    { id: 'q_m_a1', subject: 'math', difficulty: 9, text: 'Factor the expression: x^2 - 5x + 6', options: ['(x-2)(x-3)', '(x+2)(x+3)', '(x-1)(x-6)'], correctIndex: 0, standardId: 'SAT.MATH.ALGEBRA.1' },
    { id: 'q_m_a2', subject: 'math', difficulty: 10, text: 'In a right triangle, if sin(θ) = 3/5, what is cos(θ)?', options: ['4/5', '3/4', '1'], correctIndex: 0, standardId: 'SAT.MATH.ALGEBRA.1' },
    // Voyagers (11-12)
    { id: 'q_m_v1', subject: 'math', difficulty: 11, text: 'If the variance of a dataset is 16, what is the standard deviation?', options: ['4', '8', '256'], correctIndex: 0, standardId: 'AP.STATS.1' },
    { id: 'q_m_v2', subject: 'math', difficulty: 12, text: 'What is the limit of (1/x) as x approaches infinity?', options: ['1', '0', 'Infinity'], correctIndex: 1, standardId: 'AP.CALC.1' },

    // --- EXPANDED MATH (IRT VARIANCE) ---
    { id: 'q_m_irt_1', subject: 'math', difficulty: 3, text: 'What is 8 x 7?', options: ['54', '56', '48'], correctIndex: 1, standardId: 'CCSS.MATH.4.NBT.A.1' },
    { id: 'q_m_irt_2', subject: 'math', difficulty: 4, text: 'Which number is a multiple of 6?', options: ['18', '20', '21'], correctIndex: 0, standardId: 'CCSS.MATH.4.NBT.A.1' },
    { id: 'q_m_irt_3', subject: 'math', difficulty: 5, text: 'What is 1/2 of 1/2?', options: ['1', '1/4', '1/8'], correctIndex: 1, standardId: 'CCSS.MATH.5.NF.A.1' },
    { id: 'q_m_irt_4', subject: 'math', difficulty: 7, text: 'If a map scale uses 1 inch = 10 miles, how far is 5 inches?', options: ['2 miles', '15 miles', '50 miles'], correctIndex: 2, standardId: 'CCSS.MATH.7.RP.A.1' },
    { id: 'q_m_irt_5', subject: 'math', difficulty: 8, text: 'What is the sum of interior angles in a triangle?', options: ['90 degrees', '180 degrees', '360 degrees'], correctIndex: 1, standardId: 'CCSS.MATH.8.G.B.7' },

    // --- ELA ---
    // Sprouts (1-3)
    { id: 'q_e_s1', subject: 'ela', difficulty: 1, text: 'Which word is an action word (verb)?', options: ['Apple', 'Run', 'Happy'], correctIndex: 1, standardId: 'CCSS.ELA.1.L.1.e' },
    { id: 'q_e_s2', subject: 'ela', difficulty: 3, text: 'In the sentence "The giant lived in a massive castle," what does "massive" mean?', options: ['Small', 'Very big', 'Old'], correctIndex: 1, standardId: 'CCSS.ELA.3.L.4.a' },
    // Explorers (4-6)
    { id: 'q_e_e1', subject: 'ela', difficulty: 4, text: 'Which sentence is a complete sentence (not a fragment)?', options: ['Running down the street.', 'The dog barked loudly.', 'In the middle of the night.'], correctIndex: 1, standardId: 'CCSS.ELA.4.L.1.f' },
    { id: 'q_e_e2', subject: 'ela', difficulty: 5, text: 'Choose the correct prefix for "happy" to mean "not happy".', options: ['Pre-', 'Un-', 'Re-'], correctIndex: 1, standardId: 'CCSS.ELA.5.L.4.b' },
    // Builders (7-8)
    { id: 'q_e_b1', subject: 'ela', difficulty: 7, text: 'Which sentence uses the active voice?', options: ['The cake was eaten by the dog.', 'The dog ate the cake.', 'The dog was happy.'], correctIndex: 1, standardId: 'CCSS.ELA.8.L.1.b' },
    { id: 'q_e_b2', subject: 'ela', difficulty: 8, text: 'Which word best describes the tone of: "The storm clouds loomed like a dark shroud"?', options: ['Cheerful', 'Ominous', 'Informative'], correctIndex: 1, standardId: 'AP.ENGLISH.TONE' },
    // Architects (9-10)
    { id: 'q_e_a1', subject: 'ela', difficulty: 9, text: 'Which rhetorical device uses emotional appeal?', options: ['Logos', 'Ethos', 'Pathos'], correctIndex: 2, standardId: 'SAT.READING.RHETORIC' },
    { id: 'q_e_a2', subject: 'ela', difficulty: 10, text: 'What is parallel structure in writing?', options: ['Using the same pattern of words', 'Comparing two unrelated things', 'Ending with a question'], correctIndex: 0, standardId: 'SAT.WRITING.PARALLELISM' },
    // Voyagers (11-12)
    { id: 'q_e_v1', subject: 'ela', difficulty: 11, text: 'Analyze the sentiment: "Calculated indifference is the sharpest blade."', options: ['Apathy', 'Hostility', 'Optimism'], correctIndex: 1, standardId: 'AP.ENGLISH.TONE' },
    { id: 'q_e_v2', subject: 'ela', difficulty: 12, text: 'Which best defines a "Syllogism"?', options: ['A logical argument with two premises', 'A type of metaphor', 'A grammatical error'], correctIndex: 0, standardId: 'SAT.READING.RHETORIC' },

    // --- EXPANDED ELA (IRT VARIANCE) ---
    { id: 'q_e_irt_1', subject: 'ela', difficulty: 3, text: 'Which word is the subject in: "The clever fox jumped over the log"?', options: ['clever', 'fox', 'jumped'], correctIndex: 1, standardId: 'CCSS.ELA.4.L.1.f' },
    { id: 'q_e_irt_2', subject: 'ela', difficulty: 4, text: 'What is the root of the word "impossible"?', options: ['im-', 'possible', 'possi-'], correctIndex: 1, standardId: 'CCSS.ELA.5.L.4.b' },
    { id: 'q_e_irt_3', subject: 'ela', difficulty: 6, text: 'Choose the best transition word: "It was raining outside, ______ we stayed indoors."', options: ['however', 'therefore', 'although'], correctIndex: 1, standardId: 'CCSS.ELA.7.W.1' },
    { id: 'q_e_irt_4', subject: 'ela', difficulty: 7, text: 'Which sentence states a clear argumentative claim?', options: ['I like ice cream.', 'The city needs more parks to improve public health.', 'There are many trees in the forest.'], correctIndex: 1, standardId: 'CCSS.ELA.7.W.1' },
    { id: 'q_e_irt_5', subject: 'ela', difficulty: 8, text: '"The moon is a harsh mistress" is an example of what literary device?', options: ['Metaphor', 'Simile', 'Allegory'], correctIndex: 0, standardId: 'AP.ENGLISH.TONE' },

    // --- LOGIC ---
    // Sprouts (1-3)
    { id: 'q_l_s1', subject: 'logic', difficulty: 2, text: 'If a sequence is 2, 4, 6, 8... what is the next number?', options: ['9', '10', '12'], correctIndex: 1, standardId: 'LOGIC.SEQUENCE.1' },
    { id: 'q_l_s2', subject: 'logic', difficulty: 3, text: 'If you are facing North and turn right, which way are you facing?', options: ['East', 'West', 'South'], correctIndex: 0, standardId: 'logic.deduction' },
    // Explorers (4-6)
    { id: 'q_l_e1', subject: 'logic', difficulty: 5, text: 'If "All birds lay eggs" and "An eagle is a bird," what can you conclude?', options: ['All birds are eagles', 'Eagles lay eggs', 'Eggs are birds'], correctIndex: 1, standardId: 'LOGIC.DEDUCTION.1' },
    { id: 'q_l_e2', subject: 'logic', difficulty: 6, text: 'A man has 5 sons. Each son has 1 sister. How many children does the man have?', options: ['5', '6', '10'], correctIndex: 1, standardId: 'logic.trick' },
    // Builders (7-8)
    { id: 'q_l_b1', subject: 'logic', difficulty: 8, text: 'In logic gates, what is the output if Input A is 0 and Input B is 1 for an OR gate?', options: ['0', '1', 'Undefined'], correctIndex: 1, standardId: 'LOGIC.GATE.OR' },
    { id: 'q_l_b2', subject: 'logic', difficulty: 7, text: 'If P implies Q, and P is true, what is Q?', options: ['True', 'False', 'Unknown'], correctIndex: 0, standardId: 'LOGIC.DEDUCTION.1' },
    // Architects (9-10)
    { id: 'q_l_a1', subject: 'logic', difficulty: 9, text: 'Identify the fallacy: "You haven\'t proved it\'s false, so it must be true."', options: ['Strawman', 'Ad Hominem', 'Appeal to Ignorance'], correctIndex: 2, standardId: 'LOGIC.FALLACY.STRAWMAN' },
    { id: 'q_l_a2', subject: 'logic', difficulty: 10, text: 'If X=Y and Y=Z, then X=Z. This is known as what property?', options: ['Reflexive', 'Transitive', 'Symmetric'], correctIndex: 1, standardId: 'LOGIC.SYSTEMS.TRANSITIVE' },
    // Voyagers (11-12)
    { id: 'q_l_v1', subject: 'logic', difficulty: 11, text: 'If a currency loses 10% of its value, how much has the price of a fixed good effectively increased?', options: ['10%', '11.1%', '9%'], correctIndex: 1, standardId: 'HS.ECON.PF.1' },
    { id: 'q_l_v2', subject: 'logic', difficulty: 12, text: 'In a Zero-Sum game, if Player A wins 50 points, how many points does Player B lose?', options: ['0', '25', '50'], correctIndex: 2, standardId: 'logic.deduction' },

    // --- EXPANDED LOGIC (IRT VARIANCE) ---
    { id: 'q_l_irt_1', subject: 'logic', difficulty: 3, text: 'If A > B and B > C, which is the smallest?', options: ['A', 'B', 'C'], correctIndex: 2, standardId: 'LOGIC.SEQUENCE.1' },
    { id: 'q_l_irt_2', subject: 'logic', difficulty: 4, text: 'If it always rains on Tuesdays, and today is Tuesday, what must be true?', options: ['It will rain tomorrow', 'It is raining', 'It was sunny yesterday'], correctIndex: 1, standardId: 'logic.deduction' },
    { id: 'q_l_irt_3', subject: 'logic', difficulty: 5, text: 'In a sequential process (A -> B -> C), can Step C start if Step A fails?', options: ['Yes', 'No', 'Maybe'], correctIndex: 1, standardId: 'LOGIC.DEDUCTION.1' },
    { id: 'q_l_irt_4', subject: 'logic', difficulty: 7, text: 'If an AND logic gate has inputs 1 and 0, what is the output?', options: ['1', '0', 'Undefined'], correctIndex: 1, standardId: 'LOGIC.GATE.OR' },
    { id: 'q_l_irt_5', subject: 'logic', difficulty: 8, text: 'If a feedback loop reinforces its own behavior over time, what type of loop is it?', options: ['Negative', 'Positive', 'Neutral'], correctIndex: 1, standardId: 'LOGIC.SYSTEMS.TRANSITIVE' }
];
