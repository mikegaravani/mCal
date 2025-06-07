import { startOfDay, endOfDay } from "date-fns";

import Event from "../../models/event.model";
import { expandEvent } from "../../services/recurrence/expandRecurrence";
import { sendEventReminderEmail } from "../../services/emails/senders/sendEventReminderEmail";
import User from "../../models/user.model";

const MAX_REMINDER_MINUTES_BEFORE = 32 * 24 * 60; // 32 days

export async function runRemindersForEntireDay(targetDate: Date) {
  const dayStart = startOfDay(targetDate);
  const dayEnd = endOfDay(targetDate);

  const windowStart = new Date(
    dayStart.getTime() - MAX_REMINDER_MINUTES_BEFORE * 60_000
  );
  const windowEnd = new Date(dayEnd.getTime() + 7 * 24 * 60 * 60 * 1000);

  console.log(
    `[Reminder runner] Running all reminders for ${targetDate
      .toISOString()
      .slice(0, 10)}`
  );

  try {
    const dbEvents = await Event.find({
      "notify.enabled": true,
      startTime: { $gte: windowStart, $lte: windowEnd },
    });

    const occurrences = dbEvents.flatMap((event) =>
      expandEvent(event, windowStart, windowEnd).map((occ) => ({
        ...occ,
        id: event._id,
        user: event.user,
      }))
    );

    for (const occ of occurrences) {
      if (!occ.notify?.enabled) continue;

      for (const reminder of occ.notify.reminders) {
        const sends: number[] = [];

        const firstSend =
          occ.startTime.getTime() - reminder.minutesBefore * 60_000;
        sends.push(firstSend);

        if (reminder.repeat && reminder.repeatInterval) {
          const maxRepeatCount =
            reminder.repeatCount ??
            Math.floor(reminder.minutesBefore / reminder.repeatInterval);

          for (let i = 1; i < maxRepeatCount; i++) {
            const offsetMinutes =
              reminder.minutesBefore - i * reminder.repeatInterval;
            if (offsetMinutes <= 0) break;

            const sendTime = occ.startTime.getTime() - offsetMinutes * 60_000;
            sends.push(sendTime);
          }
        }

        for (const sendAtMs of sends) {
          // Only send reminders due on the target date
          if (sendAtMs < dayStart.getTime() || sendAtMs > dayEnd.getTime())
            continue;

          const minutesBeforeThisSend = Math.round(
            (occ.startTime.getTime() - sendAtMs) / 60_000
          );

          const alreadySent = occ.notify.sent?.some(
            (s) =>
              s.minutesBefore === minutesBeforeThisSend &&
              new Date(s.occurrenceStartTime).getTime() ===
                occ.startTime.getTime()
          );
          if (alreadySent) continue;

          const user = await User.findById(occ.user);
          if (!user?.email) continue;

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
                  sentAt: new Date(sendAtMs),
                  occurrenceStartTime: occ.startTime,
                },
              },
            }
          );

          console.log(
            `[Reminder] "${occ.title}" → ${user.username} - ${user.email} (${minutesBeforeThisSend} min before)`
          );
        }
      }
    }
  } catch (err) {
    console.error("[Reminder runner] error:", err);
  }
}
