import { startOrderConsumer } from "./consumers/order.consumer";
import { connectDatabase } from "./config/database";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import inventoryRoutes from "./routes/inventory.routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(inventoryRoutes);

async function start() {
  await connectDatabase();
  await startOrderConsumer();

  app.listen(5002, () => {
    console.log("Inventory Service Running on port 5002");
  });
}

start().catch(console.error);