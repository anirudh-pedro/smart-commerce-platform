import { Request, Response } from "express";
import { createOrder, getOrders } from "../services/order.service";

export async function createOrderController(
  req: Request,
  res: Response
) {
  try {
    const { product, quantity } = req.body;

    if (!product || typeof product !== "string" || product.trim() === "") {
      return res.status(400).json({ error: "Product name is required and must be a string" });
    }

    if (quantity === undefined || typeof quantity !== "number" || quantity <= 0 || !Number.isInteger(quantity)) {
      return res.status(400).json({ error: "Quantity must be a positive integer" });
    }

    const result = await createOrder({ product: product.trim(), quantity });

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