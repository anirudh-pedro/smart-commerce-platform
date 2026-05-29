import dotenv from "dotenv";

dotenv.config();

import express from "express";
import { connectDatabase } from "./config/database";
import { startOrderConsumer } from "./consumers/order.consumer";
import analyticsRoutes from "./routes/analytics.routes";

const app = express();
app.use(express.json());
app.use(analyticsRoutes);

async function start() {
  await connectDatabase();

  await startOrderConsumer();

  app.listen(5004, () => {
    console.log("Analytics Service Running on port 5004");
  });
}

start().catch(console.error);