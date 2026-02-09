
import { WorldEngine } from '../engines/world-engine/WorldEngine';
import { LearnerProfile, SubjectDomain, GradeLevel } from '../engines/world-engine/LearnerModel';
import { SEED_GRAPH } from '../engines/world-engine/KnowledgeGraph';

// 1. Create a dummy Test Learner (Grade 1)
const testProfile: LearnerProfile = {
    id: "test-user-001",
    name: "Alex",
    currentGrade: 1,
    masteryMap: new Map(),
    domainLevels: {
        literacy: 1.0,
        numeracy: 1.0,
        science: 1.0,
        social: 1.0,
        sel: 1.0,
        career: 1.0
    },
    cognitiveState: {
        focusLevel: 80,
        frustrationLevel: 10,
        energyLevel: 90,
        currentZPD: 0.1
    },
    interests: ["Space", "Dinosaurs"],
    learningStyle: 'visual',
    goals: ["Become an Astronaut"]
};

// 2. Initialize the Engine
console.log("-----------------------------------------");
console.log("       WORLD ENGINE LOGIC TEST           ");
console.log("-----------------------------------------");

const engine = new WorldEngine(testProfile, SEED_GRAPH);

// 3. Check Initial Recommendations
console.log("\n[STEP 1] Initial State:");
let options = engine.getNextTaskOptions();
console.log("Recommended Tasks:", options.map(Node => Node.title));

// 4. Simulate Completing 'Counting to 100' (Prerequisite for Addition)
const countingTask = options.find(n => n.id === "math.g1.number_sense.counting_100");

if (countingTask) {
    console.log(`\n[STEP 2] Completing task: ${countingTask.title}...`);
    // User succeeds!
    engine.submitTask(countingTask.id, true, 300); // 300 seconds

    // Verify Mastery Update
    const mastery = engine.getProfile().masteryMap.get(countingTask.id);
    console.log(`Mastery for ${countingTask.id}: ${mastery?.masteryScore.toFixed(2)} (Expected > 0)`);
} else {
    console.error("ERROR: Expected 'Counting to 100' to be available initially.");
}


// 5. Check Recommendations AFTER Completion
// Should see 'Simple Addition' unlocked now
console.log("\n[STEP 3] State After Completion:");
options = engine.getNextTaskOptions();
console.log("Recommended Tasks:", options.map(Node => Node.title));

const additionTask = options.find(n => n.id === "math.g1.addition.single_digit");
if (additionTask) {
    console.log("SUCCESS: 'Simple Addition' was correctly unlocked!");
} else {
    console.log("NOTE: 'Simple Addition' might not be unlocked if mastery threshold wasn't met or randomization prioritized other tasks.");
}

console.log("\n-----------------------------------------");
console.log("       TEST COMPLETE                     ");
console.log("-----------------------------------------");
