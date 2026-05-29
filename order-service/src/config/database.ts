import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    product: String,
    quantity: Number,
    status: {
      type: String,
      default: "CREATED",
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model(
  "Order",
  orderSchema
);