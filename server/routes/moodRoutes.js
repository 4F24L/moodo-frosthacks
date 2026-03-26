import { Router } from "express";
import {
  analyzeMood,
  getMoodHistory,
  getLatestMood,
  getMoodTrend,
  getDashboard,
  analyzeSentimentText,
  getAlerts,
  acknowledgeAlert,
  processAudio,
} from "../controllers/moodController.js";
import protect from "../middleware/authMiddleware.js";
import { uploadMemory } from "../utils/uploadMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  moodAnalyzeSchema,
  textSentimentSchema,
  historyQuerySchema,
} from "../validators/moodValidator.js";

const router = Router();

// Mood endpoints
router.post("/analyze", protect, validate(moodAnalyzeSchema), analyzeMood);

// Privacy-first audio processing endpoint
// Uses memory storage - audio is never persisted to disk
router.post("/process-audio", protect, uploadMemory.single("audio"), processAudio);

router.get("/history", protect, getMoodHistory);
router.get("/latest", protect, getLatestMood);
router.get("/trend", protect, getMoodTrend);

// Dashboard
router.get("/dashboard", protect, getDashboard);

// Sentiment
router.post("/sentiment/analyze", protect, validate(textSentimentSchema), analyzeSentimentText);

// Alerts
router.get("/alerts", protect, getAlerts);
router.put("/alerts/:id/acknowledge", protect, acknowledgeAlert);

export default router;
