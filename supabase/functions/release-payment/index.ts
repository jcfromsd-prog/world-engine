import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.5.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

/**
 * Release Payment - Edge Function
 * Captures the escrowed funds and transfers to solver's Connect account
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

        const { bountyId, solverId, paymentIntentId } = await req.json()

        // Validate inputs
        if (!bountyId || !solverId || !paymentIntentId) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Get solver's Connect account ID
        const { data: solverProfile } = await supabase
            .from('profiles')
            .select('stripe_connect_id')
            .eq('id', solverId)
            .single()

        if (!solverProfile?.stripe_connect_id) {
            return new Response(
                JSON.stringify({ error: 'Solver has not connected Stripe account' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Capture the escrowed payment
        const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId)

        // Calculate platform fee (10%)
        const platformFee = Math.floor(paymentIntent.amount * 0.10)
        const solverAmount = paymentIntent.amount - platformFee

        // Transfer to solver's Connect account
        const transfer = await stripe.transfers.create({
            amount: solverAmount,
            currency: 'usd',
            destination: solverProfile.stripe_connect_id,
            transfer_group: `bounty_${bountyId}`,
            metadata: {
                bounty_id: bountyId,
                solver_id: solverId,
                platform_fee: platformFee
            }
        })

        // Update bounty status
        await supabase
            .from('company_bounties')
            .update({
                status: 'completed',
                escrow_status: 'released',
                completed_by: solverId,
                completed_at: new Date().toISOString(),
                transfer_id: transfer.id
            })
            .eq('id', bountyId)

        // Add to solver's earnings history
        await supabase
            .from('solver_earnings')
            .insert({
                solver_id: solverId,
                bounty_id: bountyId,
                amount: solverAmount,
                platform_fee: platformFee,
                transfer_id: transfer.id,
                status: 'completed'
            })

        return new Response(
            JSON.stringify({
                success: true,
                transferId: transfer.id,
                solverAmount,
                platformFee
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Payment release error:', error)
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
