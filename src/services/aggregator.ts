import { fetchFromDexScreener } from "./dexScreener";
import { fetchFromGeckoTerminal } from "./geckoTerminal";
import { getCached, setCached } from "../utils/cache";

export type Token = {
  token_address: string;
  token_name: string;
  token_ticker: string;
  price_usd: number | null;
  volume_usd?: number | null;
  market_cap_usd?: number | null;
  price_1h_change?: number | null;
  price_24h_change?: number | null;
  price_7d_change?: number | null;
  protocol?: string | null;
  updated_at: number;
};

// merge same tokens
function mergeTokens(a: Token[], b: Token[]): Token[] {
  const map = new Map<string, Token>();
  const add = (t: Token) => {
    const key = (t.token_address || "").toLowerCase();
    const old = map.get(key);
    if (!old) map.set(key, t);
    else {
      map.set(key, {
        ...old,
        ...t,
        price_usd:
          old.price_usd && t.price_usd
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
function sortTokens(list: Token[], sort?: string) {
  if (!sort) return list;
  const desc = sort.startsWith("-");
  const key = desc ? sort.slice(1) : sort;
  return list.slice().sort((x: any, y: any) =>
    desc ? (y[key] ?? 0) - (x[key] ?? 0) : (x[key] ?? 0) - (y[key] ?? 0)
  );
}

// filter by time period (1h / 24h / 7d)
function filterByTime(list: Token[], time?: string) {
  if (!time) return list;
  if (time === "1h")
    return list.filter(
      (t) => t.price_1h_change !== null && t.price_1h_change !== undefined
    );
  if (time === "24h")
    return list.filter(
      (t) => t.price_24h_change !== null && t.price_24h_change !== undefined
    );
  if (time === "7d")
    return list.filter(
      (t) => t.price_7d_change !== null && t.price_7d_change !== undefined
    );
  return list;
}

// pagination helper
function paginate(list: Token[], limit = 20, cursor?: string) {
  let start = 0;
  if (cursor) start = parseInt(Buffer.from(cursor, "base64").toString()) || 0;
  const end = Math.min(start + limit, list.length);
  const nextCursor =
    end < list.length ? Buffer.from(String(end)).toString("base64") : null;
  return { data: list.slice(start, end), nextCursor, total: list.length };
}

// main aggregator function
export async function getAggregatedTokens(
  q: string,
  sort?: string,
  limit?: number,
  cursor?: string,
  time?: "1h" | "24h" | "7d"
) {
  try {
    const key = `agg:${q}`;
    const cached = await getCached<Token[]>(key);
    if (cached) return paginate(sortTokens(cached, sort), limit ?? 20, cursor);

    console.log("🔍 Fetching fresh tokens...");

    // fetch both APIs — if one fails, we catch it
    const [dex, gecko] = await Promise.all([
      fetchFromDexScreener(q).catch((err) => {
        console.error("DexScreener failed:", err.message);
        return [];
      }),
      fetchFromGeckoTerminal().catch((err) => {
        console.error("GeckoTerminal failed:", err.message);
        return [];
      }),
    ]);

    const merged = mergeTokens(dex, gecko);

    // if both APIs fail → use fallback mock
    if (merged.length === 0) {
      console.warn("⚠️ No real tokens found, returning fallback data.");
      const fallback: Token[] = [
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
      await setCached(key, fallback);
      return paginate(fallback, limit ?? 20, cursor);
    }

    // apply filter by time
    const filtered = filterByTime(merged, time);
    await setCached(key, filtered);
    return paginate(sortTokens(filtered, sort), limit ?? 20, cursor);
  } catch (err: any) {
    console.error("💥 getAggregatedTokens failed:", err.message);
    return {
      data: [],
      nextCursor: null,
      total: 0,
    };
  }
}
