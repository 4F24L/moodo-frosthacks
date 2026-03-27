import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import * as adminController from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

// Admin analytics endpoints
router.get("/summary", adminController.getSummary);
router.get("/user-growth", adminController.getUserGrowth);
router.get("/mood-trend", adminController.getMoodTrend);
router.get("/at-risk-users", adminController.getAtRiskUsers);
router.get("/all-users", adminController.getAllUsers);

export default router;
