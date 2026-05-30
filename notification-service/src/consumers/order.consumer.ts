import { consumer, producer } from "../config/kafka";
import { processNotification } from "../services/notification.service";
export async function startOrderConsumer() {
  await consumer.connect();
  await producer.connect();
  await consumer.subscribe({ topic: "orders.created", fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        if (!message.value) return;
        const payload = JSON.parse(message.value.toString());
        const order = payload.type === 'ORDER_CREATED' ? payload.payload : payload;
        await processNotification(order);
      } catch (err) {
        console.error("Notification consumer error:", err);
      }
    },
  });
}
