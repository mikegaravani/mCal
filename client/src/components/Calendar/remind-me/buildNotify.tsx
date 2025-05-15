import { RemindOptions, Reminder } from "@/components/Calendar/types/reminders";

export function buildNotifyFromRemindOptions(
  options: RemindOptions,
  startTime: Date
): { enabled: boolean; reminders: Reminder[] } | undefined {
  if (!options) return;

  let minutesBefore = 0;

  if (options.mode === "before") {
    const unitMap = { minutes: 1, hours: 60, days: 1440 };
    minutesBefore =
      (options.beforeValue ?? 0) * unitMap[options.beforeUnit ?? "minutes"];
  } else {
    const offsetMap = {
      "event-day": 0,
      "day-before": -1,
      "two-days-before": -2,
      "week-before": -7,
    };

    const dateOffset = offsetMap[options.dayOption ?? "event-day"];
    const baseDate = new Date(startTime);
    baseDate.setDate(baseDate.getDate() + dateOffset);

    const hour12 = options.hour12 ?? 9;
    const minute = options.minute ?? 0;
    const ampm = options.ampm ?? "am";

    const hour24 = (hour12 % 12) + (ampm === "pm" && hour12 !== 12 ? 12 : 0);
    baseDate.setHours(hour24, minute, 0, 0);

    minutesBefore = Math.round(
      (startTime.getTime() - baseDate.getTime()) / 60000
    );
  }

  const reminder: Reminder = {
    minutesBefore,
  };

  if (options.repeat.enabled) {
    reminder.repeat = true;
    reminder.repeatInterval =
      (options.repeat.everyValue ?? 5) *
      (options.repeat.everyUnit === "hours" ? 60 : 1);

    if (options.repeat.stopMode === "count") {
      reminder.repeatCount = options.repeat.countValue ?? 3;
    }
  } else {
    reminder.repeat = false;
  }

  return {
    enabled: true,
    reminders: [reminder],
  };
}
