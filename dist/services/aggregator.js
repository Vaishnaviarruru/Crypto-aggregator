"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAggregatedTokens = getAggregatedTokens;
const dexScreener_1 = require("./dexScreener");
const geckoTerminal_1 = require("./geckoTerminal");
const cache_1 = require("../utils/cache");
// merge same tokens
function mergeTokens(a, b) {
    const map = new Map();
    const add = (t) => {
        const key = (t.token_address || "").toLowerCase();
        const old = map.get(key);
        if (!old)
            map.set(key, t);
        else {
            map.set(key, {
                ...old,
                ...t,
                price_usd: old.price_usd && t.price_usd
                    ? (old.price_usd + t.price_usd) / 2
                    : old.price_usd ?? t.price_usd ?? null,
                updated_at: Math.max(old.updated_at, t.updated_at),
            });
        }
    };
    a.forEach(add);
    b.forEach(add);
    return Array.from(map.values());
}
// sort tokens
function sortTokens(list, sort) {
    if (!sort)
        return list;
    const desc = sort.startsWith("-");
    const key = desc ? sort.slice(1) : sort;
    return list.slice().sort((x, y) => desc ? (y[key] ?? 0) - (x[key] ?? 0) : (x[key] ?? 0) - (y[key] ?? 0));
}
// filter by time period (1h / 24h / 7d)
function filterByTime(list, time) {
    if (!time)
        return list;
    if (time === "1h")
        return list.filter((t) => t.price_1h_change !== null && t.price_1h_change !== undefined);
    if (time === "24h")
        return list.filter((t) => t.price_24h_change !== null && t.price_24h_change !== undefined);
    if (time === "7d")
        return list.filter((t) => t.price_7d_change !== null && t.price_7d_change !== undefined);
    return list;
}
// pagination helper
function paginate(list, limit = 20, cursor) {
    let start = 0;
    if (cursor)
        start = parseInt(Buffer.from(cursor, "base64").toString()) || 0;
    const end = Math.min(start + limit, list.length);
    const nextCursor = end < list.length ? Buffer.from(String(end)).toString("base64") : null;
    return { data: list.slice(start, end), nextCursor, total: list.length };
}
// main aggregator function
async function getAggregatedTokens(q, sort, limit, cursor, time) {
    try {
        const key = `agg:${q}`;
        const cached = await (0, cache_1.getCached)(key);
        if (cached)
            return paginate(sortTokens(cached, sort), limit ?? 20, cursor);
        console.log("🔍 Fetching fresh tokens...");
        // fetch both APIs — if one fails, we catch it
        const [dex, gecko] = await Promise.all([
            (0, dexScreener_1.fetchFromDexScreener)(q).catch((err) => {
                console.error("DexScreener failed:", err.message);
                return [];
            }),
            (0, geckoTerminal_1.fetchFromGeckoTerminal)().catch((err) => {
                console.error("GeckoTerminal failed:", err.message);
                return [];
            }),
        ]);
        const merged = mergeTokens(dex, gecko);
        // if both APIs fail → use fallback mock
        if (merged.length === 0) {
            console.warn("⚠️ No real tokens found, returning fallback data.");
            const fallback = [
                {
                    token_address: "0xmockdoge",
                    token_name: "MockDoge",
                    token_ticker: "DOGE",
                    price_usd: 0.0812,
                    volume_usd: 1200000,
                    market_cap_usd: 11400000000,
                    price_1h_change: 0.1,
                    price_24h_change: -0.5,
                    price_7d_change: 2.1,
                    protocol: "MockData",
                    updated_at: Date.now(),
                },
                {
                    token_address: "0xmocketh",
                    token_name: "MockETH",
                    token_ticker: "ETH",
                    price_usd: 3421.45,
                    volume_usd: 43285944,
                    market_cap_usd: 409932943000,
                    price_1h_change: 0.3,
                    price_24h_change: 1.1,
                    price_7d_change: 4.2,
                    protocol: "MockData",
                    updated_at: Date.now(),
                },
            ];
            await (0, cache_1.setCached)(key, fallback);
            return paginate(fallback, limit ?? 20, cursor);
        }
        // apply filter by time
        const filtered = filterByTime(merged, time);
        await (0, cache_1.setCached)(key, filtered);
        return paginate(sortTokens(filtered, sort), limit ?? 20, cursor);
    }
    catch (err) {
        console.error("💥 getAggregatedTokens failed:", err.message);
        return {
            data: [],
            nextCursor: null,
            total: 0,
        };
    }
}
