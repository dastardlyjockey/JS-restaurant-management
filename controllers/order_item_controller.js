import Order from "../models/Order.js";
import { orderItemOrderCreator } from "./order_controller.js";
import OrderItem from "../models/OrderItem.js";
import mongoose from "mongoose";
import { toFixed } from "./food_controller.js";

const createOrderItem = async (req, res) => {
  try {
    const { tableId, orderItems } = req.body;
    const order = new Order();
    order.tableId = tableId;

    const orderId = orderItemOrderCreator(order);

    const orderItemToBeInserted = [];

    for (const item of orderItems) {
      const orderItem = new OrderItem(item);
      const objectId = new mongoose.Types.ObjectId();

      orderItem.orderId = orderId;
      orderItem._id = objectId;
      orderItem.orderItemId = objectId.toHexString();
      const num = toFixed(orderItem.unitPrice, 2);
      orderItem.unitPrice = num;

      orderItemToBeInserted.push(orderItem);
    }

    const result = await OrderItem.insertMany(orderItemToBeInserted);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderItems = async (req, res) => {
  try {
    const result = await OrderItem.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderItemById = async (req, res) => {
  try {
    const { orderItemId } = req.params;
    const result = await OrderItem.findOne({ orderItemId });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
