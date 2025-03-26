import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Rate limiting config
import {
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
} from '@/lib/rateLimitConfig'

function getClientIP(req) {
  const fwd = req.headers.get('x-forwarded-for')
  return fwd ? fwd.split(',')[0] : 'unknown'
}

export async function POST(req) {
  const ip = getClientIP(req)
  const endpoint = '/api/pov/vote'

  // Registrar la petición
  await supabase.from('api_requests').insert([
    { ip, endpoint }
  ])

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

  // Validar que la wallet esté registrada y tenga un saldo mínimo (por ejemplo)
  const { data: contributor, error: contribErr } = await supabase
    .from('polls')
    .select('id, wallet_address') // Asegúrate de tener la wallet en la tabla de polls
    .eq('wallet_address', wallet_address.toLowerCase()) // Asegúrate de comparar en minúsculas
    .single()

  if (contribErr || !contributor) {
    return new Response(JSON.stringify({ error: 'Wallet not registered or invalid' }), { status: 403 })
  }

  // Insertar voto en la base de datos
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

