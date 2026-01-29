import type { RevenueState, SquadMember } from './engine';

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

    private constructor() {
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

    private processInput(input: string) {
        const lower = input.toLowerCase();
        let response = "I am focusing on system optimization. Please clarify.";

        if (lower.includes('status') || lower.includes('report')) {
            response = "All systems operational. Velocity is stable. No critical alerts.";
        } else if (lower.includes('hello') || lower.includes('hi')) {
            response = "Awaiting your command, Founder.";
        } else if (lower.includes('money') || lower.includes('revenue')) {
            response = "Financial metrics are available in the Founder Dashboard (Ctrl+Shift+G).";
        }

        this.addMessage({
            id: Math.random().toString(36).substr(2, 9),
            text: response,
            sender: 'GUARDIAN',
            timestamp: Date.now()
        });
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
