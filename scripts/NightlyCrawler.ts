import { Neo4jService } from '../src/services/Neo4jService';
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import * as dotenv from 'dotenv';
import neo4j from 'neo4j-driver';

dotenv.config();

const URI = process.env.VITE_NEO4J_URI || 'bolt://localhost:7687';
const USER = process.env.VITE_NEO4J_USER || 'neo4j';
const PASSWORD = process.env.VITE_NEO4J_PASSWORD || 'password';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'sk-placeholder';

const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

async function runNightlyCrawler() {
    console.log("🚀 Starting Nightly Crawler: Meta-Agent Analysis...");
    const session = driver.session();

    try {
        // 1. Find Stalled Users (Competence < 30 OR haven't completed a mission in a while)
        // For this demo, we'll just look at Competence < 30
        const result = await session.executeRead(tx =>
            tx.run(
                `MATCH (u:User) 
                 WHERE u.competence < 30 
                 RETURN u.id AS id, u.name AS name, u.passion AS passion, u.role AS role, u.competence AS competence`
            )
        );

        if (result.records.length === 0) {
            console.log("✅ No stalled users found. System optimal.");
            return;
        }

        const llm = new OpenAI({
            openAIApiKey: OPENAI_API_KEY,
            temperature: 0.7,
        });

        const prompt = PromptTemplate.fromTemplate(
            "SYSTEM: You are the World Engine Meta-Agent. Your goal is to unblock stagnant users.\n" +
            "USER PROFILE:\n" +
            "- Name: {name}\n" +
            "- Passion: {passion}\n" +
            "- Role: {role}\n" +
            "- Competence Score: {competence}%\n\n" +
            "STRATEGY: This user is stuck. Generate a 3-minute 'Micro-Intervention' mission title and description to boost their competence.\n" +
            "Format the output as JSON: {{\"title\": \"...\", \"description\": \"...\", \"reward\": 50}}"
        );

        for (const record of result.records) {
            const user = {
                id: record.get('id'),
                name: record.get('name'),
                passion: record.get('passion'),
                role: record.get('role'),
                competence: record.get('competence')
            };

            console.log(`🤖 Analyzing User: ${user.name} (Competence: ${user.competence}%)`);

            const formattedPrompt = await prompt.format(user);
            const response = await llm.invoke(formattedPrompt);

            try {
                // LLM output might need cleanup depending on model response
                const intervention = JSON.parse(response.trim());

                // 2. Write Intervention to Database
                const missionId = `intervention_${Date.now()}`;
                await session.executeWrite(tx =>
                    tx.run(
                        `MATCH (u:User {id: $userId})
                         MERGE (m:Mission {id: $missionId})
                         SET m.title = $title,
                             m.description = $description,
                             m.reward = $reward,
                             m.type = "Intervention",
                             m.createdAt = timestamp()
                         MERGE (u)-[:RECOMMENDED]->(m)
                         RETURN m`,
                        {
                            userId: user.id,
                            missionId,
                            title: intervention.title,
                            description: intervention.description,
                            reward: intervention.reward
                        }
                    )
                );
                console.log(`✨ Created Special Ops Mission for ${user.name}: ${intervention.title}`);
            } catch (e) {
                console.error(`❌ Failed to parse or save intervention for ${user.name}`, e);
            }
        }

    } catch (error) {
        console.error("❌ Crawler Error:", error);
    } finally {
        await session.close();
        await driver.close();
        console.log("🏁 Nightly Crawler Finished.");
    }
}

runNightlyCrawler();
