import { Router } from "express";
import {
  createStudyPlan,
  getUserStudyPlans,
  getStudyPlanById,
  updateStudyPlan,
  deleteStudyPlan,
} from "../controllers/studyPlan.controller";
import { authenticateToken } from "../middlewares/authToken.middleware";

const router = Router();

router.use(authenticateToken);

router.post("/", createStudyPlan);
router.get("/", getUserStudyPlans);
router.get("/:id", getStudyPlanById);
router.put("/:id", updateStudyPlan);
router.delete("/:id", deleteStudyPlan);

export default router;
