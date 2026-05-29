import { consumer } from "../config/kafka";
import { updateInventory } from "../services/inventory.service";

export async function startOrderConsumer() {
  await consumer.connect();

  console.log("Inventory Consumer Connected");

  await consumer.subscribe({
    topic: "orders.created",
    fromBeginning: true,
  });

  console.log("Listening to orders.created");

  await consumer.run({
    eachMessage: async ({ message }) => {
      const value = message.value?.toString();

      if (!value) return;

      const data = JSON.parse(value);

      console.log("Inventory Event Received");

      await updateInventory(data);
    },
  });
}