import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkEnums() {
    console.log("Checking submissions status...");
    const subRes = await supabase.from('submissions').insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        node_id: '00000000-0000-0000-0000-000000000000',
        status: 'approved',
        consensus_score: 1.0
    });
    console.log("Submissions (approved) result:", subRes.error?.message || "SUCCESS");

    const subResFailed = await supabase.from('submissions').insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        node_id: '00000000-0000-0000-0000-000000000000',
        status: 'failed',
        consensus_score: 0.0
    });
    console.log("Submissions (failed) result:", subResFailed.error?.message || "SUCCESS");

    console.log("\nChecking reputation_ledger reason...");
    const repRes = await supabase.from('reputation_ledger').insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        delta: 10,
        reason: 'diagnostic_mastery'
    });
    console.log("Reputation (diagnostic_mastery) result:", repRes.error?.message || "SUCCESS");

    const repResAttempt = await supabase.from('reputation_ledger').insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        delta: 0,
        reason: 'diagnostic_attempt'
    });
    console.log("Reputation (diagnostic_attempt) result:", repResAttempt.error?.message || "SUCCESS");
}

checkEnums();
