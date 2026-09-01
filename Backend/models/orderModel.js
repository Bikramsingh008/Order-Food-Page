import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: "Order Placed" },
    paymentMethod: { type: String, default: "COD" },
    isPaid: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    review: { type: String, default: "" },
    ratedAt: { type: Date },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
