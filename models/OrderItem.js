import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    quantity: {
      type: String,
      required: true,
    },
    unityPrice: {
      type: Number,
      required: true,
    },
    foodId: {
      type: String,
      required: true,
    },
    orderItemId: String,
    orderId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const OrderItem = mongoose.model("orderItem", orderItemSchema);
export default OrderItem;
