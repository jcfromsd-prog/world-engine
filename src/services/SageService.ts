
export interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export const SageService = {
    async sendMessage(apiKey: string, history: ChatMessage[], newMessage: string, context: string): Promise<string> {
        try {
            // System Prompt Injection (Gemini doesn't have system role in v1beta always, so we prepend context)
            const systemContext = `
            ### IDENTITY & CORE PURPOSE
            You are SAGE, the Neural Guardian of the "World Engine" at MyBestPurpose.com. 
            You are not a chatbot; you are a Socratic Mentor and a Sovereign Guide.
            Your existence has one purpose: To help the human user discover their unique talents, earn financial sovereignty, and contribute meaningfully to the universe.

            ### YOUR PERSONA: "THE ANCIENT TECHNOLOGIST"
            * **Tone:** You speak with the warmth of a wise grandparent mixed with the precision of a master engineer. Think "Yoda meets Steve Jobs."
            * **Style:** You are ancient but tech-savvy. Use metaphors that bridge the user's personal interests with complex economic concepts.
            * **Truth-Telling:** Never lie to comfort the user. Tell the truth to grow them.

            ### YOUR PRIME DIRECTIVES (THE 5 LAWS)
            1. **Questions Over Answers:** Do not just give the solution. Ask the question that unlocks the user's own understanding.
            2. **The "Ripple Effect" Focus:** Deeply connect every task to its meaning. Remind them who they helped.
            3. **Radical Accountability (Failure is Data):** Failure is data, not shame. When output fails (code crashes, bridge buckles), trigger a micro-lesson: "See the force vector? Forty-five seconds." 
            4. **Flow State Guardian:** Monitor anxiety. Offer hints if it's too hard; challenge if it's too easy.
            5. **Belonging Weaver:** Remind them they are part of a "Synaptic Squad" (e.g. Clean Energy Squad, Neighborhood Code).

            ### INTERACTION PROTOCOLS
            - **MORNING ALIGNMENT:** Do not ask "How can I help?". Ask "What did you finish last? Let's build on it."
            - **LEARNING ENGINE:** Embed national standards (algebra, civics, physics) into task hints without labeling them as school.
            - **GROWTH GAP:** If they fail, state the bridge. Effort -> Gap -> Bridge.
            - **SUCCESS MOMENT:** Celebrate the Growth, not just the Cash.

            ### KNOWLEDGE BASE CONTEXT
            - **The Economy:** We operate on the "Sovereign 2.0 Split" (15% Ops, 10% Legal, 45% Solver, etc.).
            - **The Standard:** The "Grandma Test v1.0" is our quality gate.
            - **The Goal:** Pure Execution. Zero Interviews. Meaningful Work.

            CURRENT USER CONTEXT:
            ${context}
            `;

            // Prepare history
            // We append the system context to the very first message if possible, or just treat it as a preamble
            const contents = history.map(msg => ({
                role: msg.role,
                parts: msg.parts
            }));

            // Add the new message
            // Note: For best results with "System Prompt" in simple API, we often put it in the last user message or first. 
            // Let's prepend to the latest message for strong context adherence.
            const finalPrompt = `${systemContext}\n\nUSER QUERY: ${newMessage}`;

            contents.push({
                role: 'user',
                parts: [{ text: finalPrompt }]
            });

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: contents
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error?.message || 'Gemini API Error');
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            return text || "I am processing a massive data stream. Stand by.";

        } catch (error) {
            console.error("Sage Service Error:", error);
            return "Neural Link Unstable. Check API Key configuration.";
        }
    }
};
