import { createClient } from '@supabase/supabase-js'

// Config Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Rate limiting config
import {
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
  getRateLimitHeaders
} from '@/lib/rateLimitConfig'

function getClientIP(req) {
  const fwd = req.headers.get('x-forwarded-for')
  return fwd ? fwd.split(',')[0] : 'unknown'
}

export async function POST(req) {
  const ip = getClientIP(req)
  const endpoint = '/api/pov/vote'

  // Registrar la petición
  await supabase.from('api_requests').insert([{ ip, endpoint }])

  // Verificar cuántas peticiones ha hecho esa IP en el último minuto
  const { data: recentRequests, error: rateError } = await supabase
    .from('api_requests')
    .select('id')
    .eq('ip', ip)
    .eq('endpoint', endpoint)
    .gte('created_at', new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString())

  if (rateError) {
    console.warn('Rate limit check failed:', rateError.message)
    return new Response(JSON.stringify({ error: 'Rate limit check failed' }), { status: 500 })
  }

  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 })
  }

  // Parsear body y validar
  const { poll_id, wallet_address, vote } = await req.json()

  if (!poll_id || !wallet_address || !['yes', 'no'].includes(vote)) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 })
  }

  // Verificar que es contribuidor válido
  const { data: contributor, error: contribErr } = await supabase
    .from('leaderboard')
    .select('total_eth')
    .eq('wallet', wallet_address.toLowerCase())
    .single()

  if (contribErr || !contributor || parseFloat(contributor.total_eth) <= 0) {
    return new Response(JSON.stringify({ error: 'Not eligible to vote' }), { status: 403 })
  }

  // Verificar si ya ha votado
  const { data: existingVote } = await supabase
    .from('poll_votes')
    .select('id')
    .eq('poll_id', poll_id)
    .eq('wallet_address', wallet_address.toLowerCase())
    .maybeSingle()

  if (existingVote) {
    return new Response(JSON.stringify({ error: 'You have already voted in this poll' }), {
      status: 409
    })
  }

  // Insertar voto
  const { error: insertError } = await supabase.from('poll_votes').insert([
    {
      poll_id,
      wallet_address: wallet_address.toLowerCase(),
      vote
    }
  ])

  if (insertError) {
    return new Response(JSON.stringify({ error: insertError.message }), { status: 400 })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}

