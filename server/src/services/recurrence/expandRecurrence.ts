import { IEvent } from "../../models/event.model";
import { Types } from "mongoose";
import { ensureOriginalInstanceIncluded } from "./recurrenceHelpers";
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
        allDay: event.isAllDay,
        description: event.description,
        location: event.location,
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
          allDay: event.isAllDay,
          description: event.description,
          location: event.location,
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
              allDay: event.isAllDay,
              description: event.description,
              location: event.location,
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

  return occurrences;
}
