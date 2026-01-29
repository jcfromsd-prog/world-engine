import type { Bounty } from './supabase';
import { supabase } from './supabase';

interface AIContext {
    balance: number;
    bounties: Bounty[];
    username: string;
    reputation: number;
    bio: string;
}

export async function chat(systemPrompt: string, userMessage: string, context: AIContext, history: { role: 'user' | 'assistant', content: string }[] = []) {
    // Try Edge Function first (production), fall back to mock (local dev)
    try {
        const { data, error } = await supabase.functions.invoke('chat', {
            body: { systemPrompt, userMessage, history }
        });

        if (error) throw error;
        if (data?.content) return data.content;

        // If edge function didn't return content, use mock
        return await mockAI(userMessage, context);
    } catch {
        // Edge function not available (local dev or not deployed), use mock
        return await mockAI(userMessage, context);
    }
}

// Smart Mock Logic
async function mockAI(input: string, context: AIContext) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const lower = input.toLowerCase();

    if (lower.includes('money') || lower.includes('balance') || lower.includes('fund')) {
        return `Current Treasury Status: $${context.balance.toLocaleString()}. Capital deployment is ready at your command, ${context.username}.`;
    }

    if (lower.includes('bounty') || lower.includes('job') || lower.includes('work')) {
        const easy = context.bounties.find(b => b.difficulty === 'Easy');
        const count = context.bounties.length;

        let response = `I have access to ${count} active signals on the Global Feed.`;
        if (easy) {
            response += `\n\nRecommendation: "${easy.title}" matches your current velocity profile. Reward: ${easy.reward}.`;
        }
        return response;
    }

    if (lower.includes('status') || lower.includes('report')) {
        return `Systems Nominal.\n- Identity: ${context.username} (Rep: ${context.reputation})\n- Ledger: Active\n- Context: Local Simulation Mode`;
    }

    if (lower.includes('who are you')) {
        if (context.reputation < 50) {
            return `I am the Engine Guardian. I see you are new here, ${context.username}. I exist to guide you to your first victory.`;
        }
        return "I am the Engine Guardian. We have accomplished much together, Founder. I am at your disposal.";
    }

    // Default cryptic response
    const defaults = [
        "The Engine listens.",
        "Input received. Analyzing potential vectors...",
        "I am here, Founder. What is your directive?",
        "The pattern is clear. Proceed."
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
}
