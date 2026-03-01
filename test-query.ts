import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSubmissions() {
    console.log("Querying submissions table...");
    const { data, error } = await supabase.from('submissions').select('*').limit(5);

    if (error) {
        console.error("Error querying submissions:", error.message);
    } else {
        console.log("Submissions retrieved successfully. Returning latest 5 rows:");
        console.dir(data, { depth: null });
    }
}

checkSubmissions();
