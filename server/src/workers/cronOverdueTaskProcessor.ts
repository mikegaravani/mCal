import cron from "node-cron";

import Task from "../models/task.model";
import User from "../models/user.model";
import { sendTaskOverdueEmail } from "../services/emails/senders/sendTaskOverdueEmail";
import { timeMachineService } from "../services/timeMachineService";

export function startOverdueTaskCron() {
  // Runs daily at 3 PM SERVER TIME
  cron.schedule("0 15 * * *", async () => {
    const now = timeMachineService.getNow();
    console.log(`[Overdue Task Cron] Tick at ${now.toISOString()}`);

    try {
      const overdueTasks = await Task.find({
        isCompleted: false,
        overdueReminders: true,
        dueDate: { $lt: now },
      });

      for (const task of overdueTasks) {
        const user = await User.findById(task.user);
        if (!user || !user.email) {
          console.warn(`No user/email found for task ${task._id}`);
          continue;
        }

        const daysOverdue = Math.floor(
          (now.getTime() - (task.dueDate?.getTime() || now.getTime())) /
            (1000 * 60 * 60 * 24)
        );

        await sendTaskOverdueEmail(
          user.email,
          task.title,
          task.dueDate!,
          daysOverdue
        );

        console.log(
          `[Overdue Reminder] "${task.title}" → ${user.username} (${daysOverdue} days overdue)`
        );
      }
    } catch (err) {
      console.error("[Overdue Task Cron] error:", err);
    }
  });

  console.log("📌 Overdue task cron started (daily)");
}
