import { Request, Response, NextFunction } from "express";
import Event from "../models/event.model";

// CREATE A NEW EVENT
export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user;
    const { title, startTime, endTime, isAllDay, location, recurrence } =
      req.body;

    const event = new Event({
      user: userId,
      title,
      startTime,
      endTime,
      isAllDay,
      location,
      recurrence,
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

    const { title, startTime, endTime, isAllDay, location, recurrence } =
      req.body;

    event.title = title ?? event.title;
    event.startTime = startTime ?? event.startTime;
    event.endTime = endTime ?? event.endTime;
    event.isAllDay = isAllDay ?? event.isAllDay;
    event.location = location ?? event.location;
    event.recurrence = recurrence ?? event.recurrence;

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
