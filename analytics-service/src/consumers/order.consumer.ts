import { consumer } from "../config/kafka";
import { updateAnalytics } from "../services/analytics.service";

export async function startOrderConsumer() {
  await consumer.connect();

  console.log("Analytics Consumer Connected");

  await consumer.subscribe({
    topic: "orders.created",
    fromBeginning: true,
  });

  console.log("Listening to orders.created");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const value = message.value?.toString();

      if (!value) return;

      const order = JSON.parse(value);

      await updateAnalytics(order);
    },
  });
}