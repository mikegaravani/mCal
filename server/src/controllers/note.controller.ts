import { Request, Response, NextFunction } from "express";
import Note from "../models/note.model";

// CREATE A NEW NOTE
export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, content, categories } = req.body;
    const userId = res.locals.user;

    const note = new Note({
      user: userId,
      title,
      content,
      categories,
    });
    await note.save();
    res.status(201).json(note);
    return;
  } catch (error) {
    next(error);
  }
};
