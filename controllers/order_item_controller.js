import Order from "../models/Order.js";
import { orderItemOrderCreator } from "./order_controller.js";
import OrderItem from "../models/OrderItem.js";
import mongoose from "mongoose";
import { toFixed } from "./food_controller.js";

async function itemsByOrder(id) {
  try {
    const matchStage = { $match: { order_id: id } };
    const lookupStage = {
      $lookup: {
        from: "order",
        localField: "orderId",
        foreignField: "orderId",
        as: "order",
      },
    };
    const unwindStage = {
      $unwind: {
        path: "$order",
        preserveNullAndEmptyArrays: true,
      },
    };

    const lookupFoodStage = {
      $lookup: {
        from: "food",
        localField: "foodId",
        foreignField: "foodId",
        as: "food",
      },
    };
    const unwindFoodStage = {
      $unwind: {
        path: "$food",
        preserveNullAndEmptyArrays: true,
      },
    };

    const lookupTableStage = {
      $lookup: {
        from: "table",
        localField: "order.tableId",
        foreignField: "tableId",
        as: "table",
      },
    };
    const unwindTableStage = {
      $unwind: {
        path: "$table",
        preserveNullAndEmptyArrays: true,
      },
    };

    //PROJECT STAGE
    const projectStage = {
      $project: {
        _id: 0,
        amount: "$food.price",
        totalCount: 1,
        foodName: "$food.name",
        foodImage: "$food.foodImage",
        tableNumber: "$table.tableNumber",
        tableId: "$table.tableId",
        orderId: "$order.orderId",
        quantity: 1,
      },
    };

    //GROUP STAGE
    const groupStage = {
      $group: {
        _id: {
          orderId: "$orderId",
          tableId: "$tableId",
          tableNumber: "$tableNumber",
        },
        paymentDue: { $sum: "$amount" },
        totalCount: { $sum: 1 },
        orderItems: { $push: "$$ROOT" },
      },
    };

    //SECOND PROJECT STAGE
    const secondProjectStage = {
      $project: {
        _id: 0,
        paymentDue: 1,
        totalCount: 1,
        tableNumber: "$tableNumber",
        orderItems: 1,
      },
    };

    //MONGO AGGREGATION
    const result = await OrderItem.aggregate([
      matchStage,
      lookupStage,
      unwindStage,
      lookupFoodStage,
      unwindFoodStage,
      lookupTableStage,
      unwindTableStage,
      projectStage,
      groupStage,
      secondProjectStage,
    ]);

    return result;
  } catch (err) {
    throw new Error(
      "An error occurred in itemsByOrder function: " + err.message,
    );
  }
}

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

export const getOrderItemsByOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await itemsByOrder(orderId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderItem = async (req, res) => {
  try {
    const orderItem = req.body;
    const { orderItemId } = req.params;

    const filter = { orderItemId: orderItemId };

    const updateObj = {};

    if (orderItem.unitPrice) {
      updateObj.unitPrice = orderItem.unitPrice;
    }

    if (orderItem.quantity) {
      updateObj.quantity = orderItem.quantity;
    }

    if (orderItem.foodId) {
      updateObj.foodId = orderItem.foodId;
    }

    updateObj.updatedAt = new Date();

    const result = await OrderItem.updateOne(filter, { $set: updateObj });

    const msg = `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`;

    res.status(200).json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
