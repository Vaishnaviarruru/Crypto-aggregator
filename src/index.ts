import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import cors from "cors";
import tokensRouter from "./routes/tokens";
import { setupSocket } from "./websocket/socketHandler";

const app = express();

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "../public"))); // serve static files (dashboard)

// API routes
app.use("/tokens", tokensRouter);

// Root route (serves dashboard)
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Create server and WebSocket
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Setup WebSocket connection
setupSocket(io);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

