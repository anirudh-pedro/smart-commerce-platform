import { Router } from "express";
import { createOrderController, getOrdersController } from "../controllers/order.controller";

const router = Router();

router.post("/orders", createOrderController);
router.get("/orders", getOrdersController);

export default router;