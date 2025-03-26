-- ========================================
-- 🗳️ Proof of Vote (PoV) - Schema definition
-- ========================================

-- 1. Table: polls
create table if not exists polls (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  created_at timestamp with time zone default now(),
  active boolean default true
);

-- 2. Table: poll_votes
create table if not exists poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid references polls(id) on delete cascade,
  wallet_address text not null,
  vote text check (vote in ('yes', 'no')),
  voted_at timestamp with time zone default now(),
  unique (poll_id, wallet_address)
);

-- 3. View: poll_results
create or replace view poll_results as
select
  p.id as poll_id,
  p.question,
  v.vote,
  count(*) as total_votes
from polls p
join poll_votes v on v.poll_id = p.id
group by p.id, p.question, v.vote;

