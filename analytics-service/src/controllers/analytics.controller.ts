import { Request, Response } from "express";
import { getAnalytics } from "../services/analytics.service";

export async function getAnalyticsController(req: Request, res: Response) {
  try {
    const analytics = await getAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error("Failed to fetch analytics", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
}