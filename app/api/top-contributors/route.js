import { createClient } from '@supabase/supabase-js'
import {
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
  getRateLimitHeaders
} from '@/lib/rateLimitConfig'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function GET(req) {
  const ip =
    req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  const endpoint = '/api/top-contributors'

  // Registrar la petición
  await supabase.from('api_requests').insert({ ip, endpoint })

  // Calcular ventana
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()

  const { count, error: countError } = await supabase
    .from('api_requests')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .eq('endpoint', endpoint)
    .gte('created_at', since)

  if (countError) {
    console.error('Rate check error:', countError.message)
    return new Response(JSON.stringify({ error: 'Rate check failed' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getRateLimitHeaders(count ?? 0)
      }
    })
  }

  if (count >= RATE_LIMIT_MAX) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        ...getRateLimitHeaders(count)
      }
    })
  }

  // Obtener los top contributors
  const { data, error } = await supabase
    .from('leaderboard')
    .select('wallet, total_eth')
    .order('total_eth', { ascending: false })
    .limit(10)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getRateLimitHeaders(count)
      }
    })
  }

  if (!data || data.length === 0) {
    return new Response(JSON.stringify({ error: 'No contributors found.' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...getRateLimitHeaders(count)
      }
    })
  }

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60',
      ...getRateLimitHeaders(count + 1)
    }
  })
}
