-- Add age_tier column to public.profiles for Phase 1 Persistence
-- This aligns with the APP_LEARNER_PROFILE and Intake Engine logic
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age_tier INTEGER DEFAULT 1;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.age_tier IS 'Mapped age tier from Intake Engine (1-5)';

-- Also ensure it exists in public.users if that table is used for high-level sync
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS age_tier INTEGER DEFAULT 1;
