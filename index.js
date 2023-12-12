import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { register, login } from "./controllers/auth_controller.js";

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

/* AUTHENTICATION AND ROUTES */
app.post("/auth/register", register);
app.post("/auth/login", login);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on Port: ${PORT}`));
  })
  .catch((err) => console.log(`Error connecting to the database: ${err} `));
