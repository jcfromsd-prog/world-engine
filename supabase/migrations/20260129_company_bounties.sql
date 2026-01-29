-- World Engine: Company Bounties & Payments
-- Run this in Supabase SQL Editor

-- =====================================================
-- TABLE: company_bounties
-- Bounties posted by companies with escrow tracking
-- =====================================================
CREATE TABLE IF NOT EXISTS company_bounties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID REFERENCES auth.users(id) NOT NULL,
    
    -- Bounty Details
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    category TEXT DEFAULT 'General',
    difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')) DEFAULT 'Medium',
    time_estimate TEXT,
    
    -- Reward
    reward_amount INTEGER NOT NULL, -- in cents
    currency TEXT DEFAULT 'USD',
    
    -- Escrow (Stripe)
    escrow_payment_intent_id TEXT,
    escrow_status TEXT CHECK (escrow_status IN ('pending', 'funded', 'released', 'refunded')) DEFAULT 'pending',
    escrow_amount INTEGER,
    
    -- Status
    status TEXT CHECK (status IN ('draft', 'funded', 'live', 'claimed', 'in_progress', 'review', 'completed', 'disputed', 'cancelled')) DEFAULT 'draft',
    
    -- Assignment
    claimed_by UUID REFERENCES auth.users(id),
    claimed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ,
    transfer_id TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_company_bounties_status ON company_bounties(status);
CREATE INDEX IF NOT EXISTS idx_company_bounties_company ON company_bounties(company_id);
CREATE INDEX IF NOT EXISTS idx_company_bounties_live ON company_bounties(status) WHERE status = 'live';

-- =====================================================
-- TABLE: solver_earnings
-- Track all solver payouts
-- =====================================================
CREATE TABLE IF NOT EXISTS solver_earnings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    solver_id UUID REFERENCES auth.users(id) NOT NULL,
    bounty_id UUID REFERENCES company_bounties(id),
    
    -- Amounts (in cents)
    amount INTEGER NOT NULL, -- What solver receives
    platform_fee INTEGER NOT NULL, -- Platform's cut
    gross_amount INTEGER GENERATED ALWAYS AS (amount + platform_fee) STORED,
    
    -- Stripe
    transfer_id TEXT,
    status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_solver_earnings_solver ON solver_earnings(solver_id);
CREATE INDEX IF NOT EXISTS idx_solver_earnings_status ON solver_earnings(status);

-- =====================================================
-- Extend profiles table for Stripe Connect
-- =====================================================
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stripe_connect_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_onboarded BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS total_earnings INTEGER DEFAULT 0;

-- =====================================================
-- RLS Policies
-- =====================================================
ALTER TABLE company_bounties ENABLE ROW LEVEL SECURITY;
ALTER TABLE solver_earnings ENABLE ROW LEVEL SECURITY;

-- Companies can manage their own bounties
CREATE POLICY "Companies manage own bounties" ON company_bounties
    FOR ALL USING (auth.uid() = company_id);

-- Anyone can view live bounties
CREATE POLICY "View live bounties" ON company_bounties
    FOR SELECT USING (status = 'live');

-- Solvers can view their own earnings
CREATE POLICY "Solvers view own earnings" ON solver_earnings
    FOR SELECT USING (auth.uid() = solver_id);

-- =====================================================
-- Enable Realtime for live updates
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE company_bounties;

-- =====================================================
-- Function to update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER company_bounties_updated_at
    BEFORE UPDATE ON company_bounties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
