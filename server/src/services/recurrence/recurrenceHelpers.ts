import { IEvent } from "../../models/event.model";
import { Types } from "mongoose";
import { ExpandedEvent } from "../../types/ExpandedEvent";

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
      allDay: event.isAllDay,
      description: event.description,
      location: event.location,
    });
  }
}

export function getNthWeekdayOfMonth(
  year: number,
  month: number,
  weekday: string,
  position: "first" | "second" | "third" | "fourth" | "last"
): Date | null {
  const weekdayMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const dayIndex = weekdayMap[weekday as keyof typeof weekdayMap];
  if (dayIndex === undefined) return null;

  const dates: Date[] = [];

  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    if (date.getDay() === dayIndex) {
      dates.push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }

  if (position === "last") return dates.at(-1) ?? null;

  const posIndex = { first: 0, second: 1, third: 2, fourth: 3 }[position];
  return dates[posIndex] ?? null;
}
