import { Request, Response, NextFunction } from "express";
import Event, { IEvent } from "../models/event.model";
import { timeMachineService } from "../services/timeMachineService";
import { ensureOriginalInstanceIncluded } from "../services/recurrence/recurrenceUtils";
import mongoose from "mongoose";

// CREATE A NEW EVENT
export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user;

    const now = timeMachineService.getNow();

    let {
      title,
      startTime,
      endTime,
      isAllDay,
      location,
      recurrence,
      description,
    } = req.body;

    if (recurrence && !recurrence.frequency) {
      console.warn("Discarding invalid recurrence:", recurrence);
      recurrence = undefined;
    }

    const event = new Event({
      user: userId,
      title,
      startTime,
      endTime,
      isAllDay,
      location,
      recurrence,
      description,
      createdAt: now,
      updatedAt: now,
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

// GET ALL USER EVENTS
export const getUserEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user._id;

    const events = await Event.find({ user: userId }).sort({ startTime: 1 });
    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

// GET A SINGLE EVENT
export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user._id;
    const event = await Event.findById(req.params.id);

    if (!event || !event.user.equals(userId)) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

// UPDATE AN EVENT
export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user._id;
    const event = await Event.findById(req.params.id);

    if (!event || !event.user.equals(userId)) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    const {
      title,
      startTime,
      endTime,
      isAllDay,
      location,
      recurrence,
      description,
    } = req.body;

    event.title = title ?? event.title;
    event.startTime = startTime ?? event.startTime;
    event.endTime = endTime ?? event.endTime;
    event.isAllDay = isAllDay ?? event.isAllDay;
    event.location = location ?? event.location;
    event.description = description ?? event.description;

    if (req.body.hasOwnProperty("recurrence")) {
      if (recurrence && !recurrence.frequency) {
        console.warn("Discarding invalid recurrence on update:", recurrence);
        event.recurrence = undefined;
      } else {
        event.recurrence = recurrence;
      }
    }

    event.updatedAt = timeMachineService.getNow();

    await event.save();
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

// DELETE AN EVENT
export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user._id;
    const event = await Event.findById(req.params.id);

    if (!event || !event.user.equals(userId)) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// RECURRENCE ADD-ON

// GET EXPANDED EVENTS (including recurring ones)
export const getExpandedEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user._id;

    const start = new Date(req.query.start as string);
    const end = new Date(req.query.end as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ message: "Invalid date range" });
      return;
    }

    const events: IEvent[] = await Event.find({ user: userId });

    const expandedEvents = events.flatMap((event) => {
      const occurrences = [];

      // One-time event
      if (!event.recurrence || !event.recurrence.frequency) {
        if (event.endTime >= start && event.startTime <= end) {
          occurrences.push({
            id: (event._id as mongoose.Types.ObjectId).toString(),
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

      // DAILY RECURRENCE
      if (event.recurrence.frequency === "daily") {
        const interval = event.recurrence.frequencyInterval || 1;
        let current = new Date(event.startTime);
        let count = 0;

        while (current <= end) {
          const eventEnd = new Date(
            current.getTime() +
              (event.endTime.getTime() - event.startTime.getTime())
          );

          if (eventEnd >= start && current <= end) {
            occurrences.push({
              id: (event._id as mongoose.Types.ObjectId).toString(),
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

      // WEEKLY RECURRENCE
      if (event.recurrence.frequency === "weekly") {
        const interval = event.recurrence.frequencyInterval || 1;
        const daysOfWeek = event.recurrence.weekly?.daysOfWeek ?? [];
        if (!daysOfWeek.length) return occurrences;

        let count = 0;
        let currentWeekStart = new Date(event.startTime);
        // Start of week normalization
        currentWeekStart.setHours(0, 0, 0, 0);
        currentWeekStart.setDate(
          currentWeekStart.getDate() - currentWeekStart.getDay()
        );

        while (currentWeekStart <= end) {
          for (let i = 0; i < 7; i++) {
            const day = new Date(currentWeekStart);
            day.setDate(currentWeekStart.getDate() + i);

            if (day > end) break;

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
                occurrenceEnd >= start &&
                occurrenceStart <= end &&
                (!event.recurrence.untilDate ||
                  occurrenceStart <= new Date(event.recurrence.untilDate))
              ) {
                occurrences.push({
                  id: (event._id as mongoose.Types.ObjectId).toString(),
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
                  return occurrences;
                }
              }
            }
          }

          // Jump ahead N weeks
          currentWeekStart.setDate(currentWeekStart.getDate() + 7 * interval);
        }

        ensureOriginalInstanceIncluded(event, occurrences, start, end);
      }

      return occurrences;
    });

    res.status(200).json(expandedEvents);
  } catch (error) {
    next(error);
  }
};
