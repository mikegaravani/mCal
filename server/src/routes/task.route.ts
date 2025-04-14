import { Router } from "express";
import {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { authenticateToken } from "../middlewares/authToken.middleware";

const router = Router();

router.use(authenticateToken);

router.post("/", createTask);
router.get("/", getUserTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
