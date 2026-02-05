/**
 * Validates required environment variables at runtime.
 * Should be called early in the application lifecycle.
 */
export function validateEnv() {
    const requiredVars = [
        'VITE_SUPABASE_URL',
        'VITE_SUPABASE_ANON_KEY'
    ];

    const missing = requiredVars.filter(key => !import.meta.env[key]);

    if (missing.length > 0) {
        const msg = `Missing required environment variables: ${missing.join(', ')}`;
        console.error(msg);

        // In production, we might not want to crash entirely, but definitely warn
        if (import.meta.env.DEV) {
            // alert(msg); // Optional: intrusive alert for devs
        }
    } else {
        console.log('✅ Environment configuration validated');
    }
}
