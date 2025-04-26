import { Router } from "express";
import {
  getCurrentTime,
  setCustomTime,
  resetTime,
} from "../controllers/timeMachine.controller";

const router = Router();

router.get("/", getCurrentTime);
router.post("/", setCustomTime);
router.post("/reset", resetTime);

export default router;
