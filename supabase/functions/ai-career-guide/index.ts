import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userProfile, context } = await req.json();

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // AI-powered career guidance
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert AI career counselor specializing in internships and skill development. 
            
            Provide personalized, actionable advice based on:
            - User's current skills and experience
            - Career goals and interests
            - Market trends and industry demands
            - Specific internship opportunities
            
            Be encouraging, specific, and practical in your responses. Include:
            - Skill development recommendations
            - Career path suggestions
            - Interview preparation tips
            - Industry insights
            - Networking advice`
          },
          {
            role: 'user',
            content: `User Profile: ${JSON.stringify(userProfile)}
            Context: ${context || 'General career guidance'}
            
            User Question: ${message}
            
            Please provide detailed, personalized career guidance.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const guidance = data.choices[0].message.content;

    console.log('AI Career Guidance provided for user');

    return new Response(JSON.stringify({ guidance }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI career guide:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});