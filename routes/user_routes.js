import express from "express";
import { getUsers } from "../controllers/user_controller.js";

const router = express.Router();

/* READ */
router.get("/", getUsers);

export default router;
