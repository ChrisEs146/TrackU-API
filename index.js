import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
dotenv.config({ path: "./config.env" });

const app = express();
app.use(cors());
app.use(express.json());

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

app.use("/user", userRoutes);

const DB_CONNECTION = process.env.MONGO_URL;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, console.log(`Server running on port ${PORT}`)))
  .catch((error) => console.error(error));
