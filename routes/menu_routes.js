import express from "express";
import { createMenu } from "../controllers/menu_controller.js";

const router = express.Router();

//POST request
router.post("/", createMenu);

export default router;
