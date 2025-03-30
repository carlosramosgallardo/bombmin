# MathsMine3

![MathsMine3 logo](public/MM.jpg)

*Solve fast to mine! A fake Web3 mining game where your speed changes everything.*

---

## What is MathsMine3?

**MathsMine3** is a social experiment and educational game that simulates token mining based on how fast you can solve math problems. Your performance (and speed!) directly impacts a fictional token’s value.

No real blockchain. No actual tokens. Just Web3-style logic, wallet connection, and math logic.

---

## Core Features

- Timed math-based mining
- Token value reacts to your speed: fast = up, slow = down
- Real-time token chart with historical series
- Leaderboard tracking contributors by impact
- Wallet connection via WalletConnect / MetaMask
- Proof of Vote (PoV): contribute, qualify, vote
- Public API for charts, top miners, polls

---

## Tech Stack

- **Next.js (App Router)**
- **React + TailwindCSS**
- **Supabase** (PostgreSQL + API)
- **Ethers + Wagmi + Web3Modal**
- **Recharts** for time series data
- **Vercel** for deployment
- **GitLab** CI/CD pipelines

---

## Live Demo

[https://mathsmine3.xyz](https://mathsmine3.xyz)

---

## Local Setup

```bash
git clone https://github.com/carlosramosgallardo/MathsMine3.git
cd MathsMine3
npm install
cp .env.example .env.local
npm run dev
```

---

## Environment Variables

`.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-id
NEXT_PUBLIC_ADMIN_WALLET=0xYourWalletAddressHere
NEXT_PUBLIC_PARTICIPATION_PRICE=0.00001
NEXT_PUBLIC_GA_ENABLED=true
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

> Do **not** commit `.env.local`. It is already `.gitignore`d.

---

## Deployment

- Hosted on [Vercel](https://vercel.com)
- Automated deploy via GitLab CI/CD

---

## Database Schema (PostgreSQL)

SQL migrations are under `/sql`:

- `games` — stores each math round result
- `leaderboard` — view aggregating ETH earned per wallet
- `token_value` — current token value logic
- `token_value_timeseries` — historical hourly token stats
- `polls` — active questions for PoV
- `poll_votes` — one vote per wallet per poll
- `poll_results` — total votes and distribution per poll

---

## Public API

Public, read-only endpoints returning JSON:

| Endpoint | Description |
|----------|-------------|
| [`/api/token-value`](https://mathsmine3.xyz/api/token-value) | Latest token value |
| [`/api/token-history`](https://mathsmine3.xyz/api/token-history) | Hour-by-hour mining totals |
| [`/api/top-contributors`](https://mathsmine3.xyz/api/top-contributors) | Wallets ranked by positive mining impact |
| [`/api/pov/get`](https://mathsmine3.xyz/api/pov/get) | List of active polls (PoV) |

See [API Docs](https://mathsmine3.xyz/api) for response examples.

---

## Contributing

Pull requests are welcome. Open an issue for suggestions or bugs.

---

## Contact

📧 botsandpods@gmail.com  
🐦 [@freakingai](https://x.com/freakingai)

---

## Disclaimer

This is a fictional and educational project.  
No real tokens are mined or exchanged.  
MathsMine3 is **not** a financial product.

---

## License

MIT © [botsandpods@gmail.com](https://github.com/carlosramosgallardo)
