import { Router } from "express";
import {
  createEvent,
  getUserEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getExpandedEvents,
  deleteAllUserEvents,
} from "../controllers/event.controller";
import { authenticateToken } from "../middlewares/authToken.middleware";

const router = Router();

router.use(authenticateToken);

router.post("/", createEvent);

router.get("/expanded", getExpandedEvents);

router.get("/", getUserEvents);
router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.delete("/", deleteAllUserEvents);

export default router;
