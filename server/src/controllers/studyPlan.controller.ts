import { Request, Response, NextFunction } from "express";
import StudyPlan from "../models/studyPlan.model";
import { timeMachineService } from "../services/timeMachineService";

// CREATE A NEW STUDY PLAN
export const createStudyPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user._id;
    const {
      title,
      description,
      date,
      focusTime,
      breakTime,
      cycles,
      dragToNextDay,
    } = req.body;

    const now = timeMachineService.getNow();

    const studyPlan = new StudyPlan({
      user: userId,
      title,
      description,
      date,
      focusTime,
      breakTime,
      cycles,
      dragToNextDay: dragToNextDay ?? false,
      createdAt: now,
      updatedAt: now,
    });

    await studyPlan.save();
    res.status(201).json(studyPlan);
  } catch (error) {
    next(error);
  }
};

// GET ALL USER STUDY PLANS
export const getUserStudyPlans = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user._id;
    const plans = await StudyPlan.find({ user: userId }).sort({ date: 1 });
    res.status(200).json(plans);
  } catch (error) {
    next(error);
  }
};

// GET A SINGLE STUDY PLAN
export const getStudyPlanById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user._id;
    const plan = await StudyPlan.findById(req.params.id);

    if (!plan || !plan.user.equals(userId)) {
      res.status(404).json({ message: "Study plan not found" });
      return;
    }

    res.status(200).json(plan);
  } catch (error) {
    next(error);
  }
};

// UPDATE A STUDY PLAN
export const updateStudyPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user._id;
    const plan = await StudyPlan.findById(req.params.id);

    if (!plan || !plan.user.equals(userId)) {
      res.status(404).json({ message: "Study plan not found" });
      return;
    }

    const {
      title,
      description,
      date,
      focusTime,
      breakTime,
      cycles,
      dragToNextDay,
      isCompleted,
    } = req.body;

    plan.title = title ?? plan.title;
    plan.description = description ?? plan.description;
    plan.date = date ?? plan.date;
    plan.focusTime = focusTime ?? plan.focusTime;
    plan.breakTime = breakTime ?? plan.breakTime;
    plan.cycles = cycles ?? plan.cycles;
    plan.dragToNextDay = dragToNextDay ?? plan.dragToNextDay;
    plan.isCompleted = isCompleted ?? plan.isCompleted;
    plan.updatedAt = timeMachineService.getNow();

    await plan.save();
    res.status(200).json(plan);
  } catch (error) {
    next(error);
  }
};

// DELETE A STUDY PLAN
export const deleteStudyPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = res.locals.user._id;
    const plan = await StudyPlan.findById(req.params.id);

    if (!plan || !plan.user.equals(userId)) {
      res.status(404).json({ message: "Study plan not found" });
      return;
    }

    await plan.deleteOne();
    res.status(200).json({ message: "Study plan deleted successfully" });
  } catch (error) {
    next(error);
  }
};
