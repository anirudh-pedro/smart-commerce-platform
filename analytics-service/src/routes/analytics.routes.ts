import { Router } from "express";
import { getAnalyticsController } from "../controllers/analytics.controller";

const router = Router();

router.get("/analytics", getAnalyticsController);

export default router;