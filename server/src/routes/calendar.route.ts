import { Router } from "express";
import { getAllCalendarItems } from "../controllers/calendar.controller";
import { authenticateToken } from "../middlewares/authToken.middleware";

const router = Router();

router.use(authenticateToken);

router.get("/", getAllCalendarItems);

export default router;
