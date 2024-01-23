import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    orderDate: {
      type: Date,
      validate: true,
    },
    tableId: {
      type: String,
      validate: true,
    },
    orderId: {
      type: String,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
