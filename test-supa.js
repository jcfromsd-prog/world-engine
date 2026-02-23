import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL || '';
const key = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(url, key);

async function run() {
    const { data: d1, error: e1 } = await supabase.from('submissions').insert({
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        node_id: 'test',
        status: 'success'
    });
    console.log("Submissions error:", e1?.message, e1?.details, e1?.hint);

    const { data: d2, error: e2 } = await supabase.from('reputation_ledger').insert({
        user_id: '123e4567-e89b-12d3-a456-426614174000',
        delta: 10,
        reason: 'validation_earned'
    });
    console.log("Reputation error:", e2?.message, e2?.details, e2?.hint);
}
run();
