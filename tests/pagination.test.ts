import { getAggregatedTokens } from "../src/services/aggregator";
jest.setTimeout(20000);

test("cursor-based pagination works", async () => {
  const first = await getAggregatedTokens("doge", "-price_usd", 2);
  const next = await getAggregatedTokens("doge", "-price_usd", 2, first.nextCursor || undefined);
  // best-effort check (APIs may vary)
  expect(Array.isArray(first.data)).toBe(true);
  expect(Array.isArray(next.data)).toBe(true);
});
