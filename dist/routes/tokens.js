"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aggregator_1 = require("../services/aggregator");
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    try {
        const { q = "doge", sort, limit, cursor, time } = req.query;
        console.log(`📩 GET /tokens?q=${q}`);
        const result = await (0, aggregator_1.getAggregatedTokens)(q, sort, limit ? parseInt(limit) : undefined, cursor, time);
        // ✅ Add this debug line
        console.log("✅ Aggregated result length:", result.data?.length || 0);
        // ✅ Return result to browser
        res.status(200).json(result);
    }
    catch (err) {
        console.error("❌ Error in /tokens route:", err.message);
        res.status(500).json({
            error: "Failed to fetch tokens",
            details: err.message,
        });
    }
});
exports.default = router;
