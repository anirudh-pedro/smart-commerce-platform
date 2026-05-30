import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDatabase } from "./config/database";
import { startOrderConsumer } from "./consumers/order.consumer";
import analyticsRoutes from "./routes/analytics.routes";
import { wsConsumer } from "./config/kafka";

const app = express();
app.use(cors());
app.use(express.json());
app.use(analyticsRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*", methods: ["GET", "POST"] } });

async function startWebSocketHub() {
  await wsConsumer.connect();
  await wsConsumer.subscribe({ topic: "orders.created" });
  await wsConsumer.subscribe({ topic: "inventory.updated" });
  await wsConsumer.subscribe({ topic: "analytics.updated" });
  await wsConsumer.subscribe({ topic: "notifications.sent" });
  
  await wsConsumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        if(!message.value) return;
        const rawPayload = JSON.parse(message.value.toString());
        
        // Heartbeat system support - emitting event to UI
        const eventData = {
          _id: Math.random().toString(36).substring(7),
          topic: topic,
          type: rawPayload.type || topic.toUpperCase().replace('.', '_'),
          service: rawPayload.service || topic.split('.')[0] + '-service',
          timestamp: rawPayload.timestamp || new Date().toISOString(),
          payload: rawPayload.payload || rawPayload,
          orderId: rawPayload.orderId || rawPayload._id || "N/A"
        };
        
        io.emit("system_event", eventData);
      } catch (err) {
        console.error("WebSocket hub message processing error:", err);
      }
    }
  });
}

async function start() {
  await connectDatabase();
  await startOrderConsumer();
  await startWebSocketHub();
  httpServer.listen(5004, () => { console.log("Analytics + WebSockets on 5004"); });
}
start().catch(console.error);
