import { getAggregatedTokens } from "../src/services/aggregator";

jest.setTimeout(20000);

test("pagination returns nextCursor correctly", async () => {
  const first = await getAggregatedTokens("doge", "-price_usd", 2);
  expect(first).toHaveProperty("nextCursor");
  const next = await getAggregatedTokens("doge", "-price_usd", 2, first.nextCursor || undefined);
  expect(Array.isArray(next.data)).toBe(true);
  if (first.data.length > 0 && next.data.length > 0) {
    expect(first.data[0].token_address).not.toBe(next.data[0].token_address);
  }
});
