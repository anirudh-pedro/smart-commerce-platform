import mongoose, { Document } from "mongoose";

export interface IOrder extends Document {
  product: string;
  quantity: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema(
  {
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, default: "CREATED" },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
