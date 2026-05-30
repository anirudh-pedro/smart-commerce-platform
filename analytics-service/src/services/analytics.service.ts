import { Analytics } from "../models/analytics.model";
import { producer } from "../config/kafka";

export async function getAnalytics() {
  let analytics = await Analytics.findOne();
  if (!analytics) analytics = await Analytics.create({ totalOrders: 0, totalProductsSold: 0 });
  return { totalOrders: analytics.totalOrders, totalProductsSold: analytics.totalProductsSold };
}

export async function updateAnalytics(order: any) {
  let analytics: any = await Analytics.findOne();
  if (!analytics) {
    try {
      analytics = await Analytics.create({ totalOrders: 0, totalProductsSold: 0 });
    } catch (e) {
      analytics = await Analytics.findOne();
    }
  }
  if (!analytics) return; // safety fallback
  
  const quantity = Number(order.quantity);
  if (isNaN(quantity) || quantity <= 0) {
    console.error("Invalid order quantity for analytics update:", order.quantity);
    return;
  }

  analytics.totalOrders += 1;
  analytics.totalProductsSold += quantity;
  await analytics.save();
  await producer.send({
    topic: "analytics.updated",
    messages: [{ value: JSON.stringify({ orderId: order._id, type: "ANALYTICS_UPDATED", service: "Analytics Service", timestamp: new Date(), payload: { totalOrders: analytics.totalOrders, totalProductsSold: analytics.totalProductsSold } }) }]
  });
}
