import Table from "../models/Table.js";
import mongoose from "mongoose";
import Order from "../models/Order.js";

export function orderItemOrderCreator(order) {
  const objectId = new mongoose.Types.ObjectId();
  const orderDate = new Date();
  new Order({
    _id: objectId,
    orderDate,
    tableId: order.tableId,
    orderId: objectId.toHexString(),
  })
    .save()
    .then((order) => {
      return order.orderId;
    });
}

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

export const updateOrder = async (req, res) => {
  try {
    const order = req.body;
    const { orderId } = req.params;
    const filter = { orderId: orderId };

    const isTableAvailable = await Table.findOne({ tableId: order.tableId });

    if (!isTableAvailable) {
      return res.status(404).json({ error: "Table is not available" });
    }

    const updateOrder = {};

    if (order.orderDate) {
      updateOrder.orderDate = order.orderDate;
    }

    updateOrder.updateAt = new Date();

    const result = await Order.updateOne(filter, { $set: updateOrder });
    const msg = `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`;
    res.status(200).json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
