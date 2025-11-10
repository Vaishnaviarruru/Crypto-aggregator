import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import tokensRouter from "./routes/tokens";
import { setupSocket } from "./websocket/socketHandler";

const app = express();
app.use(cors());
app.use(express.static("public")); // 👈 Important: serve your HTML file
app.use("/tokens", tokensRouter);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// setup websocket
setupSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
