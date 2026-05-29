import { Inventory } from "../models/inventory.model";

export async function updateInventory(order: any) {
  let item = await Inventory.findOne({
    product: order.product,
  });

  if (!item) {
    item = await Inventory.create({
      product: order.product,
      stock: 10,
    });
  }

  if (item.stock < order.quantity) {
    console.log("Not enough stock");

    return;
  }

  item.stock -= order.quantity;

  await item.save();

  console.log("Inventory Updated");
  console.log(`Remaining Stock: ${item.stock}`);
}