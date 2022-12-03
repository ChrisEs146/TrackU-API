import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import userRoutes from "./routes/users.js";
import projectRoutes from "./routes/projects.js";
import updateRoutes from "./routes/updates.js";
import { errorHandler } from "./middleware/error.js";
import { connectionDB } from "./DBconnection/connection.js";
import { specs } from "./utils/swagger.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
connectionDB();

app.use(cookieParser());
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(express.json({ limit: "30mb", extended: true }));

app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/updates", updateRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(errorHandler);

export default app;
