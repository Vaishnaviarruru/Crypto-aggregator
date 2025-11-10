# 🚀 Crypto Aggregator — Real-time Data Aggregation Service

A real-time cryptocurrency data aggregation service built with **Node.js**, **TypeScript**, and **WebSockets**.  
It continuously fetches live token prices and metrics from **DexScreener** and **GeckoTerminal**, merges the data,  
caches it using **Upstash Redis**, and streams live updates to clients via **Socket.io**.

---

## 🌐 Live Demo

🖥️ **Dashboard:** [https://crypto-aggregator-msa2.onrender.com](https://crypto-aggregator-msa2.onrender.com)

📡 **API Example:**  
[https://crypto-aggregator-msa2.onrender.com/tokens?q=doge](https://crypto-aggregator-msa2.onrender.com/tokens?q=doge)

---

## 🧠 Overview

This project is a **backend + frontend system** for aggregating cryptocurrency data in real time.

### ✨ Key Features
- 🔁 Fetches token data from **DexScreener** and **GeckoTerminal**
- ⚡ Combines results, filters, and caches them efficiently
- 💾 Caches responses using **Redis (Upstash)**
- 🔊 Streams real-time updates with **Socket.io**
- 🧮 Supports query params like `q`, `sort`, `limit`, and `cursor`
- 🖥️ Simple frontend dashboard to view live data

---

## 🧩 Tech Stack

| Layer | Technology |
|--------|-------------|
| Backend | Node.js, Express, TypeScript |
| Realtime | Socket.io (WebSockets) |
| Data Sources | DexScreener API, GeckoTerminal API |
| Caching | Redis (Upstash) |
| Hosting | Render |
| Frontend | HTML, JavaScript (Vanilla) |

---

## 📂 Project Structure

crypto-aggregator/
├── src/
│ ├── index.ts # Main entry point (server)
│ ├── routes/
│ │ └── tokens.ts # /tokens API route
│ ├── services/
│ │ ├── dexScreener.ts # DexScreener API logic
│ │ ├── geckoTerminal.ts # GeckoTerminal API logic
│ │ └── aggregator.ts # Combines + filters data
│ ├── utils/
│ │ ├── cache.ts # Redis caching
│ │ └── backoff.ts # Retry logic for API calls
│ └── websocket/
│ └── socketHandler.ts # Socket.io real-time updates
├── public/
│ └── index.html # Frontend dashboard
├── .env # Environment variables
├── package.json
├── tsconfig.json
└── README.md



---

## ⚙️ Environment Variables

Create a `.env` file in your project root with the following:

```env
PORT=3000
REDIS_URL=rediss://default:<your_upstash_redis_url>
CACHE_TTL_SECONDS=30
DEFAULT_QUERY=doge

⚙️ Running Locally
bash

# 1️⃣ Clone the repository
git clone https://github.com/Vaishnaviarruru/Crypto-aggregator.git
cd Crypto-aggregator

# 2️⃣ Install dependencies
npm install

# 3️⃣ Create the .env file
cp .env.example .env
# (or manually create .env using the values above)

# 4️⃣ Start the development server
npm run dev
Now open your browser:

Dashboard: http://localhost:3000

API Endpoint: http://localhost:3000/tokens?q=doge

👩‍💻 Author
Vaishnavi Arruru
💼 GitHub Profile

✅ Status
Feature	Status
API /tokens working	✅
Redis caching (Upstash)	✅
WebSocket real-time updates	✅
Frontend dashboard	✅
Render deployment	✅

 Thank You!




---

✅ **Next Steps**
1. Open VS Code → open your project folder.  
2. Create a new file named `README.md`.  
3. Paste the above text.  
4. Save → Commit → Push:  
   ```bash
   git add README.md
   git commit -m "docs: added final README with Render link"
   git push origin main
