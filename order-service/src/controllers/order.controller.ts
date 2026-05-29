import { Request, Response } from "express";
import { createOrder } from "../services/order.service";

export async function createOrderController(
  req: Request,
  res: Response
) {
  try {
    const order = req.body;

    const result = await createOrder(order);

    res.json({
      success: true,
      order: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create order",
    });
  }
}