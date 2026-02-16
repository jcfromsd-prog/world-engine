import { debounce } from 'lodash-es';
import type { LogicNode, LogicConnection, BlueprintState, Command } from '../types';
import { LogicSieve } from '../validation/LogicSieve';
import { devTelemetry } from '../../engines/logic-link/ObservabilityLayer';
import { supabase } from '../../lib/supabase'; // Ensure this path is correct or mock it if needed

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

    // Command Pattern State
    private commandStack: Command[] = [];
    private commandIndex: number = -1; // -1 means no commands executed
    private readonly MAX_HISTORY = 50;

    // Debounced Sync Function
    private debouncedSync = debounce(() => this.persistToCloud(), 1000);

    private constructor() {
        // Private constructor for Singleton
    }

    public static getInstance(): BlueprintEngine {
        if (!BlueprintEngine.instance) {
            BlueprintEngine.instance = new BlueprintEngine();
        }
        return BlueprintEngine.instance;
    }

    // ... (Command Execution methods same as before) ...
    public executeCommand(command: Command) {
        if (this.commandIndex < this.commandStack.length - 1) {
            this.commandStack = this.commandStack.slice(0, this.commandIndex + 1);
        }
        command.execute();
        this.commandStack.push(command);
        this.commandIndex++;
        if (this.commandStack.length > this.MAX_HISTORY) {
            this.commandStack.shift();
            this.commandIndex--;
        }
        this.validateAndNotify();
        devTelemetry.trackEvent('ACTION', `Execute: ${command.label}`, 'neutral');
    }

    public undo() {
        if (this.commandIndex >= 0) {
            const command = this.commandStack[this.commandIndex];
            command.undo();
            this.commandIndex--;
            this.validateAndNotify();
            devTelemetry.trackEvent('ACTION', `Undo: ${command.label}`, 'neutral');
        }
    }

    public redo() {
        if (this.commandIndex < this.commandStack.length - 1) {
            this.commandIndex++;
            const command = this.commandStack[this.commandIndex];
            command.execute();
            this.validateAndNotify();
            devTelemetry.trackEvent('ACTION', `Redo: ${command.label}`, 'neutral');
        }
    }

    private validateAndNotify() {
        // Validate structurally
        const validation = LogicSieve.validateCompleteness(this.currentState.nodes, this.currentState.connections);
        this.currentState.isValid = validation.valid;

        this.notifySubscribers();
        this.debouncedSync();
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
        if (this.currentState.nodes.length === 0) return;

        console.log('[BlueprintEngine] Syncing to Cloud...', this.currentState);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                console.warn('[BlueprintEngine] No user authenticated. Skipping cloud sync.');
                return;
            }

            // Sync Logic
            const payload = {
                user_id: user.id,
                nodes: this.currentState.nodes,
                connections: this.currentState.connections,
                is_valid: this.currentState.isValid,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('blueprints')
                .upsert(payload, { onConflict: 'user_id' }); // Assuming 1 blueprint per user for now, or use 'id'

            if (error) throw error;

            devTelemetry.trackEvent(
                'CHECK',
                `Blueprint Saved (${this.currentState.nodes.length} nodes)`,
                'success'
            );

            this.currentState.lastSynced = Date.now();
            this.notifySubscribers();

        } catch (err) {
            console.error('[BlueprintEngine] Sync Failed:', err);
            devTelemetry.trackEvent('CHECK', 'Blueprint Sync Failed', 'failure');
        }
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
