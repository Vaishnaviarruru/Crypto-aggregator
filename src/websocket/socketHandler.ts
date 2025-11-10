import { Server } from "socket.io";
import { getAggregatedTokens } from "../services/aggregator";

export function setupSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    // When client subscribes to a token (like DOGE)
    socket.on("subscribe", async (query: string) => {
      console.log(`📡 Subscribed to: ${query}`);

      try {
        const result = await getAggregatedTokens(query);
        socket.emit("tokens_update", { data: result.data });
      } catch (err: any) {
        console.error("❌ Failed to fetch tokens:", err.message);
        socket.emit("error", { message: err.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });

  // Send live updates every 15 seconds automatically
  setInterval(async () => {
    try {
      const result = await getAggregatedTokens("doge");
      io.emit("tokens_update", { data: result.data });
    } catch (err: any) {
      console.error("⚠️ Background update failed:", err.message);
    }
  }, 15000);
}


