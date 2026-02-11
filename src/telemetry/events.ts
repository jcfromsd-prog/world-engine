import { supabase } from "../../lib/supabase";

export interface TelemetryEvent {
    event_type: string;
    payload: Record<string, any>;
    timestamp: string;
    user_hash?: string;
    session_id?: string;
}

// Simple hash function for privacy (in production use a robust library)
const sha256 = async (message: string) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const TelemetryService = {
    async logEvent(eventType: string, payload: Record<string, any>, userId?: string) {
        const userHash = userId ? await sha256(userId) : "anonymous";

        const event: TelemetryEvent = {
            event_type: eventType,
            payload,
            timestamp: new Date().toISOString(),
            user_hash: userHash
        };

        // Emit to console in dev
        console.log(`[TELEMETRY] ${eventType}:`, payload);

        // In production, send to Supabase or analytics
        // Fire and forget to not block UI
        if (supabase) {
            supabase.from('telemetry_events').insert(event).catch(err => console.error("Telemetry Error:", err));
        }
    },

    logAepDecision(decision: any, context: any) {
        this.logEvent("aep.decision", {
            decision,
            context,
            rationale: decision.rationale
        });
    },

    logGovernanceGate(gateName: string, status: "PASSED" | "FAILED", reason?: string) {
        this.logEvent("governance.gate", {
            gate: gateName,
            status,
            reason
        });
    }
};
