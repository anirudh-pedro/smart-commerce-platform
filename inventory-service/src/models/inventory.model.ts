import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
    unique: true,
  },

  stock: {
    type: Number,
    required: true,
    default: 10,
  },
});

export const Inventory = mongoose.model(
  "Inventory",
  inventorySchema
);