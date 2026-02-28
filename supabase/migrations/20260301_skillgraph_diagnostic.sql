-- =============================================
-- ANTIGRAVITY ENGINE - Phase 1 Schema
-- SkillGraph + Diagnostic Baseline
-- =============================================

-- Enable pgvector if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. SKILLGRAPH NODES (The Competencies)
CREATE TABLE IF NOT EXISTS public.skill_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    domain TEXT NOT NULL, -- e.g., 'math', 'science', 'leadership'
    difficulty_level INTEGER DEFAULT 1,
    semantic_embedding vector(1536), -- Vector representation for narrative matchmaking
    metadata JSONB DEFAULT '{}', -- E.g. { "standard_id": "CCSS.MATH.CONTENT.8.G.A.1" }
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SKILLGRAPH EDGES (The Relational Rules)
CREATE TABLE IF NOT EXISTS public.skill_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_node_id UUID NOT NULL REFERENCES public.skill_nodes(id) ON DELETE CASCADE,
    target_node_id UUID NOT NULL REFERENCES public.skill_nodes(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL, -- 'requires', 'unlocks', 'relates_to'
    weight NUMERIC DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_node_id, target_node_id, relationship_type) -- Prevent duplicate edges
);

-- 3. USER SKILL PROFILES (Baseline + Current Mastery)
CREATE TABLE IF NOT EXISTS public.user_skill_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    baseline_profile JSONB DEFAULT '{}', -- Snapshot from Phase 1 Diagnostic
    current_profile JSONB DEFAULT '{}', -- Live updating mastery 
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_skill_nodes_domain ON public.skill_nodes(domain);
CREATE INDEX IF NOT EXISTS idx_skill_edges_source ON public.skill_edges(source_node_id);
CREATE INDEX IF NOT EXISTS idx_skill_edges_target ON public.skill_edges(target_node_id);
CREATE INDEX IF NOT EXISTS idx_skill_nodes_vector ON public.skill_nodes USING ivfflat (semantic_embedding vector_cosine_ops) WITH (lists = 100);

-- TIMESTAMP HELPERS
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_skill_nodes_updated_at') THEN
        CREATE TRIGGER trigger_skill_nodes_updated_at 
            BEFORE UPDATE ON public.skill_nodes 
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_user_skill_profiles_updated_at') THEN
        CREATE TRIGGER trigger_user_skill_profiles_updated_at 
            BEFORE UPDATE ON public.user_skill_profiles 
            FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END $$;

-- RLS POLICIES
ALTER TABLE public.skill_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skill_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read skill nodes" ON public.skill_nodes
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated read skill edges" ON public.skill_edges
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users read own skill profiles" ON public.user_skill_profiles
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users update own skill profiles" ON public.user_skill_profiles
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users insert own skill profiles" ON public.user_skill_profiles
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- DONE
