import Table from "../models/Table.js";
import mongoose from "mongoose";
import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    const { orderDate, tableId } = req.body;
    const isTableAvailable = await Table.findOne({ tableId });

    if (!isTableAvailable) {
      return res.status(404).json({ error: "Table is not available" });
    }

    const objectId = new mongoose.Types.ObjectId();

    const order = new Order({
      _id: objectId,
      orderDate,
      tableId,
      orderId: objectId.toHexString(),
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const result = await Order.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await Order.findOne({ orderId });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
