import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const url = process.env.VITE_SUPABASE_URL || '';
const key = process.env.VITE_SUPABASE_ANON_KEY || '';

async function run() {
    const res = await fetch(`${url}/rest/v1/?apikey=${key}`);
    const spec = await res.json();
    fs.writeFileSync('openapi-spec.json', JSON.stringify(spec, null, 2));
}

run().catch(console.error);
