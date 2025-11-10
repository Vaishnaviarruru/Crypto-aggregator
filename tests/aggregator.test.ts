import { getAggregatedTokens } from "../src/services/aggregator";
jest.setTimeout(20000);

test("returns pagination keys", async () => {
  const res = await getAggregatedTokens("doge", "-price_usd", 5);
  expect(res).toHaveProperty("data");
  expect(res).toHaveProperty("nextCursor");
  expect(res).toHaveProperty("total");
});

test("respects limit", async () => {
  const res = await getAggregatedTokens("doge", undefined, 3);
  expect(res.data.length).toBeLessThanOrEqual(3);
});
