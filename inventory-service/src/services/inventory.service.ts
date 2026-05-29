import { Inventory } from "../models/inventory.model";
import { producer } from "../config/kafka";

export async function getAllInventory() { return await Inventory.find({}); }

export async function updateInventory(order: any) {
  let item = await Inventory.findOne({ product: order.product });
  if (!item) { item = await Inventory.create({ product: order.product, stock: 10 }); }
  if (item.stock < order.quantity) {
    console.log("Not enough stock for", order.product);
    return;
  }
  item.stock -= order.quantity;
  await item.save();
  await producer.send({
    topic: "inventory.updated",
    messages: [{ value: JSON.stringify({ orderId: order._id, type: "INVENTORY_UPDATED", service: "Inventory Service", timestamp: new Date(), payload: { product: item.product, newStock: item.stock } }) }]
  });
}
