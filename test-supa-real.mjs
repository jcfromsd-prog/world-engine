import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const url = process.env.VITE_SUPABASE_URL || '';
const key = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(url, key);

async function run() {
    const { data: profiles, error: pErr } = await supabase.from('profiles').select('*').limit(1);
    console.log("Profiles:", profiles, pErr);

    if (profiles && profiles.length > 0) {
        const realId = profiles[0].id; // or user_id
        console.log("Using real ID:", realId);

        const subRes = await supabase.from('submissions').insert({
            user_id: realId,
            content: { question_id: 'q_m1' },
            status: 'validated'
        });
        console.log("Submissions error:", subRes.error);

        const repRes = await supabase.from('reputation_ledger').insert({
            user_id: realId,
            delta: 10,
            reason: 'validation_earned'
        });
        console.log("Reputation error:", repRes.error);
    } else {
        console.log("No profiles found to test with.");
    }
}
run();
