-- Table to store each game played
CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  wallet TEXT NOT NULL,
  problem TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_ms INTEGER NOT NULL,
  mining_reward NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);


-- Table to register unlocked NFTs per wallet
CREATE TABLE user_nfts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL CHECK (wallet = LOWER(wallet)), -- Enforce lowercase at insert
  nft_slug TEXT NOT NULL,
  image_url TEXT NOT NULL,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (wallet, nft_slug)
);


-- View to extend the leaderboard with NFT data: adds an array of unlocked NFTs per wallet
CREATE OR REPLACE VIEW leaderboard_with_nfts AS
SELECT
  l.wallet,
  l.total_eth,
  COALESCE(
    json_agg(json_build_object(
      'id', u.id,
      'slug', u.nft_slug,
      'image_url', u.image_url
    ) ORDER BY u.unlocked_at) 
    FILTER (WHERE u.id IS NOT NULL), 
    '[]'
  ) AS nfts
FROM leaderboard l
LEFT JOIN user_nfts u ON LOWER(u.wallet) = l.wallet
GROUP BY l.wallet, l.total_eth;


-- View to calculate the total token value (accumulated reward)
CREATE OR REPLACE VIEW token_value AS
SELECT
  SUM(mining_reward) AS total_eth
FROM games
WHERE is_correct = TRUE;

-- Time-series view to track token growth over time (hourly resolution)
CREATE OR REPLACE VIEW token_value_timeseries AS
WITH hour_series AS (
  SELECT generate_series(
    date_trunc('hour', (SELECT MIN(created_at) FROM games)), 
    date_trunc('hour', NOW()), 
    interval '1 hour'
  ) AS hour
),
hour_rewards AS (
  SELECT
    date_trunc('hour', created_at) AS hour,
    SUM(mining_reward) AS total_hour
  FROM games
  WHERE is_correct = TRUE
  GROUP BY date_trunc('hour', created_at)
),
final AS (
  SELECT
    hs.hour,
    COALESCE(hr.total_hour, 0) AS hourly_reward
  FROM hour_series hs
  LEFT JOIN hour_rewards hr ON hr.hour = hs.hour
)
SELECT
  hour,
  SUM(hourly_reward) OVER (
    ORDER BY hour ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS cumulative_reward
FROM final;

-- ⚠️ Do NOT use ORDER BY in a view definition; order should be applied at query time

-- Extension required for generating random UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table to register each incoming API request for rate limiting purposes
CREATE TABLE api_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Optional view to monitor request activity by IP and endpoint
CREATE OR REPLACE VIEW api_rate_summary AS
SELECT
  ip,
  endpoint,
  COUNT(*) AS total_requests,
  MAX(created_at) AS last_request
FROM api_requests
GROUP BY ip, endpoint;
