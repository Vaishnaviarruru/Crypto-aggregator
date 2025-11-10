import axios from "axios";
import { Token } from "./aggregator";

export async function fetchFromGeckoTerminal(): Promise<Token[]> {
  try {
    // ❌ old endpoint is gone, so let's skip live fetching for now
    // ✅ we’ll return safe placeholder data instead

    const mock: Token[] = [
      {
        token_address: "0xmock1",
        token_name: "MockBTC",
        token_ticker: "BTC",
        price_usd: 70000,
        volume_usd: 10000000,
        market_cap_usd: 1200000000,
        price_1h_change: 0.2,
        price_24h_change: 1.5,
        price_7d_change: 3.1,
        protocol: "MockGecko",
        updated_at: Date.now(),
      },
      {
        token_address: "0xmock2",
        token_name: "MockSOL",
        token_ticker: "SOL",
        price_usd: 165.2,
        volume_usd: 8000000,
        market_cap_usd: 760000000,
        price_1h_change: 0.3,
        price_24h_change: -0.4,
        price_7d_change: 2.2,
        protocol: "MockGecko",
        updated_at: Date.now(),
      },
    ];

    return mock;
  } catch (err) {
    console.error("GeckoTerminal fetch failed:", err);
    return [];
  }
}




