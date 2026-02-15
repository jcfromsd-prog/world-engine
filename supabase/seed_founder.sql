DO $$ 
DECLARE 
  target_email text;
  target_id uuid;
BEGIN 
  -- Loop through both potential founder accounts
  FOREACH target_email IN ARRAY ARRAY['jcinsv@gmail.com', 'jc_test_1@gmail.com']
  LOOP
      -- Find the real ID
      SELECT id INTO target_id FROM auth.users WHERE email = target_email LIMIT 1;
      
      IF target_id IS NOT NULL THEN
          -- Delete old inflated missions
          DELETE FROM public.company_bounties WHERE company_id = target_id;

          -- Insert calibrated missions (200 GP)
          INSERT INTO public.company_bounties (company_id, title, description, reward_amount, difficulty, category, status)
          VALUES 
            (target_id, 'Biodiversity Survey', 'Analyze Sector 7 field data.', 200, 'Medium', 'Science', 'LIVE'),
            (target_id, 'Fix Navbar CSS', 'Align dropdown menus.', 180, 'Easy', 'Coding', 'LIVE'),
            (target_id, 'Design App Icon', 'Create vector assets.', 200, 'Hard', 'Creative', 'LIVE');
      END IF;
  END LOOP;
END $$;

-- VERIFY THE RESULTS
SELECT title, reward_amount, status 
FROM public.company_bounties 
WHERE company_id IN (
  SELECT id FROM auth.users WHERE email IN ('jcinsv@gmail.com', 'jc_test_1@gmail.com')
);
