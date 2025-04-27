import { Request, Response, NextFunction } from "express";
import Task from "../models/task.model";
import { timeMachineService } from "../services/timeMachineService";

// CREATE A NEW TASK
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user;
    const { title, description, dueDate, priority } = req.body;

    const now = timeMachineService.getNow();

    const task = new Task({
      user: userId,
      title,
      description,
      dueDate,
      priority,
      createdAt: now,
      updatedAt: now,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// GET ALL USER TASKS
export const getUserTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user._id;
    const tasks = await Task.find({ user: userId }).sort({ dueDate: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// GET A SINGLE TASK
export const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user._id;
    const task = await Task.findById(req.params.id);

    if (!task || !task.user.equals(userId)) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// UPDATE A TASK
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user._id;
    const task = await Task.findById(req.params.id);

    if (!task || !task.user.equals(userId)) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const { title, description, dueDate, isCompleted, priority } = req.body;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.dueDate = dueDate ?? task.dueDate;
    task.isCompleted = isCompleted ?? task.isCompleted;
    task.priority = priority ?? task.priority;
    task.updatedAt = timeMachineService.getNow();

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// DELETE A TASK
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user._id;
    const task = await Task.findById(req.params.id);

    if (!task || !task.user.equals(userId)) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    await task.deleteOne();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};
