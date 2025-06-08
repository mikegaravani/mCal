import { Router } from "express";
import { verifyPassword } from "../controllers/admin.controller";

const router = Router();

router.post("/verify-password", verifyPassword);

export default router;
