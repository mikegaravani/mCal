import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.route";

dotenv.config();

const app = express();
app.use(express.json());

// Register routes
app.use("/api/auth", authRoutes);

// Last
app.use(errorHandler);

export default app;
