import * as moodService from "../services/mood.service.js";
import * as trendService from "../services/trend.service.js";
import * as alertService from "../services/alert.service.js";
import { analyzeSentiment } from "../services/sentiment.service.js";
import { analyzeVoiceBuffer } from "../services/aiService.js";

/**
 * POST /mood/analyze
 * Analyze mood from voice features
 */
export const analyzeMood = async (req, res, next) => {
  try {
    const { features, text } = req.body;

    const moodEntry = await moodService.createMoodEntry(req.user._id, features, text);

    // Check for alerts
    const entries = await moodService.getMoodHistory(req.user._id, 7, 10);
    const alert = await alertService.createAlertIfNeeded(req.user._id, entries);

    res.status(201).json({
      success: true,
      data: {
        text: moodEntry.text,
        mood_score: moodEntry.moodScore,
        normalized_score: moodEntry.normalizedScore,
        mood_label: moodEntry.moodLabel,
        insight: moodEntry.insight,
        confidence: moodEntry.confidenceScore,
        features: moodEntry.features,
        sentiment: moodEntry.sentiment,
        timestamp: moodEntry.timestamp,
        alert: alert ? { id: alert._id, type: alert.type, message: alert.message } : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /mood/process-audio
 * Privacy-first audio processing pipeline
 * 
 * Flow:
 * 1. Validate audio file exists and is valid MIME type
 * 2. Store audio TEMPORARILY in memory (no disk persistence)
 * 3. Call AI service with audio + optional text
 * 4. Immediately discard audio buffer (privacy)
 * 5. Transform AI response and store only structured data in DB
 * 6. Run trend and alert analysis
 * 7. Return mood score, trend, and alert status
 * 
 * Privacy: audio is processed and immediately discarded
 */
export const processAudio = async (req, res, next) => {
  try {
    // Validate audio file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required",
      });
    }

    const { text } = req.body;
    const audioBuffer = req.file.buffer;
    const filename = req.file.originalname;

    // Call AI service with audio buffer
    // Privacy: audio is processed and immediately discarded
    const aiResult = await analyzeVoiceBuffer(audioBuffer, filename, text);

    // Discard audio buffer reference
    // Privacy: audio is processed and immediately discarded
    req.file.buffer = null;

    // Transform AI response to mood entry
    const moodEntry = await moodService.createMoodEntryFromAI(req.user._id, aiResult);

    // Get recent entries for trend and alert analysis
    const entries = await moodService.getMoodHistory(req.user._id, 7, 10);

    // Analyze trend
    const trend = trendService.getTrendSummary(entries);

    // Check for alerts
    const alert = await alertService.createAlertIfNeeded(req.user._id, entries);

    res.status(201).json({
      success: true,
      data: {
        text: moodEntry.text,
        mood_score: moodEntry.moodScore,
        normalized_score: moodEntry.normalizedScore,
        mood_label: moodEntry.moodLabel,
        insight: moodEntry.insight,
        confidence: moodEntry.confidenceScore,
        features: moodEntry.features,
        sentiment: moodEntry.sentiment,
        timestamp: moodEntry.timestamp,
        trend: trend.trend,
        fluctuation: trend.fluctuation,
        alert: alert ? {
          id: alert._id,
          type: alert.type,
          message: alert.message,
          severity: alert.severity,
        } : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /mood/history
 * Get mood history
 */
export const getMoodHistory = async (req, res, next) => {
  try {
    const { range = "7d", limit = 20 } = req.query;
    const rangeInDays = parseInt(range) || 7;

    const entries = await moodService.getMoodHistory(req.user._id, rangeInDays, limit);

    res.status(200).json({ success: true, data: entries });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /mood/latest
 * Get latest mood entry
 */
export const getLatestMood = async (req, res, next) => {
  try {
    const entry = await moodService.getLatestMood(req.user._id);

    res.status(200).json({ success: true, data: entry });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /mood/trend
 * Get mood trend analysis
 */
export const getMoodTrend = async (req, res, next) => {
  try {
    const entries = await moodService.getMoodHistory(req.user._id, 7, 10);
    const trend = trendService.getTrendSummary(entries);

    res.status(200).json({ success: true, data: trend });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /dashboard
 * Get dashboard data
 */
export const getDashboard = async (req, res, next) => {
  try {
    const { range = "7d" } = req.query;
    const rangeInDays = parseInt(range) || 7;

    const stats = await moodService.getMoodStats(req.user._id, rangeInDays);
    const trend = trendService.getTrendSummary(stats.entries);
    const alerts = await alertService.getActiveAlerts(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        entries: stats.entries,
        averageMood: stats.averageMood,
        minMood: stats.minMood,
        maxMood: stats.maxMood,
        entryCount: stats.entryCount,
        trend: trend.trend,
        fluctuation: trend.fluctuation,
        trendMessage: trend.message,
        activeAlerts: alerts.length,
        alerts: alerts.slice(0, 3),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /sentiment/analyze
 * Analyze sentiment from text
 */
export const analyzeSentimentText = async (req, res, next) => {
  try {
    const { text } = req.body;

    const result = analyzeSentiment(text);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /alerts
 * Get active alerts
 */
export const getAlerts = async (req, res, next) => {
  try {
    const alerts = await alertService.getActiveAlerts(req.user._id);

    res.status(200).json({ success: true, data: alerts });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /alerts/:id/acknowledge
 * Acknowledge an alert
 */
export const acknowledgeAlert = async (req, res, next) => {
  try {
    const { id } = req.params;

    const alert = await alertService.acknowledgeAlert(id);

    res.status(200).json({ success: true, data: alert });
  } catch (err) {
    next(err);
  }
};
