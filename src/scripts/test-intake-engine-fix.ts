import { IntakeEngine } from '../engines/intake/IntakeEngine';

async function runTests() {
    const testSessions = [
        { label: 'Sprouts (grade 2 input)', grade: 2 },
        { label: 'Trailblazers (grade 7 input)', grade: 7 },
        { label: 'Pioneers (grade 10 input)', grade: 10 },
    ];

    for (const session of testSessions) {
        const engine = new IntakeEngine(session.grade);
        const question = engine.getNextQuestion();
        console.log(`\n--- Test Session: ${session.label} ---`);
        console.log(`First Question Served:`);
        console.log(`  ID: ${question?.id}`);
        console.log(`  Difficulty Level: ${question?.difficulty}`);
        console.log(`  Question Text: "${question?.text}"`);
    }
}

runTests();
