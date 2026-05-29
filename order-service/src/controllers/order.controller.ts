import { Request, Response } from "express";
import { createOrder, getOrders } from "../services/order.service";

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

export async function getOrdersController(
  req: Request,
  res: Response
) {
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}