import express from "express";
import {
  createMenu,
  getMenuById,
  getMenus,
  updateMenu,
} from "../controllers/menu_controller.js";

const router = express.Router();

//POST request
router.post("/", createMenu);

//GET request
router.get("/", getMenus);
router.get("/:menuId", getMenuById);

//PATCH request
router.patch("/:menuId", updateMenu);
export default router;
