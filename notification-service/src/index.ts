import { startOrderConsumer } from "./consumers/order.consumer";

async function start() {
  await startOrderConsumer();
}

start().catch(console.error);