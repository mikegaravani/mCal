import { Router } from "express";
import { createNote } from "../controllers/note.controller";
import { authenticateToken } from "../middlewares/authToken.middleware";

const router = Router();

router.use(authenticateToken);

router.post("/", createNote);

export default router;
