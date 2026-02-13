-- SEED DATA FOR COMPANY BOUNTIES
-- Run this in the Supabase SQL Editor to populate the '0 Contracts' view.

DO $$
DECLARE
  first_user_id uuid;
BEGIN
  -- 1. Get the first user (Foundation/Company account) to assign these bounties to
  SELECT id INTO first_user_id FROM auth.users LIMIT 1;

  -- 2. If no user exists, we cannot insert (foreign key constraint).
  --    In that case, you must Sign Up one user in your app first!
  IF first_user_id IS NOT NULL THEN
    
    -- 3. Insert specific Biodiversity, Coding, and Creative missions
    INSERT INTO company_bounties (company_id, title, description, reward_amount, difficulty, category, status)
    VALUES
      (first_user_id, 'Biodiversity Survey', 'Analyze field data (Soil pH, Water Levels, Flora) from Sector 7 to determine ecosystem health.', 20000, 'Medium', 'Science', 'live'),
      (first_user_id, 'Fix Navbar CSS', 'Dropdown menu misaligned on mobile devices. Requires flexbox debugging.', 18000, 'Easy', 'Coding', 'live'),
      (first_user_id, 'Design App Icon', 'Create a modern, flat-design icon for the new release (512x512).', 20000, 'Medium', 'Creative', 'live'),
      (first_user_id, 'Analyze Water Samples', 'Document pH levels from 5 sources in the local river.', 15000, 'Easy', 'Science', 'live'),
      (first_user_id, 'Optimize Page Speed', 'Reduce landing page load time by 40%.', 42000, 'Hard', 'Coding', 'live');
      
  END IF;
END $$;
