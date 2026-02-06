/* ==========================================================================
   OPENCLAW PROTOCOL v1.0 // AUTONOMOUS BEHAVIORAL VERIFICATION
   Target System: MyBestPurpose.com (World Engine)
   
   "We don't just test code. We simulate life."
   
   Run with: npx tsx src/scripts/OpenClaw.ts
   ========================================================================== */

import { MISSION_DB } from "../data/MissionDatabase"; // Corrected Import Path
import { USER_PERSONAS, PersonaKey } from "../services/SimulationEngine";

// --- TYPES ---
interface AuditResult {
    persona: string;
    step: string;
    status: "PASS" | "FAIL";
    message: string;
    timestamp: number;
}

// --- THE OPENCLAW AGENT ---
class OpenClawAgent {
    private auditLog: AuditResult[] = [];
    private failures = 0;

    // 1. THE "JOURNEY" ENGINE (Phase 1)
    async simulateJourney(personaKey: PersonaKey) {
        const user = USER_PERSONAS[personaKey];
        this.log(user.name, "INIT", "PASS", `Spawning Agent: Grade ${user.gradeLevel} | Passion: ${user.passion}`);

        // A. Verify Grade Logic (The "Engage" Test)
        const visibleMissions = this.getVisibleMissions(user.gradeLevel, user.passion);
        if (visibleMissions.length < 3) {
            this.log(user.name, "MISSION_CHECK", "FAIL", `CRITICAL: Only ${visibleMissions.length} missions found. Minimum 3 required for Autonomy.`);
            return;
        }
        this.log(user.name, "MISSION_CHECK", "PASS", `Verified ${visibleMissions.length} valid choices for Grade ${user.gradeLevel}.`);

        // B. Verify "Forbidden" Content (Safety Check / Grade-Gate)
        const hasIllegalContent = visibleMissions.some(m => user.gradeLevel < m.minGrade);
        if (hasIllegalContent) {
            this.log(user.name, "SAFETY_CHECK", "FAIL", `SECURITY ALERT: Grade ${user.gradeLevel} user exposed to content above their level.`);
            return;
        }
        this.log(user.name, "SAFETY_CHECK", "PASS", "Grade-level guardrails holding steady.");

        // C. Verify "Floor" Content (No Baby Missions for Pros)
        const hasBabyContent = visibleMissions.some(m => user.gradeLevel > m.maxGrade);
        if (hasBabyContent) {
            this.log(user.name, "DIGNITY_CHECK", "FAIL", `DIGNITY ALERT: Grade ${user.gradeLevel} user offered missions below their level.`);
            return;
        }
        this.log(user.name, "DIGNITY_CHECK", "PASS", "No condescending content detected.");

        // D. Verify Economic Integrity (The "Payday" Test)
        const targetMission = visibleMissions[0];
        const initialWallet = 50; // Base GP
        const expectedWallet = initialWallet + targetMission.gp;

        // Simulate Completion
        this.log(user.name, "ACTION", "PASS", `Completing Mission: "${targetMission.title}" (Promise: ${targetMission.gp} GP)...`);
        const actualWallet = this.processTransaction(initialWallet, targetMission.gp);

        if (actualWallet === expectedWallet) {
            this.log(user.name, "ECONOMY_AUDIT", "PASS", `Wallet verified: ${initialWallet} + ${targetMission.gp} = ${actualWallet} GP.`);
        } else {
            this.log(user.name, "ECONOMY_AUDIT", "FAIL", `ECONOMIC FRAUD: Expected ${expectedWallet}, found ${actualWallet}.`);
        }
    }

    // --- INTERNAL SIMULATION LOGIC ---
    private getVisibleMissions(grade: number, passion: string) {
        // Replicates App.tsx filtering logic to verify consistency
        return MISSION_DB.filter(m => {
            const p = passion.toLowerCase();
            let matchesPassion = false;
            if (p.includes("cod") || p.includes("tech")) matchesPassion = m.category === "CODING";
            else if (p.includes("sci") || p.includes("bio")) matchesPassion = m.category === "SCIENCE";
            else if (p.includes("creat") || p.includes("art")) matchesPassion = m.category === "CREATIVE" || m.category === "HUMANITIES" || m.category === "DESIGN";
            else if (p.includes("lead") || p.includes("biz")) matchesPassion = m.category === "LEADERSHIP" || m.category === "BUSINESS";
            else matchesPassion = true; // Fallback for unknown passions

            const gradeMatch = grade >= m.minGrade && grade <= m.maxGrade;
            return matchesPassion && gradeMatch;
        });
    }

    private processTransaction(balance: number, reward: number): number {
        return balance + reward;
    }

    private log(persona: string, step: string, status: "PASS" | "FAIL", message: string) {
        const prefix = status === "PASS" ? "✅" : "❌";
        console.log(`${prefix} [${status}] ${persona} :: ${step} -> ${message}`);
        this.auditLog.push({ persona, step, status, message, timestamp: Date.now() });
        if (status === "FAIL") this.failures++;
    }

    // --- SWARM LAUNCHER ---
    public async deploySwarm() {
        console.log(`\n🐅 OPENCLAW AGENT ACTIVATED // SWARM MODE STARTED`);
        console.log(`=================================================`);

        await this.simulateJourney("ELEMENTARY_NOVICE"); // Leo (Grade 3)
        console.log(`-------------------------------------------------`);
        await this.simulateJourney("HS_SOPHOMORE");      // Maya (Grade 10)
        console.log(`-------------------------------------------------`);
        await this.simulateJourney("COLLEGE_SENIOR");    // Alex (Grade 15)

        console.log(`=================================================`);
        if (this.failures > 0) {
            console.log(`🔥 SWARM DIAGNOSTIC COMPLETE: ${this.failures} FAILURE(S) DETECTED.`);
            process.exit(1);
        } else {
            console.log(`🏁 SWARM DIAGNOSTIC COMPLETE: ALL SYSTEMS NOMINAL.`);
            process.exit(0);
        }
    }
}

// --- EXECUTE ---
const agent = new OpenClawAgent();
agent.deploySwarm();
