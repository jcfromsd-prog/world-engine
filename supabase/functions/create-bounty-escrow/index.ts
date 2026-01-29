import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.5.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Create Bounty Escrow - Edge Function
 * Creates a Stripe PaymentIntent with manual capture for escrow
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

        const { bountyId, amount, title, companyId } = await req.json()

        // Validate inputs
        if (!bountyId || !amount || !title || !companyId) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Create PaymentIntent with manual capture (escrow)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // in cents
            currency: 'usd',
            capture_method: 'manual', // Funds are held, not captured until we release
            metadata: {
                bounty_id: bountyId,
                company_id: companyId,
                platform: 'world_engine'
            },
            description: `Bounty Escrow: ${title}`,
        })

        // Store escrow info in database
        await supabase
            .from('company_bounties')
            .update({
                escrow_payment_intent_id: paymentIntent.id,
                escrow_status: 'pending',
                escrow_amount: amount
            })
            .eq('id', bountyId)

        return new Response(
            JSON.stringify({
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Escrow creation error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
