import express from "express";
import { getAggregatedTokens } from "../services/aggregator";

const router = express.Router();

// GET /tokens?q=doge&limit=5&sort=-price_usd&time=24h
router.get("/", async (req, res) => {
  try {
    const { q, sort, limit, cursor, time } = req.query;

    // call main function
    const result = await getAggregatedTokens(
      q?.toString() || "doge",                                  // default query = "doge"
      sort?.toString(),                                          // sorting (optional)
      limit ? parseInt(limit.toString()) : undefined,            // pagination limit
      cursor?.toString(),                                        // pagination cursor
      (time as "1h" | "24h" | "7d") || undefined                 // time filter
    );

    res.json(result);
  } catch (err: any) {
    console.error("💥 Route /tokens failed:", err.message || err);
    res
      .status(500)
      .json({ error: "Failed to fetch tokens", details: err.message });
  }
});

export default router;
