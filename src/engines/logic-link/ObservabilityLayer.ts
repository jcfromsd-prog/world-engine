
/**
 * OBSERVABILITY LAYER (DevTelemetry Bridge)
 * Based on Master Blueprint v2.0 - Section 4.4
 * 
 * Provides a decoupled event stream for the World Engine to emit Logic-Link signals,
 * which the DevConsole (and future dashboards) can subscribe to.
 */

// ============================================================
// TELEMETRY EVENT DEFINITIONS
// ============================================================

export type LogicPhase = 'GOAL' | 'ACTION' | 'CHECK' | 'PAYOFF';

export interface TelemetryEvent {
    id: string;
    timestamp: number;
    phase: LogicPhase;
    details: string;
    metadata?: Record<string, any>;
    status: 'success' | 'failure' | 'neutral';
}

type TelemetryListener = (event: TelemetryEvent) => void;

// ============================================================
// TELEMETRY CLIENT (SINGLETON BRIDGE)
// ============================================================

export class TelemetryClient {
    private static instance: TelemetryClient;
    private listeners: TelemetryListener[] = [];
    private eventLog: TelemetryEvent[] = [];

    private constructor() { }

    public static getInstance(): TelemetryClient {
        if (!TelemetryClient.instance) {
            TelemetryClient.instance = new TelemetryClient();
        }
        return TelemetryClient.instance;
    }

    /**
     * Emits a Logic-Link event to all subscribers.
     * @param phase The stage of the Logic-Link loop (GOAL -> ACTION -> CHECK -> PAYOFF)
     * @param details Human-readable description
     * @param status Outcome of the event
     */
    public trackEvent(phase: LogicPhase, details: string, status: 'success' | 'failure' | 'neutral' = 'neutral', metadata?: Record<string, any>): void {
        const event: TelemetryEvent = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            phase,
            details,
            status,
            metadata
        };

        this.eventLog.push(event);

        // Notify listeners
        this.listeners.forEach(listener => listener(event));

        // Console debug for visibility
        console.debug(`[TELEMETRY][${phase}] ${details}`, event);
    }

    /**
     * Subscribe to the telemetry stream.
     * @returns A cleanup function to unsubscribe.
     */
    public subscribe(listener: TelemetryListener): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public getRecentLogs(limit: number = 50): TelemetryEvent[] {
        return this.eventLog.slice(-limit).reverse();
    }
}

// Export the shared instance for easy access
export const devTelemetry = TelemetryClient.getInstance();
