/* ==========================================================================
   PURPOSE LEDGER: The Immutable Record of Impact (v1.0)
   Enforcing Law 2: Identity Over Points (SDT-Aligned)
   ========================================================================== */

export interface LedgerEntry {
    entry_id: string; // uuid
    timestamp: string; // ISO8601
    user_id: string;
    mission_id: string;
    verified_outputs: string[]; // e.g., artifact URLs, skill hashes
    impact_metrics: {
        portfolio_items_added: number;
        skills_demonstrated: string[];
        real_value_created: number; // fiat or token ONLY (GP converted)
        engine_progress: {
            impact_to_legend: number;
            gap_reduction?: number; // This is already present and optional
        };
    };
    ledger_hash: string; // SHA-256 of (previous_hash + current_entry)
    storageType: 'local_cache' | 'server_persisted';
}

/**
 * PURPOSE LEDGER SERVICE
 * An append-only, immutable system for recording user impact.
 * Replaces gamification proxies with verifiable proof of growth.
 */
class PurposeLedgerService {
    private ledger: LedgerEntry[] = [];
    private lastHash: string = "GENESIS_BLOCK_HASH_00000000000000000000000000000000";

    constructor() {
        this.loadLedger();
    }

    /**
     * Appends a new entry to the ledger.
     * Ensures chain integrity via hash chaining.
     */
    public async addEntry(
        data: Omit<LedgerEntry, 'entry_id' | 'timestamp' | 'ledger_hash' | 'storageType'>
    ): Promise<LedgerEntry> {
        const entry_id = crypto.randomUUID();
        const timestamp = new Date().toISOString();

        // Prepare entry for hashing
        const entryData = JSON.stringify({ ...data, entry_id, timestamp, previous_hash: this.lastHash });
        const ledger_hash = await this.calculateHash(entryData);

        const newEntry: LedgerEntry = {
            ...data,
            entry_id,
            timestamp,
            ledger_hash,
            storageType: 'local_cache'
        };

        this.ledger.push(newEntry);
        this.lastHash = ledger_hash;
        this.saveLedger();

        if (import.meta.env.DEV) {
            console.warn("PurposeLedger writing to local_cache. Production requires server-side persistence.");
        }
        console.log(`[PurposeLedger] Immutable entry created: ${entry_id}`);
        return newEntry;
    }

    /**
     * Returns the full ledger for a user.
     */
    public getEntries(user_id: string): LedgerEntry[] {
        return this.ledger.filter(e => e.user_id === user_id);
    }

    /**
     * Verifies the integrity of the ledger chain.
     */
    public async verifyChain(): Promise<boolean> {
        let currentPrevHash = "GENESIS_BLOCK_HASH_00000000000000000000000000000000";
        for (const entry of this.ledger) {
            const entryData = JSON.stringify({
                user_id: entry.user_id,
                mission_id: entry.mission_id,
                verified_outputs: entry.verified_outputs,
                impact_metrics: entry.impact_metrics,
                entry_id: entry.entry_id,
                timestamp: entry.timestamp,
                previous_hash: currentPrevHash
            });
            const calculated = await this.calculateHash(entryData);
            if (calculated !== entry.ledger_hash) return false;
            currentPrevHash = entry.ledger_hash;
        }
        return true;
    }

    private async calculateHash(message: string): Promise<string> {
        const msgUint8 = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    private loadLedger() {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('mbp_purpose_ledger');
            if (stored) {
                try {
                    this.ledger = JSON.parse(stored);
                    if (this.ledger.length > 0) {
                        this.lastHash = this.ledger[this.ledger.length - 1].ledger_hash;
                    }
                } catch (e) {
                    console.error("Failed to load ledger:", e);
                }
            }
        }
    }

    private saveLedger() {
        if (typeof window !== 'undefined') {
            localStorage.setItem('mbp_purpose_ledger', JSON.stringify(this.ledger));
        }
    }
}

export const PurposeLedger = new PurposeLedgerService();
