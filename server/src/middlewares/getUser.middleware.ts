import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

export async function getUser(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = await User.findById(req.params.id).exec();

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.locals.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
