import mongoose from "mongoose";
import app from "./app";
import { startReminderCron } from "./workers/cronReminderProcessor";

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI as string;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    startReminderCron();

    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
