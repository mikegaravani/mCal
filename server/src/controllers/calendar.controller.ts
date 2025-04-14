import { Request, Response, NextFunction } from "express";
import Event from "../models/event.model";
import Task from "../models/task.model";

// GET ALL EVENTS AND TASKS FOR USER
export const getAllCalendarItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user._id;

    const [events, tasks] = await Promise.all([
      Event.find({ user: userId }),
      Task.find({ user: userId }),
    ]);

    res.status(200).json({ events, tasks });
  } catch (error) {
    next(error);
  }
};
