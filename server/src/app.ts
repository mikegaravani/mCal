import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.route";
import noteRoutes from "./routes/note.route";

dotenv.config();

const app = express();
app.use(express.json());

// Register routes
app.use("/api/auth", authRoutes);
// Note routes
app.use("/api/notes", noteRoutes);

// Last
app.use(errorHandler);

export default app;
