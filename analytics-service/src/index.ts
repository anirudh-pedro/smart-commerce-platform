import dotenv from "dotenv";

dotenv.config();

import { connectDatabase } from "./config/database";
import { startOrderConsumer } from "./consumers/order.consumer";

async function start() {
  await connectDatabase();

  await startOrderConsumer();
}

start().catch(console.error);