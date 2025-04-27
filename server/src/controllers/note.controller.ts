import { Request, Response, NextFunction } from "express";
import Note from "../models/note.model";
import { timeMachineService } from "../services/timeMachineService";

// CREATE A NEW NOTE
export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, content, categories, color, starred } = req.body;
    const userId = res.locals.user;

    const now = timeMachineService.getNow();

    const note = new Note({
      user: userId,
      title,
      content,
      categories,
      color,
      starred,
      createdAt: now,
      updatedAt: now,
    });
    await note.save();
    res.status(201).json(note);
    return;
  } catch (error) {
    next(error);
  }
};

// GET ALL USER NOTES
export const getUserNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = res.locals.user;

    const notes = await Note.find({ user: user._id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

// GET A SINGLE NOTE
export const getNoteById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = res.locals.user;
    const note = await Note.findById(req.params.id);

    if (!note || !note.user.equals(user._id)) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    res.status(200).json(note);
    return;
  } catch (error) {
    next(error);
  }
};

// UPDATE A NOTE
export const updateNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = res.locals.user;
    const note = await Note.findById(req.params.id);

    if (!note || !note.user.equals(user._id)) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    const { title, content, categories, color, starred } = req.body;

    note.title = title ?? note.title;
    note.content = content ?? note.content;
    note.categories = categories ?? note.categories;
    if (req.body.hasOwnProperty("color")) {
      note.color = color;
    }
    if (req.body.hasOwnProperty("starred")) {
      note.starred = starred;
    }
    note.updatedAt = timeMachineService.getNow();

    await note.save();
    res.status(200).json(note);
    return;
  } catch (error) {
    next(error);
  }
};

// DELETE A NOTE
export const deleteNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = res.locals.user;
    const note = await Note.findById(req.params.id);

    if (!note || !note.user.equals(user._id)) {
      res.status(404).json({ message: "Note not found" });
      return;
    }

    await note.deleteOne();
    res.status(200).json({ message: "Note deleted successfully" });
    return;
  } catch (error) {
    next(error);
  }
};
