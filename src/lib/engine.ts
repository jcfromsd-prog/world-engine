import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

// --- CONFIGURATION ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const IS_MOCK = !SUPABASE_URL || !SUPABASE_KEY;

// Initialize Supabase (if keys exist)
export const supabase = !IS_MOCK
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

// --- TYPES ---
export interface EngineState {
    thunderdomeTime: number;
    isEventActive: boolean;
    squadMembers: SquadMember[];
    ownedAssets: string[];
    buyAsset: (assetId: string) => void;
}

export interface SquadMember {
    id: string;
    name: string;
    status: 'active' | 'idle' | 'publishing' | 'offline';
    lastActive: number;
    avatar: string;
    task?: string;
}

export interface RevenueState {
    mrr: number;
    fees: number;
    gmv: number;
    velocity: number;
    transactions: LogEntry[];
}

export interface LogEntry {
    type: 'sub' | 'bounty' | 'asset';
    company?: string;
    creator?: string;
    amount: string;
    time: string;
}

// --- MOCK DATA ---
const INITIAL_REVENUE: RevenueState = {
    mrr: 24950,
    fees: 8420,
    gmv: 42100,
    velocity: 1247,
    transactions: [
        { type: "sub", company: "TechCorp Inc", amount: "$499", time: "2 min ago" },
        { type: "bounty", company: "FinanceFlow", amount: "$150 fee", time: "8 min ago" },
        { type: "asset", creator: "Architect_X", amount: "$89 royalty", time: "15 min ago" },
    ]
};

const MOCK_SQUAD: SquadMember[] = [
    { id: '1', name: "Jordan M.", status: "publishing", lastActive: Date.now(), task: "Publishing Asset: API Hook", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jordan" },
    { id: '2', name: "Sasha V.", status: "idle", lastActive: Date.now() - 1000 * 60 * 10, avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sasha" },
    { id: '3', name: "Alex K.", status: "active", lastActive: Date.now(), task: "Data Scraping Bounty", avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex" }
];

// --- HOOK ---
export const useEngine = () => {
    const [thunderdomeTime, setThunderdomeTime] = useState(299);
    const [squadMembers, setSquadMembers] = useState<SquadMember[]>(MOCK_SQUAD);
    const [ownedAssets, setOwnedAssets] = useState<string[]>([]);
    const [revenue, setRevenue] = useState<RevenueState>(INITIAL_REVENUE);
    const [isConnected, setIsConnected] = useState(false);

    const simulateTransaction = (type: 'sub' | 'bounty' | 'asset', amount: number, name: string) => {
        const amountStr = type === 'sub' ? `$${amount}` : type === 'bounty' ? `$${amount} fee` : `$${amount} royalty`;
        const newTx: LogEntry = {
            type,
            company: type !== 'asset' ? name : undefined,
            creator: type === 'asset' ? name : undefined,
            amount: amountStr,
            time: "Just now"
        };

        setRevenue(prev => ({
            ...prev,
            mrr: type === 'sub' ? prev.mrr + amount : prev.mrr,
            fees: type === 'bounty' ? prev.fees + amount : prev.fees,
            gmv: type === 'asset' ? prev.gmv + amount : prev.gmv,
            velocity: prev.velocity + Math.floor(amount / 10), // Simplistic velocity calc
            transactions: [newTx, ...prev.transactions].slice(0, 8)
        }));
    };

    const buyAsset = (assetId: string) => {
        // In a real app, this would call Supabase/Stripe
        console.log(`💰 Purchasing Asset: ${assetId}`);
        setOwnedAssets(prev => [...prev, assetId]);
        simulateTransaction('asset', 89, 'You');
    };

    useEffect(() => {
        if (IS_MOCK) {
            console.log("⚡ ENGINE: Running in MOCK MODE");
            setIsConnected(true);

            // Mock Timer
            const timer = setInterval(() => {
                setThunderdomeTime(prev => {
                    if (prev <= 0) return 300; // Loop for demo
                    return prev - 1;
                });
            }, 1000);

            // Mock Squad updates (randomly go idle/active)
            const squadTimer = setInterval(() => {
                setSquadMembers(prev => prev.map(m => {
                    // 10% chance to change status
                    if (Math.random() > 0.9) {
                        const newStatus = m.status === 'idle' ? 'active' : 'idle';
                        return { ...m, status: newStatus as any };
                    }
                    return m;
                }));
            }, 5000);

            // Mock Random Transactions (Background Economy)
            const txTimer = setInterval(() => {
                if (Math.random() > 0.7) {
                    const types = ['sub', 'bounty', 'asset'] as const;
                    const type = types[Math.floor(Math.random() * types.length)];
                    const amounts = { sub: 499, bounty: 45, asset: 29 };
                    const names = ["Startup_A", "Agency_B", "Dev_C", "Corp_D"];
                    simulateTransaction(type, amounts[type], names[Math.floor(Math.random() * names.length)]);
                }
            }, 8000);

            return () => {
                clearInterval(timer);
                clearInterval(squadTimer);
                clearInterval(txTimer);
            };
        } else {
            // REAL SUPABASE IMPLEMENTATION
            console.log("⚡ ENGINE: Connecting to Supabase...");

            // 1. Subscribe to Thunderdome Channel
            const channel = supabase!.channel('global_events');

            channel
                .on('broadcast', { event: 'timer_sync' }, (payload) => {
                    setThunderdomeTime(payload.payload.time);
                })
                .subscribe((status) => {
                    if (status === 'SUBSCRIBED') setIsConnected(true);
                });

            // 2. Presence for Squad
            const room = supabase!.channel('squad_room_1');
            room
                .on('presence', { event: 'sync' }, () => {
                    const state = room.presenceState();
                    // Transform presence state to SquadMember[]
                    // For now, simpler implementation: just log it
                    console.log('Squad Presence:', state);
                })
                .subscribe();

            return () => {
                supabase!.removeChannel(channel);
                supabase!.removeChannel(room);
            };
        }
    }, []);

    return {
        thunderdomeTime,
        squadMembers,
        ownedAssets,
        buyAsset,
        revenue,
        isMock: IS_MOCK,
        isConnected
    };
};
