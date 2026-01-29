import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * World Engine Protocol: Phase 3
 * Real-Time Migration Analysis Edge Function
 * Detects anomalies in data streams with configurable thresholds
 */
serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { current_reading, sensor_id, data_type } = await req.json()

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseKey)

        // Fetch historical baseline from database
        const { data: baselineData } = await supabase
            .from('migration_baselines')
            .select('baseline_value')
            .eq('data_type', data_type || 'whale_density')
            .single()

        const historical_baseline = baselineData?.baseline_value || 450.0
        const threshold = 0.15 // 15% threshold as per Guardian Protocol

        // Calculate deviation
        const deviation = Math.abs(current_reading - historical_baseline) / historical_baseline
        const isAnomaly = deviation > threshold

        const result = {
            status: isAnomaly ? '⚠️ ANOMALY DETECTED' : '✅ STABLE',
            deviation_pct: Math.round(deviation * 100 * 100) / 100,
            action_taken: isAnomaly
                ? 'Triggering Zero-Day Defense Protocol...'
                : 'Maintaining observation.',
            current_reading,
            historical_baseline,
            sensor_id: sensor_id || 'SENSOR_ALPHA',
            timestamp: new Date().toISOString()
        }

        // Store the reading in the database for live feed
        await supabase
            .from('migration_readings')
            .insert({
                sensor_id: result.sensor_id,
                current_value: current_reading,
                baseline_value: historical_baseline,
                deviation_pct: result.deviation_pct,
                is_anomaly: isAnomaly,
                status: result.status,
                action_taken: result.action_taken
            })

        // If anomaly detected, also log to alerts table
        if (isAnomaly) {
            await supabase
                .from('migration_alerts')
                .insert({
                    sensor_id: result.sensor_id,
                    alert_type: 'ZERO_DAY_DEFENSE',
                    deviation_pct: result.deviation_pct,
                    current_value: current_reading,
                    message: `Critical deviation detected: ${result.deviation_pct}% above threshold`
                })
        }

        return new Response(
            JSON.stringify(result),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
