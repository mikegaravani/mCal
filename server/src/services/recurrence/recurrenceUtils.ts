import { IEvent } from "../../models/event.model";
import { Types } from "mongoose";

export interface ExpandedEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  allDay: boolean;
  description?: string;
  location?: string;
}

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
