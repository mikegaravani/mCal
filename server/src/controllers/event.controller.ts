import { Request, Response, NextFunction } from "express";
import Event from "../models/event.model";
import { timeMachineService } from "../services/timeMachineService";

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

    const events = await Event.find({ user: userId });

    const expandedEvents = events.flatMap((event) => {
      const occurrences = [];

      // One-time event
      if (!event.recurrence || !event.recurrence.frequency) {
        if (event.startTime >= start && event.startTime <= end) {
          occurrences.push({
            ...event.toObject(),
            start: event.startTime,
            end: event.endTime,
          });
        }
        return occurrences;
      }

      // Daily recurrence only for now TODO CHANGE
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
              ...event.toObject(),
              startTime: new Date(current),
              endTime: eventEnd,
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

      return occurrences;
    });

    res.status(200).json(expandedEvents);
  } catch (error) {
    next(error);
  }
};
