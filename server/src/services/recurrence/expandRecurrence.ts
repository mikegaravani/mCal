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
      });
    }
    return occurrences;
  }

  const interval = event.recurrence.frequencyInterval || 1;

  // DAILY RECURRENCE
  if (event.recurrence.frequency === "daily") {
    let current = new Date(event.startTime);
    let count = 0;

    while (current <= rangeEnd) {
      const eventEnd = new Date(
        current.getTime() +
          (event.endTime.getTime() - event.startTime.getTime())
      );

      if (eventEnd >= rangeStart && current <= rangeEnd) {
        occurrences.push({
          id: (event._id as Types.ObjectId).toString(),
          title: event.title,
          startTime: new Date(current),
          endTime: eventEnd,
          isAllDay: event.isAllDay,
          description: event.description,
          location: event.location,
          recurrence: event.recurrence,
        });
      }

      count++;
      if (!event.recurrence.endless) {
        if (
          event.recurrence.untilNumber &&
          count >= event.recurrence.untilNumber
        )
          break;
        if (
          event.recurrence.untilDate &&
          current > new Date(event.recurrence.untilDate)
        )
          break;
      }

      current.setDate(current.getDate() + interval);
    }
  }

  // WEEKLY RECURRENCE
  if (event.recurrence.frequency === "weekly") {
    const daysOfWeek = event.recurrence.weekly?.daysOfWeek ?? [];
    if (!daysOfWeek.length) return occurrences;

    let count = 0;
    let currentWeekStart = new Date(event.startTime);
    currentWeekStart.setHours(0, 0, 0, 0);
    currentWeekStart.setDate(
      currentWeekStart.getDate() - currentWeekStart.getDay()
    );

    while (currentWeekStart <= rangeEnd) {
      for (let i = 0; i < 7; i++) {
        const day = new Date(currentWeekStart);
        day.setDate(currentWeekStart.getDate() + i);

        if (day > rangeEnd) break;

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
            occurrenceStart >= event.startTime &&
            occurrenceEnd >= rangeStart &&
            occurrenceStart <= rangeEnd &&
            (!event.recurrence.untilDate ||
              occurrenceStart <= new Date(event.recurrence.untilDate))
          ) {
            occurrences.push({
              id: (event._id as Types.ObjectId).toString(),
              title: event.title,
              startTime: occurrenceStart,
              endTime: occurrenceEnd,
              isAllDay: event.isAllDay,
              description: event.description,
              location: event.location,
              recurrence: event.recurrence,
            });

            count++;
            if (
              !event.recurrence.endless &&
              event.recurrence.untilNumber &&
              count >= event.recurrence.untilNumber
            ) {
              // Ensure the last occurrence is included
              ensureOriginalInstanceIncluded(
                event,
                occurrences,
                rangeStart,
                rangeEnd
              );

              // The untilNumber is exceeded if we added the OG occurrence
              if (occurrences.length > event.recurrence.untilNumber) {
                if (occurrences.length >= 2) {
                  occurrences.splice(occurrences.length - 2, 1);
                }
              }

              return occurrences;
            }
          }
        }
      }

      currentWeekStart.setDate(currentWeekStart.getDate() + 7 * interval);
    }

    ensureOriginalInstanceIncluded(event, occurrences, rangeStart, rangeEnd);
  }

  // MONTHLY RECURRENCE
  if (event.recurrence.frequency === "monthly") {
    const monthly = event.recurrence.monthly;
    if (!monthly) return occurrences;

    let count = 0;
    const interval = event.recurrence.frequencyInterval || 1;

    let current = new Date(event.startTime);
    current.setDate(1); // move to start of month

    while (current <= rangeEnd) {
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
        monthly.dayOfWeek
      ) {
        occurrenceStart = getNthWeekdayOfMonth(
          current.getFullYear(),
          current.getMonth(),
          monthly.dayOfWeek,
          monthly.positionInMonth
        );
      }

      if (occurrenceStart) {
        // adding time of day
        occurrenceStart.setHours(
          event.startTime.getHours(),
          event.startTime.getMinutes()
        );
        const occurrenceEnd = new Date(
          occurrenceStart.getTime() +
            (event.endTime.getTime() - event.startTime.getTime())
        );

        if (
          occurrenceStart >= event.startTime &&
          occurrenceEnd >= rangeStart &&
          occurrenceStart <= rangeEnd &&
          (!event.recurrence.untilDate ||
            occurrenceStart <= new Date(event.recurrence.untilDate))
        ) {
          occurrences.push({
            id: (event._id as Types.ObjectId).toString(),
            title: event.title,
            startTime: occurrenceStart,
            endTime: occurrenceEnd,
            isAllDay: event.isAllDay,
            description: event.description,
            location: event.location,
            recurrence: event.recurrence,
          });

          count++;
          if (
            !event.recurrence.endless &&
            event.recurrence.untilNumber &&
            count >= event.recurrence.untilNumber
          ) {
            ensureOriginalInstanceIncluded(
              event,
              occurrences,
              rangeStart,
              rangeEnd
            );
            if (occurrences.length > event.recurrence.untilNumber) {
              occurrences.splice(occurrences.length - 2, 1);
            }
            return occurrences;
          }
        }
      }

      current.setMonth(current.getMonth() + interval);
    }

    ensureOriginalInstanceIncluded(event, occurrences, rangeStart, rangeEnd);
  }

  // YEARLY RECURRENCE
  if (event.recurrence.frequency === "yearly") {
    const yearly = event.recurrence.yearly;
    if (!yearly) return occurrences;

    let count = 0;
    const interval = event.recurrence.frequencyInterval || 1;

    let currentYear = event.startTime.getFullYear();

    while (new Date(currentYear, 0, 1) <= rangeEnd) {
      let occurrenceStart: Date | null = null;

      if (yearly.repeatBy === "specific-date" && yearly.day && yearly.month) {
        occurrenceStart = new Date(currentYear, yearly.month - 1, yearly.day);
      }

      if (
        yearly.repeatBy === "relative-date" &&
        yearly.positionInMonth &&
        yearly.dayOfWeek &&
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
          occurrenceStart >= event.startTime &&
          occurrenceEnd >= rangeStart &&
          occurrenceStart <= rangeEnd &&
          (!event.recurrence.untilDate ||
            occurrenceStart <= new Date(event.recurrence.untilDate))
        ) {
          occurrences.push({
            id: (event._id as Types.ObjectId).toString(),
            title: event.title,
            startTime: occurrenceStart,
            endTime: occurrenceEnd,
            isAllDay: event.isAllDay,
            description: event.description,
            location: event.location,
            recurrence: event.recurrence,
          });

          count++;
          if (
            !event.recurrence.endless &&
            event.recurrence.untilNumber &&
            count >= event.recurrence.untilNumber
          ) {
            ensureOriginalInstanceIncluded(
              event,
              occurrences,
              rangeStart,
              rangeEnd
            );
            if (occurrences.length > event.recurrence.untilNumber) {
              occurrences.splice(occurrences.length - 2, 1);
            }
            return occurrences;
          }
        }
      }

      currentYear += interval;
    }

    ensureOriginalInstanceIncluded(event, occurrences, rangeStart, rangeEnd);
  }

  return occurrences;
}
