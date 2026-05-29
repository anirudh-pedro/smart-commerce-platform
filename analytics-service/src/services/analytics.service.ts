import { Analytics } from "../models/analytics.model";

export async function getAnalytics() {
  let analytics = await Analytics.findOne();
  if (!analytics) {
    analytics = await Analytics.create({
      totalOrders: 0,
      totalProductsSold: 0,
    });
  }
  return {
    totalOrders: analytics.totalOrders,
    totalProductsSold: analytics.totalProductsSold
  };
}

export async function updateAnalytics(order: any) {
  let analytics = await Analytics.findOne();

  if (!analytics) {
    analytics = await Analytics.create({
      totalOrders: 0,
      totalProductsSold: 0,
    });
  }

  analytics.totalOrders += 1;
  analytics.totalProductsSold += order.quantity;

  await analytics.save();

  console.log("Analytics Updated");

  console.log({
    totalOrders: analytics.totalOrders,
    totalProductsSold: analytics.totalProductsSold,
  });
}