import { consumer, producer } from "../config/kafka";
import { updateInventory } from "../services/inventory.service";
export async function startOrderConsumer() {
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic: "orders.created", fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const payload = JSON.parse(message.value.toString());
      // Adjust if payload is nested
      const order = payload.type === 'ORDER_CREATED' ? payload.payload : payload;
      await updateInventory(order);
    },
  });
}
