import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.route";
import noteRoutes from "./routes/note.route";
import eventRoutes from "./routes/event.route";
import taskRoutes from "./routes/task.route";
import calendarRoutes from "./routes/calendar.route";

dotenv.config();

const app = express();
app.use(express.json());

// Register routes
app.use("/api/auth", authRoutes);
// Note routes
app.use("/api/notes", noteRoutes);
// Event routes
app.use("/api/events", eventRoutes);
// Task routes
app.use("/api/tasks", taskRoutes);
// Calendar (events + tasks) routes TODO add pomo and other minor stuff
app.use("/api/calendar", calendarRoutes);

// Last
app.use(errorHandler);

export default app;
