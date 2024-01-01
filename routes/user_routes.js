import express from "express";
import { getUserById, getUsers } from "../controllers/user_controller.js";

const router = express.Router();

/* READ */
router.get("/", getUsers);
router.get("/:Id", getUserById);

export default router;
