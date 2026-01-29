import type { RevenueState, SquadMember } from './engine';
import { chat } from './ai';
import { getWallet, getBounties, type Bounty } from './supabase';
import { supabase } from './supabase';

export interface GuardianMessage {
    id: string;
    text: string;
    sender: 'GUARDIAN' | 'USER' | 'SYSTEM';
    timestamp: number;
    type?: 'alert' | 'insight' | 'normal';
}

const INSIGHT_TEMPLATES = [
    "Captain, I've detected a {velocity}% increase in operational velocity.",
    "Treasury thresholds are holding stable. Shall we allocate more capital to the Squad?",
    "Reviewing Squad Protocol... {idleCount} units are currently idle. Inefficiency detected.",
    "New Asset acquired. Integrating into the Engine core.",
    "System diagnostics indicate optimal performance. We are ready for expansion."
];

export class Guardian {
    private static instance: Guardian;
    private messages: GuardianMessage[] = [];
    private subscribers: ((messages: GuardianMessage[]) => void)[] = [];
    private userId: string | null = null; // Store userId for context

    private constructor() {
        // Listen for auth state to know who we are serving
        supabase.auth.onAuthStateChange((_event, session) => {
            this.userId = session?.user?.id || null;
        });

        this.addMessage({
            id: 'init',
            text: "NEURAL LINK ESTABLISHED. WAITING FOR INPUT...",
            sender: 'SYSTEM',
            timestamp: Date.now(),
            type: 'alert'
        });

        // Initial Greeting
        setTimeout(() => {
            this.addMessage({
                id: 'greet',
                text: "Greetings, Founder. I am the Engine Guardian. Systems are online.",
                sender: 'GUARDIAN',
                timestamp: Date.now()
            });
        }, 1000);
    }

    public static getInstance(): Guardian {
        if (!Guardian.instance) {
            Guardian.instance = new Guardian();
        }
        return Guardian.instance;
    }

    public getMessages(): GuardianMessage[] {
        return [...this.messages];
    }

    public subscribe(callback: (messages: GuardianMessage[]) => void): () => void {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    private notify() {
        this.subscribers.forEach(cb => cb([...this.messages]));
    }

    private addMessage(msg: GuardianMessage) {
        this.messages = [...this.messages, msg];
        this.notify();
    }

    public sendMessage(text: string) {
        this.addMessage({
            id: Math.random().toString(36).substr(2, 9),
            text,
            sender: 'USER',
            timestamp: Date.now()
        });

        // Simple mock response logic for now
        setTimeout(() => {
            this.processInput(text);
        }, 800 + Math.random() * 1000); // Simulate "thinking"
    }

    private async processInput(input: string) {
        // 1. Show thinking state (optional, but good UX)
        // this.addMessage({ id: 'thinking', text: '...', sender: 'GUARDIAN', timestamp: Date.now() });

        try {
            // 2. Build Context
            const context = await this.buildContext();

            // 3. Get AI Response
            const responseText = await chat(
                "You are the Engine Guardian, a highly advanced AI governing the 'World Engine' platform. Your tone is professional, slightly cryptic, but extremely helpful. You speak in concise, efficient sentences.",
                input,
                context,
                this.messages.map(m => ({
                    role: m.sender === 'USER' ? 'user' : 'assistant',
                    content: m.text
                }))
            );

            // 4. Send Response
            this.addMessage({
                id: Math.random().toString(36).substr(2, 9),
                text: responseText,
                sender: 'GUARDIAN',
                timestamp: Date.now()
            });

        } catch (err) {
            console.error(err);
            this.addMessage({
                id: Math.random().toString(36).substr(2, 9),
                text: "Error: Neural Link stability compromised. Unable to process.",
                sender: 'GUARDIAN',
                timestamp: Date.now(),
                type: 'alert'
            });
        }
    }

    private async buildContext() {
        let balance = 0;
        let bounties: Bounty[] = [];
        let username = 'Founder';

        if (this.userId) {
            try {
                // Parallel fetch
                const [walletData, bountiesData] = await Promise.all([
                    getWallet(this.userId),
                    getBounties()
                ]);

                if (walletData) balance = walletData.balance;
                if (bountiesData) bounties = bountiesData as Bounty[];

                // Get username from session/profile if needed, for now 'Founder' is fine or we fetch profile
                // but let's keep it fast.
            } catch (e) {
                console.error("Context fetch failed", e);
            }
        }

        return {
            balance,
            bounties,
            username
        };
    }

    // --- PROACTIVE LOGIC ---
    public analyzeState(revenue: RevenueState, squad: SquadMember[]) {
        // 1. Check for high velocity
        if (revenue.velocity > 2000 && Math.random() > 0.95) {
            const template = INSIGHT_TEMPLATES[0].replace('{velocity}', Math.floor((revenue.velocity - 1247) / 12.47).toString());
            this.addMessage({
                id: Math.random().toString(36).substr(2, 9),
                text: template,
                sender: 'GUARDIAN',
                timestamp: Date.now(),
                type: 'insight'
            });
        }

        // 2. Check for Idle Squad
        const idleCount = squad.filter(m => m.status === 'idle').length;
        if (idleCount > 1 && Math.random() > 0.95) {
            const template = INSIGHT_TEMPLATES[2].replace('{idleCount}', idleCount.toString());
            this.addMessage({
                id: Math.random().toString(36).substr(2, 9),
                text: template,
                sender: 'GUARDIAN',
                timestamp: Date.now(),
                type: 'alert'
            });
        }
    }
}

export const guardian = Guardian.getInstance();
