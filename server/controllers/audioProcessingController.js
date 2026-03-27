import { analyzeVoiceBuffer } from "../services/aiService.js";
import * as alertService from "../services/alert.service.js";
import * as moodService from "../services/mood.service.js";
import * as trendService from "../services/trend.service.js";

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
    const aiResult = await analyzeVoiceBuffer(audioBuffer, filename, text);

    // Discard audio buffer reference (privacy)
    req.file.buffer = null;

    // Transform AI response to mood entry
    const moodEntry = await moodService.createMoodEntryFromAI(
      req.user._id,
      aiResult,
    );

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
        source: "voice",
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
        alert: alert
          ? {
              id: alert._id,
              type: alert.type,
              message: alert.message,
              severity: alert.severity,
            }
          : null,
      },
    });
  } catch (err) {
    next(err);
  }
};
