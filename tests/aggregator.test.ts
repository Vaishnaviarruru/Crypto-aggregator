import { getAggregatedTokens } from "../src/services/aggregator";

jest.setTimeout(20000); // allow time for API calls

test("fetches DOGE tokens successfully", async () => {
  const result = await getAggregatedTokens("doge", "-price_usd", 5);
  expect(result).toHaveProperty("data");
  expect(Array.isArray(result.data)).toBe(true);
});

test("respects limit parameter", async () => {
  const result = await getAggregatedTokens("doge", undefined, 3);
  expect(result.data.length).toBeLessThanOrEqual(3);
});
