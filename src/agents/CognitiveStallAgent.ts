/**
 * CognitiveStallAgent
 * Backend agent that detects when users have stalled in their learning journey
 * and inserts micro-interventions to re-engage them.
 * 
 * NOTE: This is a backend-only module requiring Neo4j and node-fetch.
 * It should NOT be imported in frontend code.
 */

// Backend dependencies not available in frontend build context
import type { Driver, Session } from "neo4j-driver";

// Configuration
const STALL_THRESHOLD_HOURS = 48;
const API_ENDPOINT = process.env.INTERVENTION_API_URL || "https://api.mybestpurpose.com/interventions";

export interface UserProgress {
    userId: string;
    progress: { contentId: string; timestamp: number }[];
}

export interface InterventionPayload {
    userId: string;
    type: "micro-intervention" | "peer-challenge" | "mentor-nudge";
    content: {
        title: string;
        url?: string;
        rewardPoints: number;
    };
}

export class CognitiveStallAgent {
    private driver: Driver;
    private stallThresholdMs: number;

    constructor(driver: Driver, stallThresholdHours = STALL_THRESHOLD_HOURS) {
        this.driver = driver;
        this.stallThresholdMs = stallThresholdHours * 60 * 60 * 1000;
    }

    /**
     * Crawl Neo4j graph to get user progress data
     */
    async crawlUserPaths(): Promise<UserProgress[]> {
        const session: Session = this.driver.session();
        try {
            const result = await session.run(`
        MATCH (u:User)-[r:COMPLETED]->(c:Content)
        RETURN u.id AS userId, collect({contentId: c.id, timestamp: r.timestamp}) AS progress
        ORDER BY u.id
      `);
            return result.records.map((record) => ({
                userId: record.get("userId") as string,
                progress: record.get("progress") as { contentId: string; timestamp: number }[],
            }));
        } finally {
            await session.close();
        }
    }

    /**
     * Detect if a user has stalled based on their last activity
     */
    detectStall(progress: { contentId: string; timestamp: number }[]): boolean {
        if (!progress || progress.length === 0) return true;

        // Find the most recent timestamp
        const lastTimestamp = Math.max(...progress.map((p) => p.timestamp));
        const timeSinceLastActivity = Date.now() - lastTimestamp;

        return timeSinceLastActivity > this.stallThresholdMs;
    }

    /**
     * Insert a micro-intervention for a stalled user
     */
    async insertIntervention(userId: string): Promise<void> {
        const payload: InterventionPayload = {
            userId,
            type: "micro-intervention",
            content: {
                title: "Quick Review Video",
                url: "https://example.com/video-explainer.mp4",
                rewardPoints: 10,
            },
        };

        try {
            // Dynamic import for node-fetch (ESM)
            const { default: fetch } = await import("node-fetch");

            const response = await fetch(API_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }

            console.log(`[CognitiveStallAgent] Inserted intervention for user ${userId}`);
        } catch (error) {
            console.error(`[CognitiveStallAgent] Failed to insert intervention for ${userId}:`, error);
            throw error;
        }
    }

    /**
     * Main analysis loop - crawl users and insert interventions for stalled ones
     */
    async analyzeAndInsertInterventions(): Promise<{ processed: number; interventions: number }> {
        const userPaths = await this.crawlUserPaths();
        let interventionCount = 0;

        for (const user of userPaths) {
            if (this.detectStall(user.progress)) {
                try {
                    await this.insertIntervention(user.userId);
                    interventionCount++;
                } catch {
                    // Continue processing other users even if one fails
                }
            }
        }

        console.log(`[CognitiveStallAgent] Processed ${userPaths.length} users, inserted ${interventionCount} interventions`);
        return { processed: userPaths.length, interventions: interventionCount };
    }
}
