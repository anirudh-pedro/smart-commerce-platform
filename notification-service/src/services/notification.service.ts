import { producer } from "../config/kafka";

export async function processNotification(order: any) {
  console.log("Processing notification for:", order._id);
  await producer.send({
    topic: "notifications.sent",
    messages: [{ value: JSON.stringify({ orderId: order._id, type: "NOTIFICATIONS_SENT", service: "Notification Service", timestamp: new Date(), payload: { status: "SENT", type: "EMAIL" } }) }]
  });
}
