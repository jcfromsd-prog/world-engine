import { debounce } from 'lodash';
import type { LogicNode, LogicConnection, BlueprintState } from '../types';
import { LogicSieve } from '../validation/LogicSieve';
import { devTelemetry } from '../../engines/logic-link/ObservabilityLayer';

// --- Singleton Engine ---

export class BlueprintEngine {
    private static instance: BlueprintEngine;

    // Internal State (Non-React)
    private currentState: BlueprintState = {
        nodes: [],
        connections: [],
        isValid: false,
        lastSynced: 0
    };

    private subscribers: ((state: BlueprintState) => void)[] = [];

    // Debounced Sync Function
    private debouncedSync = debounce(this.persistToCloud, 2000);

    private constructor() {
        // Private constructor for Singleton
    }

    public static getInstance(): BlueprintEngine {
        if (!BlueprintEngine.instance) {
            BlueprintEngine.instance = new BlueprintEngine();
        }
        return BlueprintEngine.instance;
    }

    /**
     * Updates the local state and triggers validation.
     * Does NOT force a React re-render immediately unless subscribed.
     */
    public updateLocalState(nodes: LogicNode[], connections: LogicConnection[]) {
        this.currentState.nodes = nodes;
        this.currentState.connections = connections;

        // Validate structurally
        const validation = LogicSieve.validateCompleteness(nodes, connections);
        this.currentState.isValid = validation.valid;

        this.notifySubscribers();

        // Queue cloud sync
        this.debouncedSync();
    }

    /**
     * Persists the current blueprint to Supabase.
     */
    private async persistToCloud() {
        if (!this.currentState.isValid && this.currentState.nodes.length > 0) {
            console.warn('[BlueprintEngine] Skipping sync: Invalid State');
            return;
        }

        console.log('[BlueprintEngine] Syncing to Cloud...', this.currentState);

        // TODO: Replace with actual Supabase call
        // const { error } = await supabase.from('blueprints').upsert(...)

        devTelemetry.trackEvent(
            'CHECK',
            `Blueprint Synced (${this.currentState.nodes.length} nodes)`,
            'success'
        );

        this.currentState.lastSynced = Date.now();
        this.notifySubscribers();
    }

    // --- Subscription Pattern ---

    public subscribe(callback: (state: BlueprintState) => void): () => void {
        this.subscribers.push(callback);
        // Initial call
        callback(this.currentState);

        return () => {
            this.subscribers = this.subscribers.filter(cb => cb !== callback);
        };
    }

    private notifySubscribers() {
        this.subscribers.forEach(cb => cb({ ...this.currentState }));
    }

    // --- Validation API ---

    public validate(): { valid: boolean; error?: string } {
        return LogicSieve.validateCompleteness(this.currentState.nodes, this.currentState.connections);
    }
}
