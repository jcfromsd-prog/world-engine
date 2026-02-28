import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    const { data: subs, error: errSubs } = await supabase
        .from('submissions')
        .select('*')
        .limit(1);

    console.log("--- SUBMISSIONS SCHEMA COLUMNS ---");
    if (errSubs) console.error(errSubs);
    else console.log(subs?.length ? Object.keys(subs[0]).join(', ') : "No rows found (empty table)");

    const { data: ledger, error: errLedger } = await supabase
        .from('reputation_ledger')
        .select('*')
        .limit(1);

    console.log("--- REPUTATION LEDGER SCHEMA COLUMNS ---");
    if (errLedger) console.error(errLedger);
    else console.log(ledger?.length ? Object.keys(ledger[0]).join(', ') : "No rows found (empty table)");
}

verify();
