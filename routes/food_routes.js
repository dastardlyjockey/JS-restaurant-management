import express from "express";
import {
  createFood,
  getFoods,
  updateFood,
} from "../controllers/food_controller.js";

const router = express.Router();

// POST request
router.post("/", createFood);

// GET request
router.get("/", getFoods);
router.get("/:foodId", getFoods);

// PATCH request
router.patch("/:foodId", updateFood);

export default router;
