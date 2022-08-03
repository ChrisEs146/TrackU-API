import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
dotenv.config({ path: "./config.env" });

const app = express();
app.use(cors());
app.use("/user", userRoutes);
