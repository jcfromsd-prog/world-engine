// Supabase Edge Function: chat
// Deploy with: supabase functions deploy chat

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { systemPrompt, userMessage, history } = await req.json()

        const apiKey = Deno.env.get('OPENAI_API_KEY')
        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: 'OpenAI API key not configured' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...(history || []),
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7
            })
        })

        const data = await response.json()

        if (data.error) {
            return new Response(
                JSON.stringify({ error: data.error.message }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        const content = data.choices?.[0]?.message?.content || 'No response generated.'

        return new Response(
            JSON.stringify({ content }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
