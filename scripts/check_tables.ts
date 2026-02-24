import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) { process.exit(1); }
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data: users, error: err1 } = await supabase.from('users').select('*').limit(1);
    console.log("Users Table:", users, err1?.message || 'OK');

    const { data: profiles, error: err2 } = await supabase.from('profiles').select('*').limit(1);
    console.log("Profiles Table:", profiles, err2?.message || 'OK');
}
check();
