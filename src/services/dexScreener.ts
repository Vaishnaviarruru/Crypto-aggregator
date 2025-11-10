import axios from "../utils/backoff";
import { Token } from "../services/aggregator";

export async function fetchFromDexScreener(q: string): Promise<Token[]> {
  try {
    console.log(`🔍 Fetching from DexScreener for query: ${q}`);
    const res = await axios.get(`https://api.dexscreener.com/latest/dex/search?q=${q}`);

    if (!res.data || !res.data.pairs) {
      console.error("❌ DexScreener returned no pairs");
      return [];
    }

    // Map results to your Token type
    const tokens: Token[] = res.data.pairs.map((p: any) => ({
      token_address: p.baseToken?.address || "",
      token_name: p.baseToken?.name || "Unknown",
      token_ticker: p.baseToken?.symbol || "UNK",
      price_usd: parseFloat(p.priceUsd) || null,
      volume_usd: p.volume?.h24 || null,
      market_cap_usd: null,
      price_1h_change: p.priceChange?.h1 || null,
      price_24h_change: p.priceChange?.h24 || null,
      price_7d_change: null,
      protocol: "DexScreener",
      updated_at: Date.now(),
    }));

    console.log(`✅ DexScreener returned ${tokens.length} tokens`);
    return tokens;
  } catch (err: any) {
    console.error("⚠️ DexScreener fetch failed:", err.message);

    // return mock data so your app still works
    return [
      {
        token_address: "0xmockdex",
        token_name: "DexMock",
        token_ticker: "DEX",
        price_usd: 1.23,
        volume_usd: 10000,
        market_cap_usd: 999999,
        price_1h_change: 0.1,
        price_24h_change: 0.5,
        price_7d_change: 2.3,
        protocol: "DexMock",
        updated_at: Date.now(),
      },
    ];
  }
}






