# 🚀 Crypto Aggregator — Real-Time Token Dashboard
Description:“Real-time Crypto Data Aggregator with WebSocket and Redis caching”
This project aggregates live cryptocurrency token data from **DexScreener** (and optionally GeckoTerminal),  
caches results in **Redis (Upstash)**, and streams live updates to the frontend using **Socket.IO**.

---

## 🧠 Features
✅ Aggregates token prices and volumes in real time  
✅ Uses Redis caching to improve performance  
✅ REST API endpoint: `/tokens?q=<token>`  
✅ Live updates via WebSocket  
✅ Minimal dashboard UI (HTML + JS)  

---

## 🧰 Tech Stack
- Node.js + TypeScript  
- Express.js  
- Redis (Upstash)  
- Socket.io  
- Jest + Supertest (for testing)

---

## ⚙️ Installation

```bash
git clone https://github.com/Vaishnaviarruru/Crypto-aggregator
cd crypto-aggregator
npm install
cp .env.example .env
npm run dev
