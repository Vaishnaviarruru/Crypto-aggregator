import { Server } from "socket.io";
import { getAggregatedTokens } from "../services/aggregator";

export function setupSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    // When a client subscribes to a token
    socket.on("subscribe", async (query: string) => {
      console.log("📡 Subscribed to:", query);

      // send initial data immediately
      const result = await getAggregatedTokens(query, "-price_usd", 5);
      socket.emit("tokens_update", result);

      // send periodic updates every 15 seconds
      const interval = setInterval(async () => {
        const updated = await getAggregatedTokens(query, "-price_usd", 5);
        socket.emit("tokens_update", updated);
        console.log("🔁 Update pushed for:", query);
      }, 15000);

      // Clean up when client disconnects
      socket.on("disconnect", () => {
        clearInterval(interval);
        console.log("🔴 Client disconnected:", socket.id);
      });
    });
  });
}



