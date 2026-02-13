DO $$ 
DECLARE 
  target_id uuid;
BEGIN 
  -- Find the real ID for your email
  SELECT id INTO target_id FROM auth.users WHERE email = 'jcinsv@gmail.com' LIMIT 1;
  
  -- Delete old placeholder missions
  DELETE FROM public.company_bounties WHERE company_id = target_id;

  -- Insert the High-Value Founder Missions
  INSERT INTO public.company_bounties (company_id, title, description, reward_amount, difficulty, category, status)
  VALUES 
    (target_id, 'Biodiversity Survey', 'Analyze Sector 7 field data (Soil pH 5.2, Water -2.4).', 20000, 'Medium', 'Science', 'LIVE'),
    (target_id, 'Fix Navbar CSS', 'Align dropdown menus for mobile founders.', 18000, 'Easy', 'Coding', 'LIVE');
END $$;
