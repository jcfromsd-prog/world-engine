import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.5.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Check Stripe Connect Status - Edge Function
 * Verify if a solver's Connect account is ready for payouts
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

        // Get solver's Connect account ID
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_connect_id')
            .eq('id', solverId)
            .single()

        if (!profile?.stripe_connect_id) {
            return new Response(
                JSON.stringify({
                    isOnboarded: false,
                    canReceivePayments: false
                }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Retrieve account from Stripe
        const account = await stripe.accounts.retrieve(profile.stripe_connect_id)

        const isOnboarded = account.details_submitted
        const canReceivePayments = account.charges_enabled && account.payouts_enabled

        // Update profile if onboarding status changed
        if (isOnboarded) {
            await supabase
                .from('profiles')
                .update({ stripe_onboarded: true })
                .eq('id', solverId)
        }

        return new Response(
            JSON.stringify({
                isOnboarded,
                canReceivePayments,
                email: account.email
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Connect status check error:', error)
        return new Response(
            JSON.stringify({
                isOnboarded: false,
                canReceivePayments: false,
                error: error.message
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
