# 📊 SQL Schema — MathsMine3

This folder contains the SQL logic used to support the backend of **MathsMine3**, including tables and views that simulate the token mining system and protect public endpoints from abuse.

All SQL is designed to work with **Supabase (PostgreSQL)**.

---

## 🧩 Tables

### 1. `games`
Stores each completed math challenge with results and metadata.

```sql
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
```

- **wallet**: user's connected wallet address
- **problem**: the math operation shown
- **user_answer**: their submitted response
- **is_correct**: whether the answer was correct
- **mining_reward**: positive or negative ETH simulated
- **time_ms**: time in milliseconds

---

### 2. `api_requests`
Stores each incoming call to an API endpoint, used for persistent rate limiting.

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE api_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

- **ip**: client IP address
- **endpoint**: the requested API route (e.g., `/api/token-value`)
- **created_at**: when the request occurred

---

## 📈 Views

### 3. `leaderboard`
Aggregates total ETH per wallet (correct answers only):

```sql
CREATE VIEW leaderboard AS
SELECT
  wallet,
  SUM(mining_reward) AS total_eth
FROM games
WHERE is_correct = TRUE
GROUP BY wallet;
```

---

### 4. `token_value`
Cumulative token simulation:

```sql
CREATE VIEW token_value AS
SELECT
  SUM(mining_reward) AS total_eth
FROM games
WHERE is_correct = TRUE;
```

---

### 5. `token_value_timeseries`
Hourly time series of token value (for charting):

```sql
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
  SUM(hourly_reward) OVER (ORDER BY hour) AS cumulative_reward
FROM final;
```

---

## 📁 Notes

- All views are read-only and auto-updating based on the `games` table.
- These queries are used in Supabase + Next.js to build the chart and leaderboard.

---

## 🧠 License

MIT — See root LICENSE file.