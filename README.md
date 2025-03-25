# MathsMine3

![MathsMine3 logo](public/MM.jpg)

*Solve fast to mine! A fake Web3 mining game where your speed changes everything.*

---

## 📌 What is MathsMine3?

**MathsMine3** is a social experiment and educational game that simulates token mining based on how fast you can solve math problems. Your performance (and speed!) directly impacts a fictional token’s value.

No real blockchain. No actual tokens. Just Web3-style logic, wallet connection, and math fun.

---

## 🧩 Core Features

- ⏱ Timed math challenges
- 🧠 Token mining simulation based on reaction speed
- 📊 Token chart with time series
- 🏆 Leaderboard for top contributors
- 👛 Wallet connection via WalletConnect / MetaMask
- 💸 Optional symbolic donation using ETH
- 🔗 [Manifesto](https://mathsmine3.xyz/manifesto) — Learn the philosophy behind the project
- 🚁 [Public API](https://mathsmine3.xyz/api) — Query token value and top contributors

---

## ⚙️ Tech Stack

- **Next.js (App Router)**
- **React + TailwindCSS**
- **Supabase** (PostgreSQL + API)
- **Ethers + Wagmi + Web3Modal**
- **Recharts** (charting)
- **Vercel** for deployment
- **GitLab** for CI/CD integration

---

## 🚀 Live Demo

🌍 [https://mathsmine3.xyz](https://mathsmine3.xyz)

---

## 🛠️ Local Setup

```bash
git clone https://github.com/carlosramosgallardo/MathsMine3.git
cd MathsMine3
npm install
cp .env.example .env.local
npm run dev
```

---

## 🔐 Environment Variables

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

> ⚠️ Do **not** commit `.env.local`. It is gitignored.

---

## ⚖️ Legal Pages

- [/legal](https://mathsmine3.xyz/legal) — Privacy, terms, disclaimer
- [/manifesto](https://mathsmine3.xyz/manifesto) — Project philosophy
- [/api](https://mathsmine3.xyz/api) — Public API docs
- [/robots.txt](https://mathsmine3.xyz/robots.txt)
- [/sitemap.xml](https://mathsmine3.xyz/sitemap.xml)

---

## ☁️ Deployment

- Deployed with [Vercel](https://vercel.com)
- Integrated with GitLab for CI/CD

---

## 🧠 Database Schema

All logic lives in `/sql`, including:

- `games` table
- `leaderboard` view
- `token_value` view
- `token_value_timeseries` view

---

## 🤝 Contributing

Feedback and PRs welcome! Open an issue if you have ideas or improvements.

---

## 📬 Contact

📧 botsandpods@gmail.com  
🐦 [@freakingai](https://x.com/freakingai)

---

## 🧪 Disclaimer

This is a fictional and educational project.  
No actual cryptocurrency is mined, created, or exchanged.  
MathsMine3 is **not** a financial product.

---

## 📘 License

MIT © [botsandpods@gmail.com](https://github.com/carlosramosgallardo)