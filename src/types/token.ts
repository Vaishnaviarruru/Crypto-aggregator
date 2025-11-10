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
