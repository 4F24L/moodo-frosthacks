import * as alertService from "../services/alert.service.js";
import * as moodService from "../services/mood.service.js";

/**
 * POST /mood/analyze
 * Analyze mood from voice features
 */
export const analyzeMood = async (req, res, next) => {
  try {
    const { features, text } = req.body;

    const moodEntry = await moodService.createMoodEntry(
      req.user._id,
      features,
      text,
    );

    // Check for alerts
    const entries = await moodService.getMoodHistory(req.user._id, 7, 10);
    const alert = await alertService.createAlertIfNeeded(req.user._id, entries);

    res.status(201).json({
      success: true,
      data: {
        text: moodEntry.text,
        source: moodEntry.source,
        mood_score: moodEntry.moodScore,
        normalized_score: moodEntry.normalizedScore,
        mood_label: moodEntry.moodLabel,
        insight: moodEntry.insight,
        confidence: moodEntry.confidenceScore,
        features: moodEntry.features,
        sentiment: moodEntry.sentiment,
        timestamp: moodEntry.timestamp,
        alert: alert
          ? { id: alert._id, type: alert.type, message: alert.message }
          : null,
      },
    });
  } catch (err) {
    next(err);
  }
};
