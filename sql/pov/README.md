# 🗳️ Proof of Vote (PoV) – SQL Schema

This folder defines the isolated database schema for the **Proof of Vote** (PoV) system in MathsMine3.xyz.

## 📋 Purpose

PoV is a public voting system where only wallets that have **contributed to the MathsMine3 game** (even symbolically) can vote. The voting data is persistent, transparent, and provable.

## 📦 Structure

- `polls`: stores poll questions
- `poll_votes`: stores votes (1 per wallet per poll)
- `poll_results`: view with aggregated results

## ✅ Voting Requirements (handled in app logic)

- Wallet must be connected
- Must exist in the `contributors` view
- Must meet a minimum contribution score (e.g. `score >= 1`)

## 🧩 Notes

- This module is fully **self-contained**.
- It does **not affect** the main game's logic or data.
- Frontend route: `/pov`
- API endpoints: `/api/pov/vote`, `/api/pov/get`

