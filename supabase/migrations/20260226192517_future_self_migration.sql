ALTER TABLE public.users ADD COLUMN IF NOT EXISTS future_self TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS future_self_updated_at TIMESTAMPTZ;
