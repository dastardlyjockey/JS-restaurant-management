import express from "express";
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from "../controllers/order_controller.js";

const router = express.Router();

//POST
router.post("/", createOrder);

//GET
router.get("/", getOrders);
router.get("/:orderId", getOrderById);

//PATCH
router.patch("/:orderId", updateOrder);

export default router;
