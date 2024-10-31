import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// Simulated AI prediction generation
function generatePredictions() {
  const sports = ['soccer', 'basketball', 'baseball', 'hockey']
  const predictions = []
  
  for (const sport of sports) {
    // Generate 2-3 predictions per sport
    const numPredictions = Math.floor(Math.random() * 2) + 2
    
    for (let i = 0; i < numPredictions; i++) {
      const confidence = Math.floor(Math.random() * 30) + 70 // 70-99% confidence
      predictions.push({
        sport,
        event_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        home_team: `${sport.charAt(0).toUpperCase() + sport.slice(1)} Team A`,
        away_team: `${sport.charAt(0).toUpperCase() + sport.slice(1)} Team B`,
        prediction: Math.random() > 0.5 ? 'Home team to win' : 'Away team to win',
        confidence_score: confidence,
        odds: Number((Math.random() * 3 + 1.1).toFixed(2)), // Odds between 1.1 and 4.1
        status: 'pending',
        league_id: Math.floor(Math.random() * 5) + 1,
        analysis: `AI analysis based on recent performance metrics shows ${confidence}% confidence in this prediction`,
        home_stats: {
          wins_last_5: Math.floor(Math.random() * 6),
          form_rating: Math.floor(Math.random() * 100),
        },
        away_stats: {
          wins_last_5: Math.floor(Math.random() * 6),
          form_rating: Math.floor(Math.random() * 100),
        }
      })
    }
  }
  
  return predictions
}

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { 
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Get environment variables
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Generate predictions
    const predictions = generatePredictions()

    // Insert predictions into the database
    const { data, error } = await supabase
      .from('predictions')
      .insert(predictions)
      .select()

    if (error) throw error

    // Update status of past predictions
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    await supabase
      .from('predictions')
      .update({ 
        status: Math.random() > 0.5 ? 'won' : 'lost',
        result: 'Match completed'
      })
      .eq('status', 'pending')
      .lt('event_date', yesterday)

    return new Response(
      JSON.stringify({
        message: `Successfully generated ${predictions.length} predictions`,
        predictions: data
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        error: error.message,
        type: error.constructor.name
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})