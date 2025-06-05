import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.route";
import noteRoutes from "./routes/note.route";
import eventRoutes from "./routes/event.route";
import taskRoutes from "./routes/task.route";
import calendarRoutes from "./routes/calendar.route";
import studyPlanRoutes from "./routes/studyPlan.route";
import timeMachineRoutes from "./routes/timeMachine.route";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Register routes
app.use("/api/auth", authRoutes);
// Note routes
app.use("/api/notes", noteRoutes);
// Event routes
app.use("/api/events", eventRoutes);
// Task routes
app.use("/api/tasks", taskRoutes);
// Calendar (events + tasks) routes
app.use("/api/calendar", calendarRoutes);
// Study Plan routes
app.use("/api/study-plan", studyPlanRoutes);
// Time machine routes
app.use("/api/time-machine", timeMachineRoutes);

// Last
app.use(errorHandler);

export default app;
