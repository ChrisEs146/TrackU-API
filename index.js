import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/error.js";
dotenv.config({ path: "./config.env" });

import userRoutes from "./routes/users.js";
import projectRoutes from "./routes/projects.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use("/user", userRoutes);
app.use("/projects", projectRoutes);

const DB_CONNECTION = process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;

app.use(errorHandler);

mongoose
  .connect(DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, console.log(`Server running on port ${PORT}`)))
  .catch((error) => console.error(error));
