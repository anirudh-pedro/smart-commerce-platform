import { producer } from "../config/kafka";

export async function createOrder(order: any) {
  await producer.send({
    topic: "orders.created",
    messages: [
      {
        value: JSON.stringify(order),
      },
    ],
  });

  return order;
}