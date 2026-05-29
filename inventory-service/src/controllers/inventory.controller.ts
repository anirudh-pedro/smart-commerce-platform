import { Request, Response } from "express";
import { getAllInventory } from "../services/inventory.service";

export async function getInventoryController(req: Request, res: Response) {
  try {
    const inventory = await getAllInventory();
    
    // Transform to expected output format
    const formattedInventory = inventory.map(item => ({
      product: item.product,
      stock: item.stock
    }));

    res.json(formattedInventory);
  } catch (error) {
    console.error("Failed to fetch inventory", error);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
}