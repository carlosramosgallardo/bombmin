# MathsMine3

![MathsMine3 logo](public/MM.jpg)

---

## What is MathsMine3?

The fake Web3 platform where mining means solving math challenges and people around the world propose and vote on ideas freely, openly, and transparently.

---

## Core Features

- **Timed Math Rounds:** Solve math problems as fast as you can.
- **Dynamic Token Value:** Your speed influences a fictional token’s value.
- **Real-Time Token Chart:** Visualize token history with live data.
- **Leaderboard:** See top contributors by mining impact.
- **Wallet Connection:** Connect via WalletConnect or MetaMask.
- **Proof of Vote (PoV):** Vote on community polls.
- **Proof of Ask (PoA):** Create a poll (one per wallet).
- **Public API:** Endpoints for token value, history, contributors, and polls.

---

## Tech Stack

- **Next.js (App Router)**
- **React + TailwindCSS**
- **Supabase** (PostgreSQL with REST API)
- **Ethers, Wagmi, Web3Modal** for blockchain-like interactions
- **Recharts** for charting time series data
- **Vercel** for deployment
- **GitLab CI/CD** pipelines

---

## Live Demo

[https://mathsmine3.xyz](https://mathsmine3.xyz)

---

## Project Structure

```
MathsMine3/
├── app/
│   ├── api/                  # Public API endpoints (token-value, token-history, top-contributors, pov)
│   ├── legal/                # Legal information pages
│   ├── manifesto/            # Manifesto page
│   ├── pov/                  # Proof of Vote pages (voting, leaderboard, etc.)
│   ├── poa/                  # Proof of Ask page (create poll)
│   ├── globals.css           # Global CSS styles
│   └── layout.jsx            # Application layout component
├── components/               # Reusable UI components (Header, Footer, Board, Leaderboard, ConnectAndPlay, TokenChart, NavLinks, etc.)
├── lib/                      # Libraries (Supabase client, rateLimitConfig)
├── public/                   # Public assets (images, ads.txt, robots.txt, sitemap.xml)
├── sql/                      # SQL migrations and documentation
│   ├── database.sql          # Main database schema
│   └── pov/                  # SQL for PoV related tables/views
├── .env                      # Environment variables (do not commit)
├── package.json              # Project dependencies and scripts
├── tailwind.config.js        # TailwindCSS configuration
├── postcss.config.js         # PostCSS configuration
└── README.md                 # This file
```

---

## Local Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/carlosramosgallardo/MathsMine3.git
cd MathsMine3
npm install
cp .env.example .env.local
npm run dev
```

> **Note:** Do **not** commit your `.env.local` file. It is already included in `.gitignore`.

---

## Environment Variables

Example of `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-id
NEXT_PUBLIC_ADMIN_WALLET=0xYourWalletAddressHere
NEXT_PUBLIC_PARTICIPATION_PRICE=0.00001
NEXT_PUBLIC_GA_ENABLED=true
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## Database Schema

SQL migrations can be found in the `/sql` directory:

- **games:** Stores each math round result.
- **leaderboard:** View aggregating ETH earned per wallet.
- **token_value:** Current token value logic.
- **token_value_timeseries:** Historical hourly token stats.
- **polls:** Active questions for Proof of Vote/Ask (with a UNIQUE wallet_address constraint).
- **poll_votes:** Stores one vote per wallet per poll.

---

## Public API Endpoints

| Endpoint                                | Description                                           |
|-----------------------------------------|-------------------------------------------------------|
| [`/api/token-value`](https://mathsmine3.xyz/api/token-value)        | Latest token value                                    |
| [`/api/token-history`](https://mathsmine3.xyz/api/token-history)        | Hour-by-hour mining totals                            |
| [`/api/top-contributors`](https://mathsmine3.xyz/api/top-contributors)  | Wallets ranked by positive mining impact              |
| [`/api/pov/get`](https://mathsmine3.xyz/api/pov/get)                    | List of active polls (Proof of Vote)                  |

See the [API Docs](https://mathsmine3.xyz/api) for response examples.

---

## Contributing

Pull requests are welcome. Open an issue for suggestions or bugs.

---

## Contact

- **Email:** botsandpods@gmail.com  
- **Twitter:** [@freakingai](https://x.com/freakingai)

---

## Disclaimer

This is a fictional and educational project.  
No real tokens are mined or exchanged.  
MathsMine3 is **not** a financial product.

---

## License

MIT © [botsandpods@gmail.com](https://github.com/carlosramosgallardo)