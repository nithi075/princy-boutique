import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number
    }
  ],
  totalAmount: Number,
  status: { type: String, default: "Pending" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
