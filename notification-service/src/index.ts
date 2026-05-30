import dotenv from "dotenv";
dotenv.config();
import { startOrderConsumer } from "./consumers/order.consumer";
async function start() {
  await startOrderConsumer();
  console.log("Notification Service Running");
}
start().catch(console.error);
