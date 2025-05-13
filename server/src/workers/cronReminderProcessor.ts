import cron from "node-cron";

import Event from "../models/event.model";
import { expandEvent } from "../services/recurrence/expandRecurrence";
import { timeMachineService } from "../services/timeMachineService";
import { sendEventReminderEmail } from "../services/emails/senders/sendEventReminderEmail";
import User from "../models/user.model";

const LOOKAHEAD_MINUTES = 1;
const TOLERANCE_MS = 30_000;

export function startReminderCron() {
  // Every minute, at 0 seconds
  cron.schedule("* * * * *", async () => {
    const now = timeMachineService.getNow();
    const windowEnd = new Date(now.getTime() + LOOKAHEAD_MINUTES * 60_000);

    console.log(`[Reminder cron] Tick at ${now.toISOString()}`);

    try {
      const dbEvents = await Event.find({
        "notify.enabled": true,
        startTime: { $lte: windowEnd },
      });

      const occurrences = dbEvents.flatMap((event) =>
        expandEvent(event, now, windowEnd).map((occ) => ({
          ...occ,
          id: event._id,
          user: event.user,
        }))
      );

      for (const occ of occurrences) {
        if (!occ.notify?.enabled) {
          continue;
        }

        for (const reminder of occ.notify.reminders) {
          const firstSend =
            occ.startTime.getTime() - reminder.minutesBefore * 60_000;

          const sends: number[] = [];
          sends.push(firstSend);

          if (
            reminder.repeat &&
            reminder.repeatInterval &&
            reminder.repeatCount
          ) {
            for (let i = 1; i < reminder.repeatCount; i++) {
              sends.push(
                occ.startTime.getTime() -
                  (reminder.minutesBefore - i * reminder.repeatInterval) *
                    60_000
              );
            }
          }

          for (const sendAtMs of sends) {
            const diff = Math.abs(sendAtMs - now.getTime());
            if (diff > TOLERANCE_MS) continue; // skip this tick

            const minutesBeforeThisSend = Math.round(
              (occ.startTime.getTime() - sendAtMs) / 60_000
            );

            // Skip if reminder was alreadt sent
            const alreadySent = occ.notify.sent?.some(
              (s) =>
                s.minutesBefore === minutesBeforeThisSend &&
                new Date(s.occurrenceStartTime).getTime() ===
                  occ.startTime.getTime()
            );
            if (alreadySent) continue;

            const user = await User.findById(occ.user);
            if (!user || !user.email) {
              console.warn(`No user/email found for event ${occ.id}`);
              continue;
            }

            await sendEventReminderEmail(
              user.email,
              occ.title,
              occ.startTime,
              occ.location,
              minutesBeforeThisSend
            );

            await Event.updateOne(
              { _id: occ.id },
              {
                $push: {
                  "notify.sent": {
                    minutesBefore: minutesBeforeThisSend,
                    sentAt: now,
                    occurrenceStartTime: occ.startTime,
                  },
                },
              }
            );

            console.log(
              `[Reminder] "${occ.title}" → ${user.username} - ${user.email} (${minutesBeforeThisSend} min before)`
            );
          }
        }
      }
    } catch (err) {
      console.error("[Reminder cron] error:", err);
    }
  });

  console.log("🔔 Reminder cron started (every minute)");
}
