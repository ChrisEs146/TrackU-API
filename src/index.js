import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.js";
import userRoutes from "./routes/users.js";
import projectRoutes from "./routes/projects.js";
import updateRoutes from "./routes/updates.js";
dotenv.config({ path: "./config.env" });

const app = express();
app.use(cookieParser());
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(express.json({ limit: "30mb", extended: true }));

app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/updates", updateRoutes);

const DB_CONNECTION = process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;

app.use(errorHandler);

mongoose
  .connect(DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, console.log(`Server running on port ${PORT}`)))
  .catch((error) => console.error(error));
