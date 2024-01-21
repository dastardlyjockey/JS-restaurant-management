import express from "express";
import {
  createTable,
  getTableById,
  getTables,
  updateTable,
} from "../controllers/table_controller.js";

const router = express.Router();

//POST request
router.post("/", createTable);

//GET request
router.get("/", getTables);
router.get("/:tableId", getTableById);

//PATCH request
router.patch("/:tableId", updateTable);

export default router;
