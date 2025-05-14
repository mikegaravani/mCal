import { Request, Response, NextFunction } from "express";
import Event from "../models/event.model";
import { timeMachineService } from "../services/timeMachineService";
import { expandEvent } from "../services/recurrence/expandRecurrence";

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
      notify,
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
      notify,
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
      notify,
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

    if (req.body.hasOwnProperty("notify")) {
      const notify = req.body.notify;
      if (
        notify &&
        typeof notify === "object" &&
        Array.isArray(notify.reminders) &&
        typeof notify.enabled === "boolean"
      ) {
        event.notify = notify;
      } else {
        console.warn("Discarding invalid notify on update:", notify);
        event.notify = undefined;
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

// DELETE ALL USER EVENTS
export const deleteAllUserEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user._id;

    const result = await Event.deleteMany({ user: userId });

    res.status(200).json({
      message: "All events deleted successfully",
      deletedCount: result.deletedCount,
    });
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
    // BIG LOGIC for daily-weekly-montly-yearly recurrence
    const expandedEvents = events.flatMap((event) =>
      expandEvent(event, start, end)
    );

    res.status(200).json(expandedEvents);
  } catch (error) {
    next(error);
  }
};
