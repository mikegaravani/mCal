import { IEvent } from "../../models/event.model";
import { Types } from "mongoose";
import { ExpandedEvent } from "../../types/ExpandedEvent";

// Ensures the OG is included in the event recurrence, adds it if not
export function ensureOriginalInstanceIncluded(
  event: IEvent,
  occurrences: ExpandedEvent[],
  rangeStart: Date,
  rangeEnd: Date
): void {
  const isIncluded = occurrences.some(
    (occ) => occ.startTime.getTime() === event.startTime.getTime()
  );

  if (
    !isIncluded &&
    event.startTime >= rangeStart &&
    event.startTime <= rangeEnd
  ) {
    occurrences.push({
      id: (event._id as Types.ObjectId).toString(),
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      isAllDay: event.isAllDay,
      description: event.description,
      location: event.location,

      recurrence: event.recurrence,
    });
  }
}

// Gets the correct day of the month for the recurrence
export function getNthWeekdayOfMonth(
  year: number,
  month: number,
  dayOfWeek: string,
  position: "first" | "second" | "third" | "fourth" | "last"
): Date | null {
  const dates: Date[] = [];

  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday

    const matches =
      dayOfWeek === "day" ||
      (dayOfWeek === "weekday" && day >= 1 && day <= 5) ||
      (dayOfWeek === "weekend" && (day === 0 || day === 6)) ||
      (dayOfWeek === "sunday" && day === 0) ||
      (dayOfWeek === "monday" && day === 1) ||
      (dayOfWeek === "tuesday" && day === 2) ||
      (dayOfWeek === "wednesday" && day === 3) ||
      (dayOfWeek === "thursday" && day === 4) ||
      (dayOfWeek === "friday" && day === 5) ||
      (dayOfWeek === "saturday" && day === 6);

    if (matches) {
      dates.push(new Date(date));
    }

    date.setDate(date.getDate() + 1);
  }

  if (!dates.length) return null;

  if (position === "last") return dates.at(-1) ?? null;

  const posIndex = { first: 0, second: 1, third: 2, fourth: 3 }[position];
  return dates[posIndex] ?? null;
}
