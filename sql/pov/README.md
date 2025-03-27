# Proof of Vote (PoV) – SQL Schema

Schema for the **PoV** system in MathsMine3.xyz. Built to allow voting by verified participants only.

---

## Tables

### `polls`
Stores poll metadata.

```sql
CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);
```

### `poll_votes`
Stores each vote. One vote per wallet per poll.

```sql
CREATE TABLE poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  vote TEXT CHECK (vote IN ('yes', 'no')),
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (poll_id, wallet_address)
);
```

---

## Views

### `poll_results`
Aggregated vote results per poll.

```sql
CREATE VIEW poll_results AS
SELECT
  p.id AS poll_id,
  p.question,
  v.vote,
  COUNT(*) AS total_votes
FROM polls p
JOIN poll_votes v ON v.poll_id = p.id
GROUP BY p.id, p.question, v.vote;
```

---

## Voting Logic (handled in frontend)

- Wallet must be connected
- Must exist in the `leaderboard` view
- Must have mined ≥ `0.00001 ETH`

---

## Integration

- App route: `/pov`
- API:  
  - `GET /api/pov/get`  
  - `GET /api/pov/has-voted` *(not public)*

This module is standalone and does not affect mining mechanics.
