import { supabase } from '../lib/supabase';

// ============================================================================
// TYPES
// ============================================================================

export interface KnowledgeVector {
    id: string;
    content: string;
    metadata: {
        source: string; // e.g., "NGSS-HS-PS2-1"
        tier: string;   // e.g., "Builder", "Explorer"
        domain: string; // e.g., "Physics", "Biology"
        [key: string]: any;
    };
    similarity?: number;
}

export interface SearchResult {
    content: string;
    metadata: KnowledgeVector['metadata'];
    score: number;
}

// ============================================================================
// VECTOR STORE SERVICE (The Librarian)
// ============================================================================

class VectorStoreService {
    private static instance: VectorStoreService;
    private readonly EMBEDDING_MODEL = 'text-embedding-3-small';

    private constructor() { }

    public static getInstance(): VectorStoreService {
        if (!VectorStoreService.instance) {
            VectorStoreService.instance = new VectorStoreService();
        }
        return VectorStoreService.instance;
    }

    /**
     * Search the Knowledge Graph for relevant content.
     * @param query The user's intent or topic (e.g., "Build a bridge")
     * @param tier The complexity tier to filter by (optional)
     * @returns Array of most relevant content strings
     */
    public async search(query: string, tier?: string): Promise<string[]> {
        try {
            // 1. Generate Embedding
            // In a real app, this calls OpenAI / Local LLM.
            // For this phase, we'll check if we have a real embedding function available,
            // otherwise we'll return a mock vector or specific fallback.
            if (tier) {
                console.log(`[VectorStore] Filtering by tier: ${tier} (Implementation Pending)`);
            }
            const embedding = await this.generateEmbedding(query);

            if (!embedding) {
                console.warn('[VectorStore] Embedding generation failed or not configured.');
                return this.getSystemFallbacks(query);
            }

            // 2. Query Supabase
            const { data, error } = await supabase.rpc('match_knowledge_vectors', {
                query_embedding: embedding,
                match_threshold: 0.7, // 70% similarity threshold
                match_count: 3
            });

            if (error) {
                console.error('[VectorStore] Supabase vector search error:', error);
                // Fail gracefully to fallbacks
                return this.getSystemFallbacks(query);
            }

            // 3. Process Results
            if (!data || data.length === 0) {
                console.log('[VectorStore] No relevant vectors found. Using fallbacks.');
                return this.getSystemFallbacks(query);
            }

            // Map to content strings
            return data.map((item: any) => item.content as string);

        } catch (err) {
            console.error('[VectorStore] Unexpected search error:', err);
            return this.getSystemFallbacks(query);
        }
    }

    /**
     * Ingest verifiable knowledge into the Vector Store.
     * This creates the "Truth Source" for the AI.
     * @param content The scientific fact or standard
     * @param metadata Contextual tags (source, tier, etc.)
     */
    public async ingest(content: string, metadata: any): Promise<void> {
        const embedding = await this.generateEmbedding(content);

        if (!embedding) {
            console.warn('[VectorStore] Skipping ingestion: No embedding generated. (Set VITE_OPENAI_API_KEY for real ingestion)');
            // In a real production environment, we might throw an error here.
            // For this dev checkpoint, we simply log it so the script doesn't crash.
            return;
        }

        const { error } = await supabase.from('knowledge_vectors').insert({
            content,
            metadata,
            embedding
        });

        if (error) {
            console.error('[VectorStore] Ingestion failed:', error);
            throw error;
        }

        console.log(`[VectorStore] ✓ Ingested: "${content.substring(0, 40)}..."`);
    }

    /**
     * Generate an embedding vector for the given text.
     * @param text The text to embed
     * @returns A 1536-dimensional vector, or null if API is not configured.
     */
    private async generateEmbedding(text: string): Promise<number[] | null> {
        // ─────────────────────────────────────────────────────────────────────
        // TRUTH LAYER: Connect to OpenAI / Local LLM here.
        // ─────────────────────────────────────────────────────────────────────

        // Check for Edge Function availability (preferred architecture)
        try {
            const { data, error } = await supabase.functions.invoke('embed', {
                body: { input: text }
            });

            if (!error && data?.embedding) {
                return data.embedding;
            }
        } catch (e) {
            // Edge function not deployed or failed
        }

        // If we have an API key in env, use it directly (client-side fallback/testing)
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
        if (apiKey) {
            try {
                const response = await fetch('https://api.openai.com/v1/embeddings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: this.EMBEDDING_MODEL,
                        input: text
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    return result.data[0].embedding;
                }
            } catch (e) {
                console.error('[VectorStore] Direct OpenAI call failed:', e);
            }
        }

        // 🚨 NO EMBEDDING SERVICE AVAILABLE 🚨
        // Fallback: Deterministic Mock Embedding (for dev/test environments without API keys)
        // Ensure we return a valid 1536-dim vector so the DB doesn't reject it.
        console.warn(`[VectorStore] ⚠️ DEV MODE: Generating mock embedding for "${text.slice(0, 20)}..."`);

        // Create a deterministic vector based on string char codes + improved distribution
        // This ensures the same text always produces the same vector (essential for search consistency)
        return Array.from({ length: 1536 }, (_, i) => {
            const charCode = text.charCodeAt(i % text.length) || 0;
            const seed = (charCode * (i + 1)) % 1000;
            return (seed / 1000) * 2 - 1; // Normalize between -1 and 1
        });
    }

    /**
     * Fallback content when the vector store is empty, offline, or unconnected.
     * Prevents "AI Hallucination" by providing hard-coded, safe context.
     */
    private getSystemFallbacks(query: string): string[] {
        // Detect broad intent to provide somewhat relevant fallback
        const lower = query.toLowerCase();

        if (lower.includes('bridge') || lower.includes('struct') || lower.includes('build')) {
            return [
                "Standards Ref (HS-PS2-1): Newton's Third Law states that for every action, there is an equal and opposite reaction.",
                "Engineering Principle: Triangles are the strongest shape because they distribute force evenly through their structure.",
                "Material Science: Compressive strength often differs from tensile strength in construction materials."
            ];
        }

        if (lower.includes('hero') || lower.includes('bio') || lower.includes('cell')) {
            return [
                "Standards Ref (HS-LS1-1): DNA contains the specific instructions for building proteins.",
                "Biology Core: The cell membrane controls what enters and exits the cell to maintain homeostasis.",
                "Systems Thinking: Biological systems are hierarchical, from organelles to ecosystems."
            ];
        }

        // Generic critical thinking fallbacks
        return [
            "Universal Standard ONE: Evidence must support the claim.",
            "Universal Standard TWO: Correlation does not imply causation.",
            "Universal Standard THREE: Systems seek equilibrium."
        ];
    }
}

export const VectorStore = VectorStoreService.getInstance();
