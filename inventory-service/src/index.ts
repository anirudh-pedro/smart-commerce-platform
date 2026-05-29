import { startOrderConsumer } from "./consumers/order.consumer";
import { connectDatabase } from "./config/database";
import dotenv from "dotenv";
dotenv.config();

async function start() {
  await connectDatabase();
  await startOrderConsumer();
}

start().catch(console.error);