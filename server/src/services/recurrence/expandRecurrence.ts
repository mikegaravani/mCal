import { IEvent } from "../../models/event.model";
import { Types } from "mongoose";
import {
  ensureOriginalInstanceIncluded,
  getNthWeekdayOfMonth,
} from "./recurrenceHelpers";
import { ExpandedEvent } from "../../types/ExpandedEvent";

export function expandEvent(
  event: IEvent,
  rangeStart: Date,
  rangeEnd: Date
): ExpandedEvent[] {
  const occurrences: ExpandedEvent[] = [];

  // NO RECURRENCE
  if (!event.recurrence || !event.recurrence.frequency) {
    if (event.endTime >= rangeStart && event.startTime <= rangeEnd) {
      occurrences.push({
        id: (event._id as Types.ObjectId).toString(),
        title: event.title,
        startTime: event.startTime,
        endTime: event.endTime,
        isAllDay: event.isAllDay,
        description: event.description,
        location: event.location,
        recurrence: event.recurrence,
        notify: event.notify,
        user: event.user,
      });
    }
    return occurrences;
  }

  // DAILY RECURRENCE
  if (event.recurrence.frequency === "daily") {
    const interval = event.recurrence.frequencyInterval || 1;
    const allOccurrences: ExpandedEvent[] = [];

    let current = new Date(event.startTime);
    let count = 0;

    while (true) {
      const occurrenceEnd = new Date(
        current.getTime() +
          (event.endTime.getTime() - event.startTime.getTime())
      );

      if (
        event.recurrence.untilDate &&
        current > new Date(event.recurrence.untilDate)
      ) {
        break;
      }

      if (
        !event.recurrence.endless &&
        event.recurrence.untilNumber &&
        count >= event.recurrence.untilNumber
      ) {
        break;
      }

      allOccurrences.push({
        id: (event._id as Types.ObjectId).toString(),
        title: event.title,
        startTime: new Date(current),
        endTime: occurrenceEnd,
        isAllDay: event.isAllDay,
        description: event.description,
        location: event.location,
        recurrence: event.recurrence,
        notify: event.notify,
        user: event.user,
      });

      count++;
      current.setDate(current.getDate() + interval);
      if (current > rangeEnd) break;
    }

    const filtered = allOccurrences.filter(
      (occ) => occ.endTime >= rangeStart && occ.startTime <= rangeEnd
    );

    ensureOriginalInstanceIncluded(event, filtered, rangeStart, rangeEnd);

    occurrences.push(...filtered);
  }

  // WEEKLY RECURRENCE
  if (event.recurrence.frequency === "weekly") {
    const daysOfWeek = event.recurrence.weekly?.daysOfWeek ?? [];
    if (!daysOfWeek.length) return occurrences;

    const interval = event.recurrence.frequencyInterval || 1;
    const allOccurrences: ExpandedEvent[] = [];

    let count = 0;

    let currentWeekStart = new Date(event.startTime);
    currentWeekStart.setHours(0, 0, 0, 0);
    currentWeekStart.setDate(
      currentWeekStart.getDate() - currentWeekStart.getDay()
    );

    while (true) {
      for (let i = 0; i < 7; i++) {
        const day = new Date(currentWeekStart);
        day.setDate(currentWeekStart.getDate() + i);

        if (daysOfWeek.includes(day.getDay())) {
          const occurrenceStart = new Date(day);
          occurrenceStart.setHours(
            event.startTime.getHours(),
            event.startTime.getMinutes()
          );

          const occurrenceEnd = new Date(
            occurrenceStart.getTime() +
              (event.endTime.getTime() - event.startTime.getTime())
          );

          if (
            event.recurrence.untilDate &&
            occurrenceStart > new Date(event.recurrence.untilDate)
          ) {
            const filtered = allOccurrences.filter(
              (occ) => occ.endTime >= rangeStart && occ.startTime <= rangeEnd
            );
            ensureOriginalInstanceIncluded(
              event,
              filtered,
              rangeStart,
              rangeEnd
            );
            return filtered;
          }

          if (
            !event.recurrence.endless &&
            event.recurrence.untilNumber &&
            count >= event.recurrence.untilNumber
          ) {
            ensureOriginalInstanceIncluded(
              event,
              allOccurrences,
              event.startTime,
              event.endTime
            );
            // The second to last occurrence would make untilNumber exceed
            // because the last occurrence was the missing OG one
            if (allOccurrences.length > event.recurrence.untilNumber) {
              if (allOccurrences.length >= 2) {
                allOccurrences.splice(allOccurrences.length - 2, 1);
              }
            }
            const filtered = allOccurrences.filter(
              (occ) => occ.endTime >= rangeStart && occ.startTime <= rangeEnd
            );
            return filtered;
          }

          if (occurrenceStart >= event.startTime) {
            allOccurrences.push({
              id: (event._id as Types.ObjectId).toString(),
              title: event.title,
              startTime: occurrenceStart,
              endTime: occurrenceEnd,
              isAllDay: event.isAllDay,
              description: event.description,
              location: event.location,
              recurrence: event.recurrence,
              notify: event.notify,
              user: event.user,
            });

            count++;
          }

          if (occurrenceStart > rangeEnd) {
            const filtered = allOccurrences.filter(
              (occ) => occ.endTime >= rangeStart && occ.startTime <= rangeEnd
            );
            ensureOriginalInstanceIncluded(
              event,
              filtered,
              rangeStart,
              rangeEnd
            );
            return filtered;
          }
        }
      }

      currentWeekStart.setDate(currentWeekStart.getDate() + 7 * interval);
    }
  }

  // MONTHLY RECURRENCE
  if (event.recurrence.frequency === "monthly") {
    const monthly = event.recurrence.monthly;
    if (!monthly) return occurrences;

    const interval = event.recurrence.frequencyInterval || 1;
    const allOccurrences: ExpandedEvent[] = [];

    let count = 0;
    let current = new Date(event.startTime);
    current.setDate(1);

    while (true) {
      let occurrenceStart: Date | null = null;

      if (monthly.repeatBy === "day-of-month" && monthly.dayOfMonth) {
        occurrenceStart = new Date(
          current.getFullYear(),
          current.getMonth(),
          monthly.dayOfMonth
        );
      }

      if (
        monthly.repeatBy === "day-position" &&
        monthly.positionInMonth &&
        monthly.dayOfWeek !== undefined
      ) {
        occurrenceStart = getNthWeekdayOfMonth(
          current.getFullYear(),
          current.getMonth(),
          monthly.dayOfWeek,
          monthly.positionInMonth
        );
      }

      if (occurrenceStart) {
        occurrenceStart.setHours(
          event.startTime.getHours(),
          event.startTime.getMinutes()
        );

        const occurrenceEnd = new Date(
          occurrenceStart.getTime() +
            (event.endTime.getTime() - event.startTime.getTime())
        );

        if (
          event.recurrence.untilDate &&
          occurrenceStart > new Date(event.recurrence.untilDate)
        ) {
          break;
        }

        if (
          !event.recurrence.endless &&
          event.recurrence.untilNumber &&
          count >= event.recurrence.untilNumber
        ) {
          ensureOriginalInstanceIncluded(
            event,
            allOccurrences,
            event.startTime,
            event.endTime
          );

          if (allOccurrences.length > event.recurrence.untilNumber) {
            allOccurrences.splice(allOccurrences.length - 2, 1);
          }
          break;
        }

        if (occurrenceStart >= event.startTime) {
          allOccurrences.push({
            id: (event._id as Types.ObjectId).toString(),
            title: event.title,
            startTime: occurrenceStart,
            endTime: occurrenceEnd,
            isAllDay: event.isAllDay,
            description: event.description,
            location: event.location,
            recurrence: event.recurrence,
            notify: event.notify,
            user: event.user,
          });

          count++;
        }

        if (occurrenceStart > rangeEnd) {
          break;
        }
      }

      current.setMonth(current.getMonth() + interval);
    }

    const filtered = allOccurrences.filter(
      (occ) => occ.endTime >= rangeStart && occ.startTime <= rangeEnd
    );

    ensureOriginalInstanceIncluded(event, filtered, rangeStart, rangeEnd);

    occurrences.push(...filtered);
  }

  // YEARLY RECURRENCE
  if (event.recurrence.frequency === "yearly") {
    const yearly = event.recurrence.yearly;
    if (!yearly) return occurrences;

    const interval = event.recurrence.frequencyInterval || 1;
    const allOccurrences: ExpandedEvent[] = [];

    let count = 0;
    let currentYear = event.startTime.getFullYear();

    while (true) {
      let occurrenceStart: Date | null = null;

      if (yearly.repeatBy === "specific-date" && yearly.day && yearly.month) {
        occurrenceStart = new Date(currentYear, yearly.month - 1, yearly.day);
      }

      if (
        yearly.repeatBy === "relative-date" &&
        yearly.positionInMonth &&
        yearly.dayOfWeek !== undefined &&
        yearly.month
      ) {
        occurrenceStart = getNthWeekdayOfMonth(
          currentYear,
          yearly.month - 1,
          yearly.dayOfWeek,
          yearly.positionInMonth
        );
      }

      if (occurrenceStart) {
        occurrenceStart.setHours(
          event.startTime.getHours(),
          event.startTime.getMinutes()
        );

        const occurrenceEnd = new Date(
          occurrenceStart.getTime() +
            (event.endTime.getTime() - event.startTime.getTime())
        );

        if (
          event.recurrence.untilDate &&
          occurrenceStart > new Date(event.recurrence.untilDate)
        ) {
          break;
        }

        if (
          !event.recurrence.endless &&
          event.recurrence.untilNumber &&
          count >= event.recurrence.untilNumber
        ) {
          ensureOriginalInstanceIncluded(
            event,
            allOccurrences,
            event.startTime,
            event.endTime
          );

          if (allOccurrences.length > event.recurrence.untilNumber) {
            allOccurrences.splice(allOccurrences.length - 2, 1);
          }
          break;
        }

        if (occurrenceStart >= event.startTime) {
          allOccurrences.push({
            id: (event._id as Types.ObjectId).toString(),
            title: event.title,
            startTime: occurrenceStart,
            endTime: occurrenceEnd,
            isAllDay: event.isAllDay,
            description: event.description,
            location: event.location,
            recurrence: event.recurrence,
            notify: event.notify,
            user: event.user,
          });

          count++;
        }

        if (occurrenceStart > rangeEnd) {
          break;
        }
      }

      currentYear += interval;
    }

    const filtered = allOccurrences.filter(
      (occ) => occ.endTime >= rangeStart && occ.startTime <= rangeEnd
    );

    ensureOriginalInstanceIncluded(event, filtered, rangeStart, rangeEnd);
    occurrences.push(...filtered);
  }

  return occurrences;
}
