import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import userRoutes from "./routes/users.js";
import projectRoutes from "./routes/projects.js";
import updateRoutes from "./routes/updates.js";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.js";
import { connectionDB } from "./DBconnection/connection.js";
import { specs } from "./utils/swagger.js";
import { corsOptions } from "./utils/corsOptions.js";

const app = express();
connectionDB();

app.use(helmet());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({ limit: "30mb", extended: true }));

app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/updates", updateRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.get("/", (req, res) => res.send("Please, access the documentation at /api-docs"));

app.use(errorHandler);

export default app;
