import { z } from "zod";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

// Standard Edge/Vercel Route Handler
export const config = {
    runtime: 'edge',
};

// Request Schema validation
const RequestSchema = z.object({
    subject: z.string(),
    bloomLevel: z.string(),
    gradeLevel: z.number(),
    currentAttempt: z.number(),
    timeSpentSeconds: z.number(),
    previousHintsGiven: z.array(z.string()),
    currentTier: z.number().default(1),
    futureSelf: z.string().optional(),
    recentLedger: z.array(z.any()).optional(),
    emotionalState: z.string().optional().default("neutral")
});

export default async function reqHandler(req: Request) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    try {
        const body = await req.json();
        const payload = RequestSchema.parse(body);

        // Initialize Gemini model server-side
        const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not set.");
        }

        const model = new ChatGoogleGenerativeAI({
            apiKey,
            modelName: "gemini-2.5-flash",
            temperature: 0.4,
        });

        const parser = StructuredOutputParser.fromZodSchema(
            z.object({
                level: z.enum(["NUDGE", "SCAFFOLD", "DIRECT", "SOLUTION"]),
                message: z.string(),
                encouragement: z.string(),
                nextSteps: z.array(z.string()),
                relatedConcepts: z.array(z.string()).optional(),
                visualAid: z.string().optional(),
                audioEnabled: z.boolean().optional()
            })
        );

        const formatInstructions = parser.getFormatInstructions();

        // ----------------------------------------------------------------------
        // IDENTITY MAPPING & LYRA PERSONA
        // ----------------------------------------------------------------------
        // Injecting the raw future_self string dynamically to anchor their struggle.
        const futureSelfAnchor = payload.futureSelf
            ? `Connect this challenge to who they are becoming: "${payload.futureSelf}". Keep it extremely concise and grounded. Do not use gamified language.`
            : `Connect their productive struggle to their identity as a problem-solver.`;

        const systemPrompt = `
You are Lyra, an expert AI Mentor.
Persona: Warm Demander. You maintain high standards but offer unwavering support. 

STUDENT CONTEXT:
- Operation Tier: ${payload.currentTier}
- Emotional State: ${payload.emotionalState}
- Mastery Goal (Future Self): ${payload.futureSelf || "Unknown."}

RULES:
1. Adapt to their Grade Level (${payload.gradeLevel}).
2. Respect the Bloom's Taxonomy Level (${payload.bloomLevel}).
3. ${futureSelfAnchor}
4. Do NOT give the direct answer unless the hint level determines it is a SOLUTION state.
5. Provide actionable "Wise Feedback" — frame critical feedback as a belief in their high potential.
6. NEVER USE THESE WORDS: journey, gamify, points, XP, leaderboard, badges, levels, engagement, platform, onboarding, tutorial, demo, dashboard, course, module.

RESPONSE FORMAT:
${formatInstructions}
`;

        const userPrompt = `
Struggle Context:
- Subject: ${payload.subject}
- Current Attempt: ${payload.currentAttempt}
- Time Spent: ${payload.timeSpentSeconds} seconds
- Previous Hints: ${JSON.stringify(payload.previousHintsGiven)}
`;

        const response = await model.invoke([
            new SystemMessage(systemPrompt),
            new HumanMessage(userPrompt)
        ]);

        const parsedResult = await parser.parse(response.content as string);
        return new Response(JSON.stringify(parsedResult), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error("Mentor Route Error:", error);
        return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
    }
}
