import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getCurrentUser,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import { validate, registerSchema, loginSchema } from "../middleware/validate.js";

const router = Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/logout", logoutUser);
router.get("/refresh", refreshToken);
router.get("/me", protect, getCurrentUser);

export default router;
