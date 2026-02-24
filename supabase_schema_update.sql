-- =============================================
-- WORLD ENGINE - Swarm Validation Mechanism
-- Phase 3: Intelligence Swarm
-- Supabase PostgreSQL - Production Ready
-- =============================================

-- 1. SAFELY EXTEND EXISTING users TABLE
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'age_tier') THEN
        ALTER TABLE public.users ADD COLUMN age_tier INTEGER CHECK (age_tier IS NULL OR age_tier BETWEEN 1 AND 5);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'reputation_score') THEN
        ALTER TABLE public.users ADD COLUMN reputation_score NUMERIC DEFAULT 0.0 CHECK (reputation_score >= 0);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'apathy_index') THEN
        ALTER TABLE public.users ADD COLUMN apathy_index NUMERIC DEFAULT 0.5 CHECK (apathy_index BETWEEN 0 AND 1);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'swarm_validator_level') THEN
        ALTER TABLE public.users ADD COLUMN swarm_validator_level INTEGER DEFAULT 0 CHECK (swarm_validator_level BETWEEN 0 AND 5);
    END IF;
END $$;

-- 2. SAFELY EXTEND EXISTING nodes TABLE
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'nodes' AND column_name = 'skill_domain') THEN
        ALTER TABLE public.nodes ADD COLUMN skill_domain TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'nodes' AND column_name = 'difficulty_weight') THEN
        ALTER TABLE public.nodes ADD COLUMN difficulty_weight NUMERIC DEFAULT 1.0 CHECK (difficulty_weight > 0);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' AND table_name = 'nodes' AND column_name = 'rubric_json') THEN
        ALTER TABLE public.nodes ADD COLUMN rubric_json JSONB DEFAULT '{}';
    END IF;
END $$;

-- 3. submissions TABLE
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    node_id UUID NOT NULL REFERENCES public.nodes(id) ON DELETE CASCADE,
    stake_tokens NUMERIC DEFAULT 0 CHECK (stake_tokens >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active_vote', 'approved', 'rejected')),
    consensus_score NUMERIC DEFAULT 0 CHECK (consensus_score BETWEEN 0 AND 1),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. swarm_votes TABLE
CREATE TABLE IF NOT EXISTS public.swarm_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    validator_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    score NUMERIC NOT NULL CHECK (score BETWEEN 0 AND 1),
    rubric_vector_json JSONB,
    weight_applied NUMERIC NOT NULL CHECK (weight_applied > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(submission_id, validator_id)  -- prevent double-voting
);

-- 5. reputation_ledger TABLE
CREATE TABLE IF NOT EXISTS public.reputation_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    delta NUMERIC NOT NULL,
    reason TEXT NOT NULL,
    related_submission UUID REFERENCES public.submissions(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES (performance for swarms & queries)
CREATE INDEX IF NOT EXISTS idx_submissions_user_status ON public.submissions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_submissions_node_status ON public.submissions(node_id, status);
CREATE INDEX IF NOT EXISTS idx_swarm_votes_submission ON public.swarm_votes(submission_id);
CREATE INDEX IF NOT EXISTS idx_swarm_votes_validator ON public.swarm_votes(validator_id);
CREATE INDEX IF NOT EXISTS idx_reputation_ledger_user ON public.reputation_ledger(user_id);

-- UPDATED_AT TRIGGER HELPER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_submissions_updated_at 
    BEFORE UPDATE ON public.submissions 
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS ENABLE + POLICIES (strict ownership + validator swarm access)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swarm_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reputation_ledger ENABLE ROW LEVEL SECURITY;

-- users
CREATE POLICY IF NOT EXISTS "Authenticated read all users for swarm" ON public.users 
    FOR SELECT TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Users update own profile" ON public.users 
    FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- nodes (curriculum is public)
CREATE POLICY IF NOT EXISTS "Authenticated read nodes" ON public.nodes 
    FOR SELECT TO authenticated USING (true);

-- submissions
CREATE POLICY IF NOT EXISTS "Users read own submissions" ON public.submissions 
    FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Validators read active submissions" ON public.submissions 
    FOR SELECT TO authenticated USING (
        status = 'active_vote' 
        AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND swarm_validator_level >= 1)
    );
CREATE POLICY IF NOT EXISTS "Users create own submissions" ON public.submissions 
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users update own submissions" ON public.submissions 
    FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- swarm_votes
CREATE POLICY IF NOT EXISTS "Validators insert own vote" ON public.swarm_votes 
    FOR INSERT TO authenticated WITH CHECK (
        auth.uid() = validator_id 
        AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND swarm_validator_level >= 1)
    );
CREATE POLICY IF NOT EXISTS "Users read votes on own submissions" ON public.swarm_votes 
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.submissions WHERE id = submission_id AND user_id = auth.uid())
    );
CREATE POLICY IF NOT EXISTS "Validators read own votes" ON public.swarm_votes 
    FOR SELECT TO authenticated USING (auth.uid() = validator_id);

-- reputation_ledger
CREATE POLICY IF NOT EXISTS "Users read own ledger" ON public.reputation_ledger 
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- WEIGHTED CONSENSUS RPC (exactly as specified)
CREATE OR REPLACE FUNCTION public.calculate_weighted_consensus(p_submission_id UUID)
RETURNS NUMERIC 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    total_weighted NUMERIC := 0;
    total_weight NUMERIC := 0;
BEGIN
    SELECT 
        COALESCE(SUM(score * weight_applied), 0),
        COALESCE(SUM(weight_applied), 0)
    INTO total_weighted, total_weight
    FROM public.swarm_votes 
    WHERE submission_id = p_submission_id;

    IF total_weight = 0 THEN
        RETURN 0.0;
    END IF;

    RETURN ROUND(total_weighted / total_weight, 4);
END;
$$;

-- Auto-update consensus_score + status after every vote
CREATE OR REPLACE FUNCTION public.trigger_recalculate_consensus()
RETURNS TRIGGER AS $$
DECLARE
    new_score NUMERIC;
BEGIN
    new_score := public.calculate_weighted_consensus(NEW.submission_id);
    
    UPDATE public.submissions 
    SET consensus_score = new_score,
        status = CASE 
            WHEN new_score >= 0.70 THEN 'approved'
            WHEN new_score <= 0.30 THEN 'rejected'
            ELSE 'active_vote' 
        END
    WHERE id = NEW.submission_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_swarm_vote_consensus ON public.swarm_votes;
CREATE TRIGGER trigger_swarm_vote_consensus
    AFTER INSERT OR UPDATE ON public.swarm_votes
    FOR EACH ROW EXECUTE FUNCTION public.trigger_recalculate_consensus();

-- Grant execute rights
GRANT EXECUTE ON FUNCTION public.calculate_weighted_consensus(UUID) TO authenticated, service_role;

-- Done!
