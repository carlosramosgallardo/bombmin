import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const RATE_LIMIT_MAX = 10; // Max number of requests
const RATE_LIMIT_WINDOW_SECONDS = 60; // Window size in seconds

export async function GET(req) {
  const ip =
    req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';

  // Register the request
  await supabase.from('api_requests').insert({
    ip,
    endpoint: '/api/top-contributors',
  });

  // Count the requests made by this IP in the past window
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_SECONDS * 1000).toISOString();

  const { count, error: countError } = await supabase
    .from('api_requests')
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .eq('endpoint', '/api/top-contributors')
    .gte('created_at', since);

  if (countError) {
    console.error('Rate check error:', countError.message);
    return new Response(JSON.stringify({ error: 'Rate check failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (count >= RATE_LIMIT_MAX) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': RATE_LIMIT_MAX,
          'X-RateLimit-Remaining': 0,
        },
      }
    );
  }

  // Query the leaderboard
  const { data, error } = await supabase
    .from('leaderboard')
    .select('wallet, total_eth')
    .order('total_eth', { ascending: false })
    .limit(10);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!data || data.length === 0) {
    return new Response(JSON.stringify({ error: 'No contributors found.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Return the top contributors, with appropriate caching
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=60', // Cache for 60 seconds
    },
  });
}
