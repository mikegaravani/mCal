import cron from "node-cron";
import { rollStudyPlansToToday } from "../services/cron/rollStudyPlans";

export function startStudyPlanRolloverCron() {
  // Run daily at 12:10 AM (local server time)
  cron.schedule("25 0 * * *", async () => {
    await rollStudyPlansToToday();
  });

  console.log("📘 StudyPlan rollover cron started (daily at 00:10)");
}
