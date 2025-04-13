import { Router } from "express";
import {
  createNote,
  getUserNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/note.controller";
import { authenticateToken } from "../middlewares/authToken.middleware";

const router = Router();

router.use(authenticateToken);

router.post("/", createNote);
router.get("/", getUserNotes);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
