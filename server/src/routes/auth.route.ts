import { Router } from "express";
import {
  registerUser,
  loginUser,
  fetchUser,
  fetchAllUsers,
  updateUser,
} from "../controllers/auth.controller";
import { getUser } from "../middlewares/getUser.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user/:id", getUser, fetchUser);
router.get("/all", fetchAllUsers);
router.patch("/update/:id", getUser, updateUser);

export default router;
