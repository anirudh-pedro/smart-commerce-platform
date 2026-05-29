import { Analytics } from "../models/analytics.model";
import { producer } from "../config/kafka";

export async function getAnalytics() {
  let analytics = await Analytics.findOne();
  if (!analytics) analytics = await Analytics.create({ totalOrders: 0, totalProductsSold: 0 });
  return { totalOrders: analytics.totalOrders, totalProductsSold: analytics.totalProductsSold };
}

export async function updateAnalytics(order: any) {
  let analytics = await Analytics.findOne();
  if (!analytics) analytics = await Analytics.create({ totalOrders: 0, totalProductsSold: 0 });
  analytics.totalOrders += 1;
  analytics.totalProductsSold += order.quantity;
  await analytics.save();
  await producer.send({
    topic: "analytics.updated",
    messages: [{ value: JSON.stringify({ orderId: order._id, type: "ANALYTICS_UPDATED", service: "Analytics Service", timestamp: new Date(), payload: { totalOrders: analytics.totalOrders, totalProductsSold: analytics.totalProductsSold } }) }]
  });
}
