// In-memory rate limiter (por instancia, como los otros)
const ipRequests = new Map();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto

function rateLimit(req) {
  const ip =
    req.headers.get('x-forwarded-for') ??
    req.headers.get('x-real-ip') ??
    'unknown';

  const now = Date.now();
  const entry = ipRequests.get(ip) || { count: 0, timestamp: now };

  if (now - entry.timestamp < RATE_LIMIT_WINDOW) {
    if (entry.count >= RATE_LIMIT_MAX) {
      return {
        limited: true,
        ip,
        remaining: 0,
        timestamp: entry.timestamp,
      };
    }
    entry.count += 1;
  } else {
    entry.count = 1;
    entry.timestamp = now;
  }

  ipRequests.set(ip, entry);

  return {
    limited: false,
    ip,
    remaining: RATE_LIMIT_MAX - entry.count,
    timestamp: entry.timestamp,
  };
}

export async function GET(req) {
  const result = rateLimit(req);

  const status = result.limited ? 429 : 200;

  return new Response(
    JSON.stringify({
      message: result.limited
        ? '🚫 Rate limit exceeded'
        : '✅ Within rate limit',
      ip: result.ip,
      remaining: result.remaining,
      timestamp: new Date(result.timestamp).toISOString(),
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': RATE_LIMIT_MAX,
        'X-RateLimit-Remaining': result.remaining,
      },
    }
  );
}

