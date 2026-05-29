import { producer } from "../config/kafka";
import { Order } from "../models/order.model";

export async function createOrder(orderData: any) {
  // Save order into MongoDB
  const order = new Order(orderData);
  await order.save();

  // Publish Kafka event orders.created
  await producer.send({
    topic: "orders.created",
    messages: [
      {
        value: JSON.stringify(order.toJSON()),
      },
    ],
  });

  return order;
}

export async function getOrders() {
  return await Order.find().sort({ createdAt: -1 });
}