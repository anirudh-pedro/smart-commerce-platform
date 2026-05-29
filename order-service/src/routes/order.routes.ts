import { Router } from "express";
import { createOrderController } from "../controllers/order.controller";

const router = Router();

router.post("/orders", createOrderController);

export default router;