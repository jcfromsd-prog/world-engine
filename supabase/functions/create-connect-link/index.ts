import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.5.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Create Stripe Connect Onboarding Link - Edge Function
 * Generates an onboarding link for solvers to receive payments
 */
serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
            apiVersion: '2023-10-16',
        })

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        const supabase = createClient(supabaseUrl, supabaseKey)

        const { solverId } = await req.json()

        if (!solverId) {
            return new Response(
                JSON.stringify({ error: 'Missing solverId' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Check if solver already has a Connect account
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_connect_id, email')
            .eq('id', solverId)
            .single()

        let accountId = profile?.stripe_connect_id

        if (!accountId) {
            // Create a new Connect Express account
            const account = await stripe.accounts.create({
                type: 'express',
                email: profile?.email,
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
                metadata: {
                    solver_id: solverId,
                    platform: 'world_engine'
                }
            })

            accountId = account.id

            // Save Connect account ID to profile
            await supabase
                .from('profiles')
                .update({ stripe_connect_id: accountId })
                .eq('id', solverId)
        }

        // Create onboarding link
        const returnUrl = Deno.env.get('FRONTEND_URL') || 'https://worldengine.com'
        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${returnUrl}/settings?connect=refresh`,
            return_url: `${returnUrl}/settings?connect=success`,
            type: 'account_onboarding',
        })

        return new Response(
            JSON.stringify({ url: accountLink.url }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Connect onboarding error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
