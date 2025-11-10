import express from "express";
import { getAggregatedTokens } from "../services/aggregator";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { q = "doge", sort, limit, cursor, time } = req.query;
    console.log(`📩 GET /tokens?q=${q}`);

    const result = await getAggregatedTokens(
      q as string,
      sort as string,
      limit ? parseInt(limit as string) : undefined,
      cursor as string,
      time as "1h" | "24h" | "7d"
    );

    // ✅ Add this debug line
    console.log("✅ Aggregated result length:", result.data?.length || 0);

    // ✅ Return result to browser
    res.status(200).json(result);
  } catch (err: any) {
    console.error("❌ Error in /tokens route:", err.message);
    res.status(500).json({
      error: "Failed to fetch tokens",
      details: err.message,
    });
  }
});

export default router;

