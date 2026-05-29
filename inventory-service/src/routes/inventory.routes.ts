import { Router } from "express";
import { getInventoryController } from "../controllers/inventory.controller";

const router = Router();

router.get("/inventory", getInventoryController);

export default router;