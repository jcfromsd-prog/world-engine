-- MyBestPurpose SQL Snapshot (2026-03-01)

-- SCHEMA EXPORTS
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    node_id UUID NOT NULL,
    status TEXT NOT NULL,
    consensus_score NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS public.reputation_ledger (
    ledger_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    delta NUMERIC NOT NULL,
    reason TEXT NOT NULL,
    related_submission UUID,
    current_profile JSONB DEFAULT '{}',
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- DATA EXPORT
