
// --- THE GHOST CLASS SIMULATION ENGINE ---
// CONCEPT: Spawns virtual users (Personas) to test the Pedagogical Loop.

export interface AgentPersona {
    id: string;
    name: string;
    role: "STRUGGLING" | "PRODIGY" | "CHAOS";
    gradeLevel: number;
}

export interface SimulationResult {
    agentId: string;
    missionId: string;
    input: string;
    expectedOutcome: "REJECT" | "ACCEPT";
    actualOutcome: "REJECT" | "ACCEPT" | "ERROR";
    feedback?: string;
    timestamp: string;
}

// MOCKED for now - In a real implementation this would hook into the App's state or run in a headless browser
export class GhostClassEngine {
    /*
     * spawns a virtual user session
     */
    static runSimulation(agent: AgentPersona, missionId: string): SimulationResult {
        const timestamp = new Date().toISOString();
        let input = "";
        let expected: "REJECT" | "ACCEPT" = "REJECT";

        // 1. SIMULATE BEHAVIOR
        if (agent.role === "STRUGGLING") {
            input = "It is a hero."; // Too short
            expected = "REJECT";
        } else if (agent.role === "PRODIGY") {
            input = "My hero is named Blaze. He was born in the heart of a volcano and can control fire with his mind."; // Good
            expected = "ACCEPT";
        } else if (agent.role === "CHAOS") {
            input = "sdlkfj sldkfj sldkfj sldkfj"; // Gibberish but long enough? Maybe rejected for keywords.
            expected = "REJECT"; // Assuming keyword check fails
        }

        // 2. SIMULATE SYSTEM RESPONSE (Mirrors 'MissionWorkspace' Logic)
        // We duplicate the logic here for the simulation to verify the *Code's Intent* vs *Actual Outcome*
        // Ideally, this runs against the actual function, but for a lightweight sim, we mock the grader.

        // Grader Logic Mirror:
        let score = 0;
        if (input.length > 20) score += 30;
        if (input.length > 50) score += 30;
        // Keyword check simplified for simulation (assuming "hero" mission)
        const lower = input.toLowerCase();
        if (lower.includes('hero') || lower.includes('fire') || lower.includes('blaze')) score += 40;

        const actual: "REJECT" | "ACCEPT" = score >= 50 ? "ACCEPT" : "REJECT";

        return {
            agentId: agent.name,
            missionId,
            input,
            expectedOutcome: expected,
            actualOutcome: actual,
            feedback: actual === "REJECT" ? "Coach: Add more detail..." : "Legendary!",
            timestamp
        };
    }

    /*
     * Runs the full suite of agents
     */
    static runSwarm(): SimulationResult[] {
        const agents: AgentPersona[] = [
            { id: "1", name: "Timmy (Try-Hard)", role: "STRUGGLING", gradeLevel: 3 },
            { id: "2", name: "Sarah (Prodigy)", role: "PRODIGY", gradeLevel: 8 },
            { id: "3", name: "Joker (Chaos)", role: "CHAOS", gradeLevel: 5 },
        ];

        return agents.map(agent => this.runSimulation(agent, "CRE.K5.01"));
    }
}
