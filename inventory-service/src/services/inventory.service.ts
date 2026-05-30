import { Inventory } from "../models/inventory.model";
import { producer } from "../config/kafka";

export async function getAllInventory() { return await Inventory.find({}); }

export async function updateInventory(order: any) {
  const quantity = Number(order.quantity);
  if (isNaN(quantity) || quantity <= 0) {
    console.error("Invalid order quantity for inventory update:", order.quantity);
    return;
  }

  // 1. Ensure the product exists, upsert with default stock 10 if not present
  let item: any = await Inventory.findOneAndUpdate(
    { product: order.product },
    { $setOnInsert: { stock: 10 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // 2. Atomically replenish stock if it is insufficient
  if (item.stock < quantity) {
    console.log("Not enough stock for", order.product, "Replenishing stock.");
    item = await Inventory.findOneAndUpdate(
      { product: order.product },
      { $inc: { stock: 100 } },
      { new: true }
    );
  }

  // 3. Atomically deduct the quantity
  const updatedItem: any = await Inventory.findOneAndUpdate(
    { product: order.product },
    { $inc: { stock: -quantity } },
    { new: true }
  );

  if (!updatedItem) return;

  await producer.send({
    topic: "inventory.updated",
    messages: [{ value: JSON.stringify({ orderId: order._id, type: "INVENTORY_UPDATED", service: "Inventory Service", timestamp: new Date(), payload: { product: updatedItem.product, newStock: updatedItem.stock } }) }]
  });
}
